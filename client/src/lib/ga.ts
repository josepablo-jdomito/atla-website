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
  gtag("config", GA4_MEASUREMENT_ID, { send_page_view: false });
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

export function ga4Event(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  configureGa4();
  gtag("event", name, params ?? {});
}
