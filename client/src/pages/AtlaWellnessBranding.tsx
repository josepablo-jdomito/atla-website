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
    question: "Do you work with health tech and digital health platforms?",
    answer:
      "Yes. We have delivered brand systems for health-tech teams where identity needs to hold across app UI, marketing site, and investor materials.",
  },
  {
    question: "Can you help with supplement packaging specifically?",
    answer:
      "Yes. We support wellness packaging systems and launch assets, including SKU logic, hierarchy, and DTC-ready visual standards.",
  },
  {
    question: "How do you handle messaging in regulated categories?",
    answer:
      "We define messaging frameworks and flag claims that may need legal review. Final regulatory approval remains with your legal team.",
  },
  {
    question: "What is different about wellness branding?",
    answer:
      "The trust threshold is higher. Buyers are more skeptical and research-heavy, so visual and verbal signals must be precise, credible, and human at the same time.",
  },
];

export default function AtlaWellnessBranding() {
  return (
    <AtlaLongformLayout
      pathname="/wellness-branding"
      title="Wellness and Health Brand Design Agency"
      titleSuffix="Atla"
      description="Brand strategy and identity for wellness, health tech, and care companies. Systems built for trust, regulatory clarity, and emotional connection."
      structuredData={buildServiceSchema({
        path: "/wellness-branding",
        name: "Wellness branding built for trust, clarity, and real connection",
        description:
          "Brand strategy, identity, packaging, and digital design for wellness and health companies balancing credibility with emotional resonance.",
        faqItems: FAQ_ITEMS,
      })}
    >
      <LongformHero
        eyebrow="Wellness Branding"
        h1="Wellness branding built for trust, clarity, and real connection"
        paragraphs={[
          "Wellness and health brands carry a higher burden than most categories. People are making decisions about their bodies, routines, and mental health. The brand needs to feel credible and approachable at the same time.",
          "Most wellness brands default to sterile and corporate or soft and vague. Neither converts. The brands that grow feel specific, grounded, and unmistakably their own.",
          "We build strategy, identity, packaging, and digital systems that balance warmth with authority and hold across every touchpoint.",
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

      <LongformSection title="What wellness and health brands typically need from us">
        <LongformSubTitle>Brand strategy for regulated and trust-dependent categories</LongformSubTitle>
        <LongformParagraph>
          Positioning that differentiates without overclaiming. Messaging architecture that resonates while respecting
          compliance boundaries.
        </LongformParagraph>
        <LongformSubTitle>Identity systems that balance warmth and authority</LongformSubTitle>
        <LongformParagraph>
          Logo, color, typography, and illustration systems that communicate care without becoming generic.
        </LongformParagraph>
        <LongformSubTitle>Patient and user-facing digital design</LongformSubTitle>
        <LongformParagraph>
          Websites and product surfaces designed for research-heavy audiences who need clarity, trust signals, and
          conversion paths without friction.
        </LongformParagraph>
        <LongformSubTitle>Packaging for supplements and DTC wellness</LongformSubTitle>
        <LongformParagraph>
          Label systems and retail-ready packaging that communicate ingredient integrity and brand personality
          simultaneously.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Selected wellness and health work">
        <LongformParagraph>
          <strong>Conscious Care Co</strong> — Wellness identity system built around intentional, mindful care.{" "}
          <a href="/projects/conscious-care-co" className="atla-link" style={{ color: "#222" }}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Pathize Health</strong> —{" "}
          <a href="/projects/pathize-health" className="atla-link" style={{ color: "#222" }}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Peachy Patients</strong> —{" "}
          <a href="/projects/peachy-patients" className="atla-link" style={{ color: "#222" }}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Ando</strong> —{" "}
          <a href="/projects/ando" className="atla-link" style={{ color: "#222" }}>
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

      <LongformSection title="Why wellness companies work with Atla">
        <LongformSubTitle>Trust-first category experience</LongformSubTitle>
        <LongformParagraph>
          We design systems that earn credibility before asking for a transaction.
        </LongformParagraph>
        <LongformSubTitle>Consumer insight drives the aesthetic</LongformSubTitle>
        <LongformParagraph>
          We map decision signals, skepticism triggers, and whitespace in category conventions before visual development
          starts.
        </LongformParagraph>
        <LongformSubTitle>Compliance-aware, not compliance-paralyzed</LongformSubTitle>
        <LongformParagraph>
          We push for differentiated execution while staying inside defensible messaging boundaries.
        </LongformParagraph>
        <LongformSubTitle>Digital-first, physical-ready</LongformSubTitle>
        <LongformParagraph>
          Discovery for wellness brands usually starts online. We prioritize digital trust-building and then extend into
          packaging and print.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Common questions from wellness teams">
        {FAQ_ITEMS.map((item) => (
          <div key={item.question} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <LongformSubTitle>{item.question}</LongformSubTitle>
            <LongformParagraph>{item.answer}</LongformParagraph>
          </div>
        ))}
      </LongformSection>

      <LongformSection title="Related reads and references">
        <LongformParagraph>
          Read{" "}
          <a href="/journal/brand-strategy-vs-brand-identity" className="atla-link" style={{ color: "#222" }}>
            brand strategy vs brand identity
          </a>{" "}
          for a full strategic narrative lens.
        </LongformParagraph>
        <LongformParagraph>
          Pair this with{" "}
          <a href="/brand-strategy" className="atla-link" style={{ color: "#222" }}>
            brand strategy
          </a>{" "}
          and the full{" "}
          <a href="/services" className="atla-link" style={{ color: "#222" }}>
            service scope
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformCta
        title="Start with a conversation"
        description="Tell us about the product, audience, and what is not landing. We will tell you what we see and whether we are the right fit."
        actions={[
          { href: "/contact", label: "Start a project →" },
          { href: "/", label: "Browse selected work →" },
        ]}
      />
    </AtlaLongformLayout>
  );
}
