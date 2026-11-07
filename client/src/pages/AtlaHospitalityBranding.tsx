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

const SERVICE_PAGE = INDUSTRY_SERVICE_PAGES.hospitality;
const FAQ_ITEMS = SERVICE_PAGE.faqItems;

export default function AtlaHospitalityBranding() {
  return (
    <AtlaLongformLayout
      pathname="/hospitality-branding"
      title="Hospitality Branding Agency"
      titleSuffix="Atla"
      description="Branding for hospitality companies that need identity systems strong enough to hold across physical spaces, digital booking flows, and guest-facing touchpoints."
      structuredData={buildServiceSchema(SERVICE_PAGE)}
    >
      <LongformHero
        eyebrow="Hospitality branding"
        h1="Hospitality branding that holds from the booking page to the room"
        paragraphs={[
          "A guest sees the napkin, the confirmation email, the sign at check-in and the Instagram grid. All of it has to feel like the same place.",
          "Most hospitality brands are built for opening day. Then come a second location, new channels and new staff, and the identity stops holding.",
          "We build the strategy, the identity, the digital work and the environmental guidelines together. Your team knows what on-brand means without having to ask.",
        ]}
        cta={
          <LongformAction href="/brief">Start a project</LongformAction>
        }
      />

      <LongformSection title="What hospitality brands usually ask us for">
        <LongformSubTitle>Strategy for new concepts</LongformSubTitle>
        <LongformParagraph>
          Positioning, naming direction, audience and competitive framing, done before any visual work. We decide what
          the property stands for, who it is for, and how it should feel next to what is already out there.
        </LongformParagraph>
        <LongformSubTitle>One identity for every touchpoint</LongformSubTitle>
        <LongformParagraph>
          Logo, type, color, icons and the rules for using them on menus, signage, packaging, uniforms, key cards, screens
          and print. One system instead of a pile of loose assets.
        </LongformParagraph>
        <LongformSubTitle>Digital design for booking</LongformSubTitle>
        <LongformParagraph>
          Websites and landing pages built to convert and to be found. We design the path from the first search result
          to the confirmed reservation.
        </LongformParagraph>
        <LongformSubTitle>Art direction and content standards</LongformSubTitle>
        <LongformParagraph>
          Photography guidelines, editorial templates and social formats. Your marketing team makes new content without
          sending every post to a creative director.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Selected hospitality work">
        <LongformParagraph>
          <strong>Rústico</strong>. An open-fire dinner at Acre, a resort and farm in San José del Cabo, given a brand for its first season.{" "}
          <a href="/projects/rustico" className="longform-link" aria-label={"View project: Rústico"}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Pax &amp; Beneficia</strong>{" "}
          <a href="/projects/pax-and-beneficia" className="longform-link" aria-label={"View project: Pax &amp; Beneficia"}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Alma Brava</strong>{" "}
          <a href="/projects/alma-brava" className="longform-link" aria-label={"View project: Alma Brava"}>
            View project →
          </a>
        </LongformParagraph>
        <LongformParagraph>
          <strong>Tequila Unido</strong>{" "}
          <a href="/projects/tequila-unido" className="longform-link" aria-label={"View project: Tequila Unido"}>
            View project →
          </a>
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Why hospitality teams hire Atla">
        <LongformSubTitle>Physical and digital from the start</LongformSubTitle>
        <LongformParagraph>
          We build one system that works on a phone and on the side of a
          building.
        </LongformParagraph>
        <LongformSubTitle>Strategy before mood boards</LongformSubTitle>
        <LongformParagraph>
          We start with positioning, the competition and the guest's path through the property. Visual decisions come
          after the strategic ones are locked. See{" "}
          <a href="/brand-strategy" className="longform-link">
            our brand strategy process
          </a>
          .
        </LongformParagraph>
        <LongformSubTitle>Guidelines your team will use</LongformSubTitle>
        <LongformParagraph>
          Templates, asset libraries and clear rules that grow with the operation. The full delivery model is on{" "}
          <a href="/how-we-work" className="longform-link">
            how we work
          </a>
          .
        </LongformParagraph>
        <LongformSubTitle>Senior people, start to finish</LongformSubTitle>
        <LongformParagraph>
          The people in the strategy sessions are the people doing the design.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Questions hospitality teams ask">
        {FAQ_ITEMS.map((item) => (
          <LongformFaqItem key={item.question}>
            <LongformSubTitle>{item.question}</LongformSubTitle>
            <LongformParagraph>{item.answer}</LongformParagraph>
          </LongformFaqItem>
        ))}
      </LongformSection>

      <LongformSection title="Related reads">
        <LongformParagraph>
          For the long version, read{" "}
          <a href="/journal/hospitality-branding-guide" className="longform-link">
            the hospitality branding guide
          </a>
          .
        </LongformParagraph>
        <LongformParagraph>
          Or see the{" "}
          <a href="/services" className="longform-link">
            services overview
          </a>{" "}
          and the full{" "}
          <a href="/" className="longform-link">
            work archive
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformCta
        title="Start with a conversation"
        description="Tell us about the property, the timeline and what is not working. We will say if we are the right fit."
        actions={[
          { href: "/brief", label: "Start a project" },
          { href: "/", label: "Browse selected work →" },
        ]}
      />
    </AtlaLongformLayout>
  );
}
