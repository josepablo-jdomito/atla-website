import { NextRequest, NextResponse } from 'next/server'
import { previewClient } from '@/lib/sanity/client'

/**
 * POST /api/draft — Create a new post draft in Sanity
 * PUT  /api/draft — Update an existing draft
 * GET  /api/draft?type=categories|brands|post&id=<docId>
 *
 * All requests require Authorization: Bearer <DRAFT_API_SECRET>
 */

const SECRET = process.env.DRAFT_API_SECRET
const ALLOWED_NON_PUBLISH_STATUSES = new Set(['draft', 'submitted', 'review', 'approved'])

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

function authorize(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  if (!auth || !SECRET) return false
  return auth === `Bearer ${SECRET}`
}

// ── Helpers ────────────────────────────────────

function generateKey(): string {
  return Math.random().toString(36).slice(2, 10)
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96)
}

function sanitizeUrl(url: unknown): string | null {
  if (typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:') {
      return parsed.toString()
    }
  } catch {
    return null
  }

  return null
}

// ── Markdown → Portable Text ──────────────────

function markdownToPortableText(markdown: string) {
  const lines = markdown.split('\n')
  const blocks: any[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') { i++; continue }

    // Headings
    if (line.startsWith('### ')) {
      blocks.push(makeBlock('h3', line.slice(4).trim()))
      i++; continue
    }
    if (line.startsWith('## ')) {
      blocks.push(makeBlock('h2', line.slice(3).trim()))
      i++; continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      blocks.push(makeBlock('blockquote', line.slice(2).trim()))
      i++; continue
    }

    // Paragraph — collect consecutive lines
    const paragraphLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('> ')
    ) {
      paragraphLines.push(lines[i].trim())
      i++
    }
    blocks.push(makeBlock('normal', paragraphLines.join(' ')))
  }

  return blocks
}

function makeBlock(style: string, text: string) {
  const { children, markDefs } = parseInline(text)
  return {
    _type: 'block',
    _key: generateKey(),
    style,
    children,
    markDefs,
  }
}

function parseInline(text: string) {
  const children: any[] = []
  const markDefs: any[] = []
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\))/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      children.push({ _type: 'span', _key: generateKey(), text: text.slice(lastIndex, match.index), marks: [] })
    }

    if (match[2]) {
      children.push({ _type: 'span', _key: generateKey(), text: match[2], marks: ['strong'] })
    } else if (match[3]) {
      children.push({ _type: 'span', _key: generateKey(), text: match[3], marks: ['em'] })
    } else if (match[4] && match[5]) {
      const safeHref = sanitizeUrl(match[5])
      if (safeHref) {
        const linkKey = generateKey()
        markDefs.push({ _type: 'link', _key: linkKey, href: safeHref })
        children.push({ _type: 'span', _key: generateKey(), text: match[4], marks: [linkKey] })
      } else {
        children.push({ _type: 'span', _key: generateKey(), text: match[4], marks: [] })
      }
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    children.push({ _type: 'span', _key: generateKey(), text: text.slice(lastIndex), marks: [] })
  }

  if (children.length === 0) {
    children.push({ _type: 'span', _key: generateKey(), text, marks: [] })
  }

  return { children, markDefs }
}

// ── GET: List categories, brands, or fetch a doc ──

export async function GET(req: NextRequest) {
  if (!authorize(req)) return unauthorized()

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const id = searchParams.get('id')

  try {
    if (type === 'categories') {
      const data = await previewClient.fetch(
        `*[_type == "category"] | order(order asc) { _id, name, "slug": slug.current, description }`
      )
      return NextResponse.json(data)
    }

    if (type === 'brands') {
      const data = await previewClient.fetch(
        `*[_type == "brand"] | order(name asc) { _id, name, "slug": slug.current, tagline, industry }`
      )
      return NextResponse.json(data)
    }

    if (type === 'post' && id) {
      const data = await previewClient.fetch(`*[_id == $id][0]`, { id })
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Provide ?type=categories|brands or ?type=post&id=<docId>' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ── POST: Create a new draft ──────────────────

export async function POST(req: NextRequest) {
  if (!authorize(req)) return unauthorized()

  try {
    const input = await req.json()
    const { title, excerpt, description, categoryId, categoryIds, brandId, brandName, studio, designerCredits, topic, series, relatedProjectIds, tags, credits, isSponsored, sponsorshipType, sponsorName, sponsorLabel, publishedAt, seo, markdown, body } = input
    const normalizedDescription = description || excerpt

    if (!title || !normalizedDescription || !categoryId) {
      return NextResponse.json({ error: 'Required: title, description, categoryId' }, { status: 400 })
    }

    const slug = input.slug || slugify(title)
    const portableTextBody = body || (markdown ? markdownToPortableText(markdown) : [])

    // Auto-generate SEO fields
    const seoFields: Record<string, string> = {}
    if (seo?.metaTitle || title.length > 60) {
      seoFields.metaTitle = seo?.metaTitle || title.slice(0, 60)
    }
    if (seo?.metaDescription || excerpt) {
      seoFields.metaDescription = seo?.metaDescription || excerpt.slice(0, 155)
    }

    const doc = {
      _type: 'post' as const,
      title,
      slug: { _type: 'slug' as const, current: slug },
      excerpt: normalizedDescription,
      category: { _type: 'reference' as const, _ref: categoryId },
      ...(Array.isArray(categoryIds) &&
        categoryIds.length > 0 && {
          categories: categoryIds.map((id: string) => ({
            _type: 'reference' as const,
            _ref: id,
            _key: generateKey(),
          })),
        }),
      ...(brandId && { brand: { _type: 'reference' as const, _ref: brandId } }),
      ...(brandName && { brandName }),
      ...(studio && { studio }),
      ...(Array.isArray(designerCredits) && { designerCredits }),
      ...(topic && { topic }),
      ...(series && { series }),
      ...(Array.isArray(relatedProjectIds) &&
        relatedProjectIds.length > 0 && {
          relatedProjects: relatedProjectIds.map((id: string) => ({
            _type: 'reference' as const,
            _ref: id,
            _key: generateKey(),
          })),
        }),
      tags: tags || [],
      body: portableTextBody,
      credits: (credits || []).map((c: any) => {
        const safeUrl = sanitizeUrl(c.url)
        return {
          _type: 'object' as const,
          _key: generateKey(),
          name: c.name,
          role: c.role,
          ...(safeUrl && { url: safeUrl }),
        }
      }),
      status: 'draft',
      publishedAt: publishedAt || new Date().toISOString(),
      isSponsored: isSponsored || false,
      ...(isSponsored && sponsorshipType && { sponsorshipType }),
      ...(isSponsored && sponsorName && { sponsorName }),
      ...(isSponsored && sponsorLabel && { sponsorLabel }),
      ...(Object.keys(seoFields).length > 0 && { seo: seoFields }),
    }

    const result = await previewClient.create(doc)

    return NextResponse.json({
      success: true,
      documentId: result._id,
      slug,
      status: 'draft',
      studioUrl: `https://welovedaily.sanity.studio/structure/post;${result._id}`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ── PUT: Update an existing draft ─────────────

export async function PUT(req: NextRequest) {
  if (!authorize(req)) return unauthorized()

  try {
    const { documentId, ...updates } = await req.json()

    if (!documentId) {
      return NextResponse.json({ error: 'Required: documentId' }, { status: 400 })
    }

    const patch = previewClient.patch(documentId)

    if (updates.title) patch.set({ title: updates.title })
    if (updates.excerpt) patch.set({ excerpt: updates.excerpt })
    if (updates.slug) patch.set({ slug: { _type: 'slug', current: updates.slug } })
    if (updates.tags) patch.set({ tags: updates.tags })
    if (updates.categoryId) patch.set({ category: { _type: 'reference', _ref: updates.categoryId } })
    if (updates.categoryIds && Array.isArray(updates.categoryIds)) {
      patch.set({
        categories: updates.categoryIds.map((id: string) => ({
          _type: 'reference',
          _ref: id,
          _key: generateKey(),
        })),
      })
    }
    if (updates.brandId) patch.set({ brand: { _type: 'reference', _ref: updates.brandId } })
    if (updates.brandName) patch.set({ brandName: updates.brandName })
    if (updates.studio) patch.set({ studio: updates.studio })
    if (updates.designerCredits) patch.set({ designerCredits: updates.designerCredits })
    if (updates.topic !== undefined) patch.set({ topic: updates.topic })
    if (updates.series !== undefined) patch.set({ series: updates.series })
    if (updates.relatedProjectIds && Array.isArray(updates.relatedProjectIds)) {
      patch.set({
        relatedProjects: updates.relatedProjectIds.map((id: string) => ({
          _type: 'reference',
          _ref: id,
          _key: generateKey(),
        })),
      })
    }
    if (updates.markdown) patch.set({ body: markdownToPortableText(updates.markdown) })
    if (updates.body) patch.set({ body: updates.body })
    if (updates.credits) {
      patch.set({
        credits: updates.credits.map((c: any) => {
          const safeUrl = sanitizeUrl(c.url)
          return {
            _type: 'object',
            _key: generateKey(),
            name: c.name,
            role: c.role,
            ...(safeUrl && { url: safeUrl }),
          }
        }),
      })
    }
    if (updates.seo) {
      patch.set({ seo: updates.seo })
    }
    if (updates.status) {
      if (updates.status === 'published') {
        return NextResponse.json(
          { error: 'Publishing is restricted to manual review in Sanity Studio.' },
          { status: 403 }
        )
      }
      if (!ALLOWED_NON_PUBLISH_STATUSES.has(updates.status)) {
        return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
      }
      patch.set({ status: updates.status })
    }
    if (updates.isSponsored !== undefined) {
      patch.set({ isSponsored: updates.isSponsored })
    }
    if (updates.sponsorshipType) {
      patch.set({ sponsorshipType: updates.sponsorshipType })
    }
    if (updates.sponsorName) {
      patch.set({ sponsorName: updates.sponsorName })
    }
    if (updates.sponsorLabel) {
      patch.set({ sponsorLabel: updates.sponsorLabel })
    }

    const result = await patch.commit()

    return NextResponse.json({
      success: true,
      documentId: result._id,
      studioUrl: `https://welovedaily.sanity.studio/structure/post;${result._id}`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
