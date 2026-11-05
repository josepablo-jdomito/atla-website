import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import type { ProjectLite } from "@shared/rankProjects";
import { sanitizeImageUrls } from "@shared/imageDelivery";
import { getNextProject } from "@/lib/projectSeo";

/** One shape for the home: the card, the search fallback and the archive filters all read it. */
export type SiteProject = ProjectLite & {
  client: string;
  service: string;
  images: string[];
  videos: string[];
  featured: boolean;
  homeOrder: number | null;
};

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const list = (value: unknown) =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v.trim().length > 0) : [];

export function toSiteProject(raw: Project): SiteProject | null {
  const record = raw as Project & Record<string, unknown>;
  const images = sanitizeImageUrls(list(record.images));
  const coverImage = sanitizeImageUrls([text(record.coverImage), ...images])[0];
  if (!text(record.slug) || !coverImage) return null;
  const services = list(record.services);
  return {
    slug: text(record.slug),
    title: text(record.title),
    client: text(record.client) || text(record.title),
    industry: text(record.industry),
    region: text(record.region),
    services,
    service: text(record.service) || services[0] || "",
    tags: list(record.tags),
    year: Number(record.year) || 0,
    coverImage,
    images: images.filter((src) => src !== coverImage),
    videos: list(record.videos),
    featured: record.featured === true,
    homeOrder: typeof record.homeOrder === "number" ? record.homeOrder : null,
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

/** Same query key as the rest of the site, so the prerendered cache is reused. */
export function useSiteProjects() {
  const { data, isSuccess } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
  const projects = useMemo(
    () => (data ?? []).map(toSiteProject).filter((project): project is SiteProject => project !== null),
    [data],
  );
  return { projects, loaded: isSuccess };
}
