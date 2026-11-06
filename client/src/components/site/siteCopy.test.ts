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

  it("the brief's contact step carries its privacy notice and link text, and the new strings hold no dash or number", () => {
    const { privacyNotice, privacyLink } = siteCopy.brief.contact;
    expect(`${privacyNotice} ${privacyLink}`).toBe("We use this to reply and for nothing else. Privacy");
    for (const text of [privacyNotice, privacyLink, siteCopy.motion.pause, siteCopy.motion.play]) {
      expect(text).not.toMatch(/[\u2014\u2013\d]/);
    }
  });
});
