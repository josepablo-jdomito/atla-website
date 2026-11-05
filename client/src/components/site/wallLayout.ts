import type { SiteProject } from "@/components/site/siteProjects";
import { siteOrder } from "@/components/site/siteProjects";
import { getImageDimensions } from "@shared/imageDelivery";

/**
 * The home wall: every image of every client project, placed like Cosmos
 * (fixed columns, native ratios, shortest column first). JP, 2026-11-05: it
 * has to look alive and varied, never repetitive, so the pool is the whole
 * gallery (235 pieces today), every project spread across the whole wall,
 * and no project sits next to itself. The pool loops only once it runs out.
 * Rule: docs/superpowers/specs/2026-11-05-home-masonry-research.md, section 6.
 */

export type WallTile = {
  slug: string;
  title: string;
  src: string;
  /** gif and image tiles are <img>; a direct mp4/webm loops muted. */
  kind: "image" | "video";
  /** Poster for a video tile: the project cover. */
  poster?: string;
  /** width / height; 1.5 when unknown. */
  ratio: number;
};

/** Atla's own brand, the founder's course and WeLoveDaily are not client work. */
export const NOT_CLIENT_WORK = new Set(["atla", "the-brand-academy", "welove"]);
const NOT_CLIENT_PATTERN = /^(atla|welove|jose\s?pablo)/i;

export function isClientWork(project: Pick<SiteProject, "slug" | "client" | "title">) {
  if (NOT_CLIENT_WORK.has(project.slug)) return false;
  return !NOT_CLIENT_PATTERN.test(project.client) && !NOT_CLIENT_PATTERN.test(project.title);
}

/** The Sanity asset id in a URL (`…/7cc46aa6…-2616x1445.png` → `7cc46aa6…`), or the file name. */
export function assetKey(src: string) {
  const file = src.split("?")[0].split("/").pop() ?? src;
  return file.replace(/-\d+x\d+\.[a-z0-9]+$/i, "").replace(/\.[a-z0-9]+$/i, "");
}

export function coverRatio(src: string) {
  const dims = getImageDimensions(src);
  return dims && dims.width > 0 && dims.height > 0 ? dims.width / dims.height : 1.5;
}

/** Only direct files loop in a <video>; Vimeo player URLs need an iframe and stay off the wall. */
export function directVideo(src: string) {
  return /\.(mp4|webm|m4v|mov)(\?|#|$)/i.test(src) || /cdn\.sanity\.io\/files\//i.test(src);
}

function tilesOf(project: SiteProject): WallTile[] {
  const base = { slug: project.slug, title: project.title };
  const images = [project.coverImage, ...project.images].map((src) => ({
    ...base,
    src,
    kind: "image" as const,
    ratio: coverRatio(src),
  }));
  const videos = project.videos.filter(directVideo).map((src) => ({
    ...base,
    src,
    kind: "video" as const,
    poster: project.coverImage,
    ratio: 16 / 9,
  }));
  // The first video plays second, right after the cover, so motion shows up early.
  return videos.length > 0 ? [images[0], videos[0], ...images.slice(1), ...videos.slice(1)] : images;
}

/**
 * The reading sequence: every piece of every client project, spread evenly.
 * At each slot the project that is furthest behind (fewest of its pieces
 * shown, as a share) goes next, so a 16-image project is dealt across the
 * whole wall instead of bunching at the end. A project never follows itself
 * and the ratio alternates whenever a candidate allows it.
 */
/** Small seeded PRNG (mulberry32), so one page load keeps one order across re-renders. */
function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * `seed` 0 keeps the site order (the prerender). Any other seed shuffles the
 * projects and every project's pieces, so each load of the page deals a new
 * wall (JP, 2026-11-05).
 */
export function buildWallSequence(projects: SiteProject[], seed = 0, ordered = false): WallTile[] {
  const random = seed && !ordered ? seededRandom(seed) : null;
  // `ordered` keeps the given order (search results ranked best first) and each cover first.
  let decks = (ordered ? projects : siteOrder(projects))
    .filter(isClientWork)
    .map(tilesOf)
    .filter((deck) => deck.length > 0);
  if (random) decks = shuffled(decks.map((deck) => shuffled(deck, random)), random);
  const cursors = decks.map(() => 0);
  const total = decks.reduce((sum, deck) => sum + deck.length, 0);
  const sequence: WallTile[] = [];
  while (sequence.length < total) {
    const last = sequence[sequence.length - 1];
    const candidates = decks
      .map((deck, i) => ({ i, progress: cursors[i] / deck.length, tile: deck[cursors[i]] }))
      .filter((c) => c.tile)
      .sort((a, b) => a.progress - b.progress);
    const others = candidates.filter((c) => !last || c.tile.slug !== last.slug);
    const wantPortrait = last ? last.ratio >= 1 : false;
    // Only the least-shown third may jump the queue for a better ratio; spread beats rhythm.
    const window = others.slice(0, Math.max(1, Math.ceil(others.length / 3)));
    const pick = window.find((c) => c.tile.ratio < 1 === wantPortrait) ?? others[0] ?? candidates[0];
    sequence.push(pick.tile);
    cursors[pick.i] += 1;
  }
  return sequence;
}

/** Pass `n` of the wall: the sequence rotated `n` tiles, so every piece shifts a column. */
export function wallPass(sequence: WallTile[], pass: number): WallTile[] {
  if (sequence.length === 0) return [];
  const shift = (pass * 7) % sequence.length;
  return [...sequence.slice(shift), ...sequence.slice(0, shift)];
}

/**
 * Shortest-column-first placement. Heights are in column widths, so no
 * measurement is needed. A tile never lands directly under its own project:
 * when the shortest column ends in the same slug, the next shortest takes it.
 */
export function placeInColumns<T extends { ratio: number; slug?: string }>(tiles: T[], columns: number): T[][] {
  const count = Math.max(1, columns);
  const heights = new Array<number>(count).fill(0);
  const placed: T[][] = Array.from({ length: count }, () => []);
  for (const tile of tiles) {
    const byHeight = heights.map((h, i) => i).sort((a, b) => heights[a] - heights[b] || a - b);
    const target =
      byHeight.find((i) => !tile.slug || placed[i][placed[i].length - 1]?.slug !== tile.slug) ?? byHeight[0];
    placed[target].push(tile);
    heights[target] += 1 / tile.ratio;
  }
  return placed;
}
