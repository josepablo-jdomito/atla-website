import { groq } from 'next-sanity'

// ── Shared Projections ─────────────────────

const postCardProjection = groq`{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage {
    asset->,
    alt
  },
  "category": category->{
    _id,
    name,
    "slug": slug.current
  },
  "brand": brand->{
    name,
    "slug": slug.current,
    logo {
      asset->,
      alt
    }
  },
  tags,
  publishedAt,
  isSponsored,
  sponsorLabel
}`

const publishedFilter = groq`
  _type == "post"
  && status == "published"
  && publishedAt <= now()
`

// ── Homepage ───────────────────────────────

export const homepageQuery = groq`{
  "config": *[_type == "homepageConfig"][0] {
    "featuredPost": featuredPost->${postCardProjection},
    "editorsPicks": editorsPicks[]->${postCardProjection},
    inFeedCardFrequency,
    newsletterBlockCopy
  },
  "categories": *[_type == "category"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description
  },
  "latestPosts": *[${publishedFilter}] | order(publishedAt desc) [0...40] ${postCardProjection}
}`

export const loadMorePostsQuery = groq`
  *[${publishedFilter}
    && (publishedAt < $lastPublishedAt
      || (publishedAt == $lastPublishedAt && _id > $lastId))
  ] | order(publishedAt desc) [0...20] ${postCardProjection}
`

// ── Article ────────────────────────────────

export const articleBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && status == "published"][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage {
      asset->,
      alt
    },
    "category": category->{
      _id,
      name,
      "slug": slug.current
    },
    tags,
    "brand": brand->{
      _id,
      name,
      "slug": slug.current,
      tagline,
      logo { asset->, alt },
      website,
      headquarters,
      founded,
      founders,
      industry,
      socials
    },
    body[] {
      ...,
      _type == "image" => {
        asset->,
        alt,
        caption
      }
    },
    credits[] {
      name,
      role,
      url
    },
    publishedAt,
    _updatedAt,
    isSponsored,
    sponsorLabel,
    seo {
      metaTitle,
      metaDescription,
      ogImage {
        asset->
      }
    }
  }
`

export const relatedPostsQuery = groq`
  *[${publishedFilter}
    && category._ref == $categoryId
    && _id != $currentPostId
  ] | order(publishedAt desc) [0...4] ${postCardProjection}
`

// ── Categories ─────────────────────────────

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    "postCount": count(*[_type == "post" && category._ref == ^._id && status == "published" && publishedAt <= now()])
  }
`

export const categoryPageQuery = groq`{
  "category": *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description
  },
  "posts": *[${publishedFilter}
    && category->slug.current == $slug
  ] | order(publishedAt desc) [0...40] ${postCardProjection}
}`

export const categoryLoadMoreQuery = groq`
  *[${publishedFilter}
    && category->slug.current == $slug
    && (publishedAt < $lastPublishedAt
      || (publishedAt == $lastPublishedAt && _id > $lastId))
  ] | order(publishedAt desc) [0...20] ${postCardProjection}
`

// ── Search ─────────────────────────────────

export const searchQuery = groq`
  *[${publishedFilter}
    && (
      title match $searchTerm + "*"
      || excerpt match $searchTerm + "*"
      || $searchTerm in tags
    )
  ] | order(publishedAt desc) [0...30] ${postCardProjection}
`

// ── Sitemap ────────────────────────────────

export const sitemapPostsQuery = groq`
  *[${publishedFilter}] | order(publishedAt desc) {
    "slug": slug.current,
    publishedAt,
    _updatedAt
  }
`

export const sitemapCategoriesQuery = groq`
  *[_type == "category"] {
    "slug": slug.current,
    _updatedAt
  }
`

// ── RSS ────────────────────────────────────

export const rssPostsQuery = groq`
  *[${publishedFilter}] | order(publishedAt desc) [0...50] {
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "category": category->name,
    coverImage {
      asset->
    }
  }
`

// ── Brand ─────────────────────────────────

export const brandBySlugQuery = groq`
  *[_type == "brand" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    tagline,
    description,
    logo { asset->, alt },
    coverImage { asset->, alt },
    website,
    headquarters,
    founded,
    founders,
    industry,
    socials,
    "categories": categories[]->{
      name,
      "slug": slug.current
    },
    isFeatured,
    spottedBy,
    seo {
      metaTitle,
      metaDescription,
      ogImage { asset-> }
    }
  }
`

export const brandPostsQuery = groq`
  *[${publishedFilter}
    && brand->slug.current == $brandSlug
  ] | order(publishedAt desc) [0...40] ${postCardProjection}
`

export const allBrandsQuery = groq`
  *[_type == "brand"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    tagline,
    industry,
    logo {
      asset->,
      alt
    }
  }
`

export const sitemapBrandsQuery = groq`
  *[_type == "brand"] {
    "slug": slug.current,
    _updatedAt
  }
`

// ── Revalidation ───────────────────────────

export const postSlugByIdQuery = groq`
  *[_type == "post" && _id == $id][0] {
    "slug": slug.current,
    "categorySlug": category->slug.current
  }
`
