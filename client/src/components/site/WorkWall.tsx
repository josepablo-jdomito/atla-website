import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { useSiteProjects } from "@/components/site/siteProjects";
import { buildWallSequence, placeInColumns, wallPass, type WallTile } from "@/components/site/wallLayout";
import { WorkExplore } from "@/components/site/WorkExplore";
import { NO_FILTERS, WorkFilters, activeFilterCount, matchesFilters, type Filters } from "@/components/site/workFilters";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { siteCopy } from "@/content/siteCopy";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";

const WIDTHS = [320, 480, 640, 800, 1000, 1280];
const SIZES = "(min-width: 2000px) 12vw, (min-width: 1440px) 17vw, (min-width: 1200px) 20vw, (min-width: 768px) 33vw, 50vw";
/** Pieces in the first viewport load eagerly; everything after waits for the scroll. */
const EAGER = 20;
/** How many pieces one pass shows at most; the next pass arrives as the visitor nears the end. */
const PAGE = 72;
/**
 * Column count follows the viewport, like Cosmos (8 columns on a wide desktop,
 * JP 2026-11-05): a column is about 240 px plus the gutter, between 2 and 8.
 * Prerender has no window and renders the phone layout.
 */
const COLUMN_TARGET = 220;
const MAX_COLUMNS = 8;

function readColumns() {
  if (typeof window === "undefined") return 2;
  const width = window.innerWidth;
  if (width < 768) return 2;
  const gap = width >= 1200 ? 24 : 20;
  return Math.max(3, Math.min(MAX_COLUMNS, Math.floor((width - gap) / (COLUMN_TARGET + gap))));
}

function useColumns() {
  const [columns, setColumns] = useState(readColumns);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setColumns(readColumns()));
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, []);
  return columns;
}

/** A direct video file: muted, inline, playing only while on screen. Reduced motion shows the poster. */
function VideoTile({ tile, reduced }: { tile: WallTile; reduced: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const poster = getOptimizedImageUrl(tile.poster || "", { width: 640, quality: 82 }) || tile.poster;
  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.preload = "auto";
          void video.play().catch(() => undefined);
        } else video.pause();
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);
  return (
    <video
      ref={ref}
      src={tile.src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      style={{ aspectRatio: `${tile.ratio}` }}
    />
  );
}

function Tile({ tile, eager, reduced }: { tile: WallTile; eager: boolean; reduced: boolean }) {
  const [loaded, setLoaded] = useState(tile.kind === "video");
  const [failed, setFailed] = useState(false);
  const dims = getImageDimensions(tile.src);
  if (failed) return null;
  return (
    <Link href={`/projects/${tile.slug}`} className="wall-tile" aria-label={tile.title} data-loaded={loaded}>
      {tile.kind === "video" ? (
        <VideoTile tile={tile} reduced={reduced} />
      ) : (
        <img
          src={getOptimizedImageUrl(tile.src, { width: 640, quality: 82 }) || tile.src}
          srcSet={buildImageSrcSet(tile.src, WIDTHS, { quality: 82 })}
          sizes={SIZES}
          alt=""
          width={dims?.width}
          height={dims?.height}
          style={{ aspectRatio: `${tile.ratio}` }}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </Link>
  );
}

/** The home: the work, from the first pixel. Fixed columns, native ratios, the whole gallery. */
export function WorkWall() {
  const { projects } = useSiteProjects();
  const columns = useColumns();
  const reduced = useReducedMotion();
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [shown, setShown] = useState(PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // One fresh shuffle per page load; the prerender (no window) keeps the site order.
  const [seed] = useState(() => (typeof window === "undefined" ? 0 : 1 + Math.floor(Math.random() * 2 ** 31)));
  const filtered = useMemo(() => projects.filter((project) => matchesFilters(project, filters)), [projects, filters]);
  const sequence = useMemo(() => buildWallSequence(filtered, seed), [filtered, seed]);

  // The pool loops only once the visitor has seen all of it; each pass starts elsewhere.
  const tiles = useMemo(() => {
    const all: Array<WallTile & { key: string }> = [];
    if (sequence.length === 0) return all;
    for (let pass = 0; all.length < shown; pass += 1) {
      for (const tile of wallPass(sequence, pass)) {
        if (all.length >= shown) break;
        all.push({ ...tile, key: `${pass}:${tile.src}` });
      }
    }
    return all;
  }, [sequence, shown]);
  const placed = useMemo(() => placeInColumns(tiles, columns), [tiles, columns]);
  const eagerKeys = useMemo(() => new Set(tiles.slice(0, EAGER).map((tile) => tile.key)), [tiles]);

  const changeFilters = (next: Filters) => {
    setFilters(next);
    setShown(PAGE);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || sequence.length === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShown((current) => current + PAGE);
      },
      { rootMargin: "1200px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sequence.length, shown]);

  if (projects.length === 0) return null;

  return (
    <section className="work-wall" aria-label="Work">
      {sequence.length === 0 ? (
        <p className="work-wall__empty">{siteCopy.home.results.empty}</p>
      ) : (
        <div className="work-wall__columns" style={{ ["--wall-columns" as string]: columns }}>
          {placed.map((column, index) => (
            <div className="work-wall__column" key={index}>
              {column.map((tile) => (
                <Tile key={tile.key} tile={tile} eager={eagerKeys.has(tile.key)} reduced={reduced} />
              ))}
            </div>
          ))}
        </div>
      )}
      <div ref={sentinelRef} aria-hidden="true" />
      <WorkExplore activeCount={activeFilterCount(filters)} visible>
        <WorkFilters projects={projects} filters={filters} onChange={changeFilters} />
      </WorkExplore>
    </section>
  );
}
