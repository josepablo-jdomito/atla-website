import { describe, expect, it } from "vitest";
import { buildImageSrcSet } from "@shared/imageDelivery";
import { FRAME_QUALITY, FRAME_WIDTHS, frameImage, splitLead } from "./projectPage";

// Kept from openerFrame.test.ts when the 4:3 opener frame went (Little Plains page, 2026-11-06).
describe("splitLead", () => {
  it("keeps the first sentence as the line and moves the rest into the story", () => {
    expect(splitLead("A gin made for the unreal. It was never meant for a shelf. Deep colors.")).toEqual({
      line: "A gin made for the unreal.",
      rest: "It was never meant for a shelf. Deep colors.",
    });
  });
  it("leaves a one-sentence description whole and an empty one empty", () => {
    expect(splitLead("Identity and website for a hotel.")).toEqual({ line: "Identity and website for a hotel.", rest: "" });
    expect(splitLead("")).toEqual({ line: "", rest: "" });
  });
});

describe("buildImageSrcSet with a ratio", () => {
  it("gives every srcset candidate its own height", () => {
    const set = buildImageSrcSet("https://cdn.sanity.io/images/p/production/abc-1200x800.jpg", [640, 960], { fit: "crop", ratio: 4 / 3 }) ?? "";
    expect(set).toContain("h=480");
    expect(set).toContain("h=720");
  });
});

describe("frameImage (one recipe for the strip's <img> and the prerendered preload)", () => {
  const landscape = "https://cdn.sanity.io/images/dvufm78f/production/abc-2000x1000.png";

  it("caps the slot at the strip's width on every breakpoint, so a phone never asks for 2000w", () => {
    const { sizes, ratio } = frameImage(landscape);
    expect(ratio).toBe(2);
    expect(sizes).toContain("min(calc(70vh * 2), calc(100vw - 32px))");
    expect(sizes).toMatch(/^\(min-width: 1280px\) min\(calc\(\(100vh - 128px\) \* 2\), calc\(100vw - clamp\(260px, 22vw, 340px\) - 104px\)\)/);
  });

  it("uses one width list and one quality", () => {
    const { src, srcSet } = frameImage(landscape);
    expect(src).toContain("w=1200");
    expect(src).toContain(`q=${FRAME_QUALITY}`);
    expect(srcSet.split(", ").map((entry) => entry.split(" ")[1])).toEqual(FRAME_WIDTHS.map((w) => `${w}w`));
  });
});
