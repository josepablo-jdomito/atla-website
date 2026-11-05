import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { siteCopy } from "@/content/siteCopy";
import { WorkExplore } from "@/components/site/WorkExplore";
import { useSiteProjects, type SiteProject } from "@/components/site/siteProjects";
import { useIsMobile } from "@/hooks/use-mobile";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";

const { home } = siteCopy;

// Filter facets, ported from PR #31 (commit 0d674e8, AtlaWork.tsx).
const ALL = home.filters.all;
const REGION_OPTIONS = [ALL, "America", "Europe", "Asia", "Middle East"] as const;
const INDUSTRY_ORDER = ["Hospitality", "Food & Beverage", "Consumer Goods", "SaaS", "Digital"] as const;
const SERVICE_ORDER = ["Branding", "Art Direction", "Packaging", "Website"] as const;
const BATCH = { desktop: 24, mobile: 12 };
const HEADER_OFFSET = 64;
const ARCHIVE_WIDTHS = [240, 360, 480, 640, 800];

type Filters = { region: string; industry: string; service: string; year: string };
const NO_FILTERS: Filters = { region: ALL, industry: ALL, service: ALL, year: ALL };

type Tile = { key: string; slug: string; title: string; src: string };

function uniqueCaseInsensitive(values: string[]) {
  const seen = new Map<string, string>();
  for (const raw of values) {
    const value = raw.trim();
    if (value && !seen.has(value.toLowerCase())) seen.set(value.toLowerCase(), value);
  }
  return Array.from(seen.values());
}

/** "All", then the preferred order, then anything else alphabetically. "Unspecified" is never a choice. */
export function buildFacetOptions(values: string[], preferredOrder: readonly string[]) {
  const present = uniqueCaseInsensitive(values).filter((value) => value.toLowerCase() !== "unspecified");
  const has = (wanted: string) => present.some((value) => value.toLowerCase() === wanted.toLowerCase());
  const ordered = preferredOrder.filter(has);
  const rest = present
    .filter((value) => !preferredOrder.some((preferred) => preferred.toLowerCase() === value.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
  return [ALL, ...ordered, ...rest];
}

export function matchesFilters(project: SiteProject, filters: Filters) {
  if (filters.region !== ALL && project.region !== filters.region) return false;
  if (filters.industry !== ALL && project.industry !== filters.industry) return false;
  if (filters.service !== ALL && project.service !== filters.service) return false;
  if (filters.year !== ALL && String(project.year) !== filters.year) return false;
  return true;
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

/** Every image of every project, in a stable shuffled order (same hash as PR #31). */
function buildTiles(projects: SiteProject[]): Tile[] {
  const tiles = projects.flatMap((project) =>
    [project.coverImage, ...project.images].map((src, index) => ({
      key: `${project.slug}-${index}-${src}`,
      slug: project.slug,
      title: project.title,
      src,
    })),
  );
  return tiles.sort((a, b) => hashString(`${a.slug}-${a.key}`) - hashString(`${b.slug}-${b.key}`));
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="site-filter">
      <legend className="site-filter__label">{label}</legend>
      <div className="site-filter__options">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className="site-filter__option"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function ArchiveTile({ tile }: { tile: Tile }) {
  const [failed, setFailed] = useState(false);
  const dimensions = getImageDimensions(tile.src);
  if (failed) return null;
  return (
    <Link href={`/projects/${tile.slug}`} className="archive-tile" aria-label={tile.title}>
      <img
        src={getOptimizedImageUrl(tile.src, { width: 640, quality: 80 }) || tile.src}
        srcSet={buildImageSrcSet(tile.src, ARCHIVE_WIDTHS, { quality: 80 })}
        sizes="(min-width: 768px) 25vw, 50vw"
        alt=""
        width={dimensions?.width}
        height={dimensions?.height}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </Link>
  );
}

/** The full archive: a 4-column masonry (2 on phones) with the Explore filters from PR #31. */
export function Archive() {
  const { projects } = useSiteProjects();
  const isMobile = useIsMobile();
  const batch = isMobile ? BATCH.mobile : BATCH.desktop;
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [count, setCount] = useState(batch);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const industryOptions = useMemo(() => buildFacetOptions(projects.map((p) => p.industry), INDUSTRY_ORDER), [projects]);
  const serviceOptions = useMemo(() => buildFacetOptions(projects.map((p) => p.service), SERVICE_ORDER), [projects]);
  const yearOptions = useMemo(
    () => [ALL, ...Array.from(new Set(projects.map((p) => p.year).filter(Boolean))).sort((a, b) => b - a).map(String)],
    [projects],
  );
  const filtered = useMemo(() => projects.filter((project) => matchesFilters(project, filters)), [projects, filters]);
  const tiles = useMemo(() => buildTiles(filtered), [filtered]);
  const visibleTiles = tiles.slice(0, count);
  const hasProjects = projects.length > 0;
  const activeCount = Object.values(filters).filter((value) => value !== ALL).length;

  const setFilter = (key: keyof Filters) => (value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setCount(batch);
    // A shorter archive would leave a visitor deep in the page looking at the footer: bring its top back.
    const top = sectionRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollTo({ top: window.scrollY + top - HEADER_OFFSET });
  };

  // The Explore pill belongs to the archive: show it only while the archive is on screen.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "0px 0px -40% 0px",
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, [hasProjects]);

  // Load the next batch as the end of the masonry nears.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || count >= tiles.length) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCount((current) => current + batch);
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [batch, count, tiles.length]);

  if (!hasProjects) return null;

  return (
    <section ref={sectionRef} className="archive" aria-labelledby="archive-label">
      <div className="home-section-head">
        <h2 id="archive-label" className="home-section-label">
          {home.archiveLabel}
        </h2>
        <p className="home-section-count">{home.project(filtered.length)}</p>
      </div>
      <div className="archive-masonry">
        {visibleTiles.map((tile) => (
          <ArchiveTile key={tile.key} tile={tile} />
        ))}
      </div>
      <div ref={sentinelRef} aria-hidden="true" />
      {count < tiles.length ? (
        <div className="archive-more">
          <button type="button" className="site-link" onClick={() => setCount((current) => current + batch)}>
            {home.showMore}
          </button>
        </div>
      ) : null}
      <WorkExplore activeCount={activeCount} resultCount={filtered.length} visible={inView}>
        <div className="site-filters">
          <FilterGroup label={home.filters.region} options={REGION_OPTIONS} value={filters.region} onChange={setFilter("region")} />
          <FilterGroup label={home.filters.industry} options={industryOptions} value={filters.industry} onChange={setFilter("industry")} />
          <FilterGroup label={home.filters.service} options={serviceOptions} value={filters.service} onChange={setFilter("service")} />
          <FilterGroup label={home.filters.year} options={yearOptions} value={filters.year} onChange={setFilter("year")} />
        </div>
      </WorkExplore>
    </section>
  );
}
