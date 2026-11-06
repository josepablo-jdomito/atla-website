import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link, useSearch } from "wouter";
import { useSiteProjects, type SiteProject as SiteProjectT } from "@/components/site/siteProjects";
import { assetKey, buildWallSequence, listDrift, wallCells, wallPass, type WallTile } from "@/components/site/wallLayout";
import { WorkExplore } from "@/components/site/WorkExplore";
import { PRIORITY_ATTRS, useInViewPlayback } from "@/components/site/media";
import {
  WorkFilters,
  filtersFromSearch,
  matchesFilters,
  queryFromSearch,
  searchFromFilters,
  viewFromSearch,
  type Filters,
  type WorkView,
} from "@/components/site/workFilters";
import { rankProjects } from "@shared/rankProjects";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { trackBarSearch } from "@/lib/ga";
import { siteCopy } from "@/content/siteCopy";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";

const WIDTHS = [320, 480, 640, 800, 1000, 1280];
/** Square cards: a quarter of the page from 1200, a third on tablets, the full width on phones. */
const SIZES = "(min-width: 1200px) 25vw, (min-width: 768px) 33vw, 100vw";
/** The first pieces load eagerly (about one phone screen and most of a desktop one); the rest wait for the scroll. */
const EAGER = 8;
/** The first few of those win the network race (fetchpriority="high"). */
const PRIORITY = 3;
/** How many pieces one pass shows at most; the next pass arrives as the visitor nears the end. */
const PAGE = 72;
/**
 * Auto-loading stops after this many passes so the footer can be reached (critique H2, 2026-11-05).
 * After that a quiet "More" text link loads one pass at a time.
 */
const AUTO_PASSES = 3;
/** A typed search counts once it has rested this long (after the URL debounce). */
const SEARCH_EVENT_SETTLE_MS = 1000;

/**
 * The Figma frames: 4 columns from 1200 (1200w), 3 on tablets (810w), 1 on phones (390w).
 * Prerender has no window and renders the phone layout.
 */
function readColumns() {
  if (typeof window === "undefined") return 1;
  const width = window.innerWidth;
  if (width < 768) return 1;
  return width < 1200 ? 3 : 4;
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
    />
  );
}

/** The link into the project, landing on this very piece (`?at=`). */
function tileHref(tile: Pick<WallTile, "slug" | "src">) {
  return `/projects/${tile.slug}?at=${encodeURIComponent(assetKey(tile.src))}`;
}

/** One card (Figma 4423:1934): the piece as a square, then the project title in stone. Exported for tests. */
export function Tile({
  tile,
  eager,
  priority = false,
  reduced,
  style,
}: {
  tile: WallTile;
  eager: boolean;
  priority?: boolean;
  reduced: boolean;
  style?: CSSProperties;
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
    <Link href={tileHref(tile)} className="wall-tile" data-loaded={loaded} style={style}>
      <span className="wall-tile__media">
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
            loading={eager ? "eager" : "lazy"}
            {...(priority ? PRIORITY_ATTRS : null)}
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}
      </span>
      <span className="wall-tile__title">{tile.title}</span>
    </Link>
  );
}

/** One List row (Figma 4564:3536): a 200 px square drifting across the row, then name, service, year. */
function ListRow({ project, tile, drift, eager }: { project: SiteProjectT; tile: WallTile; drift: number; eager: boolean }) {
  const image = tile.kind === "video" ? tile.poster || project.coverImage : tile.src;
  return (
    <li>
      <Link href={tileHref(tile)} className="work-row">
        <span className="work-row__track" aria-hidden="true">
          <span className="work-row__thumb" style={{ ["--drift" as string]: drift }}>
            <img
              src={getOptimizedImageUrl(image, { width: 400, height: 400, fit: "crop", quality: 82 }) || image}
              alt=""
              width={200}
              height={200}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
            />
          </span>
        </span>
        <span className="work-row__text">
          <span className="work-row__name">{project.title}</span>
          <span className="work-row__service">{project.service}</span>
          {/* The month is JP's design; projects only carry a year today, so the year alone shows. */}
          <span className="work-row__date">{project.year ? `( ${project.year} )` : ""}</span>
        </span>
      </Link>
    </li>
  );
}

/** The home: the filter index, then the work as Masonry, Grid or List. */
export function WorkWall() {
  const { projects } = useSiteProjects();
  const columns = useColumns();
  const reduced = useReducedMotion();
  // The URL is the state: /?q=coffee+shop&industry=Hospitality&view=list is shareable.
  const search = useSearch();
  const filters = useMemo(() => filtersFromSearch(search), [search]);
  const urlQuery = useMemo(() => queryFromSearch(search), [search]);
  const view = useMemo(() => viewFromSearch(search), [search]);
  const [draft, setDraft] = useState(urlQuery);
  const [shown, setShown] = useState(PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // The Explore pill floats only while the index fills the bottom of the screen, so it never sits on the footer.
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "-90% 0px 0px 0px",
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, [projects.length > 0]);
  // Set after hydration. The fade-in on load only applies from then on, so the prerendered tiles
  // paint as soon as their bytes arrive instead of waiting for the bundle (site.css, [data-fade]).
  const [fade, setFade] = useState(false);
  useEffect(() => setFade(true), []);

  // One fresh shuffle per page load; the prerender (no window) keeps the site order and the Figma layout.
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

  const writeUrl = (next: Filters, query: string, nextView: WorkView) => {
    window.history.replaceState(null, "", `${window.location.pathname}${searchFromFilters(next, query, nextView)}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Draft → URL after a short pause, so each keystroke does not rewrite history.
  useEffect(() => {
    if (draft === urlQuery) return;
    const timer = window.setTimeout(() => {
      writeUrl(filters, draft, view);
      setShown(PAGE);
    }, 220);
    return () => window.clearTimeout(timer);
  }, [draft, urlQuery, filters, view]);
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
  const cells = useMemo(
    () => wallCells(tiles.length, columns, view === "grid" ? "grid" : "masonry", seed),
    [tiles.length, columns, view, seed],
  );

  // List: one row per project, in the order this load dealt them, each with the first piece it drew.
  const rows = useMemo(() => {
    const bySlug = new Map(ranked.projects.map((project) => [project.slug, project]));
    const seen = new Set<string>();
    const out: Array<{ project: SiteProjectT; tile: WallTile }> = [];
    for (const tile of sequence) {
      const project = bySlug.get(tile.slug);
      if (!project || seen.has(tile.slug)) continue;
      seen.add(tile.slug);
      out.push({ project, tile });
    }
    return out;
  }, [sequence, ranked.projects]);
  const drift = useMemo(() => listDrift(rows.length, seed), [rows.length, seed]);

  // Whether more exists past what is shown: a search ends with its last match; the open wall loops.
  const hasMore = view !== "list" && sequence.length > 0 && (urlQuery ? shown < sequence.length : true);
  const autoLoad = hasMore && shown < PAGE * AUTO_PASSES;

  const changeFilters = (next: Filters) => {
    writeUrl(next, urlQuery, view);
    setShown(PAGE);
  };
  const changeView = (next: WorkView) => {
    writeUrl(filters, urlQuery, next);
    setShown(PAGE);
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

  if (projects.length === 0) return null;

  return (
    <section ref={sectionRef} className="work-index" aria-label="Work">
      <WorkFilters projects={projects} filters={filters} onChange={changeFilters} view={view} onView={changeView} />
      <div className="work-wall" data-view={view} data-fade={fade ? "" : undefined}>
        {urlQuery && ranked.closest && sequence.length > 0 ? (
          <p className="work-wall__note" aria-live="polite">
            {siteCopy.home.results.closest}
          </p>
        ) : null}
        {sequence.length === 0 ? (
          <p className="work-wall__empty">{siteCopy.home.results.empty}</p>
        ) : view === "list" ? (
          <ol className="work-list">
            {rows.map((row, index) => (
              <ListRow key={row.project.slug} project={row.project} tile={row.tile} drift={drift[index]} eager={index < 4} />
            ))}
          </ol>
        ) : (
          <div className="work-grid" style={{ ["--wall-columns" as string]: columns }}>
            {tiles.map((tile, index) => (
              <Tile
                key={tile.key}
                tile={tile}
                eager={index < EAGER}
                priority={index < PRIORITY}
                reduced={reduced}
                style={{ gridRow: cells[index].row + 1, gridColumn: cells[index].col + 1 }}
              />
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
      </div>
      <WorkExplore
        query={draft}
        onQuery={(value) => {
          typed.current = true;
          setDraft(value);
        }}
        visible={inView}
      />
    </section>
  );
}
