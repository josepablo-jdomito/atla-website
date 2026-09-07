import { Fragment, useEffect, useMemo, useState } from "react";
import { AtlaSymbol, AtlaWordmark } from "@/components/atla/AtlaMarks";
import { useIsMobile } from "@/hooks/use-mobile";
import { SOCIAL_PROFILES } from "@shared/siteSeo";

const CITIES = [
  { label: "Austin, US", timeZone: "America/Chicago" },
  { label: "CDMX, MX", timeZone: "America/Mexico_City" },
  { label: "Caracas, VE", timeZone: "America/Caracas" },
  { label: "Lima, PE", timeZone: "America/Lima" },
  { label: "Tijuana, MX", timeZone: "America/Tijuana" },
] as const;

const NAV_LINKS = ["Work", "About", "Services", "Journal", "Contact"] as const;
const SOCIAL_LINKS = SOCIAL_PROFILES;

function getCityTimes() {
  return CITIES.map((city) => {
    const time = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: city.timeZone,
    }).format(new Date());

    return { ...city, time };
  });
}

export function AtlaFooter() {
  const isMobile = useIsMobile();
  const [cityTimes, setCityTimes] = useState(getCityTimes);
  const year = useMemo(() => new Date().getFullYear(), []);
  const desktopRows = useMemo(
    () => Math.max(NAV_LINKS.length, SOCIAL_LINKS.length, CITIES.length),
    [],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setCityTimes(getCityTimes()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <footer
      style={{
        width: "100%",
        background: "#f6c428",
        color: "#1c1f27",
        borderTop: "1px solid rgba(28,31,39,0.14)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1720,
          margin: "0 auto",
          padding: isMobile ? "20px 6px 12px" : "20px 8px 12px",
          display: "grid",
          gap: isMobile ? 12 : 12,
        }}
      >
        <div
          style={{
            width: isMobile ? 280 : 560,
            maxWidth: "100%",
            justifySelf: "start",
            alignSelf: "start",
          }}
        >
          <AtlaWordmark color="#1c1f27" style={{ width: "100%", height: "auto" }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) minmax(360px, 0.9fr)",
            gap: isMobile ? 16 : 28,
            alignItems: "start",
          }}
        >
          {isMobile ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  columnGap: 14,
                  rowGap: 8,
                }}
              >
                <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Atla</p>
                <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Socials</p>
                <div style={{ display: "grid", gap: 5 }}>
                  {NAV_LINKS.map((item) => (
                    <a
                      key={item}
                      href={item === "Work" ? "/" : `/${item.toLowerCase()}`}
                      className="atla-link"
                      style={{
                        color: "#1c1f27",
                        textDecoration: "none",
                        fontSize: 17,
                        lineHeight: 1.08,
                        fontWeight: 600,
                        padding: "2px 0",
                        minHeight: "unset",
                        minWidth: "unset",
                      }}
                    >
                      {item}
                    </a>
                  ))}
                </div>
                <div style={{ display: "grid", gap: 5 }}>
                  {SOCIAL_LINKS.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="atla-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#1c1f27",
                        textDecoration: "none",
                        fontSize: 17,
                        lineHeight: 1.08,
                        fontWeight: 600,
                        padding: "2px 0",
                        minHeight: "unset",
                        minWidth: "unset",
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gap: 4 }}>
                <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>(home) Offices</p>
                {cityTimes.map((city) => (
                  <p key={city.label} style={{ margin: 0, fontSize: 16, lineHeight: 1.3, fontWeight: 600 }}>
                    {city.label} · {city.time}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(100px, 0.48fr) minmax(140px, 0.72fr) minmax(270px, 1fr)",
                columnGap: 20,
                rowGap: 6,
                maxWidth: 920,
              }}
            >
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Atla</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Socials</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>(home) Offices</p>

              {Array.from({ length: desktopRows }).map((_, index) => {
                const nav = NAV_LINKS[index];
                const social = SOCIAL_LINKS[index];
                const city = cityTimes[index];

                return (
                  <Fragment key={`footer-row-${index}`}>
                    <div>
                      {nav ? (
                        <a
                          href={nav === "Work" ? "/" : `/${nav.toLowerCase()}`}
                          className="atla-link"
                          style={{
                            color: "#1c1f27",
                            textDecoration: "none",
                            fontSize: 16,
                            lineHeight: 1.08,
                            fontWeight: 600,
                            padding: "2px 0",
                            minHeight: "unset",
                            minWidth: "unset",
                          }}
                        >
                          {nav}
                        </a>
                      ) : (
                        <span style={{ display: "block", height: 20 }} aria-hidden />
                      )}
                    </div>
                    <div>
                      {social ? (
                        <a
                          href={social.href}
                          className="atla-link"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#1c1f27",
                            textDecoration: "none",
                            fontSize: 16,
                            lineHeight: 1.08,
                            fontWeight: 600,
                            padding: "2px 0",
                            minHeight: "unset",
                            minWidth: "unset",
                          }}
                        >
                          {social.label}
                        </a>
                      ) : (
                        <span style={{ display: "block", height: 20 }} aria-hidden />
                      )}
                    </div>
                    <div>
                      {city ? (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "auto 88px",
                            alignItems: "baseline",
                            gap: 8,
                          }}
                        >
                          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.12, fontWeight: 700 }}>{city.label}</p>
                          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.12, fontWeight: 600, textAlign: "right" }}>
                            {city.time}
                          </p>
                        </div>
                      ) : (
                        <span style={{ display: "block", height: 20 }} aria-hidden />
                      )}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          )}

          {!isMobile ? (
            <div
              style={{
                justifySelf: "end",
                width: "100%",
                maxWidth: 1240,
                aspectRatio: "1 / 1",
                alignSelf: "end",
              }}
            >
              <AtlaSymbol color="#1c1f27" />
            </div>
          ) : null}
        </div>

        <div
          style={{
            marginTop: isMobile ? 6 : 2,
            borderTop: "1px solid rgba(28,31,39,0.55)",
            paddingTop: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              border: "none",
              background: "none",
              color: "#1c1f27",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 0.24,
              cursor: "pointer",
              padding: 0,
            }}
          >
            BACK TO TOP ↑
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              gap: isMobile ? 10 : 18,
            }}
          >
            <a
              href="/privacy"
              className="atla-link"
              style={{
                color: "#1c1f27",
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 0.24,
              }}
            >
              PRIVACY
            </a>
            <a
              href="/terms"
              className="atla-link"
              style={{
                color: "#1c1f27",
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 0.24,
              }}
            >
              TERMS
            </a>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, letterSpacing: 0.24 }}>
              {year} ATLA® ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
