import {
  AtlaLongformLayout,
  LongformCta,
  LongformHero,
  LongformParagraph,
  LongformSection,
  LongformSubTitle,
  buildServiceSchema,
} from "@/components/atla/AtlaLongformLayout";

const FAQ_ITEMS = [
  {
    question: "Can you work with our existing product design system?",
    answer:
      "Yes. We can align a new brand system to existing product tokens or extend the brand into a broader product expression where needed.",
  },
  {
    question: "Do you design actual product UI?",
    answer:
      "We design brand-level interface language and component styling guidance. For deep UX workflows, we can collaborate with dedicated product design teams.",
  },
  {
    question: "What about pitch decks?",
    answer:
      "Included in most SaaS scopes. We build master templates and key slides so internal teams can produce consistent deck updates.",
  },
  {
    question: "How fast can you move?",
    answer:
      "Most SaaS branding engagements run 6–10 weeks. For pre-launch or fundraising pressure windows, we can scope focused sprints.",
  },
];

export default function AtlaSaasBranding() {
  return (
    <AtlaLongformLayout
      pathname="/saas-branding"
      title="SaaS Branding Agency"
      titleSuffix="Brand Identity for Software Companies"
      description="Brand strategy and identity for SaaS companies. Positioning and digital systems for software teams that need clearer differentiation."
      structuredData={buildServiceSchema({
        path: "/saas-branding",
        name: "SaaS branding that separates signal from noise",
        description:
          "Positioning, visual identity systems, web conversion architecture, and sales-ready materials for SaaS teams.",
        faqItems: FAQ_ITEMS,
      })}
    >
      <LongformHero
        eyebrow="SaaS Branding"
        h1="SaaS branding that separates signal from noise"
        paragraphs={[
          "Most SaaS brands look interchangeable. When identity is generic, the brand becomes invisible and customer acquisition gets more expensive.",
          "Durable SaaS brands make specific decisions about how they look, sound, and behave across product, marketing, sales, and investor contexts.",
          "We build systems that are immediately recognizable and flexible enough to scale with the business.",
        ]}
        cta={
          <a
            href="/contact"
            className="atla-link"
            style={{
              fontFamily: "'Libre Franklin', Helvetica, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 0.4,
              lineHeight: "1.2",
              textTransform: "uppercase",
              textDecoration: "none",
              color: "#222",
              minHeight: 48,
              display: "inline-flex",
              alignItems: "center",
              padding: "12px 4px",
            }}
          >
            Start a project →
          </a>
        }
      />

      <LongformSection title="What SaaS companies typically need from us">
        <LongformSubTitle>Brand strategy and positioning</LongformSubTitle>
        <LongformParagraph>
          Competitive differentiation, category framing, audience segmentation, and messaging hierarchy so the company is
          understood for what matters, not just feature lists.
        </LongformParagraph>
        <LongformSubTitle>Visual systems for product and marketing</LongformSubTitle>
        <LongformParagraph>
          Logo, typography, color, iconography, and illustration designed to hold across product UI and marketing
          surfaces.
        </LongformParagraph>
        <LongformSubTitle>Website design and conversion architecture</LongformSubTitle>
        <LongformParagraph>
          Marketing sites with clear information architecture, stronger conversion pathways, and SEO-informed content
          structure.
        </LongformParagraph>
        <LongformSubTitle>Sales and investor materials</LongformSubTitle>
        <LongformParagraph>
          Pitch decks and one-pagers that keep the same strategic and visual standard as product and web surfaces.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Selected SaaS and digital work">
        <LongformParagraph>
          <strong>Anything AI</strong> — Brand identity and digital design for an AI creative platform.{" "}
          <a href="/projects/anything-ai" className="atla-link" style={{ color: "#222" }}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>PuppyPy</strong> —{" "}
          <a href="/projects/puppypy" className="atla-link" style={{ color: "#222" }}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Pathize Health</strong> —{" "}
          <a href="/projects/pathize-health" className="atla-link" style={{ color: "#222" }}>
            View project →
          </a>
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Why SaaS companies work with Atla">
        <LongformSubTitle>We design for the full funnel</LongformSubTitle>
        <LongformParagraph>
          Brand coherence has to survive Google ads, onboarding, sales calls, and investor decks, not only the homepage.
        </LongformParagraph>
        <LongformSubTitle>Strategy-first execution</LongformSubTitle>
        <LongformParagraph>
          We start with market positioning and decision criteria, then translate into design. Learn the framework on{" "}
          <a href="/brand-strategy" className="atla-link" style={{ color: "#222" }}>
            our strategy pillar
          </a>
          .
        </LongformParagraph>
        <LongformSubTitle>Opinionated, not decorative</LongformSubTitle>
        <LongformParagraph>
          In crowded markets, safe design is expensive because it does not convert. We push for precise, ownable brand
          signals.
        </LongformParagraph>
        <LongformSubTitle>Senior team, fast cycles</LongformSubTitle>
        <LongformParagraph>
          No account-manager relay model. The core strategist-designer team works directly with your operators and
          founders.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Common questions from SaaS teams">
        {FAQ_ITEMS.map((item) => (
          <div key={item.question} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <LongformSubTitle>{item.question}</LongformSubTitle>
            <LongformParagraph>{item.answer}</LongformParagraph>
          </div>
        ))}
      </LongformSection>

      <LongformSection title="Related reads and references">
        <LongformParagraph>
          Review{" "}
          <a href="/how-we-work" className="atla-link" style={{ color: "#222" }}>
            how we work
          </a>{" "}
          for timeline and engagement structure.
        </LongformParagraph>
        <LongformParagraph>
          Compare examples in the full{" "}
          <a href="/" className="atla-link" style={{ color: "#222" }}>
            work archive
          </a>{" "}
          and service scope on{" "}
          <a href="/services" className="atla-link" style={{ color: "#222" }}>
            services
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformCta
        title="Start with a conversation"
        description="Tell us about the product, market pressure, and timeline. We will tell you what to prioritize and whether we are the right fit."
        actions={[
          { href: "/contact", label: "Start a project →" },
          { href: "/", label: "Browse selected work →" },
        ]}
      />
    </AtlaLongformLayout>
  );
}
