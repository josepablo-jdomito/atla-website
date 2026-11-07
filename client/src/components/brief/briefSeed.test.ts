// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { clearBrief, takeSeedFromUrl } from "./briefStorage";

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

let store: Storage;

beforeEach(() => {
  store = memoryStorage();
  Object.defineProperty(window, "sessionStorage", { value: store, configurable: true });
  Object.defineProperty(globalThis, "sessionStorage", { value: store, configurable: true });
  window.history.replaceState(null, "", "/");
});

describe("takeSeedFromUrl", () => {
  it("a /brief?seed=X load leaves the URL without the seed and the seed in storage", () => {
    window.history.replaceState(null, "", "/brief?seed=A%20mezcal%20brand&moment=grow#top");
    expect(takeSeedFromUrl()).toBe("A mezcal brand");
    expect(window.location.pathname).toBe("/brief");
    expect(window.location.search).toBe("?moment=grow");
    expect(window.location.hash).toBe("#top");
    expect(window.location.href).not.toContain("mezcal");
    expect(store.getItem("atla-brief-seed")).toBe("A mezcal brand");
    // Later renders read it back from storage.
    expect(takeSeedFromUrl()).toBe("A mezcal brand");
  });

  it("returns null without a seed, and clearBrief forgets a stored one", () => {
    window.history.replaceState(null, "", "/brief");
    expect(takeSeedFromUrl()).toBeNull();
    window.history.replaceState(null, "", "/brief?seed=x");
    takeSeedFromUrl();
    clearBrief();
    expect(takeSeedFromUrl()).toBeNull();
  });
});
