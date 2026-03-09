import { Buffer } from 'node:buffer'
import { NextRequest, NextResponse } from 'next/server'
import { previewClient } from '@/lib/sanity/client'

export const runtime = 'nodejs'

const MAX_REQUESTS_PER_HOUR = 10
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_TOTAL_IMAGE_BYTES = 40 * 1024 * 1024
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
  'image/gif',
])

const requestBuckets = new Map<string, { count: number; resetAt: number }>()

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96)
}

function parseCsv(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== 'string') return []
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseCredits(value: FormDataEntryValue | null): { name: string; role: string; url?: string }[] {
  if (!value || typeof value !== 'string') return []
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [namePart, rolePart, urlPart] = line.split('-').map((part) => part.trim())
      return {
        name: namePart || line,
        role: rolePart || 'Designer',
        ...(urlPart ? { url: urlPart } : {}),
      }
    })
}

function toPortableText(description: string) {
  return [
    {
      _type: 'block',
      _key: 'submission-description',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 'submission-description-span',
          text: description,
          marks: [],
        },
      ],
    },
  ]
}

function getRequesterIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return req.headers.get('x-real-ip') || 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const bucket = requestBuckets.get(ip)
  if (!bucket || now > bucket.resetAt) {
    requestBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  if (bucket.count >= MAX_REQUESTS_PER_HOUR) return true
  bucket.count += 1
  return false
}

async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  })

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  })
  if (!res.ok) return false
  const payload = (await res.json()) as { success?: boolean }
  return Boolean(payload.success)
}

export async function POST(req: NextRequest) {
  try {
    const requesterIp = getRequesterIp(req)
    if (isRateLimited(requesterIp)) {
      return NextResponse.json(
        { error: 'Too many submissions from this IP. Please try again later.' },
        { status: 429 }
      )
    }

    const form = await req.formData()
    const honeypot = form.get('website')
    if (typeof honeypot === 'string' && honeypot.trim()) {
      return NextResponse.json({ success: true, status: 'submitted' })
    }

    const turnstileToken = form.get('turnstileToken')
    const turnstileValid = await verifyTurnstileToken(
      typeof turnstileToken === 'string' ? turnstileToken : '',
      requesterIp
    )
    if (!turnstileValid) {
      return NextResponse.json({ error: 'Bot validation failed' }, { status: 400 })
    }

    const title = form.get('title')
    const description = form.get('description')
    const studio = form.get('studio')
    const brandName = form.get('brandName')
    const projectUrl = form.get('projectUrl')
    const contactEmail = form.get('contactEmail')
    const categoryIds = form.getAll('categoryIds').filter((v): v is string => typeof v === 'string' && Boolean(v))
    const tags = parseCsv(form.get('tags'))
    const creditRows = parseCredits(form.get('designerCredits'))
    const designerCredits = creditRows.map((item) => item.name)
    const imageFiles = form.getAll('images').filter((entry): entry is File => entry instanceof File && entry.size > 0)

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'This field is required.' }, { status: 400 })
    }
    if (!description || typeof description !== 'string') {
      return NextResponse.json({ error: 'This field is required.' }, { status: 400 })
    }
    if (!studio || typeof studio !== 'string') {
      return NextResponse.json({ error: 'This field is required.' }, { status: 400 })
    }
    if (!contactEmail || typeof contactEmail !== 'string') {
      return NextResponse.json({ error: 'This field is required.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }
    if (categoryIds.length === 0) {
      return NextResponse.json({ error: 'This field is required.' }, { status: 400 })
    }
    if (imageFiles.length === 0) {
      return NextResponse.json({ error: 'This field is required.' }, { status: 400 })
    }
    if (imageFiles.length > 20) {
      return NextResponse.json({ error: 'Maximum 20 images allowed' }, { status: 400 })
    }
    if (!process.env.SANITY_API_TOKEN) {
      return NextResponse.json({ error: 'Submission service is not configured' }, { status: 500 })
    }

    let totalBytes = 0
    for (const file of imageFiles) {
      if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
        return NextResponse.json({ error: 'Unsupported image type uploaded' }, { status: 400 })
      }
      if (file.size > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: 'File exceeds 10MB. Compress and try again.' },
          { status: 400 }
        )
      }
      totalBytes += file.size
    }
    if (totalBytes > MAX_TOTAL_IMAGE_BYTES) {
      return NextResponse.json(
        { error: 'Total image upload size must be 40MB or smaller' },
        { status: 400 }
      )
    }

    const uploadedImages = await Promise.all(
      imageFiles.map(async (file) => {
        const bytes = await file.arrayBuffer()
        const asset = await previewClient.assets.upload('image', Buffer.from(bytes), {
          filename: file.name,
          contentType: file.type,
        })
        return {
          _type: 'image' as const,
          asset: {
            _type: 'reference' as const,
            _ref: asset._id,
          },
          alt: title,
        }
      })
    )

    const slugBase = slugify(title)
    const draftId = `drafts.submission.${Date.now()}`
    const categoryRefs = categoryIds.map((id) => ({
      _type: 'reference' as const,
      _ref: id,
      _key: id,
    }))

    const result = await previewClient.create({
      _id: draftId,
      _type: 'post',
      title,
      slug: {
        _type: 'slug',
        current: `${slugBase || 'project'}-${Date.now().toString().slice(-6)}`,
      },
      excerpt: description.slice(0, 2000),
      body: toPortableText(description),
      studio,
      ...(brandName && typeof brandName === 'string' ? { brandName } : {}),
      ...(projectUrl && typeof projectUrl === 'string' ? { projectUrl } : {}),
      contactEmail,
      designerCredits,
      credits: creditRows.map((row, index) => ({
        _type: 'object',
        _key: `designer-${index}`,
        name: row.name,
        role: row.role,
        ...(row.url ? { url: row.url } : {}),
      })),
      tags,
      status: 'submitted',
      category: {
        _type: 'reference',
        _ref: categoryIds[0],
      },
      categories: categoryRefs,
      coverImage: uploadedImages[0],
      galleryImages: uploadedImages,
      saveCount: 0,
      viewCount: 0,
      isFeaturedProject: false,
      isEditorsPick: false,
    })

    return NextResponse.json({
      success: true,
      submissionId: result._id,
      status: 'submitted',
      message: 'Project submitted for editorial review.',
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Something went wrong. Try again or email us at studio@welovedaily.com.' },
      { status: 500 }
    )
  }
}
