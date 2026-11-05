import { describe, expect, it } from "vitest";
import type { Project } from "@shared/schema";
import { featuredProjects, toSiteProject, type SiteProject } from "./siteProjects";
import { playableVideo } from "./ProjectCard";
import { buildFacetOptions, matchesFilters } from "./Archive";

const COVER = "https://cdn.sanity.io/images/p/production/abc-1400x868.jpg";

function project(overrides: Partial<SiteProject>): SiteProject {
  return {
    slug: "a",
    title: "A",
    client: "A",
    industry: "Hospitality",
    region: "America",
    services: ["Branding"],
    service: "Branding",
    tags: [],
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
      industry: "Hospitality",
      region: "America",
      services: ["Branding", "Website"],
      tags: ["Hotel"],
      year: 2026,
      coverImage: COVER,
      images: [COVER, "https://cdn.sanity.io/images/p/production/def-800x600.jpg"],
      videos: [],
      featured: true,
      homeOrder: 2,
    } as unknown as Project;
    const site = toSiteProject(raw)!;
    expect(site.client).toBe("Rústico");
    expect(site.service).toBe("Branding");
    expect(site.images).toEqual(["https://cdn.sanity.io/images/p/production/def-800x600.jpg"]);
    expect(site.homeOrder).toBe(2);
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
  it("builds facets with All first, preferred order, no Unspecified", () => {
    expect(buildFacetOptions(["Digital", "hospitality", "Unspecified", "Zoo", "Hospitality"], ["Hospitality", "Digital"])).toEqual([
      "All",
      "Hospitality",
      "Digital",
      "Zoo",
    ]);
  });

  it("matches every active filter", () => {
    const p = project({ region: "Europe", industry: "SaaS", service: "Website", year: 2024 });
    const all = { region: "All", industry: "All", service: "All", year: "All" };
    expect(matchesFilters(p, all)).toBe(true);
    expect(matchesFilters(p, { ...all, region: "Europe", year: "2024" })).toBe(true);
    expect(matchesFilters(p, { ...all, industry: "Hospitality" })).toBe(false);
  });
});
