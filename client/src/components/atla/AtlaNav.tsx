import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AtlaSymbol, AtlaWordmark, DarkModeGlyph, LightModeGlyph } from "@/components/atla/AtlaMarks";
import { useTheme } from "@/components/theme/ThemeProvider";

const LF_MEDIUM: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "1.1",
  color: "#222",
  textDecoration: "none",
  whiteSpace: "nowrap",
  cursor: "pointer",
};

const LEFT_NAV = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
];
const RIGHT_NAV = [
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/about#contact" },
];
const ALL_NAV = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Careers", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/about#contact" },
];
const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Behance", href: "https://behance.net" },
  { label: "Linkedin", href: "https://linkedin.com" },
  { label: "Facebook", href: "https://facebook.com" },
];

function ToggleModeIcons({ inverted = false }: { inverted?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      data-testid="button-toggle-theme"
      className="atla-link"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        height: 20,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
    >
      <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0, opacity: isDark ? 0.55 : 1 }}>
        <LightModeGlyph style={{ position: "absolute", inset: 0 }} />
      </div>
      <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0, opacity: isDark ? 1 : inverted ? 0.92 : 0.55 }}>
        <DarkModeGlyph style={{ position: "absolute", inset: 0 }} />
      </div>
    </button>
  );
}

function MobileMenuOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      data-testid="mobile-menu-overlay"
      className="fixed inset-0 z-50 flex flex-col atla-menu-panel"
      style={{ backgroundColor: "#222", fontFamily: "'Libre Franklin', Helvetica, sans-serif" }}
    >
      <div className="flex items-end justify-between shrink-0" style={{ height: 40, padding: "0 10px" }}>
        <div style={{ color: "#fafafa", width: 108, height: 18 }}>
          <AtlaWordmark />
        </div>
        <button
          data-testid="button-close-menu"
          onClick={onClose}
          style={{ ...LF_MEDIUM, fontSize: 12, background: "none", border: "none", color: "#fafafa", padding: 0 }}
        >
          Close
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center" style={{ padding: "40px 10px 20px" }}>
        {ALL_NAV.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={onClose}
            data-testid={`link-mobile-${link.label.toLowerCase()}`}
            className="atla-menu-item"
            style={{
              fontFamily: "'Libre Franklin', Helvetica, sans-serif",
              fontSize: 32,
              fontWeight: 400,
              lineHeight: "1.1",
              color: "#fafafa",
              textAlign: "left",
              textDecoration: "none",
              paddingBottom: 24,
              ["--atla-delay" as string]: `${0.06 * (ALL_NAV.indexOf(link) + 1)}s`,
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex items-end justify-between shrink-0" style={{ padding: "0 10px 10px" }}>
        <div className="flex flex-col gap-2">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`link-social-${s.label.toLowerCase()}`}
              className="atla-link"
              style={{ ...LF_MEDIUM, color: "#fafafa" }}
            >
              {s.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col items-end gap-6">
          <ToggleModeIcons inverted />
          <div style={{ color: "#fafafa", width: 66, height: 116 }}>
            <AtlaSymbol />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AtlaNav({ inverted = false }: { inverted?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  const linkStyle: React.CSSProperties = {
    ...LF_MEDIUM,
    color: inverted ? "#fafafa" : "#222",
  };

  return (
    <>
      <nav
        data-testid="atla-nav"
        className="atla-enter"
        style={{
          display: "flex",
          width: "100%",
          height: isMobile ? 40 : 50,
          position: "relative",
          zIndex: 20,
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: isMobile ? "0 10px" : "0 20px",
          flexShrink: 0,
          boxSizing: "border-box",
        }}
      >
        {!isMobile ? (
          <div style={{ flex: "1 0 0", display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
            {LEFT_NAV.map((link) => (
              <a key={link.label} href={link.href} data-testid={`link-nav-${link.label.toLowerCase()}`} className="atla-link" style={linkStyle}>
                {link.label}
              </a>
            ))}
          </div>
        ) : (
          <div style={{ flex: "1 0 0", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
            <a
              href="/"
              aria-label="Atla home"
              className="atla-logo"
              style={{
                color: inverted ? "#fafafa" : "#222",
                width: 108,
                height: 18,
                flexShrink: 0,
                display: "block",
              }}
            >
              <AtlaWordmark />
            </a>
          </div>
        )}

        {!isMobile ? (
          <div style={{ flex: "1 0 0", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
            <a
              href="/"
              aria-label="Atla home"
              className="atla-logo"
              style={{
                color: inverted ? "#fafafa" : "#222",
                width: 244,
                height: 18,
                flexShrink: 0,
                display: "block",
              }}
            >
              <AtlaWordmark />
            </a>
          </div>
        ) : (
          <div style={{ flex: "1 0 0", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <button
              data-testid="button-open-menu"
              onClick={() => setMenuOpen(true)}
              className="atla-link"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 6 }}
            >
              <span style={{ ...LF_MEDIUM, fontSize: 12, color: inverted ? "#fafafa" : "#222" }}>Menu</span>
            </button>
          </div>
        )}

        {!isMobile && (
          <div style={{ flex: "1 0 0", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: 14, minWidth: 0 }}>
            {RIGHT_NAV.map((link) => (
              <a key={link.label} href={link.href} data-testid={`link-nav-${link.label.toLowerCase()}`} className="atla-link" style={linkStyle}>
                {link.label}
              </a>
            ))}
            <ToggleModeIcons inverted={inverted} />
          </div>
        )}
      </nav>

      <MobileMenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
