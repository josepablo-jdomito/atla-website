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
    name: "Hospitality branding that works across every guest touchpoint",
    description:
      "Brand strategy, identity systems, digital design, and environmental guidelines for hotels, restaurants, and travel brands.",
    faqItems: [
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
    ],
  },
  cpg: {
    path: "/cpg-branding",
    name: "CPG branding and packaging that performs on shelf and screen",
    description:
      "Brand strategy, visual identity, packaging design, and launch-ready digital assets for consumer packaged goods companies.",
    faqItems: [
      {
        question: "Do you handle structural packaging design?",
        answer:
          "We design graphics and visual systems. For structural and dieline engineering, we coordinate with your packaging supplier or recommended specialist partners.",
      },
      {
        question: "Can you work with existing manufacturer specs?",
        answer:
          "Yes. We design within substrate, print method, and dieline constraints provided by your manufacturer.",
      },
      {
        question: "What about Amazon and DTC listing design?",
        answer:
          "Included. We design photography direction, A+ content layouts, and storefront templates as part of launch-ready assets.",
      },
      {
        question: "How do you handle line extensions?",
        answer:
          "The initial system is built for extensibility so adding new variants takes days instead of weeks.",
      },
    ],
  },
  wellness: {
    path: "/wellness-branding",
    name: "Wellness branding built for trust, clarity, and real connection",
    description:
      "Brand strategy, identity, packaging, and digital design for wellness and health companies balancing credibility with emotional resonance.",
    faqItems: [
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
    ],
  },
  saas: {
    path: "/saas-branding",
    name: "SaaS branding that separates signal from noise",
    description:
      "Positioning, visual identity systems, web conversion architecture, and sales-ready materials for SaaS teams.",
    faqItems: [
      {
        question: "Can you work with our existing product design system?",
        answer:
          "Yes. We can align a new brand system to existing product tokens or extend the brand into a broader product expression where needed.",
      },
      {
        question: "Do you design actual product UI?",
        answer:
          "We design brand-level interface language and component styling guidance. For deep UX workflows, we can collaborate with dedicated product design teams.",
      },
      {
        question: "What about pitch decks?",
        answer:
          "Included in most SaaS scopes. We build master templates and key slides so internal teams can produce consistent deck updates.",
      },
      {
        question: "How fast can you move?",
        answer:
          "Most SaaS branding engagements run 6–10 weeks. For pre-launch or fundraising pressure windows, we can scope focused sprints.",
      },
    ],
  },
} satisfies Record<string, ServiceSchemaInput & { faqItems: ServiceFaqItem[] }>;

/** Prerendered JSON-LD by route, for script/build.ts. */
export function industryServiceSchemaForPath(pathname: string) {
  const page = Object.values(INDUSTRY_SERVICE_PAGES).find((entry) => entry.path === pathname);
  return page ? buildServiceSchema(page) : undefined;
}
