/**
 * Google Analytics 4, wired to survive this app's Content-Security-Policy.
 *
 * The CSP in vercel.json allows scripts from 'self' plus a short host
 * allowlist, with no 'unsafe-inline' and no nonce. Google's copy-paste
 * snippet puts the bootstrap in an inline <script>, which that policy
 * blocks, so the split here is deliberate: index.html loads gtag.js from
 * the allowlisted googletagmanager host, and every command runs from the
 * bundle, which is 'self'.
 *
 * The config call suppresses gtag's own page_view. usePageAnalytics sends
 * one per wouter location including the first, so leaving it on would count
 * every landing page twice.
 *
 * The dataLayer pushes in use-analytics.ts stay as they are. They are
 * GTM-shaped and gtag.js ignores them, so a GTM container added later still
 * receives everything without a second migration.
 */

import { applyThirdPartyConsent, clearAnalyticsCookies, trackMetaLead, trackThirdPartyPageView } from "@/lib/consent-tags";

export const GA4_MEASUREMENT_ID = "G-X4ZD7PGXE3";

/**
 * Pushes the `arguments` object rather than a rest array on purpose: this is
 * byte-for-byte the shim Google documents, and gtag.js reads each dataLayer
 * entry as that array-like command shape.
 */
function gtagRaw() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments as unknown as Record<string, unknown>);
}

const gtag = gtagRaw as unknown as (...args: unknown[]) => void;

let configured = false;

/**
 * Consent Mode v2. The site runs no ad tags, so the ad_* signals are always
 * denied. analytics_storage defaults to granted, except in the EEA, the UK
 * and Switzerland, where it stays denied until the visitor accepts in
 * AnalyticsConsent. The region-scoped default is applied by gtag.js itself;
 * the banner uses the time zone only to decide whether to show itself.
 * The privacy page describes exactly this, so change both together.
 */
export const CONSENT_STORAGE_KEY = "atla-analytics-consent";
export type AnalyticsConsent = "granted" | "denied";

const CONSENT_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU",
  "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

export function readStoredConsent(): AnalyticsConsent | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function consentState(analytics: AnalyticsConsent) {
  return { analytics_storage: analytics, ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
}

/** Idempotent: safe to call from a hook that runs on every navigation. */
export function configureGa4() {
  if (configured || typeof window === "undefined") return;
  configured = true;
  gtag("consent", "default", { ...consentState("granted") });
  gtag("consent", "default", { ...consentState("denied"), region: CONSENT_REGIONS });
  const stored = readStoredConsent();
  if (stored) gtag("consent", "update", consentState(stored));
  gtag("js", new Date());
  gtag("config", GA4_MEASUREMENT_ID, { send_page_view: false, ...cleanPageLocation() });
}

export function setAnalyticsConsent(value: AnalyticsConsent) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Private mode: the choice holds for this page view only.
  }
  configureGa4();
  gtag("consent", "update", consentState(value));
  // Meta and Clarity load only on an explicit "granted", and are removed on "denied".
  applyThirdPartyConsent(value);
  // Withdrawing means the cookies already on the device go too, not only that new ones stop.
  if (value === "denied") clearAnalyticsCookies();
  if (value === "granted") trackThirdPartyPageView(window.location.pathname, value);
  window.dispatchEvent(new CustomEvent("atla:analytics-consent"));
}

/** True when the visitor's clock is set to a European time zone. Only decides whether the banner shows. */
export function likelyNeedsConsentPrompt() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone.startsWith("Europe/");
  } catch {
    return false;
  }
}

/**
 * The page as GA may see it: origin and path, never the query or the hash. The wall writes the
 * typed search into `?q=` and old links carry `?seed=`; gtag would otherwise read both from
 * document.location for every event.
 */
export function cleanPageLocation(href?: string): { page_location: string; page_path: string; page_referrer?: string } {
  const base = typeof window === "undefined" ? "https://atla.design/" : window.location.href;
  let url: URL;
  try {
    url = new URL(href ?? base, base);
  } catch {
    url = new URL(base);
  }
  const referrer = cleanReferrer();
  return { page_location: `${url.origin}${url.pathname}`, page_path: url.pathname, ...(referrer ? { page_referrer: referrer } : {}) };
}

/** The referrer the same way: a reload after a search would otherwise hand GA the previous `?q=`. */
function cleanReferrer(): string {
  if (typeof document === "undefined" || !document.referrer) return "";
  try {
    const url = new URL(document.referrer);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
}

/** Every event carries a clean page_location and page_path; a caller's own value is cleaned too. */
export function ga4Event(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  configureGa4();
  const given = typeof params?.page_location === "string" ? params.page_location : undefined;
  gtag("event", name, { ...(params ?? {}), ...cleanPageLocation(given) });
}

/**
 * The gate for the site v2 events below. A stored choice decides; without one, a visitor whose
 * clock is in Europe (the visitors the consent banner asks) sends nothing until they accept.
 * Everyone else follows the granted default above, as the privacy page says.
 */
export function analyticsAllowed(): boolean {
  if (typeof window === "undefined") return false;
  const stored = readStoredConsent();
  if (stored) return stored === "granted";
  return !likelyNeedsConsentPrompt();
}

/**
 * Site v2 funnel events. Params are fixed strings and booleans only: never the typed query,
 * the seed, an answer, a name, an email or a company (tested in siteEvents.test.ts).
 */
export type SiteEvent =
  | { name: "bar_search"; params: { kind: "results" | "brief"; closest: boolean } }
  | { name: "brief_start"; params: { seeded: boolean } }
  | { name: "brief_complete"; params: Record<string, never> }
  | { name: "generate_lead"; params: { form: "brief"; event_id: string } }
  | { name: "calendly_click"; params: Record<string, never> };

function siteEvent(event: SiteEvent) {
  if (!analyticsAllowed()) return;
  ga4Event(event.name, event.params);
}

/** A typed search on the work wall settled. `closest` is true when nothing matched and the wall shows the nearest work. */
export const trackBarSearch = (kind: "results" | "brief", closest: boolean) =>
  siteEvent({ name: "bar_search", params: { kind, closest } });
/** The brief showed its first question. `seeded` is true when the visit came with a seed (/brief?seed=). */
export const trackBriefStart = (seeded: boolean) => siteEvent({ name: "brief_start", params: { seeded } });
/**
 * The brief was delivered. `submissionId` is the brief's idempotency key (shared/brief.ts); it is
 * the event_id on GA4's recommended generate_lead and on Meta's Lead, which is what lets Meta
 * deduplicate a retry. It is a random id, never anything the visitor typed.
 */
export const trackBriefComplete = (submissionId?: string) => {
  siteEvent({ name: "brief_complete", params: {} });
  if (!submissionId) return;
  siteEvent({ name: "generate_lead", params: { form: "brief", event_id: submissionId } });
  trackMetaLead(submissionId);
};
export const trackCalendlyClick = () => siteEvent({ name: "calendly_click", params: {} });
