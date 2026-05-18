import {
  buildJournalArticleAudit,
  fetchJournalArticleAuditFromSanity,
  type JournalArticleAuditReport,
} from "../server/sanity/journalService.ts";
import { isJournalSanityConfigured } from "../server/sanity/journalClient.ts";

type ApiArticle = {
  slug?: string;
  title?: string;
  category?: unknown;
  categoryTitle?: unknown;
  primaryCategoryTitle?: unknown;
  excerpt?: unknown;
  heroImage?: unknown;
  coverImage?: unknown;
  bodyImage?: unknown;
  body?: unknown;
  introParagraphs?: unknown;
  bodySections?: unknown;
  publishedAt?: unknown;
};

async function main() {
  const args = process.argv.slice(2);
  const apiUrl = readFlag(args, "--url");
  const useJson = args.includes("--json");

  const report = apiUrl
    ? await fetchJournalAuditFromApi(apiUrl)
    : await fetchJournalArticleAuditFromSanity();

  if (!apiUrl && !isJournalSanityConfigured()) {
    console.error(
      "Sanity journal env vars are not configured. Set SANITY_JOURNAL_* env vars or pass --url <journal-api-url>.",
    );
    process.exitCode = 1;
    return;
  }

  if (!apiUrl && report.totalArticles === 0) {
    console.error("No published or scheduled Sanity journal articles were returned.");
    process.exitCode = 1;
    return;
  }

  if (useJson) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  printReport(apiUrl ? `api:${apiUrl}` : "sanity", report);
}

async function fetchJournalAuditFromApi(
  apiUrl: string,
): Promise<JournalArticleAuditReport> {
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${apiUrl}: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  const articles = (Array.isArray(payload) ? payload : []) as ApiArticle[];
  const normalized = await Promise.all(
    articles.map(async (article, index) => {
      const slug = asNonEmptyString(article.slug) || `article-${index + 1}`;
      const detail = await fetchArticleDetailFromApi(apiUrl, slug);
      const merged = detail ? mergeApiArticles(article, detail) : article;
      const categoryTitle = extractCategoryTitle(merged);
      const excerpt = asNonEmptyString(merged.excerpt) ? merged.excerpt : null;
      const heroImage = asNonEmptyString(merged.heroImage) ? merged.heroImage : undefined;
      const coverImage = asNonEmptyString(merged.coverImage) ? merged.coverImage : undefined;
      const bodyImage = asNonEmptyString(merged.bodyImage) ? merged.bodyImage : undefined;

      return {
        _id: `api-${index + 1}`,
        slug,
        title: asNonEmptyString(merged.title) ? merged.title : "Untitled article",
        categoryValue: categoryTitle || null,
        categoryTitle: categoryTitle || undefined,
        primaryCategoryTitle: categoryTitle || undefined,
        publishedAt: asNonEmptyString(merged.publishedAt) ? merged.publishedAt : undefined,
        excerpt,
        heroImage,
        coverImage,
        bodyImage,
        body: normalizePortableTextBlocks(merged.body),
        introParagraphs: normalizeStringArray(merged.introParagraphs),
        bodySections: normalizeBodySections(merged.bodySections),
      };
    }),
  );

  return buildJournalArticleAudit(normalized);
}

function printReport(sourceLabel: string, report: JournalArticleAuditReport) {
  console.log(`Journal audit source: ${sourceLabel}`);
  console.log(`Articles checked: ${report.totalArticles}`);
  console.log(`Published now: ${report.publishedArticles}`);
  console.log(`Scheduled: ${report.scheduledArticles}`);
  console.log("");
  console.log(`Missing category: ${report.missing.category.length}`);
  console.log(`Missing excerpt: ${report.missing.excerpt.length}`);
  console.log(`Missing hero images: ${report.missing.heroImage.length}`);
  console.log(`Missing cover images: ${report.missing.coverImage.length}`);
  console.log(`Missing body text: ${report.missing.bodyText.length}`);

  printSlugList("scheduled", report.scheduled);
  printSlugList("category", report.missing.category);
  printSlugList("excerpt", report.missing.excerpt);
  printSlugList("heroImage", report.missing.heroImage);
  printSlugList("coverImage", report.missing.coverImage);
  printSlugList("bodyText", report.missing.bodyText);
}

function printSlugList(label: string, values: string[]) {
  if (values.length === 0) return;
  console.log("");
  console.log(`${label}: ${values.join(", ")}`);
}

function readFlag(args: string[], flag: string) {
  const index = args.indexOf(flag);
  if (index === -1) return null;

  const value = args[index + 1];
  if (!value) {
    throw new Error(`Missing value for ${flag}`);
  }

  return value;
}

function normalizeStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter(isNonEmptyString) : [];
}

function normalizeBodySections(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.map((section) => ({
    paragraphs:
      section &&
      typeof section === "object" &&
      "paragraphs" in section &&
      Array.isArray(section.paragraphs)
        ? section.paragraphs.filter(isNonEmptyString)
        : [],
  }));
}

function normalizePortableTextBlocks(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((block) => block && typeof block === "object");
}

function mergeApiArticles(listArticle: ApiArticle, detailArticle: ApiArticle) {
  return {
    ...listArticle,
    ...detailArticle,
    body: Array.isArray(detailArticle.body) && detailArticle.body.length > 0
      ? detailArticle.body
      : listArticle.body,
    introParagraphs:
      Array.isArray(detailArticle.introParagraphs) && detailArticle.introParagraphs.length > 0
        ? detailArticle.introParagraphs
        : listArticle.introParagraphs,
    bodySections:
      Array.isArray(detailArticle.bodySections) && detailArticle.bodySections.length > 0
        ? detailArticle.bodySections
        : listArticle.bodySections,
  };
}

function extractCategoryTitle(article: ApiArticle) {
  const explicitCategoryTitle = asNonEmptyString(article.categoryTitle) ? article.categoryTitle : "";
  const explicitPrimaryTitle = asNonEmptyString(article.primaryCategoryTitle)
    ? article.primaryCategoryTitle
    : "";
  if (explicitCategoryTitle) return explicitCategoryTitle;
  if (explicitPrimaryTitle) return explicitPrimaryTitle;
  if (isNonEmptyString(article.category)) return article.category;
  if (article.category && typeof article.category === "object") {
    const valueCandidate = (article.category as Record<string, unknown>).value;
    const titleCandidate = (article.category as Record<string, unknown>).title;
    if (isNonEmptyString(titleCandidate)) return titleCandidate;
    if (isNonEmptyString(valueCandidate)) return valueCandidate;
  }
  return "";
}

async function fetchArticleDetailFromApi(apiUrl: string, slug: string): Promise<ApiArticle | null> {
  const detailUrl = buildDetailUrl(apiUrl, slug);
  if (!detailUrl) return null;

  try {
    const response = await fetch(detailUrl);
    if (!response.ok) return null;
    const payload = (await response.json()) as ApiArticle | null;
    if (!payload || typeof payload !== "object") return null;
    return payload;
  } catch {
    return null;
  }
}

function buildDetailUrl(apiUrl: string, slug: string) {
  try {
    const url = new URL(apiUrl);
    const trimmedPath = url.pathname.replace(/\/+$/, "");
    url.pathname = `${trimmedPath}/${encodeURIComponent(slug)}`;
    url.search = "";
    return url.toString();
  } catch {
    return null;
  }
}

function asNonEmptyString(value: unknown) {
  return isNonEmptyString(value) ? value : "";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
