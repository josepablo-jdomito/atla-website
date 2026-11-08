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

    // What is already on screen (the prerender painted it) stays put: only what is below comes in later.
    const targets = Array.from(node.querySelectorAll<HTMLElement>("[data-reveal]"));
    const height = window.innerHeight || document.documentElement.clientHeight;
    for (const el of targets) if (el.getBoundingClientRect().top < height) el.setAttribute("data-in", "");
    node.setAttribute("data-motion", "");
    if (!targets.length || typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.setAttribute("data-in", ""));
      return () => node.removeAttribute("data-motion");
    }
    // Belt and braces: the observer marks what comes into view; a scroll or resize check does the same
    // from the boxes, so nothing can stay hidden if the observer is slow or throttled in a background tab.
    const pending = new Set(targets.filter((el) => !el.hasAttribute("data-in")));
    const reveal = (el: Element) => {
      el.setAttribute("data-in", "");
      pending.delete(el as HTMLElement);
      observer.unobserve(el);
    };
    const check = () => {
      const h = window.innerHeight || document.documentElement.clientHeight;
      for (const el of Array.from(pending)) if (el.getBoundingClientRect().top < h * 0.92) reveal(el);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    pending.forEach((el) => observer.observe(el));
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const settle = window.setTimeout(check, 400);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      window.clearTimeout(settle);
      node.removeAttribute("data-motion");
    };
  }, [root]);
}
