import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { useSiteProjects } from "@/components/site/siteProjects";
import { siteCopy } from "@/content/siteCopy";
import { buildServicesStructuredData } from "@/lib/sitePageSchema";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";
import { formatMetaTitle } from "@shared/siteSeo";
import { BracketLabel } from "@/components/site/ContactForm";
import "@/styles/pages.css";

/**
 * Services in JP's Figma language (2026-11-05): the page title in ABC Synt, the four moments as
 * bracket-labelled text options that narrow the rows, a script title per discipline, the includes
 * under a bracket label, and a real project cover beside the rows that follows the one in view.
 */

const copy = siteCopy.services;
const structuredData = buildServicesStructuredData();
const COVER_WIDTHS = [480, 720, 960, 1280];

function briefHref(moment: string) {
  return `/brief?moment=${encodeURIComponent(moment)}`;
}

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

  const momentItem = copy.moments.find((item) => item.id === moment);

  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle(copy.metaTitle, "Atla")}
        description={copy.metaDescription}
        pathname="/services"
        structuredData={structuredData}
      />
      <div className="fp services">
        <header className="fp-hero">
          <div className="fp-hero__text">
            <h1 className="fp-display">{copy.title}</h1>
            <p className="fp-body">{copy.lead}</p>
            <nav className="fp-moments" aria-label={copy.momentsLabel}>
              <BracketLabel>{copy.momentsLabel}</BracketLabel>
              <div className="fp-moments__options">
                <button
                  type="button"
                  className="fp-option moments-strip__item"
                  aria-pressed={moment === ""}
                  onClick={() => setMoment("")}
                >
                  {copy.allMoments}
                </button>
                {copy.moments.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="fp-option moments-strip__item"
                    aria-pressed={moment === item.id}
                    onClick={() => setMoment((value) => (value === item.id ? "" : item.id))}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              {momentItem ? (
                <p className="fp-moments__line">
                  {momentItem.line} <Link href={briefHref(momentItem.brief)}>{copy.cta}</Link>
                </p>
              ) : null}
            </nav>
          </div>
        </header>

        <div className="fp-svc">
          {rows.map((row) => (
            <section
              key={row.id}
              id={row.id}
              data-discipline={row.id}
              ref={(el) => {
                if (el) rowRefs.current.set(row.id, el);
                else rowRefs.current.delete(row.id);
              }}
              className="discipline fp-svc__row"
              data-active={current?.id === row.id}
              aria-labelledby={`discipline-${row.id}`}
            >
              <h2 id={`discipline-${row.id}`} className="fp-script fp-svc__title">
                {row.title}
              </h2>
              <div className="fp-svc__body">
                <p className="fp-svc__line">{row.line}</p>
                {example && current?.id === row.id ? (
                  <Link href={`/projects/${example.slug}`} className="fp-photo fp-svc__inline">
                    <img
                      src={
                        getOptimizedImageUrl(example.coverImage, {
                          width: 720,
                          quality: 82,
                        }) || example.coverImage
                      }
                      srcSet={buildImageSrcSet(example.coverImage, COVER_WIDTHS, { quality: 82 })}
                      sizes="100vw"
                      alt={example.title}
                      width={getImageDimensions(example.coverImage)?.width}
                      height={getImageDimensions(example.coverImage)?.height}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="fp-photo__name">{example.title}</span>
                  </Link>
                ) : null}
                <div className="fp-svc__includes">
                  <BracketLabel>{copy.includesTitle}</BracketLabel>
                  <ul className="fp-list discipline__list">
                    {row.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <Link href={moment ? briefHref(momentItem?.brief ?? moment) : "/brief"} className="fp-textlink discipline__cta">
                  {copy.cta}
                </Link>
              </div>
            </section>
          ))}

          <aside className="fp-svc__aside" aria-hidden="true" style={{ gridRow: `1 / span ${rows.length}` }}>
            {example ? (
              <Link href={`/projects/${example.slug}`} className="fp-photo" tabIndex={-1}>
                <img
                  key={example.slug}
                  src={
                    getOptimizedImageUrl(example.coverImage, {
                      width: 720,
                      quality: 84,
                    }) || example.coverImage
                  }
                  srcSet={buildImageSrcSet(example.coverImage, COVER_WIDTHS, {
                    quality: 84,
                  })}
                  sizes="260px"
                  alt=""
                  width={getImageDimensions(example.coverImage)?.width}
                  height={getImageDimensions(example.coverImage)?.height}
                  decoding="async"
                />
                <span className="fp-photo__name">{example.title}</span>
              </Link>
            ) : null}
          </aside>
        </div>

        <section className="fp-row" aria-labelledby="engagements-title" data-block="ways">
          <h2 id="engagements-title" className="fp-script">
            {copy.engagementsLabel}
          </h2>
          <div className="fp-row__content">
            <p className="fp-body">{copy.engagementsLead}</p>
            <ul className="fp-pairs">
              {copy.engagements.map((item) => (
                <li key={item.title} className="fp-pair">
                  <span>{item.title}</span>
                  <span className="fp-pair__b">{item.line}</span>
                </li>
              ))}
            </ul>
            <Link href="/brief" className="fp-button">
              {copy.cta}
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
