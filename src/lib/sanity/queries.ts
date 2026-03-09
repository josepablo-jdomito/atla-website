import { groq } from 'next-sanity'

const postCardProjection = groq`{
  _id,
  contentType,
  title,
  "slug": slug.current,
  excerpt,
  brandName,
  studio,
  designerCredits,
  topic,
  series,
  coverImage {
    asset->,
    alt
  },
  "category": category->{
    _id,
    name,
    "slug": slug.current
  },
  "categories": categories[]->{
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
  sponsorshipType,
  sponsorName,
  sponsorLabel,
  saveCount,
  viewCount,
  isFeaturedProject,
  isEditorsPick
}`

const publishedFilter = groq`
  _type == "post"
  && status == "published"
  && publishedAt <= now()
`

const articleContentFilter = groq`contentType == "article"`

const projectContentFilter = groq`contentType == "project"`

const trendingScore = groq`(coalesce(saveCount, 0) * 4 + coalesce(viewCount, 0))`

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
  "featuredProjects": *[${publishedFilter} && isFeaturedProject == true] | order(publishedAt desc) [0...6] ${postCardProjection},
  "latestProjects": *[${publishedFilter}] | order(publishedAt desc) [0...40] ${postCardProjection},
  "trendingProjects": *[${publishedFilter}] | order(${trendingScore} desc, publishedAt desc) [0...20] ${postCardProjection},
  "mostSavedProjects": *[${publishedFilter}] | order(coalesce(saveCount, 0) desc, publishedAt desc) [0...20] ${postCardProjection}
}`

export const loadMorePostsQuery = groq`
  *[${publishedFilter}
    && (publishedAt < $lastPublishedAt
      || (publishedAt == $lastPublishedAt && _id > $lastId))
  ] | order(publishedAt desc) [0...20] ${postCardProjection}
`

export const allProjectsQuery = groq`
  *[${publishedFilter}] | order(publishedAt desc) [0...120] ${postCardProjection}
`

export const allProjectOnlyQuery = groq`
  *[${publishedFilter} && ${projectContentFilter}] | order(publishedAt desc) [0...120] ${postCardProjection}
`

export const loadMoreProjectOnlyQuery = groq`
  *[${publishedFilter}
    && ${projectContentFilter}
    && (publishedAt < $lastPublishedAt
      || (publishedAt == $lastPublishedAt && _id > $lastId))
  ] | order(publishedAt desc) [0...20] ${postCardProjection}
`

export const allArticlesQuery = groq`
  *[${publishedFilter} && ${articleContentFilter}] | order(publishedAt desc) [0...120] ${postCardProjection}
`

export const loadMoreArticlesQuery = groq`
  *[${publishedFilter}
    && ${articleContentFilter}
    && (publishedAt < $lastPublishedAt
      || (publishedAt == $lastPublishedAt && _id > $lastId))
  ] | order(publishedAt desc) [0...20] ${postCardProjection}
`

export const articleBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && status == "published"][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    studio,
    designerCredits,
    topic,
    series,
    coverImage {
      asset->,
      alt
    },
    galleryImages[] {
      asset->,
      alt,
      caption
    },
    "category": category->{
      _id,
      name,
      "slug": slug.current
    },
    "categories": categories[]->{
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
    brandName,
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
    "relatedProjects": relatedProjects[]->${postCardProjection},
    publishedAt,
    _updatedAt,
    isSponsored,
    sponsorshipType,
    sponsorName,
    sponsorLabel,
    saveCount,
    viewCount,
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
    && !(_id in $excludeIds)
    && (
      category._ref == $categoryId
      || $categoryId in categories[]._ref
      || (defined($topic) && $topic != "" && topic == $topic)
      || (defined($series) && $series != "" && series == $series)
      || count((tags[])[@ in $tags]) > 0
    )
    && _id != $currentPostId
  ] | order(
    (category._ref == $categoryId || $categoryId in categories[]._ref) desc,
    (defined($topic) && $topic != "" && topic == $topic) desc,
    (defined($series) && $series != "" && series == $series) desc,
    count((tags[])[@ in $tags]) desc,
    publishedAt desc
  ) [0...6] ${postCardProjection}
`

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    "postCount": count(*[_type == "post" && status == "published" && publishedAt <= now() && (category._ref == ^._id || ^._id in categories[]._ref)])
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
    && (
      category->slug.current == $slug
      || $slug in categories[]->slug.current
    )
  ] | order(publishedAt desc) [0...40] ${postCardProjection}
}`

export const categoryLoadMoreQuery = groq`
  *[${publishedFilter}
    && (
      category->slug.current == $categorySlug
      || $categorySlug in categories[]->slug.current
    )
    && (publishedAt < $lastPublishedAt
      || (publishedAt == $lastPublishedAt && _id > $lastId))
  ] | order(publishedAt desc) [0...20] ${postCardProjection}
`

export const searchQuery = groq`{
  "projects": *[${publishedFilter}
    && (
      title match $searchTerm
      || excerpt match $searchTerm
      || studio match $searchTerm
      || brandName match $searchTerm
      || $rawTerm in tags
      || category->name match $searchTerm
      || $rawTerm in categories[]->name
      || count(designerCredits[@ match $searchTerm]) > 0
      || count(credits[name match $searchTerm]) > 0
      || brand->name match $searchTerm
    )
  ] | order(publishedAt desc) [0...30] ${postCardProjection},
  "studios": *[_type == "brand" && (name match $searchTerm || tagline match $searchTerm || industry match $searchTerm)] | order(name asc) [0...12] {
    _id,
    name,
    "slug": slug.current,
    tagline
  },
  "categories": *[_type == "category" && (name match $searchTerm || description match $searchTerm)] | order(name asc) [0...12] {
    _id,
    name,
    "slug": slug.current,
    description
  }
}`

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

export const postSlugByIdQuery = groq`
  *[_type == "post" && _id == $id][0] {
    "slug": slug.current,
    "categorySlug": category->slug.current
  }
`
