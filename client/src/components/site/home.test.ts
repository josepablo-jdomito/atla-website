import { describe, expect, it } from "vitest";
import type { Project } from "@shared/schema";
import { featuredProjects, toSiteProject, type SiteProject } from "./siteProjects";
import { playableVideo } from "./ProjectCard";
import { buildFacetOptions, filtersFromSearch, matchesFilters, searchFromFilters, wallHrefFor } from "./workFilters";
import { DISCIPLINES, SECTORS } from "@shared/projectFacets";

const COVER = "https://cdn.sanity.io/images/p/production/abc-1400x868.jpg";

function project(overrides: Partial<SiteProject>): SiteProject {
  return {
    slug: "a",
    title: "A",
    client: "A",
    country: "United States",
    sector: "Hospitality & Travel",
    disciplines: ["Brand Identity"],
    stage: "New brand",
    place: "United States",
    searchTerms: [],
    year: 2025,
    coverImage: COVER,
    images: [],
    videos: [],
    featured: true,
    homeOrder: null,
    ...overrides,
  };
}

describe("toSiteProject", () => {
  it("keeps the fields the home reads and drops the cover from the gallery", () => {
    const raw = {
      slug: "rustico",
      title: "Rústico",
      client: "",
      country: "Mexico",
      sector: "Hospitality & Travel",
      disciplines: ["Brand Identity", "Website"],
      stage: "New brand",
      searchTerms: ["resort"],
      year: 2026,
      coverImage: COVER,
      images: [COVER, "https://cdn.sanity.io/images/p/production/def-800x600.jpg"],
      videos: [],
      featured: true,
      homeOrder: 2,
    } as unknown as Project;
    const site = toSiteProject(raw)!;
    expect(site.client).toBe("Rústico");
    expect(site.sector).toBe("Hospitality & Travel");
    expect(site.disciplines).toEqual(["Brand Identity", "Website"]);
    expect(site.place).toBe("Mexico");
    expect(site.images).toEqual(["https://cdn.sanity.io/images/p/production/def-800x600.jpg"]);
    expect(site.homeOrder).toBe(2);
  });

  it("falls back to the facet table by slug when the API carries no facets", () => {
    const site = toSiteProject({ slug: "alma-brava", country: "Mexico", coverImage: COVER, images: [] } as unknown as Project)!;
    expect(site.sector).toBe("Food & Drink");
    expect(site.disciplines[0]).toBe("Packaging");
    expect(site.place).toBe("Mexico");
  });

  it("drops projects with no usable image", () => {
    expect(toSiteProject({ slug: "x", coverImage: "javascript:alert(1)", images: [] } as unknown as Project)).toBeNull();
  });
});

describe("featuredProjects", () => {
  it("orders by homeOrder, then newest, and caps the list", () => {
    const list = [
      project({ slug: "old", year: 2023 }),
      project({ slug: "second", homeOrder: 2 }),
      project({ slug: "hidden", featured: false, homeOrder: 1 }),
      project({ slug: "first", homeOrder: 1 }),
      project({ slug: "new", year: 2026 }),
    ];
    expect(featuredProjects(list, 3).map((p) => p.slug)).toEqual(["first", "second", "new"]);
  });
});

describe("playableVideo", () => {
  it("accepts direct files and refuses player embeds", () => {
    expect(playableVideo(["https://cdn.sanity.io/files/p/production/x.mp4"])).toBe("https://cdn.sanity.io/files/p/production/x.mp4");
    expect(playableVideo(["https://example.com/loop.webm?v=1"])).toBe("https://example.com/loop.webm?v=1");
    expect(playableVideo(["https://player.vimeo.com/video/1165518432"])).toBeNull();
    expect(playableVideo([])).toBeNull();
  });
});

describe("archive filters", () => {
  it("builds options from the controlled list, in list order, only values present, and hides Brand Identity", () => {
    expect(buildFacetOptions(["Technology & Digital", "Unspecified", "Zoo", "Hospitality & Travel"], SECTORS)).toEqual([
      "All",
      "Hospitality & Travel",
      "Technology & Digital",
    ]);
    expect(buildFacetOptions(["Brand Identity", "Website", "Packaging"], DISCIPLINES, ["Brand Identity"])).toEqual([
      "All",
      "Packaging",
      "Website",
    ]);
  });

  it("matches every active filter, disciplines by inclusion", () => {
    const p = project({ place: "International", sector: "Technology & Digital", disciplines: ["Brand Identity", "Website"], year: 2024 });
    const all = { sector: "All", discipline: "All", place: "All", year: "All" };
    expect(matchesFilters(p, all)).toBe(true);
    expect(matchesFilters(p, { ...all, place: "International", year: "2024" })).toBe(true);
    expect(matchesFilters(p, { ...all, discipline: "Website" })).toBe(true);
    expect(matchesFilters(p, { ...all, discipline: "Packaging" })).toBe(false);
    expect(matchesFilters(p, { ...all, sector: "Hospitality & Travel" })).toBe(false);
  });

  it("reads and writes slug values in the URL, and keeps the old keys as aliases", () => {
    const filters = { sector: "Food & Drink", discipline: "Packaging", place: "All", year: "2025" };
    expect(searchFromFilters(filters, "gin")).toBe("?q=gin&sector=food-drink&discipline=packaging&year=2025");
    expect(filtersFromSearch("?sector=food-drink&discipline=packaging&year=2025")).toEqual({ ...filters });
    expect(filtersFromSearch("?sector=Food%20%26%20Drink").sector).toBe("Food & Drink");
    expect(filtersFromSearch("?sector=nope&year=abc")).toEqual({ sector: "All", discipline: "All", place: "All", year: "All" });
    expect(filtersFromSearch("?industry=Hospitality&service=Packaging&region=Middle%20East")).toEqual({
      sector: "Hospitality & Travel",
      discipline: "Packaging",
      place: "Middle East",
      year: "All",
    });
    expect(wallHrefFor("sector", "Health & Wellness")).toBe("/?sector=health-wellness");
  });
});
