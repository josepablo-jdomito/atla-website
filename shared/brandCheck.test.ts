import { describe, expect, it } from "vitest";
import {
  BRAND_CHECK_INVESTING,
  BRAND_CHECK_MOMENTS,
  BRAND_CHECK_SIZES,
  EMPTY_BRAND_CHECK,
  brandCheckSchema,
  brandFromSite,
} from "./brandCheck";

const VALID = {
  name: "Ana Ruiz",
  email: "ana@casamar.example",
  site: "casamar.example",
  moment: "launch",
  size: "solo",
  investing: "yes",
  message: "",
};

describe("brandCheckSchema", () => {
  it("accepts a website or an Instagram, with or without a message", () => {
    for (const site of ["casamar.example", "https://www.casamar.example/about", "@casa.mar_", "instagram.com/casamar"]) {
      expect(brandCheckSchema.safeParse({ ...VALID, site }).success, site).toBe(true);
    }
    expect(brandCheckSchema.parse({ ...VALID, message: undefined }).message).toBe("");
  });

  it("refuses an empty form, a site with spaces or without a dot, and options it does not offer", () => {
    const issues = brandCheckSchema.safeParse(EMPTY_BRAND_CHECK);
    expect(issues.success).toBe(false);
    const fields = new Set(!issues.success ? issues.error.issues.map((i) => i.path[0]) : []);
    expect([...fields].sort()).toEqual(["email", "investing", "moment", "name", "site", "size"]);
    for (const site of ["my brand", "casamar", "@", "@has space"]) {
      expect(brandCheckSchema.safeParse({ ...VALID, site }).success, site).toBe(false);
    }
    expect(brandCheckSchema.safeParse({ ...VALID, moment: "someday" }).success).toBe(false);
  });

  it("offers the moments of the services page plus Not sure, three sizes and a group, and three answers on investing", () => {
    expect(BRAND_CHECK_MOMENTS.map((o) => o.label)).toEqual(["Launch", "Raise capital", "Grow", "Reposition", "Not sure"]);
    expect(BRAND_CHECK_SIZES.map((o) => o.label)).toEqual(["Just me", "A small team", "A company", "A group of brands"]);
    expect(BRAND_CHECK_INVESTING.map((o) => o.label)).toEqual(["Not yet", "Maybe", "Yes"]);
  });
});

describe("brandFromSite", () => {
  it("names the brand by its host or its handle, and falls back to the name", () => {
    expect(brandFromSite("www.casamar.example")).toBe("casamar.example");
    expect(brandFromSite("@casamar")).toBe("@casamar");
    expect(brandFromSite("https://instagram.com/casamar")).toBe("@casamar");
    expect(brandFromSite("instagram.com", "Ana")).toBe("instagram.com");
    expect(brandFromSite("::", "Ana")).toBe("Ana");
  });
});
