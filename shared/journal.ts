export type JournalBodySection = {
  paragraphs: string[];
  image?: string;
  wideImage?: string;
};

export type JournalPortableTextSpan = {
  _key?: string;
  _type?: string;
  text?: string;
  marks?: string[];
  [key: string]: unknown;
};

export type JournalPortableTextMarkDef = {
  _key?: string;
  _type?: string;
  href?: string;
  blank?: boolean;
  [key: string]: unknown;
};

export type JournalPortableTextAsset = {
  url?: string;
  metadata?: {
    dimensions?: {
      width?: number;
      height?: number;
      aspectRatio?: number;
    };
  };
};

export type JournalPortableTextBlock = {
  _key?: string;
  _type: string;
  style?: string;
  children?: JournalPortableTextSpan[];
  markDefs?: JournalPortableTextMarkDef[];
  alt?: string;
  caption?: string;
  asset?: JournalPortableTextAsset;
  [key: string]: unknown;
};

export type JournalCategory = {
  title: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type JournalArticle = {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  date: string;
  excerpt: string;
  heroImage: string;
  coverImage: string;
  body: JournalPortableTextBlock[];
  introParagraphs: string[];
  bodySections: JournalBodySection[];
  authorName?: string;
  sourceName?: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
};
