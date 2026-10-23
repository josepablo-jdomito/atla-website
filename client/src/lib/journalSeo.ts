import type { JournalArticle, JournalBodySection, JournalPortableTextBlock } from "@shared/journal";
import { ORGANIZATION_LOGO_URL, ORGANIZATION_NAME, SITE_ORIGIN } from "../../../shared/siteSeo.ts";
import { stripMarkdownLinks } from "./markdownLinks.ts";
import { buildArticleAuthor, buildBreadcrumbList } from "./seoSchema.ts";

/** The API adds Sanity's `_updatedAt` as `updatedAt`; older payloads may not carry it. */
export type JournalArticleWithMeta = JournalArticle & { updatedAt?: string };

const MONTHS: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

export function articleDescription(article: JournalArticle) {
  return article.seoDescription || article.excerpt || portableTextToPlainText(article.body).slice(0, 220) || (article.introParagraphs[0] ? stripMarkdownLinks(article.introParagraphs[0]) : "") || `Read ${article.title} from Atla Journal.`;
}

export function articlePublishedIso(dateLabel: string) {
  const [month, year] = dateLabel.split(" ");
  const monthNumber = MONTHS[month];
  if (!monthNumber || !year) return undefined;
  return `${year}-${monthNumber}-01`;
}

export function articleBodyText(article: JournalArticle) {
  const portableText = portableTextToPlainText(article.body).trim();
  if (portableText.length > 0) {
    return portableText;
  }

  return [
    ...article.introParagraphs,
    ...article.bodySections.flatMap((section: JournalBodySection) => section.paragraphs),
  ]
    .map(stripMarkdownLinks)
    .join(" ")
    .trim();
}

function portableTextToPlainText(body: JournalPortableTextBlock[]) {
  if (!Array.isArray(body)) return "";

  return body
    .map((block) => {
      if (!block || block._type !== "block" || !Array.isArray(block.children)) {
        return "";
      }

      return stripMarkdownLinks(
        block.children.map((child) => (typeof child.text === "string" ? child.text : "")).join(""),
      );
    })
    .filter(Boolean)
    .join("\n\n");
}

export function articleModifiedIso(article: JournalArticleWithMeta) {
  return article.updatedAt || article.publishedAt || articlePublishedIso(article.date);
}

/** BlogPosting JSON-LD, shared by the article page and the prerender. */
export function buildBlogPostingSchema(
  article: JournalArticleWithMeta,
  {
    description,
    image,
    articleBody,
  }: {
    description: string;
    image?: string;
    articleBody?: string;
  },
) {
  const url = `${SITE_ORIGIN}/journal/${article.slug}`;
  const datePublished = article.publishedAt || articlePublishedIso(article.date);
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.seoTitle || article.title,
    description,
    articleSection: article.category || undefined,
    url,
    mainEntityOfPage: url,
    datePublished,
    dateModified: articleModifiedIso(article) || datePublished,
    author: buildArticleAuthor(article.authorName),
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: SITE_ORIGIN,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION_LOGO_URL,
      },
    },
  };

  if (image) schema.image = [image];
  if (articleBody) schema.articleBody = articleBody;
  return schema;
}

/** Home › Journal › Article */
export function buildArticleBreadcrumb(article: JournalArticle) {
  return buildBreadcrumbList([
    { name: "Home", path: "/" },
    { name: "Journal", path: "/journal" },
    { name: article.title, path: `/journal/${article.slug}` },
  ]);
}
