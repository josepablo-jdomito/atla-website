// @vitest-environment jsdom
// The Figma look, 2026-11-05 (docs/superpowers/specs/2026-11-05-figma-look.md): navbar, footer, index.
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { siteCopy } from "@/content/siteCopy";
import { SiteFooter, cityTime } from "./SiteFooter";
import { SiteHeader, THEME_STORAGE_KEY } from "./SiteHeader";
import { WorkWall } from "./WorkWall";
import { searchFromFilters, viewFromSearch, NO_FILTERS } from "./workFilters";

vi.mock("@/lib/ga", () => ({ trackBarSearch: vi.fn(), ga4Event: vi.fn() }));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function stubMedia(dark = false) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes("dark") ? dark : false,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
}

class StubObserver {
  observe() {}
  disconnect() {}
}

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  stubMedia();
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = StubObserver;
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  document.documentElement.removeAttribute("data-theme");
  const store = new Map<string, string>();
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
      removeItem: (key: string) => void store.delete(key),
      clear: () => store.clear(),
    },
  });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  window.history.replaceState(null, "", "/");
  container.remove();
});

describe("Navbar", () => {
  function renderHeader() {
    const location = memoryLocation({ path: "/" });
    act(() => root.render(createElement(Router, { hook: location.hook }, createElement(SiteHeader))));
  }

  it("reads Work About Services, the wordmark, then Journal Contact", () => {
    renderHeader();
    const bar = container.querySelector(".site-header__bar")!;
    const left = Array.from(bar.querySelectorAll(".site-header__left a"), (a) => a.textContent);
    const right = Array.from(bar.querySelectorAll(".site-header__right a"), (a) => a.textContent);
    expect(left).toEqual(["Work", "About", "Services"]);
    expect(right).toEqual(["Journal", "Contact"]);
    expect(bar.querySelector(".site-header__brand")?.getAttribute("aria-label")).toBe(siteCopy.header.homeLabel);
  });

  it("follows the system until a choice is made, then stores it and sets data-theme", () => {
    stubMedia(true);
    renderHeader();
    const [light, dark] = Array.from(container.querySelectorAll<HTMLButtonElement>(".site-header__bar .theme-toggle__option"));
    expect(dark.getAttribute("aria-pressed")).toBe("true");
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
    act(() => light.click());
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(light.getAttribute("aria-pressed")).toBe("true");
    expect(dark.getAttribute("aria-pressed")).toBe("false");
  });
});

describe("Footer", () => {
  function renderFooter() {
    const location = memoryLocation({ path: "/" });
    act(() => root.render(createElement(Router, { hook: location.hook }, createElement(SiteFooter))));
  }

  it("lists the five offices with their local time, 24-hour", () => {
    renderFooter();
    const offices = Array.from(container.querySelectorAll(".site-footer__office"));
    expect(offices.map((row) => row.querySelector(".site-footer__city")?.textContent)).toEqual([
      "Austin, US",
      "CDMX, MX",
      "Caracas, VZ",
      "Lima, PE",
      "Tijuana, MX",
    ]);
    for (const row of offices) expect(row.querySelector(".site-footer__time")?.textContent).toMatch(/^\d{2}:\d{2}$/);
    expect(cityTime("America/Lima", new Date("2026-11-05T17:35:00Z"))).toBe("12:35");
  });

  it("server HTML carries no time, so hydration never disagrees with the visitor's clock", () => {
    const html = renderToString(createElement(Router, { ssrPath: "/" }, createElement(SiteFooter)));
    expect(html).not.toMatch(/\d{2}:\d{2}/);
  });

  it("carries the footer line and scrolls to the top", () => {
    renderFooter();
    expect(container.querySelector(".site-footer__line")?.textContent).toBe(siteCopy.footer.line);
    const top = container.querySelector<HTMLButtonElement>(".site-footer__top")!;
    expect(top.textContent).toBe(siteCopy.footer.backToTop);
    act(() => top.click());
    expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
  });
});

const IMAGE = (id: string) => `https://cdn.sanity.io/images/p/production/${id}-1200x800.jpg`;

function projects(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i),
    slug: `p${i}`,
    title: `Project ${i}`,
    client: "",
    industry: i % 2 ? "Hospitality" : "Digital",
    region: "America",
    services: ["Branding"],
    service: "Branding",
    tags: [],
    year: 2025,
    coverImage: IMAGE(`p${i}`),
    images: [IMAGE(`p${i}a`)],
    videos: [],
    featured: false,
    homeOrder: null,
  }));
}

function wall(path: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  client.setQueryData(["/api/projects"], projects(6));
  // The wall reads its search from the browser location (wouter's default search hook).
  window.history.replaceState(null, "", path);
  const location = memoryLocation({ path: path.split("?")[0] });
  return createElement(QueryClientProvider, { client }, createElement(Router, { hook: location.hook }, createElement(WorkWall)));
}

describe("Index", () => {
  it("opens with the filter index: four bracketed columns, All and Masonry active", () => {
    act(() => root.render(wall("/")));
    const groups = Array.from(container.querySelectorAll(".work-filters .site-filter"));
    expect(groups.map((group) => group.querySelector(".site-filter__label")?.textContent)).toEqual([
      "( Region )",
      "( Industry )",
      "( Service )",
      "( View )",
    ]);
    const pressed = Array.from(container.querySelectorAll('.site-filter__option[aria-pressed="true"]'), (b) => b.textContent);
    expect(pressed).toEqual(["All", "All", "All", "Masonry"]);
    expect(container.querySelector("h1")).toBeNull();
  });

  it("captions every card with the project title and places it in a grid cell", () => {
    act(() => root.render(wall("/")));
    const tile = container.querySelector<HTMLAnchorElement>(".wall-tile")!;
    expect(tile.querySelector(".wall-tile__title")?.textContent).toMatch(/^Project \d$/);
    expect(tile.getAttribute("href")).toMatch(/^\/projects\/p\d\?at=p\da?$/);
    expect(tile.style.gridRow).not.toBe("");
    expect(tile.style.gridColumn).not.toBe("");
  });

  it("List shows one row per project with name, service and the year in brackets", () => {
    act(() => root.render(wall("/?view=list")));
    expect(container.querySelector(".wall-tile")).toBeNull();
    const rows = Array.from(container.querySelectorAll(".work-row"));
    expect(rows).toHaveLength(6);
    expect(rows[0].querySelector(".work-row__service")?.textContent).toBe("Branding");
    expect(rows[0].querySelector(".work-row__date")?.textContent).toBe("( 2025 )");
    expect(container.querySelector(".work-wall__more")).toBeNull();
  });

  it("the view and the filters live in the URL", () => {
    expect(viewFromSearch("?view=grid")).toBe("grid");
    expect(viewFromSearch("?view=nope")).toBe("masonry");
    expect(searchFromFilters({ ...NO_FILTERS, industry: "Hospitality" }, "", "list")).toBe("?industry=Hospitality&view=list");
    expect(searchFromFilters(NO_FILTERS, "", "masonry")).toBe("");
  });
});
