const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/+$/, '')
const SITEMAP_URL = process.env.SITEMAP_URL || `${BASE_URL}/sitemap.xml`
const MAX_ROUTES = Number(process.env.CHECK_MAX_ROUTES || 80)
const MAX_LINKS_PER_ROUTE = Number(process.env.CHECK_MAX_LINKS_PER_ROUTE || 40)
const EXPECTED_HOST = process.env.EXPECTED_CANONICAL_HOST || new URL(BASE_URL).host

function isSkippableHref(href) {
  return !href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')
}

function normalizeInternalUrl(href, base) {
  if (isSkippableHref(href)) return null

  try {
    const resolved = new URL(href, base)
    if (resolved.host !== EXPECTED_HOST) return null
    resolved.hash = ''
    return resolved.toString()
  } catch {
    return null
  }
}

function toCrawlUrl(expectedUrl) {
  try {
    const parsed = new URL(expectedUrl)
    return `${BASE_URL}${parsed.pathname}${parsed.search}`
  } catch {
    return expectedUrl
  }
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim()).filter(Boolean)
}

function extractInternalLinks(html, pageUrl) {
  const links = new Set()
  for (const match of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
    const normalized = normalizeInternalUrl(match[1], pageUrl)
    if (normalized) links.add(normalized)
  }
  return [...links]
}

function findMetaValue(html, matcher) {
  const match = html.match(matcher)
  return match?.[1]?.trim() || null
}

function extractCanonicalAndOgUrl(html) {
  const canonical = findMetaValue(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i)
  const ogUrl =
    findMetaValue(html, /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
    findMetaValue(html, /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:url["'][^>]*>/i)

  return { canonical, ogUrl }
}

async function request(url) {
  try {
    const response = await fetch(url, { redirect: 'manual' })
    return response
  } catch {
    return null
  }
}

const sitemapResponse = await request(SITEMAP_URL)
if (!sitemapResponse || sitemapResponse.status >= 400) {
  console.error(`Unable to fetch sitemap: ${SITEMAP_URL}`)
  process.exit(1)
}

const sitemapXml = await sitemapResponse.text()
const sitemapUrls = extractLocs(sitemapXml)
if (sitemapUrls.length === 0) {
  console.error(`No URLs found in sitemap: ${SITEMAP_URL}`)
  process.exit(1)
}

const sampledRoutes = sitemapUrls.slice(0, MAX_ROUTES)
const brokenSitemapUrls = []
const brokenLinksByRoute = new Map()
const mixedDomainCanonicals = []
const mixedDomainOgUrls = []

for (const routeUrl of sampledRoutes) {
  let parsedRoute
  try {
    parsedRoute = new URL(routeUrl)
  } catch {
    brokenSitemapUrls.push({ url: routeUrl, status: 'INVALID_URL' })
    continue
  }

  if (parsedRoute.host !== EXPECTED_HOST) {
    brokenSitemapUrls.push({ url: routeUrl, status: `UNEXPECTED_HOST(${parsedRoute.host})` })
    continue
  }

  const routeResponse = await request(toCrawlUrl(routeUrl))
  if (!routeResponse) {
    brokenSitemapUrls.push({ url: routeUrl, status: 'NETWORK_ERROR' })
    continue
  }

  if (routeResponse.status >= 400) {
    brokenSitemapUrls.push({ url: routeUrl, status: routeResponse.status })
    continue
  }

  const contentType = routeResponse.headers.get('content-type') || ''
  if (!contentType.includes('text/html')) continue

  const html = await routeResponse.text()
  const { canonical, ogUrl } = extractCanonicalAndOgUrl(html)

  if (canonical) {
    try {
      if (new URL(canonical).host !== EXPECTED_HOST) {
        mixedDomainCanonicals.push({ route: routeUrl, canonical })
      }
    } catch {
      mixedDomainCanonicals.push({ route: routeUrl, canonical })
    }
  }

  if (ogUrl) {
    try {
      if (new URL(ogUrl).host !== EXPECTED_HOST) {
        mixedDomainOgUrls.push({ route: routeUrl, ogUrl })
      }
    } catch {
      mixedDomainOgUrls.push({ route: routeUrl, ogUrl })
    }
  }

  const internalLinks = extractInternalLinks(html, routeUrl).slice(0, MAX_LINKS_PER_ROUTE)
  for (const linkUrl of internalLinks) {
    const linkResponse = await request(toCrawlUrl(linkUrl))

    if (!linkResponse) {
      const broken = brokenLinksByRoute.get(routeUrl) || []
      broken.push({ url: linkUrl, status: 'NETWORK_ERROR' })
      brokenLinksByRoute.set(routeUrl, broken)
      continue
    }

    if (linkResponse.status >= 400) {
      const broken = brokenLinksByRoute.get(routeUrl) || []
      broken.push({ url: linkUrl, status: linkResponse.status })
      brokenLinksByRoute.set(routeUrl, broken)
    }
  }
}

console.log(`Sitemap URLs checked: ${sampledRoutes.length}`)

if (brokenSitemapUrls.length > 0) {
  console.log('\nBroken sitemap URLs (4xx/5xx):')
  for (const item of brokenSitemapUrls) {
    console.log(`- ${item.status} ${item.url}`)
  }
}

if (brokenLinksByRoute.size > 0) {
  console.log('\nBroken internal links by route:')
  for (const [route, links] of brokenLinksByRoute.entries()) {
    console.log(`- Route: ${route}`)
    for (const link of links) {
      console.log(`  - ${link.status} ${link.url}`)
    }
  }
}

if (mixedDomainCanonicals.length > 0) {
  console.log('\nMixed-domain canonicals found:')
  for (const item of mixedDomainCanonicals) {
    console.log(`- ${item.route} -> ${item.canonical}`)
  }
}

if (mixedDomainOgUrls.length > 0) {
  console.log('\nMixed-domain og:url tags found:')
  for (const item of mixedDomainOgUrls) {
    console.log(`- ${item.route} -> ${item.ogUrl}`)
  }
}

const hasFailures =
  brokenSitemapUrls.length > 0 ||
  brokenLinksByRoute.size > 0 ||
  mixedDomainCanonicals.length > 0 ||
  mixedDomainOgUrls.length > 0

if (hasFailures) {
  process.exit(1)
}

console.log('\nSitemap and link health check passed.')
