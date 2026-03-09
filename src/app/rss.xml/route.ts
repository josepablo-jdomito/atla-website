import { client } from '@/lib/sanity/client'
import { urlFor } from '@/lib/sanity/client'
import { rssPostsQuery } from '@/lib/sanity/queries'
import { SITE_ORIGIN, absoluteUrl } from '@/lib/config/site'

interface RssPost {
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  coverImage?: { asset?: { _ref: string } }
  category?: { name?: string | null } | null
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = await client.fetch<RssPost[]>(rssPostsQuery)

  const items = posts
    .map((post) => {
      const imageUrl = post.coverImage
        ? urlFor(post.coverImage).width(800).height(500).format('webp').url()
        : ''
      const categoryName = post.category?.name || 'Uncategorized'
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${absoluteUrl(`/projects/${post.slug}`)}</link>
      <guid isPermaLink="true">${absoluteUrl(`/projects/${post.slug}`)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(categoryName)}</category>
      ${imageUrl ? `<enclosure url="${imageUrl}" type="image/webp" />` : ''}
    </item>`
    })
    .join('')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WeLoveDaily</title>
    <link>${SITE_ORIGIN}</link>
    <description>A curation of the most compelling work in branding, design, and creative direction.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl('/rss.xml')}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
