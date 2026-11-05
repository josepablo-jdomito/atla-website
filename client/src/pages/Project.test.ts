// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Project from "./Project";
import { nextProjectInSiteOrder, siteOrder, toSiteProject } from "@/components/site/siteProjects";
import type { Project as ProjectRecord } from "@shared/schema";

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
    industry: "Hospitality",
    region: "America",
    services: ["Branding"],
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
  raw({ slug: "archive-b", title: "Rústico & Co / Tulum", client: "Rústico", year: 2023, services: ["Branding", "Website"], tags: ["Hotel", "Branding"], images: [image("b1"), image("b2")] }),
  raw({ slug: "feat-one", title: "Feature One", featured: true, homeOrder: 1 }),
];

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
  it("shows client, year and services (not tags) in the header line", () => {
    render("archive-b");
    const parts = Array.from(container.querySelector(".project-head")!.children).map((el) => el.textContent);
    expect(parts).toEqual(["Rústico", "2023", "Branding, Website"]);
  });

  it("links the brief with the title as an encoded seed", () => {
    render("archive-b");
    const cta = container.querySelector<HTMLAnchorElement>(".project-cta a");
    expect(cta?.getAttribute("href")).toBe(`/brief?seed=${encodeURIComponent("Like Rústico & Co / Tulum")}`);
    expect(new URL(cta!.href, "https://x.test").searchParams.get("seed")).toBe("Like Rústico & Co / Tulum");
  });

  it("sends the last project in site order to the first", () => {
    render("archive-b");
    const next = container.querySelector<HTMLAnchorElement>(".project-next a");
    expect(next?.getAttribute("href")).toBe("/projects/feat-one");
  });

  it("renders the media in order, cover first", () => {
    render("archive-b");
    const sources = Array.from(container.querySelectorAll(".project-media img")).map((img) => img.getAttribute("src"));
    expect(sources).toHaveLength(3);
    expect(sources[0]).toContain("archive-b");
    expect(sources[1]).toContain("b1");
    expect(sources[2]).toContain("b2");
  });

  it("renders the header, brief and next blocks for a project with no media", () => {
    API.push(raw({ slug: "bare", title: "Bare", coverImage: "", images: [] }));
    try {
      render("bare");
      expect(container.querySelector(".project-media")).toBeNull();
      expect(container.querySelector(".project-head")?.textContent).toContain("Bare");
      expect(container.querySelector(".project-cta a")?.getAttribute("href")).toBe("/brief?seed=Like%20Bare");
      expect(container.querySelector(".project-next a")?.getAttribute("href")).toBe("/projects/feat-one");
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
