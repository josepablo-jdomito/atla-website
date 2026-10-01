import type { ReactNode } from "react";
import { LOVE_ORIGIN, ORGANIZATION_NAME, WHY_WE_LOVE_PATH, formatMetaTitle } from "@shared/siteSeo";
import { SeoHead } from "@/components/seo/SeoHead";
import { isLoveHost } from "@/lib/loveHost";
import { useIsMobile } from "@/hooks/use-mobile";
import { CANVAS_BLOCKS, FUNNEL_STEPS, GRADING_RULES } from "@/data/whyWeLove";
import { CaseToggle } from "@/components/whywelove/CaseToggle";
import { ColdReadDemo } from "@/components/whywelove/ColdReadDemo";
import { KitViewer } from "@/components/whywelove/KitViewer";
import { LiveConsole } from "@/components/whywelove/LiveConsole";
import { MomentMap } from "@/components/whywelove/MomentMap";
import { RingDiagram } from "@/components/whywelove/RingDiagram";
import { InkBleedDefs, PAPER_SURFACE_STYLE } from "@/components/whywelove/Paper";
import { Body, DrawnRule, Headline, StepLabel } from "@/components/whywelove/primitives";
import { CARD, EASE, INK, LABEL_FONT, MUTED, SERIF, label } from "@/components/whywelove/styles";

const TITLE = "Why We Love the Brands We Love";
const DESCRIPTION =
  "A live prototype of the Why We Love the Brands We Love framework. Map the moments, run a cold read on your own touchpoint, and open the kit.";

const MAP_ANCHOR = "the-canvas";

/** Textures are static by design; only the page's own motion is declared here. */
const PAGE_STYLE = `
  ${PAPER_SURFACE_STYLE}
  @keyframes wwl-ring-spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
    .wwl-paper * { animation: none !important; transition: none !important; }
  }
`;

export default function AtlaWhyWeLove() {
  const isMobile = useIsMobile();
  // love.atla.design serves this page at "/". The canonical is that one on every
  // host, so the www copy never competes with it.
  const pathname = isLoveHost() ? "/" : WHY_WE_LOVE_PATH;
  const canonicalUrl = `${LOVE_ORIGIN}/`;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: TITLE,
      description: DESCRIPTION,
      url: canonicalUrl,
      publisher: { "@type": "Organization", name: ORGANIZATION_NAME },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: TITLE, item: canonicalUrl }],
    },
  ];

  return (
    <div className="wwl-paper" style={{ width: "100%", minHeight: "100vh" }}>
      <style>{PAGE_STYLE}</style>
      <InkBleedDefs />
      <SeoHead
        title={formatMetaTitle(TITLE, "Live Prototype")}
        description={DESCRIPTION}
        pathname={pathname}
        canonical={canonicalUrl}
        structuredData={structuredData}
      />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: isMobile ? "56px 6vw 80px" : "88px 8vw 120px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 940,
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 88 : 132,
          }}
        >
          <Hook />
          <Research />
          <Framework />
          <Gap />
          <Fixes />
          <Kit />
          <Principle />
          <Close />
          <Colophon />
        </div>
      </main>
    </div>
  );
}

function Section({
  step,
  children,
}: {
  step?: string;
  children: ReactNode;
}) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 34, alignItems: "center" }}>
      {step ? <StepLabel>{step}</StepLabel> : null}
      {children}
    </section>
  );
}

function Hook() {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center" }}>
      <StepLabel tone="faint">Why We Love the Brands We Love</StepLabel>

      <Headline
        as="h1"
        size="hero"
        lines={[
          [{ text: "Nobody" }, { text: "loves" }, { text: "your" }, { text: "brand." }],
          [{ text: "They", italic: true }, { text: "love", italic: true }, { text: "three" }, { text: "moments" }, { text: "of" }, { text: "it." }],
        ]}
      />

      <Body>
        Brand love has an anatomy. This page is the framework running, not describing itself.
      </Body>

      <LiveConsole />

      <a
        href={`#${MAP_ANCHOR}`}
        style={{
          ...label,
          fontSize: 12,
          textDecoration: "none",
          border: `1.5px solid ${INK}`,
          background: CARD,
          padding: "14px 22px",
          display: "inline-flex",
          alignItems: "center",
          minHeight: 48,
          boxSizing: "border-box",
        }}
      >
        Open the Canvas
      </a>
    </section>
  );
}

function Research() {
  // Short lines, broken by meaning: each one fits on a single line and carries
  // one idea, per the type rules.
  const lines = [
    "Brand love is anthropology, not marketing.",
    "Tribes, belonging, totems.",
    "Love is not spread across a brand.",
    "It concentrates in a few moments.",
    "So you do not improve the brand.",
    "You find the moments and build them.",
  ];

  return (
    <Section step="01 · Research">
      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", maxWidth: 760 }}>
        {lines.map((line) => (
          <p
            key={line}
            style={{
              margin: 0,
              fontFamily: SERIF,
              fontWeight: 300,
              fontSize: "clamp(1.15rem, 2.2vw, 1.75rem)",
              lineHeight: 1.22,
              letterSpacing: "-0.015em",
              color: INK,
              textAlign: "center",
              textWrap: "balance",
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </Section>
  );
}

function Framework() {
  return (
    <section
      id={MAP_ANCHOR}
      style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center", width: "100%" }}
    >
      <StepLabel>02 · Framework</StepLabel>

      <Headline
        lines={[
          [{ text: "The" }, { text: "Canvas:" }, { text: "eight" }, { text: "blocks" }],
          [{ text: "of" }, { text: "brand" }, { text: "love.", italic: true }],
        ]}
      />

      <RingDiagram />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 18,
          width: "100%",
        }}
      >
        {CANVAS_BLOCKS.map((block, index) => (
          <div key={block.id} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <span style={{ ...label, fontSize: 11, color: MUTED }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              style={{
                fontFamily: SERIF,
                fontWeight: 300,
                fontSize: "1.3rem",
                lineHeight: 1.1,
                letterSpacing: "-0.015em",
                color: INK,
              }}
            >
              {block.name}
            </span>
            <span style={{ fontFamily: LABEL_FONT, fontSize: "0.9rem", lineHeight: 1.35, color: MUTED }}>
              {block.covers}
            </span>
          </div>
        ))}
      </div>

      <DrawnRule />

      <Headline
        lines={[
          [{ text: "Five" }, { text: "moments." }, { text: "Twenty-five" }, { text: "touchpoints." }],
        ]}
      />

      <Body>
        The grid is empty on purpose. The filled map is the diagnostic, and it gets filled with your
        customers in the room. One cell is filled so you can see the shape of an answer.
      </Body>

      <MomentMap />

      <div style={{ width: "100%", maxWidth: 620, display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={{ ...label, fontSize: 11, color: MUTED }}>
          The rules every touchpoint is graded against
        </span>
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
          {GRADING_RULES.map((rule, index) => (
            <li
              key={rule}
              style={{
                display: "flex",
                gap: 14,
                fontFamily: LABEL_FONT,
                fontSize: "0.95rem",
                lineHeight: 1.35,
                color: INK,
              }}
            >
              <span style={{ ...label, fontSize: 11, color: MUTED, flexShrink: 0 }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Gap() {
  return (
    <Section step="03 · The gap">
      <Headline
        lines={[
          [{ text: "They" }, { text: "loved" }, { text: "the" }, { text: "dress." }],
          [{ text: "They", italic: true }, { text: "went", italic: true }, { text: "quiet", italic: true }, { text: "after.", italic: true }],
        ]}
      />

      <Body>
        A cold agent, no context about the brand, read every post it could find and mapped each one
        onto the journey.
      </Body>

      <ColdReadDemo />
    </Section>
  );
}

function Fixes() {
  return (
    <Section step="04 · The fixes">
      <CaseToggle />
    </Section>
  );
}

function Kit() {
  return (
    <Section step="The kit">
      <Headline lines={[[{ text: "Four" }, { text: "files." }, { text: "Open" }, { text: "any" }, { text: "of" }, { text: "them.", italic: true }]]} />
      <Body>The deliverable is visible. Proof, not promises.</Body>
      <KitViewer />
    </Section>
  );
}

function Principle() {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "center" }}>
      <DrawnRule width="64px" />
      <Headline
        lines={[
          [{ text: "People" }, { text: "do" }, { text: "not" }, { text: "love" }, { text: "a" }, { text: "whole" }, { text: "brand." }],
          [{ text: "They", italic: true }, { text: "love", italic: true }, { text: "three", italic: true }, { text: "or", italic: true }, { text: "four", italic: true }, { text: "moments.", italic: true }],
        ]}
      />

      <div style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 7 }}>
        <span style={{ ...label, fontSize: 11, color: MUTED }}>How this reaches me</span>
        {FUNNEL_STEPS.map((step, index) => (
          <div
            key={step}
            style={{
              display: "flex",
              gap: 14,
              alignItems: "baseline",
              borderBottom: index === FUNNEL_STEPS.length - 1 ? "none" : `1.2px solid ${"rgba(20,20,20,0.18)"}`,
              padding: "9px 0",
            }}
          >
            <span style={{ ...label, fontSize: 11, color: MUTED, flexShrink: 0 }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span style={{ fontFamily: LABEL_FONT, fontSize: "0.95rem", lineHeight: 1.35, color: INK }}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Close() {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 30, alignItems: "center" }}>
      <Headline
        lines={[
          [{ text: "Your" }, { text: "map" }, { text: "has" }, { text: "a" }, { text: "leak" }, { text: "in" }, { text: "it." }],
          [{ text: "Everyone’s", italic: true }, { text: "does.", italic: true }],
        ]}
      />

      <Body>A Brand Read finds which moment, in your customers’ own words.</Body>

      <a
        href="https://www.atla.design/contact"
        style={{
          ...label,
          fontSize: 12,
          textDecoration: "none",
          border: `1.5px solid ${INK}`,
          background: INK,
          color: CARD,
          padding: "16px 28px",
          display: "inline-flex",
          alignItems: "center",
          minHeight: 48,
          boxSizing: "border-box",
          transition: `transform 240ms ${EASE.pop}`,
        }}
      >
        Let’s talk
      </a>
    </section>
  );
}

/** No logo: the series name is the brand. */
function Colophon() {
  return (
    <footer style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
      <DrawnRule width="40px" />
      <span style={{ ...label, fontSize: 11, color: MUTED, textAlign: "center" }}>
        Why We Love the Brands We Love · a framework by José Pablo Domínguez
      </span>
    </footer>
  );
}
