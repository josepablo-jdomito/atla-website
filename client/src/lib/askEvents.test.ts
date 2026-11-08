// @vitest-environment jsdom
/**
 * GA4 ask_turn: fired once per settled answer, params are only { mode, pieces, links } with fixed
 * values and small counts, never text, and nothing before consent. Same harness as siteEvents.test.ts.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { CONSENT_STORAGE_KEY } from "./ga";
import { trackAskTurn } from "./askEvents";


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

function fired() {
  return (window.dataLayer ?? [])
    .map((entry) => Array.from(entry as unknown as ArrayLike<unknown>))
    .filter((args) => args[0] === "event")
    .map((args) => {
      const { page_location, page_path, ...params } = (args[2] ?? {}) as Record<string, unknown>;
      expect(page_location).toBe(`${window.location.origin}${window.location.pathname}`);
      expect(page_path).toBe(window.location.pathname);
      return { name: String(args[1]), params };
    });
}

beforeEach(() => {
  window.dataLayer = [];
  installStorage();
  window.history.replaceState(null, "", "/?q=private+words");
});


describe("ask_turn", () => {
  it("carries mode, pieces and links only, with the page location cleaned of the query", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    trackAskTurn(3, 1);
    const events = fired().filter((e) => e.name === "ask_turn");
    expect(events).toEqual([{ name: "ask_turn", params: { mode: "ask", pieces: 3, links: 1 } }]);
    expect(JSON.stringify(window.dataLayer)).not.toContain("private");
  });

  it("clamps the counts to small whole numbers", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    trackAskTurn(Number.NaN, 1e9);
    expect(fired().find((e) => e.name === "ask_turn")!.params).toEqual({ mode: "ask", pieces: 0, links: 99 });
  });

  it("sends nothing when consent is denied", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "denied");
    trackAskTurn(2, 0);
    expect(fired().filter((e) => e.name === "ask_turn")).toEqual([]);
  });
});
