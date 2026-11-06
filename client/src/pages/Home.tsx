import { useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { HOME_META_DESCRIPTION, ORGANIZATION_SCHEMA, SITE_ORIGIN, formatMetaTitle } from "@shared/siteSeo";
import { PageShell } from "@/components/site/PageShell";
import { WorkWall } from "@/components/site/WorkWall";
import { queryFromSearch } from "@/components/site/workFilters";
import { HOME_FEATURED_LIMIT, featuredProjects, useSiteProjects } from "@/components/site/siteProjects";
import { SeoHead } from "@/components/seo/SeoHead";

/**
 * The home opens with the work and nothing else: no headline, no bar, no
 * sections (JP, 2026-10-04 and 2026-11-05). The sales argument lives on
 * /services. The open wall loops forever, so the logo band and footer only
 * appear when a typed search makes it finite (UX interview 8, 2026-11-05).
 */
export default function Home() {
  const [location] = useLocation();
  const search = useSearch();
  const finite = Boolean(queryFromSearch(search));
  const { projects } = useSiteProjects();
  const featured = useMemo(() => featuredProjects(projects, HOME_FEATURED_LIMIT), [projects]);

  // `/work` renders the same page; `/` is the canonical one.
  const isRoot = location === "/";
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
    <PageShell tail={finite}>
      <SeoHead
        title={formatMetaTitle("Atla", "Strategy-Led Branding Studio")}
        description={HOME_META_DESCRIPTION}
        pathname="/"
        robots={isRoot ? "index,follow" : "noindex,follow"}
        image={featured[0]?.coverImage}
        structuredData={structuredData}
      />
      <WorkWall />
    </PageShell>
  );
}
