import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** useLayoutEffect warns during prerender; on the server there is nothing to lay out. */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Drives the build-on-scroll reveals.
 *
 * It reports `true` until it has armed itself, so the prerendered HTML and any
 * reader without JavaScript get the finished state rather than a page of
 * invisible text. Arming happens in a layout effect, before the first paint, so
 * there is no flash of the final state before the animation runs.
 *
 * It also reports `true` for good once the element scrolls in, and immediately
 * when the reader has asked for reduced motion.
 */
export function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T | null>(null);
  const [armed, setArmed] = useState(false);
  const [seen, setSeen] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    setArmed(true);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!armed || seen || !node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [armed, seen, threshold]);

  return { ref, inView: !armed || seen };
}

/** True when the reader has asked for reduced motion. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;
    setReduced(query.matches);
    const sync = () => setReduced(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}
