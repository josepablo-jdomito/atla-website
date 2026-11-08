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
      "How Atla runs a project, step by step: read the market, talk to your people, pick the position, design the system, hand it over.",
    url: `${SITE_ORIGIN}/how-we-work`,
    // The steps are the five on Why Atla (siteCopy.about.how), the canonical process.
    step: [
      { "@type": "HowToStep", name: "Read the market" },
      { "@type": "HowToStep", name: "Talk to your people" },
      { "@type": "HowToStep", name: "Pick the position" },
      { "@type": "HowToStep", name: "Design the system" },
      { "@type": "HowToStep", name: "Hand it over" },
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
      description="How Atla runs a project, step by step: read the market, talk to your people, pick the position, design the system, hand it over."
      structuredData={[howToSchema, buildBreadcrumbSchema("/how-we-work", "How We Work")]}
    >
      <LongformHero
        eyebrow="Process"
        h1="How Atla works"
        paragraphs={[
          "Before every engagement we get the same questions: how the process works, how long it takes, who is involved and what you get.",
          "Strategy comes before design. Design comes before production. No step starts until the one before it is locked.",
        ]}
      />

      <LongformSection title="The engagement model">
        <LongformParagraph>
          Every project follows the same steps, scaled to its scope. They are the steps on Why Atla, in more detail. The
          order is what keeps revisions from eating the budget and the timeline.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Read the market">
        <LongformSubTitle>What happens</LongformSubTitle>
        <LongformParagraph>
          We map the business, the market, the audience and the constraints you work under.
        </LongformParagraph>
        <LongformSubTitle>Activities</LongformSubTitle>
        <LongformParagraph>
          AI gathers what customers and competitors say in public. A strategist reads it next to a competitive audit, a
          category analysis and a review of what you already have.
        </LongformParagraph>
        <LongformSubTitle>Output</LongformSubTitle>
        <LongformParagraph>A discovery brief that feeds the strategy.</LongformParagraph>
      </LongformSection>

      <LongformSection title="Talk to your people">
        <LongformSubTitle>What happens</LongformSubTitle>
        <LongformParagraph>
          We interview leadership, sales, product and whoever answers the phone. People do this part, not software.
        </LongformParagraph>
        <LongformSubTitle>Activities</LongformSubTitle>
        <LongformParagraph>Stakeholder interviews and audience segmentation.</LongformParagraph>
        <LongformSubTitle>Output</LongformSubTitle>
        <LongformParagraph>Audience profiles and what your team knows, written down next to what the market says.</LongformParagraph>
      </LongformSection>

      <LongformSection title="Pick the position">
        <LongformSubTitle>What happens</LongformSubTitle>
        <LongformParagraph>
          Research turns into decisions: positioning, audience, messaging and competitive framing.
        </LongformParagraph>
        <LongformSubTitle>Activities</LongformSubTitle>
        <LongformParagraph>
          AI drafts positioning directions and checks them against the research. You and we choose one, with a messaging
          hierarchy and a market map behind it.
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

      <LongformSection title="Design the system">
        <LongformSubTitle>What happens</LongformSubTitle>
        <LongformParagraph>
          Strategy becomes a visual and verbal identity: logo, type, color, icons, photography direction and tone of
          voice.
        </LongformParagraph>
        <LongformSubTitle>Activities</LongformSubTitle>
        <LongformParagraph>
          We explore directions, refine one, build it into a system and test it on real applications. AI does first
          passes and production work. A creative director decides what ships.
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

      <LongformSection title="Hand it over">
        <LongformSubTitle>What happens</LongformSubTitle>
        <LongformParagraph>
          The identity goes onto the touchpoints that matter for launch and growth, with guidelines your team can use
          without us.
        </LongformParagraph>
        <LongformSubTitle>Typical deliverables</LongformSubTitle>
        <LongformParagraph>
          Website design and handoff, packaging specs, social templates, investor and sales materials, and environmental
          guidelines.
        </LongformParagraph>
        <LongformSubTitle>Output</LongformSubTitle>
        <LongformParagraph>
          Assets ready for launch, held to the same standard as the strategy. We stay on if you want us to. See live
          examples in{" "}
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
      </LongformSection>

      <LongformSection title="Timelines and scope">
        <LongformParagraph>
          We set the timeline with you during scoping, step by step.
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
          <strong>Opinionated:</strong> we show options grounded in the strategy, with a recommendation.
          No endless concept rounds.
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
          { href: "/brief", label: "Start a project" },
          { href: "/about", label: "Why Atla" },
        ]}
      />
    </AtlaLongformLayout>
  );
}
