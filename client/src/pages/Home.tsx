import { useMemo } from "react";
import { useLocation } from "wouter";
import { HOME_META_DESCRIPTION, ORGANIZATION_SCHEMA, SITE_ORIGIN, formatMetaTitle } from "@shared/siteSeo";
import { PageShell } from "@/components/site/PageShell";
import { RotatingPhrase } from "@/components/site/RotatingPhrase";
import { AskBar } from "@/components/site/AskBar";
import { IdeaBlocks } from "@/components/site/IdeaBlocks";
import { ProjectCard } from "@/components/site/ProjectCard";
import { LogoRow } from "@/components/site/LogoRow";
import { Archive } from "@/components/site/Archive";
import { HOME_FEATURED_LIMIT, featuredProjects, useSiteProjects } from "@/components/site/siteProjects";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";

const { home } = siteCopy;
/** The first two featured projects run large, the rest in a three-up grid. */
const FEATURE_COUNT = 2;
const PHRASES = [...home.phrases];

export default function Home() {
  const [location] = useLocation();
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
    <PageShell>
      <SeoHead
        title={formatMetaTitle("Atla", "Strategy-Led Branding Studio")}
        description={HOME_META_DESCRIPTION}
        pathname="/"
        robots={isRoot ? "index,follow" : "noindex,follow"}
        image={featured[0]?.coverImage}
        structuredData={structuredData}
      />

      <section className="home-hero" aria-labelledby="home-headline">
        <h1 id="home-headline" className="home-hero__headline">
          <span className="home-hero__lead">{home.headlineLead}</span>{" "}
          <RotatingPhrase items={PHRASES} />
        </h1>
        <AskBar />
      </section>

      <div className="home-body">
        <IdeaBlocks />

        {featured.length > 0 ? (
          <section className="home-featured" aria-labelledby="featured-label">
            <div className="home-section-head">
              <h2 id="featured-label" className="home-section-label">
                {home.featuredLabel}
              </h2>
            </div>
            <ul className="home-featured__grid">
              {featured.map((project, index) => (
                <li key={project.slug} data-size={index < FEATURE_COUNT ? "feature" : "grid"}>
                  <ProjectCard project={project} size={index < FEATURE_COUNT ? "feature" : "grid"} priority={index === 0} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <LogoRow logos={home.logos} />
        <Archive />
      </div>
    </PageShell>
  );
}
