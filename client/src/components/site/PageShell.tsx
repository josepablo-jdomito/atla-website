import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { MAIN_CONTENT_ID, SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ClientLogos } from "@/components/site/ClientLogos";

// The first page the visitor lands on paints as prerendered, with no fade (and no opacity 0 in the
// server HTML). Every page reached by navigating after that fades in: `.site-page` in site.css, a
// 200 ms CSS keyframe so the fade stays smooth while the new page's images decode (no framer-motion).
let landed = false;

export function PageShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [firstPaint] = useState(() => !landed);

  useEffect(() => {
    landed = true;
  }, []);

  return (
    <div className="site-root">
      <SiteHeader />
      <main id={MAIN_CONTENT_ID} className="site-main" tabIndex={-1}>
        <div key={location} className="site-page" data-first-paint={firstPaint ? "" : undefined}>
          {children}
        </div>
      </main>
      <ClientLogos />
      <SiteFooter />
    </div>
  );
}
