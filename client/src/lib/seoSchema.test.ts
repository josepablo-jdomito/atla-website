import { describe, expect, it } from "vitest";
import { creativeWorkSchema } from "./seoSchema";

const PROJECT = {
  slug: "rustico",
  title: "Rústico",
  description: "A resort brand in the desert.",
  heroImage: "https://cdn.sanity.io/images/p/production/a-100x100.jpg",
  gallery: ["https://cdn.sanity.io/images/p/production/b-100x100.jpg"],
  year: "2026",
  sector: "Hospitality & Travel",
  disciplines: ["Brand Identity", "Website"],
  place: "Mexico",
  stage: "New brand",
  searchTerms: ["resort", "boutique hotel"],
  locationName: "Los Cabos, Mexico",
};

describe("creativeWorkSchema", () => {
  it("creativeWorkSchema has required fields", () => {
    const schema = creativeWorkSchema(PROJECT) as Record<string, any>;
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("CreativeWork");
    expect(schema.name).toContain("Rústico");
    expect(schema.url).toBe("https://www.atla.design/projects/rustico");
    expect(schema.image[0]).toBe(PROJECT.heroImage);
    expect(schema.creator["@type"]).toBe("Organization");
    expect(schema.dateCreated).toBe("2026");
    expect(schema.about).toBe("Hospitality & Travel");
    expect(schema.genre).toBe("Brand Identity");
    expect(schema.keywords).toBe("Brand Identity, Website, resort, boutique hotel");
    expect(schema.contentLocation).toEqual({ "@type": "Place", name: "Los Cabos, Mexico" });
  });

  it("leaves out dateCreated, about, genre, keywords and location when they are empty", () => {
    const schema = creativeWorkSchema({ ...PROJECT, year: "", sector: "", disciplines: [], searchTerms: [], locationName: "" }) as Record<string, any>;
    for (const key of ["dateCreated", "about", "genre", "keywords", "contentLocation"]) expect(schema).not.toHaveProperty(key);
    expect(() => JSON.parse(JSON.stringify(schema))).not.toThrow();
  });
});
