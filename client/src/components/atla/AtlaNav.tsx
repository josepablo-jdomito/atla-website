import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const LEFT_NAV = ["Work", "About", "Services"];
const RIGHT_NAV = ["Journal", "Contact"];
const ALL_NAV = ["Work", "About", "Services", "Careers", "Journal", "Contact"];
const SOCIALS = ["Instagram", "Behance", "Linkedin", "Facebook"];

const NAV_LINK_STYLE: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "110%",
  color: "#222222",
  textDecoration: "none",
  whiteSpace: "nowrap",
  cursor: "pointer",
};

function ToggleModeIcons({ inverted = false }: { inverted?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 20,
        flexShrink: 0,
      }}
    >
      <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
        <img
          alt="Light mode"
          src="/figmaAssets/toggle-sun.png"
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
      <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
        <img
          alt="Dark mode"
          src="/figmaAssets/toggle-moon.png"
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
  );
}

function MobileMenuOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
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
      {/* Top bar: logo + close */}
      <div className="flex items-center justify-between px-5 h-[50px] shrink-0">
        <img
          alt="Atla Logo"
          src="/figmaAssets/logo.svg"
          className="h-5 object-contain invert brightness-200"
        />
        <button
          data-testid="button-close-menu"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#fafafa",
            fontFamily: "'Libre Franklin', Helvetica, sans-serif",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: 0.28,
            cursor: "pointer",
            padding: 0,
          }}
        >
          Close
        </button>
      </div>

      {/* Large nav links */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-5">
        {ALL_NAV.map((link) => (
          <a
            key={link}
            href="#"
            data-testid={`link-mobile-${link.toLowerCase()}`}
            style={{
              fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
              fontSize: 48,
              fontWeight: 400,
              lineHeight: "110%",
              color: "#fafafa",
              fontStyle: "italic",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            {link}
          </a>
        ))}
      </div>

      {/* Bottom row: socials | toggle icons + symbol */}
      <div className="flex items-end justify-between px-5 pb-5 shrink-0">
        <div className="flex flex-col gap-2">
          {SOCIALS.map((s) => (
            <a
              key={s}
              href="#"
              data-testid={`link-social-${s.toLowerCase()}`}
              style={{
                fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: 0.28,
                lineHeight: "110%",
                color: "#fafafa",
                textDecoration: "none",
              }}
            >
              {s}
            </a>
          ))}
        </div>
        <div className="flex flex-col items-end gap-4">
          <ToggleModeIcons inverted />
          <img
            alt="Atla Symbol"
            src="/figmaAssets/p-framer-text.svg"
            className="h-16 object-contain invert brightness-200"
          />
        </div>
      </div>
    </div>
  );
}

export function AtlaNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  return (
    <>
      <nav
        data-testid="atla-nav"
        className="flex w-full h-[50px] items-end justify-between px-[20px] py-0 relative"
      >
        {/* Desktop — left links: Work, About, Services */}
        <div className="hidden md:flex items-center gap-[14px] flex-[1_0_0] min-w-0">
          {LEFT_NAV.map((link) => (
            <a
              key={link}
              href="#"
              data-testid={`link-nav-${link.toLowerCase()}`}
              style={NAV_LINK_STYLE}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Mobile — hamburger trigger */}
        <div className="flex md:hidden items-center flex-[1_0_0]">
          <button
            data-testid="button-open-menu"
            onClick={() => setMenuOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <line x1="0" y1="1" x2="20" y2="1" stroke="#222" strokeWidth="1.5" />
              <line x1="0" y1="7" x2="20" y2="7" stroke="#222" strokeWidth="1.5" />
              <line x1="0" y1="13" x2="20" y2="13" stroke="#222" strokeWidth="1.5" />
            </svg>
            <span
              style={{
                fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: 0.28,
                lineHeight: "110%",
                color: "#222",
              }}
            >
              Menu
            </span>
          </button>
        </div>

        {/* Center — logo */}
        <div className="flex flex-[1_0_0] items-center justify-center min-w-0">
          <div style={{ position: "relative", width: 68, height: 28, flexShrink: 0 }}>
            <img
              alt="Atla"
              src="/figmaAssets/logo.svg"
              style={{
                position: "absolute",
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* Desktop — right links + toggle mode icons */}
        <div className="hidden md:flex items-end justify-end gap-[14px] flex-[1_0_0] min-w-0">
          {RIGHT_NAV.map((link) => (
            <a
              key={link}
              href="#"
              data-testid={`link-nav-${link.toLowerCase()}`}
              style={NAV_LINK_STYLE}
            >
              {link}
            </a>
          ))}
          <ToggleModeIcons />
        </div>

        {/* Mobile — right spacer */}
        <div className="flex md:hidden flex-[1_0_0]" />
      </nav>

      <MobileMenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
