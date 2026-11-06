import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { Project } from "@shared/schema";
import { siteCopy } from "@/content/siteCopy";
import { buildSelectedWorkSection, withSelectedWork } from "./llmsTxt";

const LLMS = readFileSync(path.resolve(import.meta.dirname, "../../public/llms.txt"), "utf8");

function project(overrides: Partial<Project>): Project {
  return {
    id: "1",
    slug: "rustico",
    title: "Rústico",
    client: "Acre Resort",
    year: 2026,
    category: "Hospitality",
    region: "America",
    tags: ["Branding"],
    description: "A resort brand in the desert.",
    body: "",
    coverImage: "",
    images: [],
    videos: [],
    featured: true,
    status: "published",
    createdAt: new Date(0),
    ...overrides,
  };
}

describe("llms.txt source", () => {
  it("lists every services discipline with its one line and section anchor", () => {
    for (const discipline of siteCopy.services.disciplines) {
      expect(LLMS).toContain(`- [${discipline.title}](https://www.atla.design/services#${discipline.id}): ${discipline.line}`);
    }
  });

  it("lists the four moments, the brief, and the ventures by name", () => {
    for (const moment of siteCopy.services.moments) {
      expect(LLMS).toContain(`- [${moment.title}](https://www.atla.design/services)`);
    }
    expect(LLMS).toContain("## Start a project");
    expect(LLMS).toContain("(https://www.atla.design/brief)");
    for (const venture of siteCopy.ventures.items) expect(LLMS).toContain(venture.name);
  });

  it("keeps the existing sections", () => {
    for (const heading of ["## Studio", "## Work by industry", "## Work and writing", "## Contact"]) {
      expect(LLMS).toContain(heading);
    }
    expect(LLMS).toContain("filterable by sector, discipline, place and year");
  });
});

describe("Selected work", () => {
  it("lists featured projects only, in home order, one line each", () => {
    const section = buildSelectedWorkSection([
      project({ slug: "b", title: "Bravo", homeOrder: 2 }),
      project({ slug: "a", title: "Alpha", homeOrder: 1 }),
      project({ slug: "c", title: "Charlie", featured: false }),
    ]);
    const lines = section.split("\n").filter((line) => line.startsWith("- "));
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatch(/^- \[Alpha\]\(https:\/\/www\.atla\.design\/projects\/a\): \S/);
    expect(lines[0]).toMatch(/^- \[Alpha\]\(https:\/\/www\.atla\.design\/projects\/a\): \S/);
    expect(lines[1]).toMatch(/^- \[Bravo\]\(https:\/\/www\.atla\.design\/projects\/b\): \S/);
  });

  it("carries the sector, disciplines, place and year before the description", () => {
    const section = buildSelectedWorkSection([project({ slug: "rustico", country: "Mexico" })]);
    expect(section).toContain("- [Rústico](https://www.atla.design/projects/rustico): Hospitality & Travel · Brand Identity, Website · Mexico · 2026. A resort brand in the desert.");
  });

  it("goes in before Start a project, once, and leaves the file alone without featured work", () => {
    const withWork = withSelectedWork(LLMS, [project({})]);
    expect(withWork.indexOf("## Selected work")).toBeGreaterThan(0);
    expect(withWork.indexOf("## Selected work")).toBeLessThan(withWork.indexOf("## Start a project"));
    expect(withSelectedWork(withWork, [project({})])).toBe(withWork);
    expect(withSelectedWork(LLMS, [project({ featured: false })])).toBe(LLMS);
  });
});
