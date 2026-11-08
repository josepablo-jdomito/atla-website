/** Focus helpers shared by the site dialogs: the lightbox, the Explore panel and the menu sheet. */

const FOCUSABLE = 'button:not([disabled]):not([tabindex="-1"]), a[href]:not([tabindex="-1"]), input:not([disabled]):not([type="hidden"]), [tabindex="0"]';

/** The keyboard stops inside `root`, in DOM order. */
export function focusablesIn(root: HTMLElement | null): HTMLElement[] {
  return root ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
}

/**
 * Keeps Tab and Shift+Tab on `stops`: from the last one to the first, and back.
 * Pass a root element to use every stop inside it, or the list itself when the
 * trap spans two places (the menu sheet plus the header button that closes it).
 */
export function trapTab(
  event: Pick<KeyboardEvent, "shiftKey" | "preventDefault">,
  rootOrStops: HTMLElement | HTMLElement[] | null,
) {
  const stops = Array.isArray(rootOrStops) ? rootOrStops.filter(Boolean) : focusablesIn(rootOrStops);
  if (stops.length === 0) return;
  const first = stops[0];
  const last = stops[stops.length - 1];
  const active = document.activeElement;
  const inside = stops.some((stop) => stop === active || (active instanceof Node && stop.contains(active)));
  if (event.shiftKey && (active === first || !inside)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !inside)) {
    event.preventDefault();
    first.focus();
  }
}
