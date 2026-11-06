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

/** A fresh root per render, so a second render in one test starts clean. */
function remount() {
  act(() => root.unmount());
  root = createRoot(container);
}

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
  it("shows the title, the client and the services (not tags) in the hero", () => {
    render("archive-b");
    expect(container.querySelector("h1")?.textContent).toBe("Rústico & Co / Tulum");
    const labels = Array.from(container.querySelectorAll(".pj-hero .pj-label")).map((el) => el.textContent);
    expect(labels).toEqual(["( Clients )", "( Service )"]);
    expect(container.querySelector(".pj-hero__value")?.textContent).toBe("Rústico");
    const services = Array.from(container.querySelectorAll(".pj-hero__services li")).map((li) => li.textContent);
    expect(services).toEqual(["Branding", "Website"]);
  });

  it("shows the location (locationName, else country) and the year when no month is known", () => {
    API.push(raw({ slug: "placed", title: "Placed", country: "Mexico", locationName: "Los Cabos", year: 2025 }));
    try {
      render("placed");
      expect(container.querySelector(".pj-hero__place")?.textContent).toBe("Los Cabos");
      expect(container.querySelector(".pj-hero__date")?.textContent).toBe("2025");
    } finally {
      API.pop();
    }
    API.push(raw({ slug: "country", title: "Country", country: "Peru" }));
    try {
      remount();
      render("country");
      expect(container.querySelector(".pj-hero__place")?.textContent).toBe("Peru");
    } finally {
      API.pop();
    }
  });

  it("maps body blocks 1–3 to The Brand, The Challenge and The Result, and renders only blocks with text", () => {
    API.push(raw({ slug: "told", title: "Told", body: "First block.\n\nSecond block." }));
    try {
      render("told");
      const blocks = Array.from(container.querySelectorAll(".pj-about__block")).map((b) => [
        b.querySelector("h2")?.textContent,
        b.querySelector("p")?.textContent,
      ]);
      expect(blocks).toEqual([
        ["( The Brand )", "First block."],
        ["( The Challenge )", "Second block."],
      ]);
    } finally {
      API.pop();
    }
    remount();
    render("archive-b");
    expect(container.querySelector("h1")?.textContent).toBe("Rústico & Co / Tulum");
    expect(container.querySelectorAll(".pj-about__block")).toHaveLength(0);
  });

  it("falls back to one credit row in two columns when the API has no credits", () => {
    render("archive-b");
    const rows = Array.from(container.querySelectorAll(".pj-credits__row"));
    expect(rows).toHaveLength(1);
    expect(rows[0].querySelector("dt")?.textContent).toBe("Creative Direction");
    expect(rows[0].querySelector("dd")?.textContent).toBe("José Pablo Domínguez");
  });

  it("uses the project's credits when the API sends them", () => {
    API.push(raw({ slug: "credited", title: "Credited", credits: [{ role: "Design", names: ["A", "B"] }, { role: "Copy", name: "C" }] }));
    try {
      render("credited");
      const rows = Array.from(container.querySelectorAll(".pj-credits__row")).map((row) => [
        row.querySelector("dt")?.textContent,
        Array.from(row.querySelectorAll("dd span")).map((span) => span.textContent),
      ]);
      expect(rows).toEqual([["Design", ["A", "B"]], ["Copy", ["C"]]]);
    } finally {
      API.pop();
    }
  });

  it("lists the other works in site order after this one, each a link, with the next cover as the strip", () => {
    render("archive-b");
    const rows = Array.from(container.querySelectorAll<HTMLAnchorElement>(".pj-others__row"));
    expect(rows.map((a) => a.getAttribute("href"))).toEqual(["/projects/feat-one", "/projects/feat-two", "/projects/archive-a"]);
    expect(rows[0].textContent).toBe("Feature One2025");
    expect(container.querySelector(".pj-others__strip")?.getAttribute("href")).toBe("/projects/feat-one");
    expect(container.querySelector(".pj-others__strip img")?.getAttribute("src")).toContain("feat-one");
  });

  it("renders the cover in the hero, then the media in order, every image clickable with its data-asset", () => {
    render("archive-b");
    const hero = container.querySelector(".pj-hero__media img")?.getAttribute("src");
    expect(hero).toContain("archive-b");
    const sources = Array.from(container.querySelectorAll(".pj-media img")).map((img) => img.getAttribute("src"));
    expect(sources).toHaveLength(2);
    expect(sources[0]).toContain("b1");
    expect(sources[1]).toContain("b2");
    const assets = Array.from(container.querySelectorAll("[data-asset]")).map((el) => el.getAttribute("data-asset"));
    expect(assets).toEqual(["archive-b", "b1", "b2"]);
    expect(container.querySelectorAll(".pj-media__button")).toHaveLength(3);
  });

  it("pairs portraits 600 wide and runs landscapes 1200 wide, height capped as in the Figma", () => {
    const portrait = (id: string) => `https://cdn.sanity.io/images/p/production/${id}-1000x2000.jpg`;
    API.push(raw({ slug: "rhythm", title: "Rhythm", images: [portrait("p1"), portrait("p2"), image("l1")] }));
    try {
      render("rhythm");
      const groups = Array.from(container.querySelectorAll<HTMLElement>(".pj-media__group"));
      expect(groups.map((g) => [g.dataset.kind, g.style.getPropertyValue("--pj-ar")])).toEqual([
        ["pair", "600 / 800"],
        ["full", "1200 / 750"],
      ]);
    } finally {
      API.pop();
    }
  });

  it("renders the hero, about and other works for a project with no media", () => {
    API.push(raw({ slug: "bare", title: "Bare", coverImage: "", images: [] }));
    try {
      render("bare");
      expect(container.querySelector(".pj-media")).toBeNull();
      expect(container.querySelector(".pj-hero")?.textContent).toContain("Bare");
      expect(container.querySelector(".pj-about")).not.toBeNull();
      expect(container.querySelector(".pj-others__row")?.getAttribute("href")).toBe("/projects/feat-one");
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

  // jsdom lays nothing out, so the sticky header measures 0 here; in the browser its height is subtracted.
  it("lands on the image named by ?at=, below the header", () => {
    const rect = vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
      const top = this.getAttribute("data-asset") === "b2" ? 1800 : 0;
      return { top, bottom: top, left: 0, right: 0, width: 0, height: 0, x: 0, y: top, toJSON: () => ({}) } as DOMRect;
    });
    // jsdom has no CSS.escape; the asset keys here need no escaping.
    const css = globalThis as unknown as { CSS?: { escape?: (value: string) => string } };
    css.CSS = { ...css.CSS, escape: css.CSS?.escape ?? ((value: string) => value) };
    try {
      const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
      client.setQueryData(["/api/projects"], API);
      client.setQueryData(["project", "archive-b"], API.find((p) => p.slug === "archive-b"));
      window.history.replaceState(null, "", "/projects/archive-b?at=b2");
      location = memoryLocation({ path: "/projects/archive-b" });
      act(() =>
        root.render(
          createElement(QueryClientProvider, { client }, createElement(Router, { hook: location.hook }, createElement(Project))),
        ),
      );
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 1800, behavior: "auto" });
      expect(window.scrollTo).not.toHaveBeenCalledWith(0, 0);
    } finally {
      window.history.replaceState(null, "", "/");
      rect.mockRestore();
    }
  });

  it("puts the first direct video in the hero when the project has no cover", () => {
    API.push(raw({ slug: "video-hero", title: "Video Hero", coverImage: "", images: [], videoFiles: [{ url: "https://cdn.sanity.io/files/p/production/hero.mp4" }] }));
    try {
      render("video-hero");
      expect(container.querySelector(".pj-hero__media video")?.getAttribute("src")).toContain("hero.mp4");
      expect(container.querySelector(".pj-media")).toBeNull();
    } finally {
      API.pop();
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
    const opener = container.querySelectorAll<HTMLButtonElement>(".pj-media__button")[1];
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
    const opener = container.querySelector<HTMLButtonElement>(".pj-media__button")!;
    act(() => opener.focus());
    act(() => opener.click());
    const close = document.querySelector<HTMLButtonElement>(".lightbox__control--close")!;
    act(() => close.click());
    expect(document.activeElement).toBe(opener);
  });
});
