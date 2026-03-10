import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity/client'
import { sitemapPostsQuery, sitemapCategoriesQuery, sitemapBrandsQuery } from '@/lib/sanity/queries'
import { absoluteUrl } from '@/lib/config/site'
import { SEARCH_INDEXABLE } from '@/lib/utils/searchPolicy'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1.0 },
    { url: absoluteUrl('/projects'), changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/articles'), changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/brands'), changeFrequency: 'weekly', priority: 0.8 },
    { url: absoluteUrl('/categories'), changeFrequency: 'weekly', priority: 0.7 },
    { url: absoluteUrl('/submit'), changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteUrl('/advertise'), changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteUrl('/newsletter'), changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteUrl('/contact'), changeFrequency: 'monthly', priority: 0.4 },
    { url: absoluteUrl('/faqs'), changeFrequency: 'monthly', priority: 0.5 },
    { url: absoluteUrl('/careers'), changeFrequency: 'monthly', priority: 0.4 },
    { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.5 },
    { url: absoluteUrl('/privacy'), changeFrequency: 'yearly', priority: 0.2 },
    { url: absoluteUrl('/cookies'), changeFrequency: 'yearly', priority: 0.2 },
    { url: absoluteUrl('/terms'), changeFrequency: 'yearly', priority: 0.2 },
  ]

  // Dynamic: posts
  const posts = await client.fetch<{ slug: string; _updatedAt: string }[]>(sitemapPostsQuery)
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/projects/${post.slug}`),
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Dynamic: categories
  const categories = await client.fetch<{ slug: string; _updatedAt: string }[]>(sitemapCategoriesQuery)
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: absoluteUrl(`/category/${cat.slug}`),
    lastModified: new Date(cat._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Dynamic: brands
  const brands = await client.fetch<{ slug: string; _updatedAt: string }[]>(sitemapBrandsQuery)
  const brandPages: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: absoluteUrl(`/studio/${brand.slug}`),
    lastModified: new Date(brand._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const searchPage = SEARCH_INDEXABLE
    ? [{ url: absoluteUrl('/search'), changeFrequency: 'monthly' as const, priority: 0.5 }]
    : []

  return [...staticPages, ...searchPage, ...postPages, ...categoryPages, ...brandPages]
}
