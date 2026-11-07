/**
 * The lite project list (fix pass A, 2026-11-06): what GET /api/projects answers and what the prerender
 * seeds under ["/api/projects"]. It carries what the wall, the menu thumbs, search, /ventures, Services
 * and a project page's next/related read, and none of the long text: no body, no description, no case
 * study (about a third of the old payload). The full project lives at /api/projects/:slug, and Ask reads
 * the full list on the server. No dependencies, so the client bundle can import it.
 */
export type ProjectListItem = {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: number;
  category: string;
  region: string;
  country?: string;
  sector?: string;
  disciplines?: string[];
  stage?: string;
  place?: string;
  searchTerms?: string[];
  coverImage: string;
  coverFocal?: { x: number; y: number } | null;
  coverColor?: string | null;
  images: string[];
  videos: string[];
  featured: boolean;
  homeOrder?: number;
  status: string;
};

/** The list fields of a full project, in a fixed key order (so the JSON, and its ETag, are stable). */
export function toProjectListItem(project: ProjectListItem & Record<string, unknown>): ProjectListItem {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    client: project.client,
    year: project.year,
    category: project.category,
    region: project.region,
    country: project.country,
    sector: project.sector,
    disciplines: project.disciplines,
    stage: project.stage,
    place: project.place,
    searchTerms: project.searchTerms,
    coverImage: project.coverImage,
    coverFocal: project.coverFocal ?? null,
    coverColor: project.coverColor ?? null,
    images: project.images,
    videos: project.videos,
    featured: project.featured,
    homeOrder: project.homeOrder,
    status: project.status,
  };
}
