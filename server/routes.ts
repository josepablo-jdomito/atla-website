import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.ts";
import { insertProjectSchema, updateProjectSchema } from "../shared/schema.ts";
import { fetchJournalArticleBySlugFromSanity, fetchJournalArticlesFromSanity } from "./sanity/journalService.ts";

const ADMIN_COOKIE_NAME = "atla_admin_session";

function getCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function getAdminSecret() {
  return process.env.ADMIN_ACCESS_PASSWORD || process.env.ATLA_ADMIN_PASSWORD || null;
}

function isAuthorizedAdmin(req: Parameters<Express["get"]>[1] extends (...args: infer A) => any ? A[0] : never) {
  const secret = getAdminSecret();
  if (!secret) return false;
  return getCookieValue(req.headers.cookie, ADMIN_COOKIE_NAME) === secret;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/admin/session", async (req, res) => {
    if (!getAdminSecret()) {
      return res.status(503).json({ error: "Admin access is not configured" });
    }
    if (!isAuthorizedAdmin(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return res.json({ authenticated: true });
  });

  app.post("/api/admin/login", async (req, res) => {
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
    res.setHeader(
      "Set-Cookie",
      `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`,
    );
    return res.json({ authenticated: false });
  });

  app.get("/api/projects", async (req, res) => {
    try {
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

  return httpServer;
}
