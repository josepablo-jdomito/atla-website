import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AtlaSymbol, AtlaWordmark, DarkModeGlyph, LightModeGlyph } from "@/components/atla/AtlaMarks";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { SOCIAL_PROFILES } from "@shared/siteSeo";

// Figma: Atla 🌐 / Web / Navbar (5489:6193) and the 390w menu (4546:3653).
const HEADER_HEIGHT_DESKTOP = 50;
const HEADER_HEIGHT_MOBILE = 40;
const FONT = "'Libre Franklin', Helvetica, sans-serif";

const LIGHT = { surface: "#fafafa", ink: "#222222", hairline: "rgba(34,34,34,0.12)" };
const DARK = { surface: "#111111", ink: "#f3f3ef", hairline: "rgba(243,243,239,0.14)" };

export type AtlaCta = { label: string; href: string; external?: boolean };

const WORK_HREF = "/";
const LEFT_LINKS = [
  { label: "Work", href: WORK_HREF },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
] as const;
const JOURNAL_LINK = { label: "Journal", href: "/journal" } as const;
const CONTACT: AtlaCta = { label: "Contact", href: "/contact" };

function isActive(href: string, pathname: string) {
  if (href === WORK_HREF) return pathname === "/" || pathname === "/work" || pathname.startsWith("/projects/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function externalProps(link: AtlaCta | { readonly label: string; readonly href: string }) {
  return "external" in link && link.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

/**
 * The bar is fixed, and a fixed element inside a filtered ancestor (the dark-mode
 * `.atla-dark-surface`) stops being fixed. On the client the bar is portaled to a
 * node that sits before #root, so it stays fixed, keeps its tab order first and
 * carries its own light/dark colors. The prerender has no document and renders it inline.
 */
function HeaderPortal({ children }: { children: ReactNode }) {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let node = document.getElementById("atla-header-root");
    if (!node) {
      node = document.createElement("div");
      node.id = "atla-header-root";
      const root = document.getElementById("root");
      document.body.insertBefore(node, root ?? document.body.firstChild);
    }
    setHost(node);
  }, []);

  if (typeof document === "undefined") return <>{children}</>;
  return host ? createPortal(children, host) : null;
}

/** Figma 5489:6137: a 26×16 pill switch. Knob right in light mode, as drawn. */
function ThemeSwitch({ ink, surface }: { ink: string; surface: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      onClick={toggleTheme}
      className="atla-theme-switch"
      style={{
        display: "inline-flex",
        alignItems: "flex-end",
        justifyContent: "center",
        height: 44,
        padding: "0 0 0 6px",
        margin: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "relative",
          display: "block",
          width: 26,
          height: 16.1,
          borderRadius: 8.05,
          background: ink,
        }}
      >
        <span
          className="atla-theme-switch-knob"
          style={{
            position: "absolute",
            top: 1.24,
            left: 0,
            width: 13.2,
            height: 13.2,
            borderRadius: "50%",
            background: surface,
            transform: `translateX(${isDark ? 1.65 : 11.14}px)`,
          }}
        />
      </span>
    </button>
  );
}

/** Figma 4548:4500: the menu's sun and moon squares. */
function ThemeSquares() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const square = (active: boolean): CSSProperties => ({
    width: 30,
    height: 30,
    padding: 5,
    border: "none",
    margin: 0,
    background: "transparent",
    cursor: "pointer",
    opacity: active ? 1 : 0.45,
    outline: active && isDark ? "1px solid rgba(250,250,250,0.6)" : undefined,
    outlineOffset: -1,
  });

  return (
    <div role="group" aria-label="Color theme" style={{ display: "flex", alignItems: "center", height: 44 }}>
      <button type="button" aria-pressed={!isDark} aria-label="Light mode" onClick={() => isDark && toggleTheme()} style={{ ...square(!isDark), background: "#fafafa" }}>
        <LightModeGlyph title="" />
      </button>
      <button type="button" aria-pressed={isDark} aria-label="Dark mode" onClick={() => !isDark && toggleTheme()} style={square(isDark)}>
        <DarkModeGlyph title="" />
      </button>
    </div>
  );
}

function MobileMenu({ onClose, pathname }: { onClose: () => void; pathname: string }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const links = [...LEFT_LINKS, JOURNAL_LINK, CONTACT];

  return (
    <div
      id="atla-header-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="atla-menu-panel"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        background: "#222222",
        color: "#fafafa",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          height: HEADER_HEIGHT_MOBILE,
          padding: "0 10px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <a href="/" aria-label="Atla, home" onClick={onClose} style={{ display: "block", width: 68, height: 28 }}>
          <AtlaWordmark color="#fafafa" title="Atla" />
        </a>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          style={{
            height: 44,
            minWidth: 44,
            padding: 0,
            border: "none",
            background: "transparent",
            color: "#fafafa",
            fontFamily: FONT,
            fontSize: 15,
            lineHeight: 1.1,
            display: "inline-flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>

      <div
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
          padding: "48px 10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 48,
        }}
      >
        <nav aria-label="Main">
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 24 }}>
            {links.map((link, index) => (
              <li key={link.href} className="atla-menu-item" style={{ ["--atla-delay" as string]: `${0.04 * index}s` }}>
                <a
                  href={link.href}
                  onClick={onClose}
                  aria-current={isActive(link.href, pathname) ? "page" : undefined}
                  {...externalProps(link)}
                  style={{ color: "#fafafa", fontSize: 32, lineHeight: 1.1, textDecoration: "none" }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ display: "flex", gap: 24, alignItems: "stretch" }}>
          <div style={{ flex: "1 0 0", display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
            {SOCIAL_PROFILES.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#fafafa", fontSize: 24, lineHeight: 1.1, textDecoration: "none" }}
              >
                {social.label === "Linkedin" ? "LinkedIn" : social.label}
              </a>
            ))}
            <ThemeSquares />
          </div>
          <div aria-hidden="true" style={{ flex: "1 0 0", display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
            <div style={{ height: "100%", maxHeight: 230, aspectRatio: "180 / 312" }}>
              <AtlaSymbol color="#8e8e8e" title="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AtlaHeader({
  inverted = false,
  cta = CONTACT,
  background,
}: {
  /** The page underneath is dark. */
  inverted?: boolean;
  /** The right-hand link; Contact unless a landing page routes elsewhere. */
  cta?: AtlaCta;
  /** Overrides the bar color so it matches the page underneath (light theme only). */
  background?: string;
}) {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pathname, setPathname] = useState("/");
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const height = isMobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT_DESKTOP;

  // Inverted pages sit inside the dark-mode filter, so dark mode flips them back to light.
  const isDarkBar = (theme === "dark") !== inverted;
  const palette = isDarkBar ? DARK : LIGHT;
  const surface = !isDarkBar && background ? background : palette.surface;
  const { ink, hairline } = palette;

  useEffect(() => {
    setPathname(window.location.pathname);
    const sync = () => setIsScrolled(window.scrollY > 8);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  useEffect(() => {
    if (!isMobile) setIsMenuOpen(false);
  }, [isMobile]);

  const linkStyle: CSSProperties = {
    color: ink,
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "0.28px",
    lineHeight: 1.1,
    textDecoration: "none",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "flex-end",
    height: 44,
  };

  const navLink = (link: { label: string; href: string; external?: boolean }) => (
    <li key={link.href}>
      <a
        href={link.href}
        aria-current={isActive(link.href, pathname) ? "page" : undefined}
        className="atla-header-link"
        {...externalProps(link)}
        style={linkStyle}
      >
        {link.label}
      </a>
    </li>
  );

  return (
    <>
      <div aria-hidden="true" style={{ height }} />
      <HeaderPortal>
        <header
          data-testid="atla-nav"
          className="atla-header"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            height,
            background: surface,
            color: ink,
            borderBottom: `1px solid ${isScrolled ? hairline : "transparent"}`,
            transition: "border-color 200ms ease, background-color 200ms ease",
            fontFamily: FONT,
          }}
        >
          {isMobile ? (
            <div
              style={{
                height: "100%",
                padding: "0 10px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <a href="/" aria-label="Atla, home" style={{ display: "block", width: 68, height: 28 }}>
                <AtlaWordmark color={ink} title="Atla" />
              </a>
              <button
                type="button"
                aria-expanded={isMenuOpen}
                aria-controls="atla-header-menu"
                onClick={() => setIsMenuOpen(true)}
                style={{
                  height: 44,
                  minWidth: 44,
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  color: ink,
                  fontFamily: FONT,
                  fontSize: 15,
                  lineHeight: 1.1,
                  display: "inline-flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  cursor: "pointer",
                }}
              >
                Menu
              </button>
            </div>
          ) : (
            <nav
              aria-label="Main"
              style={{
                height: "100%",
                maxWidth: 1720,
                margin: "0 auto",
                padding: "0 20px",
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
                columnGap: 20,
                alignItems: "end",
              }}
            >
              <ul style={{ display: "flex", gap: 14, listStyle: "none", margin: 0, padding: 0 }}>
                {LEFT_LINKS.map(navLink)}
              </ul>
              <a href="/" aria-label="Atla, home" style={{ display: "block", width: 68.2, height: 28 }}>
                <AtlaWordmark color={ink} title="Atla" />
              </a>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: 14 }}>
                <ul style={{ display: "flex", gap: 14, listStyle: "none", margin: 0, padding: 0 }}>
                  {navLink(JOURNAL_LINK)}
                  {navLink(cta)}
                </ul>
                <ThemeSwitch ink={ink} surface={surface} />
              </div>
            </nav>
          )}
        </header>
        {isMobile && isMenuOpen ? <MobileMenu onClose={closeMenu} pathname={pathname} /> : null}
      </HeaderPortal>
    </>
  );
}
