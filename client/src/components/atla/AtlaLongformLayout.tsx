import type { ReactNode } from "react";
import { formatMetaTitle, SITE_ORIGIN } from "@shared/siteSeo";
import { SeoHead } from "@/components/seo/SeoHead";
import { PageShell } from "@/components/site/PageShell";

export type FaqItem = {
  question: string;
  answer: ReactNode;
};

export type LongformLinkItem = {
  href: string;
  label: string;
  description?: string;
};

/** Moved to a framework-free module so script/build.ts can emit the same JSON-LD. */
export { buildServiceSchema } from "@/lib/serviceSchema";

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

/** The six SEO landings: v2 shell, one h1, labelled h2 rows, 17px body text at 68ch. */
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
  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle(title, titleSuffix)}
        description={description}
        pathname={pathname}
        image={image}
        structuredData={structuredData}
      />
      <div className="site-page-body longform">{children}</div>
    </PageShell>
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
  return (
    <header className="page-intro longform-intro">
      {eyebrow ? <p className="site-label">{eyebrow}</p> : null}
      <h1 className="page-intro__title">{h1}</h1>
      <div className="longform-intro__body">
        {paragraphs.map((paragraph, index) => (
          <p key={`hero-paragraph-${index}`} className="longform-text">
            {paragraph}
          </p>
        ))}
      </div>
      {cta ? <div className="longform-actions">{cta}</div> : null}
    </header>
  );
}

export function LongformSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="page-section longform-section">
      <h2 className="longform-section__title">{title}</h2>
      <div className="longform-section__body">{children}</div>
    </section>
  );
}

export function LongformParagraph({ children }: { children: ReactNode }) {
  return <p className="longform-text">{children}</p>;
}

export function LongformSubTitle({ children }: { children: ReactNode }) {
  return <h3 className="longform-subtitle">{children}</h3>;
}

/** One question and its answer inside a FAQ section. */
export function LongformFaqItem({ children }: { children: ReactNode }) {
  return <div className="longform-faq">{children}</div>;
}

/** The primary action on a landing: the dark pill used across v2. */
export function LongformAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="brief-primary">
      {children}
    </a>
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
    <section className="page-section longform-section">
      <h2 className="longform-section__title">{title}</h2>
      <div className="longform-section__body">
        <p className="longform-text">{description}</p>
        <div className="longform-actions">
          {actions.map((action, index) => (
            <a
              key={action.href}
              href={action.href}
              className={index === 0 ? "brief-primary" : "longform-link longform-link--action"}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
