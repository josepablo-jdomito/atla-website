import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { AtlaWordmark } from "@/components/atla/AtlaMarks";
import { siteCopy } from "@/content/siteCopy";

const { header } = siteCopy;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
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
          <Link href={header.cta.href} className="site-pill">
            {header.cta.label}
          </Link>
        </div>
      </nav>
      <div id="site-menu-sheet" className="site-sheet" data-open={open} hidden={!open}>
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
