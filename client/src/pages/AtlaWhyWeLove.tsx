import { useCallback, useState } from "react";
import { LOVE_ORIGIN, ORGANIZATION_NAME, WHY_WE_LOVE_PATH, formatMetaTitle } from "@shared/siteSeo";
import { SeoHead } from "@/components/seo/SeoHead";
import { isLoveHost } from "@/lib/loveHost";
import { useIsMobile } from "@/hooks/use-mobile";
import { CANVAS_BLOCKS } from "@/data/whyWeLove";
import { THESIS, THESIS_CLOSE } from "@/data/thesis";
import { ThesisSection } from "@/components/whywelove/Thesis";
import { BrandRead } from "@/components/whywelove/BrandRead";
import { DecisionHistory, KitBrowser } from "@/components/whywelove/KitBrowser";
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
  const [mirrorLive, setMirrorLive] = useState(true);
  const handleMirrorUnavailable = useCallback(() => setMirrorLive(false), []);
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
          <Hook mirrorLive={mirrorLive} />

          {THESIS.map((section) => (
            <ThesisSection key={section.id} section={section}>
              {section.id === "anatomy" ? <Canvas /> : null}
              {section.id === "moments" ? <MomentLine /> : null}
            </ThesisSection>
          ))}

          <Mirror onUnavailable={handleMirrorUnavailable} />
          <Kit />
          <History />
          <Person />
          <Close />
          <Colophon />
        </div>
      </main>
    </div>
  );
}

function Hook({ mirrorLive }: { mirrorLive: boolean }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 30, alignItems: "center" }}>
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
        {mirrorLive
          ? "An argument about where brand love actually lives, why it is never spread evenly, and what that changes about the work. There is a live read partway down that will find the leak in your own brand, in your customers’ words."
          : "An argument about where brand love actually lives, why it is never spread evenly, and what that changes about the work."}
      </Body>
    </section>
  );
}

function Mirror({ onUnavailable }: { onUnavailable: () => void }) {
  return (
    <section
      id={MAP_ANCHOR}
      style={{ display: "flex", flexDirection: "column", gap: 34, alignItems: "center", width: "100%" }}
    >
      <BrandRead onUnavailable={onUnavailable} />
    </section>
  );
}

/** The emblem, placed inside the section that argues for it. */
function Canvas() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 34, alignItems: "center" }}>
      <RingDiagram />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 20,
          width: "100%",
        }}
      >
        {CANVAS_BLOCKS.map((block, index) => (
          <div key={block.id} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <span style={{ ...label, fontSize: 10, color: MUTED }}>
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
    </div>
  );
}

/** Five moments, five slots each, so the shape of the map is visible before it is filled. */
function MomentLine() {
  const moments = ["Discovery", "First contact", "Purchase", "Use", "Return"];

  return (
    <div
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 2,
        borderTop: `1.5px solid ${INK}`,
      }}
    >
      {moments.map((moment, index) => (
        <div key={moment} style={{ display: "flex", flexDirection: "column", gap: 10, padding: "16px 12px 20px 0" }}>
          <span style={{ ...label, fontSize: 10, color: MUTED }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontSize: "1.2rem",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
              color: INK,
            }}
          >
            {moment}
          </span>
          <div style={{ display: "flex", gap: 5 }}>
            {Array.from({ length: 5 }).map((_, slot) => (
              <span
                key={slot}
                style={{ width: 9, height: 9, borderRadius: 999, border: `1.2px solid ${INK}`, opacity: 0.45 }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Kit() {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "center", width: "100%" }}>
      <StepLabel>The deliverable</StepLabel>
      <Headline
        lines={[
          [{ text: "We" }, { text: "run" }, { text: "Atla" }, { text: "on" }, { text: "this." }],
          [{ text: "Here", italic: true }, { text: "is", italic: true }, { text: "the", italic: true }, { text: "whole", italic: true }, { text: "thing.", italic: true }],
        ]}
      />
      <Body>
        Not a sample. Atla’s own brand kit, generated out of the repository that builds this site.
        The values are read from the stylesheet it renders with. Open any file.
      </Body>
      <KitBrowser />
    </section>
  );
}

/**
 * The part a PDF cannot do. A brand system is only a source of truth if you can
 * see what changed and why, including the decisions that were reversed.
 */
function History() {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 30, alignItems: "center", width: "100%" }}>
      <StepLabel>What changed, and why</StepLabel>
      <Headline
        lines={[
          [{ text: "A" }, { text: "guideline" }, { text: "tells" }, { text: "you" }, { text: "the" }, { text: "answer." }],
          [{ text: "A", italic: true }, { text: "system", italic: true }, { text: "tells", italic: true }, { text: "you", italic: true }, { text: "why.", italic: true }],
        ]}
      />
      <Body>
        This is our own commit log, unedited. In September we built a hero for the home page, spent
        a day refining it, and then removed it. The reasoning for all three is still here, which is
        the only reason the next person does not rebuild it.
      </Body>
      <DecisionHistory />
    </section>
  );
}

/**
 * The guide's stated goal is that a reader comes away wanting this person, which
 * needs the person on the page.
 *
 * DRAFT: written in José's voice and not yet approved by him. It makes no claim
 * about his history, his clients or his results, only an argument about the
 * work, so there is nothing here to verify. It still needs his one pass before
 * this page is public. A portrait or an audio line slots in beside it when he
 * sends one; until then the section is type alone rather than a placeholder.
 */
function Person() {
  const lines = [
    "Most brand work I am asked to do is a repaint.",
    "New logo, new palette, the same three moments quietly failing.",
    "So I stopped selling repaints.",
    "What I do instead is find the moments. Usually three. Sometimes four.",
    "They are rarely the ones the founder expected, and they are usually cheaper to fix than the rebrand that was budgeted for.",
    "The read at the top of this page is the first hour of that work, run in public, on whoever is reading.",
    "If it found something that stung, that is the job working.",
  ];

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center", width: "100%" }}>
      <StepLabel>Who runs it</StepLabel>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
        {lines.map((line) => (
          <p
            key={line}
            style={{
              margin: 0,
              fontFamily: SERIF,
              fontWeight: 300,
              fontSize: "clamp(1.15rem, 2.2vw, 1.6rem)",
              lineHeight: 1.26,
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

      <span style={{ ...label, fontSize: 11, color: MUTED }}>
        Jos\u00e9 Pablo Dom\u00ednguez · founder, Atla
      </span>
    </section>
  );
}

function Close() {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 28, alignItems: "center" }}>
      <DrawnRule width="64px" />
      <Headline lines={[THESIS_CLOSE.heading]} />
      <Body>{THESIS_CLOSE.body}</Body>

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
        Book a Brand Read
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
        Why We Love the Brands We Love · a framework by Jos\u00e9 Pablo Dom\u00ednguez
      </span>
    </footer>
  );
}
