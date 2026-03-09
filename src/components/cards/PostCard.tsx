import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import { SaveButton } from '@/components/actions/SaveButton'
import type { PostCard as PostCardType } from '@/types'

interface PostCardProps {
  post: PostCardType
  priority?: boolean
}

export function PostCard({ post, priority = false }: PostCardProps) {
  const imageUrl = urlFor(post.coverImage)
    .width(600)
    .height(750)
    .format('webp')
    .quality(85)
    .url()

  const sponsorText = post.isSponsored
    ? post.sponsorshipType === 'partnerContent'
      ? 'Partner Content'
      : post.sponsorName
        ? `Sponsored by ${post.sponsorName}`
        : post.sponsorLabel || 'Sponsored'
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
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          priority={priority}
          placeholder={post.coverImage.asset?.metadata?.lqip ? 'blur' : 'empty'}
          blurDataURL={post.coverImage.asset?.metadata?.lqip}
        />
        {sponsorText && (
          <span className="absolute top-3 left-3 px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase bg-wld-white text-muted rounded-full">
            {sponsorText}
          </span>
        )}
        <SaveButton projectId={post._id} className="absolute top-3 right-3" />
      </div>
      <div className="p-4 space-y-2">
        <span className="text-[12px] font-medium uppercase tracking-wider text-wld-blue">
          {post.category.name}
        </span>
        <h3 className="font-primary text-[16px] leading-snug font-semibold text-wld-ink line-clamp-2">
          {post.title}
        </h3>
        {post.studio && (
          <p className="text-[12px] uppercase tracking-wider text-muted">
            {post.studio}
          </p>
        )}
        {!post.studio && post.brandName && (
          <p className="text-[12px] uppercase tracking-wider text-muted">
            {post.brandName}
          </p>
        )}
        <p className="text-[14px] leading-relaxed text-muted line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </Link>
  )
}
