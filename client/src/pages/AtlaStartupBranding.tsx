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

const SERVICE_PAGE = INDUSTRY_SERVICE_PAGES.startup;
const FAQ_ITEMS = SERVICE_PAGE.faqItems;

export default function AtlaStartupBranding() {
  return (
    <AtlaLongformLayout
      pathname="/startup-branding"
      title="Startup Branding Agency"
      titleSuffix="Brand Identity for Funded Startups"
      description="Atla builds brand strategy and identity for startups before and after a raise. See the work for Anything AI and Pathize Health."
      structuredData={buildServiceSchema(SERVICE_PAGE)}
    >
      <LongformHero
        h1="Startup branding for companies about to raise, or just done"
        paragraphs={[
          "Atla is a startup branding agency for the moment the brand starts to cost you: right before a round, or right after one. We build positioning, identity and website as one system, so the company investors meet in the deck is the same company customers meet in the product and buyers meet in procurement.",
        ]}
        cta={<LongformAction href="/brief">Start a project →</LongformAction>}
      />

      <LongformSection title="When to rebrand: before or after the round">
        <LongformParagraph>The timing depends on the business, not on how you feel about the logo.</LongformParagraph>
        <LongformParagraph>
          Too early is before product-market fit. If you are still working out who the customer is, the positioning will
          move, and a brand built on it will move too.
        </LongformParagraph>
        <LongformParagraph>
          The right window is after product-market fit and before scale. You know who you are for. You are about to spend
          on hires, sales and marketing, and every one of those investments will either amplify a strong brand or multiply
          a weak one. In practice, that window often lines up with the move from seed to Series A, or from Series A to B.
        </LongformParagraph>
        <LongformParagraph>
          Before the round, the brand sits in every investor meeting. A clear story and a deck that feels intentional do
          not raise the money, but a rough brand adds friction to every conversation.
        </LongformParagraph>
        <LongformParagraph>
          After the round, the money goes to growth. That is the moment to lock the brand, before the first enterprise deal
          and before the first serious marketing spend, because every dollar of marketing amplifies whatever brand exists
          at that moment.
        </LongformParagraph>
        <LongformParagraph>
          We wrote the long version in{" "}
          <a href="/journal/why-most-startups-rebrand-too-late" className="longform-link">
            why most startups rebrand too late
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="What's included">
        <LongformParagraph>
          A startup rebrand at Atla is one system, not a set of files. Depending on the stage, it covers:
        </LongformParagraph>
        <LongformParagraph>
          <strong>Brand strategy and positioning.</strong> Category framing, audience, competitive differentiation and a
          messaging hierarchy, so the company is understood for what matters, not for a feature list.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Visual identity system.</strong> Logo, typography, color, iconography and illustration, built to hold
          across product UI and marketing.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Website.</strong> Clear information architecture, stronger conversion paths and content structure that
          search can read.
        </LongformParagraph>
        <LongformParagraph>
          <strong>Investor and sales materials.</strong> Pitch deck master templates, key slides and one-pagers held to the
          same standard as the product and the site.
        </LongformParagraph>
        <LongformParagraph>
          Not every startup needs all of it. Before we rebuild anything, we find out what is broken. Sometimes the logo is
          fine and the problem is the messaging, or the website, or inconsistency across channels. The diagnosis tells you
          where the money pays back first.
        </LongformParagraph>
        <LongformParagraph>
          If your startup is software, our{" "}
          <a href="/saas-branding" className="longform-link">
            SaaS branding
          </a>{" "}
          page goes deeper on product and marketing systems.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="How we work">
        <LongformParagraph>
          Strategy decisions happen before design decisions. Design decisions happen before production. No phase starts
          until the previous one is locked.
        </LongformParagraph>
        <LongformParagraph>
          Every engagement runs through the same four phases, scaled to scope: discovery, strategy, identity design, and
          application and launch. The strategy document becomes the decision framework for every creative choice after it,
          and that sequencing is what prevents revision cascades later.
        </LongformParagraph>
        <LongformParagraph>
          The team is senior and small. The people in the kickoff are the people doing the work, with no account-manager
          relay between you and the designers. We present two or three strategically grounded options with a
          recommendation, not endless concept rounds.
        </LongformParagraph>
        <LongformParagraph>
          The full process is on{" "}
          <a href="/how-we-work" className="longform-link">
            how we work
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Startups we've branded">
        <LongformParagraph>
          <strong>
            <a href="/projects/anything-ai" className="longform-link">
              Anything AI
            </a>
            .
          </strong>{" "}
          Anything is an AI-powered creative platform built on the freedom to create anything. Its previous identity leaned
          too heavily on the language of technology. The rebrand had to express boundless potential without falling into
          the visual clichés of AI. We centered the new identity on the word "any," drew a custom wordmark to feel light
          and fluid, built a color system of sky-inspired gradients and designed an abstract symbol of layered forms.
          Branding, web design, animation and digital product, New York City, 2026.
        </LongformParagraph>
        <LongformParagraph>
          <strong>
            <a href="/projects/pathize-health" className="longform-link">
              Pathize Health
            </a>
            .
          </strong>{" "}
          Brand identity and digital presence for a health-tech SaaS platform focused on patient wellness and clinical
          communication. Branding, identity system, digital product and strategy, Los Angeles, 2024.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Questions founders ask">
        {FAQ_ITEMS.map((item) => (
          <LongformFaqItem key={item.question}>
            <LongformSubTitle>{item.question}</LongformSubTitle>
            <LongformParagraph>{item.answer}</LongformParagraph>
          </LongformFaqItem>
        ))}
      </LongformSection>

      <LongformCta
        title="Start a project"
        description="Tell us where the company is going next: the round, the first enterprise deal, the launch. We will tell you what the brand needs first, and whether we are the right fit."
        actions={[{ href: "/brief", label: "Start a project →" }]}
      />
    </AtlaLongformLayout>
  );
}
