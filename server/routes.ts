import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.ts";
import { registerContactRoute } from "./contact.ts";
import { SITE_ORIGIN } from "../shared/siteSeo.ts";
import { registerBriefRoutes } from "./brief/route.ts";
import { registerBrandCheckRoutes } from "./brandCheck/route.ts";
import { registerAuditRoutes } from "./audit/route.ts";
import { registerAskRoutes } from "./ask/route.ts";
import { insertProjectSchema, updateProjectSchema } from "../shared/schema.ts";
import {
  fetchJournalArticleBySlugFromSanity,
  fetchJournalArticlesFromSanity,
  fetchJournalCategoriesFromSanity,
} from "./sanity/journalService.ts";
import {
  fetchProjectBySlugOrIdFromSanity,
  fetchProjectListFromSanity,
  isProjectSanityConfigured,
  normalizeProjectFacetsForApi,
} from "./sanity/projectService.ts";
import { toProjectListItem, type ProjectListItem } from "../shared/projectList.ts";

const ADMIN_COOKIE_NAME = "atla_admin_session";
const LEGACY_PROJECTS_ADMIN_MESSAGE =
  "Legacy projects admin has been retired. Projects are managed in Sanity Studio.";
const LEGACY_REDIRECTS: Array<{ from: string; to: string }> = [
  { from: "/work", to: "/" },
  { from: "/work/", to: "/" },
  { from: "/blog", to: "/journal" },
  { from: "/blog/", to: "/journal" },
  { from: "/blog/10-successful-rebranding-examples-that-changed-the-game", to: "/journal/why-most-startups-rebrand-too-late" },
  { from: "/blog/10-successful-rebranding-examples-that-changed-the-game/", to: "/journal/why-most-startups-rebrand-too-late" },
  { from: "/blog/the-complete-rebranding-process-from-planning-to-launch", to: "/journal/why-most-startups-rebrand-too-late" },
  { from: "/blog/what-holds-all-the-elements-of-a-design-together", to: "/journal" },
  { from: "/blog/subscription-design-trends", to: "/journal" },
  { from: "/blog/brand-director-vs-marketing-director", to: "/journal/art-direction-vs-graphic-design" },
  { from: "/blog/branding-questionnaire-guide", to: "/journal/how-to-brief-a-branding-agency" },
  { from: "/blog/what-is-a-creative-branding-agency-and-how-it-can-elevate-your-business", to: "/journal/what-is-a-branding-agency" },
  { from: "/blog/how-to-copy-a-website-design", to: "/journal" },
  { from: "/blog/best-branding-kits-2025", to: "/journal" },
  { from: "/blog/the-bridge-hospitality-branding-case-study", to: "/journal/hospitality-branding-guide" },
  { from: "/blog/ando-cpg-packaging-case-study", to: "/journal/brand-audit-framework" },
  { from: "/blog/conscious-care-co-wellness-branding-case-study", to: "/journal/brand-strategy-vs-brand-identity" },
  { from: "/portfolio", to: "/" },
  { from: "/portfolio/", to: "/" },
  { from: "/top-branding-agencies-for-startups", to: "/journal/how-to-select-a-branding-agency" },
  { from: "/best-startup-branding-agencies", to: "/journal/how-to-select-a-branding-agency" },
  { from: "/how-to-edit-a-website-page", to: "/journal" },
  { from: "/10-successful-rebranding-examples-that-changed-the-game", to: "/journal/why-most-startups-rebrand-too-late" },
];

function getCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

/**
 * Edge cache for the read-only content endpoints, so a request loop does not become a Sanity API loop.
 * Set on a 200 only: a 404 or a transient 500 is never stored at the edge (fix pass A, 2026-11-06).
 */
const PUBLIC_CACHE = "public, s-maxage=300, stale-while-revalidate=600";
const NO_STORE = "no-store";

/** Answers 200 with the edge cache header; every other status goes out as no-store. */
function sendPublic(res: Response, body: unknown) {
  res.set("Cache-Control", PUBLIC_CACHE);
  return res.json(body);
}

function sendUncached(res: Response, status: number, body: unknown) {
  res.set("Cache-Control", NO_STORE);
  return res.status(status).json(body);
}

function getAdminSecret() {
  return process.env.ADMIN_ACCESS_PASSWORD || process.env.ATLA_ADMIN_PASSWORD || null;
}

function isAuthorizedAdmin(req: Request) {
  const secret = getAdminSecret();
  if (!secret) return false;
  return getCookieValue(req.headers.cookie, ADMIN_COOKIE_NAME) === secret;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function createSitemapXml(origin: string, staticPaths: string[], projectSlugs: string[], articleSlugs: string[]) {
  const urls = [
    ...staticPaths,
    ...projectSlugs.map((slug) => `/projects/${slug}`),
    ...articleSlugs.map((slug) => `/journal/${slug}`),
  ]
    .filter((value, index, all) => all.indexOf(value) === index)
    .map((pathname) => `  <url>\n    <loc>${escapeXml(`${origin}${pathname}`)}</loc>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function createRssFeedXml(origin: string, articles: Awaited<ReturnType<typeof fetchJournalArticlesFromSanity>>) {
  const items = articles.slice(0, 20).map((article) => {
    const publishedAt = article.publishedAt ? new Date(article.publishedAt) : null;
    const pubDate = publishedAt && !Number.isNaN(publishedAt.getTime())
      ? publishedAt.toUTCString()
      : undefined;

    return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(`${origin}/journal/${article.slug}`)}</link>
      <guid isPermaLink="true">${escapeXml(`${origin}/journal/${article.slug}`)}</guid>
      <description>${escapeXml(article.excerpt || article.title)}</description>
      ${pubDate ? `<pubDate>${escapeXml(pubDate)}</pubDate>` : ""}
      <author>${escapeXml(article.authorName || "Atla")}</author>
      <category>${escapeXml(article.category || "Journal")}</category>
    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>Atla Journal</title>\n    <link>${escapeXml(`${origin}/journal`)}</link>\n    <description>Branding strategy, identity design, and honest perspectives from the team at Atla.</description>\n    <language>en-us</language>\n    <atom:link href="${escapeXml(`${origin}/api/feed.xml`)}" rel="self" type="application/rss+xml"/>\n${items}\n  </channel>\n</rss>\n`;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  for (const redirect of LEGACY_REDIRECTS) {
    app.get(redirect.from, (_req, res) => {
      res.redirect(301, redirect.to);
    });
  }

  app.get(/^\/blog\/.+$/, (_req, res) => {
    res.redirect(301, "/journal");
  });

  app.get(/^\/portfolio\/.+$/, (_req, res) => {
    res.redirect(301, "/");
  });

  registerContactRoute(app);
  registerBriefRoutes(app);
  registerBrandCheckRoutes(app);
  registerAuditRoutes(app);
  registerAskRoutes(app);

  // The legacy admin and the project writes are retired (Sanity is the source). They answer 410 whatever
  // the environment holds, so removing a Sanity variable can never switch a password login back on.
  const retired = (_req: Request, res: Response) => res.status(410).json({ error: LEGACY_PROJECTS_ADMIN_MESSAGE });
  app.use("/api/admin", retired);
  app.post("/api/projects", retired);
  app.patch("/api/projects/:id", retired);
  app.delete("/api/projects/:id", retired);

  app.get("/api/admin/session", async (req, res) => {
    if (isProjectSanityConfigured()) {
      return res.status(410).json({ error: LEGACY_PROJECTS_ADMIN_MESSAGE });
    }
    if (!getAdminSecret()) {
      return res.status(503).json({ error: "Admin access is not configured" });
    }
    if (!isAuthorizedAdmin(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return res.json({ authenticated: true });
  });

  app.post("/api/admin/login", async (req, res) => {
    if (isProjectSanityConfigured()) {
      return res.status(410).json({ error: LEGACY_PROJECTS_ADMIN_MESSAGE });
    }
    const secret = getAdminSecret();
    if (!secret) {
      return res.status(503).json({ error: "Admin access is not configured" });
    }

    if (req.body?.password !== secret) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.setHeader(
      "Set-Cookie",
      `${ADMIN_COOKIE_NAME}=${encodeURIComponent(secret)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800; Secure`,
    );
    return res.json({ authenticated: true });
  });

  app.post("/api/admin/logout", async (_req, res) => {
    if (isProjectSanityConfigured()) {
      return res.status(410).json({ error: LEGACY_PROJECTS_ADMIN_MESSAGE });
    }
    res.setHeader(
      "Set-Cookie",
      `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`,
    );
    return res.json({ authenticated: false });
  });

  // The lite list (shared/projectList.ts): no body, description or case study. The full project is
  // /api/projects/:slug; Ask reads the full list on the server.
  app.get("/api/projects", async (req, res) => {
    try {
      const featured = req.query.featured === "true";
      if (isProjectSanityConfigured()) {
        return sendPublic(res, await fetchProjectListFromSanity({ featured }));
      }

      const data = featured ? await storage.getFeaturedProjects() : await storage.getAllProjects();
      return sendPublic(
        res,
        data.map((project) => toProjectListItem(project as unknown as ProjectListItem & Record<string, unknown>)),
      );
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      return sendUncached(res, 500, { error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:slugOrId", async (req, res) => {
    try {
      const { slugOrId } = req.params;
      if (isProjectSanityConfigured()) {
        const project = await fetchProjectBySlugOrIdFromSanity(slugOrId);
        if (!project) return sendUncached(res, 404, { error: "Project not found" });
        return sendPublic(res, normalizeProjectFacetsForApi(project));
      }

      const project =
        await storage.getProjectBySlug(slugOrId) ??
        await storage.getProjectById(slugOrId);
      if (!project) return sendUncached(res, 404, { error: "Project not found" });
      return sendPublic(res, normalizeProjectFacetsForApi(project));
    } catch (err) {
      return sendUncached(res, 500, { error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    if (isProjectSanityConfigured()) {
      return res.status(410).json({ error: LEGACY_PROJECTS_ADMIN_MESSAGE });
    }
    if (!isAuthorizedAdmin(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const parsed = insertProjectSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid project data", details: parsed.error.flatten() });
      }
      const project = await storage.createProject(parsed.data);
      res.status(201).json(project);
    } catch (err: any) {
      if (err?.code === "23505") {
        return res.status(409).json({ error: "A project with that slug already exists" });
      }
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    if (isProjectSanityConfigured()) {
      return res.status(410).json({ error: LEGACY_PROJECTS_ADMIN_MESSAGE });
    }
    if (!isAuthorizedAdmin(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const parsed = updateProjectSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid project data", details: parsed.error.flatten() });
      }
      const project = await storage.updateProject(req.params.id, parsed.data);
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.json(project);
    } catch (err: any) {
      if (err?.code === "23505") {
        return res.status(409).json({ error: "A project with that slug already exists" });
      }
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    if (isProjectSanityConfigured()) {
      return res.status(410).json({ error: LEGACY_PROJECTS_ADMIN_MESSAGE });
    }
    if (!isAuthorizedAdmin(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Project not found" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  app.get("/api/journal", async (_req, res) => {
    try {
      return sendPublic(res, await fetchJournalArticlesFromSanity());
    } catch (err) {
      console.error("Failed to fetch journal articles:", err);
      return sendUncached(res, 500, { error: "Failed to fetch journal articles" });
    }
  });

  app.get("/api/journal/categories", async (_req, res) => {
    try {
      return sendPublic(res, await fetchJournalCategoriesFromSanity());
    } catch (err) {
      console.error("Failed to fetch journal categories:", err);
      return sendUncached(res, 500, { error: "Failed to fetch journal categories" });
    }
  });

  app.get("/api/journal/:slug", async (req, res) => {
    try {
      const article = await fetchJournalArticleBySlugFromSanity(req.params.slug);
      if (!article) return sendUncached(res, 404, { error: "Journal article not found" });
      return sendPublic(res, article);
    } catch (err) {
      console.error(`Failed to fetch journal article ${req.params.slug}:`, err);
      return sendUncached(res, 500, { error: "Failed to fetch journal article" });
    }
  });

  app.get("/api/sitemap.xml", async (req, res) => {
    try {
      const origin = SITE_ORIGIN;
      // Three independent reads, in parallel; the projects come from the lite list (slugs only needed).
      const [projects, articles, categories] = await Promise.all([
        isProjectSanityConfigured() ? fetchProjectListFromSanity() : storage.getAllProjects(),
        fetchJournalArticlesFromSanity(),
        fetchJournalCategoriesFromSanity(),
      ]);
      const xml = createSitemapXml(
        origin,
        [
          "/",
          "/about",
          "/services",
          "/brand-check",
          "/audit",
          "/hospitality",
          "/hospitality-branding",
          "/cpg-branding",
          "/wellness-branding",
          "/saas-branding",
          "/saas-rebranding",
          "/startup-branding",
          "/branding-agency-austin",
          "/brand-strategy",
          "/how-we-work",
          "/programs",
          "/journal",
          "/privacy",
          "/terms",
          ...categories.map((category) => `/journal/category/${category.slug}`),
        ],
        projects.map((project) => project.slug),
        articles.map((article) => article.slug),
      );

      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
      res.send(xml);
    } catch (err) {
      console.error("Failed to generate sitemap:", err);
      res.status(500).send("Failed to generate sitemap");
    }
  });

  app.get("/api/feed.xml", async (req, res) => {
    try {
      const origin = SITE_ORIGIN;
      const articles = await fetchJournalArticlesFromSanity();
      const xml = createRssFeedXml(origin, articles);

      res.setHeader("Content-Type", "application/rss+xml");
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
      res.send(xml);
    } catch (err) {
      console.error("Failed to generate feed:", err);
      res.status(500).send("Failed to generate feed");
    }
  });

  return httpServer;
}
