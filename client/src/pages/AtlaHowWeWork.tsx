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
    step: [
      { "@type": "HowToStep", name: "Discovery (Weeks 1–2)" },
      { "@type": "HowToStep", name: "Strategy (Weeks 3–4)" },
      { "@type": "HowToStep", name: "Identity design (Weeks 5–8)" },
      { "@type": "HowToStep", name: "Application and launch (Weeks 9–12+)" },
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

      <LongformSection title="Phase 1 — Discovery (Weeks 1–2)">
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

      <LongformSection title="Phase 2 — Strategy (Weeks 3–4)">
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
          <a href="/brand-strategy" className="atla-link" style={{ color: "#222" }}>
            the full strategy methodology
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Phase 3 — Identity design (Weeks 5–8)">
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
          <a href="/services" className="atla-link" style={{ color: "#222" }}>
            service scope
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Phase 4 — Application and launch (Weeks 9–12+)">
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
          <a href="/" className="atla-link" style={{ color: "#222" }}>
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
          <strong>Focused operation.</strong> Atla operates between Mexico City and Austin with a core team and vetted
          specialist collaborators.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Capacity discipline.</strong> We limit concurrent projects per team to protect speed and quality.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Timelines and pricing">
        <LongformParagraph>
          Typical ranges: full branding engagement 10–16 weeks, strategy-only 4–6 weeks, identity-only 6–10 weeks,
          packaging systems 6–8 weeks.
        </LongformParagraph>
        <LongformParagraph>
          Investment starts at $25K for focused projects and scales by scope and timeline complexity. We scope before
          work starts. No hourly drift and no hidden expansion.
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
          <a href="/journal/how-to-brief-a-branding-agency" className="atla-link" style={{ color: "#222" }}>
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
