import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
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
 * Only the tiles of the first viewport load eagerly (perf-network 2: 88 image requests starved the entry
 * script). At most 8 on a desktop and 4 on the phone; one of them, the first, asks for high priority.
 * Everything else is lazy. The prerender has no window and measures a 375 x 812 phone.
 */
export const EAGER_MAX_DESKTOP = 8;
export const EAGER_MAX_PHONE = 4;
const HEADER_HEIGHT = 64;
const PRERENDER_VIEWPORT = { width: 375, height: 812 };

function wallGap(width: number) {
  return width >= 1200 ? 24 : width >= 768 ? 20 : 16;
}

/**
 * The keys of the tiles that start inside the first viewport, in reading order, capped. Heights are in
 * column widths (1 / ratio), the same unit placeInColumns uses, so nothing is measured in the DOM.
 */
export function firstViewportKeys<T extends { ratio: number; key: string }>(
  placed: T[][],
  order: T[],
  columns: number,
  viewport: { width: number; height: number } = typeof window === "undefined"
    ? PRERENDER_VIEWPORT
    : { width: window.innerWidth, height: window.innerHeight },
): Set<string> {
  const cap = columns <= 2 ? EAGER_MAX_PHONE : EAGER_MAX_DESKTOP;
  const gap = wallGap(viewport.width);
  const columnWidth = Math.max(1, (viewport.width - gap * (Math.max(1, columns) + 1)) / Math.max(1, columns));
  const limit = Math.max(0, viewport.height - HEADER_HEIGHT) / columnWidth;
  const inView = new Set<string>();
  for (const column of placed) {
    let top = 0;
    for (const tile of column) {
      if (top >= limit) break;
      inView.add(tile.key);
      top += 1 / tile.ratio + gap / columnWidth;
    }
  }
  const keys = new Set<string>();
  for (const tile of order) {
    if (keys.size >= cap) break;
    if (inView.has(tile.key)) keys.add(tile.key);
  }
  return keys;
}
/** How many pieces one pass shows at most; the next pass arrives as the visitor nears the end. */
const PAGE = 72;
/**
 * The open wall stops after three passes and the footer comes out (JP, 2026-11-06: "el muro para y sale
 * el footer"), so Privacy, Terms and the cookies control are reachable from the home. After that a
 * quiet "More work" link adds one pass at a time. A search is finite and ends with its last match.
 */
export const AUTO_PASSES = 3;
/** The placeholder grid while /api/projects loads: colour blocks in the wall's rhythm, no images. */
const PLACEHOLDER_RATIOS = [1.5, 0.8, 1.25, 0.75, 1.33, 1, 0.8, 1.5, 0.75, 1.25, 1, 1.33];
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

/** Hydration-safe: the first client render matches the server (2 columns), the real count lands before paint. */
function useColumns() {
  const [columns, setColumns] = useState(2);
  useLayoutEffect(() => {
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

/**
 * Exported for tests. Memoized: a wall re-render (typing in Explore) leaves every settled tile alone.
 */
export const Tile = memo(function Tile({
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
});

/**
 * The Explore pill with Ask. It owns the Ask conversation, so a streamed token re-renders this subtree
 * (the pill and the panel) and never the wall (perf-frontend 1).
 */
function WallExplore({
  projects,
  tools,
  query,
  onQuery,
  onClear,
  activeCount,
  visible,
  children,
}: {
  projects: SiteProjectT[];
  tools: ReactNode;
  query: string;
  onQuery: (value: string) => void;
  onClear: () => void;
  activeCount: number;
  visible: boolean;
  children: ReactNode;
}) {
  const ask = useAsk();
  return (
    <WorkExplore
      tools={tools}
      query={query}
      onQuery={onQuery}
      onClear={onClear}
      activeCount={activeCount}
      visible={visible}
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
            onRetry={ask.retry}
            onRestart={ask.restart}
          />
        ),
      }}
    >
      {children}
    </WorkExplore>
  );
}

/** The pill hides while the footer is on screen, so it never sits on Privacy, Terms or the cookies control. */
function useFooterInView(enabled: boolean) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return setInView(false);
    const footer = document.querySelector(".site-footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, [enabled]);
  return inView;
}

/** The home: the work, from the first pixel. Fixed columns, native ratios, the whole gallery. */
export function WorkWall() {
  const { projects } = useSiteProjects();
  // The same query useSiteProjects reads (one cache entry, no second request): here for its states.
  const { isPending, isError, refetch, isFetching } = useQuery({ queryKey: ["/api/projects"] });
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

  // One fresh shuffle per page load. The first client render keeps the server's order (seed 0) so
  // hydration matches; the seed changes in a layout effect, before the first paint.
  const [seed, setSeed] = useState(0);
  useLayoutEffect(() => {
    setSeed(1 + Math.floor(Math.random() * 2 ** 31));
  }, []);
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
  const eagerKeys = useMemo(() => firstViewportKeys(placed, tiles, columns), [placed, tiles, columns]);
  const priorityKey = tiles[0]?.key;
  // Whether more exists past what is shown: a search ends with its last match; the open wall loops.
  const hasMore = sequence.length > 0 && (urlQuery ? shown < sequence.length : true);
  // A search loads to its end on its own; the open wall stops after three passes.
  const autoLoad = hasMore && (urlQuery ? true : shown < PAGE * AUTO_PASSES);
  // Watched once the wall has stopped (or never started: loading, an error), when the footer can show.
  const footerInView = useFooterInView(projects.length === 0 || !autoLoad);

  const changeFilters = (next: Filters) => {
    window.history.replaceState(null, "", `${window.location.pathname}${searchFromFilters(next, urlQuery)}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setShown(PAGE);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !autoLoad) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShown((current) => current + PAGE);
      },
      { rootMargin: "1200px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [autoLoad, shown]);

  const clearAll = () => {
    setDraft("");
    changeFilters({ ...filters, sector: ALL_VALUE, discipline: ALL_VALUE, place: ALL_VALUE, year: ALL_VALUE });
  };
  const onQuery = (value: string) => {
    typed.current = true;
    setDraft(value);
  };

  if (projects.length === 0) {
    // No list yet: a placeholder grid while it loads, one line and Try again if it failed. The pill stays.
    const failed = isError && !isFetching;
    return (
      <section className="work-wall" aria-label="Work" aria-busy={failed ? undefined : true}>
        {failed ? (
          <p className="work-wall__error" role="alert">
            {siteCopy.home.results.error}{" "}
            <button type="button" className="site-link work-wall__retry" onClick={() => void refetch()}>
              {siteCopy.home.results.retry}
            </button>
          </p>
        ) : isPending || isFetching ? (
          <>
            <p className="site-sr" role="status">
              {siteCopy.home.loading}
            </p>
            <div className="work-wall__columns" aria-hidden="true" style={{ ["--wall-columns" as string]: columns }}>
              {Array.from({ length: columns }, (_, column) => (
                <div className="work-wall__column" key={column}>
                  {Array.from({ length: 6 }, (_, row) => (
                    <span
                      key={row}
                      className="wall-tile wall-tile--placeholder"
                      style={{ aspectRatio: `${PLACEHOLDER_RATIOS[(column * 5 + row * 3) % PLACEHOLDER_RATIOS.length]}` }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : null}
        <WallExplore
          projects={projects}
          tools={null}
          query={draft}
          onQuery={onQuery}
          onClear={clearAll}
          activeCount={activeFilterCount(filters)}
          visible={!footerInView}
        >
          {null}
        </WallExplore>
      </section>
    );
  }

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
                  priority={tile.key === priorityKey}
                  reduced={reduced}
                />
              ))}
            </div>
          ))}
        </div>
      )}
      <div ref={sentinelRef} aria-hidden="true" />
      {hasMore && !autoLoad ? (
        <div className="work-wall__more">
          <button type="button" className="site-link work-wall__more-link" onClick={() => setShown((current) => current + PAGE)}>
            {siteCopy.home.results.more}
          </button>
        </div>
      ) : null}
      <WallExplore
        projects={projects}
        tools={tiles.some((tile) => tile.kind === "video") ? <MotionToggle /> : null}
        query={draft}
        onQuery={onQuery}
        onClear={clearAll}
        activeCount={activeFilterCount(filters)}
        visible={!footerInView}
      >
        <WorkFilters projects={projects} filters={filters} onChange={changeFilters} />
      </WallExplore>
    </section>
  );
}
