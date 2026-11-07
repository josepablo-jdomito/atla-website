import { describe, expect, it } from "vitest";
import {
  DISCIPLINES,
  FACETS_BY_SLUG,
  SECTORS,
  STAGES,
  facetSlug,
  matchFacetValue,
  placeFromCountry,
  resolveProjectFacets,
} from "./projectFacets.ts";

describe("placeFromCountry", () => {
  it("maps the five places from the country strings the documents carry", () => {
    expect(placeFromCountry("United States")).toBe("United States");
    expect(placeFromCountry("US")).toBe("United States");
    expect(placeFromCountry("USA")).toBe("United States");
    expect(placeFromCountry("Mexico")).toBe("Mexico");
    expect(placeFromCountry("México")).toBe("Mexico");
    expect(placeFromCountry("United States & Mexico")).toBe("United States & Mexico");
    expect(placeFromCountry("US & Mexico")).toBe("United States & Mexico");
    expect(placeFromCountry("Mexico and United States")).toBe("United States & Mexico");
    expect(placeFromCountry("United Arab Emirates")).toBe("Middle East");
    expect(placeFromCountry("UAE")).toBe("Middle East");
    expect(placeFromCountry("Indonesia")).toBe("International");
    expect(placeFromCountry("Netherlands")).toBe("International");
    expect(placeFromCountry("Canada")).toBe("International");
  });

  it("gives nothing for an empty country instead of guessing", () => {
    expect(placeFromCountry("")).toBe("");
    expect(placeFromCountry(null)).toBe("");
    expect(placeFromCountry("   ")).toBe("");
  });
});

describe("facet slugs", () => {
  it("round-trips every list value through its URL form", () => {
    for (const value of [...SECTORS, ...DISCIPLINES, ...STAGES]) {
      expect(facetSlug(value)).toMatch(/^[a-z0-9-]+$/);
      expect(matchFacetValue(SECTORS, facetSlug(value)) || matchFacetValue(DISCIPLINES, facetSlug(value)) || matchFacetValue(STAGES, facetSlug(value))).toBe(value);
    }
    expect(facetSlug("Food & Drink")).toBe("food-drink");
    expect(matchFacetValue(SECTORS, "FOOD & drink")).toBe("Food & Drink");
    expect(matchFacetValue(SECTORS, "nope")).toBe("");
  });
});

describe("resolveProjectFacets", () => {
  it("reads stored fields and derives place from country", () => {
    const facets = resolveProjectFacets({
      slug: "alma-brava",
      country: "Mexico",
      sector: "Health & Wellness",
      disciplines: ["Website", "Brand Identity", "Website"],
      stage: "Rebrand",
      searchTerms: ["Clinic", "pilates"],
    });
    expect(facets).toEqual({
      sector: "Health & Wellness",
      disciplines: ["Website", "Brand Identity"],
      stage: "Rebrand",
      place: "Mexico",
      searchTerms: ["clinic", "pilates"],
    });
  });

  it("falls back to the section 4 table by slug while the document has no facets", () => {
    const facets = resolveProjectFacets({ slug: "alma-brava", country: "Mexico" });
    expect(facets.sector).toBe("Food & Drink");
    expect(facets.disciplines).toEqual(["Packaging", "Brand Identity", "Art Direction"]);
    expect(facets.stage).toBe("New brand");
    expect(facets.place).toBe("Mexico");
    expect(facets.searchTerms).toContain("mezcal");
  });

  it("applies JP's answers from section 6", () => {
    expect(resolveProjectFacets({ slug: "casa-colora" }).sector).toBe("Family & Pets");
    expect(resolveProjectFacets({ slug: "munda" }).sector).toBe("Hospitality & Travel");
    expect(resolveProjectFacets({ slug: "pathize-health" }).sector).toBe("Technology & Digital");
    expect(resolveProjectFacets({ slug: "atla" }).sector).toBe("Media & Education");
    expect(resolveProjectFacets({ slug: "hanks-leather" }).stage).toBe("Rebrand");
    expect(resolveProjectFacets({ slug: "vyv" }).stage).toBe("New brand");
    expect(resolveProjectFacets({ slug: "welove" }).stage).toBe("In-house");
    expect(resolveProjectFacets({ slug: "baristio" }).disciplines).toContain("Motion");
    expect(resolveProjectFacets({ slug: "bovi-health" }).searchTerms).not.toContain("functional health");
  });

  it("invents nothing for an unknown slug", () => {
    expect(resolveProjectFacets({ slug: "brand-new", country: "Peru" })).toEqual({
      sector: "",
      disciplines: [],
      stage: "",
      place: "International",
      searchTerms: [],
    });
  });

  it("the table only holds list values, Brand Identity on every row, at most 8 terms", () => {
    const rows = Object.entries(FACETS_BY_SLUG);
    expect(rows).toHaveLength(34);
    for (const [slug, [sector, disciplines, stage, terms]] of rows) {
      expect(SECTORS, slug).toContain(sector);
      expect(STAGES, slug).toContain(stage);
      expect(disciplines, slug).toContain("Brand Identity");
      for (const d of disciplines) expect(DISCIPLINES, slug).toContain(d);
      expect(terms.length, slug).toBeLessThanOrEqual(8);
      for (const term of terms) expect(term, slug).toBe(term.toLowerCase());
    }
  });
});
