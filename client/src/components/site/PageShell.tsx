import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const FADE = { duration: 0.2, ease: [0.23, 1, 0.32, 1] as const };

// The first page the visitor lands on paints as prerendered, with no fade (and no opacity 0 in the
// server HTML). Every page reached by navigating after that fades in.
let landed = false;

export function PageShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const reduced = useReducedMotion();
  const [fadeOnMount] = useState(() => landed);

  useEffect(() => {
    landed = true;
  }, []);

  return (
    <div className="site-root">
      <SiteHeader />
      <main id="main" className="site-main">
        <AnimatePresence initial={fadeOnMount && !reduced}>
          <motion.div
            key={location}
            className="site-page"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduced ? { duration: 0 } : FADE}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter />
    </div>
  );
}
