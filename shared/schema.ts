import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  client: text("client").notNull(),
  year: integer("year").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
  description: text("description").notNull(),
  body: text("body").notNull().default(""),
  coverImage: text("cover_image").notNull().default(""),
  images: text("images").array().notNull().default(sql`'{}'::text[]`),
  featured: boolean("featured").notNull().default(false),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const updateProjectSchema = insertProjectSchema.partial();

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type Project = typeof projects.$inferSelect;
