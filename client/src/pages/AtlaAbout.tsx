import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { useIsMobile } from "@/hooks/use-mobile";
import { getImageDimensions } from "@shared/imageDelivery";
import { ORGANIZATION_SCHEMA, formatMetaTitle } from "@shared/siteSeo";

const LF_REG18: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 18,
  fontWeight: 400,
  lineHeight: "1.1",
  color: "#222",
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
const RM14_GRAY: React.CSSProperties = { ...RM14, color: "#6f6f6f" };

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
  { name: "José Pablo Domínguez", role: "Founder & Creative Director" },
  { name: "Paola Díaz", role: "COO" },
  { name: "Levi Ramírez", role: "Head of Growth" },
  { name: "Mariela Alata", role: "Project Manager" },
  { name: "Tais Kahatt", role: "Art Director" },
  { name: "Adriana Méndez", role: "Brand Designer" },
  { name: "José Aceves Covarrubias", role: "Brand Designer" },
];

const SERVICES = [
  "Creative Direction",
  "Brand Strategy",
  "Identity Design",
  "Digital Design",
  "Motion",
  "Print & Packaging",
  "Art Direction",
  "Copywriting",
  "Tone of Voice",
];

const CLIENTS = [
  { name: "Techo-Bloc", sphere: "Building Materials" },
  { name: "Aimee Kestenberg", sphere: "Fashion & Accessories" },
  { name: "FCP Euro", sphere: "Automotive" },
  { name: "Temakase", sphere: "Hospitality" },
  { name: "The Bridge", sphere: "Hospitality" },
  { name: "Ando", sphere: "Consumer Goods" },
  { name: "Conscious Care Co.", sphere: "Wellness" },
  { name: "TATO Matcha", sphere: "Food & Beverage" },
];

export default function AtlaAbout() {
  const isMobile = useIsMobile();
  const heroDimensions = getImageDimensions("/figmaAssets/about-hero.jpg");

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={formatMetaTitle("About Atla", "Branding Studio in Mexico City and Austin")}
        description="Meet Atla, a senior-led branding studio helping founders and teams build strategy, identity, and digital systems across the US and Latin America."
        pathname="/about"
        image="/figmaAssets/about-hero.jpg"
        structuredData={ORGANIZATION_SCHEMA}
      />
      <div className="atla-dark-surface">
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
            alt="Atla team members in the studio"
            width={heroDimensions?.width}
            height={heroDimensions?.height}
            fetchPriority="high"
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
            We don&apos;t design brands that just look good. We build brands that work.
          </p>
          <h1
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            About Atla branding studio
          </h1>
        </div>
      </div>

      <main
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
                Atla is a branding studio built on one belief: a brand is only as strong as the system behind it.
                We work with founders and teams who understand that identity isn&apos;t decoration, it&apos;s
                infrastructure. Strategy, design, and expression. All connected. All intentional. Our team is
                small by design. Senior creatives. Direct access. No account managers filtering the work. Every
                project runs through the same standard: clarity in positioning, precision in craft, coherence
                across every surface it touches. Based between Mexico City and Austin, we work with companies
                across the US and Latin America, from hospitality and CPG to wellness, SaaS, and lifestyle
                brands ready to be taken seriously.
              </p>
              <p style={{ ...LF_REG18, marginTop: 18 }}>
                The work usually begins with a hard question, not a visual one. What does the brand need to say
                more clearly? Where is the disconnect between perception and reality? Which touchpoints are carrying
                the most strategic weight right now? We build from there so the outcome is not just recognizable,
                but durable across product, packaging, websites, launch materials, and the day-to-day decisions a
                growing company has to make.
              </p>
              <p style={{ ...LF_REG18, marginTop: 18 }}>
                For the full method, read{" "}
                <a href="/how-we-work" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                  how we work
                </a>{" "}
                and the{" "}
                <a href="/brand-strategy" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                  brand strategy framework
                </a>
                . Category entry points are available via{" "}
                <a href="/hospitality-branding" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                  hospitality
                </a>
                ,{" "}
                <a href="/cpg-branding" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                  CPG
                </a>
                ,{" "}
                <a href="/wellness-branding" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                  wellness
                </a>
                , and{" "}
                <a href="/saas-branding" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                  SaaS branding
                </a>
                .
              </p>
              <section className="sr-only" aria-label="About Atla detailed context">
                <h2>Studio operating model</h2>
                <p>
                  Atla keeps teams intentionally small so every engagement stays senior-led from strategy through
                  implementation. We prioritize clear decision frameworks, practical documentation, and identity systems
                  that scale across channels without drifting in tone, quality, or recognition over time.
                </p>
                <p>
                  Our process is designed for companies moving fast: align on positioning, define the visual and verbal
                  system, and execute launch-ready deliverables that can be operated by internal teams after handoff.
                  This balance of rigor and speed is the core of how we work.
                </p>
              </section>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "flex-start", justifyContent: "space-between", gap: isMobile ? 24 : 0, width: "100%" }}>
          <SectionTitle mobile={isMobile}>Team</SectionTitle>
          <div style={{ width: isMobile ? "100%" : 615, flexShrink: 0 }}>
            {TEAM.map((member) => (
              <div key={member.name} style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                <div style={{ flex: "1 0 0" }}>
                  <p style={RM14}>{member.name}</p>
                </div>
                <div style={{ flex: "1 0 0" }}>
                  <p style={RM14_GRAY}>{member.role}</p>
                </div>
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

      </main>
      </div>
      {/* Footer */}
      <AtlaFooter />
    </div>
  );
}
