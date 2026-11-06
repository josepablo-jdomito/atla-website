import {
  AtlaLongformLayout,
  LongformAction,
  LongformFaqItem,
  LongformCta,
  LongformHero,
  LongformParagraph,
  LongformSection,
  LongformSubTitle,
} from "@/components/atla/AtlaLongformLayout";
import { INDUSTRY_SERVICE_PAGES, buildServiceSchema } from "@/lib/serviceSchema";

const SERVICE_PAGE = INDUSTRY_SERVICE_PAGES.saas;
const FAQ_ITEMS = SERVICE_PAGE.faqItems;

export default function AtlaSaasBranding() {
  return (
    <AtlaLongformLayout
      pathname="/saas-branding"
      title="SaaS Branding Agency"
      titleSuffix="Atla"
      description="Brand strategy and identity for SaaS companies. Positioning and digital systems for software teams that need clearer differentiation."
      structuredData={buildServiceSchema(SERVICE_PAGE)}
    >
      <LongformHero
        eyebrow="SaaS branding"
        h1="SaaS branding that does not look like everyone else's"
        paragraphs={[
          "Most SaaS brands look interchangeable. When the identity is generic, nobody remembers it and every customer costs more to win.",
          "The SaaS brands that last make specific choices about how they look, sound and behave in the product, in marketing, in sales and in front of investors.",
          "We build systems people recognize on sight, with room to grow with the company.",
        ]}
        cta={
          <LongformAction href="/brief">Start a project</LongformAction>
        }
      />

      <LongformSection title="What SaaS companies usually ask us for">
        <LongformSubTitle>Strategy and positioning</LongformSubTitle>
        <LongformParagraph>
          Differentiation, category framing, audience segments and a messaging hierarchy. People should remember why you
          matter, and a feature list does not do that.
        </LongformParagraph>
        <LongformSubTitle>One visual system for product and marketing</LongformSubTitle>
        <LongformParagraph>
          Logo, type, color, icons and illustration that hold in the product and in the marketing.
        </LongformParagraph>
        <LongformSubTitle>Websites built to convert</LongformSubTitle>
        <LongformParagraph>
          Marketing sites with a clear structure, a shorter path to sign up and content written to be found in search.
        </LongformParagraph>
        <LongformSubTitle>Sales and investor materials</LongformSubTitle>
        <LongformParagraph>
          Pitch decks and one-pagers held to the same standard as the product and the website.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Selected SaaS and digital work">
        <LongformParagraph>
          <strong>Anything AI</strong>. Brand identity and digital design for an AI creative platform.{" "}
          <a href="/projects/anything-ai" className="longform-link">
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>PuppyPy</strong>{" "}
          <a href="/projects/puppypy" className="longform-link">
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Pathize Health</strong>{" "}
          <a href="/projects/pathize-health" className="longform-link">
            View project →
          </a>
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Why SaaS teams hire Atla">
        <LongformSubTitle>The whole funnel</LongformSubTitle>
        <LongformParagraph>
          The brand has to hold up in Google ads, onboarding, sales calls and investor decks. The homepage is the easy
          part.
        </LongformParagraph>
        <LongformSubTitle>Strategy first</LongformSubTitle>
        <LongformParagraph>
          We start with positioning and how your buyers decide, then we design. The method is on{" "}
          <a href="/brand-strategy" className="longform-link">
            our strategy page
          </a>
          .
        </LongformParagraph>
        <LongformSubTitle>Opinionated on purpose</LongformSubTitle>
        <LongformParagraph>
          In a crowded market, safe design is expensive because nobody notices it. We push for signals you can own.
        </LongformParagraph>
        <LongformSubTitle>Senior team, no relay</LongformSubTitle>
        <LongformParagraph>
          No account managers passing notes. The strategists and designers on your project work directly with your
          founders and operators.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Questions SaaS teams ask">
        {FAQ_ITEMS.map((item) => (
          <LongformFaqItem key={item.question}>
            <LongformSubTitle>{item.question}</LongformSubTitle>
            <LongformParagraph>{item.answer}</LongformParagraph>
          </LongformFaqItem>
        ))}
      </LongformSection>

      <LongformSection title="Related reads">
        <LongformParagraph>
          See{" "}
          <a href="/how-we-work" className="longform-link">
            how we work
          </a>{" "}
          for how an engagement runs.
        </LongformParagraph>
        <LongformParagraph>
          Examples are in the{" "}
          <a href="/" className="longform-link">
            work archive
          </a>
          , and the full scope is on{" "}
          <a href="/services" className="longform-link">
            services
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformCta
        title="Start with a conversation"
        description="Tell us about the product, the market pressure and the timeline. We will tell you what to fix first and if we are the right fit."
        actions={[
          { href: "/brief", label: "Start a project" },
          { href: "/", label: "Browse selected work →" },
        ]}
      />
    </AtlaLongformLayout>
  );
}
