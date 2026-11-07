import { useMemo } from "react";
import { siteCopy } from "@/content/siteCopy";
import type { SiteProject } from "@/components/site/siteProjects";
import {
  DISCIPLINES,
  DISCIPLINE_ON_ALL,
  PLACES,
  SECTORS,
  facetSlug,
  matchFacetValue,
} from "@shared/projectFacets";

const { home } = siteCopy;

/**
 * The Explore panel's four groups (proposal 3.2, approved 2026-11-05): Sector, Discipline,
 * Place, Year. Options come from the controlled lists in shared/projectFacets.ts, in their
 * fixed order, showing only the values some project carries. Stage is not a group (three
 * values, one of them on nearly every project); it stays in search and on the project line.
 */
export const ALL = home.filters.all;

export type Filters = { sector: string; discipline: string; place: string; year: string };
export const NO_FILTERS: Filters = { sector: ALL, discipline: ALL, place: ALL, year: ALL };

const FILTER_KEYS: Array<keyof Filters> = ["sector", "discipline", "place", "year"];

/**
 * The URL keys and values the site used before the facets (Region, Industry, Service), so a
 * shared or indexed link still lands on the nearest filter. Unknown values are dropped.
 */
const LEGACY_KEYS: Record<string, { key: keyof Filters; values: Record<string, string> }> = {
  industry: {
    key: "sector",
    values: {
      hospitality: "Hospitality & Travel",
      "food-beverage": "Food & Drink",
      "consumer-goods": "Food & Drink",
      saas: "Technology & Digital",
      digital: "Technology & Digital",
    },
  },
  service: {
    key: "discipline",
    values: { branding: "Brand Identity", "art-direction": "Art Direction", packaging: "Packaging", website: "Website" },
  },
  region: {
    key: "place",
    values: { america: "United States", europe: "International", asia: "International", "middle-east": "Middle East" },
  },
};

/** "All", then the list values that at least one project carries, in list order. */
export function buildFacetOptions(values: string[], list: readonly string[], hide: readonly string[] = []) {
  const present = new Set(values.map((value) => facetSlug(value)));
  return [ALL, ...list.filter((value) => !hide.includes(value) && present.has(facetSlug(value)))];
}

function yearOptions(projects: SiteProject[]) {
  return [ALL, ...Array.from(new Set(projects.map((p) => p.year).filter(Boolean))).sort((a, b) => b - a).map(String)];
}

/** The joint value is not a place a visitor picks: it answers to both of its countries. */
const BOTH_PLACE = "United States & Mexico";
const BOTH_PLACES = ["United States", "Mexico"];

/** What a place value is called on the page: "International" tells a visitor nothing. */
const PLACE_LABELS: Record<string, string> = { International: "Other countries" };
export const placeLabel = (place: string) => PLACE_LABELS[place] ?? place;

export function matchesFilters(project: SiteProject, filters: Filters) {
  if (filters.sector !== ALL && project.sector !== filters.sector) return false;
  if (filters.discipline !== ALL && !project.disciplines.includes(filters.discipline)) return false;
  if (filters.place !== ALL && project.place !== filters.place) {
    // A project in both countries shows under each of them.
    if (!(project.place === BOTH_PLACE && BOTH_PLACES.includes(filters.place))) return false;
  }
  if (filters.year !== ALL && String(project.year) !== filters.year) return false;
  return true;
}

/** A URL value → the list value it names (`food-drink` or `Food & Drink`); years pass through; unknown is "". */
function parseFilterValue(key: keyof Filters, raw: string): string {
  if (key === "year") return /^\d{4}$/.test(raw) ? raw : "";
  if (key === "sector") return matchFacetValue(SECTORS, raw);
  if (key === "discipline") return matchFacetValue(DISCIPLINES, raw);
  return matchFacetValue(PLACES, raw);
}

/** `/?sector=food-drink&year=2025` → Filters. Old keys (industry, service, region) are aliases; unknown values are ignored. */
export function filtersFromSearch(search: string): Filters {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const filters = { ...NO_FILTERS };
  for (const [legacyKey, { key, values }] of Object.entries(LEGACY_KEYS)) {
    const raw = params.get(legacyKey)?.trim();
    const value = raw ? values[facetSlug(raw)] : "";
    if (value) filters[key] = value;
  }
  for (const key of FILTER_KEYS) {
    const raw = params.get(key)?.trim();
    const value = raw ? parseFilterValue(key, raw) : "";
    if (value) filters[key] = value;
  }
  return filters;
}

/** The typed search (`?q=coffee shop`), trimmed; "" when absent. */
export function queryFromSearch(search: string): string {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return (params.get("q") ?? "").trim().slice(0, 120);
}

/** Filters and query → the query string for the wall, "" when nothing is active. Values travel as slugs. */
export function searchFromFilters(filters: Filters, query = ""): string {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  for (const key of FILTER_KEYS) {
    if (filters[key] !== ALL) params.set(key, key === "year" ? filters[key] : facetSlug(filters[key]));
  }
  const out = params.toString();
  return out ? `?${out}` : "";
}

/** `/?sector=food-drink`: the wall filtered to one facet value, for the project page's facet line. */
export function wallHrefFor(key: keyof Filters, value: string) {
  return `/${searchFromFilters({ ...NO_FILTERS, [key]: value })}`;
}

/** The four facets with their values, for the header peek and the Explore panel. */
export function facetOptions(projects: SiteProject[]) {
  return {
    sector: buildFacetOptions(projects.map((p) => p.sector), SECTORS),
    discipline: buildFacetOptions(projects.flatMap((p) => p.disciplines), DISCIPLINES, [DISCIPLINE_ON_ALL]),
    place: buildFacetOptions(projects.map((p) => p.place), PLACES, [BOTH_PLACE]),
    year: yearOptions(projects),
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
  labelFor,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  labelFor?: (option: string) => string;
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
            {labelFor ? labelFor(option) : option}
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
  const options = useMemo(() => facetOptions(projects), [projects]);
  const set = (key: keyof Filters) => (value: string) => onChange({ ...filters, [key]: value });

  return (
    <div className="site-filters">
      <FilterGroup label={home.filters.sector} options={options.sector} value={filters.sector} onChange={set("sector")} />
      <FilterGroup label={home.filters.discipline} options={options.discipline} value={filters.discipline} onChange={set("discipline")} />
      <FilterGroup label={home.filters.place} options={options.place} value={filters.place} onChange={set("place")} labelFor={placeLabel} />
      <FilterGroup label={home.filters.year} options={options.year} value={filters.year} onChange={set("year")} />
    </div>
  );
}
