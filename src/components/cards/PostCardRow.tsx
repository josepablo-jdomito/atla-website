import Image from 'next/image'
import Link from 'next/link'
import { SaveButton } from '@/components/actions/SaveButton'
import { buildSanityImageUrl } from '@/lib/utils/image'
import type { PostCard } from '@/types'

interface PostCardRowProps {
  post: PostCard
}

export function PostCardRow({ post }: PostCardRowProps) {
  const imageUrl = buildSanityImageUrl(post.coverImage, {
    width: 240,
    height: 160,
    quality: 85,
    format: 'webp',
  })

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
      className="group flex gap-5 py-4 hover:bg-wld-white rounded-xl px-3 -mx-3 transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="w-[100px] h-[70px] sm:w-[130px] sm:h-[90px] rounded-lg overflow-hidden shrink-0 bg-card">
        <Image
          src={imageUrl}
          alt={post.coverImage.alt}
          width={160}
          height={107}
          className="w-full h-full object-cover card-image-zoom"
          {...(blurUrl ? { placeholder: 'blur', blurDataURL: blurUrl } : {})}
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-medium uppercase tracking-widest text-wld-blue">
            {post.category.name}
          </span>
          {sponsorText && (
            <span className="text-[10px] text-muted">· {sponsorText}</span>
          )}
        </div>

        <p className="font-display text-[15px] leading-snug text-wld-ink line-clamp-1 group-hover:text-wld-blue transition-colors">
          {post.title}
        </p>

        <p className="mt-1.5 text-[12px] text-muted leading-relaxed line-clamp-2 hidden sm:block">
          {post.excerpt}
        </p>

        {(post.studio || (post as any).brand?.name) && (
          <span className="mt-1.5 text-[10px] uppercase tracking-wider text-muted">
            By {post.studio || (post as any).brand?.name}
          </span>
        )}
      </div>

      <div className="self-center shrink-0">
        <SaveButton projectId={post._id} />
      </div>
    </Link>
  )
}
