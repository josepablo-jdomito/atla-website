import { describe, expect, it } from "vitest";
import type { SiteProject } from "./siteProjects";
import { buildWallSequence, directVideo, isClientWork, listDrift, wallCells, wallPass } from "./wallLayout";

const portrait = "https://cdn.sanity.io/images/p/production/a-1200x1600.jpg";
const landscape = "https://cdn.sanity.io/images/p/production/b-1600x900.jpg";

function project(slug: string, cover: string, extra: Partial<SiteProject> = {}): SiteProject {
  return {
    slug,
    title: slug,
    client: slug,
    industry: "",
    region: "",
    services: [],
    service: "",
    tags: [],
    year: 2025,
    coverImage: cover,
    images: [],
    videos: [],
    featured: false,
    homeOrder: null,
    ...extra,
  };
}

describe("isClientWork", () => {
  it("keeps the studio, the course and WeLoveDaily off the wall", () => {
    expect(isClientWork(project("atla", landscape))).toBe(false);
    expect(isClientWork(project("the-brand-academy", portrait, { client: "JosePablo" }))).toBe(false);
    expect(isClientWork(project("welove", portrait))).toBe(false);
    expect(isClientWork(project("rustico", landscape, { client: "Acre Resort" }))).toBe(true);
  });
});

describe("directVideo", () => {
  it("accepts files and refuses player embeds", () => {
    expect(directVideo("https://cdn.sanity.io/files/p/production/x.mp4")).toBe(true);
    expect(directVideo("https://example.com/loop.webm?v=1")).toBe(true);
    expect(directVideo("https://player.vimeo.com/video/1165518432")).toBe(false);
  });
});

describe("buildWallSequence", () => {
  const gallery = (slug: string, n: number, src: string) =>
    Array.from({ length: n }, (_, i) => src.replace("/production/", `/production/${slug}${i}-`));
  const cover = (slug: string, src: string) => gallery(slug, 1, src.replace("/production/", "/production/cover-"))[0];
  const pool = [
    project("p1", cover("p1", portrait), { images: gallery("p1", 4, portrait) }),
    project("l1", cover("l1", landscape), { images: gallery("l1", 6, landscape) }),
    project("p2", cover("p2", portrait), { images: gallery("p2", 3, landscape) }),
    project("l2", cover("l2", landscape), { images: gallery("l2", 2, portrait) }),
    project("atla", cover("atla", landscape), { images: gallery("atla", 5, landscape) }),
    project("v1", cover("v1", landscape), { videos: ["https://cdn.sanity.io/files/p/production/loop.mp4", "https://player.vimeo.com/video/1"] }),
  ];
  const sequence = buildWallSequence(pool);

  it("uses every image of every client project once, plus direct videos", () => {
    // p1 5 + l1 7 + p2 4 + l2 3 + v1 (1 image + 1 video) = 21; atla is out, the Vimeo embed is out.
    expect(sequence).toHaveLength(21);
    expect(new Set(sequence.map((t) => t.src)).size).toBe(21);
    expect(sequence.some((t) => t.slug === "atla")).toBe(false);
    expect(sequence.filter((t) => t.kind === "video")).toHaveLength(1);
  });

  it("never shows a project next to itself", () => {
    for (let i = 1; i < sequence.length; i += 1) expect(sequence[i].slug).not.toBe(sequence[i - 1].slug);
  });

  it("opens with one cover per project and spreads the big project across the wall", () => {
    expect(new Set(sequence.slice(0, 5).map((t) => t.slug)).size).toBe(5);
    const l1 = sequence.map((t, i) => (t.slug === "l1" ? i : -1)).filter((i) => i >= 0);
    expect(l1[0]).toBeLessThan(5);
    expect(l1.at(-1)).toBeGreaterThan(16);
    for (let i = 1; i < l1.length; i += 1) expect(l1[i] - l1[i - 1]).toBeLessThanOrEqual(7);
  });

  it("alternates ratios when it can", () => {
    let runs = 0;
    for (let i = 2; i < sequence.length; i += 1) {
      const a = sequence[i - 2].ratio < 1;
      const b = sequence[i - 1].ratio < 1;
      const c = sequence[i].ratio < 1;
      if (a === b && b === c) runs += 1;
    }
    expect(runs).toBeLessThanOrEqual(3);
  });

  it("rotates each pass so a piece changes column", () => {
    const second = wallPass(sequence, 1);
    expect(second[0].src).toBe(sequence[7].src);
    expect(second.at(-1)!.src).toBe(sequence[6].src);
  });
});

describe("buildWallSequence shuffle", () => {
  const pool = Array.from({ length: 8 }, (_, i) =>
    project(`s${i}`, `https://cdn.sanity.io/images/p/production/s${i}-1600x900.jpg`, {
      images: [`https://cdn.sanity.io/images/p/production/s${i}b-1200x1600.jpg`],
    }),
  );
  it("keeps the site order with seed 0 and deals a different wall per seed", () => {
    const base = buildWallSequence(pool).map((t) => t.src);
    const a = buildWallSequence(pool, 7).map((t) => t.src);
    const b = buildWallSequence(pool, 8).map((t) => t.src);
    expect(base[0]).toContain("s0-");
    expect(a).not.toEqual(base);
    expect(a).not.toEqual(b);
    expect([...a].sort()).toEqual([...base].sort());
  });
  it("is stable for one seed and still never repeats a project back to back", () => {
    const a = buildWallSequence(pool, 42);
    expect(buildWallSequence(pool, 42)).toEqual(a);
    for (let i = 1; i < a.length; i += 1) expect(a[i].slug).not.toBe(a[i - 1].slug);
  });
});

describe("wallCells", () => {
  const perRow = (cells: Array<{ row: number; col: number }>) => {
    const rows: number[][] = [];
    for (const cell of cells) (rows[cell.row] ??= []).push(cell.col);
    return rows;
  };

  it("draws the Figma rows at 4 columns for the prerender: 2, 3, 3, 2, 2 cards", () => {
    expect(perRow(wallCells(12, 4, "masonry"))).toEqual([[0, 2], [0, 1, 3], [0, 2, 3], [1, 2], [0, 3]]);
  });

  it("draws the tablet rows at 3 columns", () => {
    expect(perRow(wallCells(12, 3, "masonry"))).toEqual([[0, 2], [1, 2], [0, 2], [1, 2], [0, 2], [1], [0]]);
  });

  it("keeps the counts per row with any seed, picks other cells, and never puts two cards in one cell", () => {
    const seeded = wallCells(60, 4, "masonry", 42);
    expect(perRow(seeded).map((row) => row.length)).toEqual(perRow(wallCells(60, 4, "masonry")).map((row) => row.length));
    expect(new Set(seeded.map((cell) => `${cell.row}:${cell.col}`)).size).toBe(60);
    expect(perRow(seeded)).not.toEqual(perRow(wallCells(60, 4, "masonry")));
    // Loading more never moves a card already placed.
    expect(wallCells(90, 4, "masonry", 42).slice(0, 60)).toEqual(seeded);
  });

  it("fills every cell in Grid and on a phone's single column", () => {
    expect(wallCells(6, 4, "grid", 7)).toEqual([
      { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 1, col: 0 }, { row: 1, col: 1 },
    ]);
    expect(wallCells(3, 1, "masonry", 7).map((cell) => cell.row)).toEqual([0, 1, 2]);
  });
});

describe("listDrift", () => {
  it("follows the Figma for the prerender and never repeats the row above with a seed", () => {
    expect(listDrift(4)).toEqual([0.2, 0.8, 0, 0.6]);
    const drift = listDrift(40, 9);
    for (let i = 1; i < drift.length; i += 1) expect(drift[i]).not.toBe(drift[i - 1]);
    for (const value of drift) expect(value).toBeGreaterThanOrEqual(0);
    for (const value of drift) expect(value).toBeLessThanOrEqual(0.8);
  });
});
