// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Project, { buildFilm } from "./Project";
import { CAPTION_MAX, filmFrameScrollY, filmImageSizes, filmPosition, filmStep, planFilmText, splitCaption } from "@/lib/projectPage";
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

describe("Scroll film text: who says what in the caption bar (2026-11-06)", () => {
  const long =
    "Acre already had a brand and a whole family of things under it. Rústico had to read as Acre's, the baby brother of a bigger restaurant. A place like that cannot out-shout its setting. It has to disappear into it.";

  it("keeps a caption that fits two lines whole, and splits a longer paragraph at sentence ends, in order", () => {
    expect(splitCaption("One short line.")).toEqual(["One short line."]);
    const lines = splitCaption(long);
    expect(lines.length).toBeGreaterThan(1);
    // Nothing added, nothing dropped, the order kept.
    expect(lines.join(" ")).toBe(long);
    for (const line of lines) {
      expect(line.length).toBeLessThanOrEqual(CAPTION_MAX);
      expect(line).toMatch(/[.!?]$/);
    }
  });

  it("cuts a sentence too long for the bar at a clause, never mid-word, and leaves one with no clause whole", () => {
    const sentence =
      "In the empty center of a circular permaculture garden, the owners were running an open-fire dinner as a pop-up: private buyouts, winemaker dinners, a dark sky above and a long table under it.";
    const lines = splitCaption(sentence);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines.join(" ")).toBe(sentence);
    expect(lines.slice(0, -1).every((line) => /[,;:]$/.test(line))).toBe(true);
    const unbroken = "A".repeat(80) + " " + "b".repeat(80) + ".";
    expect(splitCaption(unbroken)).toEqual([unbroken]);
    expect(splitCaption("   ")).toEqual([]);
  });

  it("gives the first frame the intro, then the paragraphs one by one, a long one across consecutive frames", () => {
    const plan = planFilmText([undefined, undefined, undefined, undefined, undefined, undefined, undefined], "The intro.", ["First paragraph.", long, "Last paragraph."]);
    const pieces = splitCaption(long);
    expect(plan.captions).toEqual(["The intro.", "First paragraph.", ...pieces, "Last paragraph.", ...Array(7 - 3 - pieces.length).fill("")]);
    expect(plan.textFrames).toEqual([]);
  });

  it("never invents a caption: frames past the story carry the title alone, a Sanity caption is kept as written", () => {
    const plan = planFilmText([undefined, "The menu, on cream paper.", undefined, undefined], "The intro.", ["One paragraph."]);
    expect(plan.captions).toEqual(["The intro.", "The menu, on cream paper.", "One paragraph.", ""]);
    expect(planFilmText([undefined, undefined], "", []).captions).toEqual(["", ""]);
    const sources = ["The intro.", "One paragraph.", "The menu, on cream paper."].join(" ");
    for (const caption of plan.captions) expect(sources.includes(caption)).toBe(true);
  });

  it("never drops the story: what finds no frame closes the film as text frames of whole paragraphs", () => {
    const plan = planFilmText([undefined, undefined], "The intro.", ["Second.", long, "Fourth.", "x".repeat(600) + "."]);
    expect(plan.captions).toEqual(["The intro.", "Second."]);
    // The paragraph that started no frame stays whole; a very long one gets a text frame of its own.
    expect(plan.textFrames).toEqual([[long, "Fourth."], ["x".repeat(600) + "."]]);
    // A paragraph cut short by the last frame keeps its remaining sentences together.
    const cut = planFilmText([undefined, undefined], "", [long]);
    const lines = splitCaption(long);
    expect(cut.captions).toEqual(lines.slice(0, 2));
    expect(cut.textFrames).toEqual(lines.length > 2 ? [[lines.slice(2).join(" ")]] : []);
  });

  it("puts the pieces in order with their captions, then the text frames", () => {
    const piece = (id: string) => ({ type: "image" as const, src: `https://cdn.sanity.io/images/p/production/${id}-1200x800.jpg` });
    const film = buildFilm([piece("a"), piece("b")], "Intro.", ["One.", "Two.", "Three."]);
    expect(film.map((f) => (f.kind === "text" ? `text:${f.paragraphs.join("|")}` : `${f.item.src.includes("/a-") ? "a" : "b"}:${f.caption}`))).toEqual([
      "a:Intro.",
      "b:One.",
      "text:Two.|Three.",
    ]);
    expect(buildFilm([], "", [])).toEqual([]);
  });
});

describe("Scroll film position: active frame, progress, landings and steps", () => {
  it("flips the active frame when the next one has covered half the screen", () => {
    expect(filmPosition(0, 800, 5).active).toBe(0);
    expect(filmPosition(399, 800, 5).active).toBe(0);
    expect(filmPosition(400, 800, 5).active).toBe(1);
    expect(filmPosition(3200, 800, 5).active).toBe(4);
    // Past the last frame (the page goes on to the footer) and before the first, clamped.
    expect(filmPosition(9000, 800, 5).active).toBe(4);
    expect(filmPosition(-300, 800, 5).active).toBe(0);
  });

  it("fills the line by the frames passed over the whole: a sliver at the first, full at the last", () => {
    expect(filmPosition(0, 800, 4).progress).toBe(0.25);
    expect(filmPosition(400, 800, 4).progress).toBe(0.375);
    expect(filmPosition(2400, 800, 4).progress).toBe(1);
    expect(filmPosition(5000, 800, 4).progress).toBe(1);
    expect(filmPosition(0, 800, 1).progress).toBe(1);
    expect(filmPosition(0, 800, 0)).toEqual({ active: 0, progress: 0 });
    expect(filmPosition(100, 0, 3)).toEqual({ active: 0, progress: 0 });
  });

  it("lands a frame exactly under the header", () => {
    expect(filmFrameScrollY(64, 0, 800)).toBe(0);
    expect(filmFrameScrollY(64, 3, 800)).toBe(2400);
    expect(filmFrameScrollY(200, 2, 700, 64)).toBe(1536);
  });

  it("steps one frame, finishing a half-scrolled frame first, clamped at the ends", () => {
    expect(filmStep(0, 800, 5, 1)).toBe(1);
    expect(filmStep(800, 800, 5, 1)).toBe(2);
    expect(filmStep(1000, 800, 5, 1)).toBe(2);
    expect(filmStep(1000, 800, 5, -1)).toBe(1);
    expect(filmStep(1600, 800, 5, -1)).toBe(1);
    expect(filmStep(0, 800, 5, -1)).toBe(0);
    expect(filmStep(3200, 800, 5, 1)).toBe(4);
  });

  it("asks for a landscape at the screen's width and a portrait at its own width at full height", () => {
    expect(filmImageSizes(1.5)).toBe("100vw");
    expect(filmImageSizes(0.75)).toBe("min(100vw, calc((100vh - 64px) * 0.75))");
    expect(filmImageSizes(Number.NaN)).toBe("100vw");
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

/** The frames container's document top and one frame's height, as the page measures them. */
function stubGeometry(framesTop: () => number, frameHeight = 800) {
  const real = Element.prototype.getBoundingClientRect;
  const spy = vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    if (this.classList.contains("reel-frames")) return { top: framesTop() - window.scrollY, left: 0 } as DOMRect;
    return real.call(this);
  });
  const height = vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) {
    return this.classList.contains("reel-frame") ? frameHeight : 0;
  });
  return () => {
    spy.mockRestore();
    height.mockRestore();
  };
}

describe("Project page, Scroll film", () => {
  it("opens on the first frame with the facets as links into the filtered wall, over the picture", () => {
    render("archive-b");
    const meta = container.querySelector(".reel-frames > .reel-frame:first-child .reel-meta")!;
    expect(meta).not.toBeNull();
    const facets = meta.querySelector(".reel-meta__facets")!;
    expect(facets.textContent).toBe("Hospitality & Travel\u00a0\u00a0·  Website, Brand Identity\u00a0\u00a0·  Mexico\u00a0\u00a0·  Rebrand");
    const links = Array.from(facets.querySelectorAll("a")).map((a) => [a.textContent, a.getAttribute("href")]);
    // Brand Identity is on every project, so it is text, not a link; Stage is text.
    expect(links).toEqual([
      ["Hospitality & Travel", "/?sector=hospitality-travel"],
      ["Website", "/?discipline=website"],
      ["Mexico", "/?place=mexico"],
    ]);
    expect(facets.textContent).not.toContain("Hotel");
    // Only the first frame says what the project is.
    expect(container.querySelectorAll(".reel-meta")).toHaveLength(1);
  });

  it("puts the proof line on the first frame of the project it is about, and on no other", () => {
    API.push(raw({ slug: "rustico", title: "Rústico" }));
    try {
      render("rustico");
      expect(container.querySelector(".reel-frame:first-child .reel-meta__proof")?.textContent).toBe(siteCopy.project.proof.rustico);
      expect(container.querySelector(".reel-meta__proof")?.textContent).toContain("MICHELIN Green Star");
      act(() => root.unmount());
      root = createRoot(container);
      render("archive-b");
      expect(container.querySelector(".reel-meta__proof")).toBeNull();
    } finally {
      API.pop();
    }
  });

  it("pins one bar: the title as the page's heading, the active caption read aloud, a line with no digits", () => {
    API.push(raw({ slug: "story", title: "Story", description: "One line. First paragraph.", body: "Second paragraph.\n\nThird paragraph.", images: [image("s1"), image("s2")] }));
    try {
      render("story");
      const article = container.querySelector("article.reel")!;
      // The bar comes first in the document (read before the frames); CSS pins it to the bottom.
      expect(Array.from(article.children).map((el) => el.className)).toEqual(["reel-bar-slot", "reel-frames"]);
      const bar = container.querySelector(".reel-bar")!;
      expect(bar.querySelector("h1")?.textContent).toBe("Story");
      expect(container.querySelectorAll("h1")).toHaveLength(1);
      const live = bar.querySelector(".reel-bar__live")!;
      expect(live.getAttribute("aria-live")).toBe("polite");
      expect(live.textContent).toBe("One line.");
      expect(bar.querySelector(".reel-progress")?.getAttribute("aria-hidden")).toBe("true");
      expect(bar.textContent).not.toMatch(/\d/);
      // Three pieces carry the line and two paragraphs; the third paragraph closes the film as text.
      expect(Array.from(container.querySelectorAll(".reel-frame--text p")).map((p) => p.textContent)).toEqual(["Third paragraph."]);
    } finally {
      API.pop();
    }
  });

  it("is frames and the bar, then nothing: no call to action, no next project, no counters or arrows", () => {
    render("archive-b");
    const article = container.querySelector("article.reel")!;
    expect(article.textContent).not.toMatch(/\d/);
    // The header keeps "Start a project"; the page itself adds no second one.
    expect(article.querySelector('a[href^="/brief"]')).toBeNull();
    expect(article.querySelector("svg")).toBeNull();
    expect(container.querySelector(".story-cta, .story-next, .story-more, .story-rail, .film-strip")).toBeNull();
  });

  it("makes the frames a focusable carousel of labelled groups, with no number in any label", () => {
    API.push(raw({ slug: "story", title: "Story", description: "One line. First paragraph.", body: "Second paragraph.\n\nThird paragraph.", images: [image("s1"), image("s2")] }));
    try {
      render("story");
      const frames = container.querySelector<HTMLElement>(".reel-frames")!;
      expect(frames.tabIndex).toBe(0);
      expect(frames.getAttribute("aria-roledescription")).toBe("carousel");
      expect(frames.getAttribute("aria-label")).toBe("Story");
      const groups = Array.from(frames.querySelectorAll(".reel-frame"));
      expect(groups.every((f) => f.getAttribute("role") === "group")).toBe(true);
      expect(groups.map((f) => f.getAttribute("aria-label"))).toEqual(["Story, image", "Story, image", "Story, image", "Story, text"]);
      expect(container.querySelector("article")!.innerHTML).not.toMatch(/aria-label="[^"]*\d/);
    } finally {
      API.pop();
    }
  });

  it("fills the frame: a landscape covers it (on its hotspot), a portrait sits whole over a blurred copy of itself", () => {
    API.push(raw({ slug: "tall", title: "Tall", coverImage: "https://cdn.sanity.io/images/p/production/tall-1080x1440.png" }));
    API.push(raw({ slug: "focal", title: "Focal", coverImage: "https://cdn.sanity.io/images/p/production/focal-1200x800.png", coverFocal: { x: 0.5, y: 0.15 } }));
    try {
      for (const [slug, shape, sizes] of [
        ["archive-b", "landscape", "100vw"],
        ["tall", "portrait", "min(100vw, calc((100vh - 64px) * 0.75))"],
        ["focal", "landscape", "100vw"],
      ]) {
        act(() => root.unmount());
        root = createRoot(container);
        render(slug);
        const button = container.querySelector<HTMLElement>(".reel-frame:first-child .reel-frame__button")!;
        expect(button.dataset.shape, slug).toBe(shape);
        const img = button.querySelector<HTMLImageElement>(".reel-frame__image")!;
        expect(img.getAttribute("sizes"), slug).toBe(sizes);
        // The image itself is never cropped by the CDN: CSS frames it.
        const url = new URL(img.getAttribute("src")!);
        expect(url.searchParams.get("fit"), slug).toBe("max");
        expect(url.searchParams.get("crop"), slug).toBeNull();
        expect(img.getAttribute("srcset"), slug).toContain("w=2400");
        const fill = button.querySelector<HTMLImageElement>(".reel-frame__fill")!;
        expect(fill.getAttribute("aria-hidden")).toBe("true");
        expect(fill.getAttribute("alt")).toBe("");
        expect(new URL(fill.getAttribute("src")!).searchParams.get("w")).toBe("64");
      }
      expect(container.querySelector<HTMLElement>(".reel-frame__image")!.style.getPropertyValue("--focal")).toBe("50.0% 15.0%");
    } finally {
      API.pop();
      API.pop();
    }
  });

  it("loads the active frame and its neighbours at once, the rest as the page scrolls", () => {
    API.push(raw({ slug: "many", title: "Many", images: ["m1", "m2", "m3", "m4", "m5"].map(image) }));
    try {
      render("many");
      const loading = Array.from(container.querySelectorAll<HTMLImageElement>(".reel-frame__image")).map((img) => img.getAttribute("loading"));
      expect(loading).toEqual(["eager", "eager", "lazy", "lazy", "lazy", "lazy"]);
      const decoding = Array.from(container.querySelectorAll<HTMLImageElement>(".reel-frame img")).map((img) => img.getAttribute("decoding"));
      expect(new Set(decoding)).toEqual(new Set(["async"]));
      expect(container.querySelector(".reel-frame__image")?.getAttribute("fetchpriority")).toBe("high");
    } finally {
      API.pop();
    }
  });

  it("renders the media in order, cover first", () => {
    render("archive-b");
    const sources = Array.from(container.querySelectorAll(".reel-frame__image")).map((img) => img.getAttribute("src"));
    expect(sources).toHaveLength(3);
    expect(sources[0]).toContain("archive-b");
    expect(sources[1]).toContain("b1");
    expect(sources[2]).toContain("b2");
  });

  it("moves one frame with the arrows and Page keys, to the ends with Home and End", () => {
    render("archive-b");
    const restore = stubGeometry(() => 64);
    const scrollTo = vi.mocked(window.scrollTo);
    scrollTo.mockClear();
    const frames = container.querySelector<HTMLElement>(".reel-frames")!;
    const press = (key: string) => {
      const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
      act(() => {
        frames.dispatchEvent(event);
      });
      return event;
    };
    try {
      expect(press("ArrowDown").defaultPrevented).toBe(true);
      // Reduced motion in this suite: the jump is instant.
      expect(scrollTo).toHaveBeenLastCalledWith({ top: 800, behavior: "auto" });
      Object.defineProperty(window, "scrollY", { configurable: true, value: 800 });
      press("PageDown");
      expect(scrollTo).toHaveBeenLastCalledWith({ top: 1600, behavior: "auto" });
      press("ArrowUp");
      expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "auto" });
      press("PageUp");
      expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "auto" });
      press("End");
      expect(scrollTo).toHaveBeenLastCalledWith({ top: 1600, behavior: "auto" });
      expect(press("a").defaultPrevented).toBe(false);
    } finally {
      Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
      restore();
    }
  });

  it("lands on the image clicked on the wall (?at=) under the header, and checks again at 250 and 900ms", () => {
    vi.useFakeTimers();
    let framesTop = 64;
    const restore = stubGeometry(() => framesTop);
    try {
      render("archive-b", "at=b2");
      // b2 is the third frame: two frames below the first.
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 1600, behavior: "auto" });
      expect(container.querySelector(".reel-bar__live")?.textContent).toBe("");
      // The page above the frames settled late: the next check corrects the landing.
      framesTop = 100;
      act(() => vi.advanceTimersByTime(250));
      expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1636, behavior: "auto" });
      act(() => vi.advanceTimersByTime(650));
      expect(vi.mocked(window.scrollTo).mock.calls.filter(([arg]) => typeof arg === "object")).toHaveLength(3);
      // The frame landed on and its neighbours load at once.
      const loading = Array.from(container.querySelectorAll<HTMLImageElement>(".reel-frame__image")).map((img) => img.getAttribute("loading"));
      expect(loading).toEqual(["lazy", "eager", "eager"]);
    } finally {
      restore();
      vi.useRealTimers();
    }
  });

  it("renders the bar alone for a project with no media", () => {
    API.push(raw({ slug: "bare", title: "Bare", coverImage: "", images: [] }));
    try {
      render("bare");
      expect(container.querySelector(".reel-frames")).toBeNull();
      expect(container.querySelector("h1")?.textContent).toBe("Bare");
      expect(container.querySelector(".reel")?.getAttribute("data-media")).toBe("none");
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

  it("plays muted video while on screen and pauses it off screen; poster until then", () => {
    reducedMotion = false;
    API.push(VIDEO_PROJECT);
    try {
      render("with-video");
      const video = container.querySelector("video")!;
      expect(video.closest(".reel-frame")?.getAttribute("aria-label")).toBe("With Video, video");
      expect(video.controls).toBe(false);
      expect(video.muted).toBe(true);
      expect(video.loop).toBe(true);
      expect(video.getAttribute("preload")).toBe("none");
      expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
      intersect(true);
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
      intersect(false);
      expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
      // One pause control for the page, on the opening frame.
      expect(container.querySelectorAll(".reel-meta .motion-toggle")).toHaveLength(1);
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
    const opener = container.querySelectorAll<HTMLButtonElement>(".reel-frame__button")[1];
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
    const opener = container.querySelector<HTMLButtonElement>(".reel-frame__button")!;
    act(() => opener.focus());
    act(() => opener.click());
    const close = document.querySelector<HTMLButtonElement>(".lightbox__control--close")!;
    act(() => close.click());
    expect(document.activeElement).toBe(opener);
  });
});
