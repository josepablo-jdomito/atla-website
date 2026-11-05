import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type WheelEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { HOME_META_DESCRIPTION, ORGANIZATION_SCHEMA, SITE_ORIGIN, formatMetaTitle } from "@shared/siteSeo";
import { getOptimizedImageUrl, isSanityImageUrl, sanitizeImageUrls } from "@shared/imageDelivery";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { SeoHead } from "@/components/seo/SeoHead";

// Figma: Atla 🌐 / Web / Home (4546:3327). One screen: navbar, a row of portrait
// cards with the active project's name over the center card, and a two-line strip.
// Card geometry lives in index.css (.atla-home-*) and is driven by --d / --n per card.

const ADVANCE_MS = 4200;
const MIN_TRACK = 9; // enough cards that the wrap-around always happens off screen
const SWIPE_DISTANCE = 40;
const SWIPE_VELOCITY = 0.11;

type HomeProject = { slug: string; title: string; image: string };

function toHomeProjects(projects?: Project[]): HomeProject[] {
  if (!projects?.length) return [];
  const featured = projects.filter((project) => project.featured);
  const source = featured.length >= 5 ? featured : projects;
  return source
    .map((project) => {
      const gallery = Array.isArray(project.images) ? project.images : [];
      const image = sanitizeImageUrls([project.coverImage, ...gallery])[0];
      return image ? { slug: project.slug, title: project.title, image } : null;
    })
    .filter((project): project is HomeProject => project !== null);
}

/** Signed distance from the active card on a ring of `count` cards. */
function ringOffset(index: number, active: number, count: number) {
  let offset = (index - active) % count;
  if (offset > count / 2) offset -= count;
  if (offset < -count / 2) offset += count;
  return offset;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduced;
}

export default function AtlaHome() {
  const { data } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
  const projects = useMemo(() => toHomeProjects(data), [data]);

  // Repeat short lists so the ring is wide enough to wrap off screen.
  const track = useMemo(() => {
    if (projects.length === 0) return [];
    const copies = Math.max(1, Math.ceil(MIN_TRACK / projects.length));
    return Array.from({ length: copies }, (_, copy) =>
      projects.map((project) => ({ ...project, key: `${project.slug}-${copy}`, copy })),
    ).flat();
  }, [projects]);

  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const pointer = useRef<{ x: number; t: number; id: number } | null>(null);
  const wheelLock = useRef(0);

  const count = track.length;
  const current = count ? track[((active % count) + count) % count] : null;

  const go = useCallback(
    (step: number) => {
      if (!count) return;
      setActive((value) => (((value + step) % count) + count) % count);
    },
    [count],
  );

  const userGo = useCallback(
    (step: number) => {
      setHasInteracted(true);
      go(step);
    },
    [go],
  );

  // Advances on its own until the visitor takes over; never under reduced motion.
  useEffect(() => {
    if (count < 2 || isPaused || hasInteracted || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") go(1);
    }, ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [count, go, hasInteracted, isPaused, reducedMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true'], [role='dialog']")) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        userGo(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        userGo(-1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [userGo]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (pointer.current || event.pointerType === "mouse") return;
    pointer.current = { x: event.clientX, t: performance.now(), id: event.pointerId };
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    if (!start || start.id !== event.pointerId) return;
    pointer.current = null;
    const distance = event.clientX - start.x;
    const velocity = Math.abs(distance) / Math.max(1, performance.now() - start.t);
    if (Math.abs(distance) >= SWIPE_DISTANCE || velocity > SWIPE_VELOCITY) {
      userGo(distance < 0 ? 1 : -1);
    }
  };

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaX) < Math.abs(event.deltaY) || Math.abs(event.deltaX) < 12) return;
    const now = performance.now();
    if (now - wheelLock.current < 600) return;
    wheelLock.current = now;
    userGo(event.deltaX > 0 ? 1 : -1);
  };

  const structuredData = useMemo(
    () => [
      ORGANIZATION_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Atla featured work",
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: project.title,
          url: `${SITE_ORIGIN}/projects/${project.slug}`,
        })),
      },
    ],
    [projects],
  );

  const firstImage = projects[0]?.image;
  const preloadImages = useMemo(
    () => (firstImage ? [getOptimizedImageUrl(firstImage, { width: 600, height: 900, fit: "crop", quality: 82 })] : []),
    [firstImage],
  );

  return (
    <div className="atla-home">
      <SeoHead
        title={formatMetaTitle("Atla", "Strategy-Led Branding Studio")}
        description={HOME_META_DESCRIPTION}
        pathname="/"
        image={firstImage}
        preloadImages={preloadImages}
        structuredData={structuredData}
      />
      <div className="atla-dark-surface atla-home-surface">
        <AtlaNav showCommandTrigger={false} />

        <main id="main" className="atla-home-main">
          <div
            className="atla-home-stage"
            aria-roledescription="carousel"
            aria-label="Selected work"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
            }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              pointer.current = null;
            }}
            onWheel={onWheel}
          >
            {track.map((project, index) => {
              const offset = ringOffset(index, active, count);
              const distance = Math.abs(offset);
              const isActive = offset === 0;
              const isNear = distance <= 2;
              const src = getOptimizedImageUrl(project.image, { width: 600, height: 900, fit: "crop", quality: 82 });
              const srcSet = isSanityImageUrl(project.image)
                ? [400, 600, 900]
                    .map((w) => `${getOptimizedImageUrl(project.image, { width: w, height: w * 1.5, fit: "crop", quality: 82 })} ${w}w`)
                    .join(", ")
                : undefined;

              return (
                <a
                  key={project.key}
                  href={`/projects/${project.slug}`}
                  className="atla-home-card"
                  data-active={isActive || undefined}
                  data-far={distance > 3 || undefined}
                  aria-current={isActive ? "true" : undefined}
                  tabIndex={project.copy === 0 ? 0 : -1}
                  aria-hidden={project.copy === 0 ? undefined : true}
                  draggable={false}
                  onFocus={() => {
                    if (!isActive) {
                      setHasInteracted(true);
                      setActive(index);
                    }
                  }}
                  onClick={(event) => {
                    if (isActive) return;
                    event.preventDefault();
                    setHasInteracted(true);
                    setActive(index);
                  }}
                  style={
                    {
                      "--d": Math.sign(offset),
                      "--n": distance,
                      zIndex: 10 - distance,
                    } as CSSProperties
                  }
                >
                  <img
                    src={src}
                    srcSet={srcSet}
                    sizes="(max-width: 767px) 68vw, (max-width: 1023px) 28vw, 25vw"
                    alt={project.title}
                    width={600}
                    height={900}
                    loading={isNear ? "eager" : "lazy"}
                    fetchPriority={isActive && index === 0 ? "high" : undefined}
                    decoding="async"
                    draggable={false}
                  />
                </a>
              );
            })}

            {current ? (
              <p key={current.key} className="atla-home-title" aria-hidden="true">
                {current.title}
              </p>
            ) : null}
          </div>

          <div className="atla-home-strip">
            <p>
              Working around
              <br />
              the US &amp; LatAm
            </p>
            <p>
              Design with
              <br />
              intention
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
