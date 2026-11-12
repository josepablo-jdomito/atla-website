import { ORGANIZATION_NAME, SITE_ORIGIN } from "../../../shared/siteSeo.ts";

/**
 * Service + FAQPage JSON-LD for the industry landing pages. Shared by the pages
 * (runtime SeoHead) and script/build.ts (prerendered head), so both emit the same schema.
 */

export type ServiceFaqItem = {
  question: string;
  answer: string;
};

export type ServiceSchemaInput = {
  path: string;
  name: string;
  description: string;
  faqItems?: ReadonlyArray<{ question: string; answer: unknown }>;
};

export function buildServiceSchema({ path, name, description, faqItems }: ServiceSchemaInput) {
  const schema: Array<Record<string, unknown>> = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name,
      description,
      url: `${SITE_ORIGIN}${path}`,
      areaServed: ["United States", "Latin America"],
      provider: {
        "@type": "Organization",
        name: ORGANIZATION_NAME,
        url: SITE_ORIGIN,
      },
    },
  ];

  if (faqItems && faqItems.length > 0) {
    schema.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: typeof item.answer === "string" ? item.answer : "",
        },
      })),
    });
  }

  return schema;
}

export const INDUSTRY_SERVICE_PAGES = {
  hospitality: {
    path: "/hospitality-branding",
    name: "Hospitality branding that holds from the booking page to the room",
    description:
      "Brand strategy, identity, digital design and environmental guidelines for hotels, restaurants and travel brands.",
    faqItems: [
      {
        question: "How long does a full hospitality branding project take?",
        answer:
          "It depends on how many touchpoints, locations and approval layers there are. We set the timeline with you during scoping, before work starts.",
      },
      {
        question: "Do you work with properties that are already open?",
        answer:
          "Yes. Repositioning an open property is a different job from launching a new one. We keep what returning guests recognize and change the rest without confusing them.",
      },
      {
        question: "Can you handle environmental and signage design?",
        answer:
          "We design the system and give your signage vendors production-ready files and specs. We do not fabricate or install. We direct the people who do.",
      },
      {
        question: "What if we already have a logo but need everything else?",
        answer:
          "That is common. We check whether the mark can carry a full system or needs refinement, then build from there.",
      },
    ],
  },
  cpg: {
    path: "/cpg-branding",
    name: "CPG branding and packaging for the shelf and the screen",
    description:
      "Brand strategy, identity, packaging design and launch assets for consumer packaged goods companies.",
    faqItems: [
      {
        question: "Do you handle structural packaging design?",
        answer:
          "We design the graphics and the visual system. For structure and dielines, we work with your packaging supplier or a specialist we recommend.",
      },
      {
        question: "Can you work with existing manufacturer specs?",
        answer: "Yes. We design inside the substrate, print method and dieline your manufacturer gives us.",
      },
      {
        question: "What about Amazon and DTC listing design?",
        answer:
          "Included. Photography direction, A+ content layouts and storefront templates are part of the launch assets.",
      },
      {
        question: "How do you handle line extensions?",
        answer: "We build the first system to stretch. A new variant extends it instead of reopening it.",
      },
    ],
  },
  wellness: {
    path: "/wellness-branding",
    name: "Wellness branding people can trust",
    description:
      "Brand strategy, identity, packaging and digital design for wellness and health companies that need to feel credible and warm at once.",
    faqItems: [
      {
        question: "Do you work with health tech and digital health platforms?",
        answer:
          "Yes. We have built brand systems for health-tech teams where the identity has to hold across the app, the marketing site and investor materials.",
      },
      {
        question: "Can you help with supplement packaging specifically?",
        answer:
          "Yes. We do wellness packaging systems and launch assets, including SKU logic, hierarchy and DTC-ready visual standards.",
      },
      {
        question: "How do you handle messaging in regulated categories?",
        answer:
          "We write the messaging framework and flag claims that may need legal review. Final regulatory approval stays with your legal team.",
      },
      {
        question: "What is different about wellness branding?",
        answer:
          "The bar for trust is higher. Buyers are skeptical and do their research, so every visual and verbal signal has to be precise and still feel human.",
      },
    ],
  },
  saas: {
    path: "/saas-branding",
    name: "SaaS branding that does not look like everyone else's",
    description: "Positioning, identity systems, website design and sales materials for SaaS teams.",
    faqItems: [
      {
        question: "Can you work with our existing product design system?",
        answer:
          "Yes. We can fit the new brand to your existing product tokens, or carry the brand further into the product where it needs it.",
      },
      {
        question: "Do you design actual product UI?",
        answer:
          "We design the brand side of the interface: the visual language and how components should look. For deep UX work, we partner with your product design team.",
      },
      {
        question: "What about pitch decks?",
        answer:
          "Included in most SaaS scopes. We build a master template and the key slides, so your team can update the deck and keep it consistent.",
      },
      {
        question: "How fast can you move?",
        answer: "We scope the work around your launch or your raise, and run focused sprints when timing is tight.",
      },
    ],
  },
  startup: {
    path: "/startup-branding",
    name: "Startup branding for companies about to raise, or just done",
    description:
      "Atla builds brand strategy and identity for startups before and after a raise. See the work for Anything AI and Pathize Health.",
    faqItems: [
      {
        question: "Should we rebrand before or after we raise?",
        answer:
          "If the round is close, fix what investors will see first: the story, the deck and the site. If the round just closed, rebrand before the money turns into hires and campaigns, so growth amplifies the right brand.",
      },
      {
        question: "Do we need a full rebrand or just a new logo?",
        answer: "Often neither on its own. We diagnose first. If the logo works and the messaging does not, we fix the messaging.",
      },
      {
        question: "Can you work with our existing product design system?",
        answer:
          "Yes. We can align a new brand system to existing product tokens, or extend the brand into a broader product expression where it is needed.",
      },
      {
        question: "Do you design pitch decks?",
        answer:
          "Yes. We build master templates and key slides so the team can keep the deck consistent after we hand it over.",
      },
      {
        question: "We are pre-seed. Is it too early?",
        answer:
          "Usually, for a full rebrand. At that stage you need a clean, credible identity that does not work against you in a pitch meeting. The full system comes after product-market fit.",
      },
    ],
  },
  brandingAgencyAustin: {
    path: "/branding-agency-austin",
    name: "A branding agency working from Austin",
    description:
      "A branding studio working from Austin. Brand strategy and identity for companies in the US and abroad. See work for Anything AI and Angeles Wellness.",
    faqItems: [
      {
        question: "Do you work with clients in Austin?",
        answer:
          "Yes. We work with clients in Austin and in other cities. The studio is distributed, and the work is the same.",
      },
      {
        question: "Do you have an office in Austin I can visit?",
        answer:
          "We work from Austin, as we do from Mexico City, Barcelona, Lima and Caracas. We do not publish a street address or run walk-in hours.",
      },
      {
        question: "Can you work with a company that is not in Austin?",
        answer:
          "Yes. The two cases on this page are United States work, and neither is an Austin client. Angeles Wellness is from Los Angeles.",
      },
    ],
  },
} satisfies Record<string, ServiceSchemaInput & { faqItems: ServiceFaqItem[] }>;

/** Prerendered JSON-LD by route, for script/build.ts. */
export function industryServiceSchemaForPath(pathname: string) {
  const page = Object.values(INDUSTRY_SERVICE_PAGES).find((entry) => entry.path === pathname);
  return page ? buildServiceSchema(page) : undefined;
}
