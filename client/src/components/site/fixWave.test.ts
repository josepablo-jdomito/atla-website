// @vitest-environment jsdom
// Fix wave, 2026-11-05 (final design critique + web quality audit): the client behaviours that changed.
import { readFileSync } from "node:fs";
import path from "node:path";
import { act, createElement } from "react";
import { renderToString } from "react-dom/server";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { siteCopy } from "@/content/siteCopy";
import { ownCovers } from "@/lib/journalCovers";
import Services from "@/pages/Services";
import Ventures from "@/pages/Ventures";
import { SiteHeader } from "./SiteHeader";
import { WorkExplore } from "./WorkExplore";
import { AUTO_PASSES, EAGER_MAX_DESKTOP, EAGER_MAX_PHONE, Tile, WorkWall, firstViewportKeys } from "./WorkWall";
import { trapTab } from "./focusTrap";

vi.mock("@/lib/ga", () => ({ trackBarSearch: vi.fn(), ga4Event: vi.fn() }));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const CSS = readFileSync(path.resolve(import.meta.dirname, "../../styles/site.css"), "utf8");
const INDEX_HTML = readFileSync(path.resolve(import.meta.dirname, "../../../index.html"), "utf8");

/** matchMedia whose "(min-width: 768px)" answer can be flipped, firing change listeners. */
function stubMedia() {
  let wide = false;
  const listeners = new Set<() => void>();
  window.matchMedia = ((query: string) => ({
    get matches() {
      return query.includes("min-width: 768px") ? wide : false;
    },
    media: query,
    addEventListener: (_: string, fn: () => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    addListener: () => undefined,
    removeListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
  return {
    setWide(value: boolean) {
      wide = value;
      act(() => listeners.forEach((fn) => fn()));
    },
  };
}

let observed: Array<{ callback: IntersectionObserverCallback; target?: Element }> = [];
class StubObserver {
  entry: { callback: IntersectionObserverCallback; target?: Element };
  constructor(callback: IntersectionObserverCallback) {
    this.entry = { callback };
    observed.push(this.entry);
  }
  observe(target: Element) {
    this.entry.target = target;
  }
  disconnect() {
    observed = observed.filter((item) => item !== this.entry);
  }
}

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  observed = [];
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = StubObserver;
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.style.overflow = "";
});

describe("Explore field", () => {
  function renderExplore(query = "coffee", activeCount = 2) {
    stubMedia();
    const onQuery = vi.fn();
    act(() =>
      root.render(
        createElement(
          WorkExplore,
          { query, onQuery, onClear: () => undefined, activeCount, visible: true },
          createElement("p", null, "filters"),
        ),
      ),
    );
    return { input: document.querySelector<HTMLInputElement>(".site-explore__input")!, onQuery };
  }

  it("is a combobox that owns its panel (aria-expanded is valid there), and shows no count", () => {
    const { input } = renderExplore();
    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-haspopup")).toBe("dialog");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    act(() => input.focus());
    expect(input.getAttribute("aria-expanded")).toBe("true");
    const panel = document.getElementById(input.getAttribute("aria-controls")!)!;
    expect(panel.getAttribute("role")).toBe("dialog");
    expect(document.querySelector(".site-explore__count")).toBeNull();
    expect(document.querySelector(".site-explore")!.textContent).not.toMatch(/\d/);
  });

  it("on a touch screen the first tap opens the filters without the keyboard; the second tap types", () => {
    const { input } = renderExplore();
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({ matches: query.includes("coarse"), media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
    try {
      act(() => input.focus());
      expect(document.querySelector(".site-explore__panel")).not.toBeNull();
      expect(document.activeElement).not.toBe(input);
      act(() => input.focus());
      expect(document.activeElement).toBe(input);
    } finally {
      window.matchMedia = original;
    }
  });

  it("draws one focus ring, on the pill: the field inside never draws its own", () => {
    expect(CSS).toContain(".site-explore__pill:focus-within { outline: 2px solid var(--site-ink); outline-offset: 3px; }");
    expect(CSS).toMatch(/\.site-explore \.site-explore__input:focus-visible \{\s*outline: 0;/);
  });

  it("Escape closes the panel, keeps the query and leaves focus on the field", () => {
    const { input, onQuery } = renderExplore();
    act(() => input.focus());
    const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
    act(() => {
      input.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(document.querySelector(".site-explore__panel")).toBeNull();
    expect(document.activeElement).toBe(input);
    expect(onQuery).not.toHaveBeenCalled();
    expect(input.value).toBe("coffee");
  });
});

describe("Menu sheet", () => {
  function renderHeader() {
    const media = stubMedia();
    const location = memoryLocation({ path: "/services" });
    const client = new QueryClient({ defaultOptions: { queries: { queryFn: async () => [], retry: false } } });
    act(() =>
      root.render(
        createElement(
          QueryClientProvider,
          { client },
          createElement(Router, { hook: location.hook }, createElement(SiteHeader)),
        ),
      ),
    );
    const button = container.querySelector<HTMLButtonElement>(".site-header__menu")!;
    const sheet = container.querySelector<HTMLElement>("#site-menu-sheet")!;
    return { media, button, sheet };
  }

  it("is a dialog; Tab cycles inside the card, from its last stop back to Close", () => {
    const { button, sheet } = renderHeader();
    expect(sheet.getAttribute("role")).toBe("dialog");
    act(() => button.click());
    const stops = Array.from(sheet.querySelectorAll<HTMLElement>("a[href], button"));
    act(() => stops[stops.length - 1].focus());
    const tab = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    act(() => {
      window.dispatchEvent(tab);
    });
    expect(tab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(sheet.querySelector(".site-sheet__close"));
  });

  it("offers Work, Services, Why Atla, Ventures, Contact and Start a project, and hides the Explore pill while open", () => {
    vi.useFakeTimers();
    const { button, sheet } = renderHeader();
    act(() => button.click());
    expect(Array.from(sheet.querySelectorAll(".site-sheet__link")).map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Work", "/"],
      ["Services", "/services"],
      ["Why Atla", "/about"],
      ["Ventures", "/ventures"],
      ["Contact", "/contact"],
      ["Start a project", "/brief"],
    ]);
    expect(document.documentElement.getAttribute("data-menu")).toBe("open");
    expect(CSS).toMatch(/html\[data-menu="open"\] \.site-explore,\s*html\[data-consent="open"\] \.site-explore \{ display: none; \}/);
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    act(() => vi.advanceTimersByTime(200));
    expect(document.documentElement.hasAttribute("data-menu")).toBe(false);
    vi.useRealTimers();
  });

  it("closes and gives the page its scroll back when the viewport crosses 768 px", () => {
    const { media, button, sheet } = renderHeader();
    act(() => button.click());
    expect(sheet.hidden).toBe(false);
    expect(document.body.style.overflow).toBe("hidden");
    media.setWide(true);
    expect(sheet.hidden).toBe(true);
    expect(document.body.style.overflow).toBe("");
  });
});

describe("trapTab", () => {
  it("wraps forward and back across a list of stops", () => {
    const a = document.createElement("button");
    const b = document.createElement("button");
    document.body.append(a, b);
    b.focus();
    const forward = { shiftKey: false, preventDefault: vi.fn() };
    trapTab(forward, [a, b]);
    expect(document.activeElement).toBe(a);
    const back = { shiftKey: true, preventDefault: vi.fn() };
    trapTab(back, [a, b]);
    expect(document.activeElement).toBe(b);
    a.remove();
    b.remove();
  });
});

const IMAGE = (id: string) => `https://cdn.sanity.io/images/p/production/${id}-1200x800.jpg`;

describe("Wall tiles", () => {
  const tile = { slug: "x", title: "X", src: IMAGE("abc"), kind: "image" as const, ratio: 1.5 };

  it("carries fetchpriority only when asked", () => {
    act(() => root.render(createElement(Tile, { tile, eager: true, priority: true, reduced: false })));
    expect(container.querySelector("img")?.getAttribute("fetchpriority")).toBe("high");
    act(() => root.render(createElement(Tile, { tile, eager: true, reduced: false })));
    expect(container.querySelector("img")?.hasAttribute("fetchpriority")).toBe(false);
  });

  it("paints the image's dominant colour under a tile that has one", () => {
    act(() => root.render(createElement(Tile, { tile: { ...tile, color: "#336699" }, eager: true, reduced: false })));
    expect((container.querySelector(".wall-tile") as HTMLElement).style.background).toBe("rgb(51, 102, 153)");
    act(() => root.render(createElement(Tile, { tile, eager: true, reduced: false })));
    expect((container.querySelector(".wall-tile") as HTMLElement).style.background).toBe("");
  });

  it("the opacity gate only applies once the client has hydrated the wall", () => {
    expect(CSS).not.toMatch(/\.wall-tile img \{[^}]*opacity: 0/);
    expect(CSS).toContain('.work-wall[data-fade] .wall-tile[data-loaded="false"] img { opacity: 0; }');
  });

  function projects(count: number) {
    return Array.from({ length: count }, (_, i) => ({
      id: String(i),
      slug: `p${i}`,
      title: `P${i}`,
      client: "",
      industry: "Hospitality",
      region: "America",
      services: ["Branding"],
      tags: [],
      year: 2025,
      coverImage: IMAGE(`p${i}`),
      images: [IMAGE(`p${i}a`), IMAGE(`p${i}b`)],
      videos: [],
      featured: false,
      homeOrder: null,
    }));
  }

  function wall(data: unknown[], server = false) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
    client.setQueryData(["/api/projects"], data);
    const routerProps = server ? { ssrPath: "/", ssrSearch: "" } : { hook: memoryLocation({ path: "/" }).hook };
    return createElement(QueryClientProvider, { client }, createElement(Router, routerProps, createElement(WorkWall)));
  }

  it("server HTML has no fade gate; only the first viewport loads eagerly and one tile asks for high priority", () => {
    stubMedia();
    const html = renderToString(wall(projects(30), true));
    expect(html).not.toContain("data-fade");
    // jsdom is 1024 x 768: four columns, about five 3:2 tiles each start in view, capped at eight on a desktop.
    // The server (and the first client render, for hydration) lays out the phone wall: 2 columns, 4 eager.
    expect(html.match(/loading="eager"/g)).toHaveLength(EAGER_MAX_PHONE);
    expect(html.match(/fetchpriority="high"/g)).toHaveLength(1);
    expect(html.match(/loading="lazy"/g)!.length).toBe(72 - EAGER_MAX_PHONE);
  });

  it("the first viewport is measured from the columns: a phone takes four at most, a short desktop fewer than the cap", () => {
    const tiles = Array.from({ length: 40 }, (_, i) => ({ key: `t${i}`, ratio: 1.5 }));
    const columns = (n: number) => Array.from({ length: n }, (_, c) => tiles.filter((_, i) => i % n === c));
    expect(firstViewportKeys(columns(2), tiles, 2, { width: 375, height: 812 }).size).toBe(EAGER_MAX_PHONE);
    // A 1440 x 200 strip: six columns, only the first row starts inside it.
    expect([...firstViewportKeys(columns(6), tiles, 6, { width: 1440, height: 200 })]).toEqual(["t0", "t1", "t2", "t3", "t4", "t5"]);
  });

  it("a typed search that matches nothing says so, with the way in, and shows no unrelated work", () => {
    stubMedia();
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
    client.setQueryData(["/api/projects"], projects(6));
    window.history.replaceState(null, "", "/?q=quokka");
    try {
      act(() => root.render(createElement(QueryClientProvider, { client }, createElement(WorkWall))));
    expect(container.querySelector(".work-wall__empty")?.textContent).toContain(siteCopy.home.results.empty);
    expect(container.querySelector(".work-wall__empty a")?.getAttribute("href")).toBe("/brief");
    expect(container.querySelector(".work-wall__note")).toBeNull();
    expect(container.querySelectorAll(".wall-tile")).toHaveLength(0);
    } finally {
      window.history.replaceState(null, "", "/");
    }
  });

  it("auto-loads three passes, then stops and offers a quiet More link (JP, 2026-11-06: the wall stops, the footer comes out)", () => {
    stubMedia();
    act(() => root.render(wall(projects(30))));
    expect(container.querySelector(".work-wall")?.hasAttribute("data-fade")).toBe(true);
    const sentinelHit = () =>
      act(() => {
        for (const item of [...observed]) {
          if (item.target?.getAttribute("aria-hidden") === "true" && !item.target.className) {
            item.callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
          }
        }
      });
    const count = () => container.querySelectorAll(".wall-tile").length;
    expect(count()).toBe(72);
    expect(container.querySelector(".work-wall__more")).toBeNull();
    sentinelHit();
    sentinelHit();
    expect(count()).toBe(AUTO_PASSES * 72);
    // Third pass shown: the sentinel is no longer watched, so the footer can be reached.
    sentinelHit();
    expect(count()).toBe(216);
    const more = container.querySelector<HTMLButtonElement>(".work-wall__more button")!;
    expect(more.textContent).toBe(siteCopy.home.results.more);
    act(() => more.click());
    expect(count()).toBe(288);
  });
});

describe("Journal covers", () => {
  it("drops a cover several articles share and keeps the ones that are their own", () => {
    const shared = "https://cdn.sanity.io/images/p/production/stock-1080x1440.png";
    const covers = ownCovers([
      { slug: "a", coverImage: shared },
      { slug: "b", coverImage: `${shared}?w=600` },
      { slug: "c", coverImage: IMAGE("own") },
      { slug: "d", coverImage: "" },
    ]);
    expect(covers.has("a")).toBe(false);
    expect(covers.has("b")).toBe(false);
    expect(covers.get("c")).toBe(IMAGE("own"));
    expect(covers.has("d")).toBe(false);
  });
});

describe("Ventures", () => {
  it("shows the project's cover for a venture with a project page, and none for WeLoveDaily", () => {
    stubMedia();
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
    client.setQueryData(
      ["/api/projects"],
      siteCopy.ventures.items
        .filter((item) => item.href.startsWith("/projects/"))
        .map((item, i) => ({ slug: item.href.split("/")[2], title: item.name, coverImage: IMAGE(`v${i}`), images: [] })),
    );
    const location = memoryLocation({ path: "/ventures" });
    act(() =>
      root.render(createElement(QueryClientProvider, { client }, createElement(Router, { hook: location.hook }, createElement(Ventures)))),
    );
    const rows = Array.from(container.querySelectorAll<HTMLLIElement>(".ventures-list__row"));
    expect(rows).toHaveLength(siteCopy.ventures.items.length);
    for (const [i, item] of siteCopy.ventures.items.entries()) {
      const img = rows[i].querySelector("img");
      if (item.href.startsWith("/projects/")) {
        expect(img, item.name).not.toBeNull();
        expect(rows[i].querySelector("a")?.getAttribute("href")).toBe(item.href);
      } else expect(img, item.name).toBeNull();
    }
  });
});

describe("Services side photo", () => {
  it("follows the row in view down to the last row, which the old observer band never reached", () => {
    stubMedia();
    // The moment with the most rows (four), so the middle and the last row are different rows.
    window.history.replaceState(null, "", "/services?moment=grow");
    const disciplines = siteCopy.services.disciplines.filter((d) => (d.moments as readonly string[]).includes("grow"));
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
    client.setQueryData(
      ["/api/projects"],
      disciplines.map((d, i) => ({ slug: d.project, title: `Example ${i}`, coverImage: IMAGE(`s${i}`), images: [] })),
    );
    const raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation((fn) => {
      fn(0);
      return 0; // ran synchronously, so no frame stays pending
    });
    const location = memoryLocation({ path: "/services" });
    act(() =>
      root.render(createElement(QueryClientProvider, { client }, createElement(Router, { hook: location.hook }, createElement(Services)))),
    );
    const rows = Array.from(container.querySelectorAll<HTMLElement>("[data-discipline]"));
    expect(rows.map((row) => row.dataset.discipline)).toEqual(disciplines.map((d) => d.id));
    expect(rows).toHaveLength(disciplines.length);
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 900 });
    Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 5000 });
    // Rows are 300px tall, the first starting at 200px; scrolling moves them all up.
    const placeRows = (scrollY: number) => {
      Object.defineProperty(window, "scrollY", { configurable: true, value: scrollY });
      rows.forEach((row, i) => {
        row.getBoundingClientRect = () => ({ top: 200 + i * 300 - scrollY }) as DOMRect;
      });
      act(() => window.dispatchEvent(new Event("scroll")));
    };
    const activeId = () => container.querySelector<HTMLElement>('.discipline[data-active="true"]')?.dataset.discipline;
    placeRows(0);
    expect(activeId()).toBe(disciplines[0].id);
    placeRows(300 * 2);
    expect(activeId()).toBe(disciplines[2].id);
    // Mid-page the last row is below the 40% line, so the row above it wins.
    const last = rows.length - 1;
    const y = 200 + last * 300 - 500; // last row's top sits at 500px, under the 360px line
    placeRows(y);
    expect(activeId()).toBe(disciplines[last - 1].id);
    // At the bottom of the page it can scroll no further: the last row becomes active.
    Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: y + 900 });
    placeRows(y);
    expect(activeId()).toBe(disciplines[last].id);
    raf.mockRestore();
    window.history.replaceState(null, "", "/");
  });
});

describe("Site-wide rules in the stylesheet and the document head", () => {
  it("focus rings are ink, never the accent", () => {
    for (const match of CSS.matchAll(/:focus-visible[^{]*\{[^}]*\}/g)) {
      expect(match[0]).not.toContain("--site-accent");
    }
    expect(CSS).toMatch(/\.site-root a:focus-visible,[\s\S]*?outline: 2px solid var\(--site-ink\);\s*outline-offset: 3px;/);
  });

  it("has no mono uppercase eyebrows and no pill class", () => {
    expect(CSS).not.toContain("Roboto Mono");
    // One exception: the footer's base line is JP's own Figma (BACK TO TOP, the rights), 2026-11-06.
    const uppercase = CSS.match(/text-transform:\s*uppercase/g) ?? [];
    expect(uppercase).toHaveLength(1);
    expect(CSS).toMatch(/\.site-footer__base \{[^}]*text-transform: uppercase/);
    expect(CSS).not.toContain(".site-pill");
    expect(CSS).not.toContain(".home-section-label");
  });

  it("loads self-hosted fonts without blocking the first paint (fix pass A)", () => {
    // No Google Fonts hop: the faces are @font-face in site.css with swap; the display subset and the body Latin file are preloaded.
    expect(INDEX_HTML).not.toContain("fonts.googleapis.com");
    expect(INDEX_HTML).not.toContain("font-loader.js");
    expect(INDEX_HTML).toContain('<link rel="preload" as="font" type="font/woff2" href="/fonts/ABCSyntVariable-subset.woff2" crossorigin>');
    expect(INDEX_HTML).toContain('<link rel="preload" as="font" type="font/woff2" href="/fonts/LibreFranklin-latin.woff2" crossorigin>');
    expect(INDEX_HTML.match(/rel="preload" as="font"/g)).toHaveLength(2);
    expect(INDEX_HTML).toContain('<link rel="preconnect" href="https://cdn.sanity.io">');
    for (const face of ["ABCSyntVariable-subset.woff2", "LibreFranklin-latin.woff2", "LibreFranklin-Italic-latin.woff2"]) {
      expect(CSS).toMatch(new RegExp(`@font-face \\{[^}]*/fonts/${face.replace(".", "\\.")}[^}]*font-display: swap`));
    }
    expect(INDEX_HTML).not.toContain("Roboto+Mono");
  });
});
