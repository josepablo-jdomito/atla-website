// Structured data for /services. Shared by the runtime SeoHead and the prerender
// route table (script/build.ts), so the static HTML and the live page ship the same JSON-LD.
// Relative imports: script/build.ts loads this file outside Vite's @ alias.
import { siteCopy } from "../content/siteCopy.ts";
import { ORGANIZATION_NAME, SITE_ORIGIN } from "../../../shared/siteSeo.ts";

export function buildServicesStructuredData(): Array<Record<string, unknown>> {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ "@type": "ListItem", position: 1, name: "Services", item: `${SITE_ORIGIN}/services` }],
  };
  const services = siteCopy.services.disciplines.map((discipline) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: discipline.title,
    description: `${discipline.line} ${discipline.includes.join(". ")}.`,
    provider: { "@type": "Organization", name: ORGANIZATION_NAME, url: SITE_ORIGIN },
    areaServed: ["United States", "Latin America"],
  }));
  return [breadcrumb, ...services];
}
