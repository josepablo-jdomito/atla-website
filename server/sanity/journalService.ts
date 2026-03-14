import type { JournalArticle } from "@shared/journal";
import { getJournalSanityClient, isJournalSanityConfigured } from "./journalClient.ts";

type SanityJournalArticle = {
  slug: string;
  title: string;
  category?: string;
  publishedAt?: string;
  excerpt?: string;
  heroImage?: string;
  coverImage?: string;
  introParagraphs?: string[];
  bodySections?: Array<{ paragraphs?: string[]; image?: string; wideImage?: string }>;
  authorName?: string;
  sourceName?: string;
  seoTitle?: string;
  seoDescription?: string;
};

const JOURNAL_ARTICLE_QUERY = `
  *[_type == "journalArticle" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) {
    "slug": slug.current,
    title,
    "category": primaryCategory->title,
    publishedAt,
    excerpt,
    "heroImage": coalesce(heroImage.asset->url, coverImage.asset->url),
    "coverImage": coalesce(coverImage.asset->url, heroImage.asset->url),
    introParagraphs,
    bodySections[]{
      paragraphs,
      "image": image.asset->url,
      "wideImage": wideImage.asset->url
    },
    "authorName": author->name,
    sourceName,
    "seoTitle": seo.title,
    "seoDescription": seo.description
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

function normalizeArticle(article: SanityJournalArticle): JournalArticle {
  return {
    slug: article.slug,
    title: article.title,
    category: article.category || "Journal",
    date: formatDateLabel(article.publishedAt),
    excerpt: article.excerpt || "",
    heroImage: article.heroImage || article.coverImage || "",
    coverImage: article.coverImage || article.heroImage || "",
    introParagraphs: article.introParagraphs || [],
    bodySections: (article.bodySections || []).map((section) => ({
      paragraphs: section.paragraphs || [],
      image: section.image,
      wideImage: section.wideImage,
    })),
    authorName: article.authorName,
    sourceName: article.sourceName,
    publishedAt: article.publishedAt,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
  };
}

export async function fetchJournalArticlesFromSanity() {
  if (!isJournalSanityConfigured()) return [];
  const client = getJournalSanityClient();
  const data = await client.fetch<SanityJournalArticle[]>(JOURNAL_ARTICLE_QUERY);
  return data
    .filter((article) => article.slug && article.title)
    .map(normalizeArticle);
}

export async function fetchJournalArticleBySlugFromSanity(slug: string) {
  const articles = await fetchJournalArticlesFromSanity();
  return articles.find((article) => article.slug === slug);
}
