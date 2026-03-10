import Link from 'next/link'
import Image from 'next/image'
import { SaveButton } from '@/components/actions/SaveButton'
import { buildSanityImageUrl } from '@/lib/utils/image'
import type { PostCard as PostCardType } from '@/types'

interface PostCardLargeProps {
  post: PostCardType
}

export function PostCardLarge({ post }: PostCardLargeProps) {
  const imageUrl = buildSanityImageUrl(post.coverImage, {
    width: 960,
    height: 1200,
    quality: 90,
    format: 'webp',
  })

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
      className="group block bg-wld-white border border-border rounded-card overflow-hidden transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[rgba(29,29,29,0.24)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={imageUrl}
          alt={post.coverImage.alt || post.title}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          priority
          placeholder={post.coverImage.asset?.metadata?.lqip ? 'blur' : 'empty'}
          blurDataURL={post.coverImage.asset?.metadata?.lqip}
        />
        {sponsorText && (
          <span className="absolute top-4 left-4 px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase bg-wld-white text-muted rounded-full">
            {sponsorText}
          </span>
        )}
        <SaveButton projectId={post._id} className="absolute top-4 right-4" />
      </div>
      <div className="p-5 space-y-3">
        <span className="text-[12px] font-medium uppercase tracking-wider text-wld-blue">
          {post.category.name}
        </span>
        <h2 className="font-display text-[22px] md:text-[26px] leading-tight text-wld-ink line-clamp-3">
          {post.title}
        </h2>
        <p className="text-[15px] leading-relaxed text-muted line-clamp-3">
          {post.excerpt}
        </p>
      </div>
    </Link>
  )
}
