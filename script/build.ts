import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import { createRequire } from "module";
import path from "path";
import { getOptimizedImageUrl } from "../shared/imageDelivery.ts";
import type { Project } from "../shared/schema.ts";
import type { JournalArticle, JournalCategory } from "../shared/journal.ts";
import {
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
  type = "website",
  robots = "index,follow",
  structuredData,
}: {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  preloadImage?: string;
  type?: string;
  robots?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  const url = `${SITE_ORIGIN}${pathname}`;
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
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
  ];

  if (preloadImage) {
    tags.unshift(`<link rel="preload" as="image" href="${escapeHtml(preloadImage)}">`);
  }

  if (image) {
    tags.push(`<meta property="og:image" content="${escapeHtml(image)}">`);
    tags.push(`<meta name="twitter:image" content="${escapeHtml(image)}">`);
  }

  if (structuredData) {
    const blocks = Array.isArray(structuredData) ? structuredData : [structuredData];
    for (const block of blocks) {
      tags.push(`<script type="application/ld+json">${JSON.stringify(block)}</script>`);
    }
  }

  return tags.join("\n    ");
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
  const hydrationScript = `<script>window.__ATLA_DEHYDRATED_STATE__=${serializeJsonForScript(dehydratedState)};</script>`;

  return template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>\n    ${hydrationScript}`,
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

  const staticRoutes = [
    {
      pathname: "/",
      title: "Atla — Branding Studio",
      description: "Atla is a branding studio for ambitious companies across the US and Latin America. Strategy, identity, digital, and creative direction — built as one system.",
      image: projects[0]?.coverImage,
      preloadImage: getOptimizedImageUrl(projects[2]?.coverImage || projects[0]?.coverImage, { width: 680, quality: 84 }),
      includeInSitemap: true,
    },
    {
      pathname: "/about",
      title: "About Atla",
      description: "Meet Atla, a design studio building brand identity, digital experiences, and editorial systems with clarity and purpose.",
      image: "/figmaAssets/about-hero.jpg",
      includeInSitemap: true,
    },
    {
      pathname: "/services",
      title: "Services — Atla Branding Studio",
      description: "Brand strategy, identity design, digital design, and creative direction for companies that take their brand seriously.",
      image: "/figmaAssets/about-hero.jpg",
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
      title: "Portfolio — Atla",
      description: "Selected branding, digital, packaging, and art direction work from Atla.",
      image: projects[0]?.coverImage,
      includeInSitemap: true,
    },
    {
      pathname: "/journal",
      title: "Journal — Atla",
      description: "How we think about brands, design, and the work behind the work. Essays, process notes, and studio perspectives.",
      image: articles[0]?.coverImage,
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
      title: "Privacy Policy — Atla",
      description: "How Atla handles site data, browser storage, contact information, and infrastructure providers.",
      includeInSitemap: true,
    },
    {
      pathname: "/terms",
      title: "Terms of Use — Atla",
      description: "Terms governing access to and use of the Atla website and its content.",
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
    const description = category.seoDescription || category.description || DEFAULT_JOURNAL_CATEGORY_DESCRIPTION;
    const title = category.seoTitle || `${category.title} — Atla Journal`;

    const html = await injectPrerenderedApp(
      replaceHead(
        template,
        createHeadMarkup({
          title,
          description,
          pathname,
          image: categoryArticles[0]?.coverImage,
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
      image: project.coverImage,
      url: `${SITE_ORIGIN}/projects/${project.slug}`,
      creator: {
        "@type": "Organization",
        name: ORGANIZATION_NAME,
      },
    };

    const pathname = `/projects/${project.slug}`;
    const html = await injectPrerenderedApp(
      replaceHead(
        template,
        createHeadMarkup({
          title: `${project.title} — Atla`,
          description: project.description,
          pathname,
          image: project.coverImage,
          preloadImage: getOptimizedImageUrl(project.coverImage, { width: 1400, quality: 84 }),
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
    const description = article.seoDescription || article.excerpt;
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.seoTitle || article.title,
      description,
      image: article.coverImage,
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
          title: `${article.seoTitle || article.title} — Atla Journal`,
          description,
          pathname,
          image: article.coverImage,
          preloadImage: getOptimizedImageUrl(article.coverImage, { width: 1200, quality: 82 }),
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
