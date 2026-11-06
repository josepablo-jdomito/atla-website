import { useEffect, useState } from "react";
import { initialClientState } from "@/lib/hydration";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * True when the visitor asked for reduced motion. Prerender assumes reduced (nothing moves until the
 * client knows), and so does hydration, so the first client render matches the prerendered HTML.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => initialClientState(true, () => window.matchMedia(QUERY).matches));

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
