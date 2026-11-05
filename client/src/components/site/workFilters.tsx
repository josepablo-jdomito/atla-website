import { useMemo } from "react";
import { siteCopy } from "@/content/siteCopy";
import type { SiteProject } from "@/components/site/siteProjects";

const { home } = siteCopy;

// Filter facets, ported from PR #31 (commit 0d674e8, AtlaWork.tsx).
export const ALL = home.filters.all;
const REGION_OPTIONS = [ALL, "America", "Europe", "Asia", "Middle East"] as const;
const INDUSTRY_ORDER = ["Hospitality", "Food & Beverage", "Consumer Goods", "SaaS", "Digital"] as const;
const SERVICE_ORDER = ["Branding", "Art Direction", "Packaging", "Website"] as const;

export type Filters = { region: string; industry: string; service: string; year: string };
export const NO_FILTERS: Filters = { region: ALL, industry: ALL, service: ALL, year: ALL };

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

const FILTER_KEYS: Array<keyof Filters> = ["region", "industry", "service", "year"];

/** `/?industry=Hospitality&year=2025` → Filters. Unknown keys and empty values are ignored. */
export function filtersFromSearch(search: string): Filters {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const filters = { ...NO_FILTERS };
  for (const key of FILTER_KEYS) {
    const value = params.get(key)?.trim();
    if (value) filters[key] = value;
  }
  return filters;
}

/** Filters → the query string for the wall, "" when nothing is active. */
export function searchFromFilters(filters: Filters): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) if (filters[key] !== ALL) params.set(key, filters[key]);
  const query = params.toString();
  return query ? `?${query}` : "";
}

/** The four facets with their values, for the header peek and the Explore panel. */
export function facetOptions(projects: SiteProject[]) {
  return {
    region: [...REGION_OPTIONS],
    industry: buildFacetOptions(projects.map((p) => p.industry), INDUSTRY_ORDER),
    service: buildFacetOptions(projects.map((p) => p.service), SERVICE_ORDER),
    year: [ALL, ...Array.from(new Set(projects.map((p) => p.year).filter(Boolean))).sort((a, b) => b - a).map(String)],
  };
}

export function activeFilterCount(filters: Filters) {
  return Object.values(filters).filter((value) => value !== ALL).length;
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

/** The four facet groups, built from the projects on the page. */
export function WorkFilters({
  projects,
  filters,
  onChange,
}: {
  projects: SiteProject[];
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const industryOptions = useMemo(() => buildFacetOptions(projects.map((p) => p.industry), INDUSTRY_ORDER), [projects]);
  const serviceOptions = useMemo(() => buildFacetOptions(projects.map((p) => p.service), SERVICE_ORDER), [projects]);
  const yearOptions = useMemo(
    () => [ALL, ...Array.from(new Set(projects.map((p) => p.year).filter(Boolean))).sort((a, b) => b - a).map(String)],
    [projects],
  );
  const set = (key: keyof Filters) => (value: string) => onChange({ ...filters, [key]: value });

  return (
    <div className="site-filters">
      <FilterGroup label={home.filters.region} options={REGION_OPTIONS} value={filters.region} onChange={set("region")} />
      <FilterGroup label={home.filters.industry} options={industryOptions} value={filters.industry} onChange={set("industry")} />
      <FilterGroup label={home.filters.service} options={serviceOptions} value={filters.service} onChange={set("service")} />
      <FilterGroup label={home.filters.year} options={yearOptions} value={filters.year} onChange={set("year")} />
    </div>
  );
}
