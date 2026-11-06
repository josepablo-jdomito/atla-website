import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { AtlaWordmark } from "@/components/atla/AtlaMarks";
import { siteCopy } from "@/content/siteCopy";
import { focusablesIn, trapTab } from "@/components/site/focusTrap";

const { header } = siteCopy;

/** The id of PageShell's <main>, the skip link's target. */
export const MAIN_CONTENT_ID = "main";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [location]);

  // The sheet only exists below 768 px. Crossing that width closes it, so the body scroll lock
  // (below) is released and nothing invisible is left open on a desktop.
  useEffect(() => {
    if (!open || typeof window.matchMedia !== "function") return;
    const wide = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (wide.matches) setOpen(false);
    };
    onChange();
    wide.addEventListener?.("change", onChange);
    return () => wide.removeEventListener?.("change", onChange);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      // Tab cycles through the sheet's links and the Close button, never into the page behind.
      if (event.key === "Tab") {
        const button = buttonRef.current;
        trapTab(event, button ? [button, ...focusablesIn(sheetRef.current)] : focusablesIn(sheetRef.current));
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="site-header">
      {/* First focusable element on every page: jumps past the nav to PageShell's <main id="main">. */}
      <a href={`#${MAIN_CONTENT_ID}`} className="site-skip-link">
        {header.skipLink}
      </a>
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
            aria-expanded={open}
            aria-controls="site-menu-sheet"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? header.menuClose : header.menuOpen}
          </button>
        </div>
        <Link href="/" className="site-header__brand" aria-label={header.homeLabel}>
          <AtlaWordmark title="Atla" style={{ width: "100%", height: "auto" }} />
        </Link>
        <div className="site-header__right">
          <Link href={header.cta.href} className="site-link site-header__cta">
            {header.cta.label}
          </Link>
        </div>
      </nav>
      <div
        ref={sheetRef}
        id="site-menu-sheet"
        role="dialog"
        aria-label={header.menuOpen}
        className="site-sheet"
        data-open={open}
        hidden={!open}
      >
        <ul>
          {header.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="site-sheet__link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
