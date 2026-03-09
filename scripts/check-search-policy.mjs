#!/usr/bin/env node

const baseUrl = process.env.POLICY_CHECK_BASE_URL || 'http://localhost:3000'

async function getText(path) {
  const url = `${baseUrl}${path}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to load ${path} (${response.status})`)
  }
  return response.text()
}

async function run() {
  const robots = await getText('/robots.txt')
  const sitemap = await getText('/sitemap.xml')

  const robotsDisallowsSearch = /Disallow:\s*\/search\b/i.test(robots)
  const sitemapIncludesSearch = /<loc>[^<]*\/search<\/loc>/i.test(sitemap)

  if (robotsDisallowsSearch === sitemapIncludesSearch) {
    const state = robotsDisallowsSearch ? 'disallowed+present' : 'allowed+absent'
    throw new Error(`/search policy mismatch: robots/sitemap are contradictory (${state})`)
  }

  const policy = robotsDisallowsSearch ? 'not indexable' : 'indexable'
  console.log(`PASS /search is ${policy} and robots/sitemap are aligned`)
}

run().catch((error) => {
  console.error(`Policy check failed: ${error.message}`)
  process.exit(1)
})
