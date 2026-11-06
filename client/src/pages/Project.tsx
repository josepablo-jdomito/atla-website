import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
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
 * The project page, Little Plains pure (JP, 2026-11-06, measured on littleplains.com/projects/revitin,
 * sweetgreen and haven; see .superpowers/sdd/2026-11-04-atla-site-v2/project-lp-measurements.md).
 * One centered column. The opening is a plate: the cover at its own ratio in the left half, the title,
 * the one line and the facets beside it. Then the story: text and image groups alternating on one
 * rhythm, the first paragraph straight after the opening. Landscapes run the column; portraits pair.
 * Once the opening scrolls away, a small rail (cover, title, facets) holds the context at the left edge.
 * No ending section: Little Plains has no next link and no call to action, the header carries
 * "Start a project". A tile on the home links here with ?at=<asset>, and the page opens on that image.
 */

const { project: copy } = siteCopy;
const COLUMN_WIDTHS = [640, 960, 1280, 1600, 2000];
const HALF_WIDTHS = [320, 480, 640, 800, 1000];
const COLUMN_SIZES = "(min-width: 768px) 720px, calc(100vw - 32px)";
const HALF_SIZES = "(min-width: 768px) 355px, calc(100vw - 32px)";
/** Below this width / height, a piece is a portrait and pairs with its neighbour. */
const PORTRAIT_BELOW = 1.15;
/** Between facets on the project line; the dot stays with the word before it when the line wraps. */
const FACET_SEPARATOR = "  ·  ";
/** Sticky header height, so a landing scroll leaves the image clear of it. */
const HEADER = 64;

type MediaItem = ProjectMediaMosaicItem | { type: "image"; src: string; sourceIndex?: number };
type Group = { kind: "full" | "pair"; items: MediaItem[] };
export type StoryBlock = { kind: "media"; group: Group } | { kind: "text"; text: string };

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
 * The story's order, as on Little Plains: the first paragraph right after the opening, then the image
 * groups with the remaining paragraphs spread evenly between them. A paragraph never gets lost: any
 * that find no slot close the story. No paragraphs, images only.
 */
export function storyBlocks(groups: Group[], paragraphs: string[]): StoryBlock[] {
  const blocks: StoryBlock[] = [];
  const [first, ...rest] = paragraphs;
  if (first) blocks.push({ kind: "text", text: first });
  const every = rest.length > 0 ? Math.max(1, Math.ceil(groups.length / (rest.length + 1))) : 0;
  let next = 0;
  groups.forEach((group, index) => {
    blocks.push({ kind: "media", group });
    if (every > 0 && (index + 1) % every === 0 && next < rest.length) blocks.push({ kind: "text", text: rest[next++] });
  });
  while (next < rest.length) blocks.push({ kind: "text", text: rest[next++] });
  return blocks;
}

function ProjectImage({
  src,
  alt,
  sizes,
  widths,
  priority,
  onOpen,
}: {
  src: string;
  alt: string;
  sizes: string;
  widths: number[];
  priority: boolean;
  onOpen: () => void;
}) {
  const dims = getImageDimensions(src);
  return (
    <button type="button" className="story-media__button" onClick={onOpen} aria-label={`${alt}. Open larger`}>
      <img
        className="story-media__item"
        src={getOptimizedImageUrl(src, { width: widths[2], quality: 88 }) || src}
        srcSet={buildImageSrcSet(src, widths, { quality: 88 })}
        sizes={sizes}
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

/**
 * Fades each story block in as it enters (Little Plains does the same, at 500ms; ours stays within
 * the site's 300ms budget, opacity only). Only blocks below the fold wait, so nothing on screen at
 * load ever blinks, and nothing waits at all under reduced motion or without IntersectionObserver.
 */
function useReveal(root: RefObject<HTMLElement>, reduced: boolean, key: unknown) {
  useEffect(() => {
    const el = root.current;
    if (!el || reduced || typeof IntersectionObserver === "undefined") return;
    const blocks = Array.from(el.querySelectorAll<HTMLElement>(".story-block"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement | undefined;
          if (!target || !entry.isIntersecting) continue;
          target.dataset.reveal = "in";
          observer.unobserve(target);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    for (const block of blocks) {
      if (block.getBoundingClientRect().top < window.innerHeight) continue;
      block.dataset.reveal = "wait";
      observer.observe(block);
    }
    return () => {
      observer.disconnect();
      for (const block of blocks) delete block.dataset.reveal;
    };
  }, [root, reduced, key]);
}

/** True once the opening has scrolled up out of view: the rail takes over the context. */
function usePastOpening(target: RefObject<HTMLElement>, key: unknown) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = target.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (!entry?.boundingClientRect) return;
      setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, key]);
  return past;
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
  const [open, setOpen] = useState<number | null>(null);
  const landedRef = useRef<string | null>(null);
  const articleRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLElement>(null);

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
  const flow: MediaItem[] = useMemo(() => (project ? projectMediaSequence(project) : []), [project]);
  const paragraphs = project?.bodySections;
  const blocks = useMemo(() => storyBlocks(groupMedia(flow), paragraphs ?? []), [flow, paragraphs]);
  const images = useMemo(
    () => [...(cover ? [cover] : []), ...flow.filter((item) => item.type === "image").map((item) => item.src)],
    [cover, flow],
  );
  const firstMotionBlock = blocks.findIndex(
    (block) => block.kind === "media" && block.group.items.some((item) => item.type !== "image"),
  );

  useReveal(articleRef, reduced, blocks);
  const pastOpening = usePastOpening(headRef, project?.slug);

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
  // The cover is image 0 in the lightbox; the story's images follow in reading order.
  let imageIndex = cover ? 0 : -1;

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

      <article ref={articleRef} className="story">
        <header ref={headRef} className="story-head" data-cover={cover ? "yes" : "none"}>
          {cover ? (
            <figure className="story-head__cover" data-asset={assetKey(cover)}>
              <ProjectImage
                src={cover}
                alt={`${project.title}, image 1`}
                sizes={HALF_SIZES}
                widths={HALF_WIDTHS}
                priority
                onOpen={() => setOpen(0)}
              />
            </figure>
          ) : null}
          <div className="story-head__copy">
            <h1 className="story-head__title">{project.title}</h1>
            {project.intro ? <p className="story-head__lead">{project.intro}</p> : null}
            {facetLinks.length > 0 ? (
              <p className="story-head__facets" aria-label={copy.facetsLabel}>
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
            {year ? <p className="story-head__facts">{year}</p> : null}
            {proofLine ? <p className="story-head__proof">{proofLine}</p> : null}
          </div>
        </header>

        <div className="story-body">
          {blocks.map((block, blockIndex) => {
            if (block.kind === "text") {
              return (
                <div key={`t${blockIndex}`} className="story-block story-block--text">
                  <p className="story-text">{block.text}</p>
                </div>
              );
            }
            const { group } = block;
            return (
              <div key={`m${blockIndex}`} className="story-block">
                {blockIndex === firstMotionBlock ? <MotionToggle className="motion-toggle--story" /> : null}
                <div className="story-media" data-kind={group.kind}>
                  {group.items.map((item, i) => {
                    const key = `${item.type}-${blockIndex}-${i}`;
                    if (item.type === "image") {
                      imageIndex += 1;
                      const index = imageIndex;
                      const half = group.kind === "pair";
                      return (
                        <figure key={key} className="story-media__figure" data-asset={assetKey(item.src)}>
                          <ProjectImage
                            src={item.src}
                            alt={`${project.title}, image ${index + 1}`}
                            sizes={half ? HALF_SIZES : COLUMN_SIZES}
                            widths={half ? HALF_WIDTHS : COLUMN_WIDTHS}
                            priority={index === 0}
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
              </div>
            );
          })}
        </div>
      </article>

      {/* The rail repeats the opening once it has scrolled away (Little Plains' mini index). It is
          context, not navigation: the opening above holds the real title and links. */}
      <aside className="story-rail" aria-hidden="true" data-shown={pastOpening ? "yes" : "no"}>
        {cover ? (
          <img
            className="story-rail__cover"
            src={getOptimizedImageUrl(cover, { width: 400, quality: 80 }) || cover}
            alt=""
            width={getImageDimensions(cover)?.width}
            height={getImageDimensions(cover)?.height}
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <p className="story-rail__title">{project.title}</p>
        {facetLinks.length > 0 ? (
          <p className="story-rail__facets">
            {[...facetLinks.map(facetLabel), ...(stage ? [stage] : [])].join(", ")}
          </p>
        ) : null}
        {year ? <p className="story-rail__facets">{year}</p> : null}
      </aside>

      {open !== null && images[open] ? (
        <Lightbox images={images} index={open} title={project.title} onClose={close} onStep={step} />
      ) : null}
    </PageShell>
  );
}
