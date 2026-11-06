import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute, useSearch } from "wouter";
import { PageShell } from "@/components/site/PageShell";
import { siteOrder, toSiteProject, useSiteProjects, type SiteProject } from "@/components/site/siteProjects";
import { assetKey } from "@/components/site/wallLayout";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { trackEvent } from "@/hooks/use-analytics";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  buildProjectPageView,
  buildProjectSeoHead,
  fetchProject,
  PROJECT_PLACEHOLDER_IMAGE,
  projectCredits,
  projectDateLabel,
  projectMediaSequence,
  toVimeoBackgroundUrl,
  type ProjectApi,
  type ProjectMediaMosaicItem,
} from "@/lib/projectPage";
import { consumePopNav } from "@/lib/navType";
import { PRIORITY_ATTRS, useInViewPlayback } from "@/components/site/media";
import { trapTab } from "@/components/site/focusTrap";
import NotFound from "@/pages/not-found";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";
import "@/styles/project.css";

/**
 * The project page, as drawn in JP's Figma (file U5QZmCKgSrT1W21pYYwTRe, Project 4423:5596, 2026-11-05):
 * a 1200×750 hero (the cover, or the first direct video) with the info panel over its right side;
 * the about section (The Brand / The Challenge / The Result and Credits on paper over a project image);
 * the media in the Figma rhythm (portraits in 600-wide pairs, landscapes 1200 wide, no gaps);
 * other works (the next project's cover as a strip, then the list). A tile on the home links here with
 * ?at=<asset>, and the page opens on that exact image. Click an image for the lightbox (arrows, Escape).
 */

const { project: copy } = siteCopy;
const FULL_WIDTHS = [640, 960, 1280, 1600, 2000, 2400];
const HALF_WIDTHS = [320, 480, 640, 800, 1000, 1200];
const FULL_SIZES = "(min-width: 1200px) 1200px, 100vw";
const HALF_SIZES = "(min-width: 1200px) 600px, (min-width: 768px) 50vw, 100vw";
/** Below this width / height, a piece is a portrait and pairs with its neighbour. */
const PORTRAIT_BELOW = 1.15;
/** Figma caps: a pair cell is 600 wide and at most 800 tall; a single is 1200 wide and at most 750 tall. */
const PAIR_W = 600;
const PAIR_MAX_H = 800;
const FULL_W = 1200;
const FULL_MAX_H = 750;
const OTHER_WORKS = 11;

type MediaItem = ProjectMediaMosaicItem | { type: "image"; src: string; sourceIndex?: number };
type Group = { kind: "full"; items: MediaItem[] } | { kind: "pair"; items: MediaItem[] };

function ratioOf(item: MediaItem) {
  if (item.type !== "image") return 16 / 9;
  const dims = getImageDimensions(item.src);
  return dims && dims.width > 0 && dims.height > 0 ? dims.width / dims.height : 1.5;
}

/** Landscapes alone; consecutive portraits in pairs; a portrait left alone runs full. */
export function groupMedia(items: MediaItem[]): Group[] {
  const groups: Group[] = [];
  let pending: MediaItem[] = [];
  const flush = () => {
    while (pending.length >= 2) groups.push({ kind: "pair", items: pending.splice(0, 2) });
    if (pending.length === 1) groups.push({ kind: "full", items: pending.splice(0, 1) });
  };
  for (const item of items) {
    if (item.type === "image" && ratioOf(item) < PORTRAIT_BELOW) pending.push(item);
    else {
      flush();
      groups.push({ kind: "full", items: [item] });
    }
  }
  flush();
  return groups;
}

/** The block's aspect ratio: height by the image's ratio, capped as in the Figma. Both cells of a pair share it. */
export function groupAspect(group: Group) {
  if (group.kind === "pair") {
    const height = Math.min(PAIR_MAX_H, ...group.items.map((item) => PAIR_W / ratioOf(item)));
    return `${PAIR_W} / ${Math.round(Math.max(height, PAIR_W / 2))}`;
  }
  const height = Math.min(FULL_MAX_H, FULL_W / ratioOf(group.items[0]));
  return `${FULL_W} / ${Math.round(height)}`;
}

function ProjectImage({
  src,
  alt,
  half,
  priority,
  onOpen,
}: {
  src: string;
  alt: string;
  half: boolean;
  priority: boolean;
  onOpen: () => void;
}) {
  const dims = getImageDimensions(src);
  return (
    <button type="button" className="pj-media__button" onClick={onOpen} aria-label={`${alt}. Open larger`}>
      <img
        className="pj-media__item"
        src={getOptimizedImageUrl(src, { width: half ? 1200 : 2000, quality: 88 }) || src}
        srcSet={buildImageSrcSet(src, half ? HALF_WIDTHS : FULL_WIDTHS, { quality: 88 })}
        sizes={half ? HALF_SIZES : FULL_SIZES}
        alt={alt}
        width={dims?.width}
        height={dims?.height}
        loading={priority ? "eager" : "lazy"}
        {...(priority ? PRIORITY_ATTRS : null)}
        decoding="async"
      />
    </button>
  );
}

/** Muted, looping and inline; plays while on screen. Under reduced motion it never starts on its own and shows controls. */
function ProjectVideo({ src, poster, title, reduced }: { src: string; poster?: string; title: string; reduced: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useInViewPlayback(ref, { enabled: !reduced });
  return (
    <video
      ref={ref}
      className="pj-media__item"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      controls={reduced}
      preload="metadata"
      disablePictureInPicture
      aria-label={title}
    />
  );
}

function Lightbox({
  images,
  index,
  title,
  onClose,
  onStep,
}: {
  images: string[];
  index: number;
  title: string;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // Focus goes back to the image button that opened the lightbox, however it closes (Escape, Close, backdrop).
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    return () => {
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onStep(1);
      if (event.key === "ArrowLeft") onStep(-1);
      if (event.key === "Tab") trapTab(event, dialogRef.current);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, onStep]);
  const src = images[index];
  const dims = getImageDimensions(src);
  return (
    <div
      ref={dialogRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${title}, image ${index + 1} of ${images.length}`}
    >
      {/* The backdrop closes on click; it stays out of the Tab order (Close is the keyboard way out). */}
      <button type="button" className="lightbox__backdrop" aria-label={copy.lightboxClose} tabIndex={-1} onClick={onClose} />
      <img
        key={src}
        className="lightbox__image"
        src={getOptimizedImageUrl(src, { width: 2000, quality: 90 }) || src}
        srcSet={buildImageSrcSet(src, [1280, 1600, 2000, 2400], { quality: 90 })}
        sizes="92vw"
        alt={title}
        width={dims?.width}
        height={dims?.height}
      />
      <button ref={closeRef} type="button" className="lightbox__control lightbox__control--close" onClick={onClose}>
        {copy.lightboxClose}
      </button>
      {images.length > 1 ? (
        <>
          <button type="button" className="lightbox__control lightbox__control--prev" onClick={() => onStep(-1)} aria-label={copy.lightboxPrev}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none">
              <path d="M11.5 3.5 6 9l5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="lightbox__control lightbox__control--next" onClick={() => onStep(1)} aria-label={copy.lightboxNext}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none">
              <path d="m6.5 3.5 5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      ) : null}
    </div>
  );
}

/** The projects after `slug` in the home's order, wrapping, without `slug` itself. */
export function otherWorks(projects: SiteProject[], slug: string, limit = OTHER_WORKS) {
  const ordered = siteOrder(projects);
  const at = ordered.findIndex((project) => project.slug === slug);
  const rotated = at < 0 ? ordered : [...ordered.slice(at + 1), ...ordered.slice(0, at)];
  return rotated.filter((project) => project.slug !== slug).slice(0, limit);
}

export default function Project() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug ?? "";
  const search = useSearch();
  const reduced = useReducedMotion();
  const { projects } = useSiteProjects();
  const [open, setOpen] = useState<number | null>(null);
  const landedRef = useRef<string | null>(null);

  const { data: projectData, isPending } = useQuery<ProjectApi | null>({
    queryKey: ["project", slug],
    queryFn: fetchProject(slug),
  });
  const { data: allProjects } = useQuery<ProjectApi[]>({ queryKey: ["/api/projects"] });

  const project = useMemo(
    () => (projectData ? buildProjectPageView(projectData, allProjects ?? []) : null),
    [allProjects, projectData],
  );
  const others = useMemo(() => otherWorks(projects, slug), [projects, slug]);
  const next = others[0] ?? null;

  // The hero is the cover; with no cover, the first direct video (it then leaves the media below).
  const { hero, media } = useMemo(() => {
    if (!project) return { hero: null, media: [] as MediaItem[] };
    const sequence: MediaItem[] = projectMediaSequence(project);
    if (project.heroImage !== PROJECT_PLACEHOLDER_IMAGE) {
      return { hero: { type: "image" as const, src: project.heroImage } as MediaItem, media: sequence };
    }
    const video = sequence.find((item) => item.type === "video");
    return video ? { hero: video, media: sequence.filter((item) => item !== video) } : { hero: null, media: sequence };
  }, [project]);
  const groups = useMemo(() => groupMedia(media), [media]);
  const images = useMemo(
    () => [hero, ...media].filter((item): item is MediaItem => item?.type === "image").map((item) => item.src),
    [hero, media],
  );

  // wouter does not reset scroll. A project reached by a push starts at its top (or at the
  // image the visitor clicked on the wall); Back/Forward keeps the browser's position.
  const at = useMemo(() => new URLSearchParams(search).get("at") ?? "", [search]);
  useEffect(() => {
    if (consumePopNav()) return;
    if (!at) window.scrollTo(0, 0);
  }, [slug, at]);
  // The landing is a jump, not a glide (the visitor clicked this image a moment ago), and it is
  // checked again once the images above have their height, in case the first jump was early.
  useEffect(() => {
    if (!at || !project || landedRef.current === `${slug}:${at}`) return;
    const target = document.querySelector<HTMLElement>(`[data-asset="${CSS.escape(at)}"]`);
    if (!target) return;
    landedRef.current = `${slug}:${at}`;
    const land = () => {
      const header = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 50;
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - header);
      if (Math.abs(window.scrollY - top) > 8) window.scrollTo({ top, behavior: "auto" });
    };
    land();
    const timers = [250, 900].map((ms) => window.setTimeout(land, ms));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [at, project, slug]);

  useEffect(() => {
    if (!project) return;
    trackEvent("portfolio_project_view", { page: `/projects/${project.slug}`, project_name: project.title });
  }, [project]);

  const step = useCallback(
    (delta: number) => setOpen((current) => (current === null ? null : (current + delta + images.length) % images.length)),
    [images.length],
  );
  const close = useCallback(() => setOpen(null), []);

  if (!slug || (!project && isPending)) return <PageShell>{null}</PageShell>;
  if (!project) return <NotFound />;

  const seoHead = buildProjectSeoHead(project);
  const services = (projectData && toSiteProject(projectData)?.services) || [];
  const place = project.locationName || project.country;
  const date = projectDateLabel(project.dateLabel);
  const [brand, challenge, ...rest] = project.bodySections;
  const story = [
    { label: copy.brandLabel, text: brand },
    { label: copy.challengeLabel, text: challenge },
    { label: copy.resultLabel, text: rest.join("\n") },
  ].filter((block) => Boolean(block.text?.trim()));
  const apiCredits = projectCredits(projectData);
  const credits = apiCredits.length > 0 ? apiCredits : [copy.fallbackCredit];
  const aboutImage = [project.storyImage, project.heroImage].find((src) => src && src !== PROJECT_PLACEHOLDER_IMAGE);
  let imageIndex = hero?.type === "image" ? 0 : -1;

  const renderItem = (item: MediaItem, key: string, half: boolean) => {
    if (item.type === "image") {
      imageIndex += 1;
      const index = imageIndex;
      return (
        <figure key={key} className="pj-media__cell" data-asset={assetKey(item.src)}>
          <ProjectImage src={item.src} alt={`${project.title}, image ${index + 1}`} half={half} priority={false} onOpen={() => setOpen(index)} />
        </figure>
      );
    }
    if (item.type === "video") {
      return (
        <figure key={key} className="pj-media__cell" data-asset={assetKey(item.src)}>
          <ProjectVideo src={item.src} poster={item.poster} title={item.title || `${project.title}, video`} reduced={reduced} />
        </figure>
      );
    }
    return (
      <figure key={key} className="pj-media__cell pj-media__embed">
        <iframe
          src={reduced ? item.src : toVimeoBackgroundUrl(item.src)}
          title={item.title || `${project.title}, video`}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </figure>
    );
  };

  return (
    <PageShell>
      <SeoHead
        title={seoHead.title}
        description={seoHead.description}
        pathname={seoHead.pathname}
        image={seoHead.image}
        preloadImages={seoHead.preloadImages}
        structuredData={seoHead.structuredData}
      />

      <article className="pj">
        <header className="pj-hero">
          <div className="pj-hero__media">
            {hero?.type === "image" ? (
              <figure className="pj-media__cell" data-asset={assetKey(hero.src)}>
                <ProjectImage src={hero.src} alt={`${project.title}, image 1`} half={false} priority onOpen={() => setOpen(0)} />
              </figure>
            ) : hero?.type === "video" ? (
              <figure className="pj-media__cell" data-asset={assetKey(hero.src)}>
                <ProjectVideo src={hero.src} poster={hero.poster} title={hero.title || `${project.title}, video`} reduced={reduced} />
              </figure>
            ) : null}
          </div>
          <div className="pj-hero__info">
            <div className="pj-hero__inner">
              <h1 className="pj-hero__title">{project.title}</h1>
              <div className="pj-hero__meta">
                <div className="pj-hero__row">
                  <div className="pj-hero__col">
                    {project.client ? (
                      <>
                        <p className="pj-label">{copy.clientsLabel}</p>
                        <p className="pj-hero__value">{project.client}</p>
                      </>
                    ) : null}
                  </div>
                  <div className="pj-hero__col">
                    {services.length > 0 ? (
                      <>
                        <p className="pj-label">{copy.serviceLabel}</p>
                        <ul className="pj-hero__services">
                          {services.map((service) => (
                            <li key={service}>{service}</li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="pj-hero__row pj-hero__row--end">
                  <p className="pj-hero__intro">{project.intro}</p>
                  <p className="pj-hero__col pj-hero__when">
                    {place ? <span className="pj-hero__place">{place}</span> : null}
                    {date ? <span className="pj-hero__date">{date}</span> : null}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="pj-about" aria-label={`${project.title}, about`} data-photo={aboutImage ? "" : undefined}>
          {aboutImage ? (
            <img
              className="pj-about__photo"
              src={getOptimizedImageUrl(aboutImage, { width: 2000, quality: 85 }) || aboutImage}
              srcSet={buildImageSrcSet(aboutImage, FULL_WIDTHS, { quality: 85 })}
              sizes={FULL_SIZES}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <div className="pj-about__panel">
            <div className="pj-about__story">
              {story.map((block) => (
                <div key={block.label} className="pj-about__block">
                  <h2 className="pj-label pj-label--ink">{block.label}</h2>
                  <p className="pj-about__text">{block.text}</p>
                </div>
              ))}
            </div>
            <div className="pj-about__credits">
              <h2 className="pj-label pj-label--ink">{copy.creditsLabel}</h2>
              <dl className="pj-credits">
                {credits.map((credit) => (
                  <div key={credit.role} className="pj-credits__row">
                    <dt className="pj-credits__role">{credit.role}</dt>
                    <dd className="pj-credits__names">
                      {credit.names.map((name) => (
                        <span key={name}>{name}</span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {groups.length > 0 ? (
          <div className="pj-media">
            {groups.map((group, groupIndex) => (
              <div
                key={`g${groupIndex}`}
                className="pj-media__group"
                data-kind={group.kind}
                style={{ "--pj-ar": groupAspect(group) } as CSSProperties}
              >
                {group.items.map((item, i) => renderItem(item, `${item.type}-${groupIndex}-${i}`, group.kind === "pair"))}
              </div>
            ))}
          </div>
        ) : null}

        {others.length > 0 ? (
          <section className="pj-others" aria-labelledby="project-others-label">
            {next ? (
              <Link href={`/projects/${next.slug}`} className="pj-others__strip" tabIndex={-1} aria-hidden="true">
                <img
                  src={getOptimizedImageUrl(next.coverImage, { width: 1200, quality: 85 }) || next.coverImage}
                  srcSet={buildImageSrcSet(next.coverImage, [600, 900, 1200], { quality: 85 })}
                  sizes="(min-width: 1200px) 590px, 50vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            ) : null}
            <div className="pj-others__list">
              <h2 id="project-others-label" className="pj-label pj-label--ink">
                {copy.otherWorksLabel}
              </h2>
              <ul className="pj-others__rows">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link href={`/projects/${other.slug}`} className="pj-others__row">
                      <span>{other.title}</span>
                      <span>{projectDateLabel(other.year)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/brief?seed=${encodeURIComponent(copy.seed(project.title))}`} className="pj-others__cta">
                {copy.ctaLabel}
              </Link>
            </div>
          </section>
        ) : null}
      </article>

      {open !== null && images[open] ? (
        <Lightbox images={images} index={open} title={project.title} onClose={close} onStep={step} />
      ) : null}
    </PageShell>
  );
}
