import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Link, useSearch } from "wouter";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { useSiteProjects } from "@/components/site/siteProjects";
import { siteCopy } from "@/content/siteCopy";
import { buildServicesStructuredData } from "@/lib/sitePageSchema";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";
import { formatMetaTitle } from "@shared/siteSeo";

/**
 * Services as one route per moment (JP, 2026-11-06). The visitor says where they are ("Where are
 * you?", a radiogroup; the choice lives in `?moment=`), and the page becomes that moment's route:
 * what usually happens, the three or four disciplines that matter (rows with an Includes list and a
 * real project cover that follows the row in view, after tbp.studio), the engagements that fit, one
 * project, two doors (the brief and the brand check), then the full index of every discipline.
 * With no moment chosen each act shows its general version; nothing is ever empty.
 */

const copy = siteCopy.services;
const structuredData = buildServicesStructuredData();
const COVER_WIDTHS = [480, 720, 960, 1280];

export type MomentId = (typeof copy.moments)[number]["id"];
type Discipline = (typeof copy.disciplines)[number];
type Engagement = (typeof copy.engagements)[number];
const MOMENT_IDS = copy.moments.map((m) => m.id) as readonly MomentId[];

/** The moment named in a search string, or "" (any moment) when it names none we know. */
export function momentFromSearch(search: string): MomentId | "" {
  const value = new URLSearchParams(search).get("moment") ?? "";
  return (MOMENT_IDS as readonly string[]).includes(value) ? (value as MomentId) : "";
}

/** The disciplines a moment's route shows, in page order. With no moment, the ones every moment leans on. */
export function disciplinesFor(moment: MomentId | ""): Discipline[] {
  if (!moment) return copy.disciplines.filter((d) => (copy.anyDisciplines as readonly string[]).includes(d.id));
  return copy.disciplines.filter((d) => (d.moments as readonly string[]).includes(moment));
}

/** The engagements that fit a moment, in the order the moment names them. With no moment, all of them. */
export function engagementsFor(moment: MomentId | ""): Engagement[] {
  if (!moment) return [...copy.engagements];
  return copy.engagementsFit[moment]
    .map((title) => copy.engagements.find((e) => e.title === title))
    .filter((e): e is Engagement => Boolean(e));
}

/** What usually happens, and the one project, for a moment or for any moment. */
export function routeFor(moment: MomentId | "") {
  const m = copy.moments.find((item) => item.id === moment);
  return m
    ? { happens: m.happens, project: { slug: m.project, line: m.projectLine } }
    : { happens: copy.happensAny, project: copy.anyProject };
}

// The picker's options in tab and arrow order. "Any moment" is not one of them: it is the reset
// beside the disciplines heading, and the state with no radio checked.
const OPTIONS: { id: MomentId; title: string; line: string }[] = copy.moments.map((m) => ({
  id: m.id,
  title: m.title,
  line: m.line,
}));

export default function Services() {
  const { projects } = useSiteProjects();
  const search = useSearch();
  const moment = momentFromSearch(search);
  // The route fades only after the visitor changes the moment, never on arrival.
  const [changed, setChanged] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [active, setActive] = useState<string>(copy.disciplines[0].id);
  const rowRefs = useRef(new Map<string, HTMLElement>());
  const optionRefs = useRef(new Map<string, HTMLButtonElement>());

  const rows = useMemo(() => disciplinesFor(moment), [moment]);
  const engagements = useMemo(() => engagementsFor(moment), [moment]);
  const route = routeFor(moment);
  const bySlug = useMemo(() => new Map(projects.map((project) => [project.slug, project])), [projects]);
  const current = rows.find((row) => row.id === active) ?? rows[0];
  const example = current ? bySlug.get(current.project) : undefined;
  const featured = bySlug.get(route.project.slug);

  const choose = (next: MomentId | "", focus = false) => {
    if (focus) optionRefs.current.get(next)?.focus();
    if (next === moment) return;
    const params = new URLSearchParams(window.location.search);
    if (next) params.set("moment", next);
    else params.delete("moment");
    const query = params.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
    setChanged(true);
    const title = copy.moments.find((m) => m.id === next)?.title;
    setAnnouncement(title ? `${copy.liveFor} ${title}.` : copy.liveAny);
  };

  const onPickerKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = OPTIONS.findIndex((o) => o.id === moment);
    const last = OPTIONS.length - 1;
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index < 0 || index >= last ? 0 : index + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index <= 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next < 0) return;
    event.preventDefault();
    choose(OPTIONS[next].id, true);
  };

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

  const renderRow = (row: Discipline) => (
    <section
      key={row.id}
      data-discipline={row.id}
      ref={(el) => {
        if (el) rowRefs.current.set(row.id, el);
        else rowRefs.current.delete(row.id);
      }}
      className="discipline"
      data-active={current?.id === row.id}
      aria-labelledby={`discipline-${row.id}`}
    >
      <h3 id={`discipline-${row.id}`} className="site-item-title discipline__title">
        {row.title}
      </h3>
      <p className="discipline__line">{moment ? row.byMoment[moment] : row.line}</p>
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
    </section>
  );

  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle(copy.metaTitle, "Atla")}
        description={copy.metaDescription}
        pathname="/services"
        structuredData={structuredData}
      />
      <div className="site-page-body services">
        <header className="page-intro services-intro">
          <h1 className="page-intro__title">{copy.title}</h1>
          <p className="page-intro__lead">{copy.lead}</p>
        </header>

        <section className="services-picker" aria-labelledby="services-picker-title">
          <h2 id="services-picker-title" className="site-label services-picker__title">
            {copy.pickerTitle}
          </h2>
          <div
            className="moment-picker"
            role="radiogroup"
            aria-labelledby="services-picker-title"
            data-chosen={moment ? "true" : "false"}
            onKeyDown={onPickerKey}
          >
            {OPTIONS.map((option) => {
              const checked = option.id === moment;
              const key = option.id;
              // Roving tabindex: the checked radio, or the first one when none is checked.
              const tabbable = moment ? checked : option.id === OPTIONS[0].id;
              return (
                <button
                  key={key}
                  ref={(el) => {
                    if (el) optionRefs.current.set(option.id, el);
                    else optionRefs.current.delete(option.id);
                  }}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  tabIndex={tabbable ? 0 : -1}
                  className="moment-picker__option"
                  data-moment={key}
                  aria-labelledby={`moment-${key}`}
                  aria-describedby={`moment-${key}-line`}
                  onClick={() => choose(option.id)}
                >
                  <span id={`moment-${key}`} className="moment-picker__title">
                    {option.title}
                  </span>
                  <span id={`moment-${key}-line`} className="moment-picker__line">
                    {option.line}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
        <p className="services-live" aria-live="polite">
          {announcement}
        </p>

        {/* The moment's route. Keyed by the moment so a change remounts it and fades it in once. */}
        <div key={moment || "any"} className={["services-route", changed ? "services-fade" : ""].filter(Boolean).join(" ")} data-moment={moment || "any"}>
          <section className="services-act services-happens" aria-labelledby="services-happens-title">
            <h2 id="services-happens-title" className="site-label services-act__label">
              {copy.happensTitle}
            </h2>
            <div className="services-happens__lines">
              {route.happens.map((line) => (
                <p key={line} className="services-happens__line">
                  {line}
                </p>
              ))}
            </div>
          </section>

          <section className="services-act services-disciplines" aria-labelledby="services-what-title">
            <div className="services-what">
              <h2 id="services-what-title" className="site-section-title services-what__title">
                {moment ? copy.disciplinesTitleByMoment[moment] : copy.disciplinesTitle}
              </h2>
              {moment ? (
                <button type="button" className="site-text-button services-what__reset" onClick={() => choose("")}>
                  {copy.allMoments}
                </button>
              ) : null}
            </div>
            <div className="services-grid">
              <div className="services-rows">{rows.map(renderRow)}</div>
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
          </section>

          <section className="services-act engagements" aria-labelledby="engagements-title">
            <h2 id="engagements-title" className="site-section-title engagements__title">
              {copy.engagementsTitle}
            </h2>
            <div className="engagements__body">
              <p className={["engagements__lead", moment ? "engagements__lead--moment" : ""].filter(Boolean).join(" ")}>
                {moment ? copy.engagementsByMoment[moment] : copy.engagementsLead}
              </p>
              <ol className="how-steps" data-count={engagements.length}>
                {engagements.map((item) => (
                  <li key={item.title} className="how-step">
                    <h3 className="site-item-title how-step__title">{item.title}</h3>
                    <p className="how-step__body">{item.line}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {featured ? (
            <section className="services-act services-work" aria-labelledby="services-work-title">
              <h2 id="services-work-title" className="site-label services-act__label">
                {copy.workTitle}
              </h2>
              <Link href={`/projects/${featured.slug}`} className="services-work__link">
                <span className="services-work__text">
                  <span className="services-work__name">{featured.title}</span>
                  <span className="services-work__line">{route.project.line}</span>
                </span>
                <img
                  className="services-work__cover"
                  src={getOptimizedImageUrl(featured.coverImage, { width: 960, quality: 84 }) || featured.coverImage}
                  srcSet={buildImageSrcSet(featured.coverImage, COVER_WIDTHS, { quality: 84 })}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  alt=""
                  width={getImageDimensions(featured.coverImage)?.width}
                  height={getImageDimensions(featured.coverImage)?.height}
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            </section>
          ) : null}
        </div>

        <nav className="services-doors" aria-label={copy.doorsLabel}>
          {copy.doors.map((door, index) => (
            <div key={door.href} className="services-door">
              <Link href={door.href} className={`${index === 0 ? "site-action" : "site-text-button"} services-door__link`}>
                {door.label}
              </Link>
              <p className="services-door__line">{door.line}</p>
            </div>
          ))}
        </nav>

        <section className="services-index" aria-labelledby="services-index-title">
          <h2 id="services-index-title" className="site-section-title services-index__title">
            {copy.indexTitle}
          </h2>
          <ul className="services-index__list">
            {copy.disciplines.map((d) => (
              <li key={d.id} id={d.id} className="services-index__row">
                <h3 className="site-item-title services-index__name">{d.title}</h3>
                <div className="services-index__body">
                  <p className="services-index__line">{d.line}</p>
                  <details className="discipline__includes">
                    <summary className="discipline__summary">{copy.includesOpen}</summary>
                    <ul className="discipline__list">
                      {d.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
