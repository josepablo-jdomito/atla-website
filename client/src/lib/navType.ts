/**
 * Tells a page whether it was reached with Back/Forward (popstate) or a push, so it can leave
 * scroll restoration to the browser on Back and start at the top otherwise.
 *
 * The flag remembers the URL the popstate landed on: if a push moves on before anything consumes
 * it, the stale flag no longer matches and reads as a push.
 */
let popHref: string | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    popHref = window.location.href;
  });
}

/** True once after a Back/Forward navigation to the current URL; resets on read. */
export function consumePopNav(): boolean {
  if (typeof window === "undefined") return false;
  const wasPop = popHref !== null && popHref === window.location.href;
  popHref = null;
  return wasPop;
}
