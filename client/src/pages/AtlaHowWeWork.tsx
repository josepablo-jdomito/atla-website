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

export default function AtlaHowWeWork() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How Atla runs branding engagements",
    description:
      "How Atla runs an engagement, from discovery through strategy, identity and launch, with a clear output for each phase.",
    url: `${SITE_ORIGIN}/how-we-work`,
    // PENDING JP APPROVAL: week ranges removed from the phase names (v2 rule: no numbers or deadlines promised).
    step: [
      { "@type": "HowToStep", name: "Discovery" },
      { "@type": "HowToStep", name: "Strategy" },
      { "@type": "HowToStep", name: "Identity design" },
      { "@type": "HowToStep", name: "Application and launch" },
    ],
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
    },
  };

  return (
    <AtlaLongformLayout
      pathname="/how-we-work"
      title="How We Work"
      titleSuffix="Branding Process and Engagement Model"
      description="How Atla runs branding engagements from discovery to launch. Strategy, identity, digital, and creative direction built as one system."
      structuredData={[howToSchema, buildBreadcrumbSchema("/how-we-work", "How We Work")]}
    >
      <LongformHero
        eyebrow="Process"
        h1="How Atla works"
        paragraphs={[
          "Before every engagement we get the same questions: how the process works, how long it takes, who is involved and what you get.",
          "This page answers them. Strategy comes before design. Design comes before production. No phase starts until the one before it is locked.",
        ]}
      />

      <LongformSection title="The engagement model">
        <LongformParagraph>
          Every project follows the same order, scaled to its scope. The order is what keeps revisions from eating the
          budget and the timeline.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Phase 1: Discovery">
        <LongformSubTitle>What happens</LongformSubTitle>
        <LongformParagraph>
          We map the business, the market, the audience and the constraints you work under.
        </LongformParagraph>
        <LongformSubTitle>Activities</LongformSubTitle>
        <LongformParagraph>
          Stakeholder interviews, a competitive audit, audience segmentation, category analysis and a review of what you
          already have.
        </LongformParagraph>
        <LongformSubTitle>Output</LongformSubTitle>
        <LongformParagraph>A discovery brief that feeds the strategy.</LongformParagraph>
      </LongformSection>

      <LongformSection title="Phase 2: Strategy">
        <LongformSubTitle>What happens</LongformSubTitle>
        <LongformParagraph>
          Discovery turns into decisions: positioning, audience, messaging and competitive framing.
        </LongformParagraph>
        <LongformSubTitle>Activities</LongformSubTitle>
        <LongformParagraph>
          Positioning directions, a messaging hierarchy, audience profiles and a market map.
        </LongformParagraph>
        <LongformSubTitle>Output</LongformSubTitle>
        <LongformParagraph>
          A brand strategy document that every creative decision answers to. See{" "}
          <a href="/brand-strategy" className="longform-link">
            the full strategy method
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Phase 3: Identity design">
        <LongformSubTitle>What happens</LongformSubTitle>
        <LongformParagraph>
          Strategy becomes a visual and verbal identity: logo, type, color, icons, photography direction and tone of
          voice.
        </LongformParagraph>
        <LongformSubTitle>Activities</LongformSubTitle>
        <LongformParagraph>
          We explore directions, refine one, build it into a system and test it on real applications.
        </LongformParagraph>
        <LongformSubTitle>Output</LongformSubTitle>
        <LongformParagraph>
          The full identity system and the guidance to use it, matched to the{" "}
          <a href="/services" className="longform-link">
            service scope
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Phase 4: Application and launch">
        <LongformSubTitle>What happens</LongformSubTitle>
        <LongformParagraph>
          The identity goes onto the touchpoints that matter for launch and growth.
        </LongformParagraph>
        <LongformSubTitle>Typical deliverables</LongformSubTitle>
        <LongformParagraph>
          Website design and handoff, packaging specs, social templates, investor and sales materials, and environmental
          guidelines.
        </LongformParagraph>
        <LongformSubTitle>Output</LongformSubTitle>
        <LongformParagraph>
          Assets ready for launch, held to the same standard as the strategy. See live examples in{" "}
          <a href="/" className="longform-link">
            selected work
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="How we are structured">
        <LongformParagraph>
          <strong>Small senior teams.</strong> No handoff chain. The people at kickoff are the people doing the work.
        </LongformParagraph>
        <LongformParagraph>
          <strong>A focused studio.</strong> Atla is a global team in Austin, Mexico City, Barcelona, Lima and Caracas: a
          core team plus specialists we vet ourselves.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Limited capacity.</strong> We cap how many projects each team runs at once, to protect the work.
        </LongformParagraph>
      </LongformSection>

      {/* PENDING JP APPROVAL: price and week ranges removed (v2 rule: no prices, numbers or deadlines); heading and
          paragraphs rewritten. */}
      <LongformSection title="Timelines and scope">
        <LongformParagraph>
          A full branding engagement takes longer than strategy, identity or packaging on its own. We set the timeline
          with you during scoping, phase by phase.
        </LongformParagraph>
        <LongformParagraph>
          Every engagement is sized to the work and scoped before it starts. No hourly drift and no quiet expansion.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="What the process feels like">
        <LongformParagraph>
          <strong>Organized:</strong> one shared timeline, a milestone tracker and a clear list of deliverables.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Opinionated:</strong> we show two or three options grounded in the strategy, with a recommendation.
          No endless concept rounds.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Less rework:</strong> strategy before design means fewer surprises later.
        </LongformParagraph>
        <LongformParagraph>
          If you are writing a brief, start with our{" "}
          <a href="/journal/how-to-brief-a-branding-agency" className="longform-link">
            project briefing guide
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformCta
        title="Ready to scope a project?"
        description="Tell us about the company, the timeline and what the brand needs to do. We reply with concrete next steps."
        actions={[
          { href: "/contact", label: "Start a project →" },
          { href: "/about", label: "About Atla →" },
        ]}
      />
    </AtlaLongformLayout>
  );
}
