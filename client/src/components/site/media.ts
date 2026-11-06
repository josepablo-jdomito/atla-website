import { useEffect, type RefObject } from "react";

/**
 * React 18 warns on the camelCase `fetchPriority` prop; the lowercase attribute is what the browser reads.
 * Spread it onto an <img> that should win the network race: `{...(priority ? PRIORITY_ATTRS : null)}`.
 */
export const PRIORITY_ATTRS = { fetchpriority: "high" } as Record<string, string>;

/**
 * A muted inline video plays only while it is on screen (with a 200 px head start) and pauses when it
 * leaves. `enabled: false` (reduced motion) never starts it and pauses it if it was playing.
 * `preloadOnEnter` upgrades a `preload="none"` video to `auto` the first time it comes near.
 */
export function useInViewPlayback(
  ref: RefObject<HTMLVideoElement>,
  { enabled = true, preloadOnEnter = false }: { enabled?: boolean; preloadOnEnter?: boolean } = {},
) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!enabled) {
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
  }, [ref, enabled, preloadOnEnter]);
}
