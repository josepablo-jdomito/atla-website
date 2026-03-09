import type { PortableTextBlock } from '@portabletext/types'

// ── Core Entities ──────────────────────────

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  order?: number
  postCount?: number
}

export interface PostCard {
  _id: string
  title: string
  slug: string
  excerpt: string
  coverImage: SanityImage
  category: {
    _id: string
    name: string
    slug: string
  }
  brand?: {
    name: string
    slug: string
    logo?: SanityImage
  }
  tags?: string[]
  publishedAt: string
  isSponsored: boolean
  sponsorLabel?: string
}

export interface Post extends PostCard {
  _updatedAt?: string
  body: (PortableTextBlock | SanityImageBlock)[]
  credits: Credit[]
  seo?: SeoFields
}

export interface Credit {
  name: string
  role: string
  url?: string
}

export interface SeoFields {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
}

// ── Sanity Image ───────────────────────────

export interface SanityImage {
  asset: {
    _id: string
    url: string
    metadata?: {
      dimensions: {
        width: number
        height: number
        aspectRatio: number
      }
      lqip?: string
    }
  }
  alt: string
  hotspot?: {
    x: number
    y: number
  }
}

export interface SanityImageBlock {
  _type: 'image'
  asset: SanityImage['asset']
  alt?: string
  caption?: string
}

// ── Homepage Config ────────────────────────

export interface HomepageConfig {
  featuredPost: PostCard | null
  editorsPicks: PostCard[]
  inFeedCardFrequency: number
  newsletterBlockCopy: string
}

export interface HomepageData {
  config: HomepageConfig
  categories: Category[]
  latestPosts: PostCard[]
}

// ── Category Page ──────────────────────────

export interface CategoryPageData {
  category: Category
  posts: PostCard[]
}

// ── Brand ─────────────────────────────────

export interface BrandCard {
  _id: string
  name: string
  slug: string
  tagline?: string
  logo?: SanityImage
  industry?: string
  categories?: { name: string; slug: string }[]
}

export interface Brand extends BrandCard {
  description?: string
  coverImage?: SanityImage
  website?: string
  headquarters?: string
  founded?: string
  founders?: string[]
  socials?: {
    instagram?: string
    linkedin?: string
    twitter?: string
    pinterest?: string
    behance?: string
    dribbble?: string
  }
  isFeatured?: boolean
  spottedBy?: string
  seo?: SeoFields
}

// ── CTA Card ───────────────────────────────

export type CtaCardVariant = 'submit' | 'advertise'

// ── FAQ ────────────────────────────────────

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqGroup {
  title: string
  items: FaqItem[]
}
