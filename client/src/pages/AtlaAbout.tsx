import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { AtlaSymbol } from "@/components/atla/AtlaMarks";
import { useIsMobile } from "@/hooks/use-mobile";

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

function SectionTitle({ children, mobile = false }: { children: React.ReactNode; mobile?: boolean }) {
  return (
    <div style={{ flex: "1 0 0", minWidth: 0 }}>
      <p
        style={{
          fontFamily: "'PP Playground', 'Libre Franklin', Helvetica, sans-serif",
          fontSize: mobile ? 40 : 140,
          fontWeight: 500,
          lineHeight: "1.1",
          color: "#222",
          margin: 0,
          whiteSpace: mobile ? "normal" : "nowrap",
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

export default function AtlaAbout() {
  const isMobile = useIsMobile();

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>

      <div
        className="atla-enter"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: isMobile ? "auto" : 750,
          position: "relative",
          backgroundColor: "#fafafa",
          overflow: "clip",
          flexShrink: 0,
        }}
      >
        <AtlaNav />

        <div style={{ position: isMobile ? "relative" : "absolute", inset: isMobile ? "auto" : 0, top: 0, left: 0, width: "100%", height: isMobile ? 300 : 750 }}>
          <img
            src="/figmaAssets/about-hero.jpg"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", pointerEvents: "none" }}
          />
        </div>

        <div
          style={{
            position: isMobile ? "relative" : "absolute",
            left: isMobile ? "auto" : 565,
            top: isMobile ? "auto" : 200,
            width: isMobile ? "100%" : 635,
            padding: isMobile ? "20px 10px 0" : 0,
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
              fontSize: isMobile ? 40 : 64,
              fontWeight: 400,
              fontStyle: "normal",
              lineHeight: "1.1",
              color: "#222",
              width: isMobile ? "100%" : 548.72,
              margin: 0,
            }}
          >
            We design brands that go beyond just looking good—it's central to the brand itself.
          </p>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 80 : 240,
          alignItems: "flex-start",
          justifyContent: "center",
          padding: isMobile ? "80px 10px 100px" : "120px 20px 240px",
          boxSizing: "border-box",
        }}
      >

        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "flex-start", justifyContent: "space-between", gap: isMobile ? 24 : 0, width: "100%" }}>
          <SectionTitle mobile={isMobile}>About</SectionTitle>
          <div style={{ width: isMobile ? "100%" : 615, flexShrink: 0 }}>
            <div style={{ width: isMobile ? "100%" : 456 }}>
              <p style={LF_REG18}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum,
                ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
                inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur
                neque. Ut diam quam, semper iaculis condimentum ac, vestibulum eu nisl.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "flex-start", justifyContent: "space-between", gap: isMobile ? 24 : 0, width: "100%" }}>
          <SectionTitle mobile={isMobile}>Team</SectionTitle>
          <div style={{ width: isMobile ? "100%" : 615, flexShrink: 0, display: "flex", flexDirection: "column", gap: 36 }}>
            {isMobile ? TEAM.map((member, idx) => (
              <div key={member.name} style={{ width: "100%", maxWidth: 300, marginLeft: idx % 2 === 0 ? 0 : "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ height: 400, position: "relative", width: "100%", overflow: "clip" }}>
                  <img
                    src={member.src}
                    alt={member.name}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: idx % 2 === 0 ? "flex-start" : "flex-end" }}>
                  <p style={{ ...LF_REG18, textAlign: idx % 2 === 0 ? "left" : "right", whiteSpace: "normal" }}>{member.name}</p>
                  <p style={LF_SB12}>{member.role}</p>
                </div>
              </div>
            )) : Array.from({ length: Math.ceil(TEAM.length / 2) }, (_, rowIdx) => (
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
                {TEAM.slice(rowIdx * 2, rowIdx * 2 + 2).length < 2 && (
                  <div style={{ flex: "1 0 0", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ aspectRatio: "295.5 / 394", position: "relative", width: "100%", backgroundColor: "#fafafa", overflow: "clip", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ color: "#222", width: 36, height: 64 }}>
                        <AtlaSymbol />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div id="services" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "flex-start", justifyContent: "space-between", gap: isMobile ? 24 : 0, width: "100%" }}>
          <SectionTitle mobile={isMobile}>Services</SectionTitle>
          <div style={{ width: isMobile ? "100%" : 615, flexShrink: 0 }}>
            <div>
              {SERVICES.map((s, i) => (
                <p key={i} style={{ ...RM14, marginBottom: i < SERVICES.length - 1 ? 0 : 0 }}>{s}</p>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "flex-start", justifyContent: "space-between", gap: isMobile ? 24 : 0, width: "100%" }}>
          <SectionTitle mobile={isMobile}>Clients</SectionTitle>
          <div style={{ width: isMobile ? "100%" : 615, flexShrink: 0 }}>
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

        <div id="contact" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "flex-start", justifyContent: "space-between", gap: isMobile ? 24 : 0, width: "100%" }}>
          <SectionTitle mobile={isMobile}>Contact</SectionTitle>
          <div style={{ width: isMobile ? "100%" : 615, flexShrink: 0 }}>
            <div
              style={{
                width: "100%",
                height: isMobile ? 320 : 410,
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#222",
              }}
            >
              <img
                src="https://www.figma.com/api/mcp/asset/1f8f5121-d0f3-4e6d-9359-88b75c689c5b"
                alt=""
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 36,
                  textAlign: "center",
                  padding: 24,
                }}
              >
                <p style={{ fontFamily: "'Libre Franklin', Helvetica, sans-serif", fontSize: 48, fontWeight: 400, lineHeight: "1.1", color: "#fafafa", margin: 0 }}>
                  Book a Call
                </p>
                <p style={{ fontFamily: "'Libre Franklin', Helvetica, sans-serif", fontSize: 20, fontWeight: 500, lineHeight: "1.1", color: "#fafafa", margin: 0, maxWidth: 320 }}>
                  Let&apos;s create something visual. We collaborate with brands, artists, and studios worldwide.
                </p>
                <a
                  href="mailto:hello@atla.studio"
                  className="atla-footer-cta"
                  style={{
                    fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: 0.56,
                    lineHeight: "1.2",
                    color: "#222",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    padding: 12,
                    backgroundColor: "#ffc629",
                    borderRadius: 4,
                  }}
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <AtlaFooter />
    </div>
  );
}
