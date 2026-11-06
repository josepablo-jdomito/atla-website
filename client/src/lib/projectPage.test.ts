import { describe, expect, it } from "vitest";
import { buildImageSrcSet } from "@shared/imageDelivery";
import { splitLead } from "./projectPage";

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
