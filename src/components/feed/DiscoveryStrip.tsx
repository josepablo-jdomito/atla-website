import Link from 'next/link'
import type { Category } from '@/types'

interface DiscoveryStripProps {
  categories: Category[]
}

const DEFAULT_TRENDS = [
  'Trending',
  'New Launches',
  'Screentime Reset',
  'Spring Cleaning',
  'Protein Everywhere',
  "Editor Picks Rewards",
]

export function DiscoveryStrip({ categories }: DiscoveryStripProps) {
  const dynamicTrends = categories.slice(0, 5).map((category) => category.name)
  const trendLabels = ['Trending', ...(dynamicTrends.length > 0 ? dynamicTrends : DEFAULT_TRENDS.slice(1))]

  return (
    <section className="rounded-card border border-border bg-card/70 overflow-hidden">
      <div className="p-4 md:p-5 space-y-4">
        <form action="/search" className="relative max-w-[520px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </span>
          <input
            type="search"
            name="q"
            placeholder="Search brands or products"
            className="w-full h-12 rounded-full border border-border bg-white pl-12 pr-4 text-[18px] text-wld-ink placeholder:text-muted focus:outline-none focus:border-wld-ink"
          />
        </form>

        <Link
          href="/brands"
          aria-label="Browse all brands"
          className="inline-flex items-center gap-3 text-[30px] font-medium text-wld-ink hover:text-wld-blue transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
            <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
          </svg>
          <span>Browse all brands</span>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M4 12h16" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="border-t border-border/80 px-4 md:px-5 py-4 overflow-x-auto">
        <div className="flex items-center gap-3 min-w-max">
          {trendLabels.map((label, index) => (
            <Link
              key={label}
              href={index === 0 ? '/search?q=trending' : `/search?q=${encodeURIComponent(label)}`}
              className={`px-5 py-2.5 rounded-full border text-[14px] font-medium whitespace-nowrap transition-colors ${
                index === 0
                  ? 'bg-wld-ink text-white border-wld-ink'
                  : 'bg-white text-wld-ink border-border hover:border-wld-ink'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
