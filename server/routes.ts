import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.ts";
import { insertProjectSchema, updateProjectSchema } from "../shared/schema.ts";
import {
  fetchJournalArticleBySlugFromSanity,
  fetchJournalArticlesFromSanity,
  fetchJournalCategoriesFromSanity,
} from "./sanity/journalService.ts";
import {
  fetchProjectBySlugOrIdFromSanity,
  fetchProjectsFromSanity,
  isProjectSanityConfigured,
} from "./sanity/projectService.ts";

const ADMIN_COOKIE_NAME = "atla_admin_session";
const LEGACY_PROJECTS_ADMIN_MESSAGE =
  "Legacy projects admin has been retired. Projects are managed in Sanity Studio.";

function getCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function getAdminSecret() {
  return process.env.ADMIN_ACCESS_PASSWORD || process.env.ATLA_ADMIN_PASSWORD || null;
}

function isAuthorizedAdmin(req: Request) {
  const secret = getAdminSecret();
  if (!secret) return false;
  return getCookieValue(req.headers.cookie, ADMIN_COOKIE_NAME) === secret;
}

function getRequestOrigin(req: Request) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const forwardedHost = req.headers["x-forwarded-host"];
  const protocol = typeof forwardedProto === "string" ? forwardedProto.split(",")[0].trim() : req.protocol;
  const host = typeof forwardedHost === "string" ? forwardedHost.split(",")[0].trim() : req.get("host");

  if (!host) {
    return "https://atla-website.vercel.app";
  }

  return `${protocol || "https"}://${host}`;
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

  app.get("/api/projects", async (req, res) => {
    try {
      if (isProjectSanityConfigured()) {
        const { featured } = req.query;
        const data = await fetchProjectsFromSanity({ featured: featured === "true" });
        return res.json(data);
      }

      const { featured } = req.query;
      const data = featured === "true"
        ? await storage.getFeaturedProjects()
        : await storage.getAllProjects();
      res.json(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:slugOrId", async (req, res) => {
    try {
      const { slugOrId } = req.params;
      if (isProjectSanityConfigured()) {
        const project = await fetchProjectBySlugOrIdFromSanity(slugOrId);
        if (!project) return res.status(404).json({ error: "Project not found" });
        return res.json(project);
      }

      const project =
        await storage.getProjectBySlug(slugOrId) ??
        await storage.getProjectById(slugOrId);
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch project" });
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
      const articles = await fetchJournalArticlesFromSanity();
      res.json(articles);
    } catch (err) {
      console.error("Failed to fetch journal articles:", err);
      res.status(500).json({ error: "Failed to fetch journal articles" });
    }
  });

  app.get("/api/journal/categories", async (_req, res) => {
    try {
      const categories = await fetchJournalCategoriesFromSanity();
      res.json(categories);
    } catch (err) {
      console.error("Failed to fetch journal categories:", err);
      res.status(500).json({ error: "Failed to fetch journal categories" });
    }
  });

  app.get("/api/journal/:slug", async (req, res) => {
    try {
      const article = await fetchJournalArticleBySlugFromSanity(req.params.slug);
      if (!article) return res.status(404).json({ error: "Journal article not found" });
      res.json(article);
    } catch (err) {
      console.error(`Failed to fetch journal article ${req.params.slug}:`, err);
      res.status(500).json({ error: "Failed to fetch journal article" });
    }
  });

  app.get("/api/sitemap.xml", async (req, res) => {
    try {
      const origin = getRequestOrigin(req);
      const projects = isProjectSanityConfigured()
        ? await fetchProjectsFromSanity()
        : await storage.getAllProjects();
      const articles = await fetchJournalArticlesFromSanity();
      const categories = await fetchJournalCategoriesFromSanity();
      const xml = createSitemapXml(
        origin,
        [
          "/",
          "/about",
          "/services",
          "/work",
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
      const origin = getRequestOrigin(req);
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
