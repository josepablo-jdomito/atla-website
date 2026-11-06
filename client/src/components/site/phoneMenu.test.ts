// @vitest-environment jsdom
// The phone menu (JP's reference, 2026-11-06): a paper card from the top, one row per page with a
// picture, the email and the motion control at the base. These pin the structure and the keyboard.
import { readFileSync } from "node:fs";
import path from "node:path";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { siteCopy } from "@/content/siteCopy";
import { MENU_CLOSE_MS, SiteHeader, isCurrentRoute } from "./SiteHeader";
import { ABOUT_HERO, menuThumbs } from "./menuThumbs";
import { toSiteProject, type SiteProject } from "./siteProjects";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const CSS = readFileSync(path.resolve(import.meta.dirname, "../../styles/site.css"), "utf8");

const img = (name: string) => `https://cdn.sanity.io/images/p/d/${name}-1200x800.jpg`;
const RAW = [
  { slug: "acre", title: "Acre", client: "Acre", featured: true, homeOrder: 1, year: 2024, coverImage: img("a1"), images: [img("a2")] },
  { slug: "temakase", title: "Temakase", client: "Temakase", featured: true, homeOrder: 2, year: 2023, coverImage: img("t1"), images: [img("t2"), img("t3")] },
  { slug: "casa-colora", title: "Casa Colora", client: "Casa Colora", featured: true, homeOrder: 3, year: 2024, coverImage: img("c1"), images: [img("c2")] },
  { slug: "sexto-abismo", title: "Sexto Abismo", client: "Sexto Abismo", featured: false, year: 2022, coverImage: img("s1"), images: [] },
  { slug: "persona", title: "Persona", client: "Persona", featured: false, year: 2022, coverImage: img("p1"), images: [] },
  { slug: "brick", title: "Brick", client: "Brick", featured: true, homeOrder: 4, year: 2021, coverImage: img("b1"), images: [img("b2")] },
  { slug: "atla", title: "Atla", client: "Atla", featured: true, homeOrder: 0, year: 2025, coverImage: img("x1"), images: [] },
];
const PROJECTS = RAW.map((raw) => toSiteProject(raw as never)).filter((p): p is SiteProject => p !== null);
const PICKS = { services: "casa-colora", ventures: ["sexto-abismo", "tigretigre"] };

let container: HTMLDivElement;
let root: Root;
let reduced = false;

beforeEach(() => {
  reduced = false;
  window.matchMedia = ((query: string) => ({
    get matches() {
      return query.includes("reduced-motion") ? reduced : false;
    },
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});

function renderHeader(path = "/services") {
  const client = new QueryClient({ defaultOptions: { queries: { queryFn: async () => RAW, retry: false } } });
  client.setQueryData(["/api/projects"], RAW);
  const location = memoryLocation({ path, record: true });
  act(() =>
    root.render(
      createElement(QueryClientProvider, { client }, createElement(Router, { hook: location.hook }, createElement(SiteHeader))),
    ),
  );
  const button = container.querySelector<HTMLButtonElement>(".site-header__menu")!;
  const sheet = container.querySelector<HTMLElement>("#site-menu-sheet")!;
  return { button, sheet, location };
}

const escape = () =>
  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  });

describe("phone menu card", () => {
  it("is a modal dialog with six rows, Start a project last, each with a picture and an empty alt", () => {
    const { button, sheet } = renderHeader();
    act(() => button.click());
    expect(sheet.getAttribute("role")).toBe("dialog");
    expect(sheet.getAttribute("aria-modal")).toBe("true");
    const rows = Array.from(sheet.querySelectorAll(".site-sheet__link"));
    expect(rows.map((row) => row.textContent)).toEqual(["Work", "Services", "Why Atla", "Ventures", "Contact", "Start a project"]);
    const pictures = rows.map((row) => row.querySelector("img"));
    expect(pictures.every((picture) => picture?.getAttribute("alt") === "")).toBe(true);
    const sources = pictures.map((picture) => picture!.getAttribute("src"));
    expect(new Set(sources).size).toBe(sources.length);
    expect(sheet.querySelector(".site-sheet__close")?.getAttribute("aria-label")).toBe(siteCopy.menu.closeLabel);
  });

  it("marks the current route's row", () => {
    const { button, sheet } = renderHeader("/services");
    act(() => button.click());
    const current = sheet.querySelectorAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0].textContent).toBe("Services");
    expect(CSS).toMatch(/\.site-sheet__link\[aria-current="page"\] \{[^}]*#eaeaea/);
    expect(isCurrentRoute("/", "/projects/acre")).toBe(true);
    expect(isCurrentRoute("/", "/services")).toBe(false);
  });

  it("has no bar under the rows: no email, no motion control (JP, 2026-11-06)", () => {
    const { button, sheet } = renderHeader();
    act(() => button.click());
    expect(sheet.querySelector(".site-sheet__bar")).toBeNull();
    expect(sheet.querySelector(".motion-toggle")).toBeNull();
  });

  it("renders no motion control while closed, so a page keeps one", () => {
    const { sheet } = renderHeader();
    expect(sheet.hidden).toBe(true);
    expect(sheet.querySelector(".motion-toggle")).toBeNull();
  });

  it("closes and navigates when a row is tapped", () => {
    const { button, sheet, location } = renderHeader();
    act(() => button.click());
    const row = sheet.querySelector<HTMLAnchorElement>('.site-sheet__link[href="/ventures"]')!;
    act(() => row.click());
    expect(sheet.hidden).toBe(true);
    expect(location.history[location.history.length - 1]).toBe("/ventures");
  });

  it("moves focus to the first row, traps Tab, and Escape reverses out then returns focus to Menu", () => {
    vi.useFakeTimers();
    const { button, sheet } = renderHeader();
    act(() => button.click());
    expect(document.activeElement).toBe(sheet.querySelector(".site-sheet__link"));

    const stops = Array.from(sheet.querySelectorAll<HTMLElement>("a[href], button"));
    act(() => stops[stops.length - 1].focus());
    const tab = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    act(() => {
      window.dispatchEvent(tab);
    });
    expect(document.activeElement).toBe(stops[0]);
    const back = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true });
    act(() => {
      window.dispatchEvent(back);
    });
    expect(document.activeElement).toBe(stops[stops.length - 1]);

    escape();
    expect(sheet.getAttribute("data-state")).toBe("closing");
    expect(sheet.hidden).toBe(false);
    act(() => vi.advanceTimersByTime(MENU_CLOSE_MS));
    expect(sheet.hidden).toBe(true);
    expect(document.activeElement).toBe(button);
    expect(document.body.style.overflow).toBe("");
  });

  it("the X and a tap on the dimmed page both close it", () => {
    vi.useFakeTimers();
    const { button, sheet } = renderHeader();
    act(() => button.click());
    act(() => sheet.querySelector<HTMLButtonElement>(".site-sheet__close")!.click());
    act(() => vi.advanceTimersByTime(MENU_CLOSE_MS));
    expect(sheet.hidden).toBe(true);
    act(() => button.click());
    act(() => sheet.querySelector<HTMLElement>(".site-sheet__backdrop")!.click());
    act(() => vi.advanceTimersByTime(MENU_CLOSE_MS));
    expect(sheet.hidden).toBe(true);
  });

  it("closes at once under reduced motion", () => {
    reduced = true;
    const { button, sheet } = renderHeader();
    act(() => button.click());
    escape();
    expect(sheet.hidden).toBe(true);
    expect(document.activeElement).toBe(button);
  });

  it("keeps the motion budget and switches it off under reduced motion", () => {
    expect(CSS).toContain("animation: site-menu-in 180ms cubic-bezier(0.4, 0, 0.2, 1) both"); // lg2: the button becomes the card
    expect(CSS).toContain('.site-sheet[data-state="closing"] .site-sheet__card { animation: site-menu-out 150ms cubic-bezier(0.4, 0, 0.2, 1) both; }');
    expect(CSS).toContain("animation-delay: calc(var(--i, 0) * 25ms)");
    expect(CSS).toMatch(/from \{ clip-path: inset\(16px 16px calc\(100% - 60px\) calc\(100% - 60px\) round 8px\); \}/);
    expect(CSS).toMatch(/backdrop-filter: blur\(8px\)/);
    expect(CSS).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\n  \.site-sheet__card,\n  \.site-sheet__backdrop,/);
  });
});

describe("menuThumbs", () => {
  it("uses the Strategy example, the venture, the about hero, and never one image twice", () => {
    const thumbs = menuThumbs(PROJECTS, 0, PICKS);
    expect(thumbs["/services"]).toBe(img("c1"));
    expect(thumbs["/ventures"]).toBe(img("s1"));
    expect(thumbs["/about"]).toBe(ABOUT_HERO);
    const all = Object.values(thumbs);
    expect(all.every(Boolean)).toBe(true);
    expect(new Set(all).size).toBe(all.length);
    expect(all).not.toContain(img("x1"));
  });

  it("deals Work from featured client work, differently per seed, still without repeats", () => {
    const featured = new Set([img("a1"), img("a2"), img("t1"), img("t2"), img("t3"), img("c2"), img("b1"), img("b2")]);
    const seen = new Set<string>();
    for (let seed = 1; seed < 40; seed += 1) {
      const thumbs = menuThumbs(PROJECTS, seed, PICKS);
      expect(featured.has(thumbs["/"]!)).toBe(true);
      const all = Object.values(thumbs);
      expect(new Set(all).size).toBe(all.length);
      seen.add(thumbs["/"]!);
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it("falls back to an unused cover when a pick has no project", () => {
    const thumbs = menuThumbs(PROJECTS, 0, { services: "missing", ventures: ["missing"] });
    expect(thumbs["/services"]).toBeTruthy();
    expect(thumbs["/ventures"]).toBeTruthy();
    expect(thumbs["/services"]).not.toBe(thumbs["/ventures"]);
  });
});
