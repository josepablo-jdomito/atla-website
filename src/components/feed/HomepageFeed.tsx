'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import { PostCardRow } from '@/components/cards/PostCardRow'
import { isArticlePost, splitPostsByContentType } from '@/lib/utils/contentType'
import { ArrowRight } from '@/components/ui/ArrowRight'
import { FilterDrawer, type SortMode, type TypeFilter, type FilterState } from './FilterDrawer'
import type { PostCard as PostCardType, Category } from '@/types'

type ViewMode = 'masonry' | 'list'

interface HomepageFeedProps {
  latestPosts: PostCardType[]
  trendingPosts: PostCardType[]
  mostSavedPosts: PostCardType[]
  categories: Category[]
  allTags: string[]
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

export function HomepageFeed({
  latestPosts,
  trendingPosts,
  mostSavedPosts,
  categories,
  allTags,
}: HomepageFeedProps) {
  const [filters, setFilters] = useState<FilterState>({
    sort: 'latest',
    type: 'all',
    category: null,
    tags: [],
  })
  const [viewMode, setViewMode] = useState<ViewMode>('masonry')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const basePosts =
    filters.sort === 'trending'
      ? trendingPosts
      : filters.sort === 'most-saved'
      ? mostSavedPosts
      : latestPosts

  const { articles: latestArticles, projects: latestProjects } = splitPostsByContentType(latestPosts)
  const featuredArticle = latestArticles[0] ?? null
  const featuredProject = latestProjects[0] ?? null

  const feedPosts = useMemo(() => {
    let posts = basePosts.filter(
      p => p._id !== featuredArticle?._id && p._id !== featuredProject?._id
    )
    if (filters.category) {
      posts = posts.filter(
        p =>
          p.category.slug === filters.category ||
          p.categories?.some(c => c.slug === filters.category)
      )
    }
    if (filters.type === 'articles') {
      posts = posts.filter(p => isArticlePost(p))
    } else if (filters.type === 'projects') {
      posts = posts.filter(p => !isArticlePost(p))
    }
    if (filters.tags.length > 0) {
      posts = posts.filter(p =>
        filters.tags.some(tag => p.tags?.includes(tag))
      )
    }
    return posts
  }, [basePosts, filters, featuredArticle, featuredProject])

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.type !== 'all' ? 1 : 0) +
    filters.tags.length +
    (filters.sort !== 'latest' ? 1 : 0)

  const removeFilter = (key: keyof FilterState, value?: string) => {
    setFilters(f => {
      if (key === 'category') return { ...f, category: null }
      if (key === 'type') return { ...f, type: 'all' }
      if (key === 'sort') return { ...f, sort: 'latest' }
      if (key === 'tags' && value) return { ...f, tags: f.tags.filter(t => t !== value) }
      return f
    })
  }

  const clearAll = () =>
    setFilters({ sort: 'latest', type: 'all', category: null, tags: [] })

  const categoryLabel = filters.category
    ? categories.find(c => c.slug === filters.category)?.name ?? filters.category
    : null

  return (
    <>
      <FilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApply={setFilters}
        categories={categories}
        allTags={allTags}
        current={filters}
        resultCount={feedPosts.length}
      />

      <div className="space-y-6">
        {/* Controls row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {filters.sort !== 'latest' && (
              <FilterChip label={filters.sort === 'trending' ? 'Trending' : 'Most Saved'} onRemove={() => removeFilter('sort')} />
            )}
            {filters.type !== 'all' && (
              <FilterChip label={filters.type === 'projects' ? 'Projects' : 'Articles'} onRemove={() => removeFilter('type')} />
            )}
            {categoryLabel && (
              <FilterChip label={categoryLabel} onRemove={() => removeFilter('category')} />
            )}
            {filters.tags.map(tag => (
              <FilterChip key={tag} label={tag} onRemove={() => removeFilter('tags', tag)} blue />
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

            {/* View toggle */}
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

        {/* Featured tiles */}
        {(featuredArticle || featuredProject) && (
          <section
            className={
              featuredArticle && featuredProject
                ? 'grid grid-cols-1 lg:grid-cols-2 gap-3'
                : 'grid grid-cols-1 gap-3'
            }
          >
            {featuredArticle && <FeatureTile post={featuredArticle} label="Featured Article" priority />}
            {featuredProject && <FeatureTile post={featuredProject} label="Featured Project" />}
          </section>
        )}

        {/* Feed */}
        {feedPosts.length === 0 ? (
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
            {feedPosts.slice(0, 40).map(post => (
              <PostCardRow key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-[150px] md:auto-rows-[175px]">
            {feedPosts.slice(0, 40).map((post, index) => (
              <MasonryTile
                key={post._id}
                post={post}
                large={index % 7 === 0 || index % 7 === 4}
                index={index}
              />
            ))}
          </section>
        )}

        {feedPosts.length > 0 && (
          <div className="flex justify-center py-4">
            <Link
              href="/projects"
              className="h-10 px-6 rounded-full border border-border text-[13px] text-wld-ink hover:border-wld-ink hover:bg-wld-white inline-flex items-center gap-2 transition-all"
            >
              Explore all projects and articles
              <ArrowRight />
            </Link>
          </div>
        )}
      </div>
    </>
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

function FeatureTile({
  post,
  label,
  priority = false,
}: {
  post: PostCardType
  label: string
  priority?: boolean
}) {
  const imageUrl = urlFor(post.coverImage).width(1200).height(800).format('webp').quality(82).url()

  return (
    <Link
      href={`/projects/${post.slug}`}
      className="group block relative rounded-card-lg overflow-hidden bg-card"
      style={{ minHeight: 420 }}
    >
      <Image
        src={imageUrl}
        alt={post.coverImage.alt || post.title}
        fill
        className="object-cover card-image-zoom"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority={priority}
        loading={priority ? 'eager' : undefined}
        placeholder={post.coverImage.asset?.metadata?.lqip ? 'blur' : 'empty'}
        blurDataURL={post.coverImage.asset?.metadata?.lqip}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/75" />

      {/* Top label */}
      <div className="absolute top-4 left-4">
        <span className="inline-flex items-center h-6 px-3 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-[10px] font-medium uppercase tracking-widest text-white/90">
          {label}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-[11px] font-medium uppercase tracking-widest text-white/70 mb-2">
          {post.category.name}
        </p>
        <h2 className="font-display text-[22px] md:text-[28px] leading-tight text-white max-w-[85%] group-hover:opacity-90 transition-opacity">
          {post.title}
        </h2>
      </div>
    </Link>
  )
}

function MasonryTile({ post, large, index }: { post: PostCardType; large: boolean; index: number }) {
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
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/65 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Text */}
      <div className="absolute left-3 right-3 bottom-3 text-white">
        <p className="text-[9px] font-medium uppercase tracking-widest text-white/70 mb-0.5">
          {post.category.name}
        </p>
        <p className={`leading-snug font-medium ${large ? 'text-[14px]' : 'text-[12px]'} line-clamp-2`}>
          {post.title}
        </p>
      </div>
    </Link>
  )
}
