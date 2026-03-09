import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function read(path) {
  return readFileSync(resolve(process.cwd(), path), 'utf8')
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function checkLinkLabels() {
  const files = [
    'src/components/feed/CategoryChips.tsx',
    'src/components/feed/DiscoveryStrip.tsx',
    'src/app/page.tsx',
  ]

  for (const file of files) {
    const source = read(file)
    const linkTags = source.match(/<Link[\s\S]*?<\/Link>/g) || []
    for (const tag of linkTags) {
      const hasLabel = /aria-label=/.test(tag)
      const hasText = />[\s\S]*[A-Za-z0-9][\s\S]*</.test(tag)
      assert(hasLabel || hasText, `${file} contains a Link without discernible text or aria-label.`)
    }
  }
}

function checkProjectsHeadingStructure() {
  const source = read('src/app/projects/page.tsx')
  const h1Count = (source.match(/<h1\b/g) || []).length
  const h2Count = (source.match(/<h2\b/g) || []).length

  assert(h1Count === 1, `Expected exactly one <h1> in /projects template, found ${h1Count}.`)
  assert(h2Count >= 1, 'Expected at least one <h2> in /projects template.')
  assert(source.indexOf('<h1') < source.indexOf('<h2'), 'Expected <h1> to appear before <h2> in /projects template.')
}

checkLinkLabels()
checkProjectsHeadingStructure()
console.log('A11Y regression checks passed.')
