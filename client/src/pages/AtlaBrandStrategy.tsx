import { ORGANIZATION_NAME, SITE_ORIGIN } from "@shared/siteSeo";
import {
  AtlaLongformLayout,
  LongformCta,
  LongformHero,
  LongformParagraph,
  LongformSection,
  LongformSubTitle,
  buildBreadcrumbSchema,
} from "@/components/atla/AtlaLongformLayout";

const FAQ_ITEMS = [
  {
    question: "How much does brand strategy cost?",
    answer:
      "Atla strategy engagements typically range from $15K–$40K depending on scope, company complexity, and audience depth.",
  },
  {
    question: "Can we run strategy and design at the same time?",
    answer:
      "We do not recommend it. Strategy decisions change creative direction. Running both in parallel usually forces avoidable rework.",
  },
  {
    question: "What if we already have a strategy?",
    answer:
      "We review it first. If it is actionable, we can move into design. If it has gaps, we scope a focused sprint to close them.",
  },
  {
    question: "Do you do strategy without design?",
    answer:
      "Yes. Strategy-only engagements are standard when teams have internal design capacity or incumbent partners.",
  },
  {
    question: "How is this different from consulting output?",
    answer:
      "We produce strategy built to be executed in design and language, not strategy slides disconnected from implementation realities.",
  },
];

export default function AtlaBrandStrategy() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Brand strategy: the decisions that make design work",
    description:
      "How brand strategy works in practice: positioning, messaging, audience definition, and competitive framing before identity design starts.",
    author: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
    },
    mainEntityOfPage: `${SITE_ORIGIN}/brand-strategy`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <AtlaLongformLayout
      pathname="/brand-strategy"
      title="Brand Strategy for Growing Companies"
      titleSuffix="Process and Framework"
      description="How brand strategy actually works — positioning, messaging, audience definition, and competitive framing. The strategic foundation before design begins."
      structuredData={[articleSchema, faqSchema, buildBreadcrumbSchema("/brand-strategy", "Brand Strategy")]}
    >
      <LongformHero
        eyebrow="Brand Strategy"
        h1="Brand strategy: the decisions that make design work"
        paragraphs={[
          "Brand strategy is the set of decisions that determine how a company is understood in its market. Not the logo. Not the palette. Not the tagline. The strategic layer underneath all of them.",
          "When strategy is strong, design decisions become faster and defensible. When strategy is missing, teams default to subjective debates without a shared framework.",
          "This page documents exactly how Atla approaches strategy: what it includes, what it does not include, and what the process produces.",
        ]}
      />

      <LongformSection title="What brand strategy actually is">
        <LongformParagraph>
          Strategy is a structured decision process that answers five questions before creative production begins.
        </LongformParagraph>
        <LongformSubTitle>1. What does this company stand for?</LongformSubTitle>
        <LongformParagraph>
          The core point of view that separates this company from lookalike competitors. This is positioning, and it is
          the primary strategic decision.
        </LongformParagraph>
        <LongformSubTitle>2. Who is the audience, specifically?</LongformSubTitle>
        <LongformParagraph>
          Not broad demographics. Actionable audience segments with motivations, objections, and decision patterns.
        </LongformParagraph>
        <LongformSubTitle>3. How should the brand speak?</LongformSubTitle>
        <LongformParagraph>
          Messaging hierarchy with priority statements, supporting proof, and language constraints.
        </LongformParagraph>
        <LongformSubTitle>4. What does the competitive landscape look like?</LongformSubTitle>
        <LongformParagraph>
          A territory map of crowded spaces, whitespace, and ownable ground where the company can credibly compete.
        </LongformParagraph>
        <LongformSubTitle>5. What does success look like?</LongformSubTitle>
        <LongformParagraph>
          Strategic choices tied to measurable business outcomes and operating metrics.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="What brand strategy produces">
        <LongformParagraph>
          <strong>Positioning statement:</strong> clear articulation of what the company does, for whom, and why it
          matters.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Messaging architecture:</strong> priority narrative, proof points, and differentiators by audience and
          context.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Audience profiles:</strong> practical segment profiles with motivations, objections, and decision
          criteria.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Competitive landscape:</strong> written + visual positioning analysis showing strengths, weakness, and
          unclaimed territory.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Brand attributes and principles:</strong> the behavioral standard that informs{" "}
          <a href="/services" className="atla-link" style={{ color: "#222" }}>
            identity design, verbal identity, and digital design
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="How the strategy process works at Atla">
        <LongformSubTitle>Week 1–2: Discovery</LongformSubTitle>
        <LongformParagraph>
          Stakeholder interviews, competitive audit, audience research, and category analysis. We map real constraints,
          not aspirational ones.
        </LongformParagraph>
        <LongformSubTitle>Week 3–4: Strategic development</LongformSubTitle>
        <LongformParagraph>
          Synthesis, positioning options, and messaging frameworks. We present strategic directions with clear tradeoffs.
        </LongformParagraph>
        <LongformSubTitle>Week 5–6: Documentation and handoff</LongformSubTitle>
        <LongformParagraph>
          Final strategy document, stakeholder presentation, and written rationale for each major decision so your team
          can maintain consistency after handoff. Full process detail is on{" "}
          <a href="/how-we-work" className="atla-link" style={{ color: "#222" }}>
            how we work
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="When companies need brand strategy">
        <LongformParagraph>
          <strong>Before a rebrand:</strong> redesigning identity without strategic reset usually preserves old confusion.
          Start with strategy first. For an operational walkthrough, read{" "}
          <a
            href="/journal/how-to-select-a-branding-agency"
            className="atla-link"
            style={{ color: "#222" }}
          >
            how to select a branding agency
          </a>
          .
        </LongformParagraph>
        <LongformParagraph>
          <strong>Before a launch:</strong> early-stage brands that skip strategy often ship a clean look that does not
          differentiate.
        </LongformParagraph>
        <LongformParagraph>
          <strong>When growth stalls:</strong> rising CAC with flat conversion can signal a positioning and messaging
          problem, not a product problem.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Before entering a new market:</strong> expansion requires strategic adaptation, not only translation.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="What brand strategy is not">
        <LongformParagraph>
          It is not a mood board, not a brand book, and not a mission statement. Those can be outputs or expressions,
          but they are not the strategy itself.
        </LongformParagraph>
        <LongformParagraph>
          It is also not one-and-done. Strategy should be revisited when market, product, or audience conditions change.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Examples and internal references">
        <LongformParagraph>
          See strategy translated into execution in{" "}
          <a href="/projects/the-bridge" className="atla-link" style={{ color: "#222" }}>
            The Bridge
          </a>
          ,{" "}
          <a href="/projects/ando" className="atla-link" style={{ color: "#222" }}>
            Ando
          </a>
          , and{" "}
          <a href="/projects/conscious-care-co" className="atla-link" style={{ color: "#222" }}>
            Conscious Care Co
          </a>
          .
        </LongformParagraph>
        <LongformParagraph>
          Explore vertical execution paths in{" "}
          <a href="/hospitality-branding" className="atla-link" style={{ color: "#222" }}>
            hospitality branding
          </a>{" "}
          and{" "}
          <a href="/cpg-branding" className="atla-link" style={{ color: "#222" }}>
            CPG branding
          </a>
          . Browse all examples in the{" "}
          <a href="/" className="atla-link" style={{ color: "#222" }}>
            work archive
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Common questions about brand strategy">
        {FAQ_ITEMS.map((item) => (
          <div key={item.question} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <LongformSubTitle>{item.question}</LongformSubTitle>
            <LongformParagraph>{item.answer}</LongformParagraph>
          </div>
        ))}
      </LongformSection>

      <LongformCta
        title="Start with strategy"
        description="If you are unsure whether you need strategy, design, or both, start here. We can scope the right engagement sequence."
        actions={[
          { href: "/contact", label: "Start a project →" },
          { href: "/how-we-work", label: "See process →" },
        ]}
      />
    </AtlaLongformLayout>
  );
}
