import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity/client'
import { sitemapPostsQuery, sitemapCategoriesQuery, sitemapBrandsQuery } from '@/lib/sanity/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://welovedaily.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/brands`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/categories`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/search`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/submit`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/advertise`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/newsletter`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  // Dynamic: posts
  const posts = await client.fetch<{ slug: string; _updatedAt: string }[]>(sitemapPostsQuery)
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/projects/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Dynamic: categories
  const categories = await client.fetch<{ slug: string }[]>(sitemapCategoriesQuery)
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/category/${cat.slug}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Dynamic: brands
  const brands = await client.fetch<{ slug: string; _updatedAt: string }[]>(sitemapBrandsQuery)
  const brandPages: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${SITE_URL}/studio/${brand.slug}`,
    lastModified: new Date(brand._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...postPages, ...categoryPages, ...brandPages]
}
