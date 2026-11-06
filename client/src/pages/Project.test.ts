// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Project, { groupStory } from "./Project";
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

describe("groupStory", () => {
  const portrait = (id: string) => ({ type: "image" as const, src: `https://cdn.sanity.io/images/p/production/${id}-800x1200.jpg` });
  const landscape = (id: string) => ({ type: "image" as const, src: `https://cdn.sanity.io/images/p/production/${id}-1200x800.jpg` });
  it("opens every project with its first piece alone in the opener frame, whatever its ratio", () => {
    const groups = groupStory([portrait("a"), portrait("b"), portrait("c"), landscape("d")]);
    expect(groups[0]).toEqual({ kind: "opener", items: [portrait("a")] });
    expect(groups.slice(1).map((group) => group.kind)).toEqual(["pair", "full"]);
  });
  it("renders nothing for a project without media", () => {
    expect(groupStory([])).toEqual([]);
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

function render(slug: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  client.setQueryData(["/api/projects"], API);
  client.setQueryData(["project", slug], API.find((p) => p.slug === slug) ?? null);
  location = memoryLocation({ path: `/projects/${slug}` });
  act(() =>
    root.render(
      createElement(
        QueryClientProvider,
        { client },
        createElement(Router, { hook: location.hook }, createElement(Project)),
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
        "story-head__title",
        "story-head__facts",
        "story-head__facets",
      ]);
      expect(container.querySelector(".story-text")).toBeNull();
      act(() => root.unmount());
      root = createRoot(container);
      render("wordy");
      // The line is one sentence; the rest of the description opens the story.
      expect(container.querySelector(".story-head__lead")?.textContent).toBe("A gin for the unreal.");
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

  it("frames the opener: cropped when the image is close to 4:3, whole when it is a portrait", () => {
    API.push(raw({ slug: "tall", title: "Tall", coverImage: "https://cdn.sanity.io/images/p/production/tall-1080x1440.png" }));
    API.push(raw({ slug: "focal", title: "Focal", coverImage: "https://cdn.sanity.io/images/p/production/focal-1080x1440.png", coverFocal: { x: 0.5, y: 0.15 } }));
    try {
      render("archive-b");
      expect(container.querySelector('.story-media[data-kind="opener"]')?.getAttribute("data-frame")).toBe("crop");
      for (const [slug, frame] of [["tall", "native"], ["focal", "crop"]]) {
        act(() => root.unmount());
        root = createRoot(container);
        render(slug);
        const opener = container.querySelector('.story-media[data-kind="opener"]')!;
        expect(opener.getAttribute("data-frame"), slug).toBe(frame);
        if (slug === "focal") {
          const url = new URL(opener.querySelector("img")!.getAttribute("src")!);
          expect(url.searchParams.get("crop")).toBe("focalpoint");
          expect(url.searchParams.get("fp-y")).toBe("0.15");
        }
      }
    } finally {
      API.pop();
      API.pop();
    }
  });

  it("links the brief with the title as an encoded seed", () => {
    render("archive-b");
    const cta = container.querySelector<HTMLAnchorElement>(".story-cta a");
    expect(cta?.getAttribute("href")).toBe(`/brief?seed=${encodeURIComponent("Like Rústico & Co / Tulum")}`);
    expect(new URL(cta!.href, "https://x.test").searchParams.get("seed")).toBe("Like Rústico & Co / Tulum");
  });

  it("renders the media in order, cover first", () => {
    render("archive-b");
    const sources = Array.from(container.querySelectorAll(".story-media img")).map((img) => img.getAttribute("src"));
    expect(sources).toHaveLength(3);
    expect(sources[0]).toContain("archive-b");
    expect(sources[1]).toContain("b1");
    expect(sources[2]).toContain("b2");
  });

  it("renders the header and brief blocks for a project with no media", () => {
    API.push(raw({ slug: "bare", title: "Bare", coverImage: "", images: [] }));
    try {
      render("bare");
      expect(container.querySelector(".story-media")).toBeNull();
      expect(container.querySelector(".story-head")?.textContent).toContain("Bare");
      expect(container.querySelector(".story-cta a")?.getAttribute("href")).toBe("/brief?seed=Like%20Bare");
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
