import type { ReactNode } from "react";
import { formatMetaTitle, ORGANIZATION_NAME, SITE_ORIGIN } from "@shared/siteSeo";
import { SeoHead } from "@/components/seo/SeoHead";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { useIsMobile } from "@/hooks/use-mobile";

export type FaqItem = {
  question: string;
  answer: ReactNode;
};

export type LongformLinkItem = {
  href: string;
  label: string;
  description?: string;
};

export function buildServiceSchema({
  path,
  name,
  description,
  faqItems,
}: {
  path: string;
  name: string;
  description: string;
  faqItems?: FaqItem[];
}) {
  const schema: Array<Record<string, unknown>> = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name,
      description,
      url: `${SITE_ORIGIN}${path}`,
      areaServed: ["United States", "Latin America"],
      provider: {
        "@type": "Organization",
        name: ORGANIZATION_NAME,
        url: SITE_ORIGIN,
      },
    },
  ];

  if (faqItems && faqItems.length > 0) {
    schema.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: typeof item.answer === "string" ? item.answer : "",
        },
      })),
    });
  }

  return schema;
}

export function buildBreadcrumbSchema(path: string, label: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: label,
        item: `${SITE_ORIGIN}${path}`,
      },
    ],
  };
}

export function AtlaLongformLayout({
  pathname,
  title,
  titleSuffix = "Atla",
  description,
  image = "/figmaAssets/about-hero.jpg",
  structuredData,
  children,
}: {
  pathname: string;
  title: string;
  titleSuffix?: string;
  description: string;
  image?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
  children: ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={formatMetaTitle(title, titleSuffix)}
        description={description}
        pathname={pathname}
        image={image}
        structuredData={structuredData}
      />
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
              gap: isMobile ? 24 : 34,
            }}
          >
            {children}
          </div>
        </main>
      </div>
      <AtlaFooter />
    </div>
  );
}

export function LongformHero({
  h1,
  eyebrow,
  paragraphs,
  cta,
}: {
  h1: string;
  eyebrow?: string;
  paragraphs: ReactNode[];
  cta?: ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 14 : 16 }}>
      {eyebrow ? (
        <p
          style={{
            fontFamily: "'Libre Franklin', Helvetica, sans-serif",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0.48,
            lineHeight: "1.2",
            textTransform: "uppercase",
            color: "#6f6f6f",
            margin: 0,
          }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1
        style={{
          fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
          fontSize: isMobile ? 38 : 64,
          fontWeight: 400,
          lineHeight: "1.08",
          color: "#222",
          margin: 0,
          maxWidth: 960,
        }}
      >
        {h1}
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 920 }}>
        {paragraphs.map((paragraph, index) => (
          <p
            key={`hero-paragraph-${index}`}
            style={{
              fontFamily: "'Libre Franklin', Helvetica, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: 0.28,
              lineHeight: "1.55",
              color: "#222",
              margin: 0,
            }}
          >
            {paragraph}
          </p>
        ))}
      </div>
      {cta ? <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>{cta}</div> : null}
    </section>
  );
}

export function LongformSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 0.34fr) minmax(0, 1fr)",
        gap: isMobile ? 10 : 24,
        alignItems: "start",
        paddingTop: isMobile ? 6 : 10,
      }}
    >
      <h2
        style={{
          fontFamily: "'Libre Franklin', Helvetica, sans-serif",
          fontSize: isMobile ? 16 : 20,
          fontWeight: 700,
          lineHeight: "1.3",
          letterSpacing: 0.1,
          color: "#222",
          margin: 0,
        }}
      >
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </section>
  );
}

export function LongformParagraph({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'Libre Franklin', Helvetica, sans-serif",
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: 0.28,
        lineHeight: "1.55",
        color: "#222",
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

export function LongformSubTitle({ children }: { children: ReactNode }) {
  return (
    <h3
      style={{
        fontFamily: "'Libre Franklin', Helvetica, sans-serif",
        fontSize: 15,
        fontWeight: 700,
        lineHeight: "1.45",
        color: "#222",
        margin: 0,
      }}
    >
      {children}
    </h3>
  );
}

export function LongformCta({
  title,
  description,
  actions,
}: {
  title: string;
  description: ReactNode;
  actions: LongformLinkItem[];
}) {
  return (
    <section
      style={{
        borderTop: "1px solid #d4d4d4",
        paddingTop: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h2
        style={{
          fontFamily: "'Libre Franklin', Helvetica, sans-serif",
          fontSize: 22,
          fontWeight: 700,
          lineHeight: "1.3",
          color: "#222",
          margin: 0,
        }}
      >
        {title}
      </h2>
      <LongformParagraph>{description}</LongformParagraph>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        {actions.map((action) => (
          <a
            key={action.href}
            href={action.href}
            className="atla-link"
            style={{
              fontFamily: "'Libre Franklin', Helvetica, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 0.4,
              lineHeight: "1.2",
              textTransform: "uppercase",
              textDecoration: "none",
              color: "#222",
              minHeight: 48,
              display: "inline-flex",
              alignItems: "center",
              padding: "12px 4px",
            }}
          >
            {action.label}
          </a>
        ))}
      </div>
    </section>
  );
}
