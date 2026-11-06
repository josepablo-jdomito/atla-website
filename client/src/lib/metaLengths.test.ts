import { describe, expect, it } from "vitest";
import { siteCopy } from "../content/siteCopy";
import { JOURNAL_META_DESCRIPTION, formatMetaTitle } from "../../../shared/siteSeo";
import { buildProjectMetaDescription } from "./projectSeo";

// What SeoHead renders: the title gets " | Atla" when it does not name Atla already.
const rendered = (title: string) => (title.includes("Atla") ? title : `${title} | Atla`);

describe("meta lengths (go-live audit)", () => {
  it("every page title is at most 60 characters as rendered", () => {
    const titles = [
      formatMetaTitle(siteCopy.about.metaTitle, siteCopy.about.metaSuffix),
      formatMetaTitle(siteCopy.contact.metaTitle, siteCopy.contact.metaSuffix),
      formatMetaTitle(siteCopy.services.metaTitle, "Atla"),
      formatMetaTitle(siteCopy.brief.metaTitle, "Atla"),
      formatMetaTitle(siteCopy.brandCheck.metaTitle, "Atla"),
      formatMetaTitle("Hospitality Branding Agency", "Atla"),
      formatMetaTitle("SaaS Branding Agency", "Atla"),
      formatMetaTitle("Brand Strategy for Growing Companies", "Atla"),
      formatMetaTitle("CPG Branding and Packaging Agency", "Consumer Goods"),
      formatMetaTitle("How We Work", "Branding Process and Engagement Model"),
    ];
    for (const title of titles) expect(rendered(title).length, title).toBeLessThanOrEqual(60);
  });

  it("every description is at most 160 characters and the journal one is not padded", () => {
    for (const d of [siteCopy.about.metaDescription, siteCopy.services.metaDescription, siteCopy.contact.metaDescription, siteCopy.brandCheck.metaDescription, siteCopy.brief.metaDescription, JOURNAL_META_DESCRIPTION]) {
      expect(d.length, d).toBeLessThanOrEqual(160);
    }
    expect(JOURNAL_META_DESCRIPTION.match(/Notes from the Atla studio/g)).toHaveLength(1);
  });

  it("a case study description ends on its own sentence, with no generated tail", () => {
    const d = buildProjectMetaDescription({ title: "Vyv", client: "Vyv", category: "Health & Wellness", description: "A new vitamin brand for women, named, drawn and packed before its first order." });
    expect(d).toBe("A new vitamin brand for women, named, drawn and packed before its first order. Case study by Atla.");
  });
});
