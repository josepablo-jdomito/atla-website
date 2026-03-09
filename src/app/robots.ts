import type { MetadataRoute } from 'next'
import { SITE_ORIGIN, absoluteUrl } from '@/lib/config/site'
import { SEARCH_INDEXABLE } from '@/lib/utils/searchPolicy'

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/api/', '/submit/thanks', '/advertise/thanks', '/contact/thanks', '/newsletter/thanks', '/*?page=*']
  if (!SEARCH_INDEXABLE) disallow.push('/search')

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_ORIGIN,
  }
}
