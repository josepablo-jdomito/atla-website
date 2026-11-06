// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE_URL } from "@shared/siteSeo";
import { siteCopy } from "@/content/siteCopy";

const client = (...parts: string[]) => path.resolve(import.meta.dirname, "../..", ...parts);
const read = (...parts: string[]) => readFileSync(client(...parts), "utf8");

/** Width and height from a PNG's IHDR chunk. */
function pngSize(file: string) {
  const buf = readFileSync(file);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

describe("launch details (fix pass C)", () => {
  it("ships the Atlas favicon set, ink on paper, and links it from the page head", () => {
    expect(read("public/favicon.svg")).toContain('fill="#f6f3ec"');
    expect(read("public/favicon.svg")).toContain('fill="#1b1a17"');
    expect(existsSync(client("public/favicon.png"))).toBe(false);
    expect(pngSize(client("public/apple-touch-icon.png"))).toEqual({ width: 180, height: 180 });
    expect(pngSize(client("public/icon-192.png"))).toEqual({ width: 192, height: 192 });
    expect(pngSize(client("public/icon-512.png"))).toEqual({ width: 512, height: 512 });
    expect(readFileSync(client("public/favicon.ico")).readUInt16BE(0)).toBe(0);
    const manifest = JSON.parse(read("public/site.webmanifest"));
    expect(manifest.name).toBe("Atla");
    expect(manifest.theme_color).toBe("#f6f3ec");
    const html = read("index.html");
    for (const href of ["/favicon.ico", "/favicon.svg", "/apple-touch-icon.png", "/site.webmanifest"]) expect(html).toContain(`href="${href}"`);
  });

  it("uses a 1200x630 paper share image as the default", () => {
    expect(DEFAULT_OG_IMAGE_URL.endsWith("/share/default.png")).toBe(true);
    expect(pngSize(client("public/share/default.png"))).toEqual({ width: 1200, height: 630 });
  });

  it("names the entity, Texas law and an Austin venue in the terms", () => {
    const terms = read("src/pages/AtlaTerms.tsx");
    expect(terms).toContain("Atla &amp; WeLoveDaily, LLC");
    expect(terms).toContain("laws of the State of Texas");
    expect(terms).toContain("Austin, Texas");
  });

  it("links no hidden project from the SEO landings", () => {
    for (const page of ["AtlaHospitalityBranding", "AtlaWellnessBranding", "AtlaBrandStrategy"]) {
      expect(read(`src/pages/${page}.tsx`)).not.toMatch(/the-bridge|conscious-care-co/);
    }
  });

  it("gives each Services moment its own project's line", () => {
    const lines = Object.fromEntries(siteCopy.services.moments.map((m) => [m.project, m.projectLine]));
    expect(new Set(Object.values(lines)).size).toBe(4);
    expect(lines["hanks-leather"]).toMatch(/leather/);
    expect(lines["casa-colora"]).toMatch(/Monterrey/);
    expect(lines.rustico).toMatch(/Acre/);
  });

  it("asks crawlers not to index the thank-you states", () => {
    for (const file of ["src/components/brief/BriefFlow.tsx", "src/pages/BrandCheck.tsx", "src/components/site/ContactForm.tsx"]) {
      expect(read(file)).toContain("useNoindex(");
    }
  });
});
