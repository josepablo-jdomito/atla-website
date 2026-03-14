import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, desc, asc } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type UpdateProject,
  users,
  projects,
} from "../shared/schema.ts";
import { seedProjects } from "../shared/projectSeed.ts";

const connectionString = process.env.DATABASE_URL;
const pool = connectionString ? new Pool({ connectionString }) : null;
const db = pool ? drizzle(pool) : null;

function fallbackProjects(): Project[] {
  return seedProjects.map((project) => ({
    ...project,
  }));
}

function fallbackProjectBySlug(slug: string) {
  return fallbackProjects().find((project) => project.slug === slug);
}

function fallbackProjectById(id: string) {
  return fallbackProjects().find((project) => project.id === id);
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAllProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
  getProjectById(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: UpdateProject): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    if (!db) return undefined;
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) return undefined;
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error("Database is not configured");
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllProjects(): Promise<Project[]> {
    if (!db) return fallbackProjects().sort((a, b) => (b.year - a.year) || a.title.localeCompare(b.title));
    try {
      return await db.select().from(projects).orderBy(desc(projects.year), asc(projects.title));
    } catch (_error) {
      return fallbackProjects().sort((a, b) => (b.year - a.year) || a.title.localeCompare(b.title));
    }
  }

  async getFeaturedProjects(): Promise<Project[]> {
    if (!db) return fallbackProjects().filter((project) => project.featured);
    try {
      return await db
        .select()
        .from(projects)
        .where(eq(projects.featured, true))
        .orderBy(desc(projects.year));
    } catch (_error) {
      return fallbackProjects().filter((project) => project.featured);
    }
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    if (!db) return fallbackProjectBySlug(slug);
    try {
      const [project] = await db.select().from(projects).where(eq(projects.slug, slug));
      return project;
    } catch (_error) {
      return fallbackProjectBySlug(slug);
    }
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    if (!db) return fallbackProjectById(id);
    try {
      const [project] = await db.select().from(projects).where(eq(projects.id, id));
      return project;
    } catch (_error) {
      return fallbackProjectById(id);
    }
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    if (!db) throw new Error("Database is not configured");
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: string, updateData: UpdateProject): Promise<Project | undefined> {
    if (!db) throw new Error("Database is not configured");
    const [project] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: string): Promise<boolean> {
    if (!db) throw new Error("Database is not configured");
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
