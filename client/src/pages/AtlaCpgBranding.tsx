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

const SERVICE_PAGE = INDUSTRY_SERVICE_PAGES.cpg;
const FAQ_ITEMS = SERVICE_PAGE.faqItems;

export default function AtlaCpgBranding() {
  return (
    <AtlaLongformLayout
      pathname="/cpg-branding"
      title="CPG Branding and Packaging Agency"
      titleSuffix="Consumer Goods"
      description="Brand identity and packaging design for CPG companies launching or repositioning products. Strategy-led systems that perform on shelf and screen."
      structuredData={buildServiceSchema(SERVICE_PAGE)}
    >
      <LongformHero
        eyebrow="CPG Branding"
        h1="CPG branding and packaging that performs on shelf and screen"
        paragraphs={[
          "Consumer packaged goods live in the most unforgiving brand environment. Three seconds on shelf, a thumbnail in marketplace listings, and a split-second decision in paid social.",
          "We build CPG identities engineered for recognition at speed. Strategy, visual identity, packaging, and digital launch assets are developed as one system so nothing gets lost between strategy and retail execution.",
        ]}
        cta={
          <LongformAction href="/contact">Start a project →</LongformAction>
        }
      />

      <LongformSection title="What CPG brands typically need from us">
        <LongformSubTitle>Brand strategy and positioning</LongformSubTitle>
        <LongformParagraph>
          Category analysis, competitive mapping, audience definition, and messaging architecture. We define where your
          product sits in market and why someone should reach for it.
        </LongformParagraph>
        <LongformSubTitle>Packaging design systems</LongformSubTitle>
        <LongformParagraph>
          Primary and secondary packaging, label systems, retail-ready artwork, and production specifications built to
          scale across SKUs without losing coherence.
        </LongformParagraph>
        <LongformSubTitle>Brand identity beyond the package</LongformSubTitle>
        <LongformParagraph>
          Logo, typography, color, and visual language that hold across website, ads, social, and retail.
        </LongformParagraph>
        <LongformSubTitle>Launch-ready digital assets</LongformSubTitle>
        <LongformParagraph>
          E-commerce photography direction, Amazon and DTC listing design, social templates, and landing pages.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Selected CPG work">
        <LongformParagraph>
          <strong>Ando</strong> — Brand identity and packaging for a gummy supplement line built for retail visibility.{" "}
          <a href="/projects/ando" className="longform-link">
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>TigreTigre</strong> —{" "}
          <a href="/projects/tigretigre" className="longform-link">
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Reggie</strong> —{" "}
          <a href="/projects/reggie" className="longform-link">
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Oxylife</strong> —{" "}
          <a href="/projects/oxylife" className="longform-link">
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Bovi Health</strong> —{" "}
          <a href="/projects/bovi-health" className="longform-link">
            View project →
          </a>
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Why CPG companies work with Atla">
        <LongformSubTitle>We design for the shelf, not for the portfolio</LongformSubTitle>
        <LongformParagraph>
          Pretty packaging that does not perform is wasted budget. We pressure-test hierarchy, readability, and
          differentiation before finalizing direction.
        </LongformParagraph>
        <LongformSubTitle>Strategy and packaging under one roof</LongformSubTitle>
        <LongformParagraph>
          Strategy, identity, packaging, and digital are scoped as one engagement so the launch looks and feels coherent
          across channels. The planning process is documented on{" "}
          <a href="/how-we-work" className="longform-link">
            how we work
          </a>
          .
        </LongformParagraph>
        <LongformSubTitle>Production-aware from day one</LongformSubTitle>
        <LongformParagraph>
          We design with print method, substrate, and cost constraints in mind to avoid concept decay at production.
        </LongformParagraph>
        <LongformSubTitle>Scalable across SKUs</LongformSubTitle>
        <LongformParagraph>
          New products should extend the system, not require a redesign every quarter.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Common questions from CPG teams">
        {FAQ_ITEMS.map((item) => (
          <LongformFaqItem key={item.question}>
            <LongformSubTitle>{item.question}</LongformSubTitle>
            <LongformParagraph>{item.answer}</LongformParagraph>
          </LongformFaqItem>
        ))}
      </LongformSection>

      <LongformSection title="Related reads and references">
        <LongformParagraph>
          Start with the strategic framing in{" "}
          <a href="/journal/brand-audit-framework" className="longform-link">
            the brand audit framework
          </a>
          .
        </LongformParagraph>
        <LongformParagraph>
          For strategic framing before design, review{" "}
          <a href="/brand-strategy" className="longform-link">
            brand strategy
          </a>{" "}
          and the broader{" "}
          <a href="/services" className="longform-link">
            service model
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformCta
        title="Start with a conversation"
        description="Tell us about the product, category, and channel mix. We will tell you quickly whether we are the right partner."
        actions={[
          { href: "/contact", label: "Start a project →" },
          { href: "/", label: "Browse selected work →" },
        ]}
      />
    </AtlaLongformLayout>
  );
}
