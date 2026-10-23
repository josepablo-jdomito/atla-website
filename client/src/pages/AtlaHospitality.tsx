import type { CSSProperties, ReactNode } from "react";
import { formatMetaTitle } from "@shared/siteSeo";
import { SeoHead } from "@/components/seo/SeoHead";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { AtlaHeader } from "@/components/atla/AtlaHeader";
import { buildServiceSchema } from "@/components/atla/AtlaLongformLayout";
import { useIsMobile } from "@/hooks/use-mobile";

const PATHNAME = "/hospitality";
const DESCRIPTION =
  "Identity systems for restaurants and hotels, designed down to the matchbox and delivered ready for the vendors who make them. Rústico, Christophe's, Temakase.";

const SANITY = "https://cdn.sanity.io/images/dvufm78f/production";
const sanityImage = (id: string, width: number) => `${SANITY}/${id}?w=${width}&auto=format&q=80`;

const DISPLAY = "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif";
const SANS = "'Libre Franklin', Helvetica, sans-serif";
const INK = "#222";
const MUTED = "#6f6f6f";
const RULE = "#d4d4d4";

type CaseImage = { src: string; alt: string; ratio: string; wide?: boolean };

type HospitalityCase = {
  number: string;
  name: string;
  place: string;
  kind: string;
  summary: string;
  scope: string[];
  hero: CaseImage;
  details: CaseImage[];
  link?: { href: string; label: string };
};

const HERO: CaseImage = {
  src: sanityImage("7cc46aa684db97a142951eea093612947de54122-2616x1445.png", 2000),
  alt: "Rústico business cards on an agave leaf",
  ratio: "2616 / 1445",
};

const CASES: HospitalityCase[] = [
  {
    number: "01",
    name: "Rústico",
    place: "Los Cabos",
    kind: "Open-air restaurant at Acre Resort",
    summary:
      "Five courses outdoors, guided by what is ready now. Start in the garden, finish in the fire. The identity carries that from the leather menu to the bread bag: a heritage wordmark for the restaurant, a hand-led signature for everything the guest holds.",
    scope: ["Identity", "Menus", "Stationery", "Printed matter", "Packaging", "Website"],
    hero: {
      src: sanityImage("786c593836b374914a16522439f46d67613ba53a-1741x756.png", 2000),
      alt: "Rústico signature on a sandstone texture with the dinner invitation",
      ratio: "1741 / 756",
    },
    details: [
      {
        src: sanityImage("18a02d9a640324bce8de4272d67087c7c1ab3fbe-1396x1781.png", 1000),
        alt: "Rústico menu cover embossed in leather",
        ratio: "1396 / 1781",
      },
      {
        src: sanityImage("e728f43c869356fa3a8bcdc4d8fd21c82d6ff8d4-1201x1870.png", 1000),
        alt: "Rústico bread bag with the signature mark",
        ratio: "1201 / 1870",
      },
    ],
    link: { href: "/projects/rustico", label: "See the full project" },
  },
  {
    number: "02",
    name: "Christophe's Fine Foods",
    place: "Chicago",
    kind: "Chef-led prepared foods market",
    summary:
      "A new market built from nothing. Logotype, monogram, awning, uniforms, totes and a reheatable meal tray system, delivered with a supplier sheet so the owner could place every order directly.",
    scope: ["Identity", "Packaging", "Signage", "Uniforms", "Website"],
    hero: {
      src: "/hospitality/christophes-storefront.webp",
      alt: "Christophe's Fine Foods awning and monogram sign",
      ratio: "16 / 9",
    },
    details: [
      {
        src: "/hospitality/christophes-apron.webp",
        alt: "Christophe's staff apron",
        ratio: "1000 / 1407",
      },
      {
        src: "/hospitality/christophes-tote.webp",
        alt: "Christophe's tote bag",
        ratio: "1000 / 1407",
      },
      {
        src: "/hospitality/christophes-trays.webp",
        alt: "Christophe's reheatable meal trays with labels",
        ratio: "16 / 9",
        wide: true,
      },
    ],
  },
  {
    number: "03",
    name: "Temakase",
    place: "New York",
    kind: "Hand roll bars",
    summary:
      "An identity and a character. Mako, drawn after Ebisu, the deity of fishing and fortune, softens the brand without replacing the logo. He carries the takeout on the window, the catering box and the sidewalk sign.",
    scope: ["Identity", "Character", "Storefront", "Menus", "Catering", "Takeout"],
    hero: {
      src: "/hospitality/temakase-storefront.webp",
      alt: "Temakase storefront with window graphics and sidewalk sign",
      ratio: "2400 / 1240",
    },
    details: [
      {
        src: "/hospitality/temakase-menu.webp",
        alt: "Temakase lunch menu",
        ratio: "1000 / 1407",
      },
      {
        src: "/hospitality/temakase-catering-box.webp",
        alt: "Temakase catering box with Mako",
        ratio: "1000 / 1407",
      },
    ],
  },
];

const TOUCHPOINTS = [
  "Naming and brand architecture",
  "Identity and signature marks",
  "Menus and wine lists",
  "Facades, awnings and signage",
  "Uniforms",
  "Takeout, catering and retail packaging",
  "Stationery and printed matter",
  "Characters and illustration",
  "Websites and booking",
  "Vendor files and supplier specs",
];

const STAGES = [
  {
    name: "Audit",
    body: "We start on your property. Brand, guest journey and every touchpoint, read the way a guest reads them. You get one architecture for every room, restaurant and service.",
    proof: "Used at Casa Las Tortugas, Holbox: a hotel with four restaurants and a spa.",
  },
  {
    name: "Brand",
    body: "Identity to facade. Every object designed in context and handed over as production files, matched to the supplier who prints, stitches or builds it.",
    proof: "Rústico, Christophe's and Temakase.",
  },
  {
    name: "Stay",
    body: "A weekly seat at your table after launch. New concepts, new rooms, the website, and every new object held to the same standard.",
    proof: "Temakase, after the identity shipped.",
  },
];

const eyebrowStyle: CSSProperties = {
  fontFamily: SANS,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.48,
  lineHeight: "1.2",
  textTransform: "uppercase",
  color: MUTED,
  margin: 0,
};

const bodyStyle: CSSProperties = {
  fontFamily: SANS,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "1.55",
  color: INK,
  margin: 0,
};

const ctaStyle: CSSProperties = {
  fontFamily: SANS,
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: 0.4,
  lineHeight: "1.2",
  textTransform: "uppercase",
  textDecoration: "none",
  color: INK,
  minHeight: 48,
  display: "inline-flex",
  alignItems: "center",
  padding: "12px 4px",
};

function Figure({ image, eager = false }: { image: CaseImage; eager?: boolean }) {
  return (
    <img
      src={image.src}
      alt={image.alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      style={{
        display: "block",
        width: "100%",
        height: "auto",
        aspectRatio: image.ratio,
        objectFit: "cover",
        backgroundColor: "#ececea",
      }}
    />
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: `1px solid ${RULE}`, paddingTop: 20 }}>
      <p style={eyebrowStyle}>{eyebrow}</p>
      <h2
        style={{
          fontFamily: DISPLAY,
          fontSize: isMobile ? 30 : 44,
          fontWeight: 400,
          lineHeight: "1.1",
          color: INK,
          margin: 0,
          maxWidth: 820,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function CaseStudy({ item }: { item: HospitalityCase }) {
  const isMobile = useIsMobile();

  return (
    <article style={{ display: "flex", flexDirection: "column", gap: isMobile ? 14 : 20 }}>
      <Figure image={item.hero} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 0.34fr) minmax(0, 1fr)",
          gap: isMobile ? 10 : 24,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <p style={eyebrowStyle}>
            {item.number} · {item.place}
          </p>
          <h3
            style={{
              fontFamily: DISPLAY,
              fontSize: isMobile ? 28 : 36,
              fontWeight: 400,
              lineHeight: "1.1",
              color: INK,
              margin: 0,
            }}
          >
            {item.name}
          </h3>
          <p style={{ ...bodyStyle, color: MUTED }}>{item.kind}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
          <p style={bodyStyle}>{item.summary}</p>
          <p style={{ ...bodyStyle, color: MUTED }}>{item.scope.join(" · ")}</p>
          {item.link ? (
            <a href={item.link.href} className="atla-link" style={ctaStyle}>
              {item.link.label} →
            </a>
          ) : null}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: item.details.length > 1 && !isMobile ? "repeat(2, minmax(0, 1fr))" : "1fr",
          gap: isMobile ? 8 : 12,
          alignItems: "start",
        }}
      >
        {item.details.map((image) => (
          <div key={image.src} style={{ gridColumn: image.wide ? "1 / -1" : undefined }}>
            <Figure image={image.wide ? image : { ...image, ratio: "4 / 5" }} />
          </div>
        ))}
      </div>
    </article>
  );
}

export default function AtlaHospitality() {
  const isMobile = useIsMobile();

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={formatMetaTitle("Hospitality", "Atla")}
        description={DESCRIPTION}
        pathname={PATHNAME}
        image={sanityImage("7cc46aa684db97a142951eea093612947de54122-2616x1445.png", 1200)}
        structuredData={buildServiceSchema({
          path: PATHNAME,
          name: "Branding for restaurants and hotels",
          description: DESCRIPTION,
        })}
      />
      <AtlaHeader />
      <div className="atla-dark-surface">
        <main
          className="atla-enter"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: isMobile ? "22px 8px 68px" : "34px 12px 112px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1160,
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? 40 : 72,
            }}
          >
            <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 14 : 18 }}>
              <p style={eyebrowStyle}>Hospitality</p>
              <h1
                style={{
                  fontFamily: DISPLAY,
                  fontSize: isMobile ? 40 : 72,
                  fontWeight: 400,
                  lineHeight: "1.04",
                  color: INK,
                  margin: 0,
                  maxWidth: 980,
                }}
              >
                Your guest never reads the brand book. They hold the menu.
              </h1>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 640 }}>
                <p style={bodyStyle}>
                  Atla builds identities for restaurants and hotels that have to work on a facade, a menu, a uniform
                  and a booking page at once. Every object is designed in context and handed over ready for the vendor
                  who makes it.
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <a href="/contact" className="atla-link" style={ctaStyle}>
                  Tell us about your property →
                </a>
                <a href="#work" className="atla-link" style={{ ...ctaStyle, color: MUTED }}>
                  See the work ↓
                </a>
              </div>
              <div style={{ marginTop: isMobile ? 8 : 18 }}>
                <Figure image={HERO} eager />
              </div>
            </section>

            <section id="work" style={{ display: "flex", flexDirection: "column", gap: isMobile ? 32 : 56, scrollMarginTop: 80 }}>
              <SectionHead eyebrow="Selected work" title="Three places to eat. Every object designed." />
              {CASES.map((item) => (
                <CaseStudy key={item.name} item={item} />
              ))}
            </section>

            <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 20 : 28 }}>
              <SectionHead eyebrow="What we design" title="Everything a guest touches." />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) minmax(0, 0.8fr)",
                  gap: isMobile ? 20 : 32,
                  alignItems: "start",
                }}
              >
                <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {TOUCHPOINTS.map((item, index) => (
                    <li
                      key={item}
                      style={{
                        ...bodyStyle,
                        display: "grid",
                        gridTemplateColumns: "40px 1fr",
                        padding: "12px 0",
                        borderBottom: `1px solid ${RULE}`,
                      }}
                    >
                      <span style={{ color: MUTED }}>{String(index + 1).padStart(2, "0")}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
                <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  <img
                    src="/hospitality/temakase-mako.webp"
                    alt="Mako, the Temakase character, carrying a takeout bag"
                    loading="lazy"
                    decoding="async"
                    style={{ display: "block", width: "100%", height: "auto", aspectRatio: "1600 / 1082", backgroundColor: "#C98538" }}
                  />
                  <figcaption style={{ ...eyebrowStyle }}>Mako · Temakase</figcaption>
                </figure>
              </div>
            </section>

            <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 20 : 28 }}>
              <SectionHead eyebrow="How we work" title="Audit. Brand. Stay." />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
                  gap: isMobile ? 24 : 28,
                }}
              >
                {STAGES.map((stage, index) => (
                  <div
                    key={stage.name}
                    style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `2px solid ${INK}`, paddingTop: 16 }}
                  >
                    <p style={eyebrowStyle}>{String(index + 1).padStart(2, "0")}</p>
                    <h3 style={{ fontFamily: DISPLAY, fontSize: isMobile ? 28 : 34, fontWeight: 400, lineHeight: "1.1", color: INK, margin: 0 }}>
                      {stage.name}
                    </h3>
                    <p style={bodyStyle}>{stage.body}</p>
                    <p style={{ ...bodyStyle, color: MUTED }}>{stage.proof}</p>
                  </div>
                ))}
              </div>
            </section>

            <section
              style={{
                borderTop: `1px solid ${RULE}`,
                paddingTop: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <h2
                style={{
                  fontFamily: DISPLAY,
                  fontSize: isMobile ? 30 : 44,
                  fontWeight: 400,
                  lineHeight: "1.1",
                  color: INK,
                  margin: 0,
                  maxWidth: 820,
                }}
              >
                Opening, renovating or adding a concept?
              </h2>
              <p style={{ ...bodyStyle, maxWidth: 640 }}>
                Tell us about the property and what the guest should feel when they walk in. José Pablo Domínguez,
                founder and creative director, reads every message.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <a href="/contact" className="atla-link" style={ctaStyle}>
                  Start a conversation →
                </a>
                <a href="mailto:josepablo@atla.design" className="atla-link" style={{ ...ctaStyle, color: MUTED }}>
                  josepablo@atla.design
                </a>
              </div>
            </section>
          </div>
        </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
