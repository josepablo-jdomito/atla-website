import { PostCardLarge } from '@/components/cards/PostCardLarge'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/client'
import type { PostCard as PostCardType } from '@/types'

interface FeaturedStripProps {
  featuredPost: PostCardType | null
  editorsPicks: PostCardType[]
}

export function FeaturedStrip({ featuredPost, editorsPicks }: FeaturedStripProps) {
  if (!featuredPost && editorsPicks.length === 0) return null

  return (
    <section className="space-y-6">
      <div className="flex items-baseline gap-8">
        {featuredPost && (
          <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted">Featured</h2>
        )}
        {editorsPicks.length > 0 && (
          <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted hidden md:block">
            Editor&rsquo;s Picks
          </h2>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuredPost && (
          <div>
            <PostCardLarge post={featuredPost} />
          </div>
        )}

        {editorsPicks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted md:hidden">
              Editor&rsquo;s Picks
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {editorsPicks.slice(0, 3).map((post, i) => (
                <PickCard key={post._id} post={post} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function PickCard({ post, index }: { post: PostCardType; index: number }) {
  const imageUrl = urlFor(post.coverImage).width(200).height(250).format('webp').quality(80).url()

  return (
    <Link
      href={`/${post.slug}`}
      className="group flex gap-4 bg-wld-white border border-border rounded-card overflow-hidden transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[rgba(29,29,29,0.24)]"
    >
      <div className="relative w-24 md:w-28 shrink-0 aspect-[4/5]">
        <img
          src={imageUrl}
          alt={post.coverImage.alt || post.title}
          className="w-full h-full object-cover"
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      </div>
      <div className="flex flex-col justify-center py-3 pr-4 space-y-1.5 min-w-0">
        <span className="text-[11px] font-medium uppercase tracking-wider text-wld-blue">
          {post.category.name}
        </span>
        <h3 className="text-[15px] leading-snug font-semibold text-wld-ink line-clamp-2">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}
