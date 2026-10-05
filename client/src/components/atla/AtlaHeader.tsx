import { useEffect, useState } from "react";
import { AtlaWordmark } from "@/components/atla/AtlaMarks";
import { useIsMobile } from "@/hooks/use-mobile";

const HEADER_HEIGHT_DESKTOP = 64;
const HEADER_HEIGHT_MOBILE = 56;

const LINKS = [
  { label: "Work", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Journal", href: "/journal" },
] as const;

const CTA = { label: "Start a project", href: "/contact" } as const;

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/projects");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AtlaHeader({ inverted = false }: { inverted?: boolean }) {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pathname, setPathname] = useState("/");
  const height = isMobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT_DESKTOP;

  const surface = inverted ? "#111111" : "#fafafa";
  const ink = inverted ? "#f3f3ef" : "#1c1f27";
  const muted = inverted ? "rgba(243,243,239,0.62)" : "rgba(28,31,39,0.58)";
  const hairline = inverted ? "rgba(243,243,239,0.14)" : "rgba(28,31,39,0.12)";

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPathname(window.location.pathname);
    const sync = () => setIsScrolled(window.scrollY > 8);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMobile) setIsMenuOpen(false);
  }, [isMobile]);

  const ctaStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    minHeight: isMobile ? 36 : 40,
    padding: isMobile ? "0 14px" : "0 18px",
    borderRadius: 999,
    background: ink,
    color: surface,
    fontSize: isMobile ? 13 : 14,
    fontWeight: 500,
    letterSpacing: "-0.01em",
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  return (
    <>
      <div aria-hidden="true" style={{ height }} />
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
          borderBottom: `1px solid ${isScrolled || isMenuOpen ? hairline : "transparent"}`,
          transition: "border-color 200ms ease",
          fontFamily: "'Libre Franklin', Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            height: "100%",
            maxWidth: 1720,
            margin: "0 auto",
            padding: isMobile ? "0 12px" : "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <a href="/" aria-label="Atla, home" style={{ display: "block", width: isMobile ? 58 : 68, color: ink }}>
            <AtlaWordmark color={ink} title="Atla" style={{ width: "100%", height: "auto" }} />
          </a>

          {isMobile ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <a href={CTA.href} className="atla-header-cta" style={ctaStyle}>
                {CTA.label}
              </a>
              <button
                type="button"
                aria-expanded={isMenuOpen}
                aria-controls="atla-header-menu"
                onClick={() => setIsMenuOpen((open) => !open)}
                style={{
                  minHeight: 44,
                  minWidth: 56,
                  border: "none",
                  background: "transparent",
                  color: ink,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  padding: "0 4px",
                }}
              >
                {isMenuOpen ? "Close" : "Menu"}
              </button>
            </div>
          ) : (
            <nav aria-label="Main" style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <ul style={{ display: "flex", gap: 28, listStyle: "none", margin: 0, padding: 0 }}>
                {LINKS.map((link) => {
                  const active = isActive(link.href, pathname);
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className="atla-header-link"
                        style={{
                          color: active ? ink : muted,
                          fontSize: 14,
                          fontWeight: 500,
                          letterSpacing: "-0.01em",
                          textDecoration: "none",
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <a href={CTA.href} className="atla-header-cta" style={ctaStyle}>
                {CTA.label}
              </a>
            </nav>
          )}
        </div>

        {isMobile && isMenuOpen ? (
          <nav
            id="atla-header-menu"
            aria-label="Main"
            style={{
              position: "absolute",
              top: height,
              left: 0,
              right: 0,
              background: surface,
              borderBottom: `1px solid ${hairline}`,
              padding: "8px 12px 20px",
            }}
          >
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {LINKS.map((link) => {
                const active = isActive(link.href, pathname);
                return (
                  <li key={link.href} style={{ borderTop: `1px solid ${hairline}` }}>
                    <a
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      style={{
                        display: "block",
                        padding: "14px 0",
                        color: ink,
                        fontSize: 28,
                        letterSpacing: "-0.02em",
                        fontWeight: 500,
                        textDecoration: "none",
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </header>
    </>
  );
}
