/**
 * WeLoveDaily — Sanity Draft Publisher
 *
 * Creates or updates post drafts in Sanity Studio via the mutation API.
 * Designed to be called from Claude Cowork sessions.
 *
 * Usage (from Cowork):
 *   npx tsx scripts/sanity-publish.ts create --json '{ ... }'
 *   npx tsx scripts/sanity-publish.ts update --id <docId> --json '{ ... }'
 *   npx tsx scripts/sanity-publish.ts list-categories
 *   npx tsx scripts/sanity-publish.ts list-brands
 *   npx tsx scripts/sanity-publish.ts get --id <docId>
 *
 * Requires env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_API_TOKEN
 */

import { createClient } from 'next-sanity'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env.local from project root
dotenv.config({ path: resolve(__dirname, '..', '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('Missing required env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

// ── Types ─────────────────────────────────────

interface PostDraft {
  title: string
  slug: string
  excerpt: string
  categoryId: string
  brandId?: string
  tags?: string[]
  body: PortableTextBlock[]
  credits?: Array<{ name: string; role: string; url?: string }>
  isSponsored?: boolean
  sponsorLabel?: string
  publishedAt?: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

interface PortableTextBlock {
  _type: string
  _key?: string
  style?: string
  children?: Array<{
    _type: string
    _key?: string
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _type: string
    _key: string
    href?: string
  }>
  level?: number
  listItem?: string
  // For image blocks
  asset?: { _type: string; _ref: string }
  alt?: string
  caption?: string
}

// ── Markdown → Portable Text ──────────────────

function generateKey(): string {
  return Math.random().toString(36).slice(2, 10)
}

function markdownToPortableText(markdown: string): PortableTextBlock[] {
  const lines = markdown.split('\n')
  const blocks: PortableTextBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip empty lines
    if (line.trim() === '') {
      i++
      continue
    }

    // H2
    if (line.startsWith('## ')) {
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'h2',
        children: parseInline(line.slice(3).trim()),
        markDefs: extractMarkDefs(line.slice(3).trim()),
      })
      i++
      continue
    }

    // H3
    if (line.startsWith('### ')) {
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'h3',
        children: parseInline(line.slice(4).trim()),
        markDefs: extractMarkDefs(line.slice(4).trim()),
      })
      i++
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'blockquote',
        children: parseInline(line.slice(2).trim()),
        markDefs: extractMarkDefs(line.slice(2).trim()),
      })
      i++
      continue
    }

    // Regular paragraph — collect consecutive non-empty lines
    const paragraphLines: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('> ')) {
      paragraphLines.push(lines[i].trim())
      i++
    }
    const text = paragraphLines.join(' ')
    blocks.push({
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      children: parseInline(text),
      markDefs: extractMarkDefs(text),
    })
  }

  return blocks
}

function parseInline(text: string): Array<{ _type: string; _key: string; text: string; marks: string[] }> {
  const children: Array<{ _type: string; _key: string; text: string; marks: string[] }> = []
  // Simple parser: handle **bold**, *italic*, [links](url)
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\))/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: text.slice(lastIndex, match.index),
        marks: [],
      })
    }

    if (match[2]) {
      // Bold
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: match[2],
        marks: ['strong'],
      })
    } else if (match[3]) {
      // Italic
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: match[3],
        marks: ['em'],
      })
    } else if (match[4] && match[5]) {
      // Link
      const linkKey = generateKey()
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: match[4],
        marks: [linkKey],
      })
    }

    lastIndex = match.index + match[0].length
  }

  // Remaining text
  if (lastIndex < text.length) {
    children.push({
      _type: 'span',
      _key: generateKey(),
      text: text.slice(lastIndex),
      marks: [],
    })
  }

  if (children.length === 0) {
    children.push({
      _type: 'span',
      _key: generateKey(),
      text,
      marks: [],
    })
  }

  return children
}

function extractMarkDefs(text: string): Array<{ _type: string; _key: string; href: string }> {
  const defs: Array<{ _type: string; _key: string; href: string }> = []
  const linkRegex = /\[(.+?)\]\((.+?)\)/g
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    defs.push({
      _type: 'link',
      _key: generateKey(),
      href: match[2],
    })
  }

  return defs
}

// ── Slug Helpers ──────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96)
}

// ── Commands ──────────────────────────────────

async function createDraft(input: PostDraft) {
  const slug = input.slug || slugify(input.title)

  // Auto-generate SEO fields if not provided
  const seo: Record<string, unknown> = {}
  if (input.seo?.metaTitle || input.title.length > 60) {
    seo.metaTitle = input.seo?.metaTitle || input.title.slice(0, 60)
  }
  if (input.seo?.metaDescription || input.excerpt) {
    seo.metaDescription = input.seo?.metaDescription || input.excerpt.slice(0, 155)
  }

  const doc = {
    _type: 'post',
    title: input.title,
    slug: { _type: 'slug', current: slug },
    excerpt: input.excerpt,
    category: { _type: 'reference', _ref: input.categoryId },
    ...(input.brandId && { brand: { _type: 'reference', _ref: input.brandId } }),
    tags: input.tags || [],
    body: input.body,
    credits: (input.credits || []).map((c) => ({
      _type: 'object',
      _key: generateKey(),
      name: c.name,
      role: c.role,
      ...(c.url && { url: c.url }),
    })),
    status: 'draft',
    publishedAt: input.publishedAt || null,
    isSponsored: input.isSponsored || false,
    ...(input.isSponsored && input.sponsorLabel && { sponsorLabel: input.sponsorLabel }),
    ...(Object.keys(seo).length > 0 && { seo }),
  }

  const result = await client.create(doc)
  const studioUrl = `https://welovedaily.sanity.studio/structure/post;${result._id}`

  console.log(JSON.stringify({
    success: true,
    documentId: result._id,
    slug,
    status: 'draft',
    studioUrl,
    message: `Draft created: "${input.title}" → ${studioUrl}`,
  }, null, 2))

  return result
}

async function updateDraft(docId: string, updates: Partial<PostDraft>) {
  const patch = client.patch(docId)

  if (updates.title) patch.set({ title: updates.title })
  if (updates.excerpt) patch.set({ excerpt: updates.excerpt })
  if (updates.slug) patch.set({ slug: { _type: 'slug', current: updates.slug } })
  if (updates.tags) patch.set({ tags: updates.tags })
  if (updates.body) patch.set({ body: updates.body })
  if (updates.categoryId) patch.set({ category: { _type: 'reference', _ref: updates.categoryId } })
  if (updates.brandId) patch.set({ brand: { _type: 'reference', _ref: updates.brandId } })
  if (updates.credits) {
    patch.set({
      credits: updates.credits.map((c) => ({
        _type: 'object',
        _key: generateKey(),
        name: c.name,
        role: c.role,
        ...(c.url && { url: c.url }),
      })),
    })
  }
  if (updates.seo) {
    patch.set({
      seo: {
        ...(updates.seo.metaTitle && { metaTitle: updates.seo.metaTitle }),
        ...(updates.seo.metaDescription && { metaDescription: updates.seo.metaDescription }),
      },
    })
  }

  const result = await patch.commit()
  const studioUrl = `https://welovedaily.sanity.studio/structure/post;${result._id}`

  console.log(JSON.stringify({
    success: true,
    documentId: result._id,
    studioUrl,
    message: `Draft updated: ${result._id}`,
  }, null, 2))

  return result
}

async function listCategories() {
  const categories = await client.fetch(`*[_type == "category"] | order(order asc) { _id, name, "slug": slug.current, description }`)
  console.log(JSON.stringify(categories, null, 2))
  return categories
}

async function listBrands() {
  const brands = await client.fetch(`*[_type == "brand"] | order(name asc) { _id, name, "slug": slug.current, tagline, industry }`)
  console.log(JSON.stringify(brands, null, 2))
  return brands
}

async function getDocument(docId: string) {
  const doc = await client.fetch(`*[_id == $id][0]`, { id: docId })
  console.log(JSON.stringify(doc, null, 2))
  return doc
}

async function createFromMarkdown(input: {
  title: string
  excerpt: string
  categoryId: string
  brandId?: string
  tags?: string[]
  credits?: Array<{ name: string; role: string; url?: string }>
  isSponsored?: boolean
  sponsorLabel?: string
  publishedAt?: string
  seo?: { metaTitle?: string; metaDescription?: string }
  markdown: string
}) {
  const { markdown, ...rest } = input
  const body = markdownToPortableText(markdown)
  return createDraft({ ...rest, slug: slugify(input.title), body })
}

// ── CLI Entry ─────────────────────────────────

async function main() {
  const [, , command, ...args] = process.argv

  try {
    switch (command) {
      case 'create': {
        const jsonFlag = args.indexOf('--json')
        if (jsonFlag === -1) {
          console.error('Usage: create --json \'{ ... }\'')
          process.exit(1)
        }
        const data = JSON.parse(args[jsonFlag + 1])
        if (data.markdown) {
          await createFromMarkdown(data)
        } else {
          await createDraft(data)
        }
        break
      }
      case 'update': {
        const idFlag = args.indexOf('--id')
        const jsonFlag2 = args.indexOf('--json')
        if (idFlag === -1 || jsonFlag2 === -1) {
          console.error('Usage: update --id <docId> --json \'{ ... }\'')
          process.exit(1)
        }
        await updateDraft(args[idFlag + 1], JSON.parse(args[jsonFlag2 + 1]))
        break
      }
      case 'list-categories':
        await listCategories()
        break
      case 'list-brands':
        await listBrands()
        break
      case 'get': {
        const getIdFlag = args.indexOf('--id')
        if (getIdFlag === -1) {
          console.error('Usage: get --id <docId>')
          process.exit(1)
        }
        await getDocument(args[getIdFlag + 1])
        break
      }
      default:
        console.error('Commands: create, update, list-categories, list-brands, get')
        process.exit(1)
    }
  } catch (err: any) {
    console.error(JSON.stringify({ success: false, error: err.message }, null, 2))
    process.exit(1)
  }
}

main()
