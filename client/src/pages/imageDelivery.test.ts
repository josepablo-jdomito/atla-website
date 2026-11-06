// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./Home";
import Project from "./Project";
import type { Project as ProjectRecord } from "@shared/schema";

vi.mock("@/hooks/use-analytics", () => ({ trackEvent: vi.fn() }));
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const image = (id: string) => `https://cdn.sanity.io/images/p/production/${id}-1080x1440.png`;
const project = (slug: string, extra: Record<string, unknown> = {}) =>
  ({
    id: slug,
    slug,
    title: slug,
    client: "",
    country: "Mexico",
    sector: "Hospitality & Travel",
    disciplines: ["Brand Identity"],
    stage: "New brand",
    searchTerms: [],
    tags: ["Branding"],
    year: 2025,
    description: "A line. More text.",
    coverImage: image(`${slug}-cover`),
    images: [image(`${slug}-1`), image(`${slug}-2`)],
    videos: [],
    featured: true,
    homeOrder: 1,
    ...extra,
  }) as unknown as ProjectRecord;

const API = [project("alpha"), project("beta", { homeOrder: 2 })];

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  HTMLMediaElement.prototype.pause = vi.fn();
  HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.head.querySelectorAll("link[data-atla-preload]").forEach((node) => node.remove());
});

function mount(path: string, page: typeof Home | typeof Project, slug?: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  client.setQueryData(["/api/projects"], API);
  if (slug) client.setQueryData(["project", slug], API.find((p) => p.slug === slug) ?? null);
  const location = memoryLocation({ path });
  act(() => root.render(createElement(QueryClientProvider, { client }, createElement(Router, { hook: location.hook, searchHook: () => "" }, createElement(page)))));
}

/** Every Sanity URL a page asks the browser for: img src and srcset, video poster, preload links. */
function requestedSanityUrls() {
  const urls: string[] = [];
  const collect = (value: string | null) => {
    for (const part of (value ?? "").split(/,\s+(?=https?:)/)) {
      const url = part.trim().split(/\s+/)[0];
      if (url.includes("cdn.sanity.io/images/")) urls.push(url);
    }
  };
  for (const el of Array.from(document.querySelectorAll("img, video, link[rel='preload']"))) {
    collect(el.getAttribute("src"));
    collect(el.getAttribute("srcset"));
    collect(el.getAttribute("poster"));
    if (el instanceof HTMLLinkElement) collect(el.getAttribute("href"));
  }
  return urls;
}

const expectSized = (urls: string[]) => {
  expect(urls.length).toBeGreaterThan(0);
  for (const url of urls) {
    expect(url, url).toMatch(/[?&]w=\d+/);
    expect(url, url).toMatch(/[?&]auto=format/);
  }
};

describe("no component hands the browser a bare Sanity image", () => {
  it("the home: wall tiles, header thumbs and the head preloads", () => {
    mount("/", Home);
    expectSized(requestedSanityUrls());
  });

  it("a project page: the strip, the lightbox and the head preloads", () => {
    mount("/projects/alpha", Project, "alpha");
    expectSized(requestedSanityUrls());
    const opener = container.querySelector<HTMLButtonElement>(".film-frame__button")!;
    act(() => opener.click());
    expect(document.querySelector(".lightbox__image")).not.toBeNull();
    const urls = requestedSanityUrls();
    expectSized(urls);
    // The lightbox asks for 2000px at most among its candidates, never the original file.
    const lightbox = document.querySelector(".lightbox__image")!;
    const widths = (lightbox.getAttribute("srcset") ?? "").match(/w=(\d+)/g)?.map((w) => Number(w.slice(2))) ?? [];
    expect(Math.min(...widths)).toBeLessThanOrEqual(2000);
  });
});
