import type { SiteProject } from "@/components/site/siteProjects";
import { featuredProjects } from "@/components/site/siteProjects";
import { isClientWork, seededRandom, shuffled } from "@/components/site/wallLayout";

/** Why Atla's thumbnail: the about page's own hero. */
export const ABOUT_HERO = "/figmaAssets/about-hero.jpg";

export type MenuThumbPicks = {
  /** The Services row: the slug whose cover sits beside Strategy on /services. */
  services?: string;
  /** The Ventures row: the first of these slugs that has a cover. */
  ventures: string[];
};

/**
 * One thumbnail per menu row (JP's reference, 2026-11-06), keyed by the row's href. Never the same image
 * twice. Fixed picks first (Services, Ventures, Why Atla), then Work takes a piece from a shuffled featured
 * project, and Contact and Start a project take featured covers nobody used. `seed` 0 keeps the site order.
 */
export function menuThumbs(projects: SiteProject[], seed: number, picks: MenuThumbPicks): Record<string, string | undefined> {
  const random = seed ? seededRandom(seed) : null;
  const deal = <T,>(items: T[]) => (random ? shuffled(items, random) : items);
  const used = new Set<string>();
  const take = (src: string | undefined) => {
    if (!src || used.has(src)) return undefined;
    used.add(src);
    return src;
  };
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const client = projects.filter(isClientWork);
  const featured = featuredProjects(client, client.length);
  const lead = new Set(featured.map((project) => project.slug));
  const pool = [...deal(featured), ...deal(client.filter((project) => !lead.has(project.slug)))];
  const nextCover = () => {
    for (const project of pool) {
      const src = take(project.coverImage);
      if (src) return src;
    }
    return undefined;
  };

  const services = take(picks.services ? bySlug.get(picks.services)?.coverImage : undefined);
  let ventures: string | undefined;
  for (const slug of picks.ventures) {
    ventures = take(bySlug.get(slug)?.coverImage);
    if (ventures) break;
  }
  const about = take(ABOUT_HERO);
  let work: string | undefined;
  for (const project of pool) {
    work = take(deal([project.coverImage, ...project.images]).find((src) => !used.has(src)));
    if (work) break;
  }
  return {
    "/": work,
    "/services": services ?? nextCover(),
    "/about": about,
    "/ventures": ventures ?? nextCover(),
    "/contact": nextCover(),
    "/brief": nextCover(),
  };
}
