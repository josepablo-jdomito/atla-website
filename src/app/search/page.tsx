'use client'

import { useState, useTransition, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { client } from '@/lib/sanity/client'
import { searchQuery } from '@/lib/sanity/queries'
import { PostCard } from '@/components/cards/PostCard'
import { trackSearchSubmit } from '@/lib/utils/analytics'
import type { PostCard as PostCardType } from '@/types'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<PostCardType[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isPending, startTransition] = useTransition()

  const runSearch = (term: string) => {
    if (!term.trim()) return
    startTransition(async () => {
      const data = await client.fetch<PostCardType[]>(searchQuery, {
        searchTerm: `*${term}*`,
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

  return (
    <div className="max-w-container mx-auto px-5 py-10">
      <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-6">
        Search
      </h1>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, brands, categories..."
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

      {!isPending && hasSearched && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[16px] text-muted mb-2">
            No results found for &ldquo;{initialQuery || query}&rdquo;
          </p>
          <p className="text-[14px] text-muted">Try a different search term or browse categories.</p>
        </div>
      )}

      {!isPending && results.length > 0 && (
        <>
          <p className="text-[14px] text-muted mb-6">
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{initialQuery || query}&rdquo;
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
