import { Suspense } from 'react'
import { SearchContent } from './SearchContent'
import { buildMetadata } from '@/lib/utils/metadata'
import { SEARCH_INDEXABLE } from '@/lib/utils/searchPolicy'

export const metadata = buildMetadata({
  title: 'Search - WeLoveDaily',
  path: '/search',
  noIndex: !SEARCH_INDEXABLE,
})

export default function SearchPage() {
  return (
    <div className="max-w-container mx-auto px-5 py-10">
      <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-6">
        Search
      </h1>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-4/5 rounded-card bg-card animate-pulse" />
            ))}
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  )
}
