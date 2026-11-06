import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearch } from "wouter";
import { useSiteProjects, type SiteProject as SiteProjectT } from "@/components/site/siteProjects";
import { buildWallSequence, placeInColumns, wallPass, type WallTile } from "@/components/site/wallLayout";
import { WorkExplore } from "@/components/site/WorkExplore";
import { AskPanel } from "@/components/site/AskPanel";
import { useAsk } from "@/lib/askClient";
import { pieceHref } from "@/lib/askPieces";
import { PRIORITY_ATTRS, useInViewPlayback } from "@/components/site/media";
import { MotionToggle } from "@/components/site/MotionToggle";
import {
  ALL as ALL_VALUE,
  WorkFilters,
  activeFilterCount,
  filtersFromSearch,
  matchesFilters,
  queryFromSearch,
  searchFromFilters,
  type Filters,
} from "@/components/site/workFilters";
import { rankProjects } from "@shared/rankProjects";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { trackBarSearch } from "@/lib/ga";
import { siteCopy } from "@/content/siteCopy";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";

const WIDTHS = [320, 480, 640, 800, 1000, 1280];
const SIZES = "(min-width: 2000px) 12vw, (min-width: 1440px) 17vw, (min-width: 1200px) 20vw, (min-width: 768px) 33vw, 50vw";
/**
 * The first pieces load eagerly and win the network race (fetchpriority="high"): about three rows of
 * the current column count, never fewer than one phone screen. The rest wait for the scroll. The
 * prerender (phone layout) also preloads the first three from its markup (script/build.ts).
 */
const EAGER_MIN = 8;
const EAGER_ROWS = 3;
export const eagerCount = (columns: number) => Math.max(EAGER_MIN, columns * EAGER_ROWS);
/**
 * How many pieces one pass shows at most; the next pass arrives as the visitor nears the end.
 * The open wall never stops (JP, 2026-11-05, UX interview 8): no pass cap, no "More" link, and the
 * home shows no footer under it. A search is finite and ends with its last match.
 */
const PAGE = 72;
/**
 * Column count follows the viewport, like Cosmos (8 columns on a wide desktop,
 * JP 2026-11-05): a column is about 240 px plus the gutter, between 2 and 8.
 * Prerender has no window and renders the phone layout.
 */
const COLUMN_TARGET = 220;
/** A typed search counts once it has rested this long (after the URL debounce). */
const SEARCH_EVENT_SETTLE_MS = 1000;
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
  useInViewPlayback(ref, { enabled: !reduced, preloadOnEnter: true });
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

/** Exported for tests. */
export function Tile({
  tile,
  eager,
  priority = false,
  reduced,
}: {
  tile: WallTile;
  eager: boolean;
  priority?: boolean;
  reduced: boolean;
}) {
  const [loaded, setLoaded] = useState(tile.kind === "video");
  // A search or filter rebuilds the wall and remounts every tile. An image the browser already has
  // must not fade in from zero again (the "blink", motion pass 2026-11-05): it mounts as loaded.
  const markIfCached = (img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
  };
  const [failed, setFailed] = useState(false);
  const dims = getImageDimensions(tile.src);
  if (failed) return null;
  return (
    <Link
      href={pieceHref(tile.slug, tile.src)}
      className="wall-tile"
      aria-label={tile.title}
      data-loaded={loaded}
      // The image's own dominant colour holds the place until it arrives (the palette Sanity computed).
      style={tile.color ? { background: tile.color } : undefined}
    >
      {tile.kind === "video" ? (
        <VideoTile tile={tile} reduced={reduced} />
      ) : (
        <img
          ref={markIfCached}
          src={getOptimizedImageUrl(tile.src, { width: 640, quality: 82 }) || tile.src}
          srcSet={buildImageSrcSet(tile.src, WIDTHS, { quality: 82 })}
          sizes={SIZES}
          alt=""
          width={dims?.width}
          height={dims?.height}
          style={{ aspectRatio: `${tile.ratio}` }}
          loading={eager ? "eager" : "lazy"}
          {...(priority ? PRIORITY_ATTRS : null)}
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
  const ask = useAsk();
  const columns = useColumns();
  const reduced = useReducedMotion();
  // The URL is the state: /?q=coffee+shop&sector=hospitality-travel is shareable.
  const search = useSearch();
  const filters = useMemo(() => filtersFromSearch(search), [search]);
  const urlQuery = useMemo(() => queryFromSearch(search), [search]);
  const [draft, setDraft] = useState(urlQuery);
  const [shown, setShown] = useState(PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  // Set after hydration. The fade-in on load only applies from then on, so the prerendered tiles
  // paint as soon as their bytes arrive instead of waiting for the bundle (site.css, [data-fade]).
  const [fade, setFade] = useState(false);
  useEffect(() => setFade(true), []);

  // One fresh shuffle per page load; the prerender (no window) keeps the site order.
  const [seed] = useState(() => (typeof window === "undefined" ? 0 : 1 + Math.floor(Math.random() * 2 ** 31)));
  const filtered = useMemo(() => projects.filter((project) => matchesFilters(project, filters)), [projects, filters]);

  // Typing narrows the wall as you go: the same ranking the search bar uses, in the browser.
  // No AI and no server call (JP, 2026-11-05): when nothing scores, the wall shows the closest work.
  const ranked = useMemo(() => {
    if (!urlQuery) return { projects: filtered, closest: false };
    return rankProjects(urlQuery, filtered) as { projects: SiteProjectT[]; closest: boolean };
  }, [urlQuery, filtered]);
  const sequence = useMemo(
    () => buildWallSequence(ranked.projects, seed, Boolean(urlQuery)),
    [ranked.projects, seed, urlQuery],
  );

  // Draft → URL after a short pause, so each keystroke does not rewrite history.
  useEffect(() => {
    if (draft === urlQuery) return;
    const timer = window.setTimeout(() => {
      window.history.replaceState(null, "", `${window.location.pathname}${searchFromFilters(filters, draft)}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
      setShown(PAGE);
    }, 220);
    return () => window.clearTimeout(timer);
  }, [draft, urlQuery, filters]);
  // The URL can change under us (Back, a link); keep the field in step.
  useEffect(() => setDraft(urlQuery), [urlQuery]);

  // bar_search: once per settled typed query, never per keystroke, and never for a ?q= the visitor
  // arrived with. Only whether it matched goes to analytics, never the text.
  const typed = useRef(false);
  const lastSearchEvent = useRef("");
  useEffect(() => {
    if (!typed.current || !urlQuery || urlQuery === lastSearchEvent.current) return;
    const closest = ranked.closest;
    const timer = window.setTimeout(() => {
      lastSearchEvent.current = urlQuery;
      trackBarSearch("results", closest);
    }, SEARCH_EVENT_SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [urlQuery, ranked.closest]);

  // The pool loops only once the visitor has seen all of it; each pass starts elsewhere.
  const tiles = useMemo(() => {
    const all: Array<WallTile & { key: string }> = [];
    if (sequence.length === 0) return all;
    // A search shows each piece once; only the open wall loops.
    const limit = urlQuery ? Math.min(shown, sequence.length) : shown;
    for (let pass = 0; all.length < limit; pass += 1) {
      for (const tile of wallPass(sequence, pass)) {
        if (all.length >= limit) break;
        all.push({ ...tile, key: `${pass}:${tile.src}` });
      }
    }
    return all;
  }, [sequence, shown, urlQuery]);
  const placed = useMemo(() => placeInColumns(tiles, columns), [tiles, columns]);
  const eagerKeys = useMemo(() => new Set(tiles.slice(0, eagerCount(columns)).map((tile) => tile.key)), [tiles, columns]);
  // Whether more exists past what is shown: a search ends with its last match; the open wall loops.
  const hasMore = sequence.length > 0 && (urlQuery ? shown < sequence.length : true);

  const changeFilters = (next: Filters) => {
    window.history.replaceState(null, "", `${window.location.pathname}${searchFromFilters(next, urlQuery)}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setShown(PAGE);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShown((current) => current + PAGE);
      },
      { rootMargin: "1200px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, shown]);

  if (projects.length === 0) return null;

  return (
    <section className="work-wall" aria-label="Work" data-fade={fade ? "" : undefined}>
      {urlQuery && ranked.closest && sequence.length > 0 ? (
        <p className="work-wall__note" aria-live="polite">
          {siteCopy.home.results.closest}
        </p>
      ) : null}
      {sequence.length === 0 ? (
        <p className="work-wall__empty" role="status">
          {siteCopy.home.results.empty}{" "}
          <Link href="/brief" className="site-link">
            {siteCopy.home.results.startBrief}
          </Link>
        </p>
      ) : (
        <div className="work-wall__columns" style={{ ["--wall-columns" as string]: columns }}>
          {placed.map((column, index) => (
            <div className="work-wall__column" key={index}>
              {column.map((tile) => (
                <Tile
                  key={tile.key}
                  tile={tile}
                  eager={eagerKeys.has(tile.key)}
                  priority={eagerKeys.has(tile.key)}
                  reduced={reduced}
                />
              ))}
            </div>
          ))}
        </div>
      )}
      <div ref={sentinelRef} aria-hidden="true" />
      <WorkExplore
        tools={tiles.some((tile) => tile.kind === "video") ? <MotionToggle /> : null}
        query={draft}
        onQuery={(value) => {
          typed.current = true;
          setDraft(value);
        }}
        onClear={() => {
          setDraft("");
          changeFilters({ ...filters, sector: ALL_VALUE, discipline: ALL_VALUE, place: ALL_VALUE, year: ALL_VALUE });
        }}
        activeCount={activeFilterCount(filters)}
        visible
        ask={{
          available: ask.available,
          pending: ask.pending,
          onOpen: ask.probe,
          onAsk: ask.send,
          panel: (send) => (
            <AskPanel
              turns={ask.turns}
              pending={ask.pending}
              partial={ask.partial}
              projects={projects}
              onAsk={send}
              onRestart={ask.restart}
            />
          ),
        }}
      >
        <WorkFilters projects={projects} filters={filters} onChange={changeFilters} />
      </WorkExplore>
    </section>
  );
}
