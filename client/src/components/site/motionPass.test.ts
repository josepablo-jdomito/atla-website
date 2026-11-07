// @vitest-environment jsdom
// Motion pass, 2026-11-05 (docs/superpowers/specs/2026-11-05-motion-pass.md): the behaviours that changed.
import { readFileSync } from "node:fs";
import path from "node:path";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { siteCopy } from "@/content/siteCopy";
import { PageShell } from "./PageShell";
import { WorkExplore } from "./WorkExplore";
import { Tile } from "./WorkWall";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const CSS = readFileSync(path.resolve(import.meta.dirname, "../../styles/site.css"), "utf8");

function stubMotion(reduce: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes("reduce") ? reduce : false,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
}

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.useFakeTimers();
  stubMotion(false);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});

function renderExplore() {
  act(() =>
    root.render(
      createElement(
        WorkExplore,
        { query: "", onQuery: () => undefined, onClear: () => undefined, activeCount: 0, visible: true },
        createElement("p", null, "filters"),
      ),
    ),
  );
  return {
    input: () => document.querySelector<HTMLInputElement>(".site-explore__input")!,
    panel: () => document.querySelector<HTMLElement>(".site-explore__panel"),
  };
}

describe("Explore panel open and close", () => {
  it("opens on focus; Escape closes at once (keyboard never animates)", () => {
    const { input, panel } = renderExplore();
    expect(panel()).toBeNull();
    act(() => input().focus());
    expect(panel()?.dataset.state).toBe("open");
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(panel()).toBeNull();
  });

  it("the Close button runs the exit, then unmounts; a refocus during the exit retargets to open", () => {
    const { input, panel } = renderExplore();
    act(() => input().focus());
    const close = Array.from(document.querySelectorAll<HTMLButtonElement>(".site-explore__head button")).find(
      (button) => button.textContent === siteCopy.home.close,
    )!;
    act(() => close.click());
    expect(panel()?.dataset.state).toBe("closing");
    expect(panel()?.getAttribute("aria-hidden")).toBe("true");
    // jsdom keeps focus on the input through the click, so the re-open comes from the click handler.
    act(() => input().click());
    expect(panel()?.dataset.state).toBe("open");
    act(() => close.click());
    act(() => {
      panel()!.dispatchEvent(new Event("transitionend", { bubbles: true }));
    });
    // A non-opacity transitionend (the transform) does not end it; the timer does.
    expect(panel()?.dataset.state).toBe("closing");
    act(() => vi.advanceTimersByTime(250));
    expect(panel()).toBeNull();
  });

  it("under reduced motion a pointer close unmounts at once", () => {
    stubMotion(true);
    const { input, panel } = renderExplore();
    act(() => input().focus());
    const close = Array.from(document.querySelectorAll<HTMLButtonElement>(".site-explore__head button")).find(
      (button) => button.textContent === siteCopy.home.close,
    )!;
    act(() => close.click());
    expect(panel()).toBeNull();
  });
});

describe("wall tile", () => {
  const tile = {
    slug: "x",
    title: "X",
    src: "https://cdn.sanity.io/images/p/production/abc-1400x868.jpg",
    kind: "image" as const,
    ratio: 1.5,
  };

  it("mounts as loaded when the browser already has the image (no re-fade after a search)", () => {
    Object.defineProperty(HTMLImageElement.prototype, "complete", { configurable: true, get: () => true });
    Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", { configurable: true, get: () => 1400 });
    act(() => root.render(createElement(Tile, { tile, eager: true, reduced: false })));
    expect(container.querySelector(".wall-tile")?.getAttribute("data-loaded")).toBe("true");
    delete (HTMLImageElement.prototype as { complete?: unknown }).complete;
    delete (HTMLImageElement.prototype as { naturalWidth?: unknown }).naturalWidth;
  });

  it("waits for load otherwise", () => {
    act(() => root.render(createElement(Tile, { tile, eager: true, reduced: false })));
    expect(container.querySelector(".wall-tile")?.getAttribute("data-loaded")).toBe("false");
  });
});

describe("page shell route fade", () => {
  it("marks the landing paint so it never fades; later shells fade in", () => {
    const client = new QueryClient();
    const shell = () =>
      createElement(QueryClientProvider, { client }, createElement(PageShell, null, createElement("p", null, "body")));
    act(() => root.render(shell()));
    expect(container.querySelector(".site-page")?.hasAttribute("data-first-paint")).toBe(true);
    act(() => root.unmount());
    root = createRoot(container);
    act(() => root.render(shell()));
    expect(container.querySelector(".site-page")?.hasAttribute("data-first-paint")).toBe(false);
    expect(container.querySelector(".site-page [data-framer], .site-page[style]")).toBeNull();
  });
});

describe("site.css motion rules", () => {
  it("keeps the budgets from the motion pass", () => {
    expect(CSS).toMatch(/\.wall-tile img \{[^}]*transition: opacity 320ms var\(--site-ease\);/);
    // Nothing happens on hover (UX interview 4, 2026-11-05).
    expect(CSS).not.toContain(".wall-tile:hover");
    expect(CSS).toContain('.site-explore__panel[data-state="closing"]');
    expect(CSS).toContain("animation: site-page-in 200ms var(--site-ease) both");
    expect(CSS).not.toContain("@keyframes site-explore-in");
  });

  it("switches every new transition and animation off under reduced motion", () => {
    const block = CSS.slice(CSS.indexOf("@media (prefers-reduced-motion: reduce) {\n  .project-card__media"));
    const reduced = block.slice(0, block.indexOf("\n}\n") + 3);
    expect(reduced).toContain(".site-explore__panel { transition: none; }");
    expect(reduced).toContain(".site-page { animation: none; }");
    expect(reduced).toContain(".site-sheet { transition: none; }");
  });
});
