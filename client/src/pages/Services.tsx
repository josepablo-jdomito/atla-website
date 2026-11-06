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
 * Services after tbp.studio/services (JP, 2026-11-05 and 2026-11-06). Act one: "Where are you?",
 * the four moments as large choices (a radiogroup; the choice lives in `?moment=`). Act two: the
 * disciplines as rows with an Includes list and a real project cover that follows the row in view,
 * each row read through the chosen moment; the ones that do not apply drop to a quiet "Also, when
 * you need it" group instead of vanishing. Act three: the engagements, with one line for the moment.
 */

const copy = siteCopy.services;
const structuredData = buildServicesStructuredData();
const COVER_WIDTHS = [480, 720, 960, 1280];

export type MomentId = (typeof copy.moments)[number]["id"];
type Discipline = (typeof copy.disciplines)[number];
const MOMENT_IDS = copy.moments.map((m) => m.id) as readonly MomentId[];

/** The moment named in a search string, or "" (any moment) when it names none we know. */
export function momentFromSearch(search: string): MomentId | "" {
  const value = new URLSearchParams(search).get("moment") ?? "";
  return (MOMENT_IDS as readonly string[]).includes(value) ? (value as MomentId) : "";
}

/** The disciplines that matter for a moment, in page order, and the rest ("Also, when you need it"). */
export function groupDisciplines(moment: MomentId | "") {
  if (!moment) return { relevant: [...copy.disciplines] as Discipline[], also: [] as Discipline[] };
  const applies = (d: Discipline) => (d.moments as readonly string[]).includes(moment);
  return { relevant: copy.disciplines.filter(applies), also: copy.disciplines.filter((d) => !applies(d)) };
}

// The picker's options in tab and arrow order. "Any moment" is not one of them: it is the reset
// beside the act-two heading, and the state with no radio checked.
const OPTIONS: { id: MomentId; title: string; line: string }[] = copy.moments.map((m) => ({
  id: m.id,
  title: m.title,
  line: m.line,
}));

export default function Services() {
  const { projects } = useSiteProjects();
  const search = useSearch();
  const moment = momentFromSearch(search);
  // The lines fade only after the visitor changes the moment, never on arrival.
  const [changed, setChanged] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [active, setActive] = useState<string>(copy.disciplines[0].id);
  const rowRefs = useRef(new Map<string, HTMLElement>());
  const optionRefs = useRef(new Map<string, HTMLButtonElement>());

  const { relevant, also } = useMemo(() => groupDisciplines(moment), [moment]);
  const rows = useMemo(() => [...relevant, ...also], [relevant, also]);
  const bySlug = useMemo(() => new Map(projects.map((project) => [project.slug, project])), [projects]);
  const current = rows.find((row) => row.id === active) ?? rows[0];
  const example = current ? bySlug.get(current.project) : undefined;

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

  const fade = changed ? "services-fade" : undefined;

  const renderRow = (row: Discipline, group: "relevant" | "also") => (
    <section
      key={row.id}
      id={row.id}
      data-discipline={row.id}
      data-group={group}
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
      <p key={`${row.id}-${moment}`} className={["discipline__line", fade].filter(Boolean).join(" ")}>
        {moment && group === "relevant" ? row.byMoment[moment] : row.line}
      </p>
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
          <h1 id="services-title" className="page-intro__title">
            {copy.title}
          </h1>
          <p className="page-intro__lead">{copy.lead}</p>
        </header>

        <div
          className="moment-picker"
          role="radiogroup"
          aria-labelledby="services-title"
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
        <p className="services-live" aria-live="polite">
          {announcement}
        </p>

        <div className="services-what">
          <h2 key={moment || "any"} className={["services-what__title", fade].filter(Boolean).join(" ")}>
            {moment ? copy.disciplinesTitleByMoment[moment] : copy.disciplinesTitle}
          </h2>
          {moment ? (
            <button type="button" className="services-what__reset" onClick={() => choose("")}>
              {copy.allMoments}
            </button>
          ) : null}
        </div>
        <div className="services-grid" data-moment={moment || "any"}>
          <div className="services-rows">
            {relevant.map((row) => renderRow(row, "relevant"))}
            {also.length > 0 ? <p className="services-also">{copy.alsoLabel}</p> : null}
            {also.map((row) => renderRow(row, "also"))}
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
          <p key={moment || "any"} className={["engagements__lead", moment ? "engagements__lead--moment" : "", fade].filter(Boolean).join(" ")}>
            {moment ? copy.engagementsByMoment[moment] : copy.engagementsLead}
          </p>
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
