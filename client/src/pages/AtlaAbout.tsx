import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";

const LF_REG18: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 18,
  fontWeight: 400,
  lineHeight: "1.1",
  color: "#222",
  margin: 0,
};
const LF_SB12: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.48,
  lineHeight: "1.2",
  color: "#8e8e8e",
  textTransform: "uppercase",
  margin: 0,
};
const RM14: React.CSSProperties = {
  fontFamily: "'Roboto Mono', monospace",
  fontSize: 14,
  fontWeight: 400,
  lineHeight: "21px",
  color: "#222",
  textTransform: "uppercase",
  margin: 0,
};
const RM14_GRAY: React.CSSProperties = { ...RM14, color: "#8e8e8e" };

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flex: "1 0 0", minWidth: 0 }}>
      <p
        style={{
          fontFamily: "'PP Playground', 'Libre Franklin', Helvetica, sans-serif",
          fontSize: 140,
          fontWeight: 500,
          lineHeight: "1.1",
          color: "#222",
          margin: 0,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </p>
    </div>
  );
}

const TEAM = [
  { name: "Jose Pablo Dominguez", role: "( Founder & Creative Director )", src: "/figmaAssets/photo-1.jpg" },
  { name: "Paola Diaz", role: "( COO )", src: "/figmaAssets/photo-2.jpg" },
  { name: "Levi Ramirez", role: "( Head of Growth )", src: "/figmaAssets/photo-3.jpg" },
  { name: "Mariela Alata", role: "( Project Manager )", src: "/figmaAssets/photo-4.jpg" },
  { name: "Tais Kahatt", role: "( Art Director )", src: "/figmaAssets/photo-4.jpg" },
  { name: "Adriana Mendez", role: "( Brand designer )", src: "/figmaAssets/photo-4.jpg" },
  { name: "José Aceves Covarrubias", role: "( Brand designer )", src: "/figmaAssets/photo-3.jpg" },
];

const SERVICES = [
  "Creative direction",
  "Brand strategy",
  "Identity",
  "Digital design",
  "Motion",
  "Print and packaging",
  "Art direction",
  "Copywriting",
  "Tone of voice",
];

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

export default function AtlaAbout() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#fafafa" }}>

      {/* ── Hero section (750px) ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 1200,
          minHeight: 750,
          position: "relative",
          backgroundColor: "#fafafa",
          overflow: "clip",
          flexShrink: 0,
        }}
      >
        <AtlaNav />

        {/* Hero background image (Atlas-0010) */}
        <div style={{ position: "absolute", inset: 0, top: 0, left: 0, width: "100%", height: 750 }}>
          <img
            src="/figmaAssets/about-hero.jpg"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", pointerEvents: "none" }}
          />
        </div>

        {/* Hero text — absolute at left-[565px] top-[200px] */}
        <div
          style={{
            position: "absolute",
            left: 565,
            top: 200,
            width: 635,
          }}
        >
          <p
            style={{
              fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
              fontSize: 64,
              fontWeight: 400,
              fontStyle: "normal",
              lineHeight: "1.1",
              color: "#222",
              width: 548.72,
              margin: 0,
            }}
          >
            We design brands that go beyond just looking good—it's central to the brand itself.
          </p>
        </div>
      </div>

      {/* ── Content sections ── */}
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          flexDirection: "column",
          gap: 240,
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "120px 20px 240px",
          boxSizing: "border-box",
        }}
      >

        {/* About */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
          <SectionTitle>About</SectionTitle>
          <div style={{ width: 615, flexShrink: 0 }}>
            <div style={{ width: 456 }}>
              <p style={LF_REG18}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum,
                ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
                inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur
                neque. Ut diam quam, semper iaculis condimentum ac, vestibulum eu nisl.
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
          <SectionTitle>Team</SectionTitle>
          <div style={{ width: 615, flexShrink: 0, display: "flex", flexDirection: "column", gap: 36 }}>
            {/* Rows of 2 */}
            {Array.from({ length: Math.ceil(TEAM.length / 2) }, (_, rowIdx) => (
              <div key={rowIdx} style={{ display: "flex", gap: 24, alignItems: "center" }}>
                {TEAM.slice(rowIdx * 2, rowIdx * 2 + 2).map((member, idx) => (
                  <div key={idx} style={{ flex: "1 0 0", display: "flex", flexDirection: "column", gap: 16, overflow: "hidden" }}>
                    <div style={{ aspectRatio: "295.5 / 394", position: "relative", width: "100%", overflow: "clip" }}>
                      <img
                        src={member.src}
                        alt={member.name}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <p style={{ ...LF_REG18, textAlign: "center", whiteSpace: "nowrap" }}>{member.name}</p>
                      <p style={LF_SB12}>{member.role}</p>
                    </div>
                  </div>
                ))}
                {/* If odd row, fill remaining slot with Atla symbol placeholder */}
                {TEAM.slice(rowIdx * 2, rowIdx * 2 + 2).length < 2 && (
                  <div style={{ flex: "1 0 0", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ aspectRatio: "295.5 / 394", position: "relative", width: "100%", backgroundColor: "#fafafa", overflow: "clip", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img
                        src="/figmaAssets/atla-symbol-small.png"
                        alt="Atla"
                        style={{ width: 35.691, height: 64, objectFit: "contain", display: "block" }}
                      />
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
            <div>
              {SERVICES.map((s, i) => (
                <p key={i} style={{ ...RM14, marginBottom: i < SERVICES.length - 1 ? 0 : 0 }}>{s}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Clients */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
          <SectionTitle>Clients</SectionTitle>
          <div style={{ width: 615, flexShrink: 0 }}>
            {CLIENTS.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                <div style={{ flex: "1 0 0" }}>
                  <p style={RM14}>{c.name}</p>
                </div>
                <div style={{ flex: "1 0 0" }}>
                  <p style={RM14_GRAY}>{c.sphere}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Honors */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
          <SectionTitle>Honors</SectionTitle>
          <div style={{ width: 615, flexShrink: 0 }}>
            {HONORS.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                <div style={{ width: 285, flexShrink: 0 }}>
                  <p style={RM14}>{h.award}</p>
                </div>
                <div style={{ width: 190, flexShrink: 0 }}>
                  <p style={RM14}>{h.title}</p>
                </div>
                <div style={{ width: 95, flexShrink: 0, textAlign: "right" }}>
                  <p style={{ ...RM14, textAlign: "right" }}>{h.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div style={{ width: "100%", maxWidth: 1200 }}>
        <AtlaFooter />
      </div>
    </div>
  );
}
