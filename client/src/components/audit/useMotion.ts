import { useEffect, type RefObject } from "react";

/**
 * Motion for the audit landing (JP, 2026-11-07: "add motion to the illustrations and to the lp").
 * Everything is CSS (site.css, the `.audit[data-motion]` rules); this hook only turns it on after
 * hydration and marks what scrolled into view:
 * - `data-motion` on the root once the page is live, so the prerender and reduced motion show
 *   everything still and in place;
 * - `data-in` on every `[data-reveal]` element the first time a sixth of it is on screen, in
 *   document order, so a row of steps comes in one after the other.
 */
export function useAuditMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    node.setAttribute("data-motion", "");

    const targets = Array.from(node.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!targets.length || typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.setAttribute("data-in", ""));
      return () => node.removeAttribute("data-motion");
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      node.removeAttribute("data-motion");
    };
  }, [root]);
}
