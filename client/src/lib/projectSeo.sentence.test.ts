import { describe, expect, it } from "vitest";
import { cutAtSentence } from "./projectSeo";

describe("cutAtSentence", () => {
  const first = "Alma Brava is a mezcal from San Luis Potosí, renewed from a brand called Xantolo.";
  const second = " Its producer came to Atla for a complete renewal: a name, an identity and a seal.";
  const third = " The product was good.";

  it("ends the meta description at the last whole sentence inside the limit", () => {
    expect(cutAtSentence(first + second + third)).toBe(first);
    expect(cutAtSentence(first + third)).toBe(first + third);
  });

  it("falls back to the word cut when the first sentence is too short to stand alone", () => {
    expect(cutAtSentence("Short. " + "x".repeat(200))).toMatch(/…$/);
  });
});
