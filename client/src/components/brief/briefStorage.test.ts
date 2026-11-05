import { afterEach, describe, expect, it, vi } from "vitest";
import type { SavedBrief } from "./briefStorage";

const KEY = "atla-brief-v1";

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => (data.has(key) ? data.get(key)! : null),
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, String(value)),
  };
}

function throwingStorage(): Storage {
  const fail = () => {
    throw new DOMException("denied", "SecurityError");
  };
  return { length: 0, clear: fail, getItem: fail, key: fail, removeItem: fail, setItem: fail };
}

const saved: SavedBrief = {
  seed: "A mezcal brand for export",
  answers: { industry: "Consumer / CPG", deliverables: ["Naming", "Identity"] },
  contact: { name: "Ana", email: "ana@example.com", company: "", website: "", phone: "" },
  submissionId: "3f0c2a8e-7d1b-4c55-9a51-0f6f6b1d2e11",
  path: [
    { id: "industry", prompt: "Which world is it in?", kind: "single", options: ["Hospitality", "Consumer / CPG"] },
    { id: "contact" },
  ],
  index: 1,
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("briefStorage", () => {
  it("resume after reload", async () => {
    const storage = memoryStorage();
    vi.stubGlobal("sessionStorage", storage);

    const first = await import("./briefStorage");
    first.saveBrief(saved);

    // A reload is a fresh module graph reading the same sessionStorage.
    vi.resetModules();
    const second = await import("./briefStorage");
    expect(second.loadBrief()).toEqual(saved);
    expect(storage.getItem(KEY)).not.toBeNull();
  });

  it("storage unavailable returns null", async () => {
    vi.stubGlobal("sessionStorage", throwingStorage());
    const { loadBrief, saveBrief, clearBrief } = await import("./briefStorage");
    expect(() => saveBrief(saved)).not.toThrow();
    expect(() => clearBrief()).not.toThrow();
    expect(loadBrief()).toBeNull();
  });

  it("no sessionStorage at all returns null", async () => {
    vi.stubGlobal("sessionStorage", undefined);
    const { loadBrief, saveBrief } = await import("./briefStorage");
    expect(() => saveBrief(saved)).not.toThrow();
    expect(loadBrief()).toBeNull();
  });

  it("corrupt or foreign data returns null", async () => {
    const storage = memoryStorage();
    vi.stubGlobal("sessionStorage", storage);
    const { loadBrief } = await import("./briefStorage");

    storage.setItem(KEY, "{not json");
    expect(loadBrief()).toBeNull();
    storage.setItem(KEY, JSON.stringify({ answers: "nope" }));
    expect(loadBrief()).toBeNull();
  });

  it("clearBrief removes the saved brief", async () => {
    vi.stubGlobal("sessionStorage", memoryStorage());
    const { loadBrief, saveBrief, clearBrief } = await import("./briefStorage");
    saveBrief(saved);
    clearBrief();
    expect(loadBrief()).toBeNull();
  });
});
