import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";

/** What a card needs. Full projects from /api/projects and ProjectLite from /api/ask both fit. */
export type CardProject = {
  slug: string;
  title: string;
  client?: string;
  industry?: string;
  coverImage: string;
  videos?: string[];
};

type Size = "feature" | "grid";

// React 18 warns on the camelCase `fetchPriority` prop; the lowercase attribute is what the browser reads.
const PRIORITY_ATTRS = { fetchpriority: "high" } as Record<string, string>;

const WIDTHS: Record<Size, number[]> = {
  feature: [480, 720, 960, 1280, 1600, 2000],
  grid: [320, 480, 640, 800, 1000, 1200],
};

// The grid is 2 columns at feature size and 3 at grid size on desktop; 1 and 2 on phones.
const SIZES: Record<Size, string> = {
  feature: "(min-width: 768px) 50vw, 100vw",
  grid: "(min-width: 768px) 33vw, 50vw",
};

/**
 * Only direct files can loop in a <video>. Vimeo player URLs (what most projects
 * carry today) need an iframe, which is too heavy for a card, so those cards
 * show the cover image.
 */
export function playableVideo(videos?: string[]) {
  const src = videos?.[0];
  if (!src) return null;
  return /\.(mp4|webm|m4v|mov)(\?|#|$)/i.test(src) || /cdn\.sanity\.io\/files\//i.test(src) ? src : null;
}

/** Plays muted and inline only while on screen; preload="none" until then. */
function LoopVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.preload = "auto";
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="project-card__media"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
    />
  );
}

export function ProjectCard({
  project,
  size,
  priority = false,
}: {
  project: CardProject;
  size: Size;
  /** First card above the fold: eager + fetchpriority high. Everything else is lazy. */
  priority?: boolean;
}) {
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const widths = WIDTHS[size];
  const src = getOptimizedImageUrl(project.coverImage, { width: widths[2], quality: 80 }) || project.coverImage;
  const srcSet = buildImageSrcSet(project.coverImage, widths, { quality: 80 });
  const dimensions = getImageDimensions(project.coverImage);
  const video = reduced ? null : playableVideo(project.videos);
  const name = project.client || project.title;

  return (
    <Link href={`/projects/${project.slug}`} className="project-card" data-size={size}>
      <span className="project-card__frame">
        {video ? (
          <LoopVideo src={video} poster={src} />
        ) : failed ? null : (
          <img
            className="project-card__media"
            src={src}
            srcSet={srcSet}
            sizes={SIZES[size]}
            alt={project.title}
            width={dimensions?.width}
            height={dimensions?.height}
            loading={priority ? "eager" : "lazy"}
            {...(priority ? PRIORITY_ATTRS : null)}
            decoding="async"
            onError={() => setFailed(true)}
          />
        )}
      </span>
      <span className="project-card__caption">
        <span className="project-card__name">{name}</span>
        {project.industry ? <span className="project-card__meta">{project.industry}</span> : null}
      </span>
    </Link>
  );
}
