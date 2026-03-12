import { useState, useEffect } from "react";

const LIBRE = "'Libre Franklin', Helvetica, sans-serif";
const ABC_SYNT = "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif";
const ROBOTO = "'Roboto Mono', monospace";

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

const LF_LINK: React.CSSProperties = { fontFamily: LIBRE, fontSize: 14, fontWeight: 500, letterSpacing: 0.28, lineHeight: "1.1", color: "#222", textDecoration: "none", whiteSpace: "nowrap" };
const LFB = (s: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: LIBRE, fontSize: 14, fontWeight: 700, lineHeight: "1.1", color: "#222", margin: 0, ...s });
const LFM = (s: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: LIBRE, fontSize: 14, fontWeight: 500, letterSpacing: 0.28, lineHeight: "1.1", color: "#222", textDecoration: "none", margin: 0, ...s });
const SM: React.CSSProperties = { fontFamily: LIBRE, fontSize: 12, fontWeight: 600, letterSpacing: 0.48, lineHeight: "1.2", color: "#222", textTransform: "uppercase", margin: 0 };
const LF_REG18: React.CSSProperties = { fontFamily: LIBRE, fontSize: 18, fontWeight: 400, lineHeight: "1.1", color: "#222", margin: 0 };
const LF_SB12: React.CSSProperties = { fontFamily: LIBRE, fontSize: 12, fontWeight: 600, letterSpacing: 0.48, lineHeight: "1.2", color: "#8e8e8e", textTransform: "uppercase", margin: 0 };
const RM14: React.CSSProperties = { fontFamily: ROBOTO, fontSize: 14, fontWeight: 400, lineHeight: "21px", color: "#222", textTransform: "uppercase", margin: 0 };
const RM14G: React.CSSProperties = { ...RM14, color: "#8e8e8e" };

const TEAM = [
  { name: "Jose Pablo Dominguez", role: "( Founder & Creative Director )", src: "/figmaAssets/photo-1.jpg" },
  { name: "Paola Diaz", role: "( COO )", src: "/figmaAssets/photo-2.jpg" },
  { name: "Levi Ramirez", role: "( Head of Growth )", src: "/figmaAssets/photo-3.jpg" },
  { name: "Mariela Alata", role: "( Project Manager )", src: "/figmaAssets/photo-4.jpg" },
  { name: "Tais Kahatt", role: "( Art Director )", src: "/figmaAssets/photo-4.jpg" },
  { name: "Adriana Mendez", role: "( Brand designer )", src: "/figmaAssets/photo-4.jpg" },
  { name: "José Aceves Covarrubias", role: "( Brand designer )", src: "/figmaAssets/photo-3.jpg" },
];
const SERVICES = ["Creative direction", "Brand strategy", "Identity", "Digital design", "Motion", "Print and packaging", "Art direction", "Copywriting", "Tone of voice"];
const CLIENTS = [
  { name: "Aurel Studios", sphere: "Fashion" },
  { name: "Lior Atelier", sphere: "Film & Production" },
  { name: "Onera Creative", sphere: "Industrial" },
  { name: "Klyra House", sphere: "Visual Direction" },
  { name: "Veer Studio", sphere: "Architecture" },
  { name: "Lumae Systems", sphere: "Design Engineering" },
  { name: "Aerith Agency", sphere: "Creative Consulting" },
  { name: "Orza Objects", sphere: "3D Visualization" },
];
const HONORS = [
  { award: "Awwwards", title: "Website of the Day", count: "x4" },
  { award: "Awwwards", title: "Website of the Month", count: "x2" },
  { award: "ADC Awards", title: "Excellence in Motion Direction", count: "x1" },
];

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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flex: "1 0 0", minWidth: 0 }}>
      <p style={{ fontFamily: "'PP Playground', 'Libre Franklin', Helvetica, sans-serif", fontSize: 140, fontWeight: 500, lineHeight: "1.1", color: "#222", margin: 0, whiteSpace: "nowrap" }}>
        {children}
      </p>
    </div>
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

export function AtlaAbout() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#fafafa" }}>

      {/* Hero */}
      <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 1200, minHeight: 750, position: "relative", backgroundColor: "#fafafa", overflow: "clip", flexShrink: 0 }}>
        <NavBar />
        <div style={{ position: "absolute", inset: 0, top: 0, left: 0, width: "100%", height: 750 }}>
          <img src="/figmaAssets/about-hero.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", pointerEvents: "none" }} />
        </div>
        <div style={{ position: "absolute", left: 565, top: 200, width: 635 }}>
          <p style={{ fontFamily: ABC_SYNT, fontSize: 64, fontWeight: 400, fontStyle: "normal", lineHeight: "1.1", color: "#222", width: 548.72, margin: 0 }}>
            We design brands that go beyond just looking good—it's central to the brand itself.
          </p>
        </div>
      </div>

      {/* Content sections */}
      <div style={{ width: "100%", maxWidth: 1200, display: "flex", flexDirection: "column", gap: 240, alignItems: "flex-start", padding: "120px 20px 240px", boxSizing: "border-box" }}>

        {/* About */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
          <SectionTitle>About</SectionTitle>
          <div style={{ width: 615, flexShrink: 0 }}>
            <div style={{ width: 456 }}>
              <p style={LF_REG18}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque. Ut diam quam, semper iaculis condimentum ac, vestibulum eu nisl.</p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
          <SectionTitle>Team</SectionTitle>
          <div style={{ width: 615, flexShrink: 0, display: "flex", flexDirection: "column", gap: 36 }}>
            {Array.from({ length: Math.ceil(TEAM.length / 2) }, (_, rowIdx) => (
              <div key={rowIdx} style={{ display: "flex", gap: 24, alignItems: "center" }}>
                {TEAM.slice(rowIdx * 2, rowIdx * 2 + 2).map((member, idx) => (
                  <div key={idx} style={{ flex: "1 0 0", display: "flex", flexDirection: "column", gap: 16, overflow: "hidden" }}>
                    <div style={{ aspectRatio: "295.5 / 394", position: "relative", width: "100%", overflow: "clip" }}>
                      <img src={member.src} alt={member.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                      <p style={{ ...LF_REG18, textAlign: "center", whiteSpace: "nowrap" }}>{member.name}</p>
                      <p style={LF_SB12}>{member.role}</p>
                    </div>
                  </div>
                ))}
                {TEAM.slice(rowIdx * 2, rowIdx * 2 + 2).length < 2 && (
                  <div style={{ flex: "1 0 0", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ aspectRatio: "295.5 / 394", position: "relative", width: "100%", backgroundColor: "#fafafa", overflow: "clip", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src="/figmaAssets/atla-symbol-small.png" alt="Atla" style={{ width: 35.691, height: 64, objectFit: "contain", display: "block" }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
          <SectionTitle>Services</SectionTitle>
          <div style={{ width: 615, flexShrink: 0 }}>
            {SERVICES.map((s, i) => <p key={i} style={RM14}>{s}</p>)}
          </div>
        </div>

        {/* Clients */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
          <SectionTitle>Clients</SectionTitle>
          <div style={{ width: 615, flexShrink: 0 }}>
            {CLIENTS.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
                <div style={{ flex: "1 0 0" }}><p style={RM14}>{c.name}</p></div>
                <div style={{ flex: "1 0 0" }}><p style={RM14G}>{c.sphere}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* Honors */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
          <SectionTitle>Honors</SectionTitle>
          <div style={{ width: 615, flexShrink: 0 }}>
            {HONORS.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
                <div style={{ width: 285, flexShrink: 0 }}><p style={RM14}>{h.award}</p></div>
                <div style={{ width: 190, flexShrink: 0 }}><p style={RM14}>{h.title}</p></div>
                <div style={{ width: 95, flexShrink: 0, textAlign: "right" }}><p style={{ ...RM14, textAlign: "right" }}>{h.count}</p></div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={{ width: "100%", maxWidth: 1200 }}>
        <Footer />
      </div>
    </div>
  );
}

export default AtlaAbout;
