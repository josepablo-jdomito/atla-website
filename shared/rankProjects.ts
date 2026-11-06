/**
 * Keyword ranking for the search bar. Shared so the client can rank the same
 * way offline; it has no server dependencies.
 *
 * A query token scores against each project field it appears in: title 3,
 * sector 3, disciplines 2, stage 2, searchTerms 2, place 1; a synonym of a query
 * word scores 1 per project, so "coffee" reaches the hospitality work. When nothing
 * scores, the visitor gets the (up to) 6 projects whose sector, disciplines, stage or search
 * terms overlap the query through a small synonym map, flagged `closest` so the UI can label
 * them "Closest work". When the query names something and nothing overlaps at all, the result
 * is empty (still flagged `closest`) and the UI says so instead of padding with unrelated work.
 * A query of only function words ("brand identity") names nothing, so it gets the 6 most recent.
 *
 * The facet values are the controlled lists in shared/projectFacets.ts.
 */

export type ProjectLite = {
  slug: string;
  title: string;
  sector: string;
  /** Lead first. */
  disciplines: string[];
  stage: string;
  place: string;
  /** Hidden: ranked like a facet, never printed. */
  searchTerms: string[];
  year: number;
  coverImage: string;
};

export type RankResult = { projects: ProjectLite[]; closest: boolean };

const CLOSEST_COUNT = 6;

// Function words, plus words that describe every project on the site and so rank nothing
// ("Brand Identity" is on every project).
const STOPWORDS = new Set([
  "a", "an", "and", "the", "for", "of", "in", "on", "to", "with", "by", "at", "or", "from",
  "my", "our", "your", "we", "i", "me", "us", "is", "are", "be", "like", "some", "something", "show",
  "brand", "branding", "identity", "agency", "studio", "project", "projects", "work", "company",
]);

// Query words mapped to tokens of the facet values (proposal 3.4):
// sectors (Hospitality & Travel, Food & Drink, Health & Wellness, Fashion & Lifestyle,
// Real Estate & Finance, Technology & Digital, Media & Education, Family & Pets),
// stages (New brand, Rebrand) and disciplines (Packaging, Website, Signage & Spaces).
const HOSPITALITY = ["hospitality", "travel"];
const FOOD = ["food", "drink"];
const HEALTH = ["health", "wellness"];
const FASHION = ["fashion", "lifestyle"];
const REAL_ESTATE = ["real", "estate", "finance"];
const TECH = ["technology", "digital"];
const MEDIA = ["media", "education"];
const FAMILY = ["family", "pets"];
const REBRAND = ["rebrand"];
const NEW_BRAND = ["new"];
const PACKAGING = ["packaging"];
const WEBSITE = ["website"];
const SIGNAGE = ["signage", "spaces"];

const SYNONYMS: Record<string, string[]> = {
  hotel: HOSPITALITY, resort: HOSPITALITY, restaurant: HOSPITALITY, cafe: HOSPITALITY, bar: HOSPITALITY,
  travel: HOSPITALITY, tour: HOSPITALITY, tours: HOSPITALITY,
  drink: FOOD, drinks: FOOD, spirits: FOOD, mezcal: FOOD, tequila: FOOD, gin: FOOD, wine: FOOD, beer: FOOD,
  water: FOOD, coffee: FOOD, snack: FOOD, snacks: FOOD, cpg: FOOD, beverage: FOOD,
  health: HEALTH, wellness: HEALTH, clinic: HEALTH, supplement: HEALTH, supplements: HEALTH, vitamin: HEALTH,
  vitamins: HEALTH, fitness: HEALTH, gym: HEALTH, pilates: HEALTH, beauty: HEALTH, skincare: HEALTH,
  fashion: FASHION, apparel: FASHION, clothing: FASHION, leather: FASHION, accessories: FASHION, lifestyle: FASHION,
  "real estate": REAL_ESTATE, building: REAL_ESTATE, tower: REAL_ESTATE, development: REAL_ESTATE,
  developer: REAL_ESTATE, finance: REAL_ESTATE, fintech: REAL_ESTATE, investment: REAL_ESTATE, bank: REAL_ESTATE,
  ai: TECH, app: TECH, software: TECH, saas: TECH, platform: TECH, marketplace: TECH, startup: TECH,
  media: MEDIA, magazine: MEDIA, newsletter: MEDIA, course: MEDIA, academy: MEDIA, education: MEDIA, school: MEDIA,
  pet: FAMILY, pets: FAMILY, dog: FAMILY, baby: FAMILY, kids: FAMILY, family: FAMILY, parenting: FAMILY,
  rebrand: REBRAND, refresh: REBRAND, relaunch: REBRAND,
  launch: NEW_BRAND, "new brand": NEW_BRAND, starting: NEW_BRAND, "sub brand": NEW_BRAND,
  label: PACKAGING, bottle: PACKAGING, box: PACKAGING, pack: PACKAGING,
  web: WEBSITE, site: WEBSITE, landing: WEBSITE,
  sign: SIGNAGE, signage: SIGNAGE, wayfinding: SIGNAGE, space: SIGNAGE, interior: SIGNAGE,
};

/** Query words widened by the synonym map: the words a visitor types next to the words the portfolio uses. */
function widen(queryWords: string[]): Set<string> {
  const joined = ` ${queryWords.join(" ")} `;
  const wanted = new Set<string>();
  for (const [term, targets] of Object.entries(SYNONYMS)) {
    if (joined.includes(` ${term} `)) targets.forEach((target) => wanted.add(target));
  }
  return wanted;
}

// Whitespace, ASCII punctuation, Latin-1 punctuation and general punctuation; letters of any script survive.
const SEPARATORS = /[\s!-\/:-@[-`{-~¡-¿×÷ -⁯]+/;

/** Lowercase, strip accents, split on separators. */
function words(value: string): string[] {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]+/g, "")
    .split(SEPARATORS)
    .filter(Boolean);
}

const tokenSet = (values: string[]) => new Set(values.flatMap(words));

const byYearDesc = (a: ProjectLite, b: ProjectLite) => (b.year || 0) - (a.year || 0);

/** The facet tokens a synonym or the closest-work overlap can land on: everything but title and place. */
const facetTokens = (project: ProjectLite) =>
  tokenSet([project.sector, ...project.disciplines, project.stage, ...project.searchTerms]);

export function rankProjects(query: string, projects: ProjectLite[]): RankResult {
  const queryWords = words(query);
  const queryTokens = queryWords.filter((token) => !STOPWORDS.has(token));
  const synonyms = widen(queryWords);
  queryTokens.forEach((token) => synonyms.delete(token));

  const scored = projects.map((project) => {
    const fields: Array<[Set<string>, number]> = [
      [tokenSet([project.title]), 3],
      [tokenSet([project.sector]), 3],
      [tokenSet(project.disciplines), 2],
      [tokenSet([project.stage]), 2],
      [tokenSet(project.searchTerms), 2],
      [tokenSet([project.place]), 1],
    ];
    let score = 0;
    for (const token of queryTokens) {
      for (const [field, weight] of fields) if (field.has(token)) score += weight;
    }
    // A synonym hit counts for one, once per project: "coffee" reaches the hospitality
    // and food projects, below anything the visitor named outright.
    const facets = facetTokens(project);
    let synonymHit = false;
    synonyms.forEach((token) => {
      if (facets.has(token)) synonymHit = true;
    });
    if (synonymHit) score += 1;
    return { project, score };
  });

  const matched = scored.filter((entry) => entry.score > 0);
  if (matched.length > 0) {
    matched.sort((a, b) => b.score - a.score || byYearDesc(a.project, b.project));
    return { projects: matched.map((entry) => entry.project), closest: false };
  }

  // Closest work: overlap on the facets, query words widened by the synonym map.
  // Recency only orders ties, so with no overlap at all it is the 6 most recent.
  const wanted = new Set(queryTokens);
  synonyms.forEach((token) => wanted.add(token));
  const overlap = (project: ProjectLite) => {
    const facets = facetTokens(project);
    let count = 0;
    wanted.forEach((token) => {
      if (facets.has(token)) count += 1;
    });
    return count;
  };

  const closest = projects
    .map((project) => ({ project, overlap: overlap(project) }))
    // A query that names something needs some overlap to be "closest"; one that names nothing does not.
    .filter((entry) => queryTokens.length === 0 || entry.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || byYearDesc(a.project, b.project))
    .slice(0, CLOSEST_COUNT)
    .map((entry) => entry.project);
  return { projects: closest, closest: true };
}
