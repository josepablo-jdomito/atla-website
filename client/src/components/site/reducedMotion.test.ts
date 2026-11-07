// @vitest-environment jsdom
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectCard } from "./ProjectCard";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function stubMotion(reduce: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes("reduce") ? reduce : false,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
}

class StubObserver {
  observe() {}
  disconnect() {}
}

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.useFakeTimers();
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = StubObserver;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});

const VIDEO_PROJECT = {
  slug: "x",
  title: "X",
  coverImage: "https://cdn.sanity.io/images/p/production/a-100x100.jpg",
  videos: ["https://cdn.sanity.io/files/p/production/loop.mp4"],
};

describe("ProjectCard video", () => {
  it("never renders a video under reduced motion", () => {
    stubMotion(true);
    act(() => root.render(createElement(ProjectCard, { project: VIDEO_PROJECT, size: "grid" })));
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("img")).not.toBeNull();
  });

  it("loops muted inline with preload none otherwise", () => {
    stubMotion(false);
    act(() => root.render(createElement(ProjectCard, { project: VIDEO_PROJECT, size: "grid" })));
    const video = container.querySelector("video")!;
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.hasAttribute("playsinline")).toBe(true);
    expect(video.getAttribute("preload")).toBe("none");
    expect(video.hasAttribute("autoplay")).toBe(false);
  });
});
