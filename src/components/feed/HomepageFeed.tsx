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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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

      <div className="space-y-4">
        {/* Controls row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {/* Active filter chips */}
            {filters.sort !== 'latest' && (
              <Chip label={filters.sort === 'trending' ? 'Trending' : 'Most Saved'} onRemove={() => removeFilter('sort')} />
            )}
            {filters.type !== 'all' && (
              <Chip label={filters.type === 'projects' ? 'Projects' : 'Articles'} onRemove={() => removeFilter('type')} />
            )}
            {categoryLabel && (
              <Chip label={categoryLabel} onRemove={() => removeFilter('category')} />
            )}
            {filters.tags.map(tag => (
              <Chip key={tag} label={tag} onRemove={() => removeFilter('tags', tag)} blue />
            ))}
            {activeFilterCount > 1 && (
              <button
                onClick={clearAll}
                className="text-[12px] text-muted hover:text-wld-ink transition-colors whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setDrawerOpen(true)}
              className={`h-8 px-3 rounded-full border text-[12px] inline-flex items-center gap-2 transition-colors ${
                activeFilterCount > 0
                  ? 'border-wld-blue text-wld-blue bg-blue-50'
                  : 'border-border text-wld-ink bg-white hover:border-wld-ink'
              }`}
            >
              <FilterIcon />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-wld-blue text-white text-[10px] flex items-center justify-center leading-none font-medium">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-1 h-8 px-2 rounded-full border border-border bg-white">
              <button
                onClick={() => setViewMode('masonry')}
                aria-label="Masonry grid view"
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  viewMode === 'masonry' ? 'bg-wld-ink text-white' : 'text-muted hover:text-wld-ink'
                }`}
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
                  <rect x="0" y="0" width="4.5" height="4.5" rx="0.75" />
                  <rect x="6.5" y="0" width="4.5" height="4.5" rx="0.75" />
                  <rect x="0" y="6.5" width="4.5" height="4.5" rx="0.75" />
                  <rect x="6.5" y="6.5" width="4.5" height="4.5" rx="0.75" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  viewMode === 'list' ? 'bg-wld-ink text-white' : 'text-muted hover:text-wld-ink'
                }`}
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
                  <rect x="0" y="0" width="11" height="2.25" rx="0.75" />
                  <rect x="0" y="4.375" width="11" height="2.25" rx="0.75" />
                  <rect x="0" y="8.75" width="11" height="2.25" rx="0.75" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Featured tiles — always from latestPosts */}
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
          <div className="py-16 text-center space-y-3">
            <p className="text-[15px] text-muted">No results match these filters.</p>
            <button
              onClick={clearAll}
              className="text-[13px] text-wld-blue underline underline-offset-2"
            >
              Clear all filters
            </button>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-1 divide-y divide-border">
            {feedPosts.slice(0, 40).map(post => (
              <PostCardRow key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-[140px] md:auto-rows-[170px]">
            {feedPosts.slice(0, 40).map((post, index) => (
              <MasonryTile
                key={post._id}
                post={post}
                large={index % 7 === 0 || index % 7 === 4}
              />
            ))}
          </section>
        )}

        {feedPosts.length > 0 && (
          <div className="flex justify-center py-6">
            <Link
              href="/projects"
              className="h-10 px-5 rounded-full border border-border text-[14px] text-wld-ink hover:border-wld-ink inline-flex items-center gap-2 transition-colors"
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

function Chip({
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
      className={`inline-flex items-center gap-1.5 h-7 pl-3 pr-2 rounded-full border text-[12px] font-medium ${
        blue
          ? 'bg-wld-blue/10 border-wld-blue text-wld-blue'
          : 'bg-wld-paper border-border text-wld-ink'
      }`}
    >
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="hover:opacity-70 transition-opacity"
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
  const imageUrl = urlFor(post.coverImage).width(1200).height(720).format('webp').quality(78).url()

  return (
    <Link
      href={`/projects/${post.slug}`}
      className="group block relative rounded-[18px] overflow-hidden border border-border bg-card min-h-[400px]"
    >
      <Image
        src={imageUrl}
        alt={post.coverImage.alt || post.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority={priority}
        loading={priority ? 'eager' : undefined}
        placeholder={post.coverImage.asset?.metadata?.lqip ? 'blur' : 'empty'}
        blurDataURL={post.coverImage.asset?.metadata?.lqip}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
        <p className="text-[10px] uppercase tracking-widest font-medium opacity-80 mb-2">{label}</p>
        <h2 className="text-[24px] md:text-[32px] leading-tight font-semibold max-w-[85%]">
          {post.title}
        </h2>
      </div>
    </Link>
  )
}

function MasonryTile({ post, large }: { post: PostCardType; large: boolean }) {
  const imageUrl = urlFor(post.coverImage).width(900).height(700).format('webp').quality(82).url()

  return (
    <Link
      href={`/projects/${post.slug}`}
      className={`group relative rounded-[12px] overflow-hidden border border-border bg-card ${
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
        className="object-cover"
        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-80 group-hover:opacity-100 transition-opacity" />
      <div className="absolute left-3 right-3 bottom-3 text-white">
        <p className="text-[11px] uppercase tracking-wider">{post.category.name}</p>
        <p className="text-[14px] leading-snug font-medium mt-1 line-clamp-2">{post.title}</p>
      </div>
    </Link>
  )
}
