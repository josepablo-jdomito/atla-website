import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/client'
import { SaveButton } from '@/components/actions/SaveButton'
import type { PostCard } from '@/types'

interface PostCardRowProps {
  post: PostCard
}

export function PostCardRow({ post }: PostCardRowProps) {
  const imageUrl = urlFor(post.coverImage)
    .width(240)
    .height(160)
    .format('webp')
    .quality(85)
    .url()

  const blurUrl = post.coverImage.asset.metadata?.lqip

  const sponsorText = post.isSponsored
    ? post.sponsorshipType === 'partnerContent'
      ? 'Partner Content'
      : post.sponsorName
        ? `Supported by ${post.sponsorName}`
        : post.sponsorLabel || 'Supported'
    : null

  return (
    <Link
      href={`/projects/${post.slug}`}
      className="
        group flex gap-4 p-3 rounded-card
        border border-transparent
        hover:border-border hover:bg-white
        transition-all duration-200
      "
    >
      {/* Thumbnail */}
      <div className="w-[120px] h-[80px] sm:w-[160px] sm:h-[107px] rounded-lg overflow-hidden shrink-0 bg-card">
        <Image
          src={imageUrl}
          alt={post.coverImage.alt}
          width={160}
          height={107}
          className="w-full h-full object-cover"
          {...(blurUrl ? { placeholder: 'blur', blurDataURL: blurUrl } : {})}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-wld-blue">
            {post.category.name}
          </span>
          {sponsorText && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
              {sponsorText}
            </span>
          )}
        </div>

        <h3 className="text-[15px] font-semibold text-wld-ink leading-snug line-clamp-1 group-hover:text-wld-blue transition-colors">
          {post.title}
        </h3>

        <p className="mt-1 text-[13px] text-muted leading-relaxed line-clamp-2 hidden sm:block">
          {post.excerpt}
        </p>

        {post.studio && <span className="mt-1 text-[12px] text-muted block">By {post.studio}</span>}
        {!post.studio && post.brand && <span className="mt-1 text-[12px] text-muted block">By {post.brand.name}</span>}
        <span className="mt-1 text-[12px] text-wld-blue block">View project -&gt;</span>
      </div>
      <div className="self-start">
        <SaveButton projectId={post._id} />
      </div>
    </Link>
  )
}
