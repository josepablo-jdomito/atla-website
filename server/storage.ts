import { sanityClient } from "./sanityClient";
import type {
  Project,
  InsertProject,
  UpdateProject,
} from "@shared/schema";

// GROQ projection that maps Sanity document shape to site Project shape
const PROJECT_PROJECTION = `{
  "id": _id,
  "slug": slug.current,
  title,
  client,
  "year": select(defined(year) => year, string::split(_createdAt, "-")[0]),
  category,
  tags,
  description,
  "body": coalesce(body, ""),
  "coverImage": coverImage.asset->url,
  "images": gallery[].asset->url,
  featured,
  status,
  "createdAt": _createdAt
}`;

function normalizeProject(raw: any): Project {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    client: raw.client || "",
    year: typeof raw.year === "string" ? parseInt(raw.year, 10) || new Date().getFullYear() : raw.year,
    category: raw.category || "",
    tags: raw.tags || [],
    description: raw.description || "",
    body: raw.body || "",
    coverImage: raw.coverImage || "",
    images: (raw.images || []).filter(Boolean),
    featured: raw.featured ?? false,
    status: raw.status || "published",
    createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
  };
}

export interface IStorage {
  getAllProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
  getProjectById(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: UpdateProject): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
}

export class SanityStorage implements IStorage {
  async getAllProjects(): Promise<Project[]> {
    const results = await sanityClient.fetch(
      `*[_type == "project"] ${PROJECT_PROJECTION} | order(year desc, title asc)`
    );
    return results.map(normalizeProject);
  }

  async getFeaturedProjects(): Promise<Project[]> {
    const results = await sanityClient.fetch(
      `*[_type == "project" && featured == true] ${PROJECT_PROJECTION} | order(year desc)`
    );
    return results.map(normalizeProject);
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const result = await sanityClient.fetch(
      `*[_type == "project" && slug.current == $slug][0] ${PROJECT_PROJECTION}`,
      { slug }
    );
    return result ? normalizeProject(result) : undefined;
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const result = await sanityClient.fetch(
      `*[_type == "project" && _id == $id][0] ${PROJECT_PROJECTION}`,
      { id }
    );
    return result ? normalizeProject(result) : undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const doc = {
      _type: "project" as const,
      title: project.title,
      slug: { _type: "slug" as const, current: project.slug },
      client: project.client,
      year: String(project.year),
      category: project.category,
      tags: project.tags || [],
      description: project.description,
      body: project.body || "",
      featured: project.featured ?? false,
      status: project.status || "draft",
    };
    const created = await sanityClient.create(doc);
    const full = await this.getProjectById(created._id);
    return full!;
  }

  async updateProject(id: string, updateData: UpdateProject): Promise<Project | undefined> {
    const existing = await this.getProjectById(id);
    if (!existing) return undefined;

    const patch: Record<string, any> = {};
    if (updateData.title !== undefined) patch.title = updateData.title;
    if (updateData.slug !== undefined) patch.slug = { _type: "slug", current: updateData.slug };
    if (updateData.client !== undefined) patch.client = updateData.client;
    if (updateData.year !== undefined) patch.year = String(updateData.year);
    if (updateData.category !== undefined) patch.category = updateData.category;
    if (updateData.tags !== undefined) patch.tags = updateData.tags;
    if (updateData.description !== undefined) patch.description = updateData.description;
    if (updateData.body !== undefined) patch.body = updateData.body;
    if (updateData.featured !== undefined) patch.featured = updateData.featured;
    if (updateData.status !== undefined) patch.status = updateData.status;

    await sanityClient.patch(id).set(patch).commit();
    return this.getProjectById(id);
  }

  async deleteProject(id: string): Promise<boolean> {
    const existing = await this.getProjectById(id);
    if (!existing) return false;
    await sanityClient.delete(id);
    return true;
  }
}

export const storage = new SanityStorage();
