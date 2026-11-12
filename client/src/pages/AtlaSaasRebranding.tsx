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

const SERVICE_PAGE = INDUSTRY_SERVICE_PAGES.saasRebranding;
const FAQ_ITEMS = SERVICE_PAGE.faqItems;

export default function AtlaSaasRebranding() {
  return (
    <AtlaLongformLayout
      pathname="/saas-rebranding"
      title="SaaS Rebranding Agency"
      titleSuffix="Identity for Growing Software Teams"
      description="Atla rebuilds brand strategy and identity for SaaS companies that have outgrown the launch brand. See the rebrand work for Anything AI."
      structuredData={buildServiceSchema(SERVICE_PAGE)}
    >
      <LongformHero
        h1="SaaS rebranding for software that has outgrown its launch brand"
        paragraphs={[
          "Atla is a SaaS rebranding agency for companies whose product, name or category has moved on, and the brand has not. We rebuild strategy and identity as one system, so the product, the site, sales and investor materials tell the same story, and the launch brand stops working against the company you are now.",
        ]}
        cta={<LongformAction href="/brief">Start a project</LongformAction>}
      />

      <LongformSection title="When a SaaS company needs a rebrand">
        <LongformParagraph>
          A rebrand is due when the product, the name or the category no longer matches how the company shows up.
        </LongformParagraph>
        <LongformParagraph>
          The product has changed. What you sell now is not what the brand was built to explain. Buyers meet a different
          company than the one in the marketing.
        </LongformParagraph>
        <LongformParagraph>
          The name no longer holds. Sometimes the product is renamed in the middle of a rebuild, and the identity has to
          carry the new name. That is what happened with Anything, first called Create.
        </LongformParagraph>
        <LongformParagraph>
          The category has moved. The market talks about you in a new frame, or you have left the frame the old brand was
          designed for. A brand built for the old category will keep pulling you back into it.
        </LongformParagraph>
        <LongformParagraph>
          If the company is still finding product-market fit, a full rebrand is usually early. We wrote about that timing
          in{" "}
          <a href="/journal/why-most-startups-rebrand-too-late" className="longform-link">
            why most startups rebrand too late
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="What's included">
        <LongformParagraph>
          A SaaS rebrand at Atla is one system, not a set of files. Depending on what is broken, it covers:
        </LongformParagraph>
        <LongformParagraph>
          <strong>Brand strategy and positioning.</strong> Category framing, audience, competitive differentiation and a
          messaging hierarchy, so the company is understood for what it is now, not for the version that launched.
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
          <strong>Sales and investor materials.</strong> Pitch deck master templates, key slides and one-pagers held to the
          same standard as the product and the site.
        </LongformParagraph>
        <LongformParagraph>
          Before we rebuild anything, we find out what is broken. Sometimes the logo is fine and the problem is the
          messaging, or the website, or inconsistency across channels. The diagnosis tells you where to start.
        </LongformParagraph>
        <LongformParagraph>
          If you are branding a software product from the beginning, rather than changing one that already exists, see our{" "}
          <a href="/saas-branding" className="longform-link">
            SaaS branding
          </a>{" "}
          page.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Working with the product system you already have">
        <LongformParagraph>
          Many SaaS teams already have a product design system. We can fit a new brand to existing product tokens, or carry
          the brand further into the product where it needs it. We design the brand side of the interface: the visual
          language and how components should look. For deep UX work, we partner with your product design team.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="Selected software work">
        <LongformParagraph>
          <strong>
            <a href="/projects/anything-ai" className="longform-link">
              Anything AI
            </a>
            .
          </strong>{" "}
          Anything, first called Create, is an AI app builder: you type what you want and it comes back as a working
          product. The company came to Atla with a launch date and a brand to rebuild before it. In the middle of the
          project they chose the name Anything, and the identity had to carry it. The brand became typographic, and stayed
          free of the glow and gradients the category leans on. Website, brand identity and motion. United States, 2026. A
          rebrand. The funding round that followed made TechCrunch.
        </LongformParagraph>
        <LongformParagraph>
          <strong>
            <a href="/projects/pathize-health" className="longform-link">
              Pathize Health
            </a>
            .
          </strong>{" "}
          Pathize Health built an app for people living with Long COVID, ME/CFS and POTS. Brand identity, website and
          brand strategy for a health-tech product. United States, 2024.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="How we work">
        <LongformParagraph>
          Strategy comes before design. Design comes before production. No step starts until the one before it is locked.
        </LongformParagraph>
        <LongformParagraph>
          Every engagement follows the same steps, scaled to scope. Small senior teams, with no handoff chain: the people
          at kickoff are the people doing the work. We show options grounded in the strategy, with a recommendation. No
          endless concept rounds.
        </LongformParagraph>
        <LongformParagraph>
          The full process is on{" "}
          <a href="/how-we-work" className="longform-link">
            how we work
          </a>
          .
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

      <LongformCta
        title="Start a project"
        description="Tell us about the product, why the current brand no longer holds, and the timeline. We will tell you what to fix first and if we are the right fit."
        actions={[{ href: "/brief", label: "Start a project" }]}
      />
    </AtlaLongformLayout>
  );
}
