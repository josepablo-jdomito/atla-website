import type { SiteProject } from "@/components/site/siteProjects";
import { siteOrder } from "@/components/site/siteProjects";
import { getImageDimensions } from "@shared/imageDelivery";

/**
 * The home wall: every client cover, once per pass, placed like Cosmos
 * (fixed columns, native ratios, shortest column first). The pool loops, so
 * repeats are intentional; each pass starts one tile later than the last so a
 * cover never lands in the same column twice in a row.
 * Rule: docs/superpowers/specs/2026-11-05-home-masonry-research.md, section 6.
 */

export type WallTile = {
  slug: string;
  title: string;
  src: string;
  /** width / height of the cover, read from the Sanity URL; 1.5 when unknown. */
  ratio: number;
};

/** Atla's own brand, the founder's course and WeLoveDaily are not client work. */
export const NOT_CLIENT_WORK = new Set(["atla", "the-brand-academy", "welove"]);
const NOT_CLIENT_PATTERN = /^(atla|welove|jose\s?pablo)/i;

export function isClientWork(project: Pick<SiteProject, "slug" | "client" | "title">) {
  if (NOT_CLIENT_WORK.has(project.slug)) return false;
  return !NOT_CLIENT_PATTERN.test(project.client) && !NOT_CLIENT_PATTERN.test(project.title);
}

export function coverRatio(src: string) {
  const dims = getImageDimensions(src);
  return dims && dims.width > 0 && dims.height > 0 ? dims.width / dims.height : 1.5;
}

/**
 * The reading sequence for one pass: the site order split into portraits and
 * landscapes, then merged so a portrait lands every (total / portraits) slots
 * and never next to another portrait.
 */
export function buildWallSequence(projects: SiteProject[]): WallTile[] {
  const pool = siteOrder(projects)
    .filter(isClientWork)
    .map((project) => ({
      slug: project.slug,
      title: project.title,
      src: project.coverImage,
      ratio: coverRatio(project.coverImage),
    }));
  const portraits = pool.filter((tile) => tile.ratio < 1);
  const landscapes = pool.filter((tile) => tile.ratio >= 1);
  if (portraits.length === 0 || landscapes.length === 0) return pool;

  const step = pool.length / portraits.length;
  const sequence: WallTile[] = [];
  let next = step - 1; // the first portrait closes the first row rather than opening it
  let p = 0;
  let l = 0;
  for (let slot = 0; slot < pool.length; slot += 1) {
    const lastWasPortrait = sequence[slot - 1] ? sequence[slot - 1].ratio < 1 : false;
    const portraitDue = slot >= next && p < portraits.length && !lastWasPortrait;
    const landscapesLeft = l < landscapes.length;
    if (portraitDue || !landscapesLeft) {
      sequence.push(portraits[p]);
      p += 1;
      next += step;
    } else {
      sequence.push(landscapes[l]);
      l += 1;
    }
  }
  return sequence;
}

/** Pass `n` of the wall: the sequence rotated `n` tiles, so every cover shifts a column. */
export function wallPass(sequence: WallTile[], pass: number): WallTile[] {
  if (sequence.length === 0) return [];
  const shift = pass % sequence.length;
  return [...sequence.slice(shift), ...sequence.slice(0, shift)];
}

/** Shortest-column-first placement. Heights are in column widths, so no measurement is needed. */
export function placeInColumns<T extends { ratio: number }>(tiles: T[], columns: number): T[][] {
  const count = Math.max(1, columns);
  const heights = new Array<number>(count).fill(0);
  const placed: T[][] = Array.from({ length: count }, () => []);
  for (const tile of tiles) {
    let target = 0;
    for (let i = 1; i < count; i += 1) if (heights[i] < heights[target]) target = i;
    placed[target].push(tile);
    heights[target] += 1 / tile.ratio;
  }
  return placed;
}
