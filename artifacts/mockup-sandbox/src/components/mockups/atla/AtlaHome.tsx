import { useState, useEffect, useCallback } from "react";

const LIBRE = "'Libre Franklin', Helvetica, sans-serif";
const ABC_SYNT = "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif";

const SLOT_SIZES = [
  { w: 225, h: 337.5 },
  { w: 225, h: 337.5 },
  { w: 300, h: 450 },
  { w: 225, h: 337.5 },
  { w: 225, h: 337.5 },
];

const FALLBACK_IMAGES = [
  "/figmaAssets/media.png",
  "/figmaAssets/media-1.png",
  "/figmaAssets/media-2.png",
  "/figmaAssets/media-3.png",
  "/figmaAssets/media-4.png",
];

const ADVANCE_MS = 4000;

interface ProjectData {
  slug: string;
  title: string;
  coverImage: string;
}

const LEFT_NAV = [
  { label: "Work", href: "#work" },
  { label: "About", href: "/about" },
  { label: "Services", href: "#services" },
];
const RIGHT_NAV = [
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];
const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "/about" },
  { label: "Services", href: "#services" },
  { label: "Careers", href: "#careers" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];
const SOCIALS = [{ label: "Instagram" }, { label: "Behance" }, { label: "Linkedin" }, { label: "Facebook" }];
const OFFICES = [
  { city: "Austin, US", tz: "America/Chicago" },
  { city: "CDMX, MX", tz: "America/Mexico_City" },
  { city: "Caracas, VZ", tz: "America/Caracas" },
  { city: "Lima, PE", tz: "America/Lima" },
  { city: "Tijuana, MX", tz: "America/Tijuana" },
];
const FORMATTERS = Object.fromEntries(OFFICES.map(({ city, tz }) => [city, new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz })]));
function computeTimes() { const now = new Date(); return Object.fromEntries(OFFICES.map(({ city }) => [city, FORMATTERS[city].format(now)])); }

const LF_LINK: React.CSSProperties = {
  fontFamily: LIBRE,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "1.1",
  color: "#222",
  textDecoration: "none",
  whiteSpace: "nowrap",
};
const LFB = (s: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: LIBRE, fontSize: 14, fontWeight: 700, lineHeight: "1.1", color: "#222", margin: 0, ...s });
const LFM = (s: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: LIBRE, fontSize: 14, fontWeight: 500, letterSpacing: 0.28, lineHeight: "1.1", color: "#222", textDecoration: "none", margin: 0, ...s });
const SM: React.CSSProperties = { fontFamily: LIBRE, fontSize: 12, fontWeight: 600, letterSpacing: 0.48, lineHeight: "1.2", color: "#222", textTransform: "uppercase", margin: 0 };

function NavBar() {
  return (
    <nav style={{ display: "flex", width: "100%", height: 50, alignItems: "flex-end", justifyContent: "space-between", padding: "0 20px", boxSizing: "border-box", flexShrink: 0 }}>
      <div style={{ flex: "1 0 0", display: "flex", alignItems: "center", gap: 14 }}>
        {LEFT_NAV.map((l) => <a key={l.label} href={l.href} style={LF_LINK}>{l.label}</a>)}
      </div>
      <div style={{ flex: "1 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 68.195, height: 28, flexShrink: 0 }}>
          <img alt="Atla" src="/figmaAssets/p-framer-text.png" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
        </div>
      </div>
      <div style={{ flex: "1 0 0", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: 14 }}>
        {RIGHT_NAV.map((l) => <a key={l.label} href={l.href} style={LF_LINK}>{l.label}</a>)}
        <div style={{ display: "flex", alignItems: "center", height: 20 }}>
          <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
            <img alt="Light mode" src="/figmaAssets/toggle-sun.png" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          </div>
          <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
            <img alt="Dark mode" src="/figmaAssets/toggle-moon.png" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  const [times, setTimes] = useState<Record<string, string>>(computeTimes);
  useEffect(() => { const id = setInterval(() => setTimes(computeTimes()), 10000); return () => clearInterval(id); }, []);

  return (
    <footer style={{ backgroundColor: "#ffc629", width: "100%", minHeight: 750, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", boxSizing: "border-box" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 48, alignItems: "flex-start", padding: 20, width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
          <div style={{ flex: "1 0 0", display: "flex", flexDirection: "column", gap: 240, alignItems: "flex-start", minWidth: 0 }}>
            <div style={{ display: "flex", gap: 72, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <p style={LFB()}>Atla</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {NAV_LINKS.map((l) => <a key={l.label} href={l.href} style={LFM()}>{l.label}</a>)}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <p style={LFB()}>Socials</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {SOCIALS.map((s) => <a key={s.label} href="#" style={LFM()}>{s.label}</a>)}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 140 }}>
                <p style={LFB()}>Offices</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
                  {OFFICES.map(({ city }) => (
                    <div key={city} style={{ display: "flex", justifyContent: "space-between" }}>
                      <p style={LFB()}>{city}</p>
                      <p style={LFM()}>{times[city]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ width: 320 }}>
              <p style={LFM()}>Atla is a design studio for brands across the US and Latin America. We build identities that communicate with clarity and purpose.</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", alignSelf: "stretch", flexShrink: 0 }}>
            <img alt="Atla" src="/figmaAssets/atla-symbol.png" style={{ height: "100%", width: "auto", objectFit: "contain", display: "block" }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end", width: "100%" }}>
          <div style={{ width: "100%", height: 1, backgroundColor: "#222" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <p style={SM}>Back to top ↑</p>
            <p style={SM}>2026 Atla® All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function useSlideshow(count: number) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => { setOffset((prev) => (prev + 1) % count); }, ADVANCE_MS);
    return () => clearInterval(id);
  }, [count]);
  const getIndex = useCallback((slot: number) => (count > 0 ? (offset + slot) % count : slot), [offset, count]);
  return { getIndex };
}

export function AtlaHome() {
  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => { if (r.ok) return r.json(); throw new Error("fetch failed"); })
      .then((data: ProjectData[]) => setProjects(data))
      .catch(() => {});
  }, []);

  const hasProjects = projects.length > 0;
  const { getIndex } = useSlideshow(hasProjects ? projects.length : 0);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#fafafa" }}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 1200, height: 750, alignItems: "center", justifyContent: "space-between", backgroundColor: "#fafafa", overflow: "hidden" }}>
        <NavBar />

        <section style={{ display: "flex", gap: 100, alignItems: "center", justifyContent: "center", width: "100%", flexShrink: 0 }}>
          {SLOT_SIZES.map((slot, i) => {
            const isCenter = i === 2;
            const project = hasProjects ? projects[getIndex(i)] : null;
            const src = project?.coverImage || FALLBACK_IMAGES[i];
            const alt = project?.title || "Atla project";
            const slug = project?.slug;

            const card = (
              <div key={i} style={{ position: "relative", width: slot.w, height: slot.h, flexShrink: 0 }}>
                <img src={src} alt={alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} />
                {isCenter && (
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 375, height: 140, mixBlendMode: "difference", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: ABC_SYNT, fontSize: 64, fontWeight: 400, lineHeight: "1.1", color: "#fafafa", textAlign: "center", whiteSpace: "nowrap" }}>{project?.title || "Project Name"}</span>
                  </div>
                )}
              </div>
            );

            if (slug) {
              return (
                <a key={i} href={`/projects/${slug}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                  {card}
                </a>
              );
            }
            return card;
          })}
        </section>

        <div style={{ display: "flex", height: 50, alignItems: "flex-start", justifyContent: "center", gap: 10, padding: "0 20px", width: "100%", boxSizing: "border-box", flexShrink: 0 }}>
          <div style={{ flex: "1 0 0", display: "flex", alignItems: "center" }}>
            <p style={{ fontFamily: LIBRE, fontSize: 12, fontWeight: 600, letterSpacing: 0.48, lineHeight: "1.2", color: "#222", textTransform: "uppercase", margin: 0, whiteSpace: "pre-line" }}>{"Working around \nthe Us & Latam"}</p>
          </div>
          <div style={{ flex: "1 0 0", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <p style={{ fontFamily: LIBRE, fontSize: 12, fontWeight: 600, letterSpacing: 0.48, lineHeight: "1.2", color: "#222", textTransform: "uppercase", textAlign: "right", margin: 0, whiteSpace: "pre-line" }}>{"design with\nintention"}</p>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 1200 }}>
        <Footer />
      </div>
    </div>
  );
}

export default AtlaHome;
