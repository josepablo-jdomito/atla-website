import { describe, expect, it } from "vitest";
import { sortFeatured } from "./projectService.ts";

describe("sortFeatured", () => {
  it("orders by homeOrder then year", () => {
    const sorted = sortFeatured([{ homeOrder: 2 }, { homeOrder: 1 }, { year: 2026 }]);
    expect(sorted.map((p) => p.homeOrder ?? p.year)).toEqual([1, 2, 2026]);
  });
});
