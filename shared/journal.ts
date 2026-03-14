export type JournalBodySection = {
  paragraphs: string[];
  image?: string;
  wideImage?: string;
};

export type JournalArticle = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  heroImage: string;
  coverImage: string;
  introParagraphs: string[];
  bodySections: JournalBodySection[];
  authorName?: string;
  sourceName?: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
};
