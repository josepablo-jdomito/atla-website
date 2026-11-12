import type { CSSProperties } from "react";
import { Link } from "wouter";
import {
  AtlaLongformLayout,
  LongformCta,
  LongformHero,
  LongformParagraph,
  LongformSection,
} from "@/components/atla/AtlaLongformLayout";
import { PRIORITY_ATTRS } from "@/components/site/media";
import { useSiteProjects, type SiteProject } from "@/components/site/siteProjects";
import { INDUSTRY_SERVICE_PAGES, buildServiceSchema } from "@/lib/serviceSchema";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";

/**
 * Body copy for /branding-agency-austin. Layout below reads only from this block.
 * Title, meta description, canonical and Service JSON-LD are not in here.
 */
const COPY = {
  hero: {
    h1: "A branding agency working from Austin",
    lead: "Atla is a small studio of senior people, working from Austin, Mexico City, Barcelona, Lima and Caracas. We build brand strategy and identity for companies in the United States and abroad, and we build them for the years after launch. AI does the slow parts. A creative director decides what ships, every time.",
  },
  why: {
    title: "Why Atla",
    reasons: [
      "The people at kickoff are the people doing the work. Strategy comes before design, and design comes before production. Every creative decision answers to a brand strategy document, so the brand holds when your team, your next agency and your newest hire start using it.",
      "We write guidelines your team can use without us. A brand system at Atla is strategy, identity and guidelines, built by one team so nothing is lost between them. When the job calls for it, the same team takes the system through a full build: website, decks, social and packaging. A creative director can also stay on with you, making the decisions and holding the standard.",
    ],
    proofBefore:
      "The proof is already on the work. We audited Casa Las Tortugas and set its brand architecture, a MICHELIN Key. We wrote the brand architecture and brand book for Acre's restaurant, a MICHELIN Green Star. Who we are, and how the studio is built, is on ",
    proofLink: { href: "/about", label: "Why Atla" },
    proofAfter: ".",
  },
  cases: {
    title: "Selected work",
    items: [
      {
        slug: "anything-ai",
        href: "/projects/anything-ai",
        name: "Anything AI",
        body: 'Anything, first called Create, is an AI app builder: you type what you want and it comes back as a working product. The company came to Atla with a launch date and a brand to rebuild before it. In the middle of the project they chose the name Anything, and the identity had to carry it. The brand became typographic, an editorial serif italic set against a plain grotesk, and stayed free of the glow and gradients the category leans on. Website, brand identity and motion: the homepage with its "i want to build a..." prompt, launch assets, and a brand book in PDF and Figma. Zaria Zinn, founding designer, wrote the day after launch that it went very well, and that the computer in a field had been a huge hit. The funding round that followed made TechCrunch. United States, 2026.',
      },
      {
        slug: "angeles-wellness",
        href: "/projects/angeles-wellness",
        name: "Angeles Wellness",
        body: 'Angeles Wellness is an herbal cleansing brand from Los Angeles, started by Fernando Ramirez. In 2025 he came to Atla for the messaging, the branding and the cohesiveness of the brand. The brand had grown fast under another name and needed to speak to its audience again. The line that carried was "your body isn\'t broken, it\'s blocked." We built the identity, the packaging for capsules, electrolytes and loose-leaf tea, social templates and the website hero. His site now opens with the strategy line. Brand identity and motion. United States, 2025.',
      },
    ],
  },
  how: {
    title: "How we work",
    lead: "Every project follows the same steps, scaled to scope: read the market, talk to your people, pick the position, design the system, and hand it over. We show options grounded in the strategy, with a recommendation.",
    beforeProcess: "The full process is on ",
    process: { href: "/how-we-work", label: "how we work" },
    beforeScope: ". The full scope is on ",
    scope: { href: "/services", label: "services" },
    after: ".",
  },
  cta: {
    title: "Start a project",
    body: "Tell us about the brand and what it needs to do next. We will tell you if we are the right fit.",
    action: { href: "/brief", label: "Start a project" },
  },
} as const;

const SERVICE_PAGE = INDUSTRY_SERVICE_PAGES.brandingAgencyAustin;

/** Same widths the project film strip asks for, so a case hero is the asset the project page opens on. */
const CASE_WIDTHS = [480, 800, 1200, 1600, 2000, 2400];
const CASE_SIZES = "(min-width: 1280px) calc(100vw - 80px), (min-width: 768px) calc(100vw - 48px), 100vw";

function CaseHero({ project, priority }: { project: SiteProject | undefined; priority: boolean }) {
  if (!project) return <span className="austin-case__slot" aria-hidden="true" />;
  const src = getOptimizedImageUrl(project.coverImage, { width: CASE_WIDTHS[2], quality: 82 }) || project.coverImage;
  const dims = getImageDimensions(project.coverImage);
  return (
    <img
      className="austin-case__media"
      src={src}
      srcSet={buildImageSrcSet(project.coverImage, CASE_WIDTHS, { quality: 82 })}
      sizes={CASE_SIZES}
      alt=""
      width={dims?.width}
      height={dims?.height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={project.coverColor ? ({ background: project.coverColor } as CSSProperties) : undefined}
      {...(priority ? PRIORITY_ATTRS : null)}
    />
  );
}

export default function AtlaBrandingAgencyAustin() {
  const { projects } = useSiteProjects();
  const bySlug = new Map(projects.map((project) => [project.slug, project]));

  return (
    <AtlaLongformLayout
      pathname="/branding-agency-austin"
      title="Austin Branding Agency"
      titleSuffix="Strategy and Identity"
      description="A branding studio working from Austin. Brand strategy and identity for companies in the US and abroad. See work for Anything AI and Angeles Wellness."
      structuredData={buildServiceSchema(SERVICE_PAGE)}
    >
      <LongformHero h1={COPY.hero.h1} paragraphs={[COPY.hero.lead]} />

      <LongformSection title={COPY.why.title}>
        <div className="austin-reasons">
          {COPY.why.reasons.map((text) => (
            <div key={text.slice(0, 24)} className="austin-reason">
              <LongformParagraph>{text}</LongformParagraph>
            </div>
          ))}
          <div className="austin-reason">
            <LongformParagraph>
              {COPY.why.proofBefore}
              <a href={COPY.why.proofLink.href} className="longform-link">
                {COPY.why.proofLink.label}
              </a>
              {COPY.why.proofAfter}
            </LongformParagraph>
          </div>
        </div>
      </LongformSection>

      <section className="austin-work" aria-labelledby="austin-work-title">
        <h2 id="austin-work-title" className="site-section-title">
          {COPY.cases.title}
        </h2>
        <div className="austin-cases">
          {COPY.cases.items.map((item, index) => (
            <article key={item.slug} className="austin-case">
              <Link href={item.href} className="austin-case__link">
                <h3 className="austin-case__name">{item.name}</h3>
                <CaseHero project={bySlug.get(item.slug)} priority={index === 0} />
              </Link>
              <p className="longform-text">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <LongformSection title={COPY.how.title}>
        <LongformParagraph>{COPY.how.lead}</LongformParagraph>
        <LongformParagraph>
          {COPY.how.beforeProcess}
          <a href={COPY.how.process.href} className="longform-link">
            {COPY.how.process.label}
          </a>
          {COPY.how.beforeScope}
          <a href={COPY.how.scope.href} className="longform-link">
            {COPY.how.scope.label}
          </a>
          {COPY.how.after}
        </LongformParagraph>
      </LongformSection>

      <LongformCta
        title={COPY.cta.title}
        description={COPY.cta.body}
        actions={[{ href: COPY.cta.action.href, label: COPY.cta.action.label }]}
      />
    </AtlaLongformLayout>
  );
}
