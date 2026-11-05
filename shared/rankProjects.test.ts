import { describe, expect, it } from "vitest";
import { rankProjects, type ProjectLite } from "./rankProjects.ts";

const p = (slug: string, industry: string, services: string[], tags: string[], year: number, region = "America"): ProjectLite => ({
  slug,
  title: slug.replace(/-/g, " "),
  industry,
  region,
  services,
  tags,
  year,
  coverImage: "",
});

export const FIXTURES: ProjectLite[] = [
  p("the-bridge", "Hospitality", ["Branding", "Website"], ["hotel", "boutique hotel"], 2023),
  p("ando", "Consumer Goods", ["Packaging", "Branding"], ["cpg", "coffee"], 2022),
  p("angeles-wellness", "Consumer Goods", ["Branding"], ["wellness", "beauty"], 2024),
  p("nova", "SaaS", ["Website", "Branding"], ["ai", "platform"], 2025, "Europe"),
  p("pax-and-beneficia", "Food & Beverage", ["Branding", "Packaging"], ["wine", "spirits"], 2021),
  p("kin", "Digital", ["Website"], ["app"], 2020, "Asia"),
  p("old-table", "Hospitality", ["Art Direction"], ["restaurant"], 2019),
];

describe("rankProjects", () => {
  it("rankProjects exact tag match ranks first", () => {
    const { projects, closest } = rankProjects("Wine", FIXTURES);
    expect(closest).toBe(false);
    expect(projects[0].slug).toBe("pax-and-beneficia");
  });

  it("weights title and industry above services, tags and region", () => {
    const { projects } = rankProjects("packaging hospitality", FIXTURES);
    // Industry (3) beats a service match (2); newest first on ties.
    expect(projects.map((x) => x.slug)).toEqual(["the-bridge", "old-table", "ando", "pax-and-beneficia"]);
  });

  it("only returns projects that matched", () => {
    const { projects } = rankProjects("europe", FIXTURES);
    expect(projects.map((x) => x.slug)).toEqual(["nova"]);
  });

  it("no exact match returns closest", () => {
    const { projects, closest } = rankProjects("brand for a hospital", FIXTURES);
    expect(closest).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
    expect(projects.length).toBeLessThanOrEqual(6);
    // Nothing overlaps, so the 6 most recent.
    expect(projects.map((x) => x.slug)).toEqual(["nova", "angeles-wellness", "the-bridge", "ando", "pax-and-beneficia", "kin"]);
  });

  it("closest uses the synonym map before recency", () => {
    const { projects, closest } = rankProjects("a cafe in Lisbon", FIXTURES);
    expect(closest).toBe(true);
    // cafe -> Food & Beverage (two words overlap) and Hospitality (one), then recency.
    expect(projects.slice(0, 3).map((x) => x.slug)).toEqual(["pax-and-beneficia", "the-bridge", "old-table"]);
    expect(projects).toHaveLength(6);
  });

  it("maps the two-word synonym real estate", () => {
    const { projects, closest } = rankProjects("real estate developer", FIXTURES);
    expect(closest).toBe(true);
    expect(projects.slice(0, 2).map((x) => x.slug)).toEqual(["the-bridge", "old-table"]);
  });

  it("fintech with no direct hit returns the tech industries first", () => {
    const { projects, closest } = rankProjects("fintech", FIXTURES);
    expect(closest).toBe(true);
    // SaaS and Digital are the live tech-ish industries.
    expect(projects.slice(0, 2).map((x) => x.industry)).toEqual(["SaaS", "Digital"]);
    expect(projects.slice(0, 2).map((x) => x.slug)).toEqual(["nova", "kin"]);
  });

  it("counts tag overlap in the closest fallback", () => {
    // "residence" maps to hospitality; only a tag says so here.
    const tagged = [...FIXTURES, p("casa-norte", "Unspecified", ["Branding"], ["hospitality"], 2010)];
    const { projects } = rankProjects("a residence", tagged);
    expect(projects.slice(0, 3).map((x) => x.slug)).toContain("casa-norte");
  });

  it("empty or junk query returns closest without throwing", () => {
    expect(rankProjects("", FIXTURES).closest).toBe(true);
    expect(rankProjects("<script>alert(1)</script>", FIXTURES).closest).toBe(true);
    expect(rankProjects("", []).projects).toEqual([]);
  });
});
