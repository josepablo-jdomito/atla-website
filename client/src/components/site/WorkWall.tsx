import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { useSiteProjects } from "@/components/site/siteProjects";
import { buildWallSequence, placeInColumns, wallPass, type WallTile } from "@/components/site/wallLayout";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";

const WIDTHS = [320, 480, 640, 800, 1000, 1280];
const SIZES = "(min-width: 1200px) 25vw, (min-width: 768px) 33vw, 50vw";
/** Covers in the first viewport load eagerly; everything after waits for the scroll. */
const EAGER = 8;
/** Prerender has no window and renders the phone layout. */
const COLUMNS = { phone: 2, tablet: 3, desktop: 4 } as const;

function readColumns() {
  if (typeof window === "undefined") return COLUMNS.phone;
  if (window.matchMedia("(min-width: 1200px)").matches) return COLUMNS.desktop;
  if (window.matchMedia("(min-width: 768px)").matches) return COLUMNS.tablet;
  return COLUMNS.phone;
}

function useColumns() {
  const [columns, setColumns] = useState(readColumns);
  useEffect(() => {
    const queries = [window.matchMedia("(min-width: 1200px)"), window.matchMedia("(min-width: 768px)")];
    const update = () => setColumns(readColumns());
    update();
    for (const query of queries) query.addEventListener("change", update);
    return () => {
      for (const query of queries) query.removeEventListener("change", update);
    };
  }, []);
  return columns;
}

function Tile({ tile, eager }: { tile: WallTile; eager: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const dims = getImageDimensions(tile.src);
  if (failed) return null;
  return (
    <Link href={`/projects/${tile.slug}`} className="wall-tile" aria-label={tile.title} data-loaded={loaded}>
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
    </Link>
  );
}

/** The home: the work, from the first pixel. Fixed columns, native ratios, an endless pool. */
export function WorkWall() {
  const { projects } = useSiteProjects();
  const columns = useColumns();
  const sequence = useMemo(() => buildWallSequence(projects), [projects]);
  const [passes, setPasses] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const tiles = useMemo(() => {
    const all: Array<WallTile & { key: string }> = [];
    for (let pass = 0; pass < passes; pass += 1) {
      for (const tile of wallPass(sequence, pass)) all.push({ ...tile, key: `${pass}:${tile.slug}` });
    }
    return all;
  }, [sequence, passes]);
  const placed = useMemo(() => placeInColumns(tiles, columns), [tiles, columns]);
  const eagerKeys = useMemo(() => new Set(tiles.slice(0, EAGER).map((tile) => tile.key)), [tiles]);

  // The next pass arrives before the visitor reaches the bottom; the pool never ends.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || sequence.length === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPasses((current) => current + 1);
      },
      { rootMargin: "1200px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sequence.length, passes]);

  if (sequence.length === 0) return null;

  return (
    <section className="work-wall" aria-label="Work">
      <div className="work-wall__columns" style={{ ["--wall-columns" as string]: columns }}>
        {placed.map((column, index) => (
          <div className="work-wall__column" key={index}>
            {column.map((tile) => (
              <Tile key={tile.key} tile={tile} eager={eagerKeys.has(tile.key)} />
            ))}
          </div>
        ))}
      </div>
      <div ref={sentinelRef} aria-hidden="true" />
    </section>
  );
}
