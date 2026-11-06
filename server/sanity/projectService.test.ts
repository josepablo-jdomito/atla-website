import { describe, expect, it } from "vitest";
import { sortFeatured, toVideoSource } from "./projectService.ts";

describe("sortFeatured", () => {
  it("orders by homeOrder then year", () => {
    const sorted = sortFeatured([{ homeOrder: 2 }, { homeOrder: 1 }, { year: 2026 }]);
    expect(sorted.map((p) => p.homeOrder ?? p.year)).toEqual([1, 2, 2026]);
  });
});

describe("toVideoSource", () => {
  it("keeps direct Sanity CDN video files and Vimeo, drops everything else", () => {
    const file = "https://cdn.sanity.io/files/dvufm78f/production/0a1b2c3d4e5f-1080x1920.mp4";
    expect(toVideoSource(file)).toBe(file);
    expect(toVideoSource(`${file}?dl=1#t=2`)).toBe(file);
    expect(toVideoSource("https://cdn.sanity.io/files/dvufm78f/production/abc.webm")).toBe("https://cdn.sanity.io/files/dvufm78f/production/abc.webm");
    expect(toVideoSource("https://cdn.sanity.io/files/dvufm78f/production/abc.MOV")).toBe("https://cdn.sanity.io/files/dvufm78f/production/abc.MOV");
    expect(toVideoSource("https://vimeo.com/123456")).toBe("https://player.vimeo.com/video/123456");
    for (const bad of [
      "http://cdn.sanity.io/files/dvufm78f/production/abc.mp4",
      "https://cdn.sanity.io/files/dvufm78f/production/abc.exe",
      "https://cdn.sanity.io/files/dvufm78f/abc.mp4",
      "https://cdn.sanity.io/images/dvufm78f/production/abc.mp4",
      "https://cdn.sanity.io.evil.example/files/dvufm78f/production/abc.mp4",
      "https://evil.example/files/dvufm78f/production/abc.mp4",
      "https://cdn.sanity.io/files/dvufm78f/production/../x/abc.mp4",
      "javascript:alert(1)//abc.mp4",
    ]) {
      expect(toVideoSource(bad), bad).toBe("");
    }
  });
});
