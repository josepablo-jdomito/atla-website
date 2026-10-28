import {
  formatMetaTitle,
  ORGANIZATION_NAME,
  SITE_ORIGIN,
} from "@shared/siteSeo";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { useIsMobile } from "@/hooks/use-mobile";
import { getImageDimensions } from "@shared/imageDelivery";

// Copy approved by JP on 2026-10-27 (Notion: Atla — Web · Services copy v1). No figures on the site.
const HERO_COPY =
  "We find the reasons people could fall in love with your brand. Then we build on the ones you can deliver without compromise.";

const INTRO =
  "We start with what your customers already say about you, in their own words. We read it through Why We Love the Brands We Love, José Pablo's framework for why people choose a brand and stay with it. Then we design from what we find.";

const DIAGNOSTIC_STEPS = [
  {
    lead: "What your customers say.",
    text: "Public reviews and conversations about your brand and your competitors, read stage by stage, from the first time they hear of you to the day they recommend you.",
  },
  { lead: "What your team says.", text: "Interviews across leadership, sales, product and service." },
  { lead: "Every touchpoint.", text: "Everything a customer sees, from the first ad to the box." },
  {
    lead: "A workshop with your leadership.",
    text: "Every reason a customer could fall in love with the brand, cut to the few you will deliver without compromise.",
  },
  { lead: "A roadmap.", text: "What changes, what stays, and the exact scope of what comes next." },
];

const NEXT_STEPS = [
  {
    label: "Program",
    title: "Atla Brand Program",
    description:
      "The scope from the roadmap, built: strategy, identity, system and guidelines, by the team that ran the Diagnostic.",
  },
  {
    label: "Stewardship",
    title: "Brand Stewardship",
    description: "After launch, we stay on to keep the brand on course as the company grows.",
  },
];

const SERVICES = [
  {
    title: "Creative Direction",
    description:
      "Setting the visual and conceptual standard for a brand across every touchpoint. Campaigns, content, packaging — everything that goes out should feel like it belongs to the same world. We make sure it does.",
  },
  {
    title: "Brand Strategy",
    description:
      "Positioning, messaging, audience and competitive framing, decided before anyone opens a design file.",
  },
  {
    title: "Identity",
    description:
      "Logo, typography, color, iconography, and the system that holds them together. Built to work across digital and physical touchpoints, at every scale, without losing coherence.",
  },
  {
    title: "Digital Design",
    description:
      "Websites, landing pages, and digital products designed for clarity, conversion, and brand consistency. UX structure, visual design, and dev-ready handoff.",
  },
  {
    title: "Motion",
    description:
      "Brand animations, logo reveals, social content and UI motion, built from the same system as the identity.",
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
      "Headlines, taglines, product copy and narratives, written in the company's own voice.",
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
  color: "#6f6f6f",
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
          fontFamily: "'Libre Franklin', Helvetica, sans-serif",
          fontSize: mobile ? 40 : 140,
          fontWeight: 500,
          lineHeight: "1.1",
          color: "#222",
          margin: 0,
          // Long titles wrap instead of running into the copy column ("Where to Start" overlapped it by 192px).
          whiteSpace: "normal",
        }}
      >
        {children}
      </p>
    </div>
  );
}

export default function AtlaServices() {
  const isMobile = useIsMobile();
  const heroDimensions = getImageDimensions("/figmaAssets/about-hero.jpg");

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
        title={formatMetaTitle("Brand Strategy, Identity, and Digital Design Services", "Atla")}
        description="Explore Atla services in brand strategy, identity design, digital design, motion, packaging, and creative direction for ambitious companies."
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
            alt="Atla services hero image"
            width={heroDimensions?.width}
            height={heroDimensions?.height}
            fetchPriority="high"
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
            // The approved headline runs 8 lines at 64px; from 200 its last line clipped at the hero's edge.
            top: isMobile ? "auto" : 160,
            width: isMobile ? "100%" : 635,
            padding: isMobile ? "20px 10px 0" : 0,
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              fontFamily: "Helvetica, sans-serif",
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
            Atla branding and digital design services
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
          <SectionTitle mobile={isMobile}>How it starts</SectionTitle>
          <div style={{ width: isMobile ? "100%" : 615, flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <div
                  style={{
                    borderTop: "1px solid #d7d7d7",
                    padding: isMobile ? "20px 0" : "28px 0",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "110px minmax(0, 1fr)",
                    gap: isMobile ? 12 : 20,
                    alignItems: "start",
                  }}
              >
                <p style={LF_SB12}>Diagnostic</p>
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
                    Loved or Lost Diagnostic
                  </p>
                  <p style={SERVICE_BODY}>
                    Before we design anything, we find where people fall in love with your brand and where they fall out.
                  </p>
                  {DIAGNOSTIC_STEPS.map((step) => (
                    <p key={step.lead} style={SERVICE_BODY}>
                      <span style={{ fontWeight: 600 }}>{step.lead}</span> {step.text}
                    </p>
                  ))}
                  <p style={SERVICE_BODY}>
                    If the evidence says the problem is product, price or operations, the Diagnostic says so.
                  </p>
                </div>
              </div>
              {NEXT_STEPS.map((step) => (
                <div
                  key={step.label}
                  style={{
                    borderTop: "1px solid #d7d7d7",
                    padding: isMobile ? "20px 0" : "28px 0",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "110px minmax(0, 1fr)",
                    gap: isMobile ? 12 : 20,
                    alignItems: "start",
                  }}
                >
                  <p style={LF_SB12}>{step.label}</p>
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
                      {step.title}
                    </p>
                    <p style={SERVICE_BODY}>{step.description}</p>
                  </div>
                </div>
              ))}
              <div
                  style={{
                    borderTop: "1px solid #d7d7d7",
                    padding: isMobile ? "20px 0" : "28px 0",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "110px minmax(0, 1fr)",
                    gap: isMobile ? 12 : 20,
                    alignItems: "start",
                  }}
              >
                <p style={LF_SB12}>Earlier stage</p>
                <p style={SERVICE_BODY}>
                  A smaller team or a first brand? Start with the Branding Analysis, a written read on where your brand
                  stands today.{" "}
                  <a href="https://start.atla.design" className="atla-link" style={{ color: "#222" }}>
                    Take the Branding Analysis
                  </a>
                </p>
              </div>
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
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: isMobile ? 24 : 0,
            width: "100%",
          }}
        >
          <SectionTitle mobile={isMobile}>Why Atla</SectionTitle>
          <div style={{ width: isMobile ? "100%" : 615, flexShrink: 0, display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ width: isMobile ? "100%" : 456, display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ ...LF_REG18, fontWeight: 600 }}>Atla also runs WeLoveDaily.</p>
              <p style={LF_REG18}>
                WeLoveDaily is a design curation channel on Instagram and a publication at{" "}
                <a href="https://welovedaily.net" className="atla-link" style={{ color: "#222" }}>
                  welovedaily.net
                </a>
                . Every day we pick the brand work worth publishing. That same eye goes into every Atla project.
              </p>
            </div>
            <div style={{ width: isMobile ? "100%" : 456, display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ ...LF_REG18, fontWeight: 600 }}>Founder at the table, no handoff chain.</p>
              <p style={LF_REG18}>
                José Pablo is at the table on every engagement, with a small senior team across Austin, Mexico City,
                Barcelona, Lima and Caracas.
              </p>
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
          <SectionTitle mobile={isMobile}>Where to Start</SectionTitle>
          <div style={{ width: isMobile ? "100%" : 615, flexShrink: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={LF_REG18}>
              If your team needs the sequence, start with{" "}
              <a href="/brand-strategy" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                brand strategy
              </a>
              . If you need delivery mechanics, review{" "}
              <a href="/how-we-work" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                how we work
              </a>
              . If you need proof of execution, browse{" "}
              <a href="/" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                selected work
              </a>
              .
            </p>
            <p style={LF_REG18}>
              Category-specific entry points:{" "}
              <a href="/hospitality-branding" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                hospitality branding
              </a>
              ,{" "}
              <a href="/cpg-branding" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                CPG branding
              </a>
              ,{" "}
              <a href="/wellness-branding" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                wellness branding
              </a>
              , and{" "}
              <a href="/saas-branding" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                SaaS branding
              </a>
              .
            </p>
            <p style={LF_REG18}>
              Live examples:{" "}
              <a href="/projects/the-bridge" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                The Bridge
              </a>
              ,{" "}
              <a href="/projects/ando" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                Ando
              </a>
              , and{" "}
              <a href="/projects/conscious-care-co" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                Conscious Care Co
              </a>
              .
            </p>
            <p style={LF_REG18}>
              Narrative publishing template:{" "}
              <a href="/journal/how-to-brief-a-branding-agency" className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                how to brief a branding agency
              </a>
              .
            </p>
          </div>
        </div>

      </main>
      </div>

      <AtlaFooter />
    </div>
  );
}
