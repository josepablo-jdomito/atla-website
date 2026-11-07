// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Tile } from "./WorkWall";
import { ProjectCard } from "./ProjectCard";
import { MotionToggle } from "./MotionToggle";
import { MOTION_STORAGE_KEY, isMotionPaused, setMotionPaused } from "./media";
import type { WallTile } from "./wallLayout";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** Reports every observed element as on screen at once, like a visitor looking at the whole wall. */
class VisibleObserver {
  constructor(private callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
  disconnect() {}
}

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => (data.has(key) ? data.get(key)! : null),
    setItem: (key: string, value: string) => void data.set(key, String(value)),
    removeItem: (key: string) => void data.delete(key),
  };
}

const videoTile = (n: number): WallTile => ({
  kind: "video",
  slug: `p${n}`,
  title: `P${n}`,
  src: `https://cdn.sanity.io/files/p/production/loop-${n}.mp4`,
  poster: "",
  ratio: 1,
}) as WallTile;

let container: HTMLDivElement;
let root: Root;
let play: ReturnType<typeof vi.fn>;
let pause: ReturnType<typeof vi.fn>;

beforeEach(() => {
  setMotionPaused(false);
  Object.defineProperty(window, "sessionStorage", { value: memoryStorage(), configurable: true });
  window.matchMedia = (() => ({ matches: false, addEventListener: () => undefined, removeEventListener: () => undefined })) as unknown as typeof window.matchMedia;
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = VisibleObserver;
  play = vi.fn(() => Promise.resolve());
  pause = vi.fn();
  Object.defineProperty(HTMLMediaElement.prototype, "play", { value: play, configurable: true });
  Object.defineProperty(HTMLMediaElement.prototype, "pause", { value: pause, configurable: true });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  setMotionPaused(false);
});

describe("Pause motion (WCAG 2.2.2)", () => {
  it("one control pauses every looping video on the page and sets data-motion on the root", () => {
    act(() =>
      root.render(
        createElement("div", null,
          createElement(Tile, { tile: videoTile(1), eager: true, reduced: false }),
          createElement(Tile, { tile: videoTile(2), eager: true, reduced: false }),
          createElement(ProjectCard, { project: { slug: "x", title: "X", coverImage: "https://cdn.sanity.io/images/p/production/a-100x100.jpg", videos: ["https://cdn.sanity.io/files/p/production/loop.mp4"] }, size: "grid" }),
          createElement(MotionToggle),
        ),
      ),
    );
    const videos = container.querySelectorAll("video");
    expect(videos.length).toBe(3);
    expect(play).toHaveBeenCalledTimes(3);
    pause.mockClear();

    const button = container.querySelector<HTMLButtonElement>("button.motion-toggle")!;
    expect(button.textContent).toBe("Pause motion");
    act(() => button.click());

    expect(document.documentElement.getAttribute("data-motion")).toBe("paused");
    expect(isMotionPaused()).toBe(true);
    expect(window.sessionStorage.getItem(MOTION_STORAGE_KEY)).toBe("paused");
    const paused = new Set(pause.mock.contexts as HTMLMediaElement[]);
    for (const video of Array.from(videos)) expect(paused.has(video as HTMLMediaElement), video.getAttribute("src") || "").toBe(true);
    expect(button.textContent).toBe("Play motion");
    expect(button.getAttribute("aria-pressed")).toBe("true");

    play.mockClear();
    act(() => button.click());
    expect(document.documentElement.hasAttribute("data-motion")).toBe(false);
    expect(window.sessionStorage.getItem(MOTION_STORAGE_KEY)).toBeNull();
    expect(play).toHaveBeenCalledTimes(3);
  });

  it("a video that mounts while paused never starts", () => {
    setMotionPaused(true);
    act(() => root.render(createElement(Tile, { tile: videoTile(3), eager: true, reduced: false })));
    expect(play).not.toHaveBeenCalled();
  });

  it("renders nothing for visitors who asked for reduced motion: they already see stills", () => {
    window.matchMedia = (() => ({ matches: true, addEventListener: () => undefined, removeEventListener: () => undefined })) as unknown as typeof window.matchMedia;
    act(() => root.render(createElement(MotionToggle)));
    expect(container.querySelector("button")).toBeNull();
  });
});
