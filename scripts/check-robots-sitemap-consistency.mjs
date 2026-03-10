const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/+$/, '')
const ROBOTS_URL = `${BASE_URL}/robots.txt`
const SITEMAP_URL = process.env.SITEMAP_URL || `${BASE_URL}/sitemap.xml`

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function disallowToRegex(disallowValue) {
  const normalized = disallowValue.trim()
  if (!normalized || normalized === '/') return /^\/.*$/

  const wildcardPattern = escapeRegex(normalized)
    .replace(/\\\*/g, '.*')
    .replace(/\\\?/g, '\\?')
  return new RegExp(`^${wildcardPattern}$`)
}

function parseDisallowRules(robotsText) {
  const rules = []
  for (const rawLine of robotsText.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const match = line.match(/^Disallow:\s*(.*)$/i)
    if (!match) continue
    const value = match[1].trim()
    if (!value) continue
    rules.push(value)
  }
  return rules
}

function extractSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim()).filter(Boolean)
}

const [robotsRes, sitemapRes] = await Promise.all([fetch(ROBOTS_URL), fetch(SITEMAP_URL)])
if (!robotsRes.ok) {
  console.error(`Failed to fetch robots.txt: ${ROBOTS_URL} (status ${robotsRes.status})`)
  process.exit(1)
}
if (!sitemapRes.ok) {
  console.error(`Failed to fetch sitemap: ${SITEMAP_URL} (status ${sitemapRes.status})`)
  process.exit(1)
}

const robotsText = await robotsRes.text()
const sitemapXml = await sitemapRes.text()

const disallowRules = parseDisallowRules(robotsText)
const disallowRegexes = disallowRules.map((rule) => ({ rule, regex: disallowToRegex(rule) }))
const sitemapUrls = extractSitemapLocs(sitemapXml)

const violations = []
for (const url of sitemapUrls) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    violations.push({ url, reason: 'invalid URL in sitemap' })
    continue
  }

  const pathWithQuery = `${parsed.pathname}${parsed.search}`
  const matchedRule = disallowRegexes.find((entry) => entry.regex.test(pathWithQuery))
  if (matchedRule) {
    violations.push({ url, reason: `matches robots disallow '${matchedRule.rule}'` })
  }
}

if (violations.length > 0) {
  console.error('robots/sitemap consistency check failed:')
  for (const violation of violations) {
    console.error(`- ${violation.url} -> ${violation.reason}`)
  }
  process.exit(1)
}

console.log(`robots/sitemap consistency passed. Checked ${sitemapUrls.length} sitemap URLs.`)
