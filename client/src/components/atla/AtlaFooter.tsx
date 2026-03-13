import { useEffect, useState } from "react";

const LIBRE = "'Libre Franklin', Helvetica, sans-serif";

const NAV_LINKS = [
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
const OFFICES = [
  { city: "Austin, US", tz: "America/Chicago" },
  { city: "CDMX, MX", tz: "America/Mexico_City" },
  { city: "Caracas, VZ", tz: "America/Caracas" },
  { city: "Lima, PE", tz: "America/Lima" },
  { city: "Tijuana, MX", tz: "America/Tijuana" },
];

const FORMATTERS = Object.fromEntries(
  OFFICES.map(({ city, tz }) => [
    city,
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz,
    }),
  ])
);

function computeTimes() {
  const now = new Date();
  const result: Record<string, string> = {};
  OFFICES.forEach(({ city }) => { result[city] = FORMATTERS[city].format(now); });
  return result;
}

function useOfficeTimes() {
  const [times, setTimes] = useState<Record<string, string>>(computeTimes);
  useEffect(() => {
    const id = setInterval(() => setTimes(computeTimes()), 10000);
    return () => clearInterval(id);
  }, []);
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

  return (
    <footer
      data-testid="atla-footer"
      style={{
        backgroundColor: "#ffc629",
        width: "100%",
        minHeight: 750,
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
          gap: 48,
          alignItems: "flex-start",
          padding: 20,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
          {/* Left: columns + description */}
          <div style={{ flex: "1 0 0", display: "flex", flexDirection: "column", gap: 240, alignItems: "flex-start", minWidth: 0 }}>
            {/* Link columns */}
            <div style={{ display: "flex", gap: 72, alignItems: "flex-start", width: "100%", fontFamily: LIBRE, fontWeight: 500, fontSize: 14, color: "#222", letterSpacing: 0.28 }}>
              {/* Atla column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24, whiteSpace: "nowrap" }}>
                <p style={BOLD14}>Atla</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {NAV_LINKS.map((item) => (
                    <a key={item.label} href={item.href} data-testid={`link-footer-${item.label.toLowerCase()}`} style={MED14}>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Socials column */}
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
                      style={MED14}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Offices column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 140 }}>
                <p style={BOLD14}>Offices</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
                  {OFFICES.map(({ city }) => (
                    <div key={city} style={{ display: "flex", justifyContent: "space-between", width: "100%", whiteSpace: "nowrap" }}>
                      <p style={BOLD14}>{city}</p>
                      <p style={MED14}>{times[city]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ width: 320 }}>
              <p style={{ ...MED14, lineHeight: "1.1" }}>
                Atla is a design studio for brands across the US and Latin America.
                We build identities that communicate with clarity and purpose —
                from wordmarks to motion, packaging to web.
              </p>
            </div>
          </div>

          {/* Right: Atla symbol */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", alignSelf: "stretch", flexShrink: 0 }}>
            <img
              alt="Atla"
              src="/figmaAssets/atla-symbol.png"
              style={{ height: "100%", width: "auto", objectFit: "contain", display: "block" }}
            />
          </div>
        </div>

        {/* Bottom: divider + copyright */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end", width: "100%" }}>
          <div style={{ width: "100%", height: 1, backgroundColor: "#222" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <a
              href="#top"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              data-testid="link-back-to-top"
              style={{ ...SMALL, textDecoration: "none" }}
            >
              Back to top ↑
            </a>
            <p style={SMALL}>2026 Atla® All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
