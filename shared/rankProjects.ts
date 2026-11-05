/**
 * Keyword ranking for the search bar. Shared so the client can rank the same
 * way offline; it has no server dependencies.
 *
 * A query token scores against each project field it appears in: title 3,
 * industry 3, services 2, tags 2, region 1. When nothing scores, the visitor
 * still gets work back: the 6 projects whose industry or services overlap the
 * query (through a small synonym map), else the 6 most recent, flagged
 * `closest` so the UI can label them "Closest work".
 */

export type ProjectLite = {
  slug: string;
  title: string;
  industry: string;
  region: string;
  services: string[];
  tags: string[];
  year: number;
  coverImage: string;
};

export type RankResult = { projects: ProjectLite[]; closest: boolean };

const CLOSEST_COUNT = 6;

// Function words, plus words that describe every project on the site and so rank nothing.
const STOPWORDS = new Set([
  "a", "an", "and", "the", "for", "of", "in", "on", "to", "with", "by", "at", "or", "from",
  "my", "our", "your", "we", "i", "me", "us", "is", "are", "be", "like", "some", "something", "show",
  "brand", "branding", "agency", "studio", "project", "projects", "work", "company",
]);

const SYNONYMS: Record<string, string> = {
  hotel: "hospitality",
  restaurant: "hospitality",
  cafe: "hospitality",
  coffee: "hospitality",
  food: "consumer",
  drink: "consumer",
  beverage: "consumer",
  beauty: "consumer",
  fintech: "tech",
  ai: "tech",
  software: "tech",
  saas: "tech",
  "real estate": "lifestyle",
  residence: "lifestyle",
  fashion: "lifestyle",
  retail: "lifestyle",
};

// Whitespace, ASCII punctuation, Latin-1 punctuation and general punctuation; letters of any script survive.
const SEPARATORS = /[\s!-\/:-@[-`{-~\u00a1-\u00bf\u00d7\u00f7\u2000-\u206f]+/;

/** Lowercase, strip accents, split on separators. */
function words(value: string): string[] {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]+/g, "")
    .split(SEPARATORS)
    .filter(Boolean);
}

const tokenSet = (values: string[]) => new Set(values.flatMap(words));

const byYearDesc = (a: ProjectLite, b: ProjectLite) => (b.year || 0) - (a.year || 0);

export function rankProjects(query: string, projects: ProjectLite[]): RankResult {
  const queryWords = words(query);
  const queryTokens = queryWords.filter((token) => !STOPWORDS.has(token));

  const scored = projects.map((project) => {
    const fields: Array<[Set<string>, number]> = [
      [tokenSet([project.title]), 3],
      [tokenSet([project.industry]), 3],
      [tokenSet(project.services), 2],
      [tokenSet(project.tags), 2],
      [tokenSet([project.region]), 1],
    ];
    let score = 0;
    for (const token of queryTokens) {
      for (const [field, weight] of fields) if (field.has(token)) score += weight;
    }
    return { project, score };
  });

  const matched = scored.filter((entry) => entry.score > 0);
  if (matched.length > 0) {
    matched.sort((a, b) => b.score - a.score || byYearDesc(a.project, b.project));
    return { projects: matched.map((entry) => entry.project), closest: false };
  }

  // Closest work: overlap on industry and services, query words widened by the synonym map.
  const joined = ` ${queryWords.join(" ")} `;
  const wanted = new Set(queryTokens);
  for (const [term, target] of Object.entries(SYNONYMS)) {
    if (joined.includes(` ${term} `)) wanted.add(target);
  }
  const overlap = (project: ProjectLite) => {
    const facets = tokenSet([project.industry, ...project.services]);
    let count = 0;
    wanted.forEach((token) => {
      if (facets.has(token)) count += 1;
    });
    return count;
  };

  const closest = projects
    .map((project) => ({ project, overlap: overlap(project) }))
    .sort((a, b) => b.overlap - a.overlap || byYearDesc(a.project, b.project))
    .slice(0, CLOSEST_COUNT)
    .map((entry) => entry.project);
  return { projects: closest, closest: true };
}
