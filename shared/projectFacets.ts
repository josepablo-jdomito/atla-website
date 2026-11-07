/**
 * The project facets (docs/superpowers/specs/2026-11-05-project-tags-proposal.md, approved by
 * JP on 2026-11-05): four controlled lists set by hand in Sanity (Sector, Discipline, Stage,
 * plus hidden search terms) and Place, which is derived from `country` here and never stored.
 *
 * Until the Sanity migration runs (script/migrate-project-facets.ts, on JP's «mándalo»), a
 * project document has none of the new fields. `resolveProjectFacets` then falls back to the
 * table in section 4 of the proposal, keyed by slug, so the site is right before the data is.
 * Shared by the server (/api/projects, /api/ask), the client and the build; no dependencies.
 */

export const SECTORS = [
  "Hospitality & Travel",
  "Food & Drink",
  "Health & Wellness",
  "Fashion & Lifestyle",
  "Real Estate & Finance",
  "Technology & Digital",
  "Media & Education",
  "Family & Pets",
] as const;
export type Sector = (typeof SECTORS)[number];

export const DISCIPLINES = [
  "Brand Strategy",
  "Brand Identity",
  "Packaging",
  "Website",
  "Art Direction",
  "Signage & Spaces",
  "Illustration",
  "Motion",
] as const;
export type Discipline = (typeof DISCIPLINES)[number];

/** On every project, so it filters nothing: hidden from the Explore panel and a stopword in search. */
export const DISCIPLINE_ON_ALL: Discipline = "Brand Identity";

export const STAGES = ["New brand", "Rebrand", "In-house"] as const;
export type Stage = (typeof STAGES)[number];

export const PLACES = ["United States", "Mexico", "United States & Mexico", "Middle East", "International"] as const;
export type Place = (typeof PLACES)[number];

export const MAX_SEARCH_TERMS = 8;

export type ProjectFacets = {
  sector: Sector | "";
  /** Lead discipline first. */
  disciplines: Discipline[];
  stage: Stage | "";
  place: Place | "";
  /** Hidden: search only, never printed. */
  searchTerms: string[];
};

const fold = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]+/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const US = new Set(["united states", "us", "usa", "u s", "u s a", "united states of america", "estados unidos", "eeuu", "ee uu"]);
const MEXICO = new Set(["mexico", "mx", "mex"]);
const MIDDLE_EAST = new Set([
  "united arab emirates", "uae", "u a e", "emirates", "dubai", "abu dhabi",
  "saudi arabia", "ksa", "qatar", "kuwait", "bahrain", "oman", "jordan", "lebanon", "egypt", "israel",
]);

/**
 * Place from `country` (proposal 3.1): United States, Mexico, both, the Middle East (the UAE and
 * its neighbours), else International. Empty or unreadable country gives "" so nothing is invented.
 */
export function placeFromCountry(country: string | null | undefined): Place | "" {
  const text = fold((country ?? "").replace(/[&+\/,]/g, " and "));
  if (!text) return "";
  if (US.has(text)) return "United States";
  if (MEXICO.has(text)) return "Mexico";
  if (MIDDLE_EAST.has(text)) return "Middle East";
  const parts = text.split(/\s+(?:and|y)\s+/).map((part) => part.trim()).filter(Boolean);
  if (parts.length > 1) {
    const hasUs = parts.some((part) => US.has(part));
    const hasMexico = parts.some((part) => MEXICO.has(part));
    if (hasUs && hasMexico) return "United States & Mexico";
    if (hasUs && parts.every((part) => US.has(part))) return "United States";
    if (hasMexico && parts.every((part) => MEXICO.has(part))) return "Mexico";
    if (parts.every((part) => MIDDLE_EAST.has(part))) return "Middle East";
  }
  return "International";
}

/** `Food & Drink` → `food-drink`: the value as it appears in `/?sector=food-drink`. */
export function facetSlug(value: string) {
  return fold(value).replace(/\s+/g, "-");
}

/** The list value a URL or a document carries, by slug or by label, case and accents aside; "" when unknown. */
export function matchFacetValue<T extends string>(list: readonly T[], raw: string | null | undefined): T | "" {
  const wanted = facetSlug(raw ?? "");
  if (!wanted) return "";
  return list.find((value) => facetSlug(value) === wanted) ?? "";
}

type Row = [Sector, Discipline[], Stage, string[]];

/**
 * Section 4 of the proposal with JP's answers from section 6 applied (every other "?" takes the
 * proposed value). Place is not here: it comes from `country`. The same table, as JSON, drives
 * the migration (script/project-facets.json).
 */
export const FACETS_BY_SLUG: Record<string, Row> = {
  "alma-brava": ["Food & Drink", ["Packaging", "Brand Identity", "Art Direction"], "New brand", ["mezcal", "spirits", "bottle", "label"]],
  ando: ["Health & Wellness", ["Packaging", "Brand Identity"], "New brand", ["gummies", "supplements", "vitamins", "beauty"]],
  "angeles-wellness": ["Health & Wellness", ["Brand Identity", "Motion"], "New brand", ["wellness"]],
  "anything-ai": ["Technology & Digital", ["Website", "Brand Identity", "Motion"], "New brand", ["ai", "creative platform", "app"]],
  "arc-studio": ["Health & Wellness", ["Brand Identity"], "New brand", ["pilates", "fitness studio", "movement"]],
  atla: ["Media & Education", ["Brand Identity"], "In-house", ["branding studio", "agency"]],
  baristio: ["Hospitality & Travel", ["Brand Identity", "Packaging", "Motion"], "New brand", ["cafe", "coffee", "specialty coffee"]],
  "bond-and-bloom": ["Family & Pets", ["Brand Identity", "Brand Strategy"], "New brand", ["postpartum", "parenting", "babies", "wellness"]],
  "bovi-health": ["Health & Wellness", ["Brand Identity", "Packaging"], "New brand", ["dairy", "dairy wellness", "wellness"]],
  "casa-colora": ["Family & Pets", ["Brand Strategy", "Brand Identity"], "New brand", ["kids", "family", "lifestyle"]],
  "castro-capital": ["Real Estate & Finance", ["Brand Identity"], "New brand", ["investment", "real estate", "capital"]],
  "conscious-care-co": ["Health & Wellness", ["Brand Identity", "Brand Strategy"], "New brand", ["wellness", "mindful care"]],
  "hanks-leather": ["Fashion & Lifestyle", ["Website", "Brand Identity"], "Rebrand", ["leather goods", "accessories", "e-commerce", "heritage"]],
  huemac: ["Hospitality & Travel", ["Brand Identity", "Illustration"], "New brand", ["tour operator", "hiking", "adventure", "travel"]],
  munda: ["Hospitality & Travel", ["Brand Identity", "Art Direction"], "New brand", ["vacation homes", "long stay", "surf"]],
  oxylife: ["Food & Drink", ["Packaging", "Brand Identity"], "New brand", ["water", "premium water", "bottle"]],
  "pathize-health": ["Technology & Digital", ["Brand Identity", "Website", "Brand Strategy"], "New brand", ["health tech", "saas", "patient platform"]],
  "pax-and-beneficia": ["Food & Drink", ["Brand Identity", "Illustration"], "New brand", ["coffee", "specialty coffee"]],
  "peachy-patients": ["Health & Wellness", ["Brand Identity", "Website", "Brand Strategy"], "New brand", ["healthcare", "patient platform"]],
  persona: ["Health & Wellness", ["Packaging", "Brand Identity"], "Rebrand", ["vitamins", "personalized nutrition", "subscription"]],
  puppypy: ["Family & Pets", ["Brand Identity", "Illustration", "Website"], "New brand", ["pet care", "dog"]],
  reggie: ["Family & Pets", ["Packaging", "Brand Identity", "Illustration"], "New brand", ["dog food", "pet"]],
  rustico: ["Hospitality & Travel", ["Brand Identity", "Website"], "New brand", ["resort", "boutique hotel", "los cabos"]],
  "sexto-abismo": ["Food & Drink", ["Packaging", "Brand Identity", "Art Direction"], "New brand", ["gin", "craft gin", "bottle"]],
  "shop-latinx": ["Technology & Digital", ["Brand Identity", "Website", "Brand Strategy"], "New brand", ["marketplace", "e-commerce", "latin"]],
  "tequila-unido": ["Food & Drink", ["Packaging", "Brand Identity", "Website"], "New brand", ["tequila", "spirits", "bottle"]],
  "the-brand-academy": ["Media & Education", ["Brand Identity"], "In-house", ["branding course", "education"]],
  "the-bridge": ["Hospitality & Travel", ["Brand Identity", "Art Direction"], "New brand", ["hotel", "restaurant", "bali"]],
  "the-curated-outfit": ["Fashion & Lifestyle", ["Brand Identity", "Website", "Art Direction"], "New brand", ["apparel", "curation", "e-commerce"]],
  "the-internet-empires": ["Media & Education", ["Brand Identity"], "Rebrand", ["marketing course", "coaching", "growth marketing"]],
  tigretigre: ["Hospitality & Travel", ["Brand Identity", "Signage & Spaces"], "New brand", ["restaurant", "fine dining", "menu"]],
  "torre-avancer": ["Real Estate & Finance", ["Brand Identity", "Signage & Spaces"], "New brand", ["tower", "mixed use", "wayfinding"]],
  vyv: ["Health & Wellness", ["Packaging", "Brand Strategy", "Brand Identity", "Website"], "New brand", ["supplements", "vitamins", "subscription"]],
  welove: ["Media & Education", ["Art Direction", "Brand Identity"], "In-house", ["editorial", "newsletter", "magazine"]],
};

const stringList = (value: unknown) =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v.trim().length > 0).map((v) => v.trim()) : [];

export type FacetSource = {
  slug?: unknown;
  country?: unknown;
  sector?: unknown;
  disciplines?: unknown;
  stage?: unknown;
  searchTerms?: unknown;
};

/**
 * The facets of one project: what the document carries, validated against the lists, else the
 * table above by slug. A slug in neither has empty facets; nothing is guessed from tags or text.
 */
export function resolveProjectFacets(source: FacetSource): ProjectFacets {
  const slug = typeof source.slug === "string" ? source.slug.trim() : "";
  const fallback = FACETS_BY_SLUG[slug];
  const stored = {
    sector: matchFacetValue(SECTORS, typeof source.sector === "string" ? source.sector : ""),
    disciplines: stringList(source.disciplines)
      .map((value) => matchFacetValue(DISCIPLINES, value))
      .filter((value): value is Discipline => value !== ""),
    stage: matchFacetValue(STAGES, typeof source.stage === "string" ? source.stage : ""),
    searchTerms: stringList(source.searchTerms).map((term) => term.toLowerCase()).slice(0, MAX_SEARCH_TERMS),
  };
  const hasStored = Boolean(stored.sector) || stored.disciplines.length > 0;
  const facets: Omit<ProjectFacets, "place"> = hasStored
    ? stored
    : {
        sector: fallback?.[0] ?? "",
        disciplines: fallback ? [...fallback[1]] : [],
        stage: fallback?.[2] ?? "",
        searchTerms: fallback ? [...fallback[3]] : [],
      };
  return {
    sector: facets.sector,
    disciplines: Array.from(new Set(facets.disciplines)),
    stage: facets.stage,
    place: placeFromCountry(typeof source.country === "string" ? source.country : ""),
    searchTerms: Array.from(new Set(facets.searchTerms)),
  };
}
