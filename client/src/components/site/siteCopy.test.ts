import { describe, expect, it } from "vitest";
import { siteCopy } from "../../content/siteCopy";

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
}

describe("siteCopy", () => {
  it("has no banned words and no prices", () => {
    const strings = collectStrings(siteCopy);
    expect(strings.length).toBeGreaterThan(0);
    for (const text of strings) {
      expect(text).not.toMatch(/\$\d|game-changer|elevate|authentic|next level|synergy|leverage|robust/i);
    }
  });
});
