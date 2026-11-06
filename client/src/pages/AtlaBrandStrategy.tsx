import { ORGANIZATION_NAME, SITE_ORIGIN } from "@shared/siteSeo";
import {
  AtlaLongformLayout,
  LongformFaqItem,
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
    // PENDING JP APPROVAL: price range removed (v2 rule: no prices anywhere).
    answer:
      "It depends on the scope, how complex the company is and how many audiences it serves. We scope every strategy engagement before work starts.",
  },
  {
    question: "Can we run strategy and design at the same time?",
    answer:
      "We do not recommend it. Strategy decisions change the creative direction, so running both at once usually means doing the work twice.",
  },
  {
    question: "What if we already have a strategy?",
    answer:
      "We review it first. If it is usable, we move into design. If it has gaps, we scope a focused sprint to close them.",
  },
  {
    question: "Do you do strategy without design?",
    answer:
      "Yes. Teams with their own designers, or a design partner they already trust, often hire us for strategy only.",
  },
  {
    question: "How is this different from consulting output?",
    answer:
      "Our strategy is written to be designed and spoken. It does not end as a slide deck nobody can execute.",
  },
];

export default function AtlaBrandStrategy() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Brand strategy: the decisions that make design work",
    description:
      "How brand strategy works at Atla: positioning, messaging, audience and competitive framing, decided before identity design starts.",
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
      titleSuffix="Atla"
      description="How brand strategy works: positioning, messaging, audience and competitive framing, decided before design starts."
      structuredData={[articleSchema, faqSchema, buildBreadcrumbSchema("/brand-strategy", "Brand Strategy")]}
    >
      <LongformHero
        eyebrow="Brand strategy"
        h1="Brand strategy: the decisions that make design work"
        paragraphs={[
          "Brand strategy is the set of decisions that shape how a company is understood in its market. It is the layer under the logo, the palette and the tagline.",
          "With a strong strategy, design decisions get faster and easier to defend. Without one, every review turns into a debate about taste.",
        ]}
      />

      <LongformSection title="What brand strategy is">
        <LongformParagraph>
          Strategy answers these questions before any creative work starts.
        </LongformParagraph>
        <LongformSubTitle>What does this company stand for?</LongformSubTitle>
        <LongformParagraph>
          The point of view that separates the company from competitors who look the same. This is positioning, and it
          is the first decision.
        </LongformParagraph>
        <LongformSubTitle>Who is the audience, specifically?</LongformSubTitle>
        <LongformParagraph>
          Demographics are not enough. We define segments by what moves them, what stops them and how they decide.
        </LongformParagraph>
        <LongformSubTitle>How should the brand speak?</LongformSubTitle>
        <LongformParagraph>
          A messaging hierarchy: what to say first, the proof behind it and the words to avoid.
        </LongformParagraph>
        <LongformSubTitle>Where can the company win?</LongformSubTitle>
        <LongformParagraph>
          A map of the crowded ground, the open ground and the ground the company can credibly own.
        </LongformParagraph>
        <LongformSubTitle>What does success look like?</LongformSubTitle>
        <LongformParagraph>
          Choices you can check against sales, not taste.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="What you get">
        <LongformParagraph>
          <strong>Positioning statement:</strong> what the company does, for whom, and why it matters.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Messaging architecture:</strong> the main story, the proof points and the differentiators, by audience
          and context.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Audience profiles:</strong> each segment's motivations, objections and way of deciding.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Competitive map:</strong> a written and visual analysis of strengths, weaknesses and the territory
          nobody has claimed.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Brand attributes and principles:</strong> the standard behind{" "}
          <a href="/services" className="longform-link">
            identity design, verbal identity, and digital design
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="How the process works">
        {/* PENDING JP APPROVAL: week ranges removed (no deadline promises) */}
        <LongformSubTitle>Discovery</LongformSubTitle>
        <LongformParagraph>
          Stakeholder interviews, a competitive audit, audience research and category analysis. We map the constraints
          you have.
        </LongformParagraph>
        <LongformSubTitle>Strategy</LongformSubTitle>
        <LongformParagraph>
          We pull it together and present positioning options and messaging frameworks, each with its tradeoffs spelled
          out.
        </LongformParagraph>
        <LongformSubTitle>Documentation and handoff</LongformSubTitle>
        <LongformParagraph>
          The strategy document, a presentation for your stakeholders and the reasoning behind each major decision, so
          your team stays consistent after we hand it over. The full process is on{" "}
          <a href="/how-we-work" className="longform-link">
            how we work
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="When companies need brand strategy">
        <LongformParagraph>
          <strong>Before a rebrand:</strong> a new identity on top of an old strategy keeps the old confusion. Start with
          strategy. For the practical side, read{" "}
          <a
            href="/journal/how-to-select-a-branding-agency"
            className="longform-link"
          >
            how to select a branding agency
          </a>
          .
        </LongformParagraph>
        <LongformParagraph>
          <strong>Before a launch:</strong> young brands that skip strategy often ship a clean look nobody can tell apart.
        </LongformParagraph>
        <LongformParagraph>
          <strong>When growth stalls:</strong> rising CAC with flat conversion often points to positioning and messaging.
          The product may be fine.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Before entering a new market:</strong> the strategy has to be adapted. Translating it is not enough.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="What brand strategy is not">
        <LongformParagraph>
          It is not a mood board, a brand book or a mission statement. Those can come out of it. They are not the
          strategy.
        </LongformParagraph>
        <LongformParagraph>
          It is also not done once. Revisit it when the market, the product or the audience changes.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Examples">
        <LongformParagraph>
          See strategy turned into design in{" "}
          <a href="/projects/the-bridge" className="longform-link">
            The Bridge
          </a>
          ,{" "}
          <a href="/projects/ando" className="longform-link">
            Ando
          </a>
          , and{" "}
          <a href="/projects/conscious-care-co" className="longform-link">
            Conscious Care Co
          </a>
          .
        </LongformParagraph>
        <LongformParagraph>
          By industry:{" "}
          <a href="/hospitality-branding" className="longform-link">
            hospitality branding
          </a>{" "}
          and{" "}
          <a href="/cpg-branding" className="longform-link">
            CPG branding
          </a>
          . Everything else is in the{" "}
          <a href="/" className="longform-link">
            work archive
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Questions about brand strategy">
        {FAQ_ITEMS.map((item) => (
          <LongformFaqItem key={item.question}>
            <LongformSubTitle>{item.question}</LongformSubTitle>
            <LongformParagraph>{item.answer}</LongformParagraph>
          </LongformFaqItem>
        ))}
      </LongformSection>

      <LongformCta
        title="Start with strategy"
        description="Not sure if you need strategy, design or both? Start here. We will scope the right order."
        actions={[
          { href: "/brief", label: "Start a project" },
          { href: "/how-we-work", label: "See process →" },
        ]}
      />
    </AtlaLongformLayout>
  );
}
