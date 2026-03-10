const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/+$/, '')
const SITEMAP_URL = process.env.SITEMAP_URL || `${BASE_URL}/sitemap.xml`
const MAX_SITEMAP_ROUTES = Number(process.env.CHECK_MAX_ROUTES || 100)
const MAX_LINKS_PER_PAGE = Number(process.env.CHECK_MAX_LINKS_PER_ROUTE || 80)

const NAV_PATHS = ['/', '/projects', '/articles', '/submit', '/categories', '/newsletter']

function normalizeInternalUrl(href, pageUrl) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
    return null
  }

  try {
    const resolved = new URL(href, pageUrl)
    if (resolved.host !== new URL(BASE_URL).host) return null
    resolved.hash = ''
    return resolved.toString()
  } catch {
    return null
  }
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim()).filter(Boolean)
}

function extractLinks(html, pageUrl) {
  const links = new Set()
  for (const match of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
    const normalized = normalizeInternalUrl(match[1], pageUrl)
    if (normalized) links.add(normalized)
  }
  return [...links]
}

async function request(url) {
  try {
    return await fetch(url, { redirect: 'manual' })
  } catch {
    return null
  }
}

function toCrawlUrl(url) {
  try {
    const parsed = new URL(url)
    return `${BASE_URL}${parsed.pathname}${parsed.search}`
  } catch {
    return url
  }
}

const sitemapResponse = await request(SITEMAP_URL)
if (!sitemapResponse || sitemapResponse.status >= 400) {
  console.error(`Unable to fetch sitemap: ${SITEMAP_URL}`)
  process.exit(1)
}

const sitemapXml = await sitemapResponse.text()
const sitemapUrls = extractLocs(sitemapXml).slice(0, MAX_SITEMAP_ROUTES)
const seedUrls = [...new Set([...NAV_PATHS.map((path) => `${BASE_URL}${path}`), ...sitemapUrls])]
const broken = []

for (const seedUrl of seedUrls) {
  const pageRes = await request(toCrawlUrl(seedUrl))
  if (!pageRes) {
    broken.push({ source: 'SEED', url: seedUrl, status: 'NETWORK_ERROR' })
    continue
  }

  if (pageRes.status >= 400) {
    broken.push({ source: 'SEED', url: seedUrl, status: pageRes.status })
    continue
  }

  const contentType = pageRes.headers.get('content-type') || ''
  if (!contentType.includes('text/html')) continue

  const html = await pageRes.text()
  const links = extractLinks(html, seedUrl).slice(0, MAX_LINKS_PER_PAGE)

  for (const link of links) {
    const linkRes = await request(toCrawlUrl(link))
    if (!linkRes) {
      broken.push({ source: seedUrl, url: link, status: 'NETWORK_ERROR' })
      continue
    }
    if (linkRes.status >= 400) {
      broken.push({ source: seedUrl, url: link, status: linkRes.status })
    }
  }
}

if (broken.length > 0) {
  console.error('Broken-link check failed:')
  for (const item of broken) {
    console.error(`- source=${item.source} status=${item.status} url=${item.url}`)
  }
  process.exit(1)
}

console.log(
  `Broken-link check passed. Seeds checked: ${seedUrls.length}, nav routes: ${NAV_PATHS.length}, sitemap sample: ${sitemapUrls.length}.`
)
