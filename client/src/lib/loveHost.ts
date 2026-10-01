import { LOVE_HOST } from "@shared/siteSeo";

/**
 * True when the page is being served from love.atla.design, where the
 * why-we-love prototype is the site root rather than a route on the main site.
 * Falls back to false during prerender, which always builds the www shape.
 */
export function isLoveHost() {
  if (typeof window === "undefined") return false;
  return window.location.hostname === LOVE_HOST;
}
