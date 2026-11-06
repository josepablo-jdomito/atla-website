// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Project, { buildFilm } from "./Project";
import { buildProjectPageView, CAPTION_MAX, captionSentences, filmFrameScrollY, filmImageSizes, filmPosition, filmStep, planFilmText } from "@/lib/projectPage";
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
  const free = (n: number) => Array<string | undefined>(n).fill(undefined);
  const LONG_SENTENCE = "We kept the wordmark calm, a deep teal serif with a macron over the last A, and let the warmth come from drawings in thin orange line: palms, faces, people holding hands.";

  it("reads a paragraph as its whole sentences, in order, never cut inside one", () => {
    expect(captionSentences("One. Two, with a comma. Three?")).toEqual(["One.", "Two, with a comma.", "Three?"]);
    expect(captionSentences("  ")).toEqual([]);
    expect(LONG_SENTENCE.length).toBeGreaterThan(CAPTION_MAX);
  });

  it("gives the first frame the intro, then each paragraph one sentence per frame, in order", () => {
    const plan = planFilmText(free(6), "The intro.", ["First. Second.", "Third."]);
    expect(plan.captions).toEqual(["The intro.", "First.", "Second.", "Third.", "", ""]);
    expect(plan.textFrames).toEqual([]);
  });

  it("sends a paragraph whole to the end frames when its sentences do not fit the frames left, and goes on", () => {
    const plan = planFilmText(free(3), "The intro.", ["One. Two. Three.", "Four."]);
    // Three sentences, two frames left: the paragraph is never split between captions and an end frame.
    expect(plan.captions).toEqual(["The intro.", "Four.", ""]);
    expect(plan.textFrames).toEqual([["One. Two. Three."]]);
  });

  it("sends a paragraph whole to the end frames when one of its sentences is too long for the bar", () => {
    const plan = planFilmText(free(5), "", [`Short one. ${LONG_SENTENCE}`, "After."]);
    expect(plan.captions).toEqual(["After.", "", "", "", ""]);
    expect(plan.textFrames).toEqual([[`Short one. ${LONG_SENTENCE}`]]);
  });

  it("never invents a caption: a Sanity caption is kept as written, frames past the story carry the title alone", () => {
    const plan = planFilmText([undefined, "The menu, on cream paper.", undefined, undefined], "The intro.", ["One paragraph."]);
    expect(plan.captions).toEqual(["The intro.", "The menu, on cream paper.", "One paragraph.", ""]);
    expect(planFilmText(free(2), "", []).captions).toEqual(["", ""]);
  });

  it("packs end frames with whole paragraphs, a very long one on its own", () => {
    const plan = planFilmText([], "Intro.", ["Second.", "x".repeat(600) + "."]);
    expect(plan.captions).toEqual([]);
    expect(plan.textFrames).toEqual([["Intro.", "Second."], ["x".repeat(600) + "."]]);
  });

  it("Mundã: every paragraph is all captions or one whole end frame, and no end frame opens on a fragment", () => {
    const view = buildProjectPageView(raw({ slug: "munda", title: "Mundã", description: "Mundã is a project of vacation and long-stay homes in La Saladita, on the coast of Guerrero, Mexico. Its full name is Mundã, Aldea del Mar, a village by the sea. The brand had to sell a way of living there, close to the waves and to the neighbors, on posters, on paper and on the wall at the entrance. We made it in 2022.", body: "The posters carry the line the brand was built on: strengthen your connection with nature, near the waves. Under it sat the values the client chose, connection with nature, fullness, community and a way of life. We kept the wordmark calm, a deep teal serif with a macron over the last A, and let the warmth come from drawings in thin orange line: palms, faces, people holding hands.\n\nThe logotype and its variants. Posters with the coastline coordinates, sunset photography and line illustrations. Envelopes, folders and business cards in deep teal, cream and burnt orange. Backlit signage for the entrance, shown in renders on a thatched gate. In 2023, animations of the mark and a looping beach scene.\n\nIn 2025 a prospective client wrote to us and named Mundã as the reference for her own brand. What she liked, in her words, was the simplicity of the brand, the people in it and its color palette, which she called interesting." }), []);
    const story = [view.intro, ...view.bodySections];
    // The cover and six images.
    const plan = planFilmText(free(7), view.intro, view.bodySections);
    const captioned = plan.captions.filter(Boolean);
    const ended = plan.textFrames.flat();
    for (const paragraph of story) {
      const sentences = captionSentences(paragraph);
      const asCaptions = sentences.every((sentence) => captioned.includes(sentence));
      const asEnd = ended.includes(sentences.join(" "));
      expect(asCaptions !== asEnd, paragraph.slice(0, 40)).toBe(true);
    }
    expect(plan.captions[0]).toBe("Mundã is a project of vacation and long-stay homes in La Saladita, on the coast of Guerrero, Mexico.");
    // The paragraph with the long wordmark sentence reads whole at the end, from its first sentence.
    expect(plan.textFrames[0][0].startsWith("The posters carry the line")).toBe(true);
    expect(ended.some((paragraph) => paragraph.startsWith("palms"))).toBe(false);
    // Every caption is a whole sentence of the story.
    for (const caption of captioned) expect(story.some((paragraph) => captionSentences(paragraph).includes(caption))).toBe(true);
  });

  it("puts the pieces in order with their captions, then the end frames", () => {
    const piece = (id: string) => ({ type: "image" as const, src: `https://cdn.sanity.io/images/p/production/${id}-1200x800.jpg` });
    const film = buildFilm([piece("a"), piece("b")], "Intro.", ["One.", "Two. Three."]);
    expect(film.map((f) => (f.kind === "text" ? `text:${f.paragraphs.join("|")}` : `${f.item.src.includes("/a-") ? "a" : "b"}:${f.caption}`))).toEqual([
      "a:Intro.",
      "b:One.",
      "text:Two. Three.",
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
