// @vitest-environment jsdom
// Fix pass B, 2026-11-06: states, the cookie notice, the Ask timeout, the skip to search, the wall's end.
import { readFileSync } from "node:fs";
import path from "node:path";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { siteCopy } from "@/content/siteCopy";
import { ASK_TIMEOUT_MS, readTurns, useAsk } from "@/lib/askClient";
import { AnalyticsConsent, OPEN_CONSENT_EVENT } from "@/components/atla/AnalyticsConsent";
import { AskPanel } from "./AskPanel";
import { SiteHeader, EXPLORE_FIELD_ID } from "./SiteHeader";
import { WorkWall } from "./WorkWall";

vi.mock("@/lib/askEvents", () => ({ trackAskTurn: vi.fn() }));
vi.mock("@/lib/ga", () => ({
  trackBarSearch: vi.fn(),
  ga4Event: vi.fn(),
  readStoredConsent: vi.fn(() => null),
  likelyNeedsConsentPrompt: vi.fn(() => false),
  setAnalyticsConsent: vi.fn(),
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const CSS = readFileSync(path.resolve(import.meta.dirname, "../../styles/site.css"), "utf8");

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
  sessionStorage.clear();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("cookie notice", () => {
  it("moves focus in, hides the pill while open, and Escape closes it without choosing, focus back on the opener", async () => {
    const ga = await import("@/lib/ga");
    const opener = document.createElement("button");
    document.body.appendChild(opener);
    opener.focus();
    act(() => root.render(createElement(AnalyticsConsent)));
    act(() => {
      window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT));
    });
    expect(document.activeElement?.textContent).toBe(siteCopy.consent.accept);
    expect(document.documentElement.getAttribute("data-consent")).toBe("open");
    // No inline colours: the notice is on the site's tokens.
    expect(container.querySelector(".consent")?.getAttribute("style")).toBeNull();
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(container.querySelector(".consent")).toBeNull();
    expect(ga.setAnalyticsConsent).not.toHaveBeenCalled();
    expect(document.documentElement.hasAttribute("data-consent")).toBe(false);
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });

  it("is styled on tokens and the pill steps aside for it", () => {
    expect(CSS).toMatch(/\.consent \{[^}]*background: var\(--site-surface\)/);
    expect(CSS).toMatch(/html\[data-consent="open"\] \.site-explore/);
  });
});

describe("Ask", () => {
  it("a request with no word back for 25 s ends in the error note, and Try again sends the question again", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
    let api: ReturnType<typeof useAsk> | null = null;
    function Probe() {
      api = useAsk();
      return null;
    }
    act(() => root.render(createElement(Probe)));
    let sent: Promise<void> | undefined;
    act(() => {
      sent = api!.send("Who have you worked with?");
    });
    expect(api!.pending).toBe(true);
    await act(async () => {
      vi.advanceTimersByTime(ASK_TIMEOUT_MS + 10);
      await sent;
    });
    expect(api!.pending).toBe(false);
    expect(readTurns().at(-1)).toEqual({ role: "note", text: siteCopy.ask.error, kind: "error" });
    act(() => {
      api!.retry();
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    // The failed note and its question left the log; the question is asked again.
    expect(api!.turns).toEqual([{ role: "visitor", text: "Who have you worked with?" }]);
    act(() => api!.restart());
  });

  it("a note reads as a note, with the way on under it; Start over shows while a turn is pending", () => {
    const props = {
      projects: [],
      onAsk: vi.fn(),
      onRetry: vi.fn(),
      onRestart: vi.fn(),
      partial: "",
    };
    const wrap = (el: ReturnType<typeof createElement>) =>
      createElement(Router, { hook: memoryLocation({ path: "/" }).hook }, el);
    act(() =>
      root.render(
        wrap(
          createElement(AskPanel, {
            ...props,
            pending: false,
            turns: [
              { role: "visitor", text: "hi" },
              { role: "note", text: siteCopy.ask.limited, kind: "limited" },
            ],
          }),
        ),
      ),
    );
    const note = container.querySelector('.ask__turn[data-role="note"]')!;
    expect(note.querySelector(".ask__sr")?.textContent).toContain(siteCopy.home.askNote);
    expect([...note.querySelectorAll("a")].map((a) => a.getAttribute("href"))).toEqual(["/services", "/brief"]);
    expect(note.querySelector(".ask__retry")).toBeNull();
    act(() =>
      root.render(
        wrap(
          createElement(AskPanel, {
            ...props,
            pending: false,
            turns: [
              { role: "visitor", text: "hi" },
              { role: "note", text: siteCopy.ask.error, kind: "error" },
            ],
          }),
        ),
      ),
    );
    act(() => container.querySelector<HTMLButtonElement>(".ask__retry")!.click());
    expect(props.onRetry).toHaveBeenCalledTimes(1);
    act(() => root.render(wrap(createElement(AskPanel, { ...props, pending: true, turns: [{ role: "visitor", text: "hi" }] }))));
    expect(container.querySelector(".ask__restart")?.textContent).toBe(siteCopy.ask.restart);
  });
});

describe("the wall's states", () => {
  it("a failed project list shows one line and Try again, never a blank page", async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, queryFn: () => Promise.reject(new Error("500")) } },
    });
    await act(async () => {
      root.render(
        createElement(
          QueryClientProvider,
          { client },
          createElement(Router, { hook: memoryLocation({ path: "/" }).hook }, createElement(WorkWall)),
        ),
      );
    });
    for (let i = 0; i < 10 && !container.querySelector(".work-wall__error"); i += 1) {
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });
    }
    const error = container.querySelector(".work-wall__error");
    expect(error?.textContent).toContain(siteCopy.home.results.error);
    expect(error?.querySelector("button")?.textContent).toBe(siteCopy.home.results.retry);
  });

  it("shows a placeholder grid with no images while the list loads", () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, queryFn: () => new Promise(() => {}) } } });
    act(() =>
      root.render(
        createElement(
          QueryClientProvider,
          { client },
          createElement(Router, { hook: memoryLocation({ path: "/" }).hook }, createElement(WorkWall)),
        ),
      ),
    );
    expect(container.querySelectorAll(".wall-tile--placeholder").length).toBeGreaterThan(0);
    expect(container.querySelector(".work-wall img")).toBeNull();
    expect(container.querySelector(".work-wall")?.getAttribute("aria-busy")).toBe("true");
  });
});

describe("skip to search", () => {
  function header(path: string) {
    const client = new QueryClient();
    return createElement(
      QueryClientProvider,
      { client },
      createElement(Router, { hook: memoryLocation({ path }).hook }, createElement(SiteHeader)),
    );
  }

  it("is the second stop on the home and focuses the Explore field", () => {
    act(() => root.render(header("/")));
    const links = [...container.querySelectorAll<HTMLAnchorElement>(".site-skip-link")];
    expect(links.map((a) => a.textContent)).toEqual([siteCopy.header.skipLink, siteCopy.header.skipSearch]);
    const field = document.createElement("input");
    field.id = EXPLORE_FIELD_ID;
    document.body.appendChild(field);
    act(() => links[1].click());
    expect(document.activeElement).toBe(field);
    field.remove();
  });

  it("is absent where there is no Explore pill", () => {
    act(() => root.render(header("/services")));
    expect(container.querySelectorAll(".site-skip-link")).toHaveLength(1);
  });
});

describe("pressed feedback and targets", () => {
  it("has one pressed block, input rings and the scroll padding under the sticky header", () => {
    expect(CSS).toContain("/* ---- Pressed feedback ---- */");
    expect(CSS).toMatch(/\.site-root a:active,[\s\S]*?opacity: 0\.7;/);
    expect(CSS).toMatch(/\.site-root \.wall-tile:active[\s\S]*?transform: scale\(0\.98\)/);
    expect(CSS).toContain("html { scroll-padding-top: 80px; }");
    expect(CSS).toMatch(/\.site-footer__link \{[^}]*min-height: 44px/);
    expect(CSS).toMatch(/\.site-header__cta \{[^}]*min-height: 44px/);
  });
});
