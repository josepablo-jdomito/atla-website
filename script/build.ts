import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import { createRequire } from "module";
import path from "path";
import { buildImageSrcSet, getOptimizedImageUrl } from "../shared/imageDelivery.ts";
import type { Project } from "../shared/schema.ts";
import type { JournalArticle, JournalCategory } from "../shared/journal.ts";
import { CONTACT_EMAIL, DEFAULT_OG_IMAGE_URL, HOME_META_DESCRIPTION, JOURNAL_DESCRIPTION_PAD, JOURNAL_META_DESCRIPTION, JOURNAL_TITLE_SUFFIX, ORGANIZATION_LOGO_URL, ORGANIZATION_NAME, ORGANIZATION_SCHEMA, SITE_NAME, SITE_ORIGIN, formatMetaTitle } from "../shared/siteSeo.ts";
import { isJournalSanityConfigured } from "../server/sanity/journalClient.ts";
import {
  fetchJournalArticlesFromSanity,
  fetchJournalArticleBySlugFromSanity,
  fetchJournalCategoriesFromSanity,
} from "../server/sanity/journalService.ts";
import { fetchProjectsFromSanity } from "../server/sanity/projectService.ts";
import { buildArticleBreadcrumb, buildBlogPostingSchema } from "../client/src/lib/journalSeo.ts";
import { buildProjectPageView, buildProjectSeoHead } from "../client/src/lib/projectPage.ts";
import { formatJournalMetaTitle, toAbsoluteUrl } from "../client/src/lib/seoSchema.ts";
import { industryServiceSchemaForPath } from "../client/src/lib/serviceSchema.ts";
import { buildServicesStructuredData, CONTACT_PAGE_SCHEMA } from "../client/src/lib/sitePageSchema.ts";
import { siteCopy } from "../client/src/content/siteCopy.ts";
import { withSelectedWork } from "../client/src/lib/llmsTxt.ts";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

const DEFAULT_JOURNAL_CATEGORY_DESCRIPTION =
  "Notes from the Atla studio on branding, strategy and creative direction.";
const PRERENDER_REMOTE_TIMEOUT_MS = 12_000;

function ensureDescriptionLength(description: string, fallback: string) {
  const cleanDescription = description.trim();
  if (cleanDescription.length >= 130 && cleanDescription.length <= 160) return cleanDescription;
  if (cleanDescription.length > 160) {
    return `${cleanDescription.slice(0, 157).trimEnd()}...`;
  }

  const cleanFallback = fallback.trim();
  const combined = `${cleanDescription} ${cleanFallback}`.trim();
  return combined.length > 160 ? `${combined.slice(0, 157).trimEnd()}...` : combined;
}

type PrerenderRouteData = {
  projects?: Project[];
  project?: Project | null;
  articles?: JournalArticle[];
  article?: JournalArticle | null;
  categories?: JournalCategory[];
};

type PrerenderRenderer = {
  renderPrerenderedRoute: (
    pathname: string,
    data?: PrerenderRouteData,
  ) => {
    appHtml: string;
    dehydratedState: unknown;
  };
};

let prerenderRendererPromise: Promise<PrerenderRenderer> | null = null;
const require = createRequire(import.meta.url);

async function buildAll() {
  await rm("dist", { recursive: true, force: true });
  await hydrateBuildEnvFromLocalFile();

  console.log("building client...");
  await viteBuild();
  await prerenderRoutes();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function parseDotenv(content: string) {
  const env: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex);
    const rawValue = trimmed.slice(eqIndex + 1).trim();
    env[key] = rawValue.replace(/^"/, "").replace(/"$/, "");
  }

  return env;
}

async function hydrateBuildEnvFromLocalFile() {
  if (isJournalSanityConfigured()) return;

  const envPaths = [
    ".env.vercel.local",
    ".env.vercel",
    ".env.local",
  ].map((fileName) => path.resolve(fileName));

  for (const envPath of envPaths) {
    if (isJournalSanityConfigured()) return;

    try {
      const file = await readFile(envPath, "utf8");
      const env = parseDotenv(file);

      for (const [key, value] of Object.entries(env)) {
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    } catch (error) {
      const notFound = error instanceof Error && "code" in error && error.code === "ENOENT";
      if (!notFound) throw error;
    }
  }
}

const PUBLIC_SANITY_PROJECT_ID = "dvufm78f";
const PUBLIC_SANITY_DATASET = "production";

function resolvePrerenderApiOrigin() {
  const configuredOrigin = (process.env.PRERENDER_API_ORIGIN || process.env.SITE_ORIGIN || SITE_ORIGIN).trim();
  return configuredOrigin.replace(/\/+$/, "");
}

async function fetchPrerenderJson<T>(url: string, fallbackValue: T): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PRERENDER_REMOTE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status}) for ${url}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn(`[build] Failed to fetch prerender payload from ${url}:`, error);
    return fallbackValue;
  } finally {
    clearTimeout(timeout);
  }
}

async function loadPrerenderContentFromPublicApi(): Promise<{
  projects: Project[];
  articles: JournalArticle[];
  articleDetails: Record<string, JournalArticle>;
  categories: JournalCategory[];
}> {
  const origin = resolvePrerenderApiOrigin();
  console.warn(`[build] Prerender data source: remote API ${origin} (Sanity was not used).`);

  const [projectsRaw, articlesRaw, categoriesRaw] = await Promise.all([
    fetchPrerenderJson<unknown>(`${origin}/api/projects`, []),
    fetchPrerenderJson<unknown>(`${origin}/api/journal`, []),
    fetchPrerenderJson<unknown>(`${origin}/api/journal/categories`, []),
  ]);

  const projects = Array.isArray(projectsRaw) ? (projectsRaw as Project[]) : [];
  const articles = Array.isArray(articlesRaw) ? (articlesRaw as JournalArticle[]) : [];
  const categories = Array.isArray(categoriesRaw) ? (categoriesRaw as JournalCategory[]) : [];

  const articleDetails = Object.fromEntries(
    await Promise.all(
      articles.map(async (article) => {
        const detail = await fetchPrerenderJson<unknown>(`${origin}/api/journal/${article.slug}`, article);
        return [article.slug, (detail as JournalArticle) ?? article] as const;
      }),
    ),
  );

  return {
    projects,
    articles,
    articleDetails,
    categories,
  };
}

function createHeadMarkup({
  title,
  description,
  pathname,
  image,
  preloadImage,
  preloadImageSrcSet,
  preloadImageSizes,
  preloadImages,
  type = "website",
  robots = "index,follow",
  structuredData,
}: {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  preloadImage?: string;
  preloadImageSrcSet?: string;
  preloadImageSizes?: string;
  preloadImages?: Array<{
    href: string;
    srcSet?: string;
    sizes?: string;
    fetchPriority?: "high";
  }>;
  type?: string;
  robots?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  const url = `${SITE_ORIGIN}${pathname}`;
  // og:image / twitter:image must be absolute; route tables pass site paths like /figmaAssets/about-hero.jpg.
  const imageUrl = toAbsoluteUrl(image || DEFAULT_OG_IMAGE_URL);
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<meta name="robots" content="${escapeHtml(robots)}">`,
    `<link rel="canonical" href="${escapeHtml(url)}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:type" content="${escapeHtml(type)}">`,
    `<meta property="og:url" content="${escapeHtml(url)}">`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    `<meta property="og:image" content="${escapeHtml(imageUrl)}">`,
    `<meta name="twitter:image" content="${escapeHtml(imageUrl)}">`,
  ];

  const allPreloads = [
    ...(preloadImage
      ? [{
        href: preloadImage,
        srcSet: preloadImageSrcSet,
        sizes: preloadImageSizes,
      }]
      : []),
    ...(preloadImages ?? []),
  ];

  if (allPreloads.length > 0) {
    const preloadTags = allPreloads.map((preload) => {
      const preloadAttrs = [
        `rel="preload"`,
        `as="image"`,
        `href="${escapeHtml(preload.href)}"`,
      ];

      if (preload.srcSet) {
        preloadAttrs.push(`imagesrcset="${escapeHtml(preload.srcSet)}"`);
      }

      if (preload.sizes) {
        preloadAttrs.push(`imagesizes="${escapeHtml(preload.sizes)}"`);
      }

      if ("fetchPriority" in preload && preload.fetchPriority === "high") {
        preloadAttrs.push(`fetchpriority="high"`);
      }

      return `<link ${preloadAttrs.join(" ")}>`;
    });

    tags.unshift(...preloadTags.reverse());
  }

  if (structuredData) {
    const blocks = Array.isArray(structuredData) ? structuredData : [structuredData];
    for (const block of blocks) {
      tags.push(`<script type="application/ld+json">${serializeJsonForScript(block)}</script>`);
    }
  }

  return tags.join("\n    ");
}

function resolveArticleImage(article: JournalArticle) {
  const portableTextImage = article.body.find((block) => block._type === "image" && typeof block.asset?.url === "string")?.asset?.url;
  const legacyImage = article.bodySections.find((section) => Boolean(section.image))?.image
    || article.bodySections.find((section) => Boolean(section.wideImage))?.wideImage;

  return article.coverImage || article.heroImage || portableTextImage || legacyImage || DEFAULT_OG_IMAGE_URL;
}

function resolveProjectHeroImage(project: Project) {
  return project.coverImage || project.images[0] || DEFAULT_OG_IMAGE_URL;
}

function buildResponsiveImagePreload(
  src: string | undefined,
  widths: number[],
  quality: number,
  sizes: string,
) {
  if (!src || widths.length === 0) return {};

  return {
    preloadImage: getOptimizedImageUrl(src, { width: widths[widths.length - 1], quality }),
    preloadImageSrcSet: buildImageSrcSet(src, widths, { quality }),
    preloadImageSizes: sizes,
  };
}

function buildImagePreloadEntries(
  entries: Array<{
    src?: string;
    widths: number[];
    quality: number;
    sizes: string;
  }>,
) {
  return entries
    .filter((entry) => entry.src && entry.widths.length > 0)
    .map((entry) => ({
      href: getOptimizedImageUrl(entry.src, { width: entry.widths[entry.widths.length - 1], quality: entry.quality }) || entry.src!,
      srcSet: buildImageSrcSet(entry.src!, entry.widths, { quality: entry.quality }),
      sizes: entry.sizes,
    }));
}

function hydrationScriptPaths(pathname: string) {
  const relativePath = pathname === "/" ? "index.js" : `${pathname.replace(/^\//, "")}.js`;
  return {
    filePath: path.resolve("dist/public", "_hydration", relativePath),
    publicPath: `/_hydration/${relativePath}`,
  };
}

async function writeHydrationScript(pathname: string, dehydratedState: unknown) {
  const { filePath } = hydrationScriptPaths(pathname);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(
    filePath,
    `window.__ATLA_DEHYDRATED_STATE__=${serializeJsonForScript(dehydratedState)};`,
    "utf8",
  );
}

/** How many wall tiles the prerendered home preloads (red team 10: the first screen was grey slabs). */
const HOME_PRELOADS = 1;

const unescapeAttr = (value: string) => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

/**
 * Preload hints for the home: only the images the markup marks fetchpriority="high" (the first few
 * wall tiles), with the same priority. The other eager tiles are found by the parser on their own;
 * twenty hints used to compete with the CSS and JS on a phone (web quality audit 4.2).
 */
function eagerImagePreloads(html: string) {
  const entries: Array<{ href: string; srcSet?: string; sizes?: string; fetchPriority: "high" }> = [];
  // Every eager tile is fetchpriority="high" in the markup; only the first gets a preload hint (the LCP tile; more would compete for bandwidth).
  for (const tag of (html.match(/<img\b[^>]*\bfetchpriority="high"[^>]*>/g) ?? []).slice(0, HOME_PRELOADS)) {
    const attr = (name: string) => {
      const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"));
      return match ? unescapeAttr(match[1]) : undefined;
    };
    const href = attr("src");
    if (href) entries.push({ href, srcSet: attr("srcset"), sizes: attr("sizes"), fetchPriority: "high" });
  }
  return entries;
}

function replaceHead(template: string, headMarkup: string) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/<meta name="description"[^>]*>\n?/g, "")
    .replace(/<meta name="robots"[^>]*>\n?/g, "")
    .replace(/<meta property="og:title"[^>]*>\n?/g, "")
    .replace(/<meta property="og:description"[^>]*>\n?/g, "")
    .replace(/<meta property="og:type"[^>]*>\n?/g, "")
    .replace(/<meta property="og:url"[^>]*>\n?/g, "")
    .replace(/<meta property="og:site_name"[^>]*>\n?/g, "")
    .replace(/<meta property="og:image"[^>]*>\n?/g, "")
    .replace(/<meta name="twitter:[^"]+"[^>]*>\n?/g, "")
    .replace(/<link rel="canonical"[^>]*>\n?/g, "")
    .replace("</head>", `    ${headMarkup}\n  </head>`);
}

function serializeJsonForScript(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

async function loadPrerenderRenderer(): Promise<PrerenderRenderer> {
  if (prerenderRendererPromise) {
    return prerenderRendererPromise;
  }

  prerenderRendererPromise = (async () => {
    const outputPath = path.resolve("dist/.prerender/prerender.cjs");
    await mkdir(path.dirname(outputPath), { recursive: true });

    await esbuild({
      entryPoints: ["client/src/PrerenderApp.tsx"],
      bundle: true,
      format: "cjs",
      platform: "node",
      target: "node20",
      outfile: outputPath,
      jsx: "automatic",
      logLevel: "silent",
    });

    return require(outputPath) as PrerenderRenderer;
  })();

  return prerenderRendererPromise;
}

async function injectPrerenderedApp(
  template: string,
  pathname: string,
  routeData: PrerenderRouteData,
) {
  const { renderPrerenderedRoute } = await loadPrerenderRenderer();
  const { appHtml, dehydratedState } = renderPrerenderedRoute(pathname, routeData);
  const { publicPath } = hydrationScriptPaths(pathname);

  await writeHydrationScript(pathname, dehydratedState);

  // Deferred classic and module scripts run in document order. The hydration
  // script must precede the app bundle, or main.tsx renders with an empty query
  // cache, wipes the prerendered markup and refetches (CLS ~0.8 on the home).
  const hydrationTag = `<script defer src="${publicPath}"></script>`;
  // data-prerender-gate: see the #root rule in client/index.html.
  const withRoot = template.replace(
    '<div id="root"></div>',
    `<div id="root" data-prerender-gate>${appHtml}</div>`,
  );
  const moduleTag = withRoot.match(/<script type="module"[^>]*>/);

  if (!moduleTag) {
    throw new Error(`[build] App bundle <script type="module"> not found while prerendering ${pathname}`);
  }

  return withRoot.replace(moduleTag[0], `${hydrationTag}\n    ${moduleTag[0]}`);
}

async function writeRoutePage(route: string, html: string) {
  const relativePath = route === "/" ? "index.html" : path.join(route.replace(/^\//, ""), "index.html");
  const outputPath = path.resolve("dist/public", relativePath);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, "utf8");
}

function getStaticRoutePrerenderData(
  pathname: string,
  content: {
    projects: Project[];
    articles: JournalArticle[];
    categories: JournalCategory[];
  },
): PrerenderRouteData {
  // /ventures shows each venture's project cover, so its prerender carries the projects too.
  if (pathname === "/" || pathname === "/work" || pathname === "/ventures") {
    return { projects: content.projects };
  }

  if (pathname === "/journal" || pathname.startsWith("/journal/category/")) {
    return { articles: content.articles, categories: content.categories };
  }

  return {};
}

async function prerenderRoutes() {
  const templatePath = path.resolve("dist/public/index.html");
  const template = await readFile(templatePath, "utf8");
  const { projects, articles, articleDetails, categories } = await loadPrerenderContent();
  const workFeaturedProject = projects[0];
  const workFeaturedImage = workFeaturedProject ? resolveProjectHeroImage(workFeaturedProject) : DEFAULT_OG_IMAGE_URL;

  const staticRoutes = [
    {
      pathname: "/",
      title: formatMetaTitle("Atla", "Strategy-Led Branding Studio"),
      description: HOME_META_DESCRIPTION,
      image: workFeaturedImage,
      includeInSitemap: true,
      structuredData: ORGANIZATION_SCHEMA,
    },
    {
      pathname: "/ventures",
      title: formatMetaTitle("Ventures", "Atla"),
      description: "Companies Atla is involved in beyond client work.",
      includeInSitemap: true,
      structuredData: ORGANIZATION_SCHEMA,
    },
    {
      pathname: "/about",
      // Same title and description as the Why Atla page's SeoHead.
      title: formatMetaTitle(siteCopy.about.metaTitle, siteCopy.about.metaSuffix),
      description: siteCopy.about.metaDescription,
      // og:image only: the v2 About page renders no images, so nothing is preloaded.
      image: "/figmaAssets/about-hero.jpg",
      includeInSitemap: true,
      structuredData: ORGANIZATION_SCHEMA,
    },
    {
      pathname: "/contact",
      // Same title and description as the Contact page's SeoHead.
      title: formatMetaTitle(siteCopy.contact.metaTitle, siteCopy.contact.metaSuffix),
      description: siteCopy.contact.metaDescription,
      image: "/figmaAssets/about-hero.jpg",
      includeInSitemap: true,
      structuredData: CONTACT_PAGE_SCHEMA,
    },
    {
      pathname: "/brief",
      // Same title and description as the Brief page's SeoHead.
      title: formatMetaTitle(siteCopy.brief.metaTitle, "Atla"),
      description: siteCopy.brief.metaDescription,
      image: DEFAULT_OG_IMAGE_URL,
      includeInSitemap: true,
    },
    {
      pathname: "/brand-check",
      // Same title and description as the Brand check page's SeoHead.
      title: formatMetaTitle(siteCopy.brandCheck.metaTitle, "Atla"),
      description: siteCopy.brandCheck.metaDescription,
      image: DEFAULT_OG_IMAGE_URL,
      includeInSitemap: true,
    },
    {
      pathname: "/services",
      // Same title and description as the Services page's SeoHead.
      title: formatMetaTitle(siteCopy.services.metaTitle, "Atla"),
      description: siteCopy.services.metaDescription,
      image: "/figmaAssets/about-hero.jpg",
      includeInSitemap: true,
      // Same JSON-LD as the live page's SeoHead: breadcrumb + one Service per moment.
      structuredData: buildServicesStructuredData(),
    },
    {
      pathname: "/hospitality",
      title: formatMetaTitle("Hospitality", "Atla"),
      description: "Hospitality audits, rebrands and new openings for hotels, restaurants, wellness and coffee. Clients include a MICHELIN Key hotel and a MICHELIN Green Star restaurant.",
      image: workFeaturedImage,
      includeInSitemap: true,
    },
    {
      pathname: "/hospitality-branding",
      title: formatMetaTitle("Hospitality Branding Agency", "Hotels, Restaurants and Travel"),
      description: "Branding for hospitality companies that need identity systems strong enough to hold across physical spaces, digital booking flows, and guest-facing touchpoints.",
      image: workFeaturedImage,
      includeInSitemap: true,
      structuredData: industryServiceSchemaForPath("/hospitality-branding"),
    },
    {
      pathname: "/cpg-branding",
      title: formatMetaTitle("CPG Branding and Packaging Agency", "Consumer Goods"),
      description: "Brand identity and packaging design for CPG companies launching or repositioning products. Strategy-led systems that perform on shelf and screen.",
      image: workFeaturedImage,
      includeInSitemap: true,
      structuredData: industryServiceSchemaForPath("/cpg-branding"),
    },
    {
      pathname: "/wellness-branding",
      title: formatMetaTitle("Wellness and Health Brand Design Agency", "Atla"),
      description: "Brand strategy and identity for wellness, health tech and care companies. Credible, warm, and written to stay inside the rules.",
      image: workFeaturedImage,
      includeInSitemap: true,
      structuredData: industryServiceSchemaForPath("/wellness-branding"),
    },
    {
      pathname: "/saas-branding",
      title: formatMetaTitle("SaaS Branding Agency", "Brand Identity for Software Companies"),
      description: "Brand strategy and identity for SaaS companies. Positioning and digital systems for software teams that need clearer differentiation.",
      image: workFeaturedImage,
      includeInSitemap: true,
      structuredData: industryServiceSchemaForPath("/saas-branding"),
    },
    {
      pathname: "/brand-strategy",
      title: formatMetaTitle("Brand Strategy for Growing Companies", "Process and Framework"),
      description: "How brand strategy works: positioning, messaging, audience and competitive framing, decided before design starts.",
      image: workFeaturedImage,
      includeInSitemap: true,
    },
    {
      pathname: "/how-we-work",
      title: formatMetaTitle("How We Work", "Branding Process and Engagement Model"),
      description: "How Atla runs a project, step by step: read the market, talk to your people, pick the position, design the system, hand it over.",
      image: workFeaturedImage,
      includeInSitemap: true,
    },
    {
      pathname: "/programs",
      title: formatMetaTitle("Brand Programs for Companies at a Turning Point", "Atla"),
      description: "When a brand has to change, start with an audit. Then a brand system or a full build, and a fractional brand director after launch.",
      image: DEFAULT_OG_IMAGE_URL,
      includeInSitemap: true,
    },
    {
      pathname: "/journal",
      title: formatMetaTitle("Atla Journal", JOURNAL_TITLE_SUFFIX),
      description: JOURNAL_META_DESCRIPTION,
      image: articles[0] ? resolveArticleImage(articles[0]) : DEFAULT_OG_IMAGE_URL,
      includeInSitemap: true,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Atla Journal",
        url: `${SITE_ORIGIN}/journal`,
        publisher: {
          "@type": "Organization",
          name: ORGANIZATION_NAME,
          logo: {
            "@type": "ImageObject",
            url: ORGANIZATION_LOGO_URL,
          },
        },
      },
    },
    {
      pathname: "/privacy",
      title: formatMetaTitle("Atla Privacy Policy", "Website and Inquiry Data"),
      description: "How Atla handles what you send through the brief and the contact form, the analytics on the site, browser storage and the providers that process data.",
      image: DEFAULT_OG_IMAGE_URL,
      includeInSitemap: true,
    },
    {
      pathname: "/terms",
      title: formatMetaTitle("Atla Terms of Use", "Website and Content Access"),
      description: "Review the terms governing access to the Atla website, intellectual property, third-party services, and permitted use of site content.",
      image: DEFAULT_OG_IMAGE_URL,
      includeInSitemap: true,
    },
    {
      pathname: "/admin/projects",
      title: "Projects admin retired | Atla",
      description: "The legacy projects admin route has been retired. Portfolio entries are managed in Sanity Studio.",
      robots: "noindex,nofollow",
      includeInSitemap: false,
    },
  ];

  for (const route of staticRoutes) {
    const body = await injectPrerenderedApp(
      template,
      route.pathname,
      getStaticRoutePrerenderData(route.pathname, { projects, articles, categories }),
    );
    // The home preloads exactly the images its markup marks high priority, so the hints always match a real request.
    const preloadImages = route.pathname === "/" ? eagerImagePreloads(body) : route.preloadImages;
    await writeRoutePage(route.pathname, replaceHead(body, createHeadMarkup({ ...route, preloadImages })));
  }

  for (const category of categories) {
    const categoryArticles = articles.filter((article) => article.categorySlug === category.slug);
    const pathname = `/journal/category/${category.slug}`;
    const description = ensureDescriptionLength(
      category.seoDescription || category.description || DEFAULT_JOURNAL_CATEGORY_DESCRIPTION,
      JOURNAL_DESCRIPTION_PAD,
    );
    const title = formatJournalMetaTitle(category.seoTitle || `${category.title} Articles`);

    const html = await injectPrerenderedApp(
      replaceHead(
        template,
        createHeadMarkup({
          title,
          description,
          pathname,
          image: categoryArticles[0] ? resolveArticleImage(categoryArticles[0]) : DEFAULT_OG_IMAGE_URL,
          type: "website",
          structuredData: {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url: `${SITE_ORIGIN}${pathname}`,
          },
        }),
      ),
      pathname,
      {
        articles,
        categories,
      },
    );
    await writeRoutePage(pathname, html);
  }

  for (const project of projects) {
    // The Project page's own SeoHead builder (lib/projectPage.ts), so the prerendered head and the
    // hydrated one carry the same title, description and JSON-LD (CreativeWork, breadcrumb, videos).
    const seoHead = buildProjectSeoHead(buildProjectPageView(project, projects));

    const pathname = `/projects/${project.slug}`;
    const projectGalleryPreloads = buildImagePreloadEntries(
      (project.images.length > 0 ? project.images.slice(0, 2) : [resolveProjectHeroImage(project)]).map((src) => ({
        src,
        widths: [600, 900, 1200],
        quality: 82,
        sizes: "(max-width: 767px) 100vw, 50vw",
      })),
    );
    const html = await injectPrerenderedApp(
      replaceHead(
        template,
        createHeadMarkup({
          title: seoHead.title,
          description: seoHead.description,
          pathname,
          image: resolveProjectHeroImage(project),
          ...buildResponsiveImagePreload(
            resolveProjectHeroImage(project),
            [600, 900, 1200, 1400],
            84,
            "(max-width: 767px) 100vw, 55vw",
          ),
          preloadImages: projectGalleryPreloads,
          structuredData: seoHead.structuredData,
        }),
      ),
      pathname,
      {
        projects,
        project,
      },
    );
    await writeRoutePage(pathname, html);
  }

  for (const article of articles) {
    const articleDetail = articleDetails[article.slug] ?? article;
    const articleImage = resolveArticleImage(articleDetail);
    const description = ensureDescriptionLength(
      article.seoDescription || article.excerpt,
      "Read the full article from Atla Journal for practical thinking on branding, strategy, and digital craft.",
    );
    const structuredData = [
      buildBlogPostingSchema(articleDetail, { description, image: articleImage }),
      buildArticleBreadcrumb(articleDetail),
    ];

    const pathname = `/journal/${article.slug}`;
    const html = await injectPrerenderedApp(
      replaceHead(
        template,
        createHeadMarkup({
          title: formatJournalMetaTitle(article.seoTitle || article.title),
          description,
          pathname,
          image: articleImage,
          preloadImage: getOptimizedImageUrl(articleImage, { width: 1200, quality: 82 }) || articleImage,
          type: "article",
          structuredData,
        }),
      ),
      pathname,
      {
        articles,
        categories,
        article: articleDetail,
      },
    );
    await writeRoutePage(pathname, html);
  }

  const sitemapXml = createSitemapXml({
    staticPaths: staticRoutes.filter((route) => route.includeInSitemap).map((route) => route.pathname),
    projects,
    articles,
    categories,
  });
  await writeFile(path.resolve("dist/public/sitemap.xml"), sitemapXml, "utf8");

  // llms.txt ships from client/public; the featured work is added here from the same projects the prerender used.
  const llmsPath = path.resolve("dist/public/llms.txt");
  const llmsTxt = withSelectedWork(await readFile(llmsPath, "utf8"), projects);
  await writeFile(llmsPath, llmsTxt, "utf8");
  if (!llmsTxt.includes("## Selected work")) {
    console.warn("[llms.txt] no featured projects in the prerender content; Selected work was not written");
  }

  const notFoundHtml = await injectPrerenderedApp(
    replaceHead(
      template,
      createHeadMarkup({
        title: "Page not found | Atla",
        description: "The page you requested could not be found.",
        pathname: "/404",
        robots: "noindex,nofollow",
        image: projects[0]?.coverImage,
      }),
    ),
    "/404",
    {},
  );
  await writeFile(path.resolve("dist/public/404.html"), notFoundHtml, "utf8");
}

async function loadPrerenderContent(): Promise<{
  projects: Project[];
  articles: JournalArticle[];
  articleDetails: Record<string, JournalArticle>;
  categories: JournalCategory[];
}> {
  if (!isJournalSanityConfigured()) {
    // The studio's dataset is public for published documents (the same one the images are served from),
    // so a build without env files (a fresh worktree, CI) still reads live Sanity instead of the remote API.
    process.env.SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || PUBLIC_SANITY_PROJECT_ID;
    process.env.SANITY_DATASET = process.env.SANITY_DATASET || PUBLIC_SANITY_DATASET;
    console.log(`[build] No Sanity env set; reading the public dataset ${PUBLIC_SANITY_PROJECT_ID}/${PUBLIC_SANITY_DATASET} directly.`);
  }
  try {
    const [projects, articles, categories] = await Promise.all([
      fetchProjectsFromSanity(),
      fetchJournalArticlesFromSanity(),
      fetchJournalCategoriesFromSanity(),
    ]);

    const articleDetails = Object.fromEntries(
      await Promise.all(
        articles.map(async (article) => {
          const detail = await fetchJournalArticleBySlugFromSanity(article.slug);
          return [article.slug, detail ?? article] as const;
        }),
      ),
    );

    console.log(
      `[build] Prerender data source: Sanity (${projects.length} projects, ${articles.length} articles, ${categories.length} categories).`,
    );
    return {
      projects,
      articles,
      articleDetails,
      categories,
    };
  } catch (error) {
    console.warn("[build] Sanity unreachable; using the remote prerender API fallback.", error);
    return loadPrerenderContentFromPublicApi();
  }
}

function createSitemapXml({
  staticPaths,
  projects,
  articles,
  categories,
}: {
  staticPaths: string[];
  projects: Project[];
  articles: JournalArticle[];
  categories: JournalCategory[];
}) {
  const urls = [
    ...staticPaths,
    ...projects.map((project) => `/projects/${project.slug}`),
    ...articles.map((article) => `/journal/${article.slug}`),
    ...categories.map((category) => `/journal/category/${category.slug}`),
  ]
    .filter((value, index, all) => all.indexOf(value) === index)
    .map((pathname) => `  <url>\n    <loc>${SITE_ORIGIN}${pathname}</loc>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
