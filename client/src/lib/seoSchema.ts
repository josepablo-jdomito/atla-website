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
