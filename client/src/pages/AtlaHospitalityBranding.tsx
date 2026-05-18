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
    question: "How long does a full hospitality branding project take?",
    answer:
      "Most projects run 8–14 weeks from kickoff to final delivery. Larger properties or multi-location rollouts may take longer depending on the number of touchpoints and approval layers.",
  },
  {
    question: "Do you work with properties that are already open?",
    answer:
      "Yes. Repositioning an existing property is a different challenge than launching a new one — the brand needs to evolve without confusing returning guests.",
  },
  {
    question: "Can you handle environmental and signage design?",
    answer:
      "We design the system and provide production-ready files and specifications for signage vendors. We do not fabricate or install, but we direct the process.",
  },
  {
    question: "What if we already have a logo but need everything else?",
    answer:
      "That is common. We evaluate whether the existing mark can anchor a full system or whether it needs refinement, then build from there.",
  },
];

export default function AtlaHospitalityBranding() {
  return (
    <AtlaLongformLayout
      pathname="/hospitality-branding"
      title="Hospitality Branding Agency"
      titleSuffix="Hotels, Restaurants and Travel"
      description="Branding for hospitality companies that need identity systems strong enough to hold across physical spaces, digital booking flows, and guest-facing touchpoints."
      structuredData={buildServiceSchema({
        path: "/hospitality-branding",
        name: "Hospitality branding that works across every guest touchpoint",
        description:
          "Brand strategy, identity systems, digital design, and environmental guidelines for hotels, restaurants, and travel brands.",
        faqItems: FAQ_ITEMS,
      })}
    >
      <LongformHero
        eyebrow="Hospitality Branding"
        h1="Hospitality branding that works across every guest touchpoint"
        paragraphs={[
          "Hotels, restaurants, and travel brands live or die by consistency. The logo on the napkin, the booking confirmation email, the signage at check-in, and the Instagram grid all need to feel like the same place.",
          "Most hospitality companies outgrow their original identity within two years of opening. What worked for a soft launch stops working when the brand needs to scale across locations, channels, and staff turnover.",
          "We build identity systems that hold. Strategy, visual identity, digital design, and environmental guidelines are developed together so your team can execute without second-guessing what on-brand means.",
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

      <LongformSection title="What hospitality brands typically need from us">
        <LongformSubTitle>Brand strategy for new concepts</LongformSubTitle>
        <LongformParagraph>
          Positioning, naming direction, audience definition, and competitive framing built before the visual work
          begins. We clarify what the property stands for, who it attracts, and how it should feel relative to what
          already exists in the market.
        </LongformParagraph>
        <LongformSubTitle>Identity systems for multi-touchpoint environments</LongformSubTitle>
        <LongformParagraph>
          Logo, typography, color, iconography, and application rules designed for menus, signage, packaging, uniforms,
          key cards, digital platforms, and print collateral. One system, not twelve disconnected assets.
        </LongformParagraph>
        <LongformSubTitle>Digital design for booking and discovery</LongformSubTitle>
        <LongformParagraph>
          Websites and landing pages optimized for conversion, SEO, and visual storytelling. We design the experience
          from first search result to confirmed reservation.
        </LongformParagraph>
        <LongformSubTitle>Art direction and content standards</LongformSubTitle>
        <LongformParagraph>
          Photography guidelines, editorial templates, and social content frameworks so your marketing team can produce
          new content that stays on-brand without requiring creative director approval on every post.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Selected hospitality work">
        <LongformParagraph>
          <strong>The Bridge</strong> — Hospitality brand identity for a Bali-based hotel and restaurant concept. Refined,
          travel-forward visual system with editorial sensibility.{" "}
          <a href="/projects/the-bridge" className="atla-link" style={{ color: "#222" }}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Pax &amp; Beneficia</strong> —{" "}
          <a href="/projects/pax-and-beneficia" className="atla-link" style={{ color: "#222" }}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Alma Brava</strong> —{" "}
          <a href="/projects/alma-brava" className="atla-link" style={{ color: "#222" }}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Tequila Unido</strong> —{" "}
          <a href="/projects/tequila-unido" className="atla-link" style={{ color: "#222" }}>
            View project →
          </a>
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Why hospitality companies work with Atla">
        <LongformSubTitle>Physical + digital thinking from day one</LongformSubTitle>
        <LongformParagraph>
          Most agencies design for screens or for spaces, not both. We build systems that translate from a 4-inch phone
          to a 40-foot wall without losing coherence.
        </LongformParagraph>
        <LongformSubTitle>Strategy before aesthetics</LongformSubTitle>
        <LongformParagraph>
          We do not start with mood boards. We start with positioning, competitive context, and guest journey mapping.
          The visual decisions come after the strategic ones are locked. See{" "}
          <a href="/brand-strategy" className="atla-link" style={{ color: "#222" }}>
            our brand strategy process
          </a>
          .
        </LongformParagraph>
        <LongformSubTitle>Systems, not just deliverables</LongformSubTitle>
        <LongformParagraph>
          You get brand guidelines your team can actually use: templates, asset libraries, and execution rules that
          scale with your operation. The full delivery model is documented on{" "}
          <a href="/how-we-work" className="atla-link" style={{ color: "#222" }}>
            how we work
          </a>
          .
        </LongformParagraph>
        <LongformSubTitle>Senior-led, no handoffs to juniors</LongformSubTitle>
        <LongformParagraph>
          The people in strategy sessions are the same people doing the design work.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Common questions from hospitality teams">
        {FAQ_ITEMS.map((item) => (
          <div key={item.question} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <LongformSubTitle>{item.question}</LongformSubTitle>
            <LongformParagraph>{item.answer}</LongformParagraph>
          </div>
        ))}
      </LongformSection>

      <LongformSection title="Related reads and references">
        <LongformParagraph>
          Read the category deep dive in{" "}
          <a href="/journal/hospitality-branding-guide" className="atla-link" style={{ color: "#222" }}>
            the hospitality branding guide
          </a>
          .
        </LongformParagraph>
        <LongformParagraph>
          Compare this category against the broader{" "}
          <a href="/services" className="atla-link" style={{ color: "#222" }}>
            services overview
          </a>{" "}
          and the full{" "}
          <a href="/" className="atla-link" style={{ color: "#222" }}>
            work archive
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformCta
        title="Start with a conversation"
        description="Tell us about the property, the timeline, and what is not working. We will tell you honestly whether we are the right fit."
        actions={[
          { href: "/contact", label: "Start a project →" },
          { href: "/", label: "Browse selected work →" },
        ]}
      />
    </AtlaLongformLayout>
  );
}
