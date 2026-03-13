import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  { label: "Work", href: "#work" },
  { label: "About", href: "/about" },
  { label: "Services", href: "#services" },
];
const RIGHT_NAV = [
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];
const ALL_NAV = [
  { label: "Work", href: "#work" },
  { label: "About", href: "/about" },
  { label: "Services", href: "#services" },
  { label: "Careers", href: "#careers" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];
const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Behance", href: "https://behance.net" },
  { label: "Linkedin", href: "https://linkedin.com" },
  { label: "Facebook", href: "https://facebook.com" },
];

function ToggleModeIcons({ inverted = false }: { inverted?: boolean }) {
  const f = inverted ? "invert(1) brightness(2)" : "none";
  return (
    <div style={{ display: "flex", alignItems: "center", height: 20 }}>
      <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
        <img
          alt="Light mode"
          src="/figmaAssets/toggle-sun.png"
          style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", display: "block", filter: f }}
        />
      </div>
      <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
        <img
          alt="Dark mode"
          src="/figmaAssets/toggle-moon.png"
          style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", display: "block", filter: f }}
        />
      </div>
    </div>
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
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: "#222", fontFamily: "'Libre Franklin', Helvetica, sans-serif" }}
    >
      <div className="flex items-center justify-between px-5 shrink-0" style={{ height: 50 }}>
        <img
          alt="Atla"
          src="/figmaAssets/p-framer-text.png"
          style={{ height: 28, width: "auto", objectFit: "contain", filter: "invert(1) brightness(2)" }}
        />
        <button
          data-testid="button-close-menu"
          onClick={onClose}
          style={{ ...LF_MEDIUM, background: "none", border: "none", color: "#fafafa", padding: 0 }}
        >
          Close
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-5">
        {ALL_NAV.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={onClose}
            data-testid={`link-mobile-${link.label.toLowerCase()}`}
            style={{
              fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
              fontSize: 48,
              fontWeight: 400,
              lineHeight: "1.1",
              color: "#fafafa",
              fontStyle: "italic",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex items-end justify-between px-5 pb-5 shrink-0">
        <div className="flex flex-col gap-2">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`link-social-${s.label.toLowerCase()}`}
              style={{ ...LF_MEDIUM, color: "#fafafa" }}
            >
              {s.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col items-end gap-4">
          <ToggleModeIcons inverted />
          <img
            alt="Atla"
            src="/figmaAssets/p-framer-text.png"
            style={{ height: 28, width: "auto", objectFit: "contain", filter: "invert(1) brightness(2)" }}
          />
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
        style={{
          display: "flex",
          width: "100%",
          height: 50,
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "0 20px",
          flexShrink: 0,
          boxSizing: "border-box",
        }}
      >
        {/* Desktop — left links */}
        <div className="hidden md:flex" style={{ flex: "1 0 0", display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          {LEFT_NAV.map((link) => (
            <a key={link.label} href={link.href} data-testid={`link-nav-${link.label.toLowerCase()}`} style={linkStyle}>
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile — hamburger */}
        <div className="flex md:hidden" style={{ flex: "1 0 0", alignItems: "center" }}>
          <button
            data-testid="button-open-menu"
            onClick={() => setMenuOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 6 }}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <line x1="0" y1="1" x2="20" y2="1" stroke={inverted ? "#fafafa" : "#222"} strokeWidth="1.5" />
              <line x1="0" y1="7" x2="20" y2="7" stroke={inverted ? "#fafafa" : "#222"} strokeWidth="1.5" />
              <line x1="0" y1="13" x2="20" y2="13" stroke={inverted ? "#fafafa" : "#222"} strokeWidth="1.5" />
            </svg>
            <span style={{ ...LF_MEDIUM, color: inverted ? "#fafafa" : "#222" }}>Menu</span>
          </button>
        </div>

        {/* Center — logo */}
        <div style={{ flex: "1 0 0", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
          <div style={{ position: "relative", width: 68.195, height: 28, flexShrink: 0 }}>
            <img
              alt="Atla"
              src="/figmaAssets/p-framer-text.png"
              style={{
                position: "absolute",
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: inverted ? "invert(1) brightness(2)" : "none",
              }}
            />
          </div>
        </div>

        {/* Desktop — right links + toggle */}
        <div className="hidden md:flex" style={{ flex: "1 0 0", alignItems: "flex-end", justifyContent: "flex-end", gap: 14, minWidth: 0 }}>
          {RIGHT_NAV.map((link) => (
            <a key={link.label} href={link.href} data-testid={`link-nav-${link.label.toLowerCase()}`} style={linkStyle}>
              {link.label}
            </a>
          ))}
          <ToggleModeIcons inverted={inverted} />
        </div>

        {/* Mobile — right spacer */}
        <div className="flex md:hidden" style={{ flex: "1 0 0" }} />
      </nav>

      <MobileMenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
