import { useMemo } from "react";
import { Link } from "wouter";
import { PageShell } from "@/components/site/PageShell";
import { BracketLabel } from "@/components/site/ContactForm";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { useSiteProjects } from "@/components/site/siteProjects";
import { buildImageSrcSet, getOptimizedImageUrl } from "@shared/imageDelivery";
import { formatMetaTitle, ORGANIZATION_SCHEMA } from "@shared/siteSeo";
import "@/styles/pages.css";

const copy = siteCopy.ventures;

const THUMB_WIDTHS = [200, 400, 600];

/** The project slug a venture links to, when it links to a project page here. */
function projectSlug(href: string) {
  const match = href.match(/^\/projects\/([^/?#]+)/);
  return match ? match[1] : null;
}

/** `welovedaily.net` for an outside link, the word "Project" for a page here. */
function destination(href: string) {
  return href.startsWith("http") ? href.replace(/^https?:\/\//, "").replace(/\/$/, "") : "Project";
}

/**
 * Ventures in the Index list style of JP's Figma (2026-11-05): the script title, then one row per
 * venture: a square thumbnail drifting across the row, and a 12px line under it (name, line, where
 * it goes). A venture without a project page here (WeLoveDaily) shows no image.
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
      <div className="fp ventures">
        <header className="fp-row fp-row--top">
          <h1 className="fp-script">{copy.title}</h1>
          <div className="fp-row__content">
            <p className="fp-body">{copy.lead}</p>
          </div>
        </header>
        <ul className="fp-index ventures-list">
          {copy.items.map((item, index) => {
            const external = item.href.startsWith("http");
            const slug = projectSlug(item.href);
            const project = slug ? bySlug.get(slug) : undefined;
            const inner = (
              <>
                {project ? (
                  <img
                    className="fp-index__thumb"
                    src={
                      getOptimizedImageUrl(project.coverImage, {
                        width: 400,
                        height: 400,
                        fit: "crop",
                        quality: 82,
                      }) || project.coverImage
                    }
                    srcSet={buildImageSrcSet(project.coverImage, THUMB_WIDTHS, {
                      quality: 82,
                    })}
                    sizes="(max-width: 599px) 100vw, 200px"
                    alt=""
                    width={200}
                    height={200}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                ) : null}
                <span className="fp-index__line">
                  <span className="fp-index__name">{item.name}</span>
                  <span className="fp-index__muted">{item.line}</span>
                  <span className="fp-index__end">
                    <BracketLabel muted>{destination(item.href)}</BracketLabel>
                  </span>
                </span>
              </>
            );
            return (
              <li key={item.name} className="fp-index__row ventures-list__row" data-has-cover={project ? "" : undefined}>
                {external ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="fp-index__link">
                    {inner}
                  </a>
                ) : (
                  <Link href={item.href} className="fp-index__link">
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
