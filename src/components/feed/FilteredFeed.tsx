'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import { PostCardRow } from '@/components/cards/PostCardRow'
import { isArticlePost } from '@/lib/utils/contentType'
import { FilterDrawer, type FilterState } from './FilterDrawer'
import type { PostCard as PostCardType, Category } from '@/types'

type ViewMode = 'masonry' | 'list'

const PAGE_SIZE = 40

interface FilteredFeedProps {
  allPosts: PostCardType[]
  categories: Category[]
  allTags: string[]
  hideTypeFilter?: boolean
  defaultType?: FilterState['type']
}

function FilterIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function FilterChip({
  label,
  onRemove,
  blue = false,
}: {
  label: string
  onRemove: () => void
  blue?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 pl-2.5 pr-1.5 rounded-full border text-[11px] font-medium ${
        blue
          ? 'bg-wld-blue/8 border-wld-blue/30 text-wld-blue'
          : 'bg-wld-white border-border text-wld-ink'
      }`}
    >
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="opacity-50 hover:opacity-100 transition-opacity"
      >
        <XIcon />
      </button>
    </span>
  )
}

function MasonryTile({ post, large, priority = false }: { post: PostCardType; large: boolean; priority?: boolean }) {
  const imageUrl = urlFor(post.coverImage).width(900).height(700).format('webp').quality(82).url()

  return (
    <Link
      href={`/projects/${post.slug}`}
      className={`group relative rounded-card overflow-hidden bg-card ${
        large ? 'row-span-2' : 'row-span-1'
      }`}
    >
      <Image
        src={imageUrl}
        alt={
          post.coverImage.alt && post.coverImage.alt !== 'Cover image placeholder.'
            ? post.coverImage.alt
            : post.title
        }
        fill
        className="object-cover card-image-zoom"
        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
        priority={priority}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/65 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute left-3 right-3 bottom-3 text-white">
        <p className="text-[9px] font-medium uppercase tracking-widest text-white/70 mb-0.5">
          {post.category?.name}
        </p>
        <p className={`leading-snug font-medium ${large ? 'text-[14px]' : 'text-[12px]'} line-clamp-2`}>
          {post.title}
        </p>
      </div>
    </Link>
  )
}

export function FilteredFeed({
  allPosts,
  categories,
  allTags,
  hideTypeFilter = false,
  defaultType = 'all',
}: FilteredFeedProps) {
  const [filters, setFilters] = useState<FilterState>({
    sort: 'latest',
    type: defaultType,
    category: null,
    tags: [],
  })
  const [viewMode, setViewMode] = useState<ViewMode>('masonry')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const latestPosts = allPosts
  const trendingPosts = useMemo(
    () =>
      [...allPosts].sort((a, b) => {
        const scoreA = (a.saveCount ?? 0) * 4 + (a.viewCount ?? 0)
        const scoreB = (b.saveCount ?? 0) * 4 + (b.viewCount ?? 0)
        return scoreB - scoreA
      }),
    [allPosts],
  )
  const mostSavedPosts = useMemo(
    () => [...allPosts].sort((a, b) => (b.saveCount ?? 0) - (a.saveCount ?? 0)),
    [allPosts],
  )

  const basePosts =
    filters.sort === 'trending'
      ? trendingPosts
      : filters.sort === 'most-saved'
      ? mostSavedPosts
      : latestPosts

  const filteredPosts = useMemo(() => {
    let posts = basePosts
    if (filters.category) {
      posts = posts.filter(
        (p) =>
          p.category?.slug === filters.category ||
          p.categories?.some((c) => c.slug === filters.category),
      )
    }
    if (filters.type === 'articles') {
      posts = posts.filter((p) => isArticlePost(p))
    } else if (filters.type === 'projects') {
      posts = posts.filter((p) => !isArticlePost(p))
    }
    if (filters.tags.length > 0) {
      posts = posts.filter((p) => filters.tags.some((tag) => p.tags?.includes(tag)))
    }
    return posts
  }, [basePosts, filters])

  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPosts.length

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (!hideTypeFilter && filters.type !== 'all' ? 1 : 0) +
    filters.tags.length +
    (filters.sort !== 'latest' ? 1 : 0)

  const removeFilter = (key: keyof FilterState, value?: string) => {
    setFilters((f) => {
      if (key === 'category') return { ...f, category: null }
      if (key === 'type') return { ...f, type: 'all' }
      if (key === 'sort') return { ...f, sort: 'latest' }
      if (key === 'tags' && value) return { ...f, tags: f.tags.filter((t) => t !== value) }
      return f
    })
    setVisibleCount(PAGE_SIZE)
  }

  const applyFilters = (next: FilterState) => {
    setFilters(next)
    setVisibleCount(PAGE_SIZE)
  }

  const clearAll = () => {
    setFilters({ sort: 'latest', type: defaultType, category: null, tags: [] })
    setVisibleCount(PAGE_SIZE)
  }

  const categoryLabel = filters.category
    ? (categories.find((c) => c.slug === filters.category)?.name ?? filters.category)
    : null

  return (
    <>
      <FilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApply={applyFilters}
        categories={categories}
        allTags={allTags}
        current={filters}
        resultCount={filteredPosts.length}
        hideTypeFilter={hideTypeFilter}
      />

      <div className="space-y-6">
        {/* Controls row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {filters.sort !== 'latest' && (
              <FilterChip
                label={filters.sort === 'trending' ? 'Trending' : 'Most Saved'}
                onRemove={() => removeFilter('sort')}
              />
            )}
            {!hideTypeFilter && filters.type !== 'all' && (
              <FilterChip
                label={filters.type === 'projects' ? 'Projects' : 'Articles'}
                onRemove={() => removeFilter('type')}
              />
            )}
            {categoryLabel && (
              <FilterChip label={categoryLabel} onRemove={() => removeFilter('category')} />
            )}
            {filters.tags.map((tag) => (
              <FilterChip
                key={tag}
                label={tag}
                onRemove={() => removeFilter('tags', tag)}
                blue
              />
            ))}
            {activeFilterCount > 1 && (
              <button
                onClick={clearAll}
                className="text-[11px] text-muted hover:text-wld-ink transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setDrawerOpen(true)}
              className={`h-7 px-3 rounded-full border text-[11px] inline-flex items-center gap-1.5 transition-all ${
                activeFilterCount > 0
                  ? 'border-wld-blue text-wld-blue bg-wld-blue/5'
                  : 'border-border text-muted hover:text-wld-ink hover:border-[rgb(var(--wld-ink-rgb)/0.25)]'
              }`}
            >
              <FilterIcon />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-wld-blue text-white text-[9px] flex items-center justify-center font-medium">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex items-center h-7 rounded-full border border-border overflow-hidden">
              <button
                onClick={() => setViewMode('masonry')}
                aria-label="Grid view"
                className={`w-8 h-full flex items-center justify-center transition-colors ${
                  viewMode === 'masonry' ? 'bg-wld-ink text-wld-paper' : 'text-muted hover:text-wld-ink'
                }`}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <rect x="0" y="0" width="4" height="4" rx="0.5" />
                  <rect x="6" y="0" width="4" height="4" rx="0.5" />
                  <rect x="0" y="6" width="4" height="4" rx="0.5" />
                  <rect x="6" y="6" width="4" height="4" rx="0.5" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`w-8 h-full flex items-center justify-center transition-colors border-l border-border ${
                  viewMode === 'list' ? 'bg-wld-ink text-wld-paper' : 'text-muted hover:text-wld-ink'
                }`}
              >
                <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor">
                  <rect x="0" y="0" width="10" height="1.5" rx="0.5" />
                  <rect x="0" y="3.25" width="10" height="1.5" rx="0.5" />
                  <rect x="0" y="6.5" width="10" height="1.5" rx="0.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Result count */}
        {filteredPosts.length > 0 && (
          <p className="text-[12px] text-muted -mt-2">
            {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Feed */}
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="text-[14px] text-muted">No results match these filters.</p>
            <button
              onClick={clearAll}
              className="text-[13px] text-wld-ink underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        ) : viewMode === 'list' ? (
          <div className="divide-y divide-border">
            {visiblePosts.map((post) => (
              <PostCardRow key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-[150px] md:auto-rows-[175px]">
            {visiblePosts.map((post, index) => (
              <MasonryTile
                key={post._id}
                post={post}
                large={index % 7 === 0 || index % 7 === 4}
                priority={index < 4}
              />
            ))}
          </section>
        )}

        {hasMore && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
              className="px-6 py-3 text-[14px] font-medium text-wld-ink border border-border rounded-full transition-all duration-200 hover:border-wld-ink"
            >
              Show more ({filteredPosts.length - visibleCount} remaining) -&gt;
            </button>
          </div>
        )}
      </div>
    </>
  )
}
