import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { siteCopy } from "@/content/siteCopy";
import { focusablesIn, trapTab } from "@/components/site/focusTrap";

const { header } = siteCopy;

/** The id of PageShell's <main>, the skip link's target. */
export const MAIN_CONTENT_ID = "main";

/** localStorage key the toggle writes and /theme-init.js reads before the first paint. */
export const THEME_STORAGE_KEY = "atla-theme";
type Theme = "light" | "dark";

function systemTheme(): Theme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const set = document.documentElement.getAttribute("data-theme");
  return set === "dark" || set === "light" ? set : systemTheme();
}

/**
 * Light or dark. Default follows the system; a click stores the choice and sets data-theme on <html>,
 * which site.css reads. While nothing is stored, a system change is followed live.
 */
function useTheme() {
  // The prerender has no document: it paints light, then the effect settles the real value.
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    setTheme(currentTheme());
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!document.documentElement.hasAttribute("data-theme")) setTheme(systemTheme());
    };
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);
  const choose = (next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage blocked: the choice lasts for this page */
    }
    setTheme(next);
  };
  return [theme, choose] as const;
}

/** Sun and moon as drawn (toggle-sun.svg, toggle-moon.svg), one pressed at a time. */
function ThemeToggle({ theme, onChoose }: { theme: Theme; onChoose: (theme: Theme) => void }) {
  return (
    <div className="theme-toggle" role="group" aria-label={header.themeLabel}>
      <button
        type="button"
        className="theme-toggle__option"
        aria-label={header.themeLight}
        aria-pressed={theme === "light"}
        onClick={() => onChoose("light")}
      >
        <img src="/figmaAssets/v2/toggle-sun.svg" alt="" width={20} height={20} />
      </button>
      <button
        type="button"
        className="theme-toggle__option"
        aria-label={header.themeDark}
        aria-pressed={theme === "dark"}
        onClick={() => onChoose("dark")}
      >
        <img src="/figmaAssets/v2/toggle-moon.svg" alt="" width={20} height={20} />
      </button>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const [theme, chooseTheme] = useTheme();
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
      // Tab cycles through the sheet's controls and the Close button, never into the page behind.
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

  const allLinks = [...header.left, ...header.right];

  return (
    <header className="site-header">
      {/* First focusable element on every page: jumps past the nav to PageShell's <main id="main">. */}
      <a href={`#${MAIN_CONTENT_ID}`} className="site-skip-link">
        {header.skipLink}
      </a>
      <nav className="site-header__bar" aria-label={header.navLabel}>
        <div className="site-header__left">
          <ul className="site-header__links">
            {header.left.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="site-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/" className="site-header__brand" aria-label={header.homeLabel}>
          <span className="site-header__wordmark" aria-hidden="true" />
        </Link>
        <div className="site-header__right">
          <ul className="site-header__links">
            {header.right.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="site-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle theme={theme} onChoose={chooseTheme} />
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
        <ThemeToggle theme={theme} onChoose={chooseTheme} />
        <ul>
          {allLinks.map((link) => (
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
