import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
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
  FILM_FILL_WIDTH,
  FILM_HEADER,
  FILM_QUALITY,
  FILM_WIDTHS,
  filmFrameScrollY,
  filmImageSizes,
  filmPosition,
  filmStep,
  planFilmText,
  PROJECT_PLACEHOLDER_IMAGE,
  projectMediaSequence,
  toVimeoBackgroundUrl,
  type ProjectApi,
  type ProjectMediaMosaicItem,
} from "@/lib/projectPage";
import { consumePopNav } from "@/lib/navType";
import { PRIORITY_ATTRS, useInViewPlayback, useMotionPaused } from "@/components/site/media";
import { MotionToggle } from "@/components/site/MotionToggle";
import { trapTab } from "@/components/site/focusTrap";
import NotFound from "@/pages/not-found";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";

/**
 * The project page, Scroll film (JP, 2026-11-06, "creo que mejor 5. Scroll film"; brief:
 * .superpowers/sdd/2026-11-04-atla-site-v2/project-scrollfilm-brief.md). Every piece fills the screen
 * under the header, edge to edge, and the next slides over it as the page scrolls: native sticky
 * stacking, no scroll-jacking, no library. A dark bar pinned at the bottom carries the title and the
 * story one line per frame, with a 2px line under it for progress. No digits, no arrows, no Next.
 * A tile on the home links here with ?at=<asset>; the page lands on that frame.
 */

const { project: copy } = siteCopy;
/** Between facets on the project line; the dot stays with the word before it when the line wraps. */
const FACET_SEPARATOR = "  ·  ";

type MediaItem = ProjectMediaMosaicItem | { type: "image"; src: string; sourceIndex?: number; caption?: string };
export type FilmFrame = { kind: "media"; item: MediaItem; caption: string } | { kind: "text"; paragraphs: string[]; caption: "" };

/** Every piece in order with its caption, then whatever story found no piece, as text frames. */
export function buildFilm(media: MediaItem[], intro: string, paragraphs: string[]): FilmFrame[] {
  const plan = planFilmText(
    media.map((item) => ("caption" in item ? item.caption : undefined)),
    intro,
    paragraphs,
  );
  return [
    ...media.map((item, index) => ({ kind: "media" as const, item, caption: plan.captions[index] })),
    ...plan.textFrames.map((group) => ({ kind: "text" as const, paragraphs: group, caption: "" as const })),
  ];
}

function ratioOf(src: string) {
  const dims = getImageDimensions(src);
  return dims && dims.width > 0 && dims.height > 0 ? dims.width / dims.height : 1.5;
}

/**
 * One image frame. A landscape covers the frame (centred, or on the Sanity hotspot when there is one);
 * a portrait, and a landscape on an upright phone, sits whole at full height over a blurred, darkened
 * copy of itself (CSS picks which by the frame's shape). The whole frame opens the lightbox.
 */
function FrameImage({
  src,
  alt,
  focal,
  loading,
  priority,
  onOpen,
}: {
  src: string;
  alt: string;
  focal?: { x: number; y: number } | null;
  loading: "eager" | "lazy";
  priority: boolean;
  onOpen: () => void;
}) {
  const dims = getImageDimensions(src);
  const ratio = ratioOf(src);
  const position = focal && Number.isFinite(focal.x) && Number.isFinite(focal.y) ? `${(focal.x * 100).toFixed(1)}% ${(focal.y * 100).toFixed(1)}%` : undefined;
  return (
    <button
      type="button"
      className="reel-frame__button"
      data-shape={ratio >= 1 ? "landscape" : "portrait"}
      onClick={onOpen}
      aria-label={`${alt}. Open larger`}
    >
      <img
        className="reel-frame__fill"
        src={getOptimizedImageUrl(src, { width: FILM_FILL_WIDTH, quality: 50 }) || src}
        alt=""
        aria-hidden="true"
        loading={loading}
        decoding="async"
      />
      <img
        className="reel-frame__image"
        src={getOptimizedImageUrl(src, { width: FILM_WIDTHS[3], quality: FILM_QUALITY }) || src}
        srcSet={buildImageSrcSet(src, FILM_WIDTHS, { quality: FILM_QUALITY })}
        sizes={filmImageSizes(ratio)}
        alt={alt}
        width={dims?.width}
        height={dims?.height}
        loading={loading}
        {...(priority ? PRIORITY_ATTRS : null)}
        decoding="async"
        style={position ? ({ "--focal": position } as CSSProperties) : undefined}
      />
    </button>
  );
}

/**
 * Muted, looping and inline; plays only while it is the frame on screen or next to it (a covered
 * sticky frame still counts as in view to the browser). Poster until then. Under reduced motion it
 * never starts on its own and shows controls.
 */
function ProjectVideo({ src, poster, title, reduced, near }: { src: string; poster?: string; title: string; reduced: boolean; near: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useInViewPlayback(ref, { enabled: !reduced && near, preloadOnEnter: true });
  const paused = useMotionPaused();
  return (
    <video
      ref={ref}
      className="reel-frame__video"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      controls={reduced || paused}
      preload="none"
      disablePictureInPicture
      aria-label={title}
    />
  );
}

/**
 * The caption line. When it changes, the old line fades out under the new one fading in (opacity
 * only, 200ms); under reduced motion it swaps at once. Only the current line is in the live region.
 */
function CaptionLine({ text, reduced }: { text: string; reduced: boolean }) {
  const [state, setState] = useState({ current: text, previous: null as string | null, turn: 0 });
  useEffect(() => {
    setState((s) => (s.current === text ? s : { current: text, previous: reduced ? null : s.current, turn: s.turn + 1 }));
  }, [text, reduced]);
  return (
    <div className="reel-bar__caption">
      {state.previous ? (
        <span
          key={`out-${state.turn}`}
          className="reel-bar__line reel-bar__line--out"
          aria-hidden="true"
          onAnimationEnd={() => setState((s) => ({ ...s, previous: null }))}
        >
          {state.previous}
        </span>
      ) : null}
      <p className="reel-bar__live" aria-live="polite">
        <span key={`in-${state.turn}`} className={`reel-bar__line${state.turn > 0 && !reduced ? " reel-bar__line--in" : ""}`}>
          {state.current}
        </span>
      </p>
    </div>
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

export default function Project() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug ?? "";
  const search = useSearch();
  const reduced = useReducedMotion();
  const motionPaused = useMotionPaused();
  const [open, setOpen] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const landedRef = useRef<string | null>(null);
  const framesRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const { data: projectData, isPending } = useQuery<ProjectApi | null>({
    queryKey: ["project", slug],
    queryFn: fetchProject(slug),
  });
  const { data: allProjects } = useQuery<ProjectApi[]>({ queryKey: ["/api/projects"] });

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
  const frames = useMemo(
    () => (project ? buildFilm(media, project.intro, project.bodySections) : []),
    [media, project],
  );
  const images = useMemo(() => media.filter((item) => item.type === "image").map((item) => item.src), [media]);
  const hasMotion = media.some((item) => item.type !== "image");
  const at = useMemo(() => new URLSearchParams(search).get("at") ?? "", [search]);
  // Until the page has measured itself, the frame the visitor came for is the one treated as active.
  const atIndex = useMemo(() => (at ? frames.findIndex((f) => f.kind === "media" && assetKey(f.item.src) === at) : -1), [at, frames]);

  /** How far the page has scrolled into the frames, and one frame's height. */
  const measure = useCallback(() => {
    const root = framesRef.current;
    const first = root?.querySelector<HTMLElement>(".reel-frame");
    if (!root || !first) return null;
    return { offset: FILM_HEADER - root.getBoundingClientRect().top, height: first.offsetHeight, top: root.getBoundingClientRect().top + window.scrollY };
  }, []);

  // The bar follows the page's own scroll: the active frame (a re-render only when it changes) and the
  // progress fill, written straight to the DOM once per animation frame.
  useEffect(() => {
    if (frames.length === 0) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const m = measure();
      if (!m) return;
      const position = filmPosition(m.offset, m.height, frames.length);
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${position.progress})`;
      setActive(position.active);
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [frames, measure]);

  // Whole pieces sit clear of the bar: its height, measured, is a CSS variable on the film.
  useEffect(() => {
    const bar = barRef.current;
    const film = bar?.closest<HTMLElement>(".reel");
    if (!bar || !film) return;
    const write = () => film.style.setProperty("--reel-bar-h", `${bar.offsetHeight}px`);
    write();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(write);
    observer.observe(bar);
    return () => observer.disconnect();
  }, [project]);

  // wouter does not reset scroll. A project reached by a push starts at the top (or, with ?at=, on
  // the frame below); Back/Forward keeps the browser's position.
  useEffect(() => {
    if (consumePopNav()) return;
    if (!at) window.scrollTo(0, 0);
  }, [slug, at]);
  // The landing is a jump, not a glide (the visitor clicked this image a moment ago), checked again
  // once fonts and the header have settled.
  useEffect(() => {
    if (!at || !project || atIndex < 0 || landedRef.current === `${slug}:${at}`) return;
    landedRef.current = `${slug}:${at}`;
    setActive(atIndex);
    const land = () => {
      const m = measure();
      if (!m) return;
      const top = filmFrameScrollY(m.top, atIndex, m.height);
      if (Math.abs(window.scrollY - top) > 2) window.scrollTo({ top, behavior: "auto" });
    };
    land();
    const timers = [250, 900].map((ms) => window.setTimeout(land, ms));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [at, atIndex, measure, project, slug]);

  useEffect(() => {
    if (!project) return;
    trackEvent("portfolio_project_view", { page: `/projects/${project.slug}`, project_name: project.title });
  }, [project]);

  const step = useCallback(
    (delta: number) => setOpen((current) => (current === null ? null : (current + delta + images.length) % images.length)),
    [images.length],
  );
  const close = useCallback(() => setOpen(null), []);

  // Down/Up and PageDown/PageUp move one frame, Home/End go to the first and last, while the frames
  // or a frame's image have focus. A video's own controls keep their keys.
  const onFramesKey = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest("video, iframe, a")) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const m = measure();
      if (!m) return;
      const count = frames.length;
      let index: number | null = null;
      if (event.key === "ArrowDown" || event.key === "PageDown") index = filmStep(m.offset, m.height, count, 1);
      else if (event.key === "ArrowUp" || event.key === "PageUp") index = filmStep(m.offset, m.height, count, -1);
      else if (event.key === "Home") index = 0;
      else if (event.key === "End") index = count - 1;
      if (index === null) return;
      event.preventDefault();
      window.scrollTo({ top: filmFrameScrollY(m.top, index, m.height), behavior: reduced ? "auto" : "smooth" });
    },
    [frames.length, measure, reduced],
  );

  if (!slug || (!project && isPending)) return <PageShell>{null}</PageShell>;
  if (!project) return <NotFound />;

  const seoHead = buildProjectSeoHead(project);
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
  const focal = projectData?.coverFocal ?? null;
  const current = frames[Math.min(active, frames.length - 1)];
  // Only the frame on screen and its two neighbours load at once; the rest wait for the scroll.
  const nearest = landedRef.current === null && atIndex >= 0 ? atIndex : active;
  const isNear = (index: number) => Math.abs(index - nearest) <= 1;

  const meta =
    facetLinks.length > 0 || proofLine || hasMotion ? (
      <div className="reel-meta">
        {facetLinks.length > 0 ? (
          <p className="reel-meta__facets" aria-label={copy.facetsLabel}>
            {facetLinks.map((facet, index) => (
              <span key={`${facet.key}:${facet.value}`}>
                {index > 0 ? <span aria-hidden="true">{facetLinks[index - 1].key === facet.key ? ", " : FACET_SEPARATOR}</span> : null}
                {facet.key === "discipline" && facet.value === DISCIPLINE_ON_ALL ? (
                  facet.value
                ) : (
                  <Link href={wallHrefFor(facet.key, facet.value)}>{facetLabel(facet)}</Link>
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
        {proofLine ? <p className="reel-meta__proof">{proofLine}</p> : null}
        {hasMotion ? <MotionToggle className="motion-toggle--reel" /> : null}
      </div>
    ) : null;

  // The lightbox holds the images in film order; the cover is the first.
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

      <article className="reel" data-media={media.length > 0 ? "yes" : "none"}>
        {/* First in the document for reading order; pinned to the bottom of the screen by CSS. */}
        <div className="reel-bar-slot">
          <div ref={barRef} className="reel-bar">
            <div className="reel-bar__band">
              <h1 className="reel-bar__title">{project.title}</h1>
              <CaptionLine text={current?.caption ?? ""} reduced={reduced} />
            </div>
            <div className="reel-progress" aria-hidden="true">
              <span ref={fillRef} className="reel-progress__fill" />
            </div>
          </div>
        </div>

        {frames.length > 0 ? (
          <div
            ref={framesRef}
            className="reel-frames"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label={project.title}
            onKeyDown={onFramesKey}
          >
            {frames.map((frame, frameIndex) => {
              const first = frameIndex === 0 ? meta : null;
              if (frame.kind === "text") {
                return (
                  <div key={`t${frameIndex}`} className="reel-frame reel-frame--text" role="group" aria-label={`${project.title}, text`}>
                    <div className="reel-frame__text">
                      {frame.paragraphs.map((text, index) => (
                        <p key={index}>{text}</p>
                      ))}
                    </div>
                    {first}
                  </div>
                );
              }
              const { item } = frame;
              const key = `${item.type}-${frameIndex}`;
              if (item.type === "image") {
                imageIndex += 1;
                const index = imageIndex;
                return (
                  <figure key={key} className="reel-frame" role="group" aria-label={`${project.title}, image`} data-asset={assetKey(item.src)}>
                    <FrameImage
                      src={item.src}
                      alt={`${project.title}, image`}
                      focal={item.src === cover ? focal : null}
                      loading={isNear(frameIndex) ? "eager" : "lazy"}
                      priority={frameIndex === nearest}
                      onOpen={() => setOpen(index)}
                    />
                    {first}
                  </figure>
                );
              }
              if (item.type === "video") {
                return (
                  <figure key={key} className="reel-frame reel-frame--video" role="group" aria-label={`${project.title}, video`} data-asset={assetKey(item.src)}>
                    <ProjectVideo
                      src={item.src}
                      poster={item.poster}
                      title={item.title || `${project.title}, video`}
                      reduced={reduced}
                      near={isNear(frameIndex)}
                    />
                    {first}
                  </figure>
                );
              }
              return (
                <figure key={key} className="reel-frame reel-frame--embed" role="group" aria-label={`${project.title}, video`}>
                  <div className="reel-frame__embed">
                    <iframe
                      src={reduced || motionPaused ? item.src : toVimeoBackgroundUrl(item.src)}
                      title={item.title || `${project.title}, video`}
                      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                      allowFullScreen
                      loading={isNear(frameIndex) ? "eager" : "lazy"}
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                  {first}
                </figure>
              );
            })}
          </div>
        ) : (
          meta
        )}
      </article>

      {open !== null && images[open] ? (
        <Lightbox images={images} index={open} title={project.title} onClose={close} onStep={step} />
      ) : null}
    </PageShell>
  );
}
