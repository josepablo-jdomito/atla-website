import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { PostCard } from '@/components/cards/PostCard'
import type { PostCard as PostCardType } from '@/types'
import { groq } from 'next-sanity'

const featuredPostsQuery = groq`
  *[_type == "post" && status == "published" && publishedAt <= now()]
  | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage { asset->, alt },
    "category": category->{ _id, name, "slug": slug.current },
    "brand": brand->{ name, "slug": slug.current, logo { asset->, alt } },
    tags,
    publishedAt,
    isSponsored,
    sponsorLabel
  }
`

export default async function NotFound() {
  let featured: PostCardType[] = []
  try {
    featured = await client.fetch<PostCardType[]>(featuredPostsQuery)
  } catch {
    // Fail silently — page still renders without featured posts
  }

  return (
    <div className="max-w-container mx-auto px-5 py-20">
      <div className="max-w-[480px] mx-auto text-center">
        <span className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4 block">
          404
        </span>
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-4">
          Page not found
        </h1>
        <p className="text-[16px] leading-relaxed text-muted mb-8">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 text-[14px] font-medium bg-wld-ink text-white rounded-full hover:bg-wld-blue transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/search"
            className="px-5 py-2.5 text-[14px] font-medium border border-border rounded-full hover:border-wld-ink transition-colors"
          >
            Search
          </Link>
        </div>
      </div>

      {/* Featured projects */}
      {featured.length > 0 && (
        <section className="mt-16 pt-12 border-t border-border">
          <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-6 text-center">
            Featured projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
