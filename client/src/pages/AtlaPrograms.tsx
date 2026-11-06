import type { ReactNode } from "react";
import { formatMetaTitle, ORGANIZATION_NAME, SITE_ORIGIN } from "@shared/siteSeo";
import { SeoHead } from "@/components/seo/SeoHead";
import { PageShell } from "@/components/site/PageShell";

// Copy source: marketing-plans/atla/oferta-A.md, sections 3, 4 and 6 (offer approved by JP, 2026-10-13).
// No prices and no durations on this page by design.
// PENDING JP APPROVAL (2026-11-05 content wave): offer names aligned to the Services vocabulary
// (Audit, Brand system, Full build, Fractional brand director). Loved or Lost Diagnostic, Core/Complete/Integral
// and Brand Stewardship were the oferta-A names; the steps follow the five on Why Atla.

export const PROGRAMS_META_TITLE = formatMetaTitle("Brand Programs for Companies at a Turning Point", "Atla");
export const PROGRAMS_META_DESCRIPTION =
  "When a brand has to change, start with an audit. Then a brand system or a full build, and a fractional brand director after launch.";

const HERO_COPY = "When your brand has to change, start here.";

const HERO_SUPPORT =
  "A new leader, new capital, a new brand in the house, a new market. At moments like these the brand moves with the company, or the company outgrows it.";

type NumberedItem = { title: string; description: string; href?: string };

const PATH: NumberedItem[] = [
  {
    title: "Audit",
    description:
      "We find out where your customers fall in love with the brand and where they fall out, then decide with your leadership what has to change.",
  },
  {
    title: "Brand system or full build",
    description:
      "We build what the evidence calls for: strategy, identity and the system behind them, scoped before work starts.",
  },
  {
    title: "Fractional brand director",
    description: "We stay on after launch so the brand keeps its shape as the company grows.",
  },
];

const DIAGNOSTIC_ITEMS: NumberedItem[] = [
  {
    title: "What your customers say",
    description:
      "Every public review and conversation we can reach about your brand and its closest competitors, coded loved or lost at every stage: discover, choose, buy, first use, repeat, recommend. Where the public record is thin, we tell you.",
  },
  {
    title: "What your team says",
    description: "Interviews across leadership, sales, product and service.",
  },
  {
    title: "Touchpoint audit",
    description: "Everything a customer sees, from the first ad to the package in their hands.",
  },
  {
    title: "The position workshop",
    description:
      "A working session with your leadership team. Everything the brand could be, reduced to what it will be.",
  },
  {
    title: "The roadmap",
    description:
      "What to change, what to leave alone, which distinctive assets to protect, and a fixed scope for the program that follows.",
  },
];

const PROGRAM_LEVELS: NumberedItem[] = [
  {
    title: "Brand system",
    description: "Strategy, identity, the system that holds them together, and the guidelines your team runs it with.",
  },
  {
    title: "Full build",
    description:
      "Everything in the brand system, plus brand architecture or naming, the touchpoints that matter most (packaging, space or digital) and launch.",
  },
  {
    title: "Full build across markets",
    // PENDING JP APPROVAL: "six months of" removed (v2 rule: no numbers or deadlines promised).
    description:
      "Everything in the full build, plus rollout across US markets, with a fractional brand director after launch.",
  },
];

const PROOF: NumberedItem[] = [
  {
    title: "Persona",
    // PENDING JP APPROVAL: user count removed (v2 rule: no counts).
    description: "The personalized vitamin company.",
    href: "/projects/persona",
  },
  {
    title: "Anything",
    // PENDING JP APPROVAL: valuation removed (v2 rule: no dollar figures).
    description: "The vibe-coding company.",
    href: "/projects/anything-ai",
  },
];

function SectionRow({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="page-section" aria-labelledby={id}>
      <h2 id={id} className="site-section-title page-section__title">
        {title}
      </h2>
      <div className="page-section__body">{children}</div>
    </section>
  );
}

function NumberedList({ items }: { items: NumberedItem[] }) {
  return (
    <ol className="numbered-list">
      {items.map((item) => (
        <li key={item.title} className="numbered-list__item">
          <div className="numbered-list__text">
            <h3 className="site-item-title numbered-list__title">
              {item.href ? (
                <a href={item.href} className="longform-link">
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h3>
            <p className="numbered-list__body">{item.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function AtlaPrograms() {
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
      name: "Audit",
      description:
        "Customer evidence at scale, team interviews, a touchpoint audit and a leadership workshop, ending in a roadmap and a fixed scope.",
    },
    {
      name: "Brand system and full build",
      description: "Brand strategy, identity and the system behind them, scoped from the audit's roadmap.",
    },
    {
      name: "Fractional brand director",
      description: "A senior creative director on the team after launch.",
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

  return (
    <PageShell>
      <SeoHead
        title={PROGRAMS_META_TITLE}
        description={PROGRAMS_META_DESCRIPTION}
        pathname="/programs"
        structuredData={[breadcrumbSchema, ...programSchema]}
      />
      <div className="site-page-body">
        <header className="page-intro">
          <p className="site-label">Programs</p>
          <h1 className="page-intro__title">{HERO_COPY}</h1>
          <p className="page-intro__lead">{HERO_SUPPORT}</p>
        </header>

        <SectionRow id="programs-path" title="The path">
          <p className="longform-text">
            The same steps as every Atla project. We read the market, talk to your people and pick the position with
            your leadership. Then we design the system and hand it over. We stay on if you want us to.
          </p>
          <NumberedList items={PATH} />
        </SectionRow>

        <SectionRow id="programs-diagnose" title="Diagnose">
          <p className="longform-text">
            The audit. We read what your customers say about you, at scale, and find where
            they fall in love and where they fall out. We talk to your team. We audit every touchpoint. Then we sit with
            your leadership and decide what the brand must keep, and what it must stop saying.
          </p>
          <NumberedList items={DIAGNOSTIC_ITEMS} />
          <p className="longform-text">
            You leave with a roadmap and a fixed scope for what comes next. If the problem isn't your brand, we'll tell
            you that too.
          </p>
          {/* PENDING JP APPROVAL: "within 60 days" removed (v2 rule: no numbers or deadlines promised). */}
          <p className="longform-text">
            The audit is not a rebrand. It brings no logos and no visual concepts, and it is credited in full to the
            build when you continue with us.
          </p>
        </SectionRow>

        <SectionRow id="programs-build" title="Build">
          <p className="longform-text">
            A brand system or a full build, chosen from the roadmap, with the scope fixed before work starts. Strategy
            decisions come first, then design, then production.
          </p>
          <NumberedList items={PROGRAM_LEVELS} />
        </SectionRow>

        <SectionRow id="programs-steward" title="Steward">
          <p className="longform-text">
            A fractional brand director: a creative director on your team after launch. We review new work, extend the system as the company
            grows, and help every team and partner use the brand the same way.
          </p>
        </SectionRow>

        <SectionRow id="programs-proof" title="Selected work">
          <NumberedList items={PROOF} />
        </SectionRow>

        <SectionRow id="programs-start" title="Start">
          <p className="longform-text">Atla. Senior team, founder at the table, no handoff chain.</p>
          <p className="longform-text">
            Tell us what changed: the leader, the capital, the portfolio or the market. We reply with a clear next step.
          </p>
          <a href="/brief" className="site-action">
            Start a project
          </a>
        </SectionRow>
      </div>
    </PageShell>
  );
}
