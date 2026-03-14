import { z } from "zod";

// ── Project schema (pure Zod – no drizzle dependency) ──

export const insertProjectSchema = z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    client: z.string().default(""),
    year: z.number().int(),
    category: z.string().default(""),
    tags: z.array(z.string()).default([]),
    description: z.string().default(""),
    body: z.string().default(""),
    coverImage: z.string().default(""),
    images: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    status: z.string().default("draft"),
});

export const updateProjectSchema = insertProjectSchema.partial();

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;

export interface Project extends InsertProject {
    id: string;
    createdAt: Date;
}
