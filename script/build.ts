import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import { createRequire } from "module";
import path from "path";
import { buildImageSrcSet, getOptimizedImageUrl } from "../shared/imageDelivery.ts";
import type { Project } from "../shared/schema.ts";
import type { JournalArticle, JournalCategory } from "../shared/journal.ts";
import {
  DEFAULT_OG_IMAGE_URL,
  formatMetaTitle,
  ORGANIZATION_LOGO_URL,
  ORGANIZATION_NAME,
  SITE_NAME,
  SITE_ORIGIN,
} from "../shared/siteSeo.ts";
import { isJournalSanityConfigured } from "../server/sanity/journalClient.ts";
import {
  fetchJournalArticlesFromSanity,
  fetchJournalArticleBySlugFromSanity,
  fetchJournalCategoriesFromSanity,
} from "../server/sanity/journalService.ts";
import { fetchProjectsFromSanity } from "../server/sanity/projectService.ts";

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
  "Selected writing from Atla Journal on branding, strategy, digital craft, and creative direction.";

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
  await writeFontLoaderScript();
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

  const envPath = path.resolve(".env.vercel.local");

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
  }>;
  type?: string;
  robots?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  const url = `${SITE_ORIGIN}${pathname}`;
  const imageUrl = image || DEFAULT_OG_IMAGE_URL;
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

      return `<link ${preloadAttrs.join(" ")}>`;
    });

    tags.unshift(...preloadTags.reverse());
  }

  if (structuredData) {
    const blocks = Array.isArray(structuredData) ? structuredData : [structuredData];
    for (const block of blocks) {
      tags.push(`<script type="application/ld+json">${JSON.stringify(block)}</script>`);
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

async function writeFontLoaderScript() {
  await writeFile(
    path.resolve("dist/public/font-loader.js"),
    `(()=>{const link=document.getElementById("atla-fonts-stylesheet");if(link){link.media="all";}})();`,
    "utf8",
  );
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

  return template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>\n    <script defer src="${publicPath}"></script>`,
  );
}

function articlePublishedIso(dateLabel: string) {
  const [month, year] = dateLabel.split(" ");
  const monthMap: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const monthNumber = monthMap[month];
  if (!monthNumber || !year) return undefined;
  return `${year}-${monthNumber}-01`;
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
  if (pathname === "/" || pathname === "/work") {
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
  const homeFeaturedProject = projects[2] ?? projects[0];
  const workFeaturedProject = projects[0];
  const homeFeaturedImage = homeFeaturedProject ? resolveProjectHeroImage(homeFeaturedProject) : DEFAULT_OG_IMAGE_URL;
  const workFeaturedImage = workFeaturedProject ? resolveProjectHeroImage(workFeaturedProject) : DEFAULT_OG_IMAGE_URL;
  const homeVisibleProjects = projects.slice(0, 5);
  const workVisibleProjects = projects.slice(0, 4);
  const homePreloadImages = buildImagePreloadEntries([
    { src: resolveProjectHeroImage(homeVisibleProjects[0]), widths: [78, 117, 156], quality: 78, sizes: "78px" },
    { src: resolveProjectHeroImage(homeVisibleProjects[1]), widths: [112, 168, 224], quality: 78, sizes: "112px" },
    { src: resolveProjectHeroImage(homeVisibleProjects[2]), widths: [274, 411, 548], quality: 84, sizes: "274px" },
    { src: resolveProjectHeroImage(homeVisibleProjects[3]), widths: [112, 168, 224], quality: 78, sizes: "112px" },
    { src: resolveProjectHeroImage(homeVisibleProjects[4]), widths: [78, 117, 156], quality: 78, sizes: "78px" },
  ]);
  const workPreloadImages = buildImagePreloadEntries(
    workVisibleProjects.map((project) => ({
      src: resolveProjectHeroImage(project),
      widths: [290, 435, 580],
      quality: 82,
      sizes: "calc(100vw - 20px)",
    })),
  );

  const staticRoutes = [
    {
      pathname: "/",
      title: formatMetaTitle("Atla Branding Studio", "Strategy, Identity, Digital"),
      description: "Atla is a branding studio building strategy-led identities, websites, and creative systems for companies across the US and Latin America.",
      image: homeFeaturedImage,
      preloadImages: homePreloadImages,
      includeInSitemap: true,
    },
    {
      pathname: "/about",
      title: formatMetaTitle("About Atla", "Branding Studio in Mexico City and Austin"),
      description: "Meet Atla, a senior-led branding studio helping founders and teams build strategy, identity, and digital systems across the US and Latin America.",
      image: "/figmaAssets/about-hero.jpg",
      preloadImage: "/figmaAssets/about-hero.jpg",
      preloadImages: [
        { href: "/figmaAssets/photo-1.jpg" },
        { href: "/figmaAssets/photo-2.jpg" },
      ],
      includeInSitemap: true,
    },
    {
      pathname: "/contact",
      title: formatMetaTitle("Contact Atla", "Start a Branding or Digital Project"),
      description: "Contact Atla to discuss branding, identity, digital design, or creative direction for your next launch, reposition, or growth stage.",
      image: "/figmaAssets/about-hero.jpg",
      preloadImage: "/figmaAssets/about-hero.jpg",
      includeInSitemap: true,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Atla",
        url: `${SITE_ORIGIN}/contact`,
        mainEntity: {
          "@type": "Organization",
          name: ORGANIZATION_NAME,
          email: "hello@atla.studio",
          url: SITE_ORIGIN,
        },
      },
    },
    {
      pathname: "/services",
      title: formatMetaTitle("Brand Strategy, Identity, and Digital Design Services", "Atla"),
      description: "Explore Atla services in brand strategy, identity design, digital design, motion, packaging, and creative direction for ambitious companies.",
      image: "/figmaAssets/about-hero.jpg",
      preloadImage: "/figmaAssets/about-hero.jpg",
      includeInSitemap: true,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Atla Services",
        itemListElement: [
          "Creative Direction",
          "Brand Strategy",
          "Identity",
          "Digital Design",
          "Motion",
          "Print & Packaging",
          "Art Direction",
          "Copywriting",
          "Tone of Voice",
        ].map((service, index) => ({
          "@type": "Service",
          position: index + 1,
          name: service,
          provider: {
            "@type": "Organization",
            name: ORGANIZATION_NAME,
          },
        })),
      },
    },
    {
      pathname: "/work",
      title: formatMetaTitle("Selected Branding, Packaging, and Digital Work", "Atla"),
      description: "Browse selected Atla work across branding, packaging, art direction, and digital design for hospitality, consumer, and technology clients.",
      image: workFeaturedImage,
      preloadImages: workPreloadImages,
      includeInSitemap: true,
    },
    {
      pathname: "/journal",
      title: formatMetaTitle("Atla Journal", "Branding, Strategy, and Digital Craft"),
      description: "Atla Journal publishes essays, studio notes, and practical articles on branding, strategy, digital craft, motion, and visual storytelling for modern brands.",
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
      description: "Read how Atla handles browser storage, hosting data, and information shared through direct studio inquiries across the website.",
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
      title: "Projects Admin Retired — Atla",
      description: "The legacy projects admin route has been retired. Portfolio entries are managed in Sanity Studio.",
      robots: "noindex,nofollow",
      includeInSitemap: false,
    },
  ];

  for (const route of staticRoutes) {
    const html = await injectPrerenderedApp(
      replaceHead(template, createHeadMarkup(route)),
      route.pathname,
      getStaticRoutePrerenderData(route.pathname, { projects, articles, categories }),
    );
    await writeRoutePage(route.pathname, html);
  }

  for (const category of categories) {
    const categoryArticles = articles.filter((article) => article.categorySlug === category.slug);
    const pathname = `/journal/category/${category.slug}`;
    const description = ensureDescriptionLength(
      category.seoDescription || category.description || DEFAULT_JOURNAL_CATEGORY_DESCRIPTION,
      "Essays, frameworks, and studio notes from Atla Journal for teams investing in stronger brand systems."
    );
    const title = formatMetaTitle(category.seoTitle || `${category.title} Articles`, "Atla Journal");

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
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      image: resolveProjectHeroImage(project),
      url: `${SITE_ORIGIN}/projects/${project.slug}`,
      creator: {
        "@type": "Organization",
        name: ORGANIZATION_NAME,
      },
    };

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
          title: formatMetaTitle(`${project.title} ${project.category} Case Study`, "Atla"),
          description: ensureDescriptionLength(
            project.description,
            `Explore how Atla shaped ${project.client} through strategy, identity, and implementation across brand touchpoints.`,
          ),
          pathname,
          image: resolveProjectHeroImage(project),
          ...buildResponsiveImagePreload(
            resolveProjectHeroImage(project),
            [600, 900, 1200, 1400],
            84,
            "(max-width: 767px) 100vw, 55vw",
          ),
          preloadImages: projectGalleryPreloads,
          structuredData,
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
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.seoTitle || article.title,
      description,
      image: articleImage,
      url: `${SITE_ORIGIN}/journal/${article.slug}`,
      author: {
        "@type": "Organization",
        name: article.authorName || ORGANIZATION_NAME,
      },
      publisher: {
        "@type": "Organization",
        name: ORGANIZATION_NAME,
        logo: {
          "@type": "ImageObject",
          url: ORGANIZATION_LOGO_URL,
        },
      },
      datePublished: article.publishedAt || articlePublishedIso(article.date),
    };

    const pathname = `/journal/${article.slug}`;
    const html = await injectPrerenderedApp(
      replaceHead(
        template,
        createHeadMarkup({
          title: formatMetaTitle(article.seoTitle || article.title, "Atla Journal"),
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

  const notFoundHtml = await injectPrerenderedApp(
    replaceHead(
      template,
      createHeadMarkup({
        title: "Page Not Found — Atla",
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
    throw new Error("Sanity journal env vars are required for production prerender and sitemap generation.");
  }

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

  return {
    projects,
    articles,
    articleDetails,
    categories,
  };
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
