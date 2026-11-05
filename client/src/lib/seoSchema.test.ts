import { describe, expect, it } from "vitest";
import { creativeWorkSchema } from "./seoSchema";

const PROJECT = {
  slug: "rustico",
  title: "Rústico",
  description: "A resort brand in the desert.",
  heroImage: "https://cdn.sanity.io/images/p/production/a-100x100.jpg",
  gallery: ["https://cdn.sanity.io/images/p/production/b-100x100.jpg"],
  year: "2026",
  industry: "Hospitality",
  client: "Acre Resort",
  region: "America",
  services: ["Branding"],
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
    expect(schema.about[0]).toBe("Hospitality");
  });

  it("leaves out dateCreated when the year is not a number, and drops empty about entries", () => {
    const schema = creativeWorkSchema({ ...PROJECT, year: "", industry: "", client: "" }) as Record<string, any>;
    expect(schema).not.toHaveProperty("dateCreated");
    expect(schema.about).toEqual(["America", "Branding"]);
    expect(() => JSON.parse(JSON.stringify(schema))).not.toThrow();
  });
});
