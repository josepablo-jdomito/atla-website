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
  excerpt?: unknown;
  heroImage?: unknown;
  coverImage?: unknown;
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

  const articles = (await response.json()) as ApiArticle[];

  return buildJournalArticleAudit(
    articles.map((article, index) => ({
      _id: `api-${index + 1}`,
      slug: asNonEmptyString(article.slug) || `article-${index + 1}`,
      title: asNonEmptyString(article.title) || "Untitled article",
      category: asNonEmptyString(article.category) ? article.category : null,
      publishedAt: asNonEmptyString(article.publishedAt) ? article.publishedAt : undefined,
      excerpt: asNonEmptyString(article.excerpt) ? article.excerpt : null,
      heroImage: asNonEmptyString(article.heroImage) ? article.heroImage : undefined,
      coverImage: asNonEmptyString(article.coverImage) ? article.coverImage : undefined,
      introParagraphs: normalizeStringArray(article.introParagraphs),
      bodySections: normalizeBodySections(article.bodySections),
    })),
  );
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
