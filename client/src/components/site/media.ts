import { useEffect, useSyncExternalStore, type RefObject } from "react";

/**
 * React 18 warns on the camelCase `fetchPriority` prop; the lowercase attribute is what the browser reads.
 * Spread it onto an <img> that should win the network race: `{...(priority ? PRIORITY_ATTRS : null)}`.
 */
export const PRIORITY_ATTRS = { fetchpriority: "high" } as Record<string, string>;

/**
 * One "Pause motion" mechanism for the whole page (WCAG 2.2.2). It sets data-motion="paused" on the
 * page root (<html>), remembers the choice for the session, and every autoplaying loop reads it:
 * useInViewPlayback pauses its video, and the project page swaps Vimeo background embeds for the
 * plain player. Reduced-motion visitors already get stills; this is for everyone else.
 */
export const MOTION_STORAGE_KEY = "atla-motion";
export const MOTION_EVENT = "atla:motion";

let motionRestored = false;

function restoreMotion() {
  if (motionRestored || typeof document === "undefined") return;
  motionRestored = true;
  try {
    if (window.sessionStorage.getItem(MOTION_STORAGE_KEY) === "paused") {
      document.documentElement.setAttribute("data-motion", "paused");
    }
  } catch {
    // Private mode: the choice holds for this page view only.
  }
}

export function isMotionPaused(): boolean {
  if (typeof document === "undefined") return false;
  restoreMotion();
  return document.documentElement.getAttribute("data-motion") === "paused";
}

export function setMotionPaused(paused: boolean) {
  if (typeof document === "undefined") return;
  motionRestored = true;
  if (paused) document.documentElement.setAttribute("data-motion", "paused");
  else document.documentElement.removeAttribute("data-motion");
  try {
    if (paused) window.sessionStorage.setItem(MOTION_STORAGE_KEY, "paused");
    else window.sessionStorage.removeItem(MOTION_STORAGE_KEY);
  } catch {
    // See restoreMotion.
  }
  window.dispatchEvent(new CustomEvent(MOTION_EVENT));
}

function subscribeMotion(onChange: () => void) {
  window.addEventListener(MOTION_EVENT, onChange);
  return () => window.removeEventListener(MOTION_EVENT, onChange);
}

/** True while the visitor has paused motion. The prerender and the first paint assume playing. */
export function useMotionPaused(): boolean {
  return useSyncExternalStore(subscribeMotion, isMotionPaused, () => false);
}

/**
 * A muted inline video plays only while it is on screen (with a 200 px head start) and pauses when it
 * leaves. `enabled: false` (reduced motion) or the page-wide pause never starts it and pauses it if it was playing.
 * `preloadOnEnter` upgrades a `preload="none"` video to `auto` the first time it comes near.
 */
export function useInViewPlayback(
  ref: RefObject<HTMLVideoElement>,
  { enabled = true, preloadOnEnter = false }: { enabled?: boolean; preloadOnEnter?: boolean } = {},
) {
  const paused = useMotionPaused();
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!enabled || paused) {
      video.pause();
      return;
    }
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (preloadOnEnter) video.preload = "auto";
          void video.play()?.catch(() => undefined);
        } else video.pause();
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [ref, enabled, paused, preloadOnEnter]);
}
