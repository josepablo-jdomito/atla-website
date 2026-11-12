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

const SERVICE_PAGE = INDUSTRY_SERVICE_PAGES.brandingAgencyAustin;
const FAQ_ITEMS = SERVICE_PAGE.faqItems;

export default function AtlaBrandingAgencyAustin() {
  return (
    <AtlaLongformLayout
      pathname="/branding-agency-austin"
      title="Austin Branding Agency"
      titleSuffix="Strategy and Identity"
      description="A branding studio working from Austin. Brand strategy and identity for companies in the US and abroad. See work for Anything AI and Angeles Wellness."
      structuredData={buildServiceSchema(SERVICE_PAGE)}
    >
      <LongformHero
        h1="A branding agency working from Austin"
        paragraphs={[
          "Atla is a branding studio of senior people, working from Austin, Mexico City, Barcelona, Lima and Caracas. We build brand strategy and identity for companies in the United States and abroad. The studio is distributed: we do not list a street address, and we do not present this work as a Texas-only portfolio.",
        ]}
        cta={<LongformAction href="/brief">Start a project</LongformAction>}
      />

      <LongformSection title="What people mean when they look for a branding agency in Austin">
        <LongformParagraph>
          They want a studio that can do the work, that will be in the meetings, and that they can reach in a US time
          zone. They are not looking for a walk-in desk.
        </LongformParagraph>
        <LongformParagraph>
          Atla works from Austin as part of a global team. The people at kickoff are the people doing the work. A founder
          in Austin, or in another city, works with the same senior team.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="How a distributed team runs a project">
        <LongformParagraph>
          Strategy comes before design. Design comes before production. No step starts until the one before it is locked.
        </LongformParagraph>
        <LongformParagraph>
          The model is on{" "}
          <a href="/how-we-work" className="longform-link">
            how we work
          </a>
          . Who we are, and the cities we work from, is on{" "}
          <a href="/about" className="longform-link">
            Why Atla
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Work in the United States">
        <LongformParagraph>
          The cases below are Atla work for companies in the United States. They are not Austin clients, and we do not
          present them as such. The full scope of services is on{" "}
          <a href="/services" className="longform-link">
            services
          </a>
          .
        </LongformParagraph>
        <LongformParagraph>
          <strong>
            <a href="/projects/anything-ai" className="longform-link">
              Anything AI
            </a>
            .
          </strong>{" "}
          Anything, first called Create, is an AI app builder: you type what you want and it comes back as a working
          product. The company came to Atla with a launch date and a brand to rebuild before it. In the middle of the
          project they chose the name Anything, and the identity had to carry it. Website, brand identity and motion.
          United States, 2026. A rebrand.
        </LongformParagraph>
        <LongformParagraph>
          <strong>
            <a href="/projects/angeles-wellness" className="longform-link">
              Angeles Wellness
            </a>
            .
          </strong>{" "}
          Angeles Wellness is an herbal cleansing brand from Los Angeles, started by Fernando Ramirez. In 2025 he came to
          Atla for the messaging, the branding and the cohesiveness of the brand. The brand had grown fast under another
          name and needed to speak to its audience again. Brand identity and motion. United States, 2025. A rebrand.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Questions">
        {FAQ_ITEMS.map((item) => (
          <LongformFaqItem key={item.question}>
            <LongformSubTitle>{item.question}</LongformSubTitle>
            <LongformParagraph>{item.answer}</LongformParagraph>
          </LongformFaqItem>
        ))}
      </LongformSection>

      <LongformCta
        title="Start a project"
        description="Tell us about the brand, the city you operate from, and what is not working. We will tell you if we are the right fit."
        actions={[{ href: "/brief", label: "Start a project" }]}
      />
    </AtlaLongformLayout>
  );
}
