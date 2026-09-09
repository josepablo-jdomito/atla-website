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

/** Idempotent: safe to call from a hook that runs on every navigation. */
export function configureGa4() {
  if (configured || typeof window === "undefined") return;
  configured = true;
  gtag("js", new Date());
  gtag("config", GA4_MEASUREMENT_ID, { send_page_view: false });
}

export function ga4Event(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  configureGa4();
  gtag("event", name, params ?? {});
}
