// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const META = "123456789012345";
const CLARITY = "abcd1234ef";

async function load() {
  vi.resetModules();
  const tags = await import("./consent-tags");
  const ga = await import("./ga");
  return { tags, ga };
}

function vendorScripts() {
  return Array.from(document.querySelectorAll("script")).map((s) => s.getAttribute("src") || "");
}

function gaCommands(): unknown[][] {
  return (window.dataLayer ?? []).map((entry) => Array.from(entry as unknown as ArrayLike<unknown>));
}

// Recent Node ships its own half-working localStorage global that shadows jsdom's; use a plain in-memory one.
function installMemoryStorage() {
  const data = new Map<string, string>();
  const storage = {
    getItem: (key: string) => (data.has(key) ? data.get(key)! : null),
    setItem: (key: string, value: string) => void data.set(key, String(value)),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear(),
  };
  Object.defineProperty(window, "localStorage", { value: storage, configurable: true });
}

beforeEach(() => {
  document.head.innerHTML = "";
  installMemoryStorage();
  window.dataLayer = [];
  delete window.fbq;
  delete window._fbq;
  delete window.clarity;
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("nothing loads without consent", () => {
  it("injects nothing and defines no vendor globals while undecided", async () => {
    vi.stubEnv("VITE_META_PIXEL_ID", META);
    vi.stubEnv("VITE_CLARITY_ID", CLARITY);
    const { tags } = await load();
    tags.trackThirdPartyPageView("/", null);
    tags.trackMetaLead("evt-1");
    expect(vendorScripts()).toEqual([]);
    expect(window.fbq).toBeUndefined();
    expect(window.clarity).toBeUndefined();
  });

  it("injects nothing when the visitor declined", async () => {
    vi.stubEnv("VITE_META_PIXEL_ID", META);
    vi.stubEnv("VITE_CLARITY_ID", CLARITY);
    const { tags, ga } = await load();
    ga.setAnalyticsConsent("denied");
    tags.trackThirdPartyPageView("/work", "denied");
    expect(vendorScripts()).toEqual([]);
    expect(window.fbq).toBeUndefined();
  });

  it("the HTML shell carries no Meta or Clarity tag", () => {
    const html = readFileSync(path.resolve(__dirname, "../../index.html"), "utf8");
    expect(html).not.toMatch(/fbevents|facebook\.net|clarity\.ms/);
  });
});

describe("loaders are no-ops without ids", () => {
  it("injects nothing even after consent when both ids are empty", async () => {
    vi.stubEnv("VITE_META_PIXEL_ID", "");
    vi.stubEnv("VITE_CLARITY_ID", "   ");
    const { tags, ga } = await load();
    expect(tags.hasThirdPartyTags()).toBe(false);
    ga.setAnalyticsConsent("granted");
    tags.trackThirdPartyPageView("/", "granted");
    tags.trackMetaLead("evt-2");
    expect(vendorScripts()).toEqual([]);
    expect(window.fbq).toBeUndefined();
    expect(window.clarity).toBeUndefined();
  });

  it("loads only the tag that has an id", async () => {
    vi.stubEnv("VITE_META_PIXEL_ID", "");
    vi.stubEnv("VITE_CLARITY_ID", CLARITY);
    const { ga } = await load();
    ga.setAnalyticsConsent("granted");
    expect(vendorScripts()).toEqual([`https://www.clarity.ms/tag/${CLARITY}`]);
    expect(window.fbq).toBeUndefined();
  });
});

describe("after the visitor accepts", () => {
  it("loads Meta and Clarity once and sends one PageView per path", async () => {
    vi.stubEnv("VITE_META_PIXEL_ID", META);
    vi.stubEnv("VITE_CLARITY_ID", CLARITY);
    const { tags, ga } = await load();
    ga.setAnalyticsConsent("granted");
    tags.trackThirdPartyPageView(window.location.pathname, "granted");
    tags.trackThirdPartyPageView("/work", "granted");
    expect(vendorScripts().sort()).toEqual(
      [`https://connect.facebook.net/en_US/fbevents.js`, `https://www.clarity.ms/tag/${CLARITY}`].sort(),
    );
    const calls = window.fbq!.queue.map((args) => args[0] === "track" ? args.join(":") : `${args[0]}:${args[1]}`);
    expect(calls).toEqual(["consent:grant", `init:${META}`, "track:PageView", "track:PageView"]);
    expect(window.fbq!.disablePushState).toBe(true);
  });

  it("loads straight from a stored granted choice on the next visit", async () => {
    vi.stubEnv("VITE_META_PIXEL_ID", META);
    const { tags } = await load();
    tags.trackThirdPartyPageView("/", "granted");
    expect(vendorScripts()).toEqual(["https://connect.facebook.net/en_US/fbevents.js"]);
  });

  it("the Lead event carries the event_id and no personal data", async () => {
    vi.stubEnv("VITE_META_PIXEL_ID", META);
    const { tags, ga } = await load();
    ga.setAnalyticsConsent("granted");
    tags.trackMetaLead("brief-key-42");
    const lead = window.fbq!.queue.find((args) => args[0] === "track" && args[1] === "Lead");
    expect(lead).toEqual(["track", "Lead", {}, { eventID: "brief-key-42" }]);
  });

  it("brief completion sends generate_lead and Lead with the brief's idempotency key and nothing typed", async () => {
    vi.stubEnv("VITE_META_PIXEL_ID", META);
    const { ga } = await load();
    ga.setAnalyticsConsent("granted");
    ga.trackBriefComplete("3f2b8c1e-5d4a-4c7e-9a10-0b6f2d7e8a91");
    const generateLead = gaCommands().find((c) => c[0] === "event" && c[1] === "generate_lead");
    expect(generateLead).toBeDefined();
    const params = generateLead![2] as Record<string, unknown>;
    expect(params.form).toBe("brief");
    expect(params.event_id).toBe("3f2b8c1e-5d4a-4c7e-9a10-0b6f2d7e8a91");
    expect(Object.keys(params).sort()).toEqual(["event_id", "form", "page_location", "page_path"]);
    const lead = window.fbq!.queue.find((args) => args[1] === "Lead");
    expect(lead).toEqual(["track", "Lead", {}, { eventID: "3f2b8c1e-5d4a-4c7e-9a10-0b6f2d7e8a91" }]);
    expect(JSON.stringify([params, lead])).not.toMatch(/@|email|message/i);
  });

  it("without consent, brief completion sends no Meta Lead", async () => {
    vi.stubEnv("VITE_META_PIXEL_ID", META);
    const { ga } = await load();
    ga.trackBriefComplete("3f2b8c1e-5d4a-4c7e-9a10-0b6f2d7e8a91");
    expect(window.fbq).toBeUndefined();
    expect(vendorScripts()).toEqual([]);
  });
});

describe("withdrawal", () => {
  it("declining after accepting removes the scripts and silences every call", async () => {
    vi.stubEnv("VITE_META_PIXEL_ID", META);
    vi.stubEnv("VITE_CLARITY_ID", CLARITY);
    const { tags, ga } = await load();
    ga.setAnalyticsConsent("granted");
    expect(vendorScripts().length).toBe(2);
    ga.setAnalyticsConsent("denied");
    expect(vendorScripts()).toEqual([]);
    expect(window.fbq).toBeUndefined();
    expect(window.clarity).toBeUndefined();
    tags.trackMetaLead("late");
    tags.trackThirdPartyPageView("/after", "denied");
    expect(window.fbq).toBeUndefined();
    expect(window.localStorage.getItem("atla-analytics-consent")).toBe("denied");
  });
});

describe("GA4 page_location", () => {
  it("is path-only on events, never the query string", async () => {
    window.history.replaceState({}, "", "/contact?email=a%40b.com&utm_source=x#frag");
    const { ga } = await load();
    ga.ga4Event("cta_click", { page: "/" });
    const event = gaCommands().find((c) => c[0] === "event" && c[1] === "cta_click");
    const location = (event![2] as Record<string, string>).page_location;
    expect(location).toBe(`${window.location.origin}/contact`);
    expect(location).not.toMatch(/[?#]/);
    window.history.replaceState({}, "", "/");
  });
});
