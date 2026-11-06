import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ProjectListItem } from "@shared/projectList";
import type { ProjectLite } from "@shared/rankProjects";
import { DISCIPLINE_ON_ALL, resolveProjectFacets } from "@shared/projectFacets";
import { sanitizeImageUrls } from "@shared/imageDelivery";
import { getNextProject } from "@/lib/projectSeo";

/** One shape for the home: the card, the search fallback and the archive filters all read it. */
export type SiteProject = ProjectLite & {
  client: string;
  country: string;
  images: string[];
  videos: string[];
  featured: boolean;
  homeOrder: number | null;
  /** The cover's dominant colour (hex) when Sanity has it: the wall tile paints it while the image loads. */
  coverColor?: string;
};

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const list = (value: unknown) =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v.trim().length > 0) : [];

/** From the lite list item (GET /api/projects) or a full project (GET /api/projects/:slug): both carry these fields. */
export function toSiteProject(raw: ProjectListItem): SiteProject | null {
  const record = raw as ProjectListItem & Record<string, unknown>;
  const images = sanitizeImageUrls(list(record.images));
  const coverImage = sanitizeImageUrls([text(record.coverImage), ...images])[0];
  if (!text(record.slug) || !coverImage) return null;
  // The API already resolved the facets; resolving again is a no-op there and the fallback elsewhere.
  const facets = resolveProjectFacets(record);
  return {
    slug: text(record.slug),
    title: text(record.title),
    client: text(record.client) || text(record.title),
    country: text(record.country),
    sector: facets.sector,
    disciplines: facets.disciplines,
    stage: facets.stage,
    place: text(record.place) || facets.place,
    searchTerms: facets.searchTerms,
    year: Number(record.year) || 0,
    coverImage,
    images: images.filter((src) => src !== coverImage),
    videos: list(record.videos),
    featured: record.featured === true,
    homeOrder: typeof record.homeOrder === "number" ? record.homeOrder : null,
    ...(/^#[0-9a-f]{3,8}$/i.test(text(record.coverColor)) ? { coverColor: text(record.coverColor) } : null),
  };
}

/** Featured first by homeOrder (1 = first), then newest. Mirrors server sortFeatured. */
export function featuredProjects(projects: SiteProject[], limit: number) {
  return projects
    .filter((project) => project.featured)
    .sort((a, b) => (a.homeOrder ?? 999) - (b.homeOrder ?? 999) || b.year - a.year)
    .slice(0, limit);
}

/** How many featured projects the home shows before the archive. */
export const HOME_FEATURED_LIMIT = 8;

/** The home's reading order: the featured block, then every other project in API order. */
export function siteOrder(projects: SiteProject[]) {
  const featured = featuredProjects(projects, HOME_FEATURED_LIMIT);
  const shown = new Set(featured.map((project) => project.slug));
  return [...featured, ...projects.filter((project) => !shown.has(project.slug))];
}

/** The project after `slug` in the home's order, wrapping from the last to the first. */
export function nextProjectInSiteOrder(projects: SiteProject[], slug: string) {
  return getNextProject(siteOrder(projects), slug);
}

/** How many "More like this" projects a project page shows. */
export const MORE_LIKE_THIS_COUNT = 3;

type Facets = Pick<SiteProject, "slug" | "sector" | "disciplines" | "place" | "stage" | "year">;

/**
 * "More like this" (proposal 3.3): same sector first, never the project itself. Among those,
 * a shared discipline other than Brand Identity, then same place, then same stage, then newest.
 * When the sector gives fewer than `count`, projects sharing the lead discipline fill in, newest first,
 * unless that lead is Brand Identity: it is on every project, so it relates nothing (a fashion label would
 * get a software company). Fewer than `count` cards is fine.
 */
export function moreLikeThis<T extends Facets>(projects: T[], current: Facets, count = MORE_LIKE_THIS_COUNT): T[] {
  const others = projects.filter((project) => project.slug !== current.slug);
  const shared = (project: Facets) =>
    project.disciplines.filter((d) => d !== DISCIPLINE_ON_ALL && current.disciplines.includes(d)).length;
  const sameSector = current.sector
    ? others
        .filter((project) => project.sector === current.sector)
        .sort(
          (a, b) =>
            shared(b) - shared(a) ||
            Number(b.place === current.place) - Number(a.place === current.place) ||
            Number(b.stage === current.stage) - Number(a.stage === current.stage) ||
            b.year - a.year,
        )
    : [];
  if (sameSector.length >= count) return sameSector.slice(0, count);
  const lead = current.disciplines[0] === DISCIPLINE_ON_ALL ? current.disciplines.find((d) => d !== DISCIPLINE_ON_ALL) : current.disciplines[0];
  const picked = new Set(sameSector.map((project) => project.slug));
  const sameLead = lead
    ? others
        .filter((project) => !picked.has(project.slug) && project.disciplines.includes(lead))
        .sort((a, b) => b.year - a.year)
    : [];
  return [...sameSector, ...sameLead].slice(0, count);
}

/** Same query key as the rest of the site, so the prerendered cache is reused. The lite list (shared/projectList.ts). */
export function useSiteProjects() {
  const { data, isSuccess } = useQuery<ProjectListItem[]>({ queryKey: ["/api/projects"] });
  const projects = useMemo(
    () => (data ?? []).map(toSiteProject).filter((project): project is SiteProject => project !== null),
    [data],
  );
  return { projects, loaded: isSuccess };
}
