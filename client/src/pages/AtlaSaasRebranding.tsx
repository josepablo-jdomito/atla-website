import {
  AtlaLongformLayout,
  LongformCta,
  LongformHero,
  LongformParagraph,
  LongformSection,
} from "@/components/atla/AtlaLongformLayout";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";
import { INDUSTRY_SERVICE_PAGES, buildServiceSchema } from "@/lib/serviceSchema";

const SERVICE_PAGE = INDUSTRY_SERVICE_PAGES.saasRebranding;

/** Cover images from the work grid and the project-page heroes. Same Sanity assets, not new files. */
const CASE_WIDTHS = [480, 800, 1200, 1600];

const INCLUDED = [
  {
    title: "Brand strategy and positioning.",
    body: "Category framing, audience, competitive differentiation and a messaging hierarchy, so the company is understood for what it is now.",
  },
  {
    title: "Visual identity system.",
    body: "Logo, typography, color, iconography and illustration, built to hold across product UI and marketing.",
  },
  {
    title: "Website.",
    body: "Clear information architecture, a shorter path to sign up, and content structure that search can read.",
  },
  {
    title: "Sales and investor materials.",
    body: "A pitch deck master template, key slides and one-pagers held to the same standard as the product and the site.",
  },
] as const;

const CASES = [
  {
    name: "Anything AI",
    href: "/projects/anything-ai",
    src: "https://cdn.sanity.io/images/dvufm78f/production/fe876ba7a046ce5a296c76818176c813979abe57-1744x964.png",
    alt: "Anything wordmark, Any in an italic serif and thing in a plain grotesk",
    body: "Anything, first called Create, is an AI app builder: you type what you want and it comes back as a working product. The company came to Atla with a launch date and a brand to rebuild before it. In the middle of the project they chose the name Anything, and the identity had to carry it. The brand became typographic, an editorial serif italic set against a plain grotesk, and stayed free of the glow and gradients the category leans on. Website, brand identity and motion, United States, 2026. A rebrand. The funding round that followed made TechCrunch.",
  },
  {
    name: "Pathize Health",
    href: "/projects/pathize-health",
    src: "https://cdn.sanity.io/images/dvufm78f/production/2613441e5407b5837f710ed8b3293abaeff3afeb-1744x964.png",
    alt: "Pathize Health cards in cream, sky blue, mint and mustard, with a heart icon of two pills",
    body: "Pathize Health built an app for people living with Long COVID, ME/CFS and POTS. The app reads data from wearables including Apple Health, Fitbit, Garmin and Polar, and helps each person pace the day against a personal limit. We built the brand identity, the website and the brand strategy: a heart icon made of pills that meet, Cooper Light and Circular on cream, sky blue, mint and mustard, and a brand book the team used to finish a website relaunch. United States, 2024.",
  },
] as const;

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
          "Atla rebuilds brand strategy and identity for SaaS companies whose product, name or category has moved on. We build one system across the product, the website, sales and investor materials, so buyers and investors meet the company you are now.",
        ]}
      />

      <LongformSection title="Why SaaS teams hire Atla">
        <LongformParagraph>
          The people at kickoff are the people doing the work. Strategy comes before design, and a creative director
          decides what ships. We can fit a new brand to the product tokens you already have, or carry the brand further
          into the product: the visual language and how components should look.
        </LongformParagraph>
        <LongformParagraph>
          When{" "}
          <a href="/projects/anything-ai" className="longform-link">
            Anything AI
          </a>
          , first called Create, came to us with a launch date and a brand to rebuild, the identity had to take a new name
          in the middle of the project and still be ready to launch. The funding round that followed made TechCrunch. That
          is the standard we work to: a brand that can hold a launch, a rename, and the next conversation with investors.
        </LongformParagraph>
      </LongformSection>

      <LongformSection title="When a SaaS brand has to move with the product">
        <LongformParagraph>
          The right moment is when the product, the name or the category has already changed, and the brand still
          describes the earlier version. Buyers meet one company in the product and another in the marketing. A clear
          story, a site that search can read, and a deck that feels intentional give the company you are now a single
          surface.
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
        <LongformParagraph>A SaaS rebrand at Atla is one system. Depending on the work, it covers:</LongformParagraph>
        <ol className="how-steps rebrand-includes">
          {INCLUDED.map((item) => (
            <li key={item.title} className="how-step">
              <h3 className="site-item-title">{item.title}</h3>
              <p className="how-step__body">{item.body}</p>
            </li>
          ))}
        </ol>
        <LongformParagraph>
          If you are branding a software product from the beginning, see our{" "}
          <a href="/saas-branding" className="longform-link">
            SaaS branding
          </a>{" "}
          page.
        </LongformParagraph>
      </LongformSection>

      <section className="page-section rebrand-work" aria-labelledby="saas-rebrand-work">
        <h2 id="saas-rebrand-work" className="site-section-title">
          Selected software work
        </h2>
        <div className="rebrand-cases">
          {CASES.map((item) => {
            const dimensions = getImageDimensions(item.src);
            return (
              <article key={item.href} className="rebrand-case">
                <h3 className="site-item-title rebrand-case__title">
                  <a href={item.href} className="longform-link">
                    {item.name}
                  </a>
                  .
                </h3>
                <a href={item.href} className="rebrand-case__media">
                  <img
                    className="rebrand-case__cover"
                    src={getOptimizedImageUrl(item.src, { width: 1200, quality: 82 }) || item.src}
                    srcSet={buildImageSrcSet(item.src, CASE_WIDTHS, { quality: 82 })}
                    sizes="(max-width: 767px) 100vw, (min-width: 1280px) calc(100vw - 80px), calc(100vw - 48px)"
                    alt={item.alt}
                    width={dimensions?.width}
                    height={dimensions?.height}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <p className="rebrand-case__body">{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <LongformSection title="How we work">
        <LongformParagraph>
          Every project follows the same steps, scaled to scope. We show options grounded in the strategy, with a
          recommendation. The full process is on{" "}
          <a href="/how-we-work" className="longform-link">
            how we work
          </a>
          .
        </LongformParagraph>
      </LongformSection>

      <LongformCta
        title="Start a project"
        description="Tell us about the product, where the brand has to go next, and the timeline. We will tell you what to fix first, and if we are the right fit."
        actions={[{ href: "/brief", label: "Start a project" }]}
      />
    </AtlaLongformLayout>
  );
}
