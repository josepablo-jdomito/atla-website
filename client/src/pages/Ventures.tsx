import { useMemo } from "react";
import { Link } from "wouter";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { useSiteProjects } from "@/components/site/siteProjects";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";
import { formatMetaTitle, ORGANIZATION_SCHEMA } from "@shared/siteSeo";

const copy = siteCopy.ventures;

const COVER_WIDTHS = [480, 720, 960, 1280];

/** The project slug a venture links to, when it links to a project page here. */
function projectSlug(href: string) {
  const match = href.match(/^\/projects\/([^/?#]+)/);
  return match ? match[1] : null;
}

/**
 * A quiet page (JP, 2026-11-05): a name and one line each. A venture with a project page
 * here shows that project's cover and links to it; one without (WeLoveDaily) shows no image.
 */
export default function Ventures() {
  const { projects } = useSiteProjects();
  const bySlug = useMemo(() => new Map(projects.map((project) => [project.slug, project])), [projects]);
  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle(copy.metaTitle, "Atla")}
        description={copy.metaDescription}
        pathname="/ventures"
        structuredData={ORGANIZATION_SCHEMA}
      />
      <div className="site-page-body">
        <header className="page-intro">
          <h1 className="page-intro__title">{copy.title}</h1>
          <p className="page-intro__lead">{copy.lead}</p>
        </header>
        <ul className="ventures-list">
          {copy.items.map((item, index) => {
            const external = item.href.startsWith("http");
            const slug = projectSlug(item.href);
            const project = slug ? bySlug.get(slug) : undefined;
            const dims = project ? getImageDimensions(project.coverImage) : null;
            const inner = (
              <>
                <span className="ventures-list__text">
                  <span className="site-item-title ventures-list__name">{item.name}</span>
                  <span className="ventures-list__line">{item.line}</span>
                </span>
                {project ? (
                  <img
                    className="ventures-list__cover"
                    src={getOptimizedImageUrl(project.coverImage, { width: 960, quality: 82 }) || project.coverImage}
                    srcSet={buildImageSrcSet(project.coverImage, COVER_WIDTHS, { quality: 82 })}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    alt=""
                    width={dims?.width}
                    height={dims?.height}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                ) : null}
              </>
            );
            return (
              <li key={item.name} className="ventures-list__row" data-has-cover={project ? "" : undefined}>
                {external ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="ventures-list__link">
                    {inner}
                  </a>
                ) : (
                  <Link href={item.href} className="ventures-list__link">
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </PageShell>
  );
}
