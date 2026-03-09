'use client'

import { useState, useTransition } from 'react'
import { PostCard } from '@/components/cards/PostCard'
import { PostCardRow } from '@/components/cards/PostCardRow'
import { CtaCard } from '@/components/cards/CtaCard'
import { FeedControls, type ViewMode } from '@/components/feed/FeedControls'
import type { PostCard as PostCardType, CtaCardVariant } from '@/types'
import { client } from '@/lib/sanity/client'
import { loadMorePostsQuery } from '@/lib/sanity/queries'

interface PostFeedProps {
  initialPosts: PostCardType[]
  ctaFrequency?: number
  loadMoreQuery?: string
  loadMoreParams?: Record<string, string>
  showControls?: boolean
}

const CTA_SEQUENCE: CtaCardVariant[] = ['submit', 'advertise']

export function PostFeed({
  initialPosts,
  ctaFrequency = 12,
  loadMoreQuery,
  loadMoreParams = {},
  showControls = true,
}: PostFeedProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [hasMore, setHasMore] = useState(initialPosts.length >= 40)
  const [isPending, startTransition] = useTransition()
  const [view, setView] = useState<ViewMode>('grid')

  const loadMore = () => {
    const lastPost = posts[posts.length - 1]
    if (!lastPost) return

    startTransition(async () => {
      const query = loadMoreQuery || loadMorePostsQuery
      const params: Record<string, string> = {
        ...loadMoreParams,
        lastPublishedAt: lastPost.publishedAt,
        lastId: lastPost._id,
      }

      const newPosts = await client.fetch<PostCardType[]>(query, params)
      if (newPosts.length < 20) setHasMore(false)
      setPosts((prev) => [...prev, ...newPosts])
    })
  }

  // Build feed items with interleaved CTAs
  const feedItems: Array<
    | { type: 'post'; data: PostCardType; key: string }
    | { type: 'cta'; variant: CtaCardVariant; key: string }
  > = []

  let ctaIndex = 0
  posts.forEach((post, i) => {
    feedItems.push({ type: 'post', data: post, key: post._id })
    const count = i + 1
    if (count > 0 && count % ctaFrequency === 0) {
      const variant = CTA_SEQUENCE[ctaIndex % CTA_SEQUENCE.length]
      feedItems.push({ type: 'cta', variant, key: `cta-${ctaIndex}` })
      ctaIndex++
    }
  })

  return (
    <div className="space-y-4">
      {/* Controls */}
      {showControls && (
        <FeedControls
          view={view}
          onViewChange={setView}
          resultCount={posts.length}
        />
      )}

      {/* Grid view */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {feedItems.map((item, i) => {
            if (item.type === 'post') {
              return <PostCard key={item.key} post={item.data} priority={i < 2} />
            }
            return <CtaCard key={item.key} variant={item.variant} />
          })}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="space-y-3">
          {feedItems.map((item, i) => {
            if (item.type === 'post') {
              return <PostCardRow key={item.key} post={item.data} />
            }
            return null // Skip CTAs in list view
          })}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="px-6 py-3 text-[14px] font-medium text-wld-ink border border-border rounded-full transition-all duration-200 hover:border-wld-ink disabled:opacity-50"
          >
            {isPending ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  )
}
