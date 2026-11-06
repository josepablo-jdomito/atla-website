// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Project, { groupMedia, storyBlocks } from "./Project";
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

describe("groupMedia and storyBlocks (Little Plains rhythm, 2026-11-06)", () => {
  const portrait = (id: string) => ({ type: "image" as const, src: `https://cdn.sanity.io/images/p/production/${id}-800x1200.jpg` });
  const landscape = (id: string) => ({ type: "image" as const, src: `https://cdn.sanity.io/images/p/production/${id}-1200x800.jpg` });
  const shape = (blocks: ReturnType<typeof storyBlocks>) => blocks.map((b) => (b.kind === "text" ? b.text : b.group.kind)).join(" ");

  it("pairs consecutive portraits and runs landscapes and a lone portrait alone, in order", () => {
    const groups = groupMedia([portrait("a"), portrait("b"), portrait("c"), landscape("d")]);
    expect(groups.map((group) => group.kind)).toEqual(["pair", "full", "full"]);
    expect(groups.flatMap((group) => group.items)).toEqual([portrait("a"), portrait("b"), portrait("c"), landscape("d")]);
  });

  it("puts the first paragraph straight after the opening, then spreads the rest between image groups", () => {
    const groups = groupMedia([landscape("a"), landscape("b"), landscape("c"), landscape("d")]);
    expect(shape(storyBlocks(groups, ["one", "two"]))).toBe("one full full two full full");
    expect(shape(storyBlocks(groups, []))).toBe("full full full full");
  });

  it("never drops a paragraph, and a project with text and no images is text only", () => {
    const groups = groupMedia([landscape("a")]);
    expect(shape(storyBlocks(groups, ["one", "two", "three"]))).toBe("one full two three");
    expect(shape(storyBlocks([], ["one", "two"]))).toBe("one two");
    expect(storyBlocks([], [])).toEqual([]);
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
    expect(container.querySelector(".story-head__facts")?.textContent).toBe("2023");
    const facets = container.querySelector(".story-head__facets")!;
    expect(facets.textContent).toBe("Hospitality & Travel\u00a0\u00a0·  Website, Brand Identity\u00a0\u00a0·  Mexico\u00a0\u00a0·  Rebrand");
    const links = Array.from(facets.querySelectorAll("a")).map((a) => [a.textContent, a.getAttribute("href")]);
    // Brand Identity is on every project, so it is text, not a link; Stage is text.
    expect(links).toEqual([
      ["Hospitality & Travel", "/?sector=hospitality-travel"],
      ["Website", "/?discipline=website"],
      ["Mexico", "/?place=mexico"],
    ]);
    expect(container.querySelector(".story-head__facets")?.textContent).not.toContain("Hotel");
  });

  it("has the same head skeleton with or without a description: no empty block, nothing in its place", () => {
    API.push(raw({ slug: "thin", title: "Thin", description: "", client: "Confidential" }));
    API.push(raw({ slug: "wordy", title: "Wordy", description: "A gin for the unreal. It was never meant for a shelf. Deep colors." }));
    try {
      render("thin");
      expect(container.querySelector(".story-head__lead")).toBeNull();
      expect(Array.from(container.querySelectorAll(".story-head > *")).map((el) => el.className)).toEqual([
        "story-head__cover",
        "story-head__copy",
      ]);
      // Little Plains' order beside the cover: title, the line (absent here), then the quiet metadata.
      expect(Array.from(container.querySelectorAll(".story-head__copy > *")).map((el) => el.className)).toEqual([
        "story-head__title",
        "story-head__facets",
        "story-head__facts",
      ]);
      expect(container.querySelector(".story-text")).toBeNull();
      act(() => root.unmount());
      root = createRoot(container);
      render("wordy");
      // The line is one sentence; the rest of the description opens the story.
      expect(container.querySelector(".story-head__lead")?.textContent).toBe("A gin for the unreal.");
      expect(container.querySelector(".story-head__title + .story-head__lead")).not.toBeNull();
      const first = container.querySelector(".story-body > :first-child")!;
      expect(first.classList.contains("story-block--text")).toBe(true);
      expect(first.textContent).toBe("It was never meant for a shelf. Deep colors.");
    } finally {
      API.pop();
      API.pop();
    }
  });

  it("puts the proof line under the facets on the project it is about, and on no other", () => {
    API.push(raw({ slug: "rustico", title: "Rústico" }));
    try {
      render("rustico");
      expect(container.querySelector(".story-head__proof")?.textContent).toBe(siteCopy.project.proof.rustico);
      expect(container.querySelector(".story-head__proof")?.textContent).toContain("MICHELIN Green Star");
      act(() => root.unmount());
      root = createRoot(container);
      render("archive-b");
      expect(container.querySelector(".story-head__proof")).toBeNull();
    } finally {
      API.pop();
    }
  });

  it("opens on the cover whole, at its own ratio: no 4:3 frame, no crop, even with a hotspot", () => {
    API.push(raw({ slug: "tall", title: "Tall", coverImage: "https://cdn.sanity.io/images/p/production/tall-1080x1440.png" }));
    API.push(raw({ slug: "focal", title: "Focal", coverImage: "https://cdn.sanity.io/images/p/production/focal-1200x800.png", coverFocal: { x: 0.5, y: 0.15 } }));
    try {
      for (const [slug, w, h] of [["archive-b", "1200", "800"], ["tall", "1080", "1440"], ["focal", "1200", "800"]]) {
        act(() => root.unmount());
        root = createRoot(container);
        render(slug);
        const img = container.querySelector<HTMLImageElement>(".story-head__cover img")!;
        expect(img, slug).not.toBeNull();
        expect([img.getAttribute("width"), img.getAttribute("height")], slug).toEqual([w, h]);
        const url = new URL(img.getAttribute("src")!);
        expect(url.searchParams.get("fit"), slug).toBe("max");
        expect(url.searchParams.get("h"), slug).toBeNull();
        expect(url.searchParams.get("crop"), slug).toBeNull();
        expect(container.querySelector("[data-frame]"), slug).toBeNull();
      }
    } finally {
      API.pop();
      API.pop();
    }
  });

  it("ends on the story: no call to action, no next project, no more like this (Little Plains has none)", () => {
    render("archive-b");
    const article = container.querySelector("article.story")!;
    expect(Array.from(article.children).map((el) => el.className)).toEqual(["story-head", "story-body"]);
    // The header keeps "Start a project"; the page itself adds no second one.
    expect(article.querySelector('a[href^="/brief"]')).toBeNull();
    expect(container.querySelector(".story-cta, .story-next, .story-more")).toBeNull();
  });

  it("keeps the context in a quiet rail, hidden from assistive tech and shown only after the opening", () => {
    render("archive-b");
    const rail = container.querySelector(".story-rail")!;
    expect(rail.getAttribute("aria-hidden")).toBe("true");
    expect(rail.getAttribute("data-shown")).toBe("no");
    expect(rail.querySelector(".story-rail__title")?.textContent).toBe("Rústico & Co / Tulum");
    expect(rail.querySelectorAll("a, button")).toHaveLength(0);
  });

  it("renders the media in order, cover first", () => {
    render("archive-b");
    const sources = Array.from(container.querySelectorAll(".story img")).map((img) => img.getAttribute("src"));
    expect(sources).toHaveLength(3);
    expect(sources[0]).toContain("archive-b");
    expect(container.querySelector(".story-head__cover img")?.getAttribute("src")).toBe(sources[0]);
    expect(sources[1]).toContain("b1");
    expect(sources[2]).toContain("b2");
  });

  it("renders the title alone, without a cover slot, for a project with no media", () => {
    API.push(raw({ slug: "bare", title: "Bare", coverImage: "", images: [] }));
    try {
      render("bare");
      expect(container.querySelector(".story-media")).toBeNull();
      expect(container.querySelector(".story-head")?.textContent).toContain("Bare");
      expect(container.querySelector(".story-head")?.getAttribute("data-cover")).toBe("none");
      expect(container.querySelector(".story-head__cover")).toBeNull();
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

  it("lands on the image clicked on the wall (?at=), clear of the header, and checks again at 250 and 900ms", () => {
    vi.useFakeTimers();
    // jsdom has no CSS.escape; the asset keys are plain hex in practice.
    const g = globalThis as { CSS?: { escape?: (value: string) => string } };
    g.CSS = { ...(g.CSS ?? {}), escape: g.CSS?.escape ?? ((value: string) => value) };
    let top = 1200;
    const asset = "b2";
    const real = Element.prototype.getBoundingClientRect;
    const spy = vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
      return this.getAttribute("data-asset") === asset ? ({ top } as DOMRect) : real.call(this);
    });
    try {
      render("archive-b", `at=${asset}`);
      expect(window.scrollTo).not.toHaveBeenCalledWith(0, 0);
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 1200 - 64 - 16, behavior: "auto" });
      // The images above got their height late: the next check corrects the landing.
      top = 1500;
      act(() => vi.advanceTimersByTime(250));
      expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1500 - 64 - 16, behavior: "auto" });
      act(() => vi.advanceTimersByTime(650));
      expect(window.scrollTo).toHaveBeenCalledTimes(3);
    } finally {
      spy.mockRestore();
      vi.useRealTimers();
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
    const opener = container.querySelectorAll<HTMLButtonElement>(".story-media__button")[1];
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
    const opener = container.querySelector<HTMLButtonElement>(".story-media__button")!;
    act(() => opener.focus());
    act(() => opener.click());
    const close = document.querySelector<HTMLButtonElement>(".lightbox__control--close")!;
    act(() => close.click());
    expect(document.activeElement).toBe(opener);
  });
});
