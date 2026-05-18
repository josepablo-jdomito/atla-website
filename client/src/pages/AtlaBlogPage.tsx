import { useMemo } from "react";
import { useRoute } from "wouter";
import { ORGANIZATION_NAME, SITE_ORIGIN } from "@shared/siteSeo";
import {
  AtlaLongformLayout,
  LongformCta,
  LongformParagraph,
  LongformSection,
  LongformSubTitle,
  buildBreadcrumbSchema,
} from "@/components/atla/AtlaLongformLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import NotFound from "@/pages/not-found";

type BlogEntry = {
  slug: string;
  titleTag: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  sections: Array<{
    title: string;
    paragraphs: string[];
  }>;
  links: Array<{ href: string; label: string }>;
};

const BLOG_ENTRIES: BlogEntry[] = [
  {
    slug: "case-study-template",
    titleTag: "Case Study Template for Branding Projects | Atla",
    metaDescription:
      "Reusable structure for branding case studies covering strategy, identity decisions, rollout sequencing, measurable outcomes, and internal linking.",
    h1: "Case study template: branding projects",
    intro: [
      "Use this structure for all narrative case studies. The objective is to explain strategic decisions, not just show visuals.",
      "Target 1,500–2,000 words and include measurable outcomes when available.",
    ],
    sections: [
      {
        title: "Recommended URL and metadata format",
        paragraphs: [
          "URL: /blog/[client-name]-branding-case-study",
          "Title tag: [Client] Branding Case Study: [Strategic Hook] | Atla",
          "Meta description: How Atla helped [Client] [strategic outcome]. Brand strategy, identity, and [specific deliverable] for [industry].",
          "Schema: Article + BreadcrumbList",
        ],
      },
      {
        title: "Section structure",
        paragraphs: [
          "H1: [Client Name]: [Strategic framing]",
          "Intro (about 150 words): what the company does, core challenge, and why it mattered.",
          "The situation: project trigger, business context, and what was not working.",
          "The strategic approach: discovery findings, positioning choices, and decisive market insight.",
          "The identity system: design decisions mapped directly to strategic rationale.",
          "The rollout: where the system was applied and how implementation was managed.",
          "The outcome: metrics when available, otherwise operational outcomes and business impact.",
          "Closing CTA: If you are facing a similar challenge, start a conversation.",
        ],
      },
      {
        title: "Required internal links per case study",
        paragraphs: [
          "Link to the corresponding project page (/projects/[slug]).",
          "Link to the relevant vertical page (/hospitality-branding, /cpg-branding, /wellness-branding, or /saas-branding).",
          "Link to /brand-strategy and /how-we-work.",
          "Link to /services and at least one additional related blog post.",
        ],
      },
    ],
    links: [
      { href: "/brand-strategy", label: "Read brand strategy →" },
      { href: "/how-we-work", label: "Read how we work →" },
      { href: "/", label: "Browse work archive →" },
    ],
  },
  {
    slug: "the-bridge-hospitality-branding-case-study",
    titleTag: "The Bridge Case Study: Hospitality Branding for a Bali Hotel Concept | Atla",
    metaDescription:
      "How Atla built a hospitality brand for The Bridge in Bali, from strategic positioning through identity, digital launch planning, and editorial art direction standards.",
    h1: "The Bridge: building a hospitality brand that travels",
    intro: [
      "The Bridge is a hotel and restaurant concept in Bali positioned at the intersection of travel culture and editorial sensibility. The founders needed an identity system that could compete with established boutique hospitality brands while still feeling native to place.",
      "The category challenge was specificity. Bali hospitality is saturated with tropical clichés and generic minimalism. The Bridge needed to feel like neither.",
    ],
    sections: [
      {
        title: "The situation",
        paragraphs: [
          "The founding team had a clear guest-experience vision but no visual system to express it. Architecture and programming were advancing, while the brand still existed mostly in conversation.",
          "They needed investor materials before fundraising conversations, a digital pre-launch presence, and a coherent on-property system before opening.",
        ],
      },
      {
        title: "The strategic approach",
        paragraphs: [
          "Discovery showed the real advantage was editorial perspective, not only the property. The founders approached hospitality like editors: every detail curated, every surface intentional.",
          "That became the strategic anchor. We positioned The Bridge as an editorial hospitality brand and mapped whitespace against competitors that over-indexed on relaxation, wellness, or adventure.",
        ],
      },
      {
        title: "The identity system",
        paragraphs: [
          "The visual language was designed to feel refined without becoming corporate, and travel-forward without reading like tourism advertising.",
          "The logo system uses typographic decisions inspired by editorial mastheads. The palette stays restrained, with one accent and tightly defined photography treatment rules.",
          "Typography combines an editorial serif for headlines with a practical sans for operational contexts. Art-direction standards define composition, lighting, and image-use rules so execution remains consistent without constant creative-director intervention.",
        ],
      },
      {
        title: "The rollout",
        paragraphs: [
          "The system was deployed across investor decks, pre-launch website, social templates, menu standards, key card collateral, and signage specifications.",
          "The website was intentionally editorial before booking functionality to establish narrative value and press readiness ahead of opening.",
        ],
      },
      {
        title: "The outcome",
        paragraphs: [
          "The identity gave fundraising conversations a concrete and credible operating vision. Pre-launch content generated attention before opening, and the on-property team gained clear execution rules that reduced daily creative decision overhead.",
        ],
      },
    ],
    links: [
      { href: "/projects/the-bridge", label: "View The Bridge project →" },
      { href: "/hospitality-branding", label: "Hospitality branding at Atla →" },
      { href: "/brand-strategy", label: "Our brand strategy process →" },
      { href: "/how-we-work", label: "How we run engagements →" },
    ],
  },
  {
    slug: "ando-cpg-packaging-case-study",
    titleTag: "Ando Case Study: CPG Packaging for a Supplement Brand | Atla",
    metaDescription:
      "How Atla designed Ando's CPG identity and supplement packaging system, from positioning to retail-ready rollout across shelf, DTC channels, and launch asset systems.",
    h1: "Ando: packaging a supplement brand for shelf and screen",
    intro: [
      "Ando entered a supplement category defined by visual noise. The founders had strong product confidence but needed packaging and brand architecture that worked in three-second shelf decisions and digital thumbnails.",
      "The mandate was clear: launch retail-ready with a system that could scale from initial SKUs into future line extensions without redesign churn.",
    ],
    sections: [
      {
        title: "The situation",
        paragraphs: [
          "Ando was pre-launch with formula and manufacturing in place, but no identity, packaging, or digital system. Timeline pressure required simultaneous strategic clarity and production realism.",
          "Competitive research showed visual sameness: either clinical austerity or playful maximalism. Neither matched Ando's intended positioning.",
        ],
      },
      {
        title: "The strategic approach",
        paragraphs: [
          "Core insight: Ando's audience had already decided to buy supplements. They were not looking for education; they were looking for confidence and fit within daily life.",
          "We positioned Ando as a lifestyle supplement brand: clear, premium, and countertop-appropriate rather than pharmacy-coded.",
        ],
      },
      {
        title: "The identity system",
        paragraphs: [
          "The system prioritizes hierarchy and readability. Brand first, benefit second, flavor third, and support information elsewhere.",
          "SKU color assignments were designed for line scalability. The front panel intentionally avoids claim clutter so the package reads instantly from distance and remains clear in digital commerce.",
          "Production constraints were considered from the first round to avoid redesign at manufacturer handoff.",
        ],
      },
      {
        title: "The rollout",
        paragraphs: [
          "Deliverables included identity system, primary and secondary packaging for launch SKUs, e-commerce photography direction, Amazon A+ layouts, DTC landing, and social templates.",
          "All files were production-tested with the manufacturer before final sign-off.",
        ],
      },
      {
        title: "The outcome",
        paragraphs: [
          "Ando launched with coherent shelf and digital presence. The system has since supported additional SKU expansion through controlled extensions rather than structural redesign.",
        ],
      },
    ],
    links: [
      { href: "/projects/ando", label: "View Ando project →" },
      { href: "/cpg-branding", label: "CPG branding at Atla →" },
      { href: "/brand-strategy", label: "Our brand strategy process →" },
      { href: "/services", label: "See full services →" },
    ],
  },
  {
    slug: "conscious-care-co-wellness-branding-case-study",
    titleTag: "Conscious Care Co Case Study: Wellness Brand Identity | Atla",
    metaDescription:
      "How Atla built a trust-first wellness identity for Conscious Care Co, aligning strategy, visual systems, and rollout assets across digital, packaging, and campaign touchpoints.",
    h1: "Conscious Care Co: wellness branding without category clichés",
    intro: [
      "Wellness branding often collapses into sameness: muted palettes, nature symbols, and language that sounds interchangeable across brands.",
      "Conscious Care Co needed a unified system that felt intentional and distinct, while still communicating care and trust.",
    ],
    sections: [
      {
        title: "The situation",
        paragraphs: [
          "The business had clear philosophy and growing traction, but brand assets had been built piecemeal by different vendors. The result was visible inconsistency and diluted trust signals.",
          "The objective was a coherent system that could scale across digital, print, packaging, and day-to-day operations.",
        ],
      },
      {
        title: "The strategic approach",
        paragraphs: [
          "Competitive review showed most wellness players position on generic outcomes: calm, balance, clarity. Conscious Care Co's differentiation was not outcome language but deliberate method.",
          "We anchored positioning on intentional care as operating principle, then translated that into visual and verbal precision standards.",
        ],
      },
      {
        title: "The identity system",
        paragraphs: [
          "The system uses restraint as signal: clean wordmark, controlled palette, and tightly structured typographic hierarchy.",
          "The palette and hierarchy were tested against category leaders to ensure distinctiveness at glance while preserving approachability.",
          "Collateral, social templates, and label systems were designed from shared spacing and hierarchy logic, not ad hoc compositions.",
        ],
      },
      {
        title: "The rollout",
        paragraphs: [
          "Deliverables included complete identity system, brand guidelines, digital asset library, social templates, packaging label standards, and print collateral framework.",
          "Documentation was written for non-design users so internal teams could self-serve routine execution without degrading quality.",
        ],
      },
      {
        title: "The outcome",
        paragraphs: [
          "The new system removed fragmentation and improved internal alignment. Feedback shifted from product-only praise to explicit brand recognition, signaling stronger coherence between offering and perception.",
        ],
      },
    ],
    links: [
      { href: "/projects/conscious-care-co", label: "View Conscious Care Co project →" },
      { href: "/wellness-branding", label: "Wellness branding at Atla →" },
      { href: "/brand-strategy", label: "Our brand strategy process →" },
      { href: "/how-we-work", label: "How we work →" },
    ],
  },
  {
    slug: "the-complete-rebranding-process-from-planning-to-launch",
    titleTag: "The Complete Rebranding Process from Planning to Launch | Atla",
    metaDescription:
      "A practical rebranding sequence covering discovery, strategic reset, identity system development, rollout planning, and launch execution.",
    h1: "The complete rebranding process from planning to launch",
    intro: [
      "A rebrand fails when teams treat it as a visual update instead of a strategic and operational transition.",
      "This sequence is the process we use to avoid rework: discovery, strategy, identity, rollout, and adoption control.",
    ],
    sections: [
      {
        title: "1) Discovery and diagnosis",
        paragraphs: [
          "Define what is broken in market perception, internal alignment, and customer journey. Audit competitors and current assets.",
        ],
      },
      {
        title: "2) Strategic reset",
        paragraphs: [
          "Lock positioning, audience focus, and messaging hierarchy before any visual exploration starts.",
        ],
      },
      {
        title: "3) Identity system design",
        paragraphs: [
          "Translate strategy into ownable visual and verbal language that can scale across channels.",
        ],
      },
      {
        title: "4) Rollout sequencing",
        paragraphs: [
          "Plan launch waves by business risk and visibility, then migrate high-impact surfaces first.",
        ],
      },
      {
        title: "5) Adoption and governance",
        paragraphs: [
          "Equip internal teams with standards, templates, and approval logic so the new brand can survive daily use.",
        ],
      },
    ],
    links: [
      { href: "/brand-strategy", label: "Start with brand strategy →" },
      { href: "/how-we-work", label: "See full process model →" },
      { href: "/services", label: "Review services →" },
    ],
  },
];

function toMetaTitle(base: string) {
  return base.replace(/\s+\|\s+Atla$/i, "").trim();
}

export default function AtlaBlogPage() {
  const [, params] = useRoute("/blog/:slug");
  const isMobile = useIsMobile();
  const slug = params?.slug ?? "";
  const entry = useMemo(() => BLOG_ENTRIES.find((item) => item.slug === slug) ?? null, [slug]);
  const relatedPosts = useMemo(
    () =>
      BLOG_ENTRIES.filter((item) => item.slug !== slug && item.slug !== "case-study-template")
        .slice(0, 2)
        .map((item) => ({ href: `/blog/${item.slug}`, label: item.h1 })),
    [slug],
  );

  if (!entry) {
    return <NotFound />;
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: toMetaTitle(entry.titleTag),
    description: entry.metaDescription,
    mainEntityOfPage: `${SITE_ORIGIN}/blog/${entry.slug}`,
    author: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
    },
  };

  return (
    <AtlaLongformLayout
      pathname={`/blog/${entry.slug}`}
      title={entry.titleTag}
      description={entry.metaDescription}
      titleSuffix=""
      structuredData={[articleSchema, buildBreadcrumbSchema(`/blog/${entry.slug}`, toMetaTitle(entry.titleTag))]}
    >
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
          Case study
        </p>
        <h1
          style={{
            fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
            fontSize: isMobile ? 38 : 56,
            fontWeight: 400,
            lineHeight: "1.06",
            color: "#222",
            margin: 0,
            maxWidth: 980,
          }}
        >
          {entry.h1}
        </h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 920 }}>
          {entry.intro.map((paragraph, index) => (
            <LongformParagraph key={`intro-${index}`}>{paragraph}</LongformParagraph>
          ))}
        </div>
      </section>

      {entry.sections.map((section) => (
        <LongformSection key={section.title} title={section.title}>
          {section.paragraphs.map((paragraph, index) => (
            <LongformParagraph key={`${section.title}-${index}`}>{paragraph}</LongformParagraph>
          ))}
        </LongformSection>
      ))}

      <LongformSection title="Related links">
        {entry.links.map((link) => (
          <LongformSubTitle key={link.href}>
            <a href={link.href} className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
              {link.label}
            </a>
          </LongformSubTitle>
        ))}
        {relatedPosts.map((post) => (
          <LongformSubTitle key={post.href}>
            <a href={post.href} className="atla-link" style={{ color: "#222", textDecoration: "none" }}>
              Related post: {post.label}
            </a>
          </LongformSubTitle>
        ))}
      </LongformSection>

      <LongformCta
        title="Facing a similar challenge?"
        description="If your team is dealing with similar strategic or execution constraints, start a conversation."
        actions={[
          { href: "/contact", label: "Start a project →" },
          { href: "/", label: "Browse selected work →" },
        ]}
      />
    </AtlaLongformLayout>
  );
}
