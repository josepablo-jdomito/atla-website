import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { pathnameRedirects, type RedirectRule } from "./indexablePath.ts";

const rules = (JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8")) as { redirects: RedirectRule[] }).redirects;

describe("pathnameRedirects", () => {
  it("treats the legacy paths as redirects and the live pages as not", () => {
    for (const path of [
      "/contact",
      "/work",
      "/blog",
      "/blog/branding-questionnaire-guide",
      "/portfolio",
      "/portfolio/old",
      "/studio",
      "/top-branding-agencies-for-startups",
      "/best-startup-branding-agencies",
      "/how-to-edit-a-website-page",
      "/10-successful-rebranding-examples-that-changed-the-game",
      "/projects/welove",
      "/projects/atla",
      "/projects/the-bridge",
      "/projects/conscious-care-co",
    ]) {
      expect(pathnameRedirects(path, rules), path).toBe(true);
    }

    for (const path of [
      "/",
      "/about",
      "/audit",
      "/brief",
      "/ventures",
      "/saas-rebranding",
      "/startup-branding",
      "/branding-agency-austin",
      "/journal",
      "/journal/why-most-startups-rebrand-too-late",
      "/journal/category/strategy",
      "/projects/ando",
      "/sitemap.xml",
    ]) {
      expect(pathnameRedirects(path, rules), path).toBe(false);
    }
  });
});
