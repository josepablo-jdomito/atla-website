import { describe, expect, it } from "vitest";
import { buildImageSrcSet } from "@shared/imageDelivery";
import { openerFrame, openerImageUrl } from "./openerFrame";
import { splitLead } from "./projectPage";

const at = (w: number, h: number) => `https://cdn.sanity.io/images/p/production/abc-${w}x${h}.jpg`;

describe("openerFrame", () => {
  it("crops to 4:3 around the hotspot when the cover has one, whatever its own ratio", () => {
    for (const [w, h] of [[1080, 1440], [3000, 1000], [1200, 800]]) {
      expect(openerFrame(at(w, h), { x: 0.4, y: 0.2 })).toEqual({ mode: "crop", ratio: 4 / 3, focal: { x: 0.4, y: 0.2 } });
    }
  });

  it("without a hotspot, crops centered only when the image is close to 4:3", () => {
    expect(openerFrame(at(1200, 800))).toEqual({ mode: "crop", ratio: 4 / 3, focal: null }); // 1.5
    expect(openerFrame(at(1200, 1000))).toEqual({ mode: "crop", ratio: 4 / 3, focal: null }); // 1.2, the lower edge
    expect(openerFrame(at(1570, 1000))).toEqual({ mode: "crop", ratio: 4 / 3, focal: null }); // 1.57, the upper edge
    expect(openerFrame(at(1778, 1000)).mode).toBe("native"); // 16:9 shows whole: a crop would cut a quarter
  });

  it("without a hotspot, shows a portrait or a panorama whole at its own ratio", () => {
    expect(openerFrame(at(1080, 1440))).toEqual({ mode: "native", ratio: 0.75, focal: null });
    expect(openerFrame(at(2000, 1000))).toEqual({ mode: "native", ratio: 2, focal: null });
    expect(openerFrame(at(1000, 1000))).toEqual({ mode: "native", ratio: 1, focal: null });
  });

  it("an image of unknown size is shown whole", () => {
    expect(openerFrame("https://cdn.sanity.io/images/p/production/nodims.jpg")).toEqual({ mode: "native", ratio: null, focal: null });
  });
});

describe("openerImageUrl", () => {
  it("asks the CDN for a focal-point crop at 4:3, and for the whole image otherwise", () => {
    const crop = new URL(openerImageUrl(at(1080, 1440), openerFrame(at(1080, 1440), { x: 0.5, y: 0.1 }), 1200, 88));
    expect(crop.searchParams.get("fit")).toBe("crop");
    expect(crop.searchParams.get("crop")).toBe("focalpoint");
    expect(crop.searchParams.get("fp-x")).toBe("0.5");
    expect(crop.searchParams.get("fp-y")).toBe("0.1");
    expect(crop.searchParams.get("w")).toBe("1200");
    expect(crop.searchParams.get("h")).toBe("900");

    const whole = new URL(openerImageUrl(at(1080, 1440), openerFrame(at(1080, 1440)), 1200, 88));
    expect(whole.searchParams.get("fit")).toBe("max");
    expect(whole.searchParams.get("h")).toBeNull();
    expect(whole.searchParams.get("crop")).toBeNull();

    const centered = new URL(openerImageUrl(at(1200, 800), openerFrame(at(1200, 800)), 1200, 88));
    expect(centered.searchParams.get("fit")).toBe("crop");
    expect(centered.searchParams.get("crop")).toBeNull();
    expect(centered.searchParams.get("h")).toBe("900");
  });

  it("gives every srcset candidate its own 4:3 height", () => {
    const set = buildImageSrcSet(at(1200, 800), [640, 960], { fit: "crop", ratio: 4 / 3 }) ?? "";
    expect(set).toContain("h=480");
    expect(set).toContain("h=720");
  });
});

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
