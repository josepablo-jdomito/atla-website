import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute, useSearch } from "wouter";
import { PageShell } from "@/components/site/PageShell";
import { ProjectCard } from "@/components/site/ProjectCard";
import { moreLikeThis, nextProjectInSiteOrder, toSiteProject, useSiteProjects } from "@/components/site/siteProjects";
import { placeLabel, wallHrefFor } from "@/components/site/workFilters";
import { isClientWork } from "@/components/site/wallLayout";
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
import { openerFrame, openerImageUrl, type OpenerFrame } from "@/lib/openerFrame";

/**
 * The project page as a story column (JP, 2026-11-05, after littleplains.com/projects/revitin):
 * title, one line of facts, the description, then the work in a centered column.
 * Landscapes run the column's width; portraits go two-up. Paragraphs from Sanity
 * `body`, when they exist, sit between media groups. A tile on the home links here
 * with ?at=<asset>, and the page opens on that exact image. Click an image for the
 * lightbox (arrows, Escape).
 */

const { project: copy } = siteCopy;
const COLUMN_WIDTHS = [640, 960, 1280, 1600, 2000];
const HALF_WIDTHS = [320, 480, 640, 800, 1000];
const COLUMN_SIZES = "(min-width: 1200px) 880px, (min-width: 768px) 80vw, 100vw";
const HALF_SIZES = "(min-width: 1200px) 434px, (min-width: 768px) 40vw, 50vw";
/** Below this width / height, a piece is a portrait and pairs with its neighbour. */
const PORTRAIT_BELOW = 1.15;
/** Between facets on the project line; the dot stays with the word before it when the line wraps. */
const FACET_SEPARATOR = "\u00a0\u00a0·  ";
/** Sticky header height, so a landing scroll leaves the image clear of it. */
const HEADER = 64;

type MediaItem = ProjectMediaMosaicItem | { type: "image"; src: string; sourceIndex?: number };
type Group = { kind: "opener" | "full" | "pair"; items: MediaItem[] };

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

/**
 * One template for every project (JP, 2026-11-05, UX interview 17: "unifica todo, hoy cada
 * proyecto hace lo que quiere"): the page always opens with its first piece alone, in the same
 * 4:3 frame at the column's width, whatever the image's own ratio. The rest follows the story
 * rhythm (landscapes full, portraits in pairs).
 */
export function groupStory(items: MediaItem[]): Group[] {
  if (items.length === 0) return [];
  const [first, ...rest] = items;
  return [{ kind: "opener", items: [first] }, ...groupMedia(rest)];
}

const item0IsImage = (group: Group) => group.items[0]?.type === "image";

function ProjectImage({
  src,
  alt,
  half,
  priority,
  frame,
  onOpen,
}: {
  src: string;
  alt: string;
  half: boolean;
  priority: boolean;
  /** Only the opener has one: a 4:3 crop (around the hotspot when there is one) or the image whole. */
  frame?: OpenerFrame;
  onOpen: () => void;
}) {
  const dims = getImageDimensions(src);
  const crop = frame?.mode === "crop" ? frame : null;
  return (
    <button type="button" className="story-media__button" onClick={onOpen} aria-label={`${alt}. Open larger`}>
      <img
        className="story-media__item"
        src={frame ? openerImageUrl(src, frame, 1280, 88) : getOptimizedImageUrl(src, { width: half ? 800 : 1280, quality: 88 }) || src}
        srcSet={
          crop
            ? buildImageSrcSet(src, COLUMN_WIDTHS, { quality: 88, fit: "crop", focal: crop.focal, ratio: crop.ratio })
            : buildImageSrcSet(src, half ? HALF_WIDTHS : COLUMN_WIDTHS, { quality: 88 })
        }
        sizes={half ? HALF_SIZES : COLUMN_SIZES}
        alt={alt}
        width={crop ? 1280 : dims?.width}
        height={crop ? 960 : dims?.height}
        style={crop?.focal ? { objectPosition: `${crop.focal.x * 100}% ${crop.focal.y * 100}%` } : undefined}
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
  const paused = useMotionPaused();
  return (
    <video
      ref={ref}
      className="story-media__item"
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
  // Next and More like this are client work only: the studio's own pages and the course never turn up
  // as a neighbour (red team 25); the page being read stays in the list so "next" still finds its place.
  const clientWork = useMemo(() => projects.filter((item) => item.slug === slug || isClientWork(item)), [projects, slug]);
  const next = useMemo(() => nextProjectInSiteOrder(clientWork, slug), [clientWork, slug]);
  // The facets (sector, disciplines, place, stage) come with the project; the related block reads the wall's list.
  const site = useMemo(() => (projectData ? toSiteProject(projectData) : null), [projectData]);
  const related = useMemo(() => (site ? moreLikeThis(clientWork, site) : []), [clientWork, site]);

  const media: MediaItem[] = useMemo(
    () =>
      project
        ? [
            ...(project.heroImage === PROJECT_PLACEHOLDER_IMAGE ? [] : [{ type: "image" as const, src: project.heroImage }]),
            ...projectMediaSequence(project),
          ]
        : [],
    [project],
  );
  const groups = useMemo(() => groupStory(media), [media]);
  const images = useMemo(() => media.filter((item) => item.type === "image").map((item) => item.src), [media]);
  const paragraphs = project?.bodySections ?? [];
  // One paragraph after every third group, while paragraphs last.
  const paragraphEvery = paragraphs.length > 0 ? Math.max(1, Math.ceil(groups.length / (paragraphs.length + 1))) : 0;

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
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - HEADER - 16);
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
  const year = Number.parseInt(project.dateLabel, 10) > 0 ? project.dateLabel : "";
  // One skeleton for every project: the year is the only fact line (the client line came and went per project).
  const facts = [year].filter(Boolean);
  const proofLine = copy.proof[project.slug] ?? "";
  const heroFrame = openerFrame(project.heroImage, project.heroFocal);
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
  let imageIndex = -1;
  let paragraphIndex = 0;

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

      <article className="story">
        <header className="story-head">
          <h1 className="story-head__title">{project.title}</h1>
          {facts.length > 0 ? <p className="story-head__facts">{facts.join("  ·  ")}</p> : null}
          {facetLinks.length > 0 ? (
            <p className="story-head__facets" aria-label={copy.facetsLabel}>
              {facetLinks.map((facet, index) => (
                <span key={`${facet.key}:${facet.value}`}>
                  {index > 0 ? <span aria-hidden="true">{facetLinks[index - 1].key === facet.key ? ", " : FACET_SEPARATOR}</span> : null}
                  {facet.key === "discipline" && facet.value === DISCIPLINE_ON_ALL ? (
                    facet.value
                  ) : (
                    <Link href={wallHrefFor(facet.key, facet.value)}>{facet.key === "place" ? placeLabel(facet.value) : facet.value}</Link>
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
          {proofLine ? <p className="story-head__proof">{proofLine}</p> : null}
          {project.intro ? <p className="story-head__lead">{project.intro}</p> : null}
          {groups.some((group) => group.items.some((item) => item.type !== "image")) ? (
            <MotionToggle className="motion-toggle--story" />
          ) : null}
        </header>

        <div className="story-body">
          {groups.map((group, groupIndex) => {
            const block = (
              <div
                key={`g${groupIndex}`}
                className="story-media"
                data-kind={group.kind}
                data-frame={group.kind === "opener" ? (item0IsImage(group) ? heroFrame.mode : "native") : undefined}
              >
                {group.items.map((item, i) => {
                  const key = `${item.type}-${groupIndex}-${i}`;
                  if (item.type === "image") {
                    imageIndex += 1;
                    const index = imageIndex;
                    return (
                      <figure key={key} className="story-media__figure" data-asset={assetKey(item.src)}>
                        <ProjectImage
                          src={item.src}
                          alt={`${project.title}, image ${index + 1}`}
                          half={group.kind === "pair"}
                          priority={index === 0}
                          frame={group.kind === "opener" && item.src === project.heroImage ? heroFrame : undefined}
                          onOpen={() => setOpen(index)}
                        />
                      </figure>
                    );
                  }
                  if (item.type === "video") {
                    return (
                      <figure key={key} className="story-media__figure" data-asset={assetKey(item.src)}>
                        <ProjectVideo src={item.src} poster={item.poster} title={item.title || `${project.title}, video`} reduced={reduced} />
                      </figure>
                    );
                  }
                  return (
                    <figure key={key} className="story-media__figure story-media__embed">
                      <iframe
                        src={reduced || motionPaused ? item.src : toVimeoBackgroundUrl(item.src)}
                        title={item.title || `${project.title}, video`}
                        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </figure>
                  );
                })}
              </div>
            );
            const wantsParagraph =
              paragraphEvery > 0 && (groupIndex + 1) % paragraphEvery === 0 && paragraphIndex < paragraphs.length;
            if (!wantsParagraph) return block;
            const text = paragraphs[paragraphIndex];
            paragraphIndex += 1;
            return (
              <div key={`g${groupIndex}`}>
                {block}
                <p className="story-text">{text}</p>
              </div>
            );
          })}
        </div>

        <section className="story-cta" aria-labelledby="project-cta-title">
          <h2 id="project-cta-title" className="story-cta__title">
            {copy.ctaTitle}
          </h2>
          <Link href={`/brief?seed=${encodeURIComponent(copy.seed(project.title))}`} className="story-cta__link">
            {copy.ctaLabel}
          </Link>
        </section>

        {related.length > 0 ? (
          <section className="story-more" aria-labelledby="project-more-label">
            <h2 id="project-more-label" className="story-more__label">
              {copy.moreLabel}
            </h2>
            <ul className="story-more__grid">
              {related.map((item) => (
                <li key={item.slug}>
                  <ProjectCard project={item} size="grid" />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {next ? (
          <section className="story-next" aria-labelledby="project-next-label">
            <h2 id="project-next-label" className="story-next__label">
              {copy.nextLabel}
              {" "}
              <Link href={`/projects/${next.slug}`} className="story-next__title">
                {next.title}
              </Link>
            </h2>
            <ProjectCard project={next} size="next" />
          </section>
        ) : null}
      </article>

      {open !== null && images[open] ? (
        <Lightbox images={images} index={open} title={project.title} onClose={close} onStep={step} />
      ) : null}
    </PageShell>
  );
}
