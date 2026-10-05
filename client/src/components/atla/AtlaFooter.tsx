import { useEffect, useMemo, useState } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { AtlaSymbol, AtlaWordmark } from "@/components/atla/AtlaMarks";
import { useIsMobile } from "@/hooks/use-mobile";
import { SOCIAL_PROFILES } from "@shared/siteSeo";

const INK = "#1c1f27";
const SURFACE = "#f6c428";
const RULE = "rgba(28,31,39,0.55)";
const SOFT = "rgba(28,31,39,0.68)";

const CITIES = [
  { label: "Austin", timeZone: "America/Chicago" },
  { label: "Mexico City", timeZone: "America/Mexico_City" },
  { label: "Barcelona", timeZone: "Europe/Madrid" },
  { label: "Lima", timeZone: "America/Lima" },
  { label: "Caracas", timeZone: "America/Caracas" },
] as const;

const STUDIO_LINKS = [
  { label: "Work", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
] as const;

function getCityTimes() {
  return CITIES.map((city) => ({
    ...city,
    time: new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: city.timeZone,
    }).format(new Date()),
  }));
}

const LABEL: React.CSSProperties = {
  margin: "0 0 12px",
  fontFamily: "'Roboto Mono', monospace",
  fontSize: 12,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: SOFT,
};

const LINK: React.CSSProperties = {
  color: INK,
  textDecoration: "none",
  fontSize: 16,
  lineHeight: 1.9,
};

export function AtlaFooter() {
  const isMobile = useIsMobile();
  const [cityTimes, setCityTimes] = useState(getCityTimes);
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const timer = window.setInterval(() => setCityTimes(getCityTimes()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <footer
      className="atla-footer"
      style={{
        width: "100%",
        background: SURFACE,
        color: INK,
        fontFamily: "'Libre Franklin', Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1720,
          margin: "0 auto",
          padding: isMobile ? "56px 12px 16px" : "96px 20px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "flex-end",
            justifyContent: "space-between",
            gap: isMobile ? 28 : 40,
            paddingBottom: isMobile ? 40 : 72,
          }}
        >
          <p
            style={{
              margin: 0,
              maxWidth: 820,
              fontSize: isMobile ? 40 : "clamp(56px, 6vw, 92px)",
              lineHeight: 1,
              fontWeight: 500,
              letterSpacing: "-0.035em",
              textWrap: "balance",
            }}
          >
            When your brand has to change, start here.
          </p>
          <a
            href="/contact"
            className="atla-footer-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
              minHeight: 52,
              padding: "0 24px",
              borderRadius: 999,
              background: INK,
              color: SURFACE,
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              textDecoration: "none",
            }}
          >
            Start a project
            <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>

        <div
          style={{
            borderTop: `1px solid ${RULE}`,
            paddingTop: 28,
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr)) minmax(0, 1.4fr)",
            columnGap: isMobile ? 16 : 32,
            rowGap: 32,
          }}
        >
          <nav aria-label="Studio">
            <p style={LABEL}>Studio</p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {STUDIO_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="atla-footer-link" style={LINK}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p style={LABEL}>Follow</p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {SOCIAL_PROFILES.map((social) => (
                <li key={social.href}>
                  <a href={social.href} target="_blank" rel="noreferrer" className="atla-footer-link" style={LINK}>
                    {social.label === "Linkedin" ? "LinkedIn" : social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
            <p style={LABEL}>Offices</p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {cityTimes.map((city) => (
                <li
                  key={city.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    maxWidth: 240,
                    fontSize: 16,
                    lineHeight: 1.9,
                  }}
                >
                  <span>{city.label}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums", color: SOFT }}>{city.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {!isMobile ? (
            <div style={{ justifySelf: "end", alignSelf: "start", width: "min(100%, 260px)", aspectRatio: "1 / 1" }}>
              <AtlaSymbol color={INK} />
            </div>
          ) : null}
        </div>

        <div style={{ marginTop: isMobile ? 48 : 80 }}>
          <AtlaWordmark color={INK} style={{ width: "100%", height: "auto" }} />
        </div>

        <div
          style={{
            marginTop: isMobile ? 16 : 20,
            borderTop: `1px solid ${RULE}`,
            paddingTop: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 13,
            color: SOFT,
          }}
        >
          <span>© {year} Atla. All rights reserved.</span>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a href="/privacy" className="atla-footer-link" style={{ ...LINK, fontSize: 13, lineHeight: 1.4, color: SOFT }}>
              Privacy
            </a>
            <a href="/terms" className="atla-footer-link" style={{ ...LINK, fontSize: 13, lineHeight: 1.4, color: SOFT }}>
              Terms
            </a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="atla-footer-link"
              style={{ border: "none", background: "none", padding: 0, cursor: "pointer", color: SOFT, fontSize: 13, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              Back to top
              <ArrowUp size={13} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
