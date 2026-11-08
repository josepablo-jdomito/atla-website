// The "Selected work" section of /llms.txt, written at build time (script/build.ts) from the
// same projects the prerender uses. Relative imports: script/build.ts loads this outside Vite.
import type { Project } from "../../../shared/schema.ts";
import { SITE_ORIGIN } from "../../../shared/siteSeo.ts";
import { resolveProjectFacets } from "../../../shared/projectFacets.ts";
import { buildProjectMetaDescription } from "./projectSeo.ts";

const SECTION_TITLE = "## Selected work";
/** The section goes right before this heading; at the end when it is missing. */
const INSERT_BEFORE = "## Start a project";

/**
 * Featured projects in home order (homeOrder, then newest), one line each: the facets
 * (Sector · Disciplines · Place · Year), then the project's meta description.
 */
export function buildSelectedWorkSection(projects: Project[]): string {
  const featured = projects
    .filter((project) => project.featured && project.slug && project.title)
    .sort((a, b) => (a.homeOrder ?? 999) - (b.homeOrder ?? 999) || b.year - a.year);
  if (featured.length === 0) return "";
  const lines = featured.map((project) => {
    const facets = resolveProjectFacets(project);
    const line = buildProjectMetaDescription({
      title: project.title,
      client: project.client,
      category: facets.sector || (project.category === "Uncategorized" ? "" : project.category),
      services: facets.disciplines.length > 0 ? facets.disciplines : project.tags,
      description: project.description,
    }).replace(/\s+/g, " ");
    const year = project.year > 0 ? String(project.year) : "";
    const facetLine = [facets.sector, facets.disciplines.join(", "), facets.place, year].filter(Boolean).join(" · ");
    return `- [${project.title}](${SITE_ORIGIN}/projects/${project.slug}): ${facetLine ? `${facetLine}. ` : ""}${line}`;
  });
  return `${SECTION_TITLE}\n\n${lines.join("\n")}\n`;
}

/** llms.txt with the Selected work section in place. Without featured projects the file is returned unchanged. */
export function withSelectedWork(llms: string, projects: Project[]): string {
  const section = buildSelectedWorkSection(projects);
  if (!section || llms.includes(SECTION_TITLE)) return llms;
  const at = llms.indexOf(INSERT_BEFORE);
  if (at === -1) return `${llms.trimEnd()}\n\n${section}`;
  return `${llms.slice(0, at)}${section}\n${llms.slice(at)}`;
}
