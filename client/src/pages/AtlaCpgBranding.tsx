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
        eyebrow="CPG branding"
        h1="CPG branding and packaging for the shelf and the screen"
        paragraphs={[
          "A packaged product gets a glance on the shelf, a thumbnail on a marketplace and a thumb on social. That is all the time it gets.",
          "We design CPG brands to be recognized fast. Strategy, identity, packaging and launch assets are one system, so nothing gets lost between the deck and the store.",
        ]}
        cta={
          <LongformAction href="/contact">Start a project →</LongformAction>
        }
      />

      <LongformSection title="What CPG brands usually ask us for">
        <LongformSubTitle>Strategy and positioning</LongformSubTitle>
        <LongformParagraph>
          Category analysis, competitive mapping, audience and messaging. We decide where the product sits and why
          someone reaches for it.
        </LongformParagraph>
        <LongformSubTitle>Packaging systems</LongformSubTitle>
        <LongformParagraph>
          Primary and secondary packaging, labels, retail artwork and production specs that stay consistent as the SKU
          count grows.
        </LongformParagraph>
        <LongformSubTitle>The brand off the package</LongformSubTitle>
        <LongformParagraph>
          Logo, type, color and visual language for the website, ads, social and retail.
        </LongformParagraph>
        <LongformSubTitle>Launch assets</LongformSubTitle>
        <LongformParagraph>
          Ecommerce photography direction, Amazon and DTC listings, social templates and landing pages.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Selected CPG work">
        <LongformParagraph>
          <strong>Ando</strong>. Identity and packaging for a gummy supplement line, built to be seen at retail.{" "}
          <a href="/projects/ando" className="longform-link">
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>TigreTigre</strong>{" "}
          <a href="/projects/tigretigre" className="longform-link">
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Reggie</strong>{" "}
          <a href="/projects/reggie" className="longform-link">
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Oxylife</strong>{" "}
          <a href="/projects/oxylife" className="longform-link">
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Bovi Health</strong>{" "}
          <a href="/projects/bovi-health" className="longform-link">
            View project →
          </a>
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Why CPG teams hire Atla">
        <LongformSubTitle>We design for the shelf</LongformSubTitle>
        <LongformParagraph>
          Pretty packaging that does not sell is wasted budget. We test hierarchy, legibility and how the pack stands
          apart before we lock a direction.
        </LongformParagraph>
        <LongformSubTitle>Strategy and packaging in one place</LongformSubTitle>
        <LongformParagraph>
          Strategy, identity, packaging and digital are one engagement, so the launch looks like one brand everywhere.
          How we plan it is on{" "}
          <a href="/how-we-work" className="longform-link">
            how we work
          </a>
          .
        </LongformParagraph>
        <LongformSubTitle>Designed for the press</LongformSubTitle>
        <LongformParagraph>
          We design with the print method, the substrate and the cost in mind, so the concept survives production.
        </LongformParagraph>
        <LongformSubTitle>Built for the next SKU</LongformSubTitle>
        <LongformParagraph>
          A new product should extend the system. It should not need a redesign.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Questions CPG teams ask">
        {FAQ_ITEMS.map((item) => (
          <LongformFaqItem key={item.question}>
            <LongformSubTitle>{item.question}</LongformSubTitle>
            <LongformParagraph>{item.answer}</LongformParagraph>
          </LongformFaqItem>
        ))}
      </LongformSection>

      <LongformSection title="Related reads">
        <LongformParagraph>
          Start with{" "}
          <a href="/journal/brand-audit-framework" className="longform-link">
            the brand audit framework
          </a>
          .
        </LongformParagraph>
        <LongformParagraph>
          Before design, read about{" "}
          <a href="/brand-strategy" className="longform-link">
            brand strategy
          </a>{" "}
          and the full{" "}
          <a href="/services" className="longform-link">
            service model
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformCta
        title="Start with a conversation"
        description="Tell us about the product, the category and where it sells. We will tell you quickly if we are the right partner."
        actions={[
          { href: "/contact", label: "Start a project →" },
          { href: "/", label: "Browse selected work →" },
        ]}
      />
    </AtlaLongformLayout>
  );
}
