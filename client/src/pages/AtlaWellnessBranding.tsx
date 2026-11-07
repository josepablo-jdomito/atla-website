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

const SERVICE_PAGE = INDUSTRY_SERVICE_PAGES.wellness;
const FAQ_ITEMS = SERVICE_PAGE.faqItems;

export default function AtlaWellnessBranding() {
  return (
    <AtlaLongformLayout
      pathname="/wellness-branding"
      title="Wellness and Health Brand Design Agency"
      titleSuffix="Atla"
      description="Brand strategy and identity for wellness, health tech and care companies. Credible, warm, and written to stay inside the rules."
      structuredData={buildServiceSchema(SERVICE_PAGE)}
    >
      <LongformHero
        eyebrow="Wellness branding"
        h1="Wellness branding people can trust"
        paragraphs={[
          "People buying wellness are making decisions about their bodies, their routines and their mental health. The brand has to feel credible and approachable at once.",
          "Most wellness brands end up sterile and corporate, or soft and vague. Neither sells. The ones that grow feel specific and grounded, and look like nobody else.",
          "We build strategy, identity, packaging and digital that stay warm and credible everywhere the brand appears.",
        ]}
        cta={
          <LongformAction href="/brief">Start a project</LongformAction>
        }
      />

      <LongformSection title="What wellness and health brands usually ask us for">
        <LongformSubTitle>Strategy for categories that run on trust</LongformSubTitle>
        <LongformParagraph>
          Positioning that sets the brand apart without overclaiming. Messaging that lands and stays inside compliance.
        </LongformParagraph>
        <LongformSubTitle>Identity that is warm and credible</LongformSubTitle>
        <LongformParagraph>
          Logo, color, type and illustration that show care without looking like every other wellness brand.
        </LongformParagraph>
        <LongformSubTitle>Digital design for patients and users</LongformSubTitle>
        <LongformParagraph>
          Websites and product screens for people who research before they buy. Clear answers, visible proof and no
          friction on the way to sign up.
        </LongformParagraph>
        <LongformSubTitle>Packaging for supplements and DTC wellness</LongformSubTitle>
        <LongformParagraph>
          Labels and retail packaging that make the ingredients clear and still carry the brand's personality.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Selected wellness and health work">
        <LongformParagraph>
          <strong>Angeles Wellness</strong>. An herbal wellness system, rebranded so anyone can follow what the products do.{" "}
          <a href="/projects/angeles-wellness" className="longform-link" aria-label={"View project: Angeles Wellness"}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Pathize Health</strong>{" "}
          <a href="/projects/pathize-health" className="longform-link" aria-label={"View project: Pathize Health"}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Peachy Patients</strong>{" "}
          <a href="/projects/peachy-patients" className="longform-link" aria-label={"View project: Peachy Patients"}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Ando</strong>{" "}
          <a href="/projects/ando" className="longform-link" aria-label={"View project: Ando"}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Bovi Health</strong>{" "}
          <a href="/projects/bovi-health" className="longform-link" aria-label={"View project: Bovi Health"}>
            View project →
          </a>
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Why wellness teams hire Atla">
        <LongformSubTitle>Trust first</LongformSubTitle>
        <LongformParagraph>
          We design brands that earn credibility before they ask for a sale.
        </LongformParagraph>
        <LongformSubTitle>Insight before aesthetics</LongformSubTitle>
        <LongformParagraph>
          Before visual work starts, we map what makes buyers decide, what makes them doubt, and where the category's
          conventions leave room.
        </LongformParagraph>
        <LongformSubTitle>Inside the rules</LongformSubTitle>
        <LongformParagraph>
          We push the design as far as it can go and keep the messaging inside what you can defend.
        </LongformParagraph>
        <LongformSubTitle>Online first</LongformSubTitle>
        <LongformParagraph>
          People usually find wellness brands online. We build trust there first, then carry the system into packaging
          and print.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Questions wellness teams ask">
        {FAQ_ITEMS.map((item) => (
          <LongformFaqItem key={item.question}>
            <LongformSubTitle>{item.question}</LongformSubTitle>
            <LongformParagraph>{item.answer}</LongformParagraph>
          </LongformFaqItem>
        ))}
      </LongformSection>

      <LongformSection title="Related reads">
        <LongformParagraph>
          Read{" "}
          <a href="/journal/brand-strategy-vs-brand-identity" className="longform-link">
            brand strategy vs brand identity
          </a>{" "}
          for the difference between the two.
        </LongformParagraph>
        <LongformParagraph>
          Then see{" "}
          <a href="/brand-strategy" className="longform-link">
            brand strategy
          </a>{" "}
          and the full{" "}
          <a href="/services" className="longform-link">
            service scope
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformCta
        title="Start with a conversation"
        description="Tell us about the product, the audience and what is not landing. We will tell you what we see and if we are the right fit."
        actions={[
          { href: "/brief", label: "Start a project" },
          { href: "/", label: "Browse selected work →" },
        ]}
      />
    </AtlaLongformLayout>
  );
}
