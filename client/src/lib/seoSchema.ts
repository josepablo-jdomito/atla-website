import { ORGANIZATION_NAME, SITE_ORIGIN, formatMetaTitle } from "../../../shared/siteSeo.ts";

/**
 * Framework-free SEO helpers shared by the runtime pages (SeoHead) and the
 * prerender in script/build.ts, so both emit identical head markup.
 */

/** Resolves a path or URL against the production origin. og:image and twitter:image must be absolute. */
export function toAbsoluteUrl(pathOrUrl: string, origin: string = SITE_ORIGIN) {
  const value = pathOrUrl.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  try {
    return new URL(value, origin).toString();
  } catch {
    return `${origin}${value.startsWith("/") ? "" : "/"}${value}`;
  }
}

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

const JOURNAL_SUFFIX = "Atla Journal";

/** Journal titles: appends "| Atla Journal" only when the base title does not already name it. */
export function formatJournalMetaTitle(base: string) {
  return base.toLowerCase().includes(JOURNAL_SUFFIX.toLowerCase())
    ? formatMetaTitle(base)
    : formatMetaTitle(base, JOURNAL_SUFFIX);
}

export const FOUNDER_NAME = "José Pablo Domínguez";

const ORGANIZATION_REF = {
  "@type": "Organization",
  name: ORGANIZATION_NAME,
  url: SITE_ORIGIN,
} as const;

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** BlogPosting author: the founder as a Person unless Sanity names someone else. */
export function buildArticleAuthor(authorName?: string) {
  const name = authorName?.trim() || FOUNDER_NAME;
  const normalized = normalizeName(name);

  if (normalized === normalizeName(ORGANIZATION_NAME)) {
    return ORGANIZATION_REF;
  }

  if (normalized.startsWith("jose pablo")) {
    return {
      "@type": "Person",
      name: FOUNDER_NAME,
      jobTitle: "Founder & Creative Director",
      url: `${SITE_ORIGIN}/about`,
      worksFor: ORGANIZATION_REF,
    };
  }

  return {
    "@type": "Person",
    name,
    worksFor: ORGANIZATION_REF,
  };
}

export type CreativeWorkInput = {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  gallery: string[];
  /** The project year as shown on the page; dateCreated is left out when it is not a year. */
  year: string;
  industry: string;
  client: string;
  region: string;
  services: string[];
};

/**
 * schema.org CreativeWork for a case study. Built by buildProjectSeoHead
 * (lib/projectPage.ts), which both the Project page and the prerender use.
 */
export function creativeWorkSchema(project: CreativeWorkInput) {
  const year = Number.parseInt(project.year, 10);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${project.title} case study`,
    description: project.description,
    url: `${SITE_ORIGIN}/projects/${project.slug}`,
    image: [project.heroImage, ...project.gallery.slice(0, 7)].filter(Boolean),
    ...(Number.isFinite(year) ? { dateCreated: String(year) } : {}),
    creator: ORGANIZATION_REF,
    publisher: ORGANIZATION_REF,
    about: [project.industry, project.client, project.region, ...project.services].filter(Boolean),
  };
}
