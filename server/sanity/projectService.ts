import type { Project } from "../../shared/schema.ts";
import { getJournalSanityClient, isJournalSanityConfigured } from "./journalClient.ts";

type SanityProject = {
  _id: string;
  slug: string;
  title: string;
  client: string;
  year: string | number | null;
  category: string;
  tags: string[];
  description: string;
  body: unknown;
  featured: boolean;
  status?: string;
  coverImage?: string;
  gallery?: string[];
};

const PROJECT_QUERY = `
  *[_type == "project" && defined(slug.current) && (!defined(status) || status == "published")] | order(coalesce(featured, featuredOnHomepage, false) desc, coalesce(year, _createdAt) desc, _createdAt desc) {
    _id,
    "slug": slug.current,
    "title": coalesce(title, name, "Untitled project"),
    "client": coalesce(client, clientName, brand, ""),
    "year": coalesce(year, publishedAt, _createdAt),
    "category": coalesce(category->title, category, projectType, discipline, "Uncategorized"),
    "tags": coalesce(tags, keywords, []),
    "description": coalesce(description, excerpt, summary, ""),
    "body": coalesce(body, content, []),
    "featured": coalesce(featured, featuredOnHomepage, false),
    "status": status,
    "coverImage": coalesce(coverImage.asset->url, mainImage.asset->url, heroImage.asset->url, thumbnail.asset->url),
    "gallery": array::compact(coalesce(gallery, images, galleryImages, [])[].asset->url)
  }
`;

export async function fetchProjectsFromSanity(options?: { featured?: boolean }) {
  if (!isJournalSanityConfigured()) return [];

  const client = getJournalSanityClient();
  const projects = await client.fetch<SanityProject[]>(PROJECT_QUERY);

  return projects
    .filter((project) => (options?.featured ? project.featured : true))
    .map(normalizeProject);
}

export async function fetchProjectBySlugOrIdFromSanity(slugOrId: string) {
  const projects = await fetchProjectsFromSanity();
  return projects.find((project) => project.slug === slugOrId || project.id === slugOrId);
}

export function isProjectSanityConfigured() {
  return isJournalSanityConfigured();
}

function normalizeProject(project: SanityProject): Project {
  return {
    id: project._id,
    slug: project.slug,
    title: project.title,
    client: project.client || "Confidential",
    year: normalizeYear(project.year),
    category: project.category || "Uncategorized",
    tags: Array.isArray(project.tags) ? project.tags.filter(isNonEmptyString) : [],
    description: project.description || "",
    body: portableTextToPlainText(project.body),
    coverImage: project.coverImage || "",
    images: Array.isArray(project.gallery) ? project.gallery.filter(isNonEmptyString) : [],
    featured: Boolean(project.featured),
    status: project.status === "draft" ? "draft" : "published",
    createdAt: new Date(),
  };
}

function normalizeYear(value: string | number | null) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const direct = Number.parseInt(value, 10);
    if (Number.isFinite(direct)) return direct;

    const parsed = new Date(value).getFullYear();
    if (Number.isFinite(parsed)) return parsed;
  }

  return new Date().getFullYear();
}

function portableTextToPlainText(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .map((block) => {
      if (!block || typeof block !== "object" || !("children" in block) || !Array.isArray(block.children)) {
        return "";
      }

      return block.children
        .map((child: unknown) => {
          if (!child || typeof child !== "object" || !("text" in child) || typeof child.text !== "string") {
            return "";
          }

          return child.text;
        })
        .join("");
    })
    .filter(Boolean)
    .join("\n\n");
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
