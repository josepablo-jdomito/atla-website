import { describe, expect, it } from "vitest";
import { rankProjects, type ProjectLite } from "./rankProjects.ts";

const p = (
  slug: string,
  sector: string,
  disciplines: string[],
  searchTerms: string[],
  year: number,
  place = "United States",
  stage = "New brand",
): ProjectLite => ({
  slug,
  title: slug.replace(/-/g, " "),
  sector,
  disciplines,
  stage,
  place,
  searchTerms,
  year,
  coverImage: "",
});

export const FIXTURES: ProjectLite[] = [
  p("the-bridge", "Hospitality & Travel", ["Brand Identity", "Art Direction"], ["hotel", "restaurant", "bali"], 2024, "International"),
  p("ando", "Health & Wellness", ["Packaging", "Brand Identity"], ["gummies", "supplements"], 2022),
  p("angeles-wellness", "Health & Wellness", ["Brand Identity", "Motion"], ["wellness"], 2024),
  p("anything-ai", "Technology & Digital", ["Website", "Brand Identity", "Motion"], ["ai", "creative platform", "app"], 2025),
  p("sexto-abismo", "Food & Drink", ["Packaging", "Brand Identity", "Art Direction"], ["gin", "craft gin", "bottle"], 2025, "Mexico"),
  p("hanks-leather", "Fashion & Lifestyle", ["Website", "Brand Identity"], ["leather goods", "e-commerce"], 2020, "United States", "Rebrand"),
  p("tigretigre", "Hospitality & Travel", ["Brand Identity", "Signage & Spaces"], ["restaurant", "fine dining", "menu"], 2019, "Mexico"),
];

describe("rankProjects", () => {
  it("an exact search-term match ranks first", () => {
    const { projects, closest } = rankProjects("Gin", FIXTURES);
    expect(closest).toBe(false);
    expect(projects[0].slug).toBe("sexto-abismo");
  });

  it("weights title and sector above disciplines, search terms and place", () => {
    const { projects } = rankProjects("packaging hospitality", FIXTURES);
    // Sector (3) beats a discipline match (2); newest first on ties.
    expect(projects.map((x) => x.slug)).toEqual(["the-bridge", "tigretigre", "sexto-abismo", "ando"]);
  });

  it("scores stage and place", () => {
    expect(rankProjects("rebrand", FIXTURES).projects.map((x) => x.slug)).toEqual(["hanks-leather"]);
    expect(rankProjects("mexico", FIXTURES).projects.map((x) => x.slug)).toEqual(["sexto-abismo", "tigretigre"]);
  });

  it("brand identity is a stopword, so it never matches everything", () => {
    const { closest } = rankProjects("brand identity", FIXTURES);
    expect(closest).toBe(true);
  });

  it("no exact match returns closest", () => {
    const { projects, closest } = rankProjects("brand for a hospital", FIXTURES);
    expect(closest).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
    expect(projects.length).toBeLessThanOrEqual(6);
    // Nothing overlaps, so the 6 most recent.
    expect(projects.map((x) => x.slug)).toEqual(["anything-ai", "sexto-abismo", "the-bridge", "angeles-wellness", "ando", "hanks-leather"]);
  });

  it("synonyms score as direct matches, one point per project, then recency", () => {
    const { projects, closest } = rankProjects("a cafe in Lisbon", FIXTURES);
    expect(closest).toBe(false);
    // cafe -> Hospitality & Travel: the hospitality projects, newest first.
    expect(projects.map((x) => x.slug)).toEqual(["the-bridge", "tigretigre"]);
  });

  it("maps the two-word synonym real estate and the stage synonyms", () => {
    const estate = [...FIXTURES, p("torre-avancer", "Real Estate & Finance", ["Brand Identity", "Signage & Spaces"], ["tower"], 2025, "Mexico")];
    expect(rankProjects("real estate developer", estate).projects.map((x) => x.slug)).toEqual(["torre-avancer"]);
    expect(rankProjects("a refresh of our logo", FIXTURES).projects.map((x) => x.slug)).toEqual(["hanks-leather"]);
  });

  it("fintech reaches Real Estate & Finance and ai reaches Technology & Digital", () => {
    const estate = [...FIXTURES, p("castro-capital", "Real Estate & Finance", ["Brand Identity"], ["investment", "capital"], 2025, "Mexico")];
    expect(rankProjects("fintech", estate).projects.map((x) => x.slug)).toEqual(["castro-capital"]);
    expect(rankProjects("an ai startup", FIXTURES).projects[0].slug).toBe("anything-ai");
  });

  it("a synonym can hit through a search term alone", () => {
    // "bottle" maps to Packaging; here only a hidden search term says packaging.
    const tagged = [...FIXTURES, p("casa-norte", "Food & Drink", ["Brand Identity"], ["packaging"], 2010)];
    const { projects } = rankProjects("a bottle", tagged);
    expect(projects.map((x) => x.slug)).toContain("casa-norte");
    expect(projects.map((x) => x.slug)).toContain("sexto-abismo");
  });

  it("empty or junk query returns closest without throwing", () => {
    expect(rankProjects("", FIXTURES).closest).toBe(true);
    expect(rankProjects("<script>alert(1)</script>", FIXTURES).closest).toBe(true);
    expect(rankProjects("", []).projects).toEqual([]);
  });
});
