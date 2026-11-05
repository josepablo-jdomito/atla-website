import { describe, expect, it } from "vitest";
import type { SiteProject } from "./siteProjects";
import { buildWallSequence, isClientWork, placeInColumns, wallPass } from "./wallLayout";

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

describe("buildWallSequence", () => {
  const pool = [
    ...Array.from({ length: 6 }, (_, i) => project(`p${i}`, portrait)),
    ...Array.from({ length: 14 }, (_, i) => project(`l${i}`, landscape)),
    project("atla", landscape),
  ];
  const sequence = buildWallSequence(pool);

  it("uses every client cover once and never two portraits in a row", () => {
    expect(sequence).toHaveLength(20);
    expect(new Set(sequence.map((t) => t.slug)).size).toBe(20);
    for (let i = 1; i < sequence.length; i += 1) {
      expect(sequence[i - 1].ratio < 1 && sequence[i].ratio < 1).toBe(false);
    }
  });

  it("spreads the portraits instead of bunching them at the end", () => {
    const positions = sequence.map((t, i) => (t.ratio < 1 ? i : -1)).filter((i) => i >= 0);
    expect(positions[0]).toBeLessThan(5);
    expect(positions.at(-1)).toBeGreaterThan(14);
  });

  it("rotates each pass so a cover changes column", () => {
    const second = wallPass(sequence, 1);
    expect(second[0].slug).toBe(sequence[1].slug);
    expect(second.at(-1)!.slug).toBe(sequence[0].slug);
  });
});

describe("placeInColumns", () => {
  it("puts each tile in the shortest column", () => {
    const tiles = [{ ratio: 1.78 }, { ratio: 1.78 }, { ratio: 0.75 }, { ratio: 1.78 }, { ratio: 1.78 }];
    const columns = placeInColumns(tiles, 2);
    // Ties go left: column 0 takes a landscape and then the tall portrait, so the last two landscapes stack in column 1.
    expect(columns[0].map((t) => t.ratio)).toEqual([1.78, 0.75]);
    expect(columns[1].map((t) => t.ratio)).toEqual([1.78, 1.78, 1.78]);
  });
});
