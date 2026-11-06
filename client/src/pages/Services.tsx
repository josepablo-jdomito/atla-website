import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { useSiteProjects } from "@/components/site/siteProjects";
import { siteCopy } from "@/content/siteCopy";
import { buildServicesStructuredData } from "@/lib/sitePageSchema";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";
import { formatMetaTitle } from "@shared/siteSeo";

/**
 * Services after tbp.studio/services (JP, 2026-11-05): the four moments on top narrow the
 * rows; each discipline is a row with one line and an Includes list that opens; a real
 * project cover sits beside the rows and follows the one in view. Text links only.
 */

const copy = siteCopy.services;
const structuredData = buildServicesStructuredData();
const COVER_WIDTHS = [480, 720, 960, 1280];

export default function Services() {
  const { projects } = useSiteProjects();
  const [moment, setMoment] = useState<string>("");
  const [active, setActive] = useState<string>(copy.disciplines[0].id);
  const rowRefs = useRef(new Map<string, HTMLElement>());

  const rows = useMemo(
    () => (moment ? copy.disciplines.filter((d) => (d.moments as readonly string[]).includes(moment)) : copy.disciplines),
    [moment],
  );
  const bySlug = useMemo(() => new Map(projects.map((project) => [project.slug, project])), [projects]);
  const current = rows.find((row) => row.id === active) ?? rows[0];
  const example = current ? bySlug.get(current.project) : undefined;

  // The photo follows the row in view: the last row whose top has passed 40% of the viewport,
  // or the last row once the page can scroll no further. An IntersectionObserver band missed the
  // last row (it only reports rows that change state, so a row leaving the band updated nothing).
  useEffect(() => {
    const elements = rows.map((row) => rowRefs.current.get(row.id)).filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;
    let frame = 0;
    const pick = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let next = elements[0];
      if (atEnd && elements[elements.length - 1].getBoundingClientRect().top < window.innerHeight) {
        next = elements[elements.length - 1];
      } else {
        for (const el of elements) if (el.getBoundingClientRect().top <= line) next = el;
      }
      const id = next.dataset.discipline;
      if (id) setActive((prev) => (prev === id ? prev : id));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(pick);
    };
    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [rows]);

  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle(copy.metaTitle, "Atla")}
        description={copy.metaDescription}
        pathname="/services"
        structuredData={structuredData}
      />
      <div className="site-page-body services">
        <header className="page-intro">
          <h1 className="page-intro__title">{copy.title}</h1>
          <p className="page-intro__lead">{copy.lead}</p>
        </header>

        <nav className="moments-strip" aria-label={copy.momentsLabel}>
          <button type="button" className="moments-strip__item" aria-pressed={moment === ""} onClick={() => setMoment("")}>
            {copy.allMoments}
          </button>
          {copy.moments.map((item) => (
            <button
              key={item.id}
              type="button"
              className="moments-strip__item"
              aria-pressed={moment === item.id}
              onClick={() => setMoment((value) => (value === item.id ? "" : item.id))}
            >
              {item.title}
            </button>
          ))}
        </nav>
        {moment ? (
          <p className="moments-strip__line">
            {copy.moments.find((item) => item.id === moment)?.line}{" "}
            <Link href="/brief" className="site-link moments-strip__brief">
              {copy.cta}
            </Link>
          </p>
        ) : null}

        <div className="services-grid">
          <div className="services-rows">
            {rows.map((row) => (
              <section
                key={row.id}
                id={row.id}
                data-discipline={row.id}
                ref={(el) => {
                  if (el) rowRefs.current.set(row.id, el);
                  else rowRefs.current.delete(row.id);
                }}
                className="discipline"
                data-active={current?.id === row.id}
                aria-labelledby={`discipline-${row.id}`}
              >
                <h2 id={`discipline-${row.id}`} className="discipline__title">
                  {row.title}
                </h2>
                <p className="discipline__line">{row.line}</p>
                {example && current?.id === row.id ? (
                  <Link href={`/projects/${example.slug}`} className="discipline__example discipline__example--inline">
                    <img
                      src={getOptimizedImageUrl(example.coverImage, { width: 720, quality: 82 }) || example.coverImage}
                      srcSet={buildImageSrcSet(example.coverImage, COVER_WIDTHS, { quality: 82 })}
                      sizes="100vw"
                      alt={example.title}
                      width={getImageDimensions(example.coverImage)?.width}
                      height={getImageDimensions(example.coverImage)?.height}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="discipline__example-name">{example.title}</span>
                  </Link>
                ) : null}
                <details className="discipline__includes">
                  <summary className="discipline__summary">{copy.includesOpen}</summary>
                  <ul className="discipline__list">
                    {row.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </details>
                <Link href="/brief" className="site-link discipline__cta">
                  {copy.cta}
                </Link>
              </section>
            ))}
          </div>

          <aside className="services-aside" aria-hidden="true">
            {example ? (
              <Link href={`/projects/${example.slug}`} className="discipline__example" tabIndex={-1}>
                <img
                  key={example.slug}
                  src={getOptimizedImageUrl(example.coverImage, { width: 960, quality: 84 }) || example.coverImage}
                  srcSet={buildImageSrcSet(example.coverImage, COVER_WIDTHS, { quality: 84 })}
                  sizes="40vw"
                  alt=""
                  width={getImageDimensions(example.coverImage)?.width}
                  height={getImageDimensions(example.coverImage)?.height}
                  decoding="async"
                />
                <span className="discipline__example-name">
                  {copy.exampleLabel}: {example.title}
                </span>
              </Link>
            ) : null}
          </aside>
        </div>

        <section className="engagements" aria-labelledby="engagements-title">
          <h2 id="engagements-title" className="engagements__title">
            {copy.engagementsTitle}
          </h2>
          <p className="engagements__lead">{copy.engagementsLead}</p>
          <ol className="how-steps">
            {copy.engagements.map((item) => (
              <li key={item.title} className="how-step">
                <h3 className="how-step__title">{item.title}</h3>
                <p className="how-step__body">{item.line}</p>
              </li>
            ))}
          </ol>
          <Link href="/brief" className="site-link discipline__cta">
            {copy.cta}
          </Link>
        </section>
      </div>
    </PageShell>
  );
}
