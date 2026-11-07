import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute, useSearch } from "wouter";
import { PageShell } from "@/components/site/PageShell";
import { toSiteProject } from "@/components/site/siteProjects";
import { placeLabel, wallHrefFor } from "@/components/site/workFilters";
import { DISCIPLINE_ON_ALL, STAGES } from "@shared/projectFacets";
import { assetKey } from "@/components/site/wallLayout";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { trackEvent } from "@/hooks/use-analytics";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  buildProjectPageView,
  buildProjectSeoHead,
  fetchProject,
  frameImage,
  projectPlaceholder,
  PROJECT_PLACEHOLDER_IMAGE,
  projectMediaSequence,
  stripProgress,
  stripStop,
  toVimeoBackgroundUrl,
  type ProjectApi,
  type ProjectMediaMosaicItem,
} from "@/lib/projectPage";
import { consumePopNav } from "@/lib/navType";
import { PRIORITY_ATTRS, useInViewPlayback, useMotionPaused } from "@/components/site/media";
import { MotionToggle } from "@/components/site/MotionToggle";
import { trapTab } from "@/components/site/focusTrap";
import NotFound from "@/pages/not-found";
import type { ProjectListItem } from "@shared/projectList";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";

/**
 * The project page, Filmstrip (JP, 2026-11-06, chosen from five wireframes; brief:
 * .superpowers/sdd/2026-11-04-atla-site-v2/project-filmstrip-brief.md).
 * Desktop: a pinned column at the left (title, the one line, facets, year, proof, the first paragraph)
 * and the work as one horizontal strip at full height, every piece at its own ratio, the remaining
 * paragraphs as text frames between the images. A 2px line under the strip is the only chrome: no
 * digits, no arrows. Below 1024 the column stacks on top, the strip swipes at 70dvh, and the remaining
 * paragraphs read under it. A tile on the home links here with #at=<asset>; the strip opens on it.
 */

const { project: copy } = siteCopy;
/** Between facets on the project line; the dot stays with the word before it when the line wraps. */
const FACET_SEPARATOR = "  ·  ";
/** Sticky header height, so a phone landing leaves the strip clear of it. */
const HEADER = 64;
const DESKTOP = "(min-width: 1024px)";
/** A sideways scroller sits outside the browser's lazy-load margin: the first screen's frames load at once. */
const EAGER_FRAMES = 4;
/** Text frames sit after every third or fourth piece, spread as evenly as that allows. */
const TEXT_EVERY_MIN = 3;
const TEXT_EVERY_MAX = 4;

type MediaItem = ProjectMediaMosaicItem | { type: "image"; src: string; sourceIndex?: number };
export type FilmFrame = { kind: "media"; item: MediaItem } | { kind: "text"; text: string };

function ratioOf(item: MediaItem) {
  if (item.type !== "image") return 16 / 9;
  const dims = getImageDimensions(item.src);
  return dims && dims.width > 0 && dims.height > 0 ? dims.width / dims.height : 1.5;
}

/**
 * The strip's order: every piece in sequence, with the paragraphs after the first (which sits in the
 * column) placed after every third or fourth piece until they run out. A paragraph never gets lost:
 * any that find no slot close the strip. No paragraphs, pieces only.
 */
export function filmFrames(media: MediaItem[], paragraphs: string[]): FilmFrame[] {
  const frames: FilmFrame[] = [];
  const every =
    paragraphs.length > 0
      ? Math.min(TEXT_EVERY_MAX, Math.max(TEXT_EVERY_MIN, Math.ceil(media.length / (paragraphs.length + 1))))
      : 0;
  let next = 0;
  media.forEach((item, index) => {
    frames.push({ kind: "media", item });
    if (every > 0 && (index + 1) % every === 0 && next < paragraphs.length) frames.push({ kind: "text", text: paragraphs[next++] });
  });
  while (next < paragraphs.length) frames.push({ kind: "text", text: paragraphs[next++] });
  return frames;
}

/** The scrollLeft that puts a frame's left edge at the strip's left edge (after its padding). */
export function frameLeft(strip: HTMLElement, frame: HTMLElement) {
  const padding = Number.parseFloat(getComputedStyle(strip).paddingLeft) || 0;
  return strip.scrollLeft + frame.getBoundingClientRect().left - strip.getBoundingClientRect().left - padding;
}

function isDesktop() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(DESKTOP).matches;
}

function FrameImage({
  src,
  alt,
  index,
  priority,
  eager,
  onOpen,
}: {
  src: string;
  alt: string;
  index: number;
  priority: boolean;
  eager: boolean;
  onOpen: () => void;
}) {
  const dims = getImageDimensions(src);
  // The same src/srcset/sizes the prerendered head preloads for the first frame (lib/projectPage.ts).
  const image = frameImage(src);
  return (
    <button type="button" className="film-frame__button" data-image-index={index} onClick={onOpen} aria-label={`${alt}. Open larger`} style={{ "--r": image.ratio.toFixed(4) } as CSSProperties}>
      <img
        className="film-frame__item"
        src={image.src}
        srcSet={image.srcSet}
        sizes={image.sizes}
        alt={alt}
        width={dims?.width}
        height={dims?.height}
        loading={priority || eager ? "eager" : "lazy"}
        {...(priority ? PRIORITY_ATTRS : null)}
        decoding="async"
      />
    </button>
  );
}

/**
 * Frames fade in once as they enter the strip's own viewport (opacity only, 200ms, the site's ease).
 * Frames already in view at load never wait, so nothing on screen blinks; nothing waits at all under
 * reduced motion or without IntersectionObserver.
 */
function useFrameReveal(strip: RefObject<HTMLElement>, reduced: boolean, key: unknown) {
  useEffect(() => {
    const root = strip.current;
    if (!root || reduced || typeof IntersectionObserver === "undefined") return;
    const frames = Array.from(root.querySelectorAll<HTMLElement>(".film-frame"));
    const box = root.getBoundingClientRect();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement | undefined;
          if (!target || !entry.isIntersecting) continue;
          target.dataset.reveal = "in";
          observer.unobserve(target);
        }
      },
      { root, threshold: 0.01 },
    );
    for (const frame of frames) {
      const rect = frame.getBoundingClientRect();
      const inView = rect.right > box.left && rect.left < box.right;
      if (inView && box.width > 0) continue;
      frame.dataset.reveal = "wait";
      observer.observe(frame);
    }
    return () => {
      observer.disconnect();
      for (const frame of frames) delete frame.dataset.reveal;
    };
  }, [strip, reduced, key]);
}

/**
 * The strip's motion: a vertical wheel moves it sideways at the same magnitude (the browser does the
 * scrolling; no easing of ours), until it reaches an end, where the page takes the wheel back so the
 * logo band and footer stay reachable. The progress fill follows scrollLeft, written straight to the
 * DOM so scrolling never re-renders the page.
 */
function useStrip(strip: RefObject<HTMLElement>, fill: RefObject<HTMLElement>, key: unknown) {
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const value = stripProgress(el.scrollLeft, el.scrollWidth, el.clientWidth);
      if (fill.current) fill.current.style.transform = `scaleX(${value})`;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    const onWheel = (event: WheelEvent) => {
      if (!isDesktop() || event.ctrlKey) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? el.clientWidth : 1;
      const delta = event.deltaY * unit;
      const max = el.scrollWidth - el.clientWidth;
      if ((delta < 0 && el.scrollLeft <= 0) || (delta > 0 && el.scrollLeft >= max - 1)) return;
      event.preventDefault();
      // Proximity snapping pulls every wheel notch back to the frame it left (measured in Chrome,
      // 2026-11-06), so once a wheel drives the strip, snapping stays off; trackpads keep it.
      el.dataset.wheel = "on";
      el.scrollLeft += delta;
    };
    paint();
    el.addEventListener("scroll", schedule, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", schedule);
    // Images arriving widen the strip: the line re-measures as each one loads.
    el.addEventListener("load", schedule, true);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      el.removeEventListener("scroll", schedule);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", schedule);
      el.removeEventListener("load", schedule, true);
    };
  }, [strip, fill, key]);
}

/** Muted, looping and inline; plays while on screen. Under reduced motion it never starts on its own and shows controls. */
function ProjectVideo({ src, poster, title, reduced }: { src: string; poster?: string; title: string; reduced: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useInViewPlayback(ref, { enabled: !reduced });
  const paused = useMotionPaused();
  return (
    <video
      ref={ref}
      className="film-frame__item"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      controls={reduced || paused}
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
        sizes="(max-width: 767px) calc(100vw - 112px), calc(100vw - 160px)"
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

/** The URL fragment, live: wouter tracks the path only, and a tile links here with `#at=<asset>`. */
const HASH_EVENTS = ["hashchange", "popstate", "pushState", "replaceState"] as const;
function subscribeHash(onChange: () => void) {
  for (const name of HASH_EVENTS) window.addEventListener(name, onChange);
  return () => {
    for (const name of HASH_EVENTS) window.removeEventListener(name, onChange);
  };
}
const readHash = () => window.location.hash;
const serverHash = () => "";
function useLocationHash() {
  return useSyncExternalStore(subscribeHash, readHash, serverHash);
}

export default function Project() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug ?? "";
  const search = useSearch();
  const reduced = useReducedMotion();
  const motionPaused = useMotionPaused();
  const [open, setOpen] = useState<number | null>(null);
  const landedRef = useRef<string | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const { data: allProjects } = useQuery<ProjectListItem[]>({ queryKey: ["/api/projects"] });
  // A wall click paints at once from the list the wall already holds (title, facets, cover, images);
  // the body and description fill in when the project's own record arrives (fix pass A).
  const { data: projectData, isPending } = useQuery<ProjectApi | null>({
    queryKey: ["project", slug],
    queryFn: fetchProject(slug),
    placeholderData: () => projectPlaceholder(allProjects?.find((item) => item.slug === slug)),
  });

  const project = useMemo(
    () => (projectData ? buildProjectPageView(projectData, allProjects ?? []) : null),
    [allProjects, projectData],
  );
  // The facets (sector, disciplines, place, stage) come with the project.
  const site = useMemo(() => (projectData ? toSiteProject(projectData) : null), [projectData]);

  const cover = project && project.heroImage !== PROJECT_PLACEHOLDER_IMAGE ? project.heroImage : "";
  const media: MediaItem[] = useMemo(
    () => (project ? [...(cover ? [{ type: "image" as const, src: cover }] : []), ...projectMediaSequence(project)] : []),
    [cover, project],
  );
  const paragraphs = project?.bodySections;
  const [firstParagraph = "", ...restParagraphs] = paragraphs ?? [];
  const frames = useMemo(() => filmFrames(media, (paragraphs ?? []).slice(1)), [media, paragraphs]);
  const images = useMemo(() => media.filter((item) => item.type === "image").map((item) => item.src), [media]);
  const hasMotion = media.some((item) => item.type !== "image");

  useFrameReveal(stripRef, reduced, frames);
  useStrip(stripRef, fillRef, frames);

  // wouter does not reset scroll. A project reached by a push starts at the top of the page (on a
  // phone with #at=, the landing below scrolls the page to the strip instead); Back/Forward keeps
  // the browser's position.
  const hash = useLocationHash();
  const at = useMemo(
    () => new URLSearchParams(hash.replace(/^#/, "")).get("at") || new URLSearchParams(search).get("at") || "",
    [hash, search],
  );
  useEffect(() => {
    if (consumePopNav()) return;
    if (!at || isDesktop()) window.scrollTo(0, 0);
  }, [slug, at]);
  // The landing is a jump, not a glide (the visitor clicked this image a moment ago): the strip puts
  // that frame's left edge at its own left, and checks again once the frames before it have their width.
  useEffect(() => {
    if (!at || !project || landedRef.current === `${slug}:${at}`) return;
    const strip = stripRef.current;
    const target = strip?.querySelector<HTMLElement>(`[data-asset="${CSS.escape(at)}"]`);
    if (!strip || !target) return;
    landedRef.current = `${slug}:${at}`;
    const land = () => {
      const left = Math.max(0, frameLeft(strip, target));
      if (Math.abs(strip.scrollLeft - left) > 2) strip.scrollTo({ left, behavior: "auto" });
      if (!isDesktop()) {
        const top = Math.max(0, strip.getBoundingClientRect().top + window.scrollY - HEADER - 16);
        if (Math.abs(window.scrollY - top) > 8) window.scrollTo({ top, behavior: "auto" });
      }
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
  // Closing returns focus to the frame being viewed (it may differ from the one that opened the lightbox).
  const close = useCallback(() => {
    setOpen((current) => {
      if (current !== null) {
        requestAnimationFrame(() => {
          const button = document.querySelector<HTMLElement>(`.film-frame__button[data-image-index="${current}"]`);
          button?.scrollIntoView({ block: "nearest", inline: "center" });
          button?.focus({ preventScroll: true });
        });
      }
      return null;
    });
  }, []);

  // Left/Right step a frame, Home/End go to the ends, while the strip or a frame's image has focus.
  // A video's own controls keep their arrows.
  const onStripKey = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const strip = stripRef.current;
      if (!strip) return;
      const target = event.target as HTMLElement;
      if (target.closest("video, iframe")) return;
      const max = Math.max(0, strip.scrollWidth - strip.clientWidth);
      let left: number | null = null;
      if (event.key === "Home") left = 0;
      else if (event.key === "End") left = max;
      else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        const lefts = Array.from(strip.querySelectorAll<HTMLElement>(".film-frame")).map((frame) => frameLeft(strip, frame));
        left = stripStop(lefts, strip.scrollLeft, event.key === "ArrowRight" ? 1 : -1, max);
      }
      if (left === null) return;
      event.preventDefault();
      strip.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced],
  );

  if (!slug || (!project && isPending)) return <PageShell>{null}</PageShell>;
  if (!project) return <NotFound />;

  const seoHead = buildProjectSeoHead(project);
  const year = Number.parseInt(project.dateLabel, 10) > 0 ? project.dateLabel : "";
  const proofLine = copy.proof[project.slug] ?? "";
  // One quiet line of facets, each a link into the wall filtered to it (proposal 3.3). Brand Identity
  // is on every project and filters nothing, so it is plain text; Stage prints only when it says something.
  const facetLinks: Array<{ key: "sector" | "discipline" | "place"; value: string }> = site
    ? [
        ...(site.sector ? [{ key: "sector" as const, value: site.sector }] : []),
        ...site.disciplines.map((value) => ({ key: "discipline" as const, value })),
        ...(site.place ? [{ key: "place" as const, value: site.place }] : []),
      ]
    : [];
  const stage = site?.stage && site.stage !== STAGES[0] ? site.stage : "";
  const facetLabel = (facet: (typeof facetLinks)[number]) => (facet.key === "place" ? placeLabel(facet.value) : facet.value);
  // The lightbox holds the images in strip order; the cover is the first.
  let imageIndex = -1;

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

      <article className="film" data-media={frames.length > 0 ? "yes" : "none"}>
        <header className="film-head">
          <h1 className="film-head__title">{project.title}</h1>
          {project.intro ? <p className="film-head__lead">{project.intro}</p> : null}
          {facetLinks.length > 0 ? (
            <p className="film-head__facets" aria-label={copy.facetsLabel}>
              {facetLinks.map((facet, index) => (
                <span key={`${facet.key}:${facet.value}`}>
                  {index > 0 ? <span aria-hidden="true">{facetLinks[index - 1].key === facet.key ? ", " : FACET_SEPARATOR}</span> : null}
                  {facet.key === "discipline" && facet.value === DISCIPLINE_ON_ALL ? (
                    facet.value
                  ) : (
                    <Link href={wallHrefFor(facet.key, facet.value)} aria-label={`${facetLabel(facet)} work`}>
                      {facetLabel(facet)}
                    </Link>
                  )}
                </span>
              ))}
              {stage ? (
                <span>
                  <span aria-hidden="true">{FACET_SEPARATOR}</span>
                  {stage}
                </span>
              ) : null}
            </p>
          ) : null}
          {year ? <p className="film-head__facts">{year}</p> : null}
          {proofLine ? <p className="film-head__proof">{proofLine}</p> : null}
          {firstParagraph ? <p className="film-head__body">{firstParagraph}</p> : null}
          {hasMotion ? <MotionToggle className="motion-toggle--film" /> : null}
        </header>

        {frames.length > 0 ? (
          <div className="film-stage">
            <div
              ref={stripRef}
              className="film-strip"
              tabIndex={0}
              role="region"
              aria-roledescription="carousel"
              aria-label={project.title}
              onKeyDown={onStripKey}
            >
              {frames.map((frame, frameIndex) => {
                if (frame.kind === "text") {
                  return (
                    <div key={`t${frameIndex}`} className="film-frame film-frame--text" role="group" aria-label={`${project.title}, text`}>
                      <p className="film-frame__text">{frame.text}</p>
                    </div>
                  );
                }
                const { item } = frame;
                const key = `${item.type}-${frameIndex}`;
                if (item.type === "image") {
                  imageIndex += 1;
                  const index = imageIndex;
                  return (
                    <figure key={key} className="film-frame" role="group" aria-label={`${project.title}, image`} data-asset={assetKey(item.src)}>
                      <FrameImage
                        src={item.src}
                        alt={`${project.title}, image`}
                        index={index}
                        priority={index === 0}
                        eager={index < EAGER_FRAMES || assetKey(item.src) === at}
                        onOpen={() => setOpen(index)}
                      />
                    </figure>
                  );
                }
                if (item.type === "video") {
                  return (
                    <figure key={key} className="film-frame" role="group" aria-label={`${project.title}, video`} data-asset={assetKey(item.src)}>
                      <ProjectVideo src={item.src} poster={item.poster} title={item.title || `${project.title}, video`} reduced={reduced} />
                    </figure>
                  );
                }
                return (
                  <figure key={key} className="film-frame film-frame--embed" role="group" aria-label={`${project.title}, video`} style={{ "--r": ratioOf(item).toFixed(4) } as CSSProperties}>
                    <iframe
                      src={reduced || motionPaused ? item.src : toVimeoBackgroundUrl(item.src)}
                      title={item.title || `${project.title}, video`}
                      width={1280}
                      height={Math.round(1280 / ratioOf(item))}
                      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </figure>
                );
              })}
              {/* Room after the last frame, so the last piece can come to the middle. */}
              <div className="film-strip__tail" aria-hidden="true" />
            </div>
            <div className="film-progress" aria-hidden="true">
              <span ref={fillRef} className="film-progress__fill" />
            </div>
          </div>
        ) : null}

        {/* Below 1024 the strip carries the pieces only; the story reads top to bottom under it. */}
        {restParagraphs.length > 0 ? (
          <div className="film-rest">
            {restParagraphs.map((text, index) => (
              <p key={index} className="film-rest__text">
                {text}
              </p>
            ))}
          </div>
        ) : null}
      </article>

      {open !== null && images[open] ? (
        <Lightbox images={images} index={open} title={project.title} onClose={close} onStep={step} />
      ) : null}
    </PageShell>
  );
}
