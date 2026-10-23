import { SITE_ORIGIN } from "../../../shared/siteSeo.ts";
import { buildBreadcrumbList } from "./seoSchema.ts";

/**
 * Case-study text helpers shared by AtlaProject (runtime) and script/build.ts (prerender),
 * so meta descriptions and the narrative sections read the same in both.
 */

const META_DESCRIPTION_MAX = 155;
const META_DESCRIPTION_KEEP = 100;
const IGNORED_FACETS = new Set(["unspecified", "uncategorized", "america", ""]);

/** Collapses every whitespace run (including U+2028/U+2029 and newlines) into one space. */
export function collapseWhitespace(value: string | null | undefined) {
  return (value ?? "").replace(/[\s\u2028\u2029]+/g, " ").trim();
}

/** Comparison key: whitespace, case and trailing punctuation do not make two texts different. */
function textKey(value: string) {
  return collapseWhitespace(value).toLowerCase().replace(/[.\s]+$/, "");
}

/** Truncates on a word boundary, appending an ellipsis, so the result is at most `max` characters. */
export function truncateOnWord(value: string, max = META_DESCRIPTION_MAX) {
  if (value.length <= max) return value;
  const slice = value.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[\s,;:.\-–—]+$/, "")}…`;
}

/** Drops Sanity placeholder text: a leading "testing" token and the generic "X is an Atla case study…" line. */
function cleanProjectSummary(value: string | null | undefined) {
  const text = collapseWhitespace(value).replace(/^testing\b[\s:.,\-–—]*/i, "");
  if (/^.{0,80}\bis an Atla case study focused on brand identity execution\.?$/i.test(text)) return "";
  return text;
}

export type ProjectMetaInput = {
  title: string;
  client?: string | null;
  category?: string | null;
  services?: string[] | null;
  description?: string | null;
};

function projectFacets(input: ProjectMetaInput) {
  const seen = new Set<string>();
  const facets: string[] = [];
  for (const raw of [input.category, ...(input.services ?? [])]) {
    const value = collapseWhitespace(raw);
    const key = value.toLowerCase();
    if (IGNORED_FACETS.has(key) || seen.has(key)) continue;
    seen.add(key);
    facets.push(value.toLowerCase());
    if (facets.length === 3) break;
  }
  return facets.length > 0 ? facets : ["brand identity"];
}

function joinFacets(facets: string[]) {
  if (facets.length <= 1) return facets.join("");
  return `${facets.slice(0, -1).join(", ")} and ${facets[facets.length - 1]}`;
}

/**
 * Case-study meta description: the real summary when it is substantial, otherwise the
 * summary plus a generated line that never repeats the title. Max ~155 characters.
 */
export function buildProjectMetaDescription(input: ProjectMetaInput) {
  const title = collapseWhitespace(input.title);
  // Only the summary/description field: body copy is not reliably about this project.
  const summary = cleanProjectSummary(input.description);

  if (summary.length >= META_DESCRIPTION_KEEP) {
    return truncateOnWord(summary);
  }

  const client = collapseWhitespace(input.client);
  const hasDistinctClient = Boolean(client) && client !== "Confidential" && textKey(client) !== textKey(title);
  const facets = joinFacets(projectFacets(input));
  const summaryNamesTitle = summary.toLowerCase().includes(title.toLowerCase());
  const generated = hasDistinctClient
    ? `${summaryNamesTitle ? "Case study" : `${title} case study`} by Atla for ${client}: ${facets}.`
    : `${summaryNamesTitle ? "Brand identity case study" : `${title} brand identity case study`} by Atla: ${facets}.`;
  const combined = summary ? `${summary.replace(/[\s.]*$/, ".")} ${generated}` : generated;

  return truncateOnWord(combined);
}

export type ProjectNarrative = {
  label: string;
  text: string;
};

/**
 * The Brand / The Challenge / The Result sections. Text already shown (the intro, or an
 * earlier section) is not repeated: its section is omitted, heading included.
 */
export function buildProjectNarratives(intro: string, bodySections: string[]): ProjectNarrative[] {
  const pool = bodySections.map((section) => section.trim()).filter(Boolean);
  const candidates: ProjectNarrative[] = [
    { label: "( The Brand )", text: pool[0] || intro },
    { label: "( The Challenge )", text: pool[1] || pool[0] || intro },
    { label: "( The Result )", text: pool[2] || pool[pool.length - 1] || intro },
  ];
  const shown = new Set<string>([textKey(intro)]);
  const narratives: ProjectNarrative[] = [];

  for (const candidate of candidates) {
    const key = textKey(candidate.text);
    if (!key || shown.has(key)) continue;
    shown.add(key);
    narratives.push(candidate);
  }

  return narratives;
}

/** The project after `slug` in the site's own ordering (the /api/projects order), wrapping around. */
export function getNextProject<T extends { slug: string }>(projects: T[], slug: string): T | null {
  const list = projects.filter((project) => Boolean(project?.slug));
  if (list.length < 2) return null;
  const index = list.findIndex((project) => project.slug === slug);
  const next = list[(index + 1) % list.length];
  return next && next.slug !== slug ? next : null;
}

/** Home › Work › Project */
export function buildProjectBreadcrumb(project: { slug: string; title: string }) {
  return buildBreadcrumbList([
    { name: "Home", path: "/" },
    { name: "Work", path: "/" },
    { name: project.title, path: `/projects/${project.slug}` },
  ]);
}

export function projectUrl(slug: string) {
  return `${SITE_ORIGIN}/projects/${slug}`;
}
