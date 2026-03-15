import {
  ORGANIZATION_NAME,
  SITE_ORIGIN,
} from "@shared/siteSeo";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { useIsMobile } from "@/hooks/use-mobile";

const HERO_COPY =
  "Strategy first. Expression second. Every service here exists to sharpen the brand, not add noise to it.";

const INTRO =
  "Most studios sell services in silos. We don't. Strategy, identity, digital, and creative direction work as one system here — so the brand stays coherent across every surface it touches.";

const SERVICES = [
  {
    title: "Creative Direction",
    description:
      "Setting the visual and conceptual standard for a brand across every touchpoint. Campaigns, content, packaging — everything that goes out should feel like it belongs to the same world. We make sure it does.",
  },
  {
    title: "Brand Strategy",
    description:
      "Positioning, messaging, audience definition, and competitive framing. The foundational thinking that tells you what to say, to whom, and why it matters. Before any design work begins.",
  },
  {
    title: "Identity",
    description:
      "Logo, typography, color, iconography, and the system that holds them together. Built to work across digital and physical, at every scale, without losing coherence.",
  },
  {
    title: "Digital Design",
    description:
      "Websites, landing pages, and digital products designed for clarity, conversion, and brand consistency. UX structure, visual design, and dev-ready handoff.",
  },
  {
    title: "Motion",
    description:
      "Brand animations, logo reveals, social content, and UI motion. Movement that feels intentional, not decorative.",
  },
  {
    title: "Print & Packaging",
    description:
      "Packaging systems, editorial layouts, environmental graphics, and collateral. Physical brand expressions held to the same precision as the digital ones.",
  },
  {
    title: "Art Direction",
    description:
      "Directing photography, illustration, and content production to stay on-brand. We define the visual language and lead the execution — photoshoot, ad campaign, or editorial.",
  },
  {
    title: "Copywriting",
    description:
      "Headlines, taglines, product copy, and brand narratives. Words that sound like the brand, not like a template.",
  },
  {
    title: "Tone of Voice",
    description:
      "A documented system for how the brand speaks: vocabulary, sentence structure, attitude, and channel-specific guidelines. So every team member and collaborator writes in one voice.",
  },
];

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

const SERVICE_BODY: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "1.35",
  color: "#222",
  margin: 0,
};

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

export default function AtlaServices() {
  const isMobile = useIsMobile();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Services",
        item: `${SITE_ORIGIN}/services`,
      },
    ],
  };

  const servicesSchema = SERVICES.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: SITE_ORIGIN,
    },
    areaServed: ["United States", "Latin America"],
  }));

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title="Services — Atla Branding Studio"
        description="Brand strategy, identity design, digital design, and creative direction for companies that take their brand seriously."
        pathname="/services"
        structuredData={[breadcrumbSchema, ...servicesSchema]}
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

        <div
          style={{
            position: isMobile ? "relative" : "absolute",
            inset: isMobile ? "auto" : 0,
            top: 0,
            left: 0,
            width: "100%",
            height: isMobile ? 300 : 750,
          }}
        >
          <img
            src="/figmaAssets/about-hero.jpg"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              pointerEvents: "none",
            }}
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
              lineHeight: "1.1",
              color: "#222",
              width: isMobile ? "100%" : 548.72,
              margin: 0,
            }}
          >
            {HERO_COPY}
          </p>
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
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: isMobile ? 24 : 0,
            width: "100%",
          }}
        >
          <SectionTitle mobile={isMobile}>Services</SectionTitle>
          <div style={{ width: isMobile ? "100%" : 615, flexShrink: 0 }}>
            <div style={{ width: isMobile ? "100%" : 456 }}>
              <p style={LF_REG18}>{INTRO}</p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: isMobile ? 24 : 0,
            width: "100%",
          }}
        >
          <SectionTitle mobile={isMobile}>Offerings</SectionTitle>
          <div style={{ width: isMobile ? "100%" : 615, flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              {SERVICES.map((service, index) => (
                <div
                  key={service.title}
                  style={{
                    borderTop: "1px solid #d7d7d7",
                    padding: isMobile ? "20px 0" : "28px 0",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "76px minmax(0, 1fr)",
                    gap: isMobile ? 12 : 20,
                    alignItems: "start",
                  }}
                >
                  <p style={LF_SB12}>{String(index + 1).padStart(2, "0")}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <p
                      style={{
                        fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                        fontSize: isMobile ? 24 : 32,
                        fontWeight: 400,
                        lineHeight: "1.1",
                        color: "#222",
                        margin: 0,
                      }}
                    >
                      {service.title}
                    </p>
                    <p style={SERVICE_BODY}>{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          id="contact"
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: isMobile ? 24 : 0,
            width: "100%",
          }}
        >
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
                <p
                  style={{
                    fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                    fontSize: 48,
                    fontWeight: 400,
                    lineHeight: "1.1",
                    color: "#fafafa",
                    margin: 0,
                  }}
                >
                  Start a Project
                </p>
                <p
                  style={{
                    fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                    fontSize: 20,
                    fontWeight: 500,
                    lineHeight: "1.1",
                    color: "#fafafa",
                    margin: 0,
                    maxWidth: 360,
                  }}
                >
                  We work best when strategy and execution are aligned from day one. Let&apos;s talk scope, timing,
                  and what the brand needs next.
                </p>
                <a
                  href="/about#contact"
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
      </main>
      </div>

      <AtlaFooter />
    </div>
  );
}
