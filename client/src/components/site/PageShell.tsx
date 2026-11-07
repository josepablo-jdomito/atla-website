import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { siteCopy } from "@/content/siteCopy";
import { MAIN_CONTENT_ID, SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ClientLogos } from "@/components/site/ClientLogos";

// The first page the visitor lands on paints as prerendered, with no fade (and no opacity 0 in the
// server HTML). Every page reached by navigating after that fades in: `.site-page` in site.css, a
// 200 ms CSS keyframe so the fade stays smooth while the new page's images decode (no framer-motion).
let landed = false;

/**
 * `tail={false}` drops the logo band and the footer. No page uses it today: the home wall stops after
 * three passes and the footer comes out under it (JP, 2026-11-06).
 * `logos={false}` keeps the footer but not the client marks: the legal pages and the 404 are not a sales moment.
 */
export function PageShell({
  children,
  tail = true,
  logos = true,
  landing = false,
}: {
  children: ReactNode;
  tail?: boolean;
  logos?: boolean;
  /** A landing page: no logo band and the slim footer, so the page keeps its one door. */
  landing?: boolean;
}) {
  const [location] = useLocation();
  const [firstPaint] = useState(() => !landed);

  useEffect(() => {
    landed = true;
  }, []);

  // A route change puts keyboard and screen reader focus at the top of the new page's content, not on
  // <body> (keyboard walk F9). The landing paint keeps the browser's own start.
  // Pages mount their own shell, so a new page lands here on mount; a project to project move keeps the
  // shell and changes `location`.
  const mainRef = useRef<HTMLElement>(null);
  const previous = useRef<string | null>(firstPaint ? location : null);
  useEffect(() => {
    if (previous.current === location) return;
    previous.current = location;
    const active = document.activeElement;
    // A page that already placed focus inside itself (the brief's question heading) keeps it.
    if (active && active !== document.body && mainRef.current?.contains(active)) return;
    mainRef.current?.focus({ preventScroll: true });
  }, [location]);

  return (
    <div className="site-root">
      <SiteHeader />
      <main ref={mainRef} id={MAIN_CONTENT_ID} className="site-main" tabIndex={-1}>
        <div key={location} className="site-page" data-first-paint={firstPaint ? "" : undefined}>
          {children}
        </div>
      </main>
      {tail && logos && !landing ? <ClientLogos /> : null}
      {tail ? <SiteFooter slim={landing} /> : null}
    </div>
  );
}

/**
 * A page body while its content loads: the header and footer stay, the body is quiet rows in the
 * page's own rhythm (a title bar, a lead, a grid of blocks), so nothing jumps far when it arrives.
 */
export function PageSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="site-page-body site-skeleton" aria-busy="true">
      <p className="site-sr" role="status">
        {siteCopy.states.loading}
      </p>
      <div aria-hidden="true">
        <span className="site-skeleton__title" />
        <span className="site-skeleton__line" />
        <div className="site-skeleton__grid">
          {Array.from({ length: rows }, (_, index) => (
            <span key={index} className="site-skeleton__block" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** A page whose content failed to load: one line, Try again, and the way back to the work. */
export function PageError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="site-page-body site-error" role="alert">
      <h1 className="site-error__title">{siteCopy.states.error}</h1>
      <p className="site-error__actions">
        <button type="button" className="site-action site-error__action" onClick={onRetry}>
          {siteCopy.states.retry}
        </button>
        <Link href="/" className="site-text-button site-error__action">
          {siteCopy.states.home}
        </Link>
      </p>
    </div>
  );
}
