'use client'

import { useState, useTransition, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { client } from '@/lib/sanity/client'
import { searchQuery } from '@/lib/sanity/queries'
import { PostCard } from '@/components/cards/PostCard'
import { trackSearchSubmit } from '@/lib/utils/analytics'
import Link from 'next/link'
import type { SearchData } from '@/types'

export function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchData>({
    projects: [],
    studios: [],
    categories: [],
  })
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

  // Run search on initial load if ?q= is present
  useEffect(() => {
    if (initialQuery) runSearch(initialQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.replace(`/search?q=${encodeURIComponent(query)}`, { scroll: false })
    runSearch(query)
  }

  const hasResults =
    results.projects.length > 0 ||
    results.studios.length > 0 ||
    results.categories.length > 0

  const designers = Array.from(
    new Set(results.projects.flatMap((project) => project.designerCredits || []))
  )

  return (
    <>
      {/* Search form */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search studios, brands, or topics"
            className="
              flex-1 px-4 py-3
              text-[15px] text-wld-ink bg-white
              border border-border rounded-full
              placeholder:text-muted
              focus:outline-none focus:border-wld-ink
              transition-colors
            "
          />
          <button
            type="submit"
            disabled={isPending}
            className="
              px-6 py-3 text-[14px] font-medium
              bg-wld-ink text-white rounded-full
              hover:bg-wld-blue transition-colors
              disabled:opacity-50
            "
          >
            {isPending ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Results */}
      {isPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-4/5 rounded-card bg-card animate-pulse" />
          ))}
        </div>
      )}

      {!isPending && hasSearched && !hasResults && (
        <div className="text-center py-16">
          <p className="text-[16px] text-muted mb-2">No results for &ldquo;{query}&rdquo;.</p>
          <p className="text-[14px] text-muted">Try a studio name, brand, or design category.</p>
        </div>
      )}

      {!isPending && hasResults && (
        <>
          <div className="space-y-10">
            {results.projects.length > 0 && (
              <section>
                <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4">
                  Projects ({results.projects.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.projects.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {results.studios.length > 0 && (
              <section>
                <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4">
                  Studios ({results.studios.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.studios.map((studio) => (
                    <Link
                      key={studio._id}
                      href={`/studio/${studio.slug}`}
                      className="p-4 rounded-card border border-border bg-white hover:border-wld-ink transition-colors"
                    >
                      <p className="text-[16px] font-semibold text-wld-ink">{studio.name}</p>
                      {studio.tagline && <p className="text-[14px] text-muted mt-1">{studio.tagline}</p>}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.categories.length > 0 && (
              <section>
                <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4">
                  Categories ({results.categories.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {results.categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/category/${category.slug}`}
                      className="px-3 py-2 text-[13px] rounded-full border border-border bg-white text-wld-ink hover:border-wld-ink transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {designers.length > 0 && (
              <section>
                <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4">
                  Designers ({designers.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {designers.map((designer) => (
                    <span
                      key={designer}
                      className="px-3 py-2 text-[13px] rounded-full border border-border bg-card text-wld-ink"
                    >
                      {designer}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </>
      )}
    </>
  )
}
