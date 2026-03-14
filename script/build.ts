import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import { seedProjects } from "../shared/projectSeed.ts";
import { journalArticles } from "../client/src/data/atlaContent.ts";

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

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

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

function createHeadMarkup({
  title,
  description,
  pathname,
  image,
  type = "website",
  structuredData,
}: {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  type?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  const url = `https://atla-website.vercel.app${pathname}`;
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<link rel="canonical" href="${escapeHtml(url)}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:type" content="${escapeHtml(type)}">`,
    `<meta property="og:url" content="${escapeHtml(url)}">`,
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
  ];

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
    .replace(/<meta property="og:title"[^>]*>\n?/g, "")
    .replace(/<meta property="og:description"[^>]*>\n?/g, "")
    .replace(/<meta property="og:type"[^>]*>\n?/g, "")
    .replace(/<meta property="og:url"[^>]*>\n?/g, "")
    .replace(/<meta property="og:image"[^>]*>\n?/g, "")
    .replace(/<meta name="twitter:[^"]+"[^>]*>\n?/g, "")
    .replace(/<link rel="canonical"[^>]*>\n?/g, "")
    .replace("</head>", `    ${headMarkup}\n  </head>`);
}

async function writeRoutePage(route: string, html: string) {
  const relativePath = route === "/" ? "index.html" : path.join(route.replace(/^\//, ""), "index.html");
  const outputPath = path.resolve("dist/public", relativePath);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, "utf8");
}

async function prerenderRoutes() {
  const templatePath = path.resolve("dist/public/index.html");
  const template = await readFile(templatePath, "utf8");

  const staticRoutes = [
    {
      pathname: "/",
      title: "Atla — Design Studio",
      description: "Atla is a design studio specializing in brand identity, visual communication, and digital experiences across the US and Latin America.",
      image: seedProjects[0]?.coverImage,
    },
    {
      pathname: "/about",
      title: "About Atla",
      description: "Meet Atla, a design studio building brand identity, digital experiences, and editorial systems with clarity and purpose.",
      image: "/figmaAssets/about-hero.jpg",
    },
    {
      pathname: "/work",
      title: "Portfolio — Atla",
      description: "Selected branding, digital, packaging, and art direction work from Atla.",
      image: seedProjects[0]?.coverImage,
    },
    {
      pathname: "/journal",
      title: "Journal — Atla",
      description: "Essays, process notes, and studio reflections on branding, digital craft, motion, and visual storytelling from Atla.",
      image: journalArticles[0]?.coverImage,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Atla Journal",
        url: "https://atla-website.vercel.app/journal",
      },
    },
    {
      pathname: "/privacy",
      title: "Privacy Policy — Atla",
      description: "How Atla handles site data, browser storage, contact information, and infrastructure providers.",
    },
    {
      pathname: "/terms",
      title: "Terms of Use — Atla",
      description: "Terms governing access to and use of the Atla website and its content.",
    },
  ];

  for (const route of staticRoutes) {
    const html = replaceHead(template, createHeadMarkup(route));
    await writeRoutePage(route.pathname, html);
  }

  for (const project of seedProjects) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      image: project.coverImage,
      url: `https://atla-website.vercel.app/projects/${project.slug}`,
      creator: {
        "@type": "Organization",
        name: "Atla",
      },
    };

    const html = replaceHead(
      template,
      createHeadMarkup({
        title: `${project.title} — Atla`,
        description: project.description,
        pathname: `/projects/${project.slug}`,
        image: project.coverImage,
        structuredData,
      }),
    );
    await writeRoutePage(`/projects/${project.slug}`, html);
  }

  for (const article of journalArticles) {
    const description = article.seoDescription || article.excerpt;
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.seoTitle || article.title,
      description,
      image: article.coverImage,
      url: `https://atla-website.vercel.app/journal/${article.slug}`,
      author: {
        "@type": "Organization",
        name: article.authorName || "Atla",
      },
      publisher: {
        "@type": "Organization",
        name: "Atla",
      },
    };

    const html = replaceHead(
      template,
      createHeadMarkup({
        title: `${article.seoTitle || article.title} — Atla Journal`,
        description,
        pathname: `/journal/${article.slug}`,
        image: article.coverImage,
        type: "article",
        structuredData,
      }),
    );
    await writeRoutePage(`/journal/${article.slug}`, html);
  }
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
