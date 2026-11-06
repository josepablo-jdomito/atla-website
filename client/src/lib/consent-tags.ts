/**
 * Meta Pixel and Microsoft Clarity, loaded only after the visitor accepts
 * analytics in AnalyticsConsent.
 *
 * Rules this file enforces:
 * - Nothing is injected until applyThirdPartyConsent("granted") runs or a
 *   stored "granted" choice is found. Undecided and declined both mean off.
 * - An empty id (VITE_META_PIXEL_ID, VITE_CLARITY_ID) makes that tag a no-op.
 * - Declining after accepting removes the script tags, revokes consent in the
 *   vendor APIs, deletes their first-party cookies and turns every call here
 *   into a no-op again.
 * - Nothing runs on the server: every entry point checks for window, and
 *   nothing here is called during render, so the prerender stays silent.
 * - No advanced matching, no custom data: the only thing sent to Meta about a
 *   lead is the event name and the event_id used for deduplication.
 *
 * The scripts are injected from the bundle (script-src allows the hosts in
 * vercel.json), so index.html stays free of third-party tags.
 */

export type TagConsent = "granted" | "denied";

interface FbqFn {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  push: FbqFn;
  disablePushState?: boolean;
}

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
    clarity?: ClarityFn;
  }
}

const META_SRC = "https://connect.facebook.net/en_US/fbevents.js";
const CLARITY_SRC = (id: string) => `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
const META_SCRIPT_ATTR = "data-atla-meta-pixel";
const CLARITY_SCRIPT_ATTR = "data-atla-clarity";

export function metaPixelId(): string {
  return String(import.meta.env.VITE_META_PIXEL_ID ?? "").trim();
}

export function clarityId(): string {
  return String(import.meta.env.VITE_CLARITY_ID ?? "").trim();
}

/** True when at least one optional tag has an id, so the consent dialog has something to ask about. */
export function hasThirdPartyTags(): boolean {
  return Boolean(metaPixelId() || clarityId());
}

let granted = false;
let metaLoaded = false;
let clarityLoaded = false;
let lastMetaPath: string | null = null;

function inject(src: string, attr: string) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  script.setAttribute(attr, "");
  document.head.appendChild(script);
}

function loadMeta() {
  const id = metaPixelId();
  if (!id || metaLoaded || typeof window === "undefined") return;
  metaLoaded = true;
  if (!window.fbq) {
    // The documented stub: calls queue until fbevents.js arrives and drains them.
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as FbqFn;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;
  }
  // The router sends PageView itself on every navigation; keep the pixel from
  // also firing one on history changes.
  window.fbq.disablePushState = true;
  window.fbq("consent", "grant");
  window.fbq("init", id);
  inject(META_SRC, META_SCRIPT_ATTR);
}

function loadClarity() {
  const id = clarityId();
  if (!id || clarityLoaded || typeof window === "undefined") return;
  clarityLoaded = true;
  if (!window.clarity) {
    const clarity = function (...args: unknown[]) {
      (clarity.q = clarity.q || []).push(args);
    } as ClarityFn;
    window.clarity = clarity;
  }
  inject(CLARITY_SRC(id), CLARITY_SCRIPT_ATTR);
}

const VENDOR_COOKIES = ["_fbp", "_fbc", "_clck", "_clsk", "CLID", "ANONCHK", "MR", "SM"];

function clearVendorCookies() {
  const host = window.location.hostname;
  const domains = [undefined, host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of VENDOR_COOKIES) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

function unload() {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("consent", "revoke");
  } catch {
    // The vendor script may be half loaded; removal below is what counts.
  }
  try {
    window.clarity?.("stop");
  } catch {
    // Same.
  }
  document.querySelectorAll(`script[${META_SCRIPT_ATTR}], script[${CLARITY_SCRIPT_ATTR}]`).forEach((node) => node.remove());
  delete window.fbq;
  delete window._fbq;
  delete window.clarity;
  clearVendorCookies();
  metaLoaded = false;
  clarityLoaded = false;
  lastMetaPath = null;
}

/** Called when the visitor chooses in the dialog, and once at start-up with the stored choice. */
export function applyThirdPartyConsent(value: TagConsent | null) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (value === "granted") {
    granted = true;
    loadMeta();
    loadClarity();
    return;
  }
  const wasOn = granted || metaLoaded || clarityLoaded;
  granted = false;
  if (wasOn) unload();
}

/**
 * Meta PageView for the current path. Loads the tags first if consent is
 * already stored as granted. Repeat calls for the same path are ignored, so
 * accepting on a page and the router effect cannot double count.
 */
export function trackThirdPartyPageView(path: string, storedConsent: TagConsent | null) {
  if (typeof window === "undefined") return;
  if (storedConsent === "granted" && !granted) applyThirdPartyConsent("granted");
  if (!granted || !metaLoaded || !window.fbq) return;
  if (lastMetaPath === path) return;
  lastMetaPath = path;
  window.fbq("track", "PageView");
}

/**
 * Meta Lead. eventId is the submission's idempotency key; Meta drops a second
 * event with the same id, which is what makes a retry or a later server-side
 * event safe. No custom data is attached.
 */
export function trackMetaLead(eventId: string) {
  if (typeof window === "undefined" || !granted || !metaLoaded || !window.fbq || !eventId) return;
  window.fbq("track", "Lead", {}, { eventID: eventId });
}

/** Test hook: forget module state. */
export function __resetThirdPartyTagsForTests() {
  granted = false;
  metaLoaded = false;
  clarityLoaded = false;
  lastMetaPath = null;
}
