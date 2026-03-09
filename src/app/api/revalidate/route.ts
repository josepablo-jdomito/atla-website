import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { client } from '@/lib/sanity/client'
import { postSlugByIdQuery } from '@/lib/sanity/queries'

const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  try {
    if (!WEBHOOK_SECRET) {
      return NextResponse.json({ message: 'Webhook secret is not configured' }, { status: 500 })
    }

    const { isValidSignature, body } = await parseBody<{
      _type: string
      _id: string
      slug?: { current: string }
    }>(req, WEBHOOK_SECRET)

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }

    if (!body?._type) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })
    }

    // Revalidate based on document type
    switch (body._type) {
      case 'post': {
        // Revalidate the specific article page
        const slug = body.slug?.current
        if (slug) {
          revalidatePath(`/${slug}`)
        } else {
          // Slug might not be in the webhook payload; fetch it
          const post = await client.fetch<{ slug: string } | null>(postSlugByIdQuery, {
            id: body._id,
          })
          if (post?.slug) {
            revalidatePath(`/${post.slug}`)
          }
        }
        // Always revalidate homepage and category pages when a post changes
        revalidatePath('/')
        revalidatePath('/category/[slug]', 'page')
        break
      }
      case 'category': {
        revalidatePath('/')
        revalidatePath('/categories')
        revalidatePath('/category/[slug]', 'page')
        break
      }
      case 'brand': {
        const brandSlug = body.slug?.current
        if (brandSlug) {
          revalidatePath(`/brand/${brandSlug}`)
        }
        revalidatePath('/brands')
        revalidatePath('/')
        break
      }
      case 'homepageConfig': {
        revalidatePath('/')
        break
      }
      default: {
        // Unknown type — revalidate everything
        revalidatePath('/')
      }
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: body._type,
    })
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
