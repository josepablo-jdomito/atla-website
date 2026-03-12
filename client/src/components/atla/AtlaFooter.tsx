import { useEffect, useState } from "react";

const LIBRE = "'Libre Franklin', Helvetica, sans-serif";

const NAV_LINKS = ["Work", "About", "Services", "Careers", "Journal", "Contact"];
const SOCIALS = ["Instagram", "Behance", "Linkedin", "Facebook"];

const OFFICES = [
  { city: "Austin, US", tz: "America/Chicago" },
  { city: "CDMX, MX", tz: "America/Mexico_City" },
  { city: "Caracas, VZ", tz: "America/Caracas" },
  { city: "Lima, PE", tz: "America/Lima" },
  { city: "Tijuana, MX", tz: "America/Tijuana" },
];

function useOfficeTimes() {
  const [times, setTimes] = useState<Record<string, string>>({});

  function compute() {
    const now = new Date();
    const result: Record<string, string> = {};
    OFFICES.forEach(({ city, tz }) => {
      result[city] = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: tz,
      }).format(now);
    });
    return result;
  }

  useEffect(() => {
    setTimes(compute());
    const id = setInterval(() => setTimes(compute()), 10000);
    return () => clearInterval(id);
  }, []);

  return times;
}

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
        fontFamily: LIBRE,
      }}
    >
      {/* Inner content */}
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
        {/* Top row: columns + Atla symbol */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Left: link columns + description */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 240,
              alignItems: "flex-start",
            }}
          >
            {/* Three columns */}
            <div
              style={{
                display: "flex",
                gap: 72,
                alignItems: "flex-start",
                color: "#222",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: 0.28,
                width: "100%",
              }}
            >
              {/* Atla column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24, whiteSpace: "nowrap" }}>
                <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>Atla</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {NAV_LINKS.map((item) => (
                    <p key={item} style={{ fontSize: 14, lineHeight: "110%", margin: 0 }}>{item}</p>
                  ))}
                </div>
              </div>

              {/* Socials column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24, whiteSpace: "nowrap" }}>
                <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>Socials</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {SOCIALS.map((item) => (
                    <p key={item} style={{ fontSize: 14, lineHeight: "110%", margin: 0 }}>{item}</p>
                  ))}
                </div>
              </div>

              {/* Offices column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 140 }}>
                <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>Offices</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
                  {OFFICES.map(({ city }) => (
                    <div key={city} style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0, whiteSpace: "nowrap" }}>
                        {city}
                      </p>
                      <p style={{ fontSize: 14, lineHeight: "110%", margin: 0 }}>
                        {times[city] ?? "--:--"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description text */}
            <div style={{ width: 320 }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: 0.28,
                  lineHeight: "110%",
                  color: "#222",
                  margin: 0,
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
                libero et velit interdum, ac aliquet odio mattis. Class aptent taciti
                sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
            </div>
          </div>

          {/* Right: Atla symbol */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", alignSelf: "stretch" }}>
            <img
              alt="Atla Symbol"
              src="/figmaAssets/atla-symbol.png"
              style={{ height: "100%", width: "auto", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Bottom: divider + copyright bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "flex-end",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          {/* Divider */}
          <div style={{ width: "100%", height: 1, backgroundColor: "#222" }} />

          {/* Copyright row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              fontFamily: LIBRE,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.48,
              lineHeight: "120%",
              color: "#222",
              textTransform: "uppercase",
            }}
          >
            <p style={{ margin: 0 }}>Back to top ↑</p>
            <p style={{ margin: 0 }}>2026 Atla® All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
