import type {
  JournalArticle,
  JournalCategory,
  JournalPortableTextBlock,
} from "@shared/journal";
import { getJournalSanityClient, isJournalSanityConfigured } from "./journalClient.ts";

type SanityJournalArticleBase = {
  slug: string;
  title: string;
  categoryValue?: unknown;
  categoryTitle?: string;
  categorySlug?: string;
  primaryCategoryTitle?: string;
  primaryCategorySlug?: string;
  publishedAt?: string;
  excerpt?: string;
  heroImage?: string;
  coverImage?: string;
  bodyImage?: string;
  authorName?: string;
  sourceName?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  body?: JournalPortableTextBlock[];
  introParagraphs?: string[];
  bodySections?: Array<{ paragraphs?: string[]; image?: string; wideImage?: string }>;
};

type SanityJournalArticleAuditSource = {
  _id: string;
  slug: string;
  title: string;
  categoryValue?: unknown;
  categoryTitle?: string;
  primaryCategoryTitle?: string;
  publishedAt?: string;
  excerpt?: string | null;
  heroImage?: string;
  coverImage?: string;
  bodyImage?: string;
  body?: JournalPortableTextBlock[];
  introParagraphs?: string[];
  bodySections?: Array<{ paragraphs?: string[] }>;
};

type SanityJournalCategory = {
  title?: string;
  slug?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type JournalArticleAuditItem = {
  id: string;
  slug: string;
  title: string;
  status: "published" | "scheduled";
  missing: {
    category: boolean;
    excerpt: boolean;
    heroImage: boolean;
    coverImage: boolean;
    bodyText: boolean;
  };
};

export type JournalArticleAuditReport = {
  totalArticles: number;
  publishedArticles: number;
  scheduledArticles: number;
  missing: {
    category: string[];
    excerpt: string[];
    heroImage: string[];
    coverImage: string[];
    bodyText: string[];
  };
  scheduled: string[];
  articles: JournalArticleAuditItem[];
};

const JOURNAL_ARTICLE_FILTER = `
  _type == "journalArticle" &&
  defined(slug.current) &&
  defined(publishedAt) &&
  publishedAt <= now() &&
  coalesce(noIndex, false) != true &&
  !(_id in path("drafts.**"))
`;

const JOURNAL_ARTICLE_LIST_QUERY = `
  *[
    ${JOURNAL_ARTICLE_FILTER}
  ] | order(publishedAt desc, _createdAt desc) {
    "slug": slug.current,
    title,
    "categoryValue": category,
    "categoryTitle": category->title,
    "categorySlug": category->slug.current,
    "primaryCategoryTitle": primaryCategory->title,
    "primaryCategorySlug": primaryCategory->slug.current,
    publishedAt,
    excerpt,
    "heroImage": heroImage.asset->url,
    "coverImage": coverImage.asset->url,
    "bodyImage": body[_type == "image"][0].asset->url,
    "authorName": author->name,
    sourceName,
    "seoTitle": coalesce(seo.title, seoTitle),
    "seoDescription": coalesce(seo.description, seoDescription)
  }
`;

const JOURNAL_ARTICLE_DETAIL_QUERY = `
  *[
    ${JOURNAL_ARTICLE_FILTER} &&
    slug.current == $slug
  ][0] {
    "slug": slug.current,
    title,
    "categoryValue": category,
    "categoryTitle": category->title,
    "categorySlug": category->slug.current,
    "primaryCategoryTitle": primaryCategory->title,
    "primaryCategorySlug": primaryCategory->slug.current,
    publishedAt,
    excerpt,
    "heroImage": heroImage.asset->url,
    "coverImage": coverImage.asset->url,
    "bodyImage": body[_type == "image"][0].asset->url,
    body[]{
      ...,
      _type == "image" => {
        ...,
        alt,
        caption,
        "asset": asset->{
          url,
          metadata {
            dimensions
          }
        }
      }
    },
    introParagraphs,
    bodySections[]{
      paragraphs,
      "image": image.asset->url,
      "wideImage": wideImage.asset->url
    },
    "authorName": author->name,
    sourceName,
    "seoTitle": coalesce(seo.title, seoTitle),
    "seoDescription": coalesce(seo.description, seoDescription)
  }
`;

const JOURNAL_CATEGORY_QUERY = `
  *[
    _type == "category" &&
    defined(slug.current)
  ] | order(title asc) {
    title,
    "slug": slug.current,
    description,
    "seoTitle": coalesce(seo.title, seoTitle),
    "seoDescription": coalesce(seo.description, seoDescription)
  }
`;

const JOURNAL_ARTICLE_AUDIT_QUERY = `
  *[
    _type == "journalArticle" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    !(_id in path("drafts.**"))
  ] | order(publishedAt desc, _createdAt desc) {
    _id,
    "slug": slug.current,
    title,
    "categoryValue": category,
    "categoryTitle": category->title,
    "primaryCategoryTitle": primaryCategory->title,
    publishedAt,
    excerpt,
    "heroImage": heroImage.asset->url,
    "coverImage": coverImage.asset->url,
    "bodyImage": body[_type == "image"][0].asset->url,
    body[]{
      ...,
      _type == "image" => {
        ...,
        "asset": asset->{
          url
        }
      }
    },
    introParagraphs,
    bodySections[]{
      paragraphs
    }
  }
`;

function formatDateLabel(publishedAt?: string) {
  if (!publishedAt) return "";
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function slugifyCategory(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeCategoryTitle(article: SanityJournalArticleBase | SanityJournalArticleAuditSource) {
  if (isNonEmptyString(article.categoryTitle)) return article.categoryTitle;
  if (isNonEmptyString(article.primaryCategoryTitle)) return article.primaryCategoryTitle;
  if (isNonEmptyString(article.categoryValue)) return article.categoryValue;
  return "Journal";
}

function normalizeCategorySlug(article: SanityJournalArticleBase) {
  if (isNonEmptyString(article.categorySlug)) return article.categorySlug;
  if (isNonEmptyString(article.primaryCategorySlug)) return article.primaryCategorySlug;
  return slugifyCategory(normalizeCategoryTitle(article));
}

function normalizeArticle(article: SanityJournalArticleBase): JournalArticle {
  const heroImage = article.heroImage || article.coverImage || article.bodyImage || "";
  const coverImage = article.coverImage || article.heroImage || article.bodyImage || "";

  return {
    slug: article.slug,
    title: article.title,
    category: normalizeCategoryTitle(article),
    categorySlug: normalizeCategorySlug(article),
    date: formatDateLabel(article.publishedAt),
    excerpt: article.excerpt || "",
    heroImage,
    coverImage,
    body: Array.isArray(article.body) ? article.body : [],
    introParagraphs: Array.isArray(article.introParagraphs)
      ? article.introParagraphs.filter(isNonEmptyString)
      : [],
    bodySections: Array.isArray(article.bodySections)
      ? article.bodySections.map((section) => ({
          paragraphs: Array.isArray(section.paragraphs) ? section.paragraphs.filter(isNonEmptyString) : [],
          image: section.image,
          wideImage: section.wideImage,
        }))
      : [],
    authorName: article.authorName || undefined,
    sourceName: article.sourceName || undefined,
    publishedAt: article.publishedAt,
    seoTitle: article.seoTitle || undefined,
    seoDescription: article.seoDescription || undefined,
  };
}

function normalizeCategory(category: SanityJournalCategory): JournalCategory | null {
  if (!isNonEmptyString(category.title) || !isNonEmptyString(category.slug)) {
    return null;
  }

  return {
    title: category.title,
    slug: category.slug,
    description: isNonEmptyString(category.description) ? category.description : undefined,
    seoTitle: isNonEmptyString(category.seoTitle) ? category.seoTitle : undefined,
    seoDescription: isNonEmptyString(category.seoDescription) ? category.seoDescription : undefined,
  };
}

export async function fetchJournalArticlesFromSanity() {
  if (!isJournalSanityConfigured()) return [];
  const client = getJournalSanityClient();
  const data = await client.fetch<SanityJournalArticleBase[]>(JOURNAL_ARTICLE_LIST_QUERY);
  return data
    .filter((article) => isNonEmptyString(article.slug) && isNonEmptyString(article.title))
    .map(normalizeArticle);
}

export async function fetchJournalArticleBySlugFromSanity(slug: string) {
  if (!isJournalSanityConfigured()) return null;
  const client = getJournalSanityClient();
  const article = await client.fetch<SanityJournalArticleBase | null>(JOURNAL_ARTICLE_DETAIL_QUERY, { slug });
  if (!article || !isNonEmptyString(article.slug) || !isNonEmptyString(article.title)) {
    return null;
  }

  return normalizeArticle(article);
}

export async function fetchJournalCategoriesFromSanity() {
  if (!isJournalSanityConfigured()) return [];
  const client = getJournalSanityClient();
  const data = await client.fetch<SanityJournalCategory[]>(JOURNAL_CATEGORY_QUERY);
  return data
    .map(normalizeCategory)
    .filter((category): category is JournalCategory => Boolean(category));
}

export async function fetchJournalArticleAuditFromSanity(): Promise<JournalArticleAuditReport> {
  if (!isJournalSanityConfigured()) {
    return emptyJournalArticleAudit();
  }

  const client = getJournalSanityClient();
  const articles = await client.fetch<SanityJournalArticleAuditSource[]>(JOURNAL_ARTICLE_AUDIT_QUERY);

  return buildJournalArticleAudit(articles);
}

export function buildJournalArticleAudit(
  articles: SanityJournalArticleAuditSource[],
): JournalArticleAuditReport {
  const now = Date.now();
  const missing = {
    category: [] as string[],
    excerpt: [] as string[],
    heroImage: [] as string[],
    coverImage: [] as string[],
    bodyText: [] as string[],
  };

  const scheduled: string[] = [];
  let publishedArticles = 0;
  let scheduledArticles = 0;

  const items = articles.map((article) => {
    const slug = article.slug;
    const publishedAt = article.publishedAt ? new Date(article.publishedAt).getTime() : Number.NaN;
    const status: JournalArticleAuditItem["status"] =
      Number.isFinite(publishedAt) && publishedAt > now ? "scheduled" : "published";
    const missingFields = {
      category:
        !isNonEmptyString(article.categoryTitle) &&
        !isNonEmptyString(article.primaryCategoryTitle) &&
        !isNonEmptyString(article.categoryValue),
      excerpt: !isNonEmptyString(article.excerpt),
      heroImage: !isNonEmptyString(article.heroImage) && !isNonEmptyString(article.bodyImage),
      coverImage: !isNonEmptyString(article.coverImage) && !isNonEmptyString(article.bodyImage),
      bodyText: !hasEditorialContent(article),
    };

    if (status === "scheduled") {
      scheduled.push(slug);
      scheduledArticles += 1;
    } else {
      publishedArticles += 1;
    }

    if (missingFields.category) missing.category.push(slug);
    if (missingFields.excerpt) missing.excerpt.push(slug);
    if (missingFields.heroImage) missing.heroImage.push(slug);
    if (missingFields.coverImage) missing.coverImage.push(slug);
    if (missingFields.bodyText) missing.bodyText.push(slug);

    return {
      id: article._id,
      slug,
      title: article.title,
      status,
      missing: missingFields,
    };
  });

  return {
    totalArticles: items.length,
    publishedArticles,
    scheduledArticles,
    missing,
    scheduled,
    articles: items,
  };
}

function hasEditorialContent(article: SanityJournalArticleAuditSource) {
  const bodyText = portableTextToPlainText(article.body);
  if (bodyText.trim().length > 0) {
    return true;
  }

  const introText = Array.isArray(article.introParagraphs)
    ? article.introParagraphs.filter(isNonEmptyString)
    : [];
  const legacyBodyText = Array.isArray(article.bodySections)
    ? article.bodySections.flatMap((section) =>
        Array.isArray(section.paragraphs) ? section.paragraphs.filter(isNonEmptyString) : [],
      )
    : [];

  return introText.length + legacyBodyText.length > 0;
}

function portableTextToPlainText(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .map((block) => {
      if (!block || typeof block !== "object") {
        return "";
      }

      if ("children" in block && Array.isArray(block.children)) {
        return block.children
          .map((child: unknown) => {
            if (!child || typeof child !== "object" || !("text" in child) || typeof child.text !== "string") {
              return "";
            }

            return child.text;
          })
          .join("");
      }

      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function emptyJournalArticleAudit(): JournalArticleAuditReport {
  return {
    totalArticles: 0,
    publishedArticles: 0,
    scheduledArticles: 0,
    missing: {
      category: [],
      excerpt: [],
      heroImage: [],
      coverImage: [],
      bodyText: [],
    },
    scheduled: [],
    articles: [],
  };
}
