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
    question: "Do you handle structural packaging design?",
    answer:
      "We design graphics and visual systems. For structural and dieline engineering, we coordinate with your packaging supplier or recommended specialist partners.",
  },
  {
    question: "Can you work with existing manufacturer specs?",
    answer:
      "Yes. We design within substrate, print method, and dieline constraints provided by your manufacturer.",
  },
  {
    question: "What about Amazon and DTC listing design?",
    answer:
      "Included. We design photography direction, A+ content layouts, and storefront templates as part of launch-ready assets.",
  },
  {
    question: "How do you handle line extensions?",
    answer:
      "The initial system is built for extensibility so adding new variants takes days instead of weeks.",
  },
];

export default function AtlaCpgBranding() {
  return (
    <AtlaLongformLayout
      pathname="/cpg-branding"
      title="CPG Branding and Packaging Agency"
      titleSuffix="Consumer Goods"
      description="Brand identity and packaging design for CPG companies launching or repositioning products. Strategy-led systems that perform on shelf and screen."
      structuredData={buildServiceSchema({
        path: "/cpg-branding",
        name: "CPG branding and packaging that performs on shelf and screen",
        description:
          "Brand strategy, visual identity, packaging design, and launch-ready digital assets for consumer packaged goods companies.",
        faqItems: FAQ_ITEMS,
      })}
    >
      <LongformHero
        eyebrow="CPG Branding"
        h1="CPG branding and packaging that performs on shelf and screen"
        paragraphs={[
          "Consumer packaged goods live in the most unforgiving brand environment. Three seconds on shelf, a thumbnail in marketplace listings, and a split-second decision in paid social.",
          "We build CPG identities engineered for recognition at speed. Strategy, visual identity, packaging, and digital launch assets are developed as one system so nothing gets lost between strategy and retail execution.",
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
          <a href="/projects/ando" className="atla-link" style={{ color: "#222" }}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>TigreTigre</strong> —{" "}
          <a href="/projects/tigretigre" className="atla-link" style={{ color: "#222" }}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Reggie</strong> —{" "}
          <a href="/projects/reggie" className="atla-link" style={{ color: "#222" }}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Oxylife</strong> —{" "}
          <a href="/projects/oxylife" className="atla-link" style={{ color: "#222" }}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Bovi Health</strong> —{" "}
          <a href="/projects/bovi-health" className="atla-link" style={{ color: "#222" }}>
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
          <a href="/how-we-work" className="atla-link" style={{ color: "#222" }}>
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
          <div key={item.question} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <LongformSubTitle>{item.question}</LongformSubTitle>
            <LongformParagraph>{item.answer}</LongformParagraph>
          </div>
        ))}
      </LongformSection>

      <LongformSection title="Related reads and references">
        <LongformParagraph>
          Start with the strategic framing in{" "}
          <a href="/journal/brand-audit-framework" className="atla-link" style={{ color: "#222" }}>
            the brand audit framework
          </a>
          .
        </LongformParagraph>
        <LongformParagraph>
          For strategic framing before design, review{" "}
          <a href="/brand-strategy" className="atla-link" style={{ color: "#222" }}>
            brand strategy
          </a>{" "}
          and the broader{" "}
          <a href="/services" className="atla-link" style={{ color: "#222" }}>
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
