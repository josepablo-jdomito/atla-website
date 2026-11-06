// @vitest-environment jsdom
/**
 * GA4 site v2 events, end to end in the DOM: the wall's search and the brief, with gtag's
 * dataLayer as the stub. Asserts when each event fires, that its params are only the allowed
 * keys with fixed values, that nothing the visitor typed or chose rides along, and that nothing
 * fires before consent.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextFixedQuestion, type BriefState } from "@shared/brief";
import { WorkWall } from "@/components/site/WorkWall";
import { BriefFlow } from "@/components/brief/BriefFlow";
import { CONSENT_STORAGE_KEY, ga4Event, setAnalyticsConsent, trackBarSearch } from "./ga";

vi.mock("@/components/brief/briefApi", () => ({
  fetchNextStep: vi.fn(async (state: BriefState) => nextFixedQuestion(state)),
  submitBrief: vi.fn(async () => ({ status: "ok", calendlyUrl: "https://calendly.com/atla/intro" })),
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const ALLOWED: Record<string, string[]> = {
  bar_search: ["kind", "closest"],
  brief_start: ["seeded"],
  brief_complete: [],
  calendly_click: [],
};
const FIXED_STRINGS = new Set(["results", "brief"]);

type Fired = { name: string; params: Record<string, unknown> };

/** gtag("event", name, params) calls, as raw argument arrays. */
function rawEvents(): unknown[][] {
  return (window.dataLayer ?? [])
    .map((entry) => Array.from(entry as unknown as ArrayLike<unknown>))
    .filter((args) => args[0] === "event");
}

/**
 * gtag("event", name, params) calls, read back from the dataLayer stub. Every event carries
 * page_location and page_path; both must be origin + path only, and are dropped from the result.
 */
function fired(): Fired[] {
  return rawEvents().map((args) => {
    const { page_location, page_path, ...params } = (args[2] ?? {}) as Record<string, unknown>;
    expect(page_location).toBe(`${window.location.origin}${window.location.pathname}`);
    expect(page_path).toBe(window.location.pathname);
    return { name: String(args[1]), params };
  });
}

/** Every event is allowed, carries exactly its keys, and only booleans or the fixed strings. */
function expectCleanShape(events: Fired[]) {
  for (const event of events) {
    expect(Object.keys(ALLOWED)).toContain(event.name);
    expect(Object.keys(event.params).sort()).toEqual([...ALLOWED[event.name]].sort());
    for (const value of Object.values(event.params)) {
      expect(typeof value === "boolean" || (typeof value === "string" && FIXED_STRINGS.has(value))).toBe(true);
    }
  }
}

/** No 4+ character piece of any private text appears anywhere in a fired event. */
function expectNoLeak(events: Fired[], privateTexts: string[]) {
  // Names are fixed strings checked above; what could carry visitor data is the params.
  const serialized = JSON.stringify(events.map((event) => event.params)).toLowerCase();
  for (const text of privateTexts) {
    const value = text.toLowerCase();
    for (let start = 0; start + 4 <= value.length; start += 1) {
      for (let end = start + 4; end <= value.length; end += 1) {
        const piece = value.slice(start, end);
        if (piece.trim().length < 4) continue;
        expect(serialized, `event leaks "${piece}" from "${text}"`).not.toContain(piece);
      }
    }
  }
}

function setTimeZone(timeZone: string) {
  const Real = Intl.DateTimeFormat;
  vi.spyOn(Intl, "DateTimeFormat").mockImplementation(((...args: ConstructorParameters<typeof Real>) => {
    const real = new Real(...args);
    return Object.assign(Object.create(real), { resolvedOptions: () => ({ ...real.resolvedOptions(), timeZone }) });
  }) as unknown as typeof Intl.DateTimeFormat);
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

let container: HTMLDivElement;
let root: Root;
let localStorage: Storage;

beforeEach(() => {
  window.dataLayer = [];
  localStorage = memoryStorage();
  Object.defineProperty(window, "localStorage", { value: localStorage, configurable: true });
  Object.defineProperty(window, "sessionStorage", { value: memoryStorage(), configurable: true });
  Object.defineProperty(globalThis, "sessionStorage", { value: window.sessionStorage, configurable: true });
  window.history.replaceState(null, "", "/");
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
  // The wall uses no AI and no server search (JP, 2026-11-05): any fetch is a bug.
  globalThis.fetch = vi.fn(async (url: RequestInfo | URL) => {
    throw new Error(`unexpected fetch ${String(url)}`);
  }) as typeof fetch;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------- the wall's search

const PROJECTS = [
  {
    slug: "rustico",
    title: "Rústico",
    client: "Acre Resort",
    industry: "Hospitality",
    region: "America",
    services: ["Branding"],
    tags: ["Hotel"],
    year: 2026,
    coverImage: "https://cdn.sanity.io/images/p/production/a-100x100.jpg",
    images: [],
    videos: [],
    featured: true,
  },
];

function renderWall() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  client.setQueryData(["/api/projects"], PROJECTS);
  act(() => root.render(createElement(QueryClientProvider, { client }, createElement(WorkWall))));
}

const input = () => document.body.querySelector<HTMLInputElement>(".site-explore__input")!;

/** Types `text` one keystroke at a time, 60 ms apart, like a person. */
async function typeInto(text: string) {
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  for (let i = 1; i <= text.length; i += 1) {
    act(() => {
      setValue.call(input(), text.slice(0, i));
      input().dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => {
      vi.advanceTimersByTime(60);
    });
  }
}

/** Past the URL debounce and the settle delay. */
async function settle() {
  for (let i = 0; i < 10; i += 1) {
    await act(async () => {
      vi.advanceTimersByTime(300);
      await Promise.resolve();
    });
  }
}

describe("bar_search on the work wall", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  it("fires once per settled typed query, never per keystroke, with only kind and closest", async () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    renderWall();

    await typeInto("hotel");
    expect(fired()).toEqual([]);
    await settle();
    expect(fired()).toEqual([{ name: "bar_search", params: { kind: "results", closest: false } }]);

    // The same query again is not a new search.
    await settle();
    expect(fired()).toHaveLength(1);

    // A query with no local match settles as closest work.
    act(() => {
      const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      setValue.call(input(), "");
      input().dispatchEvent(new Event("input", { bubbles: true }));
    });
    await settle();
    expect(fired()).toHaveLength(1);
    await typeInto("quokka orchard");
    await settle();

    const events = fired();
    expect(events).toEqual([
      { name: "bar_search", params: { kind: "results", closest: false } },
      { name: "bar_search", params: { kind: "results", closest: true } },
    ]);
    expectCleanShape(events);
    expectNoLeak(events, ["hotel", "quokka orchard"]);
    // The URL holds ?q=quokka orchard by now; it must not reach GA either.
    expect(window.location.search).toContain("q=");
    expect(JSON.stringify(rawEvents()).toLowerCase()).not.toContain("quokka");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("does not fire for a ?q= the visitor arrived with", async () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    window.history.replaceState(null, "", "/?q=hotel");
    renderWall();
    await settle();
    expect(fired()).toEqual([]);
  });

  it("sends nothing before consent where the banner asks, and fires once it is accepted", async () => {
    setTimeZone("Europe/Madrid");
    renderWall();
    await typeInto("hotel");
    await settle();
    expect(fired()).toEqual([]);

    act(() => setAnalyticsConsent("granted"));
    await typeInto(" lobby");
    await settle();
    // "hotel lobby" ranks nothing exactly, so the wall shows closest work.
    expect(fired()).toEqual([{ name: "bar_search", params: { kind: "results", closest: true } }]);
  });

  it("sends nothing after the visitor declines", async () => {
    setTimeZone("America/Chicago");
    localStorage.setItem(CONSENT_STORAGE_KEY, "denied");
    renderWall();
    await typeInto("hotel");
    await settle();
    expect(fired()).toEqual([]);
  });
});

// ---------------------------------------------------------------- page_location

describe("page_location never carries the query or the hash", () => {
  it("an event fired on /?q=secret carries no secret anywhere in the dataLayer", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    window.history.replaceState(null, "", "/?q=secret#secret-hash");
    trackBarSearch("results", true);
    ga4Event("cta_click", { page: "/", cta_type: "contact" });
    ga4Event("page_view", { page_location: "https://atla.design/brief?seed=secret#secret" });
    const entries = (window.dataLayer ?? []).map((entry) => Array.from(entry as unknown as ArrayLike<unknown>));
    expect(JSON.stringify(entries)).not.toContain("secret");
    const events = rawEvents();
    expect(events).toHaveLength(3);
    expect((events[0][2] as Record<string, unknown>).page_location).toBe(`${window.location.origin}/`);
    expect((events[0][2] as Record<string, unknown>).page_path).toBe("/");
    expect((events[2][2] as Record<string, unknown>).page_location).toBe("https://atla.design/brief");
    expect((events[2][2] as Record<string, unknown>).page_path).toBe("/brief");
  });
});

// ---------------------------------------------------------------- the brief

const SEED = "Quokka orchard cider from Patagonia";
const BUILDING = "Zanzibar marmalade cooperative";
const CONTACT = { name: "Zebulon Thistlewood", email: "zeb@thistlewood-example.org", company: "Marigold Foundry" };

const prompt = () => container.querySelector(".brief-prompt")?.textContent ?? "";

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

async function click(element: Element | null | undefined) {
  expect(element).toBeTruthy();
  await act(async () => {
    (element as HTMLElement).click();
  });
  await flush();
}

function setField(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  act(() => {
    Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

/** Answers every question with the first option (or `BUILDING` for text) and returns the answers chosen. */
async function answerAll(): Promise<string[]> {
  const chosen: string[] = [];
  for (let guard = 0; guard < 10 && !container.querySelector('[data-field="name"]'); guard += 1) {
    const textarea = container.querySelector<HTMLTextAreaElement>(".brief-text");
    if (textarea) {
      setField(textarea, BUILDING);
      chosen.push(BUILDING);
      await click(container.querySelector(".brief-primary"));
      continue;
    }
    const option = container.querySelector<HTMLButtonElement>(".brief-option");
    chosen.push(option!.textContent ?? "");
    await click(option);
    if (option!.dataset.kind === "multi") await click(container.querySelector(".brief-primary"));
  }
  return chosen;
}

async function sendContact() {
  for (const [key, value] of Object.entries(CONTACT)) {
    setField(container.querySelector<HTMLInputElement>(`[data-field="${key}"] input`)!, value);
  }
  await act(async () => {
    container.querySelector<HTMLFormElement>("form")!.requestSubmit();
  });
  await flush();
}

describe("brief events", () => {
  it("brief_start {seeded: true}, brief_complete and calendly_click fire once each, at the right moment", async () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    await act(async () => {
      root.render(createElement(BriefFlow, { seed: SEED, moment: "grow" }));
    });
    await flush();
    expect(prompt()).toBe("Which world is it in?");
    expect(fired()).toEqual([{ name: "brief_start", params: { seeded: true } }]);

    const answers = await answerAll();
    expect(fired()).toHaveLength(1);

    await sendContact();
    expect(fired().map((event) => event.name)).toEqual(["brief_start", "brief_complete"]);

    const calendly = container.querySelector<HTMLAnchorElement>('a[href="https://calendly.com/atla/intro"]');
    calendly!.addEventListener("click", (event) => event.preventDefault());
    await click(calendly);

    const events = fired();
    expect(events).toEqual([
      { name: "brief_start", params: { seeded: true } },
      { name: "brief_complete", params: {} },
      { name: "calendly_click", params: {} },
    ]);
    expectCleanShape(events);
    expectNoLeak(events, [SEED, "Grow / scale", ...answers, ...Object.values(CONTACT)]);
  });

  it("brief_start {seeded: false} without a seed or moment; a typed answer never rides along", async () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    await act(async () => {
      root.render(createElement(BriefFlow, {}));
    });
    await flush();
    expect(prompt()).toBe("What are you building?");
    expect(fired()).toEqual([{ name: "brief_start", params: { seeded: false } }]);

    const answers = await answerAll();
    expect(answers[0]).toBe(BUILDING);
    await sendContact();

    const events = fired();
    expect(events.map((event) => event.name)).toEqual(["brief_start", "brief_complete"]);
    expectCleanShape(events);
    expectNoLeak(events, [...answers, ...Object.values(CONTACT)]);
  });

  it("sends nothing before consent where the banner asks", async () => {
    setTimeZone("Europe/Berlin");
    await act(async () => {
      root.render(createElement(BriefFlow, { seed: SEED }));
    });
    await flush();
    await answerAll();
    await sendContact();
    expect(container.querySelector('a[href="https://calendly.com/atla/intro"]')).toBeTruthy();
    expect(fired()).toEqual([]);
  });
});
