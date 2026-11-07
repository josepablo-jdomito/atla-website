// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Project, { filmFrames } from "./Project";
import { stripProgress, stripStop } from "@/lib/projectPage";
import { nextProjectInSiteOrder, siteOrder, toSiteProject } from "@/components/site/siteProjects";
import type { Project as ProjectRecord } from "@shared/schema";
import { siteCopy } from "@/content/siteCopy";

// Analytics reads consent from storage; the page's tracking is not under test here.
vi.mock("@/hooks/use-analytics", () => ({ trackEvent: vi.fn() }));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const image = (id: string) => `https://cdn.sanity.io/images/p/production/${id}-1200x800.jpg`;

function raw(overrides: Record<string, unknown>) {
  return {
    id: String(overrides.slug),
    title: "Untitled",
    client: "",
    category: "Hospitality",
    country: "Mexico",
    sector: "Hospitality & Travel",
    disciplines: ["Brand Identity", "Website"],
    stage: "New brand",
    searchTerms: ["resort"],
    tags: ["Branding"],
    year: 2025,
    description: "",
    body: "",
    coverImage: image(String(overrides.slug)),
    images: [],
    videos: [],
    featured: false,
    homeOrder: null,
    ...overrides,
  } as unknown as ProjectRecord;
}

// API order is archive order; two featured projects jump ahead of it.
const API = [
  raw({ slug: "archive-a", title: "Archive A", year: 2024 }),
  raw({ slug: "feat-two", title: "Feature Two", featured: true, homeOrder: 2 }),
  raw({ slug: "archive-b", title: "Rústico & Co / Tulum", client: "Rústico", year: 2023, disciplines: ["Website", "Brand Identity"], stage: "Rebrand", tags: ["Hotel", "Branding"], images: [image("b1"), image("b2")] }),
  raw({ slug: "feat-one", title: "Feature One", featured: true, homeOrder: 1 }),
];

describe("filmFrames, stripProgress and stripStop (Filmstrip, 2026-11-06)", () => {
  const piece = (id: string) => ({ type: "image" as const, src: `https://cdn.sanity.io/images/p/production/${id}-1200x800.jpg` });
  const shape = (frames: ReturnType<typeof filmFrames>) => frames.map((f) => (f.kind === "text" ? f.text : "i")).join(" ");
  const pieces = (n: number) => Array.from({ length: n }, (_, i) => piece(`p${i}`));

  it("puts a text frame after every third or fourth piece, until the paragraphs run out", () => {
    // Twelve pieces, two paragraphs: spread evenly would be every fourth.
    expect(shape(filmFrames(pieces(12), ["one", "two"]))).toBe("i i i i one i i i i two i i i i");
    // Never closer than every third, even with many paragraphs; the leftovers close the strip.
    expect(shape(filmFrames(pieces(6), ["one", "two", "three"]))).toBe("i i i one i i i two three");
    // Never further apart than every fourth.
    expect(shape(filmFrames(pieces(10), ["one"]))).toBe("i i i i one i i i i i i");
  });

  it("never drops a paragraph, and no paragraphs means pieces only", () => {
    expect(shape(filmFrames(pieces(2), ["one", "two"]))).toBe("i i one two");
    expect(shape(filmFrames(pieces(3), []))).toBe("i i i");
    expect(filmFrames([], [])).toEqual([]);
  });

  it("reads the progress as scrollLeft over the scrollable range, clamped, and 0 when nothing overflows", () => {
    expect(stripProgress(0, 3000, 1000)).toBe(0);
    expect(stripProgress(1000, 3000, 1000)).toBe(0.5);
    expect(stripProgress(2000, 3000, 1000)).toBe(1);
    expect(stripProgress(2600, 3000, 1000)).toBe(1);
    expect(stripProgress(-20, 3000, 1000)).toBe(0);
    expect(stripProgress(0, 900, 1000)).toBe(0);
  });

  it("steps to the next or previous frame edge, and to the ends when there is none", () => {
    const lefts = [0, 600, 1200, 1900];
    expect(stripStop(lefts, 0, 1, 2400)).toBe(600);
    expect(stripStop(lefts, 601, 1, 2400)).toBe(1200);
    expect(stripStop(lefts, 1900, 1, 2400)).toBe(2400);
    expect(stripStop(lefts, 1200, -1, 2400)).toBe(600);
    expect(stripStop(lefts, 650, -1, 2400)).toBe(600);
    expect(stripStop(lefts, 0, -1, 2400)).toBe(0);
    // The last frame's edge past the end of the range is clamped to the end.
    expect(stripStop([0, 3000], 0, 1, 2400)).toBe(2400);
  });
});

describe("siteOrder", () => {
  const projects = API.map(toSiteProject).filter((p) => p !== null);

  it("puts the featured block first, then the archive in API order", () => {
    expect(siteOrder(projects).map((p) => p.slug)).toEqual(["feat-one", "feat-two", "archive-a", "archive-b"]);
  });

  it("wraps the last project to the first", () => {
    expect(nextProjectInSiteOrder(projects, "archive-b")?.slug).toBe("feat-one");
    expect(nextProjectInSiteOrder(projects, "feat-two")?.slug).toBe("archive-a");
  });
});

let container: HTMLDivElement;
let location: ReturnType<typeof memoryLocation>;
let root: Root;

let reducedMotion = true;
let observerCallbacks: IntersectionObserverCallback[] = [];

class StubObserver {
  constructor(callback: IntersectionObserverCallback) {
    observerCallbacks.push(callback);
  }
  observe() {}
  disconnect() {}
}

/** Fires every observer as if its target scrolled into (or out of) view. */
function intersect(isIntersecting: boolean) {
  act(() => {
    for (const callback of observerCallbacks) {
      callback([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver);
    }
  });
}

beforeEach(() => {
  reducedMotion = true;
  observerCallbacks = [];
  window.matchMedia = ((query: string) => ({
    matches: query.includes("reduce") ? reducedMotion : false,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = StubObserver;
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  // jsdom has no media playback.
  HTMLMediaElement.prototype.pause = vi.fn();
  HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function render(slug: string, search = "") {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  client.setQueryData(["/api/projects"], API);
  client.setQueryData(["project", slug], API.find((p) => p.slug === slug) ?? null);
  location = memoryLocation({ path: `/projects/${slug}` });
  if (search) window.history.replaceState(null, "", `/projects/${slug}#${search}`);
  act(() =>
    root.render(
      createElement(
        QueryClientProvider,
        { client },
        createElement(Router, { hook: location.hook, searchHook: () => search }, createElement(Project)),
      ),
    ),
  );
}

describe("Project page", () => {
  it("shows the year in the facts line, then the facets as links into the filtered wall", () => {
    render("archive-b");
    // One skeleton for every project: the client line is on none of them, only the year.
    expect(container.querySelector("h1")?.textContent).toBe("Rústico & Co / Tulum");
    expect(container.querySelector(".film-head__facts")?.textContent).toBe("2023");
    const facets = container.querySelector(".film-head__facets")!;
    expect(facets.textContent).toBe("Hospitality & Travel\u00a0\u00a0·  Website, Brand Identity\u00a0\u00a0·  Mexico\u00a0\u00a0·  Rebrand");
    const links = Array.from(facets.querySelectorAll("a")).map((a) => [a.textContent, a.getAttribute("href")]);
    // Brand Identity is on every project, so it is text, not a link; Stage is text.
    expect(links).toEqual([
      ["Hospitality & Travel", "/?sector=hospitality-travel"],
      ["Website", "/?discipline=website"],
      ["Mexico", "/?place=mexico"],
    ]);
    expect(container.querySelector(".film-head__facets")?.textContent).not.toContain("Hotel");
  });

  it("has the same head skeleton with or without a description: no empty block, nothing in its place", () => {
    API.push(raw({ slug: "thin", title: "Thin", description: "", client: "Confidential" }));
    API.push(raw({ slug: "wordy", title: "Wordy", description: "A gin for the unreal. It was never meant for a shelf. Deep colors." }));
    try {
      render("thin");
      expect(container.querySelector(".film-head__lead")).toBeNull();
      // The column's order: title, the line (absent here), the quiet metadata. Nothing else.
      expect(Array.from(container.querySelectorAll(".film-head > *")).map((el) => el.className)).toEqual([
        "film-head__title",
        "film-head__facets",
        "film-head__facts",
      ]);
      expect(container.querySelector(".film-head__body, .film-frame--text, .film-rest")).toBeNull();
      act(() => root.unmount());
      root = createRoot(container);
      render("wordy");
      // The line is one sentence; the rest of the description opens the story.
      expect(container.querySelector(".film-head__lead")?.textContent).toBe("A gin for the unreal.");
      expect(container.querySelector(".film-head__title + .film-head__lead")).not.toBeNull();
      // The first paragraph sits last in the column, after the facts.
      const body = container.querySelector(".film-head > :last-child")!;
      expect(body.className).toBe("film-head__body");
      expect(body.textContent).toBe("It was never meant for a shelf. Deep colors.");
    } finally {
      API.pop();
      API.pop();
    }
  });

  it("puts the proof line under the facets on the project it is about, and on no other", () => {
    API.push(raw({ slug: "rustico", title: "Rústico" }));
    try {
      render("rustico");
      expect(container.querySelector(".film-head__proof")?.textContent).toBe(siteCopy.project.proof.rustico);
      expect(container.querySelector(".film-head__proof")?.textContent).toContain("MICHELIN Green Star");
      act(() => root.unmount());
      root = createRoot(container);
      render("archive-b");
      expect(container.querySelector(".film-head__proof")).toBeNull();
    } finally {
      API.pop();
    }
  });

  it("opens the strip on the cover whole, at its own ratio: no crop, even with a hotspot", () => {
    API.push(raw({ slug: "tall", title: "Tall", coverImage: "https://cdn.sanity.io/images/p/production/tall-1080x1440.png" }));
    API.push(raw({ slug: "focal", title: "Focal", coverImage: "https://cdn.sanity.io/images/p/production/focal-1200x800.png", coverFocal: { x: 0.5, y: 0.15 } }));
    try {
      for (const [slug, w, h] of [["archive-b", "1200", "800"], ["tall", "1080", "1440"], ["focal", "1200", "800"]]) {
        act(() => root.unmount());
        root = createRoot(container);
        render(slug);
        const img = container.querySelector<HTMLImageElement>(".film-strip > .film-frame:first-child img")!;
        expect(img, slug).not.toBeNull();
        expect([img.getAttribute("width"), img.getAttribute("height")], slug).toEqual([w, h]);
        const url = new URL(img.getAttribute("src")!);
        expect(url.searchParams.get("fit"), slug).toBe("max");
        expect(url.searchParams.get("h"), slug).toBeNull();
        expect(url.searchParams.get("crop"), slug).toBeNull();
        expect(img.getAttribute("srcset"), slug).toContain("w=2400");
        // The frame takes its width from the ratio (height-filled), never a fixed box.
        expect((img.parentElement as HTMLElement).style.getPropertyValue("--r"), slug).toBe((Number(w) / Number(h)).toFixed(4));
      }
    } finally {
      API.pop();
      API.pop();
    }
  });

  it("is a column and a strip, then nothing: no call to action, no next project, no digits", () => {
    render("archive-b");
    const article = container.querySelector("article.film")!;
    expect(Array.from(article.children).map((el) => el.className)).toEqual(["film-head", "film-stage"]);
    const stage = container.querySelector(".film-stage")!;
    expect(Array.from(stage.children).map((el) => el.className)).toEqual(["film-strip", "film-progress"]);
    expect(stage.textContent).not.toMatch(/\d/);
    // The header keeps "Start a project"; the page itself adds no second one.
    expect(article.querySelector('a[href^="/brief"]')).toBeNull();
    expect(container.querySelector(".story-cta, .story-next, .story-more, .story-rail")).toBeNull();
  });

  it("makes the strip a focusable carousel of labelled frames, with no number in any label", () => {
    API.push(raw({ slug: "story", title: "Story", description: "One line. First paragraph.", body: "Second paragraph.\n\nThird paragraph.", images: [image("s1"), image("s2"), image("s3"), image("s4")] }));
    try {
      render("story");
      const strip = container.querySelector<HTMLElement>(".film-strip")!;
      expect(strip.tabIndex).toBe(0);
      expect(strip.getAttribute("aria-roledescription")).toBe("carousel");
      expect(strip.getAttribute("aria-label")).toBe("Story");
      const frames = Array.from(strip.querySelectorAll(".film-frame"));
      expect(frames.every((f) => f.getAttribute("role") === "group")).toBe(true);
      expect(frames.map((f) => f.getAttribute("aria-label"))).toEqual([
        "Story, image", "Story, image", "Story, image", "Story, text", "Story, image", "Story, image", "Story, text",
      ]);
      expect(strip.innerHTML).not.toMatch(/aria-label="[^"]*\d/);
      // The same paragraphs read under the strip below 1024 (CSS shows one or the other).
      expect(Array.from(container.querySelectorAll(".film-rest__text")).map((p) => p.textContent)).toEqual([
        "Second paragraph.",
        "Third paragraph.",
      ]);
      expect(container.querySelector(".film-progress")?.getAttribute("aria-hidden")).toBe("true");
    } finally {
      API.pop();
    }
  });

  it("steps the strip a frame with the arrows and to its ends with Home and End", () => {
    render("archive-b");
    const strip = container.querySelector<HTMLElement>(".film-strip")!;
    const frames = Array.from(strip.querySelectorAll<HTMLElement>(".film-frame"));
    // Three frames 700px apart; the strip shows 1000px of 2100.
    const lefts = new Map(frames.map((frame, index) => [frame, index * 700]));
    let scrollLeft = 0;
    Object.defineProperty(strip, "scrollLeft", { configurable: true, get: () => scrollLeft, set: (v: number) => (scrollLeft = v) });
    Object.defineProperty(strip, "scrollWidth", { configurable: true, value: 2100 });
    Object.defineProperty(strip, "clientWidth", { configurable: true, value: 1000 });
    const spy = vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
      const left = lefts.has(this as HTMLElement) ? lefts.get(this as HTMLElement)! - scrollLeft : 0;
      return { left, top: 0 } as DOMRect;
    });
    const scrollTo = vi.fn((options: ScrollToOptions) => (scrollLeft = options.left ?? scrollLeft));
    strip.scrollTo = scrollTo as unknown as typeof strip.scrollTo;
    const press = (key: string) => {
      const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
      act(() => {
        strip.dispatchEvent(event);
      });
      return event;
    };
    try {
      expect(press("ArrowRight").defaultPrevented).toBe(true);
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 700, behavior: "auto" });
      press("ArrowRight");
      expect(scrollLeft).toBe(1100);
      press("ArrowLeft");
      expect(scrollLeft).toBe(700);
      press("End");
      expect(scrollLeft).toBe(1100);
      press("Home");
      expect(scrollLeft).toBe(0);
      expect(press("a").defaultPrevented).toBe(false);
    } finally {
      spy.mockRestore();
    }
  });

  it("renders the media in order, cover first", () => {
    render("archive-b");
    const sources = Array.from(container.querySelectorAll(".film-strip img")).map((img) => img.getAttribute("src"));
    expect(sources).toHaveLength(3);
    expect(sources[0]).toContain("archive-b");
    expect(sources[1]).toContain("b1");
    expect(sources[2]).toContain("b2");
  });

  it("renders the column alone, without a strip, for a project with no media", () => {
    API.push(raw({ slug: "bare", title: "Bare", coverImage: "", images: [] }));
    try {
      render("bare");
      expect(container.querySelector(".film-strip, .film-progress")).toBeNull();
      expect(container.querySelector(".film-head")?.textContent).toContain("Bare");
      expect(container.querySelector(".film")?.getAttribute("data-media")).toBe("none");
    } finally {
      API.pop();
    }
  });

  const VIDEO_PROJECT = raw({
    slug: "with-video",
    title: "With Video",
    videoFiles: [{ url: "https://cdn.sanity.io/files/p/production/loop.mp4" }],
  });

  it("never plays video under reduced motion and shows controls instead", () => {
    API.push(VIDEO_PROJECT);
    try {
      render("with-video");
      const video = container.querySelector("video")!;
      intersect(true);
      expect(video.controls).toBe(true);
      expect(video.muted).toBe(true);
      expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    } finally {
      API.pop();
    }
  });

  it("plays muted video while on screen and pauses it off screen", () => {
    reducedMotion = false;
    API.push(VIDEO_PROJECT);
    try {
      render("with-video");
      const video = container.querySelector("video")!;
      expect(video.controls).toBe(false);
      expect(video.muted).toBe(true);
      expect(video.loop).toBe(true);
      expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
      intersect(true);
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
      intersect(false);
      expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    } finally {
      API.pop();
    }
  });

  it("starts at the top after a push navigation, on mount and on a slug change", () => {
    render("archive-b");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    vi.mocked(window.scrollTo).mockClear();
    act(() => location.navigate("/projects/feat-one"));
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("lands the strip on the image clicked on the wall (#at=), at its left edge, and checks again at 250 and 900ms", () => {
    vi.useFakeTimers();
    // jsdom has no CSS.escape; the asset keys are plain hex in practice.
    const g = globalThis as { CSS?: { escape?: (value: string) => string } };
    g.CSS = { ...(g.CSS ?? {}), escape: g.CSS?.escape ?? ((value: string) => value) };
    let frameAt = 1400;
    const asset = "b2";
    const scrollTo = vi.fn();
    const originalScrollTo = HTMLElement.prototype.scrollTo;
    HTMLElement.prototype.scrollTo = scrollTo as unknown as typeof HTMLElement.prototype.scrollTo;
    const real = Element.prototype.getBoundingClientRect;
    const spy = vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
      if (this.getAttribute("data-asset") === asset) return { left: frameAt, top: 0 } as DOMRect;
      if (this.classList.contains("film-strip")) return { left: 380, top: 88 } as DOMRect;
      return real.call(this);
    });
    try {
      render("archive-b", `at=${asset}`);
      expect(scrollTo).toHaveBeenCalledWith({ left: 1400 - 380, behavior: "auto" });
      // The frames before it got their width late: the next check corrects the landing.
      frameAt = 1700;
      act(() => vi.advanceTimersByTime(250));
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 1700 - 380, behavior: "auto" });
      act(() => vi.advanceTimersByTime(650));
      expect(scrollTo).toHaveBeenCalledTimes(3);
    } finally {
      spy.mockRestore();
      HTMLElement.prototype.scrollTo = originalScrollTo;
      vi.useRealTimers();
      window.history.replaceState(null, "", "/");
    }
  });

  it("keeps the restored position after Back (popstate)", () => {
    window.dispatchEvent(new PopStateEvent("popstate"));
    render("archive-b");
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});

describe("Lightbox keyboard (fix wave 2026-11-05)", () => {
  const press = (key: string, shiftKey = false) => {
    const event = new KeyboardEvent("keydown", { key, shiftKey, bubbles: true, cancelable: true });
    act(() => {
      window.dispatchEvent(event);
    });
    return event;
  };

  it("keeps Tab inside the dialog and gives focus back to the image that opened it", () => {
    render("archive-b");
    const opener = container.querySelectorAll<HTMLButtonElement>(".film-frame__button")[1];
    act(() => opener.focus());
    act(() => opener.click());
    const dialog = document.querySelector<HTMLElement>('.lightbox[role="dialog"]')!;
    const stops = Array.from(dialog.querySelectorAll<HTMLButtonElement>("button:not([tabindex='-1'])"));
    expect(stops.map((b) => b.className)).toEqual([
      "lightbox__control lightbox__control--close",
      "lightbox__control lightbox__control--prev",
      "lightbox__control lightbox__control--next",
    ]);
    expect(document.activeElement).toBe(stops[0]);
    // Tab from the last control wraps to the first; Shift+Tab from the first wraps to the last.
    act(() => stops[2].focus());
    expect(press("Tab").defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(stops[0]);
    expect(press("Tab", true).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(stops[2]);
    // Escape closes and returns focus to the opener.
    press("Escape");
    expect(document.querySelector('.lightbox')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it("returns focus after the Close button too", () => {
    render("archive-b");
    const opener = container.querySelector<HTMLButtonElement>(".film-frame__button")!;
    act(() => opener.focus());
    act(() => opener.click());
    const close = document.querySelector<HTMLButtonElement>(".lightbox__control--close")!;
    act(() => close.click());
    expect(document.activeElement).toBe(opener);
  });
});
