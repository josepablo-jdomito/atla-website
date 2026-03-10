'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import { PostCardRow } from '@/components/cards/PostCardRow'
import { isArticlePost, splitPostsByContentType } from '@/lib/utils/contentType'
import { ArrowRight } from '@/components/ui/ArrowRight'
import type { PostCard as PostCardType, Category } from '@/types'

type SortMode = 'latest' | 'trending' | 'most-saved'
type ViewMode = 'masonry' | 'list'
type TypeFilter = 'all' | 'projects' | 'articles'

const SORT_LABELS: Record<SortMode, string> = {
  latest: 'Latest',
  trending: 'Trending',
  'most-saved': 'Most Saved',
}

interface HomepageFeedProps {
  latestPosts: PostCardType[]
  trendingPosts: PostCardType[]
  mostSavedPosts: PostCardType[]
  categories: Category[]
}

export function HomepageFeed({
  latestPosts,
  trendingPosts,
  mostSavedPosts,
  categories,
}: HomepageFeedProps) {
  const [sort, setSort] = useState<SortMode>('latest')
  const [viewMode, setViewMode] = useState<ViewMode>('masonry')
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<TypeFilter>('all')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  const sortRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortMenu(false)
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const basePosts =
    sort === 'trending' ? trendingPosts : sort === 'most-saved' ? mostSavedPosts : latestPosts

  const { articles: latestArticles, projects: latestProjects } = splitPostsByContentType(latestPosts)
  const featuredArticle = latestArticles[0] ?? null
  const featuredProject = latestProjects[0] ?? null

  let feedPosts = basePosts.filter(
    (p) => p._id !== featuredArticle?._id && p._id !== featuredProject?._id
  )

  if (filterCategory) {
    feedPosts = feedPosts.filter(
      (p) =>
        p.category.slug === filterCategory ||
        p.categories?.some((c) => c.slug === filterCategory)
    )
  }

  if (filterType === 'articles') {
    feedPosts = feedPosts.filter((p) => isArticlePost(p))
  } else if (filterType === 'projects') {
    feedPosts = feedPosts.filter((p) => !isArticlePost(p))
  }

  const activeFilterCount = (filterCategory ? 1 : 0) + (filterType !== 'all' ? 1 : 0)

  const clearFilters = () => {
    setFilterCategory(null)
    setFilterType('all')
  }

  return (
    <>
      {/* Controls row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="h-8 px-3 rounded-full border border-wld-blue text-[12px] bg-blue-50 text-wld-blue inline-flex items-center gap-1.5"
            >
              Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
              <span aria-hidden>×</span>
            </button>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          {/* Filter dropdown */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => {
                setShowFilterMenu((v) => !v)
                setShowSortMenu(false)
              }}
              className={`h-8 px-3 rounded-full border text-[12px] bg-white inline-flex items-center gap-1.5 transition-colors ${
                activeFilterCount > 0
                  ? 'border-wld-blue text-wld-blue'
                  : 'border-border text-wld-ink hover:border-wld-ink'
              }`}
            >
              Filter
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-wld-blue text-white text-[10px] flex items-center justify-center leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 top-10 w-72 bg-white border border-border rounded-xl shadow-lg z-50 p-4 space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
                    Type
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {(['all', 'projects', 'articles'] as TypeFilter[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilterType(t)}
                        className={`h-7 px-3 rounded-full text-[12px] border transition-colors ${
                          filterType === t
                            ? 'bg-wld-ink text-white border-wld-ink'
                            : 'border-border text-wld-ink hover:border-wld-ink'
                        }`}
                      >
                        {t === 'all' ? 'All' : t === 'projects' ? 'Projects' : 'Articles'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
                    Category
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      onClick={() => setFilterCategory(null)}
                      className={`h-7 px-3 rounded-full text-[12px] border transition-colors ${
                        !filterCategory
                          ? 'bg-wld-ink text-white border-wld-ink'
                          : 'border-border text-wld-ink hover:border-wld-ink'
                      }`}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() =>
                          setFilterCategory(cat.slug === filterCategory ? null : cat.slug)
                        }
                        className={`h-7 px-3 rounded-full text-[12px] border transition-colors ${
                          filterCategory === cat.slug
                            ? 'bg-wld-ink text-white border-wld-ink'
                            : 'border-border text-wld-ink hover:border-wld-ink'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sort dropdown */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => {
                setShowSortMenu((v) => !v)
                setShowFilterMenu(false)
              }}
              className={`h-8 px-3 rounded-full border text-[12px] bg-white inline-flex items-center gap-1.5 transition-colors ${
                sort !== 'latest'
                  ? 'border-wld-blue text-wld-blue'
                  : 'border-border text-wld-ink hover:border-wld-ink'
              }`}
            >
              Sort: {SORT_LABELS[sort]}
              <svg
                className={`w-3 h-3 transition-transform ${showSortMenu ? 'rotate-180' : ''}`}
                viewBox="0 0 12 12"
                fill="currentColor"
              >
                <path d="M6 8L2 4h8L6 8z" />
              </svg>
            </button>

            {showSortMenu && (
              <div className="absolute right-0 top-10 w-44 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                {(['latest', 'trending', 'most-saved'] as SortMode[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSort(s)
                      setShowSortMenu(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-wld-paper transition-colors ${
                      sort === s ? 'text-wld-blue font-medium' : 'text-wld-ink'
                    }`}
                  >
                    {SORT_LABELS[s]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View toggle */}
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
          {featuredArticle && (
            <FeatureTile post={featuredArticle} label="Featured Article" priority />
          )}
          {featuredProject && <FeatureTile post={featuredProject} label="Featured Project" />}
        </section>
      )}

      {/* Feed */}
      {feedPosts.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <p className="text-[15px] text-muted">No results match these filters.</p>
          <button
            onClick={clearFilters}
            className="text-[13px] text-wld-blue underline underline-offset-2"
          >
            Clear filters
          </button>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-1 divide-y divide-border">
          {feedPosts.slice(0, 40).map((post) => (
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
    </>
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
