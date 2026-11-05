import type { ReactNode } from "react";
import { formatMetaTitle, ORGANIZATION_NAME, SITE_ORIGIN } from "@shared/siteSeo";
import { SeoHead } from "@/components/seo/SeoHead";
import { PageShell } from "@/components/site/PageShell";

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
    // PENDING JP APPROVAL: "six months of" removed (v2 rule: no numbers or deadlines promised).
    description:
      "Everything in Complete, plus rollout across multiple US markets, with Brand Stewardship included after launch.",
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

function SectionRow({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="page-section" aria-labelledby={id}>
      <h2 id={id} className="page-section__title">
        {title}
      </h2>
      <div className="page-section__body">{children}</div>
    </section>
  );
}

function NumberedList({ items }: { items: NumberedItem[] }) {
  return (
    <ol className="numbered-list">
      {items.map((item, index) => (
        <li key={item.title} className="numbered-list__item">
          <span className="home-section-label" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="numbered-list__text">
            <h3 className="numbered-list__title">
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
          <p className="home-section-label">Programs</p>
          <h1 className="page-intro__title">{HERO_COPY}</h1>
          <p className="page-intro__lead">{HERO_SUPPORT}</p>
        </header>

        <SectionRow id="programs-path" title="The Path">
          <p className="longform-text">
            One sequence, three steps. We read the evidence before we design anything, build only what it calls for, and
            stay close once the brand is live.
          </p>
          <NumberedList items={PATH} />
        </SectionRow>

        <SectionRow id="programs-diagnose" title="Diagnose">
          <p className="longform-text">
            The Loved or Lost Diagnostic. We read what your customers actually say about you, at scale, and find where
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
            The Diagnostic is not a rebrand. It brings no logos and no visual concepts, and it is credited in full to the
            Atla Brand Program when you continue with us.
          </p>
        </SectionRow>

        <SectionRow id="programs-build" title="Build">
          <p className="longform-text">
            The Atla Brand Program. Three levels, chosen from the roadmap, with the scope fixed before work starts.
            Strategy decisions come first, design decisions second, production last.
          </p>
          <NumberedList items={PROGRAM_LEVELS} />
        </SectionRow>

        <SectionRow id="programs-steward" title="Steward">
          <p className="longform-text">
            Brand Stewardship. A monthly engagement after launch. We review new work, extend the system as the company
            grows, and help every team and partner use the brand the same way.
          </p>
        </SectionRow>

        <SectionRow id="programs-proof" title="Proof">
          <NumberedList items={PROOF} />
        </SectionRow>

        <SectionRow id="programs-start" title="Start">
          <p className="longform-text">Atla*. Senior team, founder at the table, no handoff chain.</p>
          <p className="longform-text">
            Tell us what changed: the leader, the capital, the portfolio or the market. We reply with a clear next step.
          </p>
          <a href="/contact" className="brief-primary">
            Start a project
          </a>
        </SectionRow>
      </div>
    </PageShell>
  );
}
