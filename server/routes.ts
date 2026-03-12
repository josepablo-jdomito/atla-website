import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, updateProjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/projects", async (req, res) => {
    try {
      const { featured } = req.query;
      const data = featured === "true"
        ? await storage.getFeaturedProjects()
        : await storage.getAllProjects();
      res.json(data);
    } catch (err) {
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
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Project not found" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  return httpServer;
}
