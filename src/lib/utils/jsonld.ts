const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://welovedaily.com'
const SITE_NAME = 'WeLoveDaily'

/**
 * Organization schema — rendered once in root layout
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og-default.jpg`,
    sameAs: [
      'https://www.instagram.com/welovedaily',
      'https://www.linkedin.com/company/welovedaily',
      'https://x.com/welovedaily',
    ],
  }
}

/**
 * WebSite schema with search action — rendered once in root layout
 */
export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * BreadcrumbList schema
 */
export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

/**
 * Article schema for individual post pages
 */
export function articleJsonLd({
  title,
  description,
  slug,
  coverImageUrl,
  publishedAt,
  updatedAt,
  categoryName,
  categorySlug,
  isSponsored,
}: {
  title: string
  description: string
  slug: string
  coverImageUrl: string
  publishedAt: string
  updatedAt?: string
  categoryName: string
  categorySlug: string
  isSponsored?: boolean
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${SITE_URL}/${slug}`,
    image: {
      '@type': 'ImageObject',
      url: coverImageUrl,
      width: 1400,
      height: 900,
    },
    datePublished: publishedAt,
    ...(updatedAt && { dateModified: updatedAt }),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/og-default.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${slug}`,
    },
    articleSection: categoryName,
    ...(isSponsored && { sponsoredBy: { '@type': 'Organization', name: 'Sponsor' } }),
    isAccessibleForFree: true,
  }
}

/**
 * CollectionPage schema for category hub pages
 */
export function collectionPageJsonLd({
  name,
  description,
  slug,
}: {
  name: string
  description?: string
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    ...(description && { description }),
    url: `${SITE_URL}/category/${slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

/**
 * Brand / Organization profile page schema
 */
export function brandProfileJsonLd({
  name,
  slug,
  description,
  website,
  logoUrl,
  coverImageUrl,
  industry,
  headquarters,
  founded,
  socials,
}: {
  name: string
  slug: string
  description?: string
  website?: string
  logoUrl?: string
  coverImageUrl?: string
  industry?: string
  headquarters?: string
  founded?: string
  socials?: Record<string, string | undefined>
}) {
  const sameAs = socials
    ? Object.values(socials).filter((url): url is string => !!url)
    : []

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: website || `${SITE_URL}/brand/${slug}`,
    ...(description && { description }),
    ...(logoUrl && {
      logo: { '@type': 'ImageObject', url: logoUrl },
    }),
    ...(coverImageUrl && {
      image: { '@type': 'ImageObject', url: coverImageUrl },
    }),
    ...(headquarters && {
      location: { '@type': 'Place', name: headquarters },
    }),
    ...(founded && { foundingDate: founded }),
    ...(industry && { knowsAbout: industry }),
    ...(sameAs.length > 0 && { sameAs }),
  }
}

/**
 * Utility: wraps JSON-LD object into a <script> tag string for dangerouslySetInnerHTML
 */
export function jsonLdScript(data: Record<string, unknown>) {
  return JSON.stringify(data)
}
