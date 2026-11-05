// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AskBar } from "./AskBar";
import { siteCopy } from "@/content/siteCopy";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const PROJECTS = [
  {
    slug: "rustico",
    title: "Rústico",
    client: "Acre Resort",
    country: "Mexico",
    sector: "Hospitality & Travel",
    disciplines: ["Brand Identity", "Website"],
    stage: "New brand",
    place: "Mexico",
    searchTerms: ["resort", "boutique hotel"],
    year: 2026,
    coverImage: "https://cdn.sanity.io/images/p/production/a-100x100.jpg",
    images: [],
    videos: [],
    featured: true,
  },
];

let container: HTMLDivElement;
let root: Root;
let location: ReturnType<typeof memoryLocation>;

function mockAsk(handler: () => Promise<Response>) {
  globalThis.fetch = vi.fn((url: RequestInfo | URL) =>
    String(url).includes("/api/ask") ? handler() : Promise.reject(new Error(`unexpected ${String(url)}`)),
  ) as typeof fetch;
}

function render() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  client.setQueryData(["/api/projects"], PROJECTS);
  location = memoryLocation({ path: "/", record: true });
  act(() =>
    root.render(
      createElement(
        QueryClientProvider,
        { client },
        createElement(Router, { hook: location.hook }, createElement(AskBar)),
      ),
    ),
  );
}

async function search(text: string) {
  const input = container.querySelector("input")!;
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  act(() => {
    setValue.call(input, text);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await act(async () => {
    container.querySelector("form")!.requestSubmit();
  });
  // Let the fetch promise chain settle.
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

const json = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));

beforeEach(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});

describe("AskBar", () => {
  it("labels an empty server result as empty, not Closest work, and offers the brief", async () => {
    mockAsk(() => json({ kind: "results", projects: [], closest: true }));
    render();
    await search("hospital");
    const label = container.querySelector(".ask-results__label")!.textContent;
    expect(label).toBe(siteCopy.home.results.empty);
    expect(label).not.toBe(siteCopy.home.results.closest);
    expect(container.querySelectorAll(".project-card")).toHaveLength(0);
    const brief = Array.from(container.querySelectorAll("a")).find((a) => a.textContent === siteCopy.home.results.startBrief);
    expect(brief?.getAttribute("href")).toBe("/brief?seed=hospital");
  });

  it("falls back to client-side ranking on a network error", async () => {
    mockAsk(() => Promise.reject(new TypeError("offline")));
    render();
    await search("hotel");
    const cards = container.querySelectorAll(".project-card");
    expect(cards).toHaveLength(1);
    expect(cards[0].getAttribute("href")).toBe("/projects/rustico");
    expect(container.querySelector("[aria-live]")!.textContent).toContain(siteCopy.home.results.error);
  });

  it("sends a brief response to /brief with the seed", async () => {
    mockAsk(() => json({ kind: "brief", seed: "We're launching a coffee brand" }));
    render();
    await search("We're launching a coffee brand");
    expect(location.history.at(-1)).toBe("/brief?seed=We're%20launching%20a%20coffee%20brand");
  });
});
