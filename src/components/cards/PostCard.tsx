import Link from 'next/link'
import Image from 'next/image'
import { SaveButton } from '@/components/actions/SaveButton'
import { buildSanityImageUrl } from '@/lib/utils/image'
import type { PostCard as PostCardType } from '@/types'

interface PostCardProps {
  post: PostCardType
  priority?: boolean
}

export function PostCard({ post, priority = false }: PostCardProps) {
  const imageUrl = buildSanityImageUrl(post.coverImage, {
    width: 600,
    height: 750,
    quality: 88,
    format: 'webp',
  })

  const sponsorText = post.isSponsored
    ? post.sponsorshipType === 'partnerContent'
      ? 'Partner Content'
      : post.sponsorName
        ? `Supported by ${post.sponsorName}`
        : post.sponsorLabel || 'Supported'
    : null

  const byline = post.studio || post.brandName

  return (
    <Link
      href={`/projects/${post.slug}`}
      className="group block bg-wld-white border border-border rounded-card overflow-hidden hover:shadow-card-hover hover:border-[rgb(var(--wld-ink-rgb)/0.15)] transition-all duration-300 ease-spring"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-card">
        <Image
          src={imageUrl}
          alt={post.coverImage.alt || post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover card-image-zoom"
          priority={priority}
          placeholder={post.coverImage.asset?.metadata?.lqip ? 'blur' : 'empty'}
          blurDataURL={post.coverImage.asset?.metadata?.lqip}
        />
        {sponsorText && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-medium tracking-widest uppercase bg-wld-white/90 text-muted rounded-full backdrop-blur-sm">
            {sponsorText}
          </span>
        )}
        <div className="absolute top-3 right-3">
          <SaveButton projectId={post._id} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-medium uppercase tracking-widest text-wld-blue">
            {post.category.name}
          </span>
          {byline && (
            <span className="text-[10px] uppercase tracking-wider text-muted truncate">
              {byline}
            </span>
          )}
        </div>

        <p className="font-display text-[15px] leading-snug text-wld-ink line-clamp-2 group-hover:text-wld-blue transition-colors">
          {post.title}
        </p>

        {post.excerpt && (
          <p className="text-[12px] leading-relaxed text-muted line-clamp-2">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
