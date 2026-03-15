import { useEffect, useMemo, useState } from "react";
import { AtlaSymbol } from "@/components/atla/AtlaMarks";
import { useIsMobile } from "@/hooks/use-mobile";

const LIBRE = "'Libre Franklin', Helvetica, sans-serif";

const NAV_LINKS = [
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
const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;
const OFFICES = [
  { city: "Austin, US", tz: "America/Chicago" },
  { city: "CDMX, MX", tz: "America/Mexico_City" },
  { city: "Caracas, VZ", tz: "America/Caracas" },
  { city: "Lima, PE", tz: "America/Lima" },
  { city: "Tijuana, MX", tz: "America/Tijuana" },
] as const;

function createTimeFormatter(timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  });
}

function computeTimes(formatters: Record<string, Intl.DateTimeFormat>, now = new Date()) {
  const result: Record<string, string> = {};
  OFFICES.forEach(({ city }) => {
    result[city] = formatters[city].format(now);
  });
  return result;
}

function useOfficeTimes() {
  const formatters = useMemo(
    () =>
      Object.fromEntries(
        OFFICES.map(({ city, tz }) => [city, createTimeFormatter(tz)]),
      ) as Record<string, Intl.DateTimeFormat>,
    [],
  );
  const [times, setTimes] = useState<Record<string, string>>(() => computeTimes(formatters));

  useEffect(() => {
    const syncTimes = () => setTimes(computeTimes(formatters));
    syncTimes();
    const intervalId = window.setInterval(syncTimes, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [formatters]);

  return times;
}

const BOLD14: React.CSSProperties = {
  fontFamily: LIBRE,
  fontSize: 14,
  fontWeight: 700,
  lineHeight: "1.1",
  margin: 0,
  color: "#222",
};
const MED14: React.CSSProperties = {
  fontFamily: LIBRE,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "1.1",
  margin: 0,
  color: "#222",
  textDecoration: "none",
};
const SMALL: React.CSSProperties = {
  fontFamily: LIBRE,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.48,
  lineHeight: "1.2",
  color: "#222",
  textTransform: "uppercase",
  margin: 0,
};

export function AtlaFooter() {
  const times = useOfficeTimes();
  const isMobile = useIsMobile();

  return (
    <footer
      data-testid="atla-footer"
      className="atla-theme-preserve"
      style={{
        backgroundColor: "#ffc629",
        width: "100%",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 24 : 48,
          alignItems: "flex-start",
          padding: isMobile ? "80px 20px 20px" : 20,
          width: "100%",
          boxSizing: "border-box",
          minHeight: isMobile ? 780 : undefined,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%", flex: isMobile ? "1 0 auto" : undefined }}>
          <div style={{ flex: "1 0 0", display: "flex", flexDirection: "column", gap: isMobile ? 64 : 240, alignItems: "flex-start", minWidth: 0 }}>
            {!isMobile && (
              <div style={{ display: "flex", gap: 72, alignItems: "flex-start", width: "100%", fontFamily: LIBRE, fontWeight: 500, fontSize: 14, color: "#222", letterSpacing: 0.28 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 24, whiteSpace: "nowrap" }}>
                  <p style={BOLD14}>Atla</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {NAV_LINKS.map((item) => (
                      <a key={item.label} href={item.href} data-testid={`link-footer-${item.label.toLowerCase()}`} className="atla-link" style={MED14}>
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 24, whiteSpace: "nowrap" }}>
                  <p style={BOLD14}>Socials</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {SOCIALS.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`link-footer-${item.label.toLowerCase()}`}
                        className="atla-link"
                        style={MED14}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 208 }}>
                  <p style={BOLD14}>Offices</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
                    {OFFICES.map(({ city, tz }) => (
                      <div key={city} style={{ display: "grid", gridTemplateColumns: "1fr auto", columnGap: 16, alignItems: "baseline", width: "100%" }}>
                        <p style={{ ...BOLD14, textAlign: "left", whiteSpace: "nowrap" }}>{city}</p>
                        <p className="atla-time" style={{ ...MED14, textAlign: "right", whiteSpace: "nowrap" }} data-testid={`office-time-${city.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} title={tz}>
                          {times[city]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isMobile && (
              <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <div style={{ color: "#222", width: 180, height: 312 }}>
                  <AtlaSymbol className="atla-symbol-float" />
                </div>
              </div>
            )}

            {isMobile && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, width: "100%", alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
                  <p style={{ ...BOLD14, fontSize: 12 }}>Atla</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {NAV_LINKS.map((item) => (
                      <a key={item.label} href={item.href} data-testid={`link-footer-${item.label.toLowerCase()}`} className="atla-link" style={{ ...MED14, fontSize: 12 }}>
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
                  <p style={{ ...BOLD14, fontSize: 12 }}>Socials</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {SOCIALS.map((item) => (
                      <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" data-testid={`link-footer-${item.label.toLowerCase()}`} className="atla-link" style={{ ...MED14, fontSize: 12 }}>
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
                  <p style={{ ...BOLD14, fontSize: 12 }}>Offices</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
                    {OFFICES.map(({ city, tz }) => (
                      <div key={city} style={{ display: "grid", gridTemplateColumns: "1fr auto", columnGap: 12, width: "100%", alignItems: "baseline" }}>
                        <p style={{ ...BOLD14, fontSize: 12, textAlign: "left", whiteSpace: "nowrap" }}>{city}</p>
                        <p className="atla-time" style={{ ...MED14, fontSize: 12, textAlign: "right", whiteSpace: "nowrap" }} data-testid={`office-time-${city.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} title={tz}>
                          {times[city]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={{ width: isMobile ? "100%" : 320 }}>
              <p style={{ ...MED14, fontSize: isMobile ? 12 : 14, lineHeight: "1.1" }}>
                Atla is a design studio for brands across the US and Latin America. We build identities that communicate with clarity and purpose, from wordmarks to motion, packaging to web.
              </p>
            </div>
          </div>

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", alignSelf: "stretch", flexShrink: 0, color: "#222", width: 232 }}>
              <AtlaSymbol className="atla-symbol-float" />
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end", width: "100%" }}>
          <div style={{ width: "100%", height: 1, backgroundColor: "#222" }} />
          <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", width: "100%", gap: 16, flexDirection: isMobile ? "column" : "row" }}>
            <a
              href="#top"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              data-testid="link-back-to-top"
              className="atla-link"
              style={{ ...SMALL, textDecoration: "none" }}
            >
              Back to top ↑
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", justifyContent: isMobile ? "flex-start" : "flex-end" }}>
              {LEGAL_LINKS.map((link) => (
                <a key={link.label} href={link.href} className="atla-link" style={{ ...SMALL, textDecoration: "none" }}>
                  {link.label}
                </a>
              ))}
              <p style={{ ...SMALL, textAlign: "right" }}>2026 Atla® All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
