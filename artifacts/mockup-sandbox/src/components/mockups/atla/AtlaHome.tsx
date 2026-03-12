import { useState, useEffect } from "react";

const LIBRE = "'Libre Franklin', Helvetica, sans-serif";
const ABC_SYNT = "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif";

const FOOTER_NAV = ["Work", "About", "Services", "Careers", "Journal", "Contact"];
const FOOTER_SOCIALS = ["Instagram", "Behance", "Linkedin", "Facebook"];
const OFFICE_TZS = [
  { city: "Austin, US", tz: "America/Chicago" },
  { city: "CDMX, MX", tz: "America/Mexico_City" },
  { city: "Caracas, VZ", tz: "America/Caracas" },
  { city: "Lima, PE", tz: "America/Lima" },
  { city: "Tijuana, MX", tz: "America/Tijuana" },
];
function useOfficeTimes() {
  const compute = () => {
    const now = new Date();
    const r: Record<string, string> = {};
    OFFICE_TZS.forEach(({ city, tz }) => {
      r[city] = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(now);
    });
    return r;
  };
  const [times, setTimes] = useState<Record<string, string>>(compute);
  useEffect(() => {
    const id = setInterval(() => setTimes(compute()), 10000);
    return () => clearInterval(id);
  }, []);
  return times;
}

function FooterSection() {
  const times = useOfficeTimes();
  return (
    <div style={{ backgroundColor: "#ffc629", width: "100%", minHeight: 750, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 48, alignItems: "flex-start", padding: 20, width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 240, alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 72, alignItems: "flex-start", fontFamily: LIBRE, fontSize: 14, fontWeight: 500, letterSpacing: 0.28, color: "#222", width: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, whiteSpace: "nowrap" }}>
                <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>Atla</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {FOOTER_NAV.map(item => <p key={item} style={{ fontSize: 14, lineHeight: "110%", margin: 0 }}>{item}</p>)}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, whiteSpace: "nowrap" }}>
                <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>Socials</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {FOOTER_SOCIALS.map(item => <p key={item} style={{ fontSize: 14, lineHeight: "110%", margin: 0 }}>{item}</p>)}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 140 }}>
                <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>Offices</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
                  {OFFICE_TZS.map(({ city }) => (
                    <div key={city} style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>{city}</p>
                      <p style={{ fontSize: 14, lineHeight: "110%", margin: 0 }}>{times[city] ?? "--:--"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ width: 320 }}>
              <p style={{ fontFamily: LIBRE, fontSize: 14, fontWeight: 500, letterSpacing: 0.28, lineHeight: "110%", color: "#222", margin: 0 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", alignSelf: "stretch" }}>
            <img alt="Atla Symbol" src="/__mockup/figmaAssets/atla-symbol.png" style={{ height: "100%", width: "auto", objectFit: "contain" }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end", justifyContent: "flex-end", width: "100%" }}>
          <div style={{ width: "100%", height: 1, backgroundColor: "#222" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", fontFamily: LIBRE, fontSize: 12, fontWeight: 600, letterSpacing: 0.48, lineHeight: "120%", color: "#222", textTransform: "uppercase" }}>
            <p style={{ margin: 0 }}>Back to top ↑</p>
            <p style={{ margin: 0 }}>2026 Atla® All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const NAV_FONT = {
  fontFamily: LIBRE,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "110%",
  color: "#222",
} as const;

// Each gallery image: src, width, height, vertical offset from center
const galleryImages = [
  {
    src: "/__mockup/figmaAssets/media.png",
    width: 255,
    height: 382,
    offsetY: 56,
    isCenter: false,
    marginLeft: -140,
  },
  {
    src: "/__mockup/figmaAssets/media-1.png",
    width: 255,
    height: 382,
    offsetY: 56,
    isCenter: false,
    marginLeft: 0,
  },
  {
    src: "/__mockup/figmaAssets/media-2.png",
    width: 280,
    height: 440,
    offsetY: 0,
    isCenter: true,
    marginLeft: 0,
  },
  {
    src: "/__mockup/figmaAssets/media-3.png",
    width: 255,
    height: 382,
    offsetY: 56,
    isCenter: false,
    marginLeft: 0,
  },
  {
    src: "/__mockup/figmaAssets/media-4.png",
    width: 255,
    height: 382,
    offsetY: 56,
    isCenter: false,
    marginLeft: 0,
    marginRight: -140,
  },
];

export function AtlaHome() {
  return (
    <div
      style={{ fontFamily: LIBRE, backgroundColor: "#f5f5f3" }}
      className="flex flex-col items-center w-full"
    >
      <div
        className="relative overflow-hidden flex flex-col items-center justify-between"
        style={{ width: 1200, height: 750, backgroundColor: "#f5f5f3" }}
      >
        {/* Navigation */}
        <nav className="flex w-full items-end justify-between px-5" style={{ height: 50 }}>
          <div className="flex items-center gap-3.5 flex-1">
            {["Work", "About", "Services"].map((link) => (
              <a key={link} href="#" className="no-underline" style={NAV_FONT}>
                {link}
              </a>
            ))}
          </div>

          <div className="flex flex-1 justify-center">
            <img
              alt="Atla Logo"
              src="/__mockup/figmaAssets/p-framer-text.svg"
              className="object-contain"
              style={{ height: 28 }}
            />
          </div>

          <div className="flex items-end justify-end gap-3.5 flex-1">
            {["Journal", "Contact"].map((link) => (
              <a key={link} href="#" className="no-underline" style={NAV_FONT}>
                {link}
              </a>
            ))}
            {/* Light/dark toggle icons */}
            <div style={{ display: "flex", alignItems: "center", height: 20, flexShrink: 0 }}>
              <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
                <img alt="Light mode" src="/__mockup/figmaAssets/toggle-sun.png"
                  style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
                <img alt="Dark mode" src="/__mockup/figmaAssets/toggle-moon.png"
                  style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
            </div>
          </div>
        </nav>

        {/* Gallery — centered, images overlap at edges */}
        <section
          className="flex items-center justify-center self-stretch w-full overflow-visible relative"
          style={{ flex: 1 }}
        >
          <div
            className="flex items-center"
            style={{ gap: 16, position: "relative" }}
          >
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative flex-shrink-0"
                style={{
                  marginLeft: image.marginLeft ?? 0,
                  marginRight: (image as any).marginRight ?? 0,
                  marginTop: image.offsetY,
                }}
              >
                <img
                  src={image.src}
                  alt=""
                  style={{
                    width: image.width,
                    height: image.height,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {image.isCenter && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: ABC_SYNT,
                        fontSize: 64,
                        fontWeight: 400,
                        lineHeight: "110%",
                        fontStyle: "italic",
                        color: "#222",
                        textAlign: "center",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Project Name
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom taglines */}
        <footer
          className="flex items-start justify-between px-5 self-stretch w-full"
          style={{ height: 50 }}
        >
          <p
            style={{
              fontFamily: LIBRE,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.48,
              lineHeight: "120%",
              color: "#222",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            WORKING AROUND
            <br />
            THE US &amp; LATAM
          </p>
          <p
            style={{
              fontFamily: LIBRE,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.48,
              lineHeight: "120%",
              color: "#222",
              textTransform: "uppercase",
              textAlign: "right",
              margin: 0,
            }}
          >
            DESIGN WITH
            <br />
            INTENTION
          </p>
        </footer>
      </div>
      {/* Full yellow footer section */}
      <div style={{ width: 1200 }}>
        <FooterSection />
      </div>
    </div>
  );
}
