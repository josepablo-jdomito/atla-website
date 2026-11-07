/**
 * Hydration phase (fix pass A, 2026-11-06). main.tsx hydrates the prerendered HTML with hydrateRoot, so
 * the client's first render must equal the prerender: anything read from the window (viewport width,
 * media queries, Math.random) waits until hydration is done. The prerender itself has no window.
 *
 * main.tsx calls beginHydration() before hydrateRoot; App.tsx calls endHydration() in the layout effect
 * of the route's Suspense boundary, i.e. once the page itself has hydrated (a lazy page chunk can arrive
 * after the root commits). A page rendered from scratch (client navigation, empty #root) never hydrates.
 */
let hydrating = false;

export function beginHydration() {
  hydrating = true;
}

export function endHydration() {
  hydrating = false;
}

/** True while the client's first render must match the prerender, and always on the server. */
export function isHydrating() {
  return typeof window === "undefined" || hydrating;
}

/**
 * A useState initializer that is hydration-safe: the server value while prerendering or hydrating,
 * the client value otherwise. Pair it with an effect that sets the client value after mount.
 */
export function initialClientState<T>(serverValue: T, clientValue: () => T): T {
  return isHydrating() ? serverValue : clientValue();
}
