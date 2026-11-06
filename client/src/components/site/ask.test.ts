// @vitest-environment jsdom
// Ask, the concierge mode of the Explore pill (2026-11-06): the mode switch, the suggestions, pieces
// from slugs, Escape and focus, and a conversation that lives in sessionStorage only.
import { readFileSync } from "node:fs";
import path from "node:path";
import { act, createElement, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { siteCopy } from "@/content/siteCopy";
import { ASK_STORAGE_KEY, looksLikeQuestion, parseAskEvents, readTurns, streamAsk, turnsForServer, useAsk, type AskTurn } from "@/lib/askClient";
import { AskPanel, type AskPieceProject } from "./AskPanel";
import { WorkExplore, type ExploreAsk } from "./WorkExplore";

vi.mock("@/lib/askEvents", () => ({ trackAskTurn: vi.fn() }));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const CSS = readFileSync(path.resolve(import.meta.dirname, "../../styles/site.css"), "utf8");
const { ask: copy } = siteCopy;

const PROJECTS: AskPieceProject[] = [
  { slug: "rustico", title: "Rústico", coverImage: "https://cdn.sanity.io/images/p/d/rustico-cover-1200x1500.jpg" },
  { slug: "casa-colora", title: "Casa Colora", coverImage: "https://cdn.sanity.io/images/p/d/colora-1600x1200.jpg" },
];

function stubMedia(phone = false) {
  window.matchMedia = ((query: string) => ({
    matches: phone && query.includes("max-width: 767px"),
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  })) as unknown as typeof window.matchMedia;
}


/** A plain in-memory Storage: Node's own experimental localStorage global shadows jsdom's here. */
function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, String(value)),
  };
}
let localStorage: Storage;
let sessionStorage: Storage;
function installStorage() {
  localStorage = memoryStorage();
  sessionStorage = memoryStorage();
  Object.defineProperty(window, "localStorage", { value: localStorage, configurable: true });
  Object.defineProperty(window, "sessionStorage", { value: sessionStorage, configurable: true });
  Object.defineProperty(globalThis, "localStorage", { value: localStorage, configurable: true });
  Object.defineProperty(globalThis, "sessionStorage", { value: sessionStorage, configurable: true });
}

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  stubMedia();
  installStorage();
  Element.prototype.scrollIntoView = vi.fn();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

/** The pill with Ask on, wired like WorkWall: a fake `onAsk` and a real AskPanel. */
function renderExplore({ turns = [] as AskTurn[], available = true } = {}) {
  const onAsk = vi.fn();
  const onQuery = vi.fn();
  function Harness() {
    const [query, setQuery] = useState("");
    const ask: ExploreAsk = {
      available,
      pending: false,
      onAsk,
      panel: (send) => createElement(AskPanel, { turns, pending: false, partial: "", projects: PROJECTS, onAsk: send, onRestart: () => undefined }),
    };
    return createElement(
      WorkExplore,
      {
        query,
        onQuery: (value: string) => {
          onQuery(value);
          setQuery(value);
        },
        onClear: () => undefined,
        activeCount: 0,
        visible: true,
        ask,
      },
      createElement("p", { className: "filters" }, "filters"),
    );
  }
  const { hook } = memoryLocation({ path: "/" });
  act(() => root.render(createElement(Router, { hook }, createElement(Harness))));
  const input = () => document.querySelector<HTMLInputElement>(".site-explore__input")!;
  const modeButton = (label: string) =>
    Array.from(document.querySelectorAll<HTMLButtonElement>(".site-explore__modes button")).find((b) => b.textContent === label)!;
  return { input, modeButton, onAsk, onQuery };
}

function type(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  act(() => {
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

describe("Explore pill: Search and Ask", () => {
  it("shows a quiet Search · Ask switch, Search first, and the filters under Search", () => {
    const { input, modeButton } = renderExplore();
    act(() => input().focus());
    expect(modeButton("Search").getAttribute("aria-pressed")).toBe("true");
    expect(modeButton("Ask").getAttribute("aria-pressed")).toBe("false");
    expect(document.querySelector(".filters")).not.toBeNull();
    expect(document.querySelector(".site-explore__modes")!.getAttribute("role")).toBe("group");
  });

  it("has no switch when Ask is not available, and a question stays a search", () => {
    const { input, onQuery } = renderExplore({ available: false });
    act(() => input().focus());
    expect(document.querySelector(".site-explore__modes")).toBeNull();
    type(input(), "who have you worked with?");
    expect(onQuery).toHaveBeenLastCalledWith("who have you worked with?");
    expect(document.querySelector(".ask")).toBeNull();
  });

  it("a typed question moves to Ask on its own; a plain search does not", () => {
    const { input, modeButton, onQuery } = renderExplore();
    act(() => input().focus());
    type(input(), "coffee shop");
    expect(onQuery).toHaveBeenLastCalledWith("coffee shop");
    type(input(), "do you do packaging for a coffee brand");
    expect(modeButton("Ask").getAttribute("aria-pressed")).toBe("true");
    expect(onQuery).toHaveBeenLastCalledWith("");
    expect(input().value).toBe("do you do packaging for a coffee brand");
    expect(input().getAttribute("aria-label")).toBe(copy.inputLabel);
    expect(document.querySelector(".ask__greeting")!.textContent).toBe(copy.greeting);
  });

  it("a mode picked by hand wins over the guess", () => {
    const { input, modeButton, onQuery } = renderExplore();
    act(() => input().focus());
    act(() => modeButton("Search").click());
    type(input(), "what is brand architecture?");
    expect(modeButton("Search").getAttribute("aria-pressed")).toBe("true");
    expect(onQuery).toHaveBeenLastCalledWith("what is brand architecture?");
    act(() => modeButton("Ask").click());
    expect(input().value).toBe("what is brand architecture?");
    expect(document.activeElement).toBe(input());
  });

  it("Enter in Ask sends the question and clears the field; the chips send theirs", () => {
    const { input, modeButton, onAsk } = renderExplore();
    act(() => input().focus());
    act(() => modeButton("Ask").click());
    type(input(), "Who have you worked with?");
    act(() => {
      input().form!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    expect(onAsk).toHaveBeenLastCalledWith("Who have you worked with?");
    expect(input().value).toBe("");
    const chips = Array.from(document.querySelectorAll<HTMLButtonElement>(".ask__chip"));
    expect(chips.map((c) => c.textContent)).toEqual([...copy.chips]);
    act(() => chips[0].click());
    expect(onAsk).toHaveBeenLastCalledWith(copy.chips[0]);
    expect(document.activeElement).toBe(input());
  });

  it("Escape closes Ask and returns focus to the pill's field", () => {
    const { input, modeButton } = renderExplore();
    act(() => input().focus());
    act(() => modeButton("Ask").click());
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    });
    expect(document.querySelector(".site-explore__panel")).toBeNull();
    expect(document.activeElement).toBe(input());
  });

  it("on the phone Ask is a sheet and the page behind it is inert until it closes", () => {
    stubMedia(true);
    const { input, modeButton } = renderExplore();
    act(() => input().focus());
    act(() => modeButton("Ask").click());
    expect(container.hasAttribute("inert")).toBe(true);
    expect(document.querySelector(".site-explore")!.hasAttribute("inert")).toBe(false);
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    });
    expect(container.hasAttribute("inert")).toBe(false);
    expect(CSS).toMatch(/\.site-explore\[data-mode="ask"\]\[data-open="true"\] \{\s*bottom: 0;/);
    expect(CSS).toContain("env(safe-area-inset-bottom)");
  });
});

describe("Ask answers", () => {
  it("renders pieces from known slugs with the wall's href rule, 3px corners, and only our links", () => {
    const turns: AskTurn[] = [
      { role: "visitor", text: "Show me hospitality work" },
      { role: "atla", text: "Two from Mexico.", slugs: ["rustico", "unknown", "casa-colora"], links: [{ href: "/brief", label: "Start a project" }] },
    ];
    const { input, modeButton } = renderExplore({ turns });
    act(() => input().focus());
    act(() => modeButton("Ask").click());
    const pieces = Array.from(document.querySelectorAll<HTMLAnchorElement>(".ask__piece"));
    expect(pieces.map((a) => a.getAttribute("href"))).toEqual(["/projects/rustico?at=rustico-cover", "/projects/casa-colora?at=colora"]);
    expect(Array.from(document.querySelectorAll(".ask__links a")).map((a) => a.textContent)).toEqual(["Start a project"]);
    expect(document.querySelector('.ask__turn[data-role="visitor"] .ask__text')!.textContent).toBe("Show me hospitality work");
    expect(CSS).toMatch(/\.ask__piece-media \{[^}]*border-radius: 3px;/);
    expect(document.querySelector(".ask__chip")).toBeNull();
  });

  it("thinking is one quiet dot, never a spinner", () => {
    const { hook } = memoryLocation({ path: "/" });
    act(() =>
      root.render(
        createElement(Router, { hook }, createElement(AskPanel, { turns: [{ role: "visitor", text: "hi there" }], pending: true, partial: "", projects: PROJECTS, onAsk: () => undefined, onRestart: () => undefined })),
      ),
    );
    expect(document.querySelector(".ask__dot")).not.toBeNull();
    expect(CSS).not.toMatch(/\.ask[^{]*spinner/);
    expect(CSS).toMatch(/prefers-reduced-motion: reduce\) \{\s*\.ask__dot \{ animation: none;/);
  });
});

describe("askClient", () => {
  it("looksLikeQuestion", () => {
    expect(looksLikeQuestion("coffee?")).toBe(true);
    expect(looksLikeQuestion("who have you worked with")).toBe(true);
    expect(looksLikeQuestion("Can you do packaging")).toBe(true);
    expect(looksLikeQuestion("what")).toBe(false);
    expect(looksLikeQuestion("coffee shop")).toBe(false);
    expect(looksLikeQuestion("downtown hotel")).toBe(false);
  });

  it("parses server-sent events across chunk boundaries", () => {
    const first = parseAskEvents('data: {"type":"delta","text":"We "}\n\ndata: {"type":"del');
    expect(first.events).toEqual([{ type: "delta", text: "We " }]);
    const second = parseAskEvents(`${first.rest}ta","text":"do."}\n\n`);
    expect(second.events).toEqual([{ type: "delta", text: "do." }]);
  });

  it("sends only the last eight turns, notes dropped, each within the character cap", () => {
    const turns: AskTurn[] = [
      ...Array.from({ length: 10 }, (_, i): AskTurn => (i % 2 ? { role: "atla", text: "x".repeat(800), slugs: [], links: [] } : { role: "visitor", text: `q${i}` })),
      { role: "note", text: copy.error },
      { role: "visitor", text: "last" },
    ];
    const sent = turnsForServer(turns);
    expect(sent).toHaveLength(8);
    expect(sent.at(-1)).toEqual({ role: "visitor", text: "last" });
    expect(sent.every((t) => t.text.length <= 500)).toBe(true);
    expect(JSON.stringify(sent)).not.toContain(copy.error);
  });

  it("maps 503 to the kind unavailable line, 429 to the limit line", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 503 })));
    expect(await streamAsk([{ role: "visitor", text: "hi" }], { onDelta() {}, onReset() {} })).toEqual({ kind: "note", text: copy.unavailable, note: "unavailable" });
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 429 })));
    expect(await streamAsk([{ role: "visitor", text: "hi" }], { onDelta() {}, onReset() {} })).toEqual({ kind: "note", text: copy.limited, note: "limited" });
  });

  it("keeps the conversation in sessionStorage only, and never in localStorage", async () => {
    const answer = { text: "We do.", slugs: ["rustico"], links: [] };
    const sse = `data: ${JSON.stringify({ type: "delta", text: "We do." })}\n\ndata: ${JSON.stringify({ type: "done", answer })}\n\n`;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) =>
        init?.method === "POST"
          ? new Response(sse, { status: 200, headers: { "content-type": "text/event-stream" } })
          : new Response(JSON.stringify({ available: true }), { status: 200, headers: { "content-type": "application/json" } }),
      ),
    );
    let api: ReturnType<typeof useAsk> | null = null;
    function Probe() {
      api = useAsk();
      return null;
    }
    await act(async () => root.render(createElement(Probe)));
    expect(api!.available).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
    await act(async () => {
      api!.probe();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(api!.available).toBe(true);
    await act(async () => {
      await api!.send("Private question about our launch");
    });
    expect(readTurns()).toEqual([
      { role: "visitor", text: "Private question about our launch" },
      { role: "atla", ...answer },
    ]);
    expect(sessionStorage.getItem(ASK_STORAGE_KEY)).toContain("Private question");
    expect(JSON.stringify({ ...localStorage })).not.toContain("Private question");
    await act(async () => api!.restart());
    expect(sessionStorage.getItem(ASK_STORAGE_KEY)).toBeNull();
  });
});
