// Structured data for /services and /contact. Shared by the runtime SeoHead and the prerender
// route table (script/build.ts), so the static HTML and the live page ship the same JSON-LD.
// Relative imports: script/build.ts loads this file outside Vite's @ alias.
import { siteCopy } from "../content/siteCopy.ts";
import { CONTACT_EMAIL, ORGANIZATION_NAME, SITE_ORIGIN } from "../../../shared/siteSeo.ts";

export function buildServicesStructuredData(): Array<Record<string, unknown>> {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ "@type": "ListItem", position: 1, name: "Services", item: `${SITE_ORIGIN}/services` }],
  };
  const services = siteCopy.services.moments.map((moment) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: moment.title,
    description: `${moment.line} ${moment.items.join(". ")}.`,
    provider: { "@type": "Organization", name: ORGANIZATION_NAME, url: SITE_ORIGIN },
    areaServed: ["United States", "Latin America"],
  }));
  return [breadcrumb, ...services];
}

export const CONTACT_PAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Atla",
  url: `${SITE_ORIGIN}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: ORGANIZATION_NAME,
    email: CONTACT_EMAIL,
    url: SITE_ORIGIN,
  },
} as const;
