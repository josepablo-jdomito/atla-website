import type { ReactNode } from "react";
import { ORGANIZATION_NAME, SITE_ORIGIN, formatMetaTitle } from "@shared/siteSeo";
import { SeoHead } from "@/components/seo/SeoHead";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { ELEMENTS, FUNNEL_STEPS, GRADING_RULES } from "@/data/whyWeLove";
import { CaseToggle } from "@/components/whywelove/CaseToggle";
import { ColdReadDemo } from "@/components/whywelove/ColdReadDemo";
import { KitNote, KitViewer } from "@/components/whywelove/KitViewer";
import { LiveConsole } from "@/components/whywelove/LiveConsole";
import { MomentMap } from "@/components/whywelove/MomentMap";
import {
  DISPLAY,
  INK,
  LINE,
  MONO,
  MUTED,
  SANS,
  SURFACE,
  body,
  card,
  eyebrow,
} from "@/components/whywelove/styles";

const PATHNAME = "/why-we-love";
const TITLE = "Why We Love The Brands We Love";
const DESCRIPTION =
  "A live prototype of the framework behind Why We Love The Brands We Love. Map the five moments, run a cold read on your own touchpoint, and open the kit.";

const MAP_ANCHOR = "moment-map";

export default function AtlaWhyWeLove() {
  const isMobile = useIsMobile();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: TITLE,
      description: DESCRIPTION,
      url: `${SITE_ORIGIN}${PATHNAME}`,
      publisher: { "@type": "Organization", name: ORGANIZATION_NAME },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: TITLE, item: `${SITE_ORIGIN}${PATHNAME}` },
      ],
    },
  ];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={formatMetaTitle(TITLE, "Live Prototype")}
        description={DESCRIPTION}
        pathname={PATHNAME}
        structuredData={structuredData}
      />

      <div className="atla-dark-surface">
        <AtlaNav />
        <main
          className="atla-enter"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: isMobile ? "22px 14px 68px" : "34px 24px 112px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1060,
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? 48 : 72,
            }}
          >
            <Hero isMobile={isMobile} />
            <Thesis isMobile={isMobile} />
            <MapSection isMobile={isMobile} />
            <RitualSection isMobile={isMobile} />
            <KitSection isMobile={isMobile} />
            <CaseSection isMobile={isMobile} />
            <ElementsSection isMobile={isMobile} />
            <FunnelSection isMobile={isMobile} />
            <CloseSection isMobile={isMobile} />
          </div>
        </main>
      </div>

      <AtlaFooter />
    </div>
  );
}

function Section({
  eyebrowText,
  title,
  children,
  id,
  isMobile,
}: {
  eyebrowText?: string;
  title?: string;
  children: ReactNode;
  id?: string;
  isMobile: boolean;
}) {
  return (
    <section id={id} style={{ display: "flex", flexDirection: "column", gap: isMobile ? 16 : 22 }}>
      {eyebrowText || title ? (
        <header style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {eyebrowText ? <p style={eyebrow}>{eyebrowText}</p> : null}
          {title ? (
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 400,
                fontSize: isMobile ? 26 : 34,
                letterSpacing: -0.5,
                lineHeight: 1.12,
                color: INK,
                margin: 0,
              }}
            >
              {title}
            </h2>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

function Hero({ isMobile }: { isMobile: boolean }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 22 : 30 }}>
      <LiveConsole />

      <h1
        style={{
          fontFamily: DISPLAY,
          fontWeight: 400,
          fontSize: isMobile ? 34 : 54,
          letterSpacing: -1,
          lineHeight: 1.05,
          color: INK,
          margin: 0,
          maxWidth: 760,
        }}
      >
        Nobody loves your brand. They love three moments of it.
      </h1>

      <p style={{ ...body, fontSize: isMobile ? 16 : 18, maxWidth: 640 }}>
        A live prototype of the framework behind <em>Why We Love The Brands We Love</em>, the book.
        Run it below.
      </p>

      <a
        href={`#${MAP_ANCHOR}`}
        style={{
          fontFamily: SANS,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0.3,
          textDecoration: "none",
          minHeight: 48,
          padding: "0 22px",
          borderRadius: 999,
          border: `1px solid ${INK}`,
          background: INK,
          color: "#f5f5f5",
          display: "inline-flex",
          alignItems: "center",
          alignSelf: "flex-start",
        }}
      >
        Open the map
      </a>
    </section>
  );
}

function Thesis({ isMobile }: { isMobile: boolean }) {
  const lines = [
    "Brand love is anthropology, not marketing. Tribes, belonging, totems.",
    "Love is not spread across your brand. It concentrates in a few moments.",
    "So you do not improve the brand. You find the three or four moments and build them on purpose.",
  ];

  return (
    <Section eyebrowText="Thesis" isMobile={isMobile}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {lines.map((line, index) => (
          <p
            key={line}
            style={{
              ...body,
              fontSize: isMobile ? 17 : 20,
              color: INK,
              display: "flex",
              gap: 14,
              alignItems: "baseline",
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 12, color: MUTED }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{line}</span>
          </p>
        ))}
      </div>
    </Section>
  );
}

function MapSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Section
      id={MAP_ANCHOR}
      eyebrowText="The map"
      title="Five moments. Twenty-five touchpoints."
      isMobile={isMobile}
    >
      <p style={{ ...body, maxWidth: 680 }}>
        The grid is empty on purpose. The filled map is the diagnostic, and it gets filled with your
        customers in the room. One cell is filled here so you can see the shape of an answer.
      </p>

      <MomentMap />

      <div style={{ ...card, display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 0.6, color: MUTED }}>
          moments.md · the rules every touchpoint is graded against
        </span>
        <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
          {GRADING_RULES.map((rule) => (
            <li key={rule} style={{ ...body, fontSize: 14 }}>
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function RitualSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Section eyebrowText="The method" title="The Cold-Read Ritual" isMobile={isMobile}>
      <blockquote
        style={{
          margin: 0,
          paddingLeft: 18,
          borderLeft: `2px solid ${INK}`,
          ...body,
          fontSize: isMobile ? 16 : 18,
          color: INK,
        }}
      >
        Give the kit to an agent with zero context. Have it read real customer language and map it to
        the five moments. Whatever it invents, fix the kit until it invents nothing.
      </blockquote>

      <p style={{ ...body, maxWidth: 680 }}>
        264 real posts from brides of a wedding-dress brand, classified live against the five
        moments.
      </p>

      <ColdReadDemo />
    </Section>
  );
}

function KitSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Section eyebrowText="The kit" title="Four files. Open any of them." isMobile={isMobile}>
      <KitViewer />
      <KitNote />
    </Section>
  );
}

function CaseSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Section eyebrowText="Case 01" title="With and without the kit" isMobile={isMobile}>
      <CaseToggle />
    </Section>
  );
}

function ElementsSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Section eyebrowText="The eight" title="What a loved brand has" isMobile={isMobile}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
          gap: 10,
        }}
      >
        {ELEMENTS.map((element, index) => (
          <div
            key={element.title}
            style={{
              ...card,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: INK }}>
              {element.title}
            </span>
            <span style={{ ...body, fontSize: 14 }}>{element.line}</span>
          </div>
        ))}
      </div>

      <p style={{ ...body, fontSize: isMobile ? 16 : 18, color: INK, maxWidth: 640 }}>
        Get all eight, and competitors can copy your product, undercut your price, and still lose.
      </p>
    </Section>
  );
}

function FunnelSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Section eyebrowText="How this connects" title="Comment LOVED" isMobile={isMobile}>
      <ol
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {FUNNEL_STEPS.map((step, index) => (
          <li
            key={step}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              marginLeft: isMobile ? 0 : index * 18,
              borderRadius: 10,
              border: `1px solid ${LINE}`,
              background: SURFACE,
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span style={{ ...body, fontSize: 14, color: INK }}>{step}</span>
          </li>
        ))}
      </ol>

      <p style={{ ...body, fontSize: 14, color: MUTED, maxWidth: 680 }}>
        One metric rules it: comment to email to booked Brand Read call.
      </p>
    </Section>
  );
}

function CloseSection({ isMobile }: { isMobile: boolean }) {
  return (
    <section
      style={{
        ...card,
        padding: isMobile ? 24 : 40,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "flex-start",
      }}
    >
      <h2
        style={{
          fontFamily: DISPLAY,
          fontWeight: 400,
          fontSize: isMobile ? 26 : 36,
          letterSpacing: -0.6,
          lineHeight: 1.1,
          color: INK,
          margin: 0,
          maxWidth: 620,
        }}
      >
        Your map has a leak in it. Everyone's does.
      </h2>

      <p style={{ ...body, fontSize: isMobile ? 16 : 18, maxWidth: 560 }}>
        A Brand Read finds which moment, in your customers' own words.
      </p>

      <a
        href="/contact"
        style={{
          fontFamily: SANS,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0.3,
          textDecoration: "none",
          minHeight: 48,
          padding: "0 24px",
          borderRadius: 999,
          border: `1px solid ${INK}`,
          background: INK,
          color: "#f5f5f5",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        Let's Talk →
      </a>
    </section>
  );
}
