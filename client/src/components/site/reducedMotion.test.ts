// @vitest-environment jsdom
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RotatingPhrase } from "./RotatingPhrase";
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

const PHRASES = ["one", "two", "three"];
const VIDEO_PROJECT = {
  slug: "x",
  title: "X",
  coverImage: "https://cdn.sanity.io/images/p/production/a-100x100.jpg",
  videos: ["https://cdn.sanity.io/files/p/production/loop.mp4"],
};

describe("RotatingPhrase", () => {
  it("is static on the first item under reduced motion", () => {
    stubMotion(true);
    act(() => root.render(createElement(RotatingPhrase, { items: PHRASES })));
    act(() => vi.advanceTimersByTime(10_000));
    expect(container.textContent).toBe("one");
  });

  it("advances every 3 s and pauses on hover", () => {
    stubMotion(false);
    act(() => root.render(createElement(RotatingPhrase, { items: PHRASES })));
    const active = () => container.querySelector('[data-active="true"]')?.textContent;
    expect(active()).toBe("one");
    act(() => vi.advanceTimersByTime(3000));
    expect(active()).toBe("two");
    const phrase = container.querySelector(".rotating-phrase")!;
    act(() => {
      phrase.dispatchEvent(new Event("pointerover", { bubbles: true }));
    });
    // React maps onPointerEnter to pointerover/pointerout on the root.
    act(() => vi.advanceTimersByTime(6000));
    expect(active()).toBe("two");
  });
});

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
