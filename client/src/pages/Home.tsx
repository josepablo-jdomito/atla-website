import { useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { HOME_META_DESCRIPTION, ORGANIZATION_SCHEMA, SITE_ORIGIN, formatMetaTitle } from "@shared/siteSeo";
import { PageShell } from "@/components/site/PageShell";
import { WorkWall } from "@/components/site/WorkWall";
import { HOME_FEATURED_LIMIT, featuredProjects, useSiteProjects } from "@/components/site/siteProjects";
import { SeoHead } from "@/components/seo/SeoHead";

/**
 * The home opens with the work and nothing else: no headline, no bar, no
 * sections (JP, 2026-10-04 and 2026-11-05). The sales argument lives on
 * /services. The wall stops after three passes and the logo band and footer
 * come out under it (JP, 2026-11-06: "el muro para y sale el footer").
 */
export default function Home() {
  const [location] = useLocation();
  const search = useSearch();
  const { projects } = useSiteProjects();
  const featured = useMemo(() => featuredProjects(projects, HOME_FEATURED_LIMIT), [projects]);

  // A filtered wall (/?sector=…) canonicalises to / and stays out of the index.
  const isRoot = location === "/" && !search;
  const structuredData = useMemo(
    () => [
      ORGANIZATION_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Atla selected work",
        numberOfItems: featured.length,
        itemListElement: featured.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: project.title,
          url: `${SITE_ORIGIN}/projects/${project.slug}`,
        })),
      },
    ],
    [featured],
  );

  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle("Atla", "Strategy-Led Branding Studio")}
        description={HOME_META_DESCRIPTION}
        pathname="/"
        robots={isRoot ? "index,follow" : "noindex,follow"}
        image={featured[0]?.coverImage}
        structuredData={structuredData}
      />
      <h1 className="sr-only">Atla, a strategy-led branding studio. Selected work.</h1>
      <WorkWall />
    </PageShell>
  );
}
