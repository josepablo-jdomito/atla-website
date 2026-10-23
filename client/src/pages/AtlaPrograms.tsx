import type { CSSProperties, ReactNode } from "react";
import { formatMetaTitle, ORGANIZATION_NAME, SITE_ORIGIN } from "@shared/siteSeo";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { useIsMobile } from "@/hooks/use-mobile";

// Copy source: marketing-plans/atla/oferta-A.md, sections 3, 4 and 6 (offer approved by JP, 2026-10-13).
// No prices and no durations on this page by design.

export const PROGRAMS_META_TITLE = formatMetaTitle("Brand Programs for Companies at a Turning Point", "Atla");
export const PROGRAMS_META_DESCRIPTION =
  "When a brand has to change, start with the Loved or Lost Diagnostic. Then the Atla Brand Program, in three levels, and Brand Stewardship after launch.";

const HERO_COPY = "When your brand has to change, start here.";

const HERO_SUPPORT =
  "A new leader, new capital, a new brand in the house, a new market. These are the moments a brand either earns its next chapter or gets left behind.";

type NumberedItem = { title: string; description: string; href?: string };

const PATH: NumberedItem[] = [
  {
    title: "Loved or Lost Diagnostic",
    description:
      "We find out where your customers fall in love with the brand and where they fall out, then decide with your leadership what has to change.",
  },
  {
    title: "Atla Brand Program",
    description:
      "We build what the evidence calls for: strategy, identity and the system behind them, scoped in one of three levels.",
  },
  {
    title: "Brand Stewardship",
    description: "We stay on after launch so the brand holds its shape as the company grows.",
  },
];

const DIAGNOSTIC_ITEMS: NumberedItem[] = [
  {
    title: "What your customers say",
    description:
      "Every public review and conversation we can reach about your brand and two competitors, coded loved or lost at every stage: discover, choose, buy, first use, repeat, recommend. Where the public record is thin, we tell you.",
  },
  {
    title: "What your team says",
    description: "Six to eight interviews across leadership, sales, product and service.",
  },
  {
    title: "Touchpoint audit",
    description: "Everything a customer sees, from the first ad to the package in their hands.",
  },
  {
    title: "The 20/5 workshop",
    description:
      "A working session with your leadership team. Twenty things the brand could be, reduced to the five it will be.",
  },
  {
    title: "The roadmap",
    description:
      "What to change, what to leave alone, which distinctive assets to protect, and a fixed scope for the program that follows.",
  },
];

const PROGRAM_LEVELS: NumberedItem[] = [
  {
    title: "Core",
    description: "Strategy, identity, the system that holds them together, and the guidelines your team runs it with.",
  },
  {
    title: "Complete",
    description:
      "Everything in Core, plus brand architecture or naming, the touchpoints that matter most (packaging, space or digital) and launch.",
  },
  {
    title: "Integral",
    description:
      "Everything in Complete, plus rollout across multiple US markets and six months of Brand Stewardship included.",
  },
];

const PROOF: NumberedItem[] = [
  {
    title: "Persona",
    description: "A pioneer in personalized vitamins with more than 5 million users.",
    href: "/projects/persona",
  },
  {
    title: "Anything",
    description: "The vibe-coding company valued at $100M.",
    href: "/projects/anything-ai",
  },
];

const LF_REG18: CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 18,
  fontWeight: 400,
  lineHeight: "1.1",
  color: "#222",
  margin: 0,
};

const LF_SB12: CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.48,
  lineHeight: "1.2",
  color: "#6f6f6f",
  textTransform: "uppercase",
  margin: 0,
};

const ITEM_BODY: CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "1.35",
  color: "#222",
  margin: 0,
};

function SectionTitle({ children, mobile = false }: { children: ReactNode; mobile?: boolean }) {
  return (
    <div style={{ flex: "1 0 0", minWidth: 0 }}>
      <h2
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
      </h2>
    </div>
  );
}

function SectionRow({ title, mobile, children }: { title: string; mobile: boolean; children: ReactNode }) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: mobile ? "column" : "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: mobile ? 24 : 0,
        width: "100%",
      }}
    >
      <SectionTitle mobile={mobile}>{title}</SectionTitle>
      <div style={{ width: mobile ? "100%" : 615, flexShrink: 0, display: "flex", flexDirection: "column", gap: 18 }}>
        {children}
      </div>
    </section>
  );
}

function Lead({ children, mobile }: { children: ReactNode; mobile: boolean }) {
  return <div style={{ width: mobile ? "100%" : 456, display: "flex", flexDirection: "column", gap: 18 }}>{children}</div>;
}

function NumberedList({ items, mobile }: { items: NumberedItem[]; mobile: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", marginTop: 6 }}>
      {items.map((item, index) => (
        <div
          key={item.title}
          style={{
            borderTop: "1px solid #d7d7d7",
            padding: mobile ? "20px 0" : "28px 0",
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "76px minmax(0, 1fr)",
            gap: mobile ? 12 : 20,
            alignItems: "start",
          }}
        >
          <p style={LF_SB12}>{String(index + 1).padStart(2, "0")}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h3
              style={{
                fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                fontSize: mobile ? 24 : 32,
                fontWeight: 400,
                lineHeight: "1.1",
                color: "#222",
                margin: 0,
              }}
            >
              {item.href ? (
                <a href={item.href} className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h3>
            <p style={ITEM_BODY}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AtlaPrograms() {
  const isMobile = useIsMobile();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Programs",
        item: `${SITE_ORIGIN}/programs`,
      },
    ],
  };

  const programSchema = [
    {
      name: "Loved or Lost Diagnostic",
      description:
        "Customer evidence at scale, internal interviews, a touchpoint audit and a leadership workshop, ending in a roadmap and a fixed scope.",
    },
    {
      name: "Atla Brand Program",
      description: "Brand strategy, identity and system in three levels: Core, Complete and Integral.",
    },
    {
      name: "Brand Stewardship",
      description: "Ongoing senior brand guidance after launch.",
    },
  ].map((program) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: program.name,
    description: program.description,
    url: `${SITE_ORIGIN}/programs`,
    provider: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: SITE_ORIGIN,
    },
    areaServed: ["United States", "Latin America"],
  }));

  const ctaStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 48,
    padding: "0 22px",
    borderRadius: 999,
    background: "#1c1f27",
    color: "#fafafa",
    fontFamily: "'Libre Franklin', Helvetica, sans-serif",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "-0.01em",
    textDecoration: "none",
    whiteSpace: "nowrap",
    alignSelf: "flex-start",
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={PROGRAMS_META_TITLE}
        description={PROGRAMS_META_DESCRIPTION}
        pathname="/programs"
        structuredData={[breadcrumbSchema, ...programSchema]}
      />
      <div className="atla-dark-surface">
        <AtlaNav />

        <main
          className="atla-enter"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 80 : 240,
            alignItems: "flex-start",
            justifyContent: "center",
            padding: isMobile ? "40px 10px 100px" : "160px 20px 240px",
            boxSizing: "border-box",
          }}
        >
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? 20 : 28,
              width: "100%",
              maxWidth: 960,
            }}
          >
            <p style={LF_SB12}>Programs</p>
            <h1
              style={{
                fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
                fontSize: isMobile ? 40 : 64,
                fontWeight: 400,
                lineHeight: "1.1",
                color: "#222",
                margin: 0,
              }}
            >
              {HERO_COPY}
            </h1>
            <p style={{ ...LF_REG18, maxWidth: 548 }}>{HERO_SUPPORT}</p>
          </section>

          <SectionRow title="The Path" mobile={isMobile}>
            <Lead mobile={isMobile}>
              <p style={LF_REG18}>
                One sequence, three steps. We read the evidence before we design anything, build only what it calls for,
                and stay close once the brand is live.
              </p>
            </Lead>
            <NumberedList items={PATH} mobile={isMobile} />
          </SectionRow>

          <SectionRow title="Diagnose" mobile={isMobile}>
            <Lead mobile={isMobile}>
              <p style={LF_REG18}>
                The Loved or Lost Diagnostic. We read what your customers actually say about you, at scale, and find where
                they fall in love and where they fall out. We talk to your team. We audit every touchpoint. Then we sit
                with your leadership and decide what the brand must keep, and what it must stop saying.
              </p>
            </Lead>
            <NumberedList items={DIAGNOSTIC_ITEMS} mobile={isMobile} />
            <Lead mobile={isMobile}>
              <p style={LF_REG18}>
                You leave with a roadmap and a fixed scope for what comes next. If the problem isn't your brand, we'll tell
                you that too.
              </p>
              <p style={LF_REG18}>
                The Diagnostic is not a rebrand. It brings no logos and no visual concepts, and it is credited in full to
                the Atla Brand Program if you continue within 60 days.
              </p>
            </Lead>
          </SectionRow>

          <SectionRow title="Build" mobile={isMobile}>
            <Lead mobile={isMobile}>
              <p style={LF_REG18}>
                The Atla Brand Program. Three levels, chosen from the roadmap, with the scope fixed before work starts.
                Strategy decisions come first, design decisions second, production last.
              </p>
            </Lead>
            <NumberedList items={PROGRAM_LEVELS} mobile={isMobile} />
          </SectionRow>

          <SectionRow title="Steward" mobile={isMobile}>
            <Lead mobile={isMobile}>
              <p style={LF_REG18}>
                Brand Stewardship. A monthly engagement after launch. We review new work, extend the system as the company
                grows, and help every team and partner use the brand the same way.
              </p>
            </Lead>
          </SectionRow>

          <SectionRow title="Proof" mobile={isMobile}>
            <NumberedList items={PROOF} mobile={isMobile} />
          </SectionRow>

          <SectionRow title="Start" mobile={isMobile}>
            <Lead mobile={isMobile}>
              <p style={LF_REG18}>Atla*. Senior team, founder at the table, no handoff chain.</p>
              <p style={LF_REG18}>
                Tell us what changed: the leader, the capital, the portfolio or the market. We reply with a clear next
                step.
              </p>
              <a href="/contact" style={ctaStyle}>
                Start a project
              </a>
            </Lead>
          </SectionRow>
        </main>
      </div>

      <AtlaFooter />
    </div>
  );
}
