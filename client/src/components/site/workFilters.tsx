import { useId, useMemo } from "react";
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

/** The typed search (`?q=coffee shop`), trimmed; "" when absent. */
export function queryFromSearch(search: string): string {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return (params.get("q") ?? "").trim().slice(0, 120);
}

/** The three ways to see the work (Figma `( VIEW )`). Masonry is the default and stays out of the URL. */
export const VIEWS = ["masonry", "grid", "list"] as const;
export type WorkView = (typeof VIEWS)[number];

/** `?view=grid` → "grid"; anything else → "masonry". */
export function viewFromSearch(search: string): WorkView {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const value = params.get("view");
  return (VIEWS as readonly string[]).includes(value ?? "") ? (value as WorkView) : "masonry";
}

/** Filters, query and view → the query string for the wall, "" when nothing is active. */
export function searchFromFilters(filters: Filters, query = "", view: WorkView = "masonry"): string {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  for (const key of FILTER_KEYS) if (filters[key] !== ALL) params.set(key, filters[key]);
  if (view !== "masonry") params.set("view", view);
  const out = params.toString();
  return out ? `?${out}` : "";
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
  display = (option) => option,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  display?: (option: string) => string;
}) {
  const id = useId();
  return (
    <div className="site-filter" role="group" aria-labelledby={id}>
      <p id={id} className="site-filter__label">
        ( {label} )
      </p>
      <div className="site-filter__options">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className="site-filter__option"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {display(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The filter index under the navbar (Figma 4423:1871): Region, Industry, Service, then View.
 * Options are text; the active one is ink, the rest stone. Facet values come from the projects on
 * the page, so no option ever empties the wall. Year stays readable from the URL but has no column.
 */
export function WorkFilters({
  projects,
  filters,
  onChange,
  view,
  onView,
}: {
  projects: SiteProject[];
  filters: Filters;
  onChange: (filters: Filters) => void;
  view: WorkView;
  onView: (view: WorkView) => void;
}) {
  const industryOptions = useMemo(() => buildFacetOptions(projects.map((p) => p.industry), INDUSTRY_ORDER), [projects]);
  const serviceOptions = useMemo(() => buildFacetOptions(projects.map((p) => p.service), SERVICE_ORDER), [projects]);
  const set = (key: keyof Filters) => (value: string) => onChange({ ...filters, [key]: value });

  return (
    <nav className="work-filters" aria-label={home.filtersLabel}>
      <FilterGroup label={home.filters.region} options={REGION_OPTIONS} value={filters.region} onChange={set("region")} />
      <FilterGroup label={home.filters.industry} options={industryOptions} value={filters.industry} onChange={set("industry")} />
      <FilterGroup label={home.filters.service} options={serviceOptions} value={filters.service} onChange={set("service")} />
      <FilterGroup
        label={home.filters.view}
        options={VIEWS}
        value={view}
        onChange={(value) => onView(value as WorkView)}
        display={(option) => home.views[option as WorkView]}
      />
    </nav>
  );
}
