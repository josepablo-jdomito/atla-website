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
      "Atla's process from discovery through strategy, identity, and launch implementation with clear phase outputs.",
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
          "We get the same questions before every engagement: how the process works, how long it takes, who is involved, and what the outputs are.",
          "This page answers those directly. Strategy decisions happen before design decisions. Design decisions happen before production. No phase starts until the previous one is locked.",
        ]}
      />

      <LongformSection title="The engagement model">
        <LongformParagraph>
          Every project follows the same structure, scaled to scope. This sequencing is what prevents revision cascades
          that burn budget and timeline.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Phase 1 — Discovery">
        <LongformSubTitle>What happens</LongformSubTitle>
        <LongformParagraph>
          We map business context, market dynamics, audience behavior, and operating constraints.
        </LongformParagraph>
        <LongformSubTitle>Activities</LongformSubTitle>
        <LongformParagraph>
          Stakeholder interviews, competitive audit, audience segmentation, category analysis, and review of existing
          assets.
        </LongformParagraph>
        <LongformSubTitle>Output</LongformSubTitle>
        <LongformParagraph>Discovery brief that feeds strategy development.</LongformParagraph>
      </LongformSection>

      <LongformSection title="Phase 2 — Strategy">
        <LongformSubTitle>What happens</LongformSubTitle>
        <LongformParagraph>
          Discovery is converted into strategic decisions: positioning, audience definition, messaging architecture, and
          competitive framing.
        </LongformParagraph>
        <LongformSubTitle>Activities</LongformSubTitle>
        <LongformParagraph>
          Positioning directions, messaging hierarchy, audience profiles, and market mapping.
        </LongformParagraph>
        <LongformSubTitle>Output</LongformSubTitle>
        <LongformParagraph>
          Brand strategy document used as the decision framework for all creative work. See{" "}
          <a href="/brand-strategy" className="longform-link">
            the full strategy methodology
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Phase 3 — Identity design">
        <LongformSubTitle>What happens</LongformSubTitle>
        <LongformParagraph>
          Strategy becomes visual and verbal identity: logo, typography, color, iconography, photography direction, and
          tone foundations.
        </LongformParagraph>
        <LongformSubTitle>Activities</LongformSubTitle>
        <LongformParagraph>
          Direction exploration, concept refinement, system expansion, and application stress testing.
        </LongformParagraph>
        <LongformSubTitle>Output</LongformSubTitle>
        <LongformParagraph>
          Complete identity system and implementation guidance aligned with{" "}
          <a href="/services" className="longform-link">
            service scope
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Phase 4 — Application and launch">
        <LongformSubTitle>What happens</LongformSubTitle>
        <LongformParagraph>
          Identity is applied across the operational touchpoints that matter for launch and growth.
        </LongformParagraph>
        <LongformSubTitle>Typical deliverables</LongformSubTitle>
        <LongformParagraph>
          Website design and handoff, packaging specs, social templates, investor and sales collateral, and environmental
          guidance.
        </LongformParagraph>
        <LongformSubTitle>Output</LongformSubTitle>
        <LongformParagraph>
          Launch-ready assets with consistent strategic and visual quality. See live examples in{" "}
          <a href="/" className="longform-link">
            selected work
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="How we are structured">
        <LongformParagraph>
          <strong>Senior-led small teams.</strong> No handoff chain. The team in kickoff is the team executing.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Focused operation.</strong> Atla is a global team across Austin, Mexico City, Barcelona, Lima and Caracas, with a core team and vetted
          specialist collaborators.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Capacity discipline.</strong> We limit concurrent projects per team to protect speed and quality.
        </LongformParagraph>
      </LongformSection>

      {/* PENDING JP APPROVAL: price and week ranges removed (v2 rule: no prices, numbers or deadlines); heading and
          paragraphs rewritten. */}
      <LongformSection title="Timelines and scope">
        <LongformParagraph>
          A full branding engagement takes longer than strategy-only, identity-only or packaging work. We set the
          timeline with you during scoping, phase by phase.
        </LongformParagraph>
        <LongformParagraph>
          Every engagement is sized to its scope and timeline complexity, and we scope it before work starts. No hourly
          drift and no hidden expansion.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="What clients say the process feels like">
        <LongformParagraph>
          <strong>Organized:</strong> shared timeline, milestone tracker, and clear deliverable list.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Opinionated:</strong> we present 2–3 strategically grounded options with recommendation, not endless
          concept rounds.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Fast for the quality:</strong> sequencing strategy before design reduces downstream rework.
        </LongformParagraph>
        <LongformParagraph>
          For teams documenting outcomes after launch, we also provide a reusable{" "}
          <a href="/journal/how-to-brief-a-branding-agency" className="longform-link">
            project briefing guide
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformCta
        title="Ready to scope a project?"
        description="Tell us about the company, timeline, and expected outcomes. We respond with concrete next steps."
        actions={[
          { href: "/contact", label: "Start a project →" },
          { href: "/about", label: "About Atla →" },
        ]}
      />
    </AtlaLongformLayout>
  );
}
