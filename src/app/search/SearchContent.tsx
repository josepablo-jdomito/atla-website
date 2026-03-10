'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { client } from '@/lib/sanity/client'
import { searchQuery } from '@/lib/sanity/queries'
import { PostCard } from '@/components/cards/PostCard'
import { trackSearchSubmit } from '@/lib/utils/analytics'
import Link from 'next/link'
import type { SearchData } from '@/types'

type TypeFilter = 'all' | 'projects' | 'studios' | 'categories'

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

export function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [results, setResults] = useState<SearchData>({ projects: [], studios: [], categories: [] })
  const [hasSearched, setHasSearched] = useState(false)
  const [isPending, startTransition] = useTransition()

  const runSearch = (term: string) => {
    if (!term.trim()) return
    startTransition(async () => {
      const data = await client.fetch<SearchData>(searchQuery, {
        searchTerm: `*${term}*`,
        rawTerm: term,
      })
      setResults(data)
      setHasSearched(true)
      trackSearchSubmit(term)
    })
  }

  useEffect(() => {
    if (initialQuery) runSearch(initialQuery)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  useEffect(() => {
    const q = searchParams.get('q') || ''
    setQuery(q)
    if (q) runSearch(q)
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.replace(`/search?q=${encodeURIComponent(query)}`, { scroll: false })
    runSearch(query)
  }

  const totalCount =
    results.projects.length + results.studios.length + results.categories.length

  const hasResults = totalCount > 0

  const designers = Array.from(
    new Set(results.projects.flatMap(project => project.designerCredits || []))
  )

  const visibleProjects =
    typeFilter === 'all' || typeFilter === 'projects' ? results.projects : []
  const visibleStudios =
    typeFilter === 'all' || typeFilter === 'studios' ? results.studios : []
  const visibleCategories =
    typeFilter === 'all' || typeFilter === 'categories' ? results.categories : []

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3 items-center h-12 bg-white border border-border rounded-full px-4 focus-within:border-wld-ink transition-colors">
          <span className="text-muted shrink-0"><SearchIcon /></span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search studios, brands, designers, categories…"
            className="flex-1 text-[15px] text-wld-ink placeholder:text-muted bg-transparent focus:outline-none"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isPending}
            className="shrink-0 h-8 px-4 text-[13px] font-medium bg-wld-ink text-white rounded-full hover:bg-wld-blue transition-colors disabled:opacity-50"
          >
            {isPending ? 'Searching…' : 'Search'}
          </button>
        </div>
      </form>

      {hasSearched && hasResults && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-[13px] text-muted mr-1">{totalCount} result{totalCount !== 1 ? 's' : ''}</span>
          {([
            ['all', 'All'],
            ['projects', `Projects (${results.projects.length})`],
            ['studios', `Studios (${results.studios.length})`],
            ['categories', `Categories (${results.categories.length})`],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value)}
              className={`h-8 px-3 rounded-full border text-[12px] font-medium transition-colors ${
                typeFilter === value
                  ? 'bg-wld-ink text-white border-wld-ink'
                  : 'border-border text-wld-ink hover:border-wld-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {isPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-card bg-card animate-pulse" />
          ))}
        </div>
      )}

      {!isPending && hasSearched && !hasResults && (
        <div className="text-center py-20">
          <p className="text-[16px] text-wld-ink font-medium mb-2">
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="text-[14px] text-muted mb-6">
            Try a studio name, brand, designer, or category.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Branding', 'Packaging', 'Rebrand', 'Identity'].map(tag => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag)
                  router.replace(`/search?q=${encodeURIComponent(tag)}`)
                  runSearch(tag)
                }}
                className="h-8 px-3 rounded-full border border-border text-[13px] text-wld-ink hover:border-wld-ink transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {!isPending && hasResults && (
        <div className="space-y-12">
          {visibleProjects.length > 0 && (
            <section>
              <h2 className="text-[12px] font-semibold uppercase tracking-widest text-muted mb-5">
                Projects &mdash; {results.projects.length}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleProjects.map(post => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          )}

          {visibleStudios.length > 0 && (
            <section>
              <h2 className="text-[12px] font-semibold uppercase tracking-widest text-muted mb-5">
                Studios &mdash; {results.studios.length}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {visibleStudios.map(studio => (
                  <Link
                    key={studio._id}
                    href={`/studio/${studio.slug}`}
                    className="p-4 rounded-card border border-border bg-white hover:border-wld-ink hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center shrink-0">
                        <span className="text-[16px] font-semibold text-muted">{studio.name[0]}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-wld-ink">{studio.name}</p>
                        {studio.tagline && (
                          <p className="text-[13px] text-muted truncate">{studio.tagline}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {visibleCategories.length > 0 && (
            <section>
              <h2 className="text-[12px] font-semibold uppercase tracking-widest text-muted mb-5">
                Categories &mdash; {results.categories.length}
              </h2>
              <div className="flex flex-wrap gap-2">
                {visibleCategories.map(category => (
                  <Link
                    key={category._id}
                    href={`/category/${category.slug}`}
                    className="h-9 px-4 text-[13px] rounded-full border border-border bg-white text-wld-ink hover:border-wld-ink hover:bg-wld-paper transition-colors inline-flex items-center"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {designers.length > 0 && typeFilter === 'all' && (
            <section>
              <h2 className="text-[12px] font-semibold uppercase tracking-widest text-muted mb-5">
                Designers &mdash; {designers.length}
              </h2>
              <div className="flex flex-wrap gap-2">
                {designers.map(designer => (
                  <span
                    key={designer}
                    className="h-9 px-4 text-[13px] rounded-full border border-border bg-card text-wld-ink inline-flex items-center"
                  >
                    {designer}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  )
}
