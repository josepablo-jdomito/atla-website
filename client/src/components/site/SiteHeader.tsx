import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { AtlaWordmark } from "@/components/atla/AtlaMarks";
import { siteCopy } from "@/content/siteCopy";
import { focusablesIn, trapTab } from "@/components/site/focusTrap";
import { useSiteProjects } from "@/components/site/siteProjects";
import { menuThumbs } from "@/components/site/menuThumbs";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getOptimizedImageUrl } from "@shared/imageDelivery";

const { header, menu } = siteCopy;

/**
 * Routes that are landing pages: no site links, no phone menu, the wordmark and one action that jumps
 * to the page's form (a landing has one door; the site nav would be a leak, CRO review 2026-11-07).
 */
const LANDING_HEADERS: Record<string, { label: string; target: string }> = {
  "/audit": { label: siteCopy.audit.cta, target: "send" },
};

/** The id of PageShell's <main>, the skip link's target. */
export const MAIN_CONTENT_ID = "main";

/** The Explore field's id, the second skip link's target (home only; the pill lives on the wall). */
export const EXPLORE_FIELD_ID = "explore-field";

/** How long the card takes to leave (site.css `site-menu-out`). */
export const MENU_CLOSE_MS = 160;

/** The Services row shows the cover beside Strategy on /services; Ventures shows a venture's project. */
const SERVICES_SLUG = (siteCopy.services.disciplines[0] as { project?: string } | undefined)?.project;
const VENTURE_SLUGS = siteCopy.ventures.items
  .map((item) => /^\/projects\/([^/?#]+)/.exec(item.href ?? "")?.[1])
  .filter((slug): slug is string => Boolean(slug));

/** Work owns the home and every project page; the other links own their path and what sits under it. */
export function isCurrentRoute(href: string, location: string) {
  if (href === "/") return location === "/" || location.startsWith("/projects/");
  return location === href || location.startsWith(`${href}/`);
}

type Phase = "closed" | "open" | "closing";

/**
 * The rows: a picture and the page name. Mounted only while the card shows, so the project list behind
 * the thumbnails is fetched when the menu opens, never on page load (perf-frontend 4).
 */
function MenuRows({ seed, location, onPick }: { seed: number; location: string; onPick: () => void }) {
  const { projects } = useSiteProjects();
  const thumbs = useMemo(
    () => menuThumbs(projects, seed, { services: SERVICES_SLUG, ventures: VENTURE_SLUGS }),
    [projects, seed],
  );
  return (
    <ul className="site-sheet__rows">
      {header.sheetLinks.map((link, index) => {
        const src = thumbs[link.href];
        return (
          <li key={link.href} style={{ ["--i" as string]: index }}>
            <Link
              href={link.href}
              className="site-sheet__link"
              aria-current={isCurrentRoute(link.href, location) ? "page" : undefined}
              onClick={onPick}
            >
              <span className="site-sheet__thumb" aria-hidden="true">
                {src ? (
                  <img src={getOptimizedImageUrl(src, { width: 240, quality: 80 }) || src} alt="" decoding="async" />
                ) : null}
              </span>
              <span className="site-sheet__label">{link.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function SiteHeader() {
  const [phase, setPhase] = useState<Phase>("closed");
  // A new seed on every open deals new pictures; it holds still while the card is open.
  const [seed, setSeed] = useState(0);
  const [location] = useLocation();
  const reduced = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number>();
  const shown = phase !== "closed";

  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setSeed((Date.now() % 2147483646) + 1);
    setPhase("open");
  };
  /** Reverses the entrance in 160 ms, then focus goes back to the Menu button. Instant under reduced motion. */
  const closeMenu = () => {
    window.clearTimeout(closeTimer.current);
    const finish = () => {
      setPhase("closed");
      buttonRef.current?.focus();
    };
    if (reduced) return finish();
    setPhase("closing");
    closeTimer.current = window.setTimeout(finish, MENU_CLOSE_MS);
  };

  // A route change swaps the page under the card: it goes at once.
  useEffect(() => {
    window.clearTimeout(closeTimer.current);
    setPhase("closed");
  }, [location]);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // The card only opens below 768 px. Crossing that width closes it, so the scroll lock is released.
  useEffect(() => {
    if (!shown || typeof window.matchMedia !== "function") return;
    const wide = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (wide.matches) setPhase("closed");
    };
    onChange();
    wide.addEventListener?.("change", onChange);
    return () => wide.removeEventListener?.("change", onChange);
  }, [shown]);

  useEffect(() => {
    if (phase === "open") sheetRef.current?.querySelector<HTMLElement>(".site-sheet__link")?.focus();
  }, [phase]);

  useEffect(() => {
    if (!shown) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
      // Tab cycles through the card (Close, the rows, the bottom bar), never into the page behind.
      if (event.key === "Tab") trapTab(event, sheetRef.current);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // The Explore pill is portaled to <body>; this flag lets the stylesheet hide it under the open menu.
    document.documentElement.setAttribute("data-menu", "open");
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      document.documentElement.removeAttribute("data-menu");
    };
    // closeMenu reads `reduced`; re-binding on it keeps Escape's timing right.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, reduced]);

  const landing = LANDING_HEADERS[location];
  if (landing) {
    return (
      <header className="site-header site-header--landing">
        <a href={`#${MAIN_CONTENT_ID}`} className="site-skip-link">
          {header.skipLink}
        </a>
        <nav className="site-header__bar" aria-label={header.navLabel}>
          <div className="site-header__left" />
          <Link href="/" className="site-header__brand" aria-label={header.homeLabel}>
            <AtlaWordmark title="Atla" style={{ width: "100%", height: "auto" }} />
          </Link>
          <div className="site-header__right">
            <a
              href={`#${landing.target}`}
              className="audit-submit audit-submit--compact site-header__cta"
              onClick={(event) => {
                const form = document.getElementById(landing.target);
                if (!form) return;
                event.preventDefault();
                const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                form.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
                form.querySelector<HTMLInputElement>("input:not([type=hidden])")?.focus({ preventScroll: true });
              }}
            >
              {landing.label}
            </a>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="site-header">
      {/* First focusable element on every page: jumps past the nav to PageShell's <main id="main">. */}
      <a href={`#${MAIN_CONTENT_ID}`} className="site-skip-link">
        {header.skipLink}
      </a>
      {/* Home only: the second stop goes straight to the Explore field (keyboard walk F6: it was 72 Tabs away). */}
      {location === "/" ? (
        <a
          href={`#${EXPLORE_FIELD_ID}`}
          className="site-skip-link"
          onClick={(event) => {
            const field = document.getElementById(EXPLORE_FIELD_ID);
            if (!field) return;
            event.preventDefault();
            field.focus();
          }}
        >
          {header.skipSearch}
        </a>
      ) : null}
      <nav className="site-header__bar" aria-label={header.navLabel}>
        <div className="site-header__left">
          <ul className="site-header__links">
            {header.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="site-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            ref={buttonRef}
            type="button"
            className="site-header__menu site-link"
            aria-expanded={phase === "open"}
            aria-controls="site-menu-sheet"
            onClick={() => (phase === "open" ? closeMenu() : openMenu())}
          >
            {header.menuOpen}
          </button>
        </div>
        <Link href="/" className="site-header__brand" aria-label={header.homeLabel}>
          <AtlaWordmark title="Atla" style={{ width: "100%", height: "auto" }} />
        </Link>
        <div className="site-header__right">
          <Link href={header.cta.href} className="site-action site-header__cta">
            {header.cta.label}
          </Link>
        </div>
      </nav>
      <div
        ref={sheetRef}
        id="site-menu-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={header.menuOpen}
        className="site-sheet"
        data-state={phase}
        hidden={!shown}
      >
        {/* The page behind stays in view, dimmed and blurred; a tap on it closes the menu. */}
        <div className="site-sheet__backdrop" aria-hidden="true" onClick={closeMenu} />
        <div className="site-sheet__card">
          <div className="site-sheet__top">
            <button type="button" className="site-sheet__close" aria-label={menu.closeLabel} onClick={closeMenu}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav aria-label={menu.navLabel}>
            {shown ? <MenuRows seed={seed} location={location} onPick={() => setPhase("closed")} /> : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
