import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { homepageQuery } from '@/lib/sanity/queries'
import { HomepageFeed } from '@/components/feed/HomepageFeed'
import { buildMetadata } from '@/lib/utils/metadata'
import type { HomepageData } from '@/types'

export const revalidate = 60
export const metadata = buildMetadata({
  title: 'WeLoveDaily - Consumer Brand Design Platform',
  description:
    'The global platform for consumer brand design. Curated identities, packaging, rebrands, and brand strategy - for founders, CMOs, and creative directors.',
  path: '/',
})

const TRENDING_CHIPS = [
  { label: 'Trending', href: '/search?q=trending', active: true },
  { label: 'New launches', href: '/search?q=new+launches' },
  { label: 'Ice cream social', href: '/search?q=ice+cream+social' },
  { label: "Let's go to the beach", href: '/search?q=beach' },
  { label: 'Sunglass season', href: '/search?q=sunglass+season' },
  { label: 'Be among the first to review', href: '/search?q=first+to+review' },
]

const CATEGORY_NAME_BY_SLUG: Record<string, string> = {
  'brand-breakdown': 'Brand Breakdown',
  'cult-brand-index': 'Cult Brand Index',
  'industry-signal': 'Industry Signal',
  'new-work': 'New Work',
  'the-definition': 'The Definition',
}

function getCategoryLabel(name: string | undefined, slug: string): string {
  const normalized = name?.trim()
  if (normalized) return normalized
  const fromSlug = CATEGORY_NAME_BY_SLUG[slug]
  if (fromSlug) return fromSlug
  return (
    slug
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Uncategorized'
  )
}

export default async function HomePage() {
  const data = await client.fetch<HomepageData>(homepageQuery)
  const latestPosts = data?.latestProjects ?? []
  const trendingPosts = data?.trendingProjects ?? []
  const mostSavedPosts = data?.mostSavedProjects ?? []
  const categories = data?.categories ?? []
  const allTags = (data?.allTags ?? []).filter(Boolean).sort()

  return (
    <div className="px-4 lg:px-8 max-w-full">

      {/* Hero */}
      <header className="pt-8 pb-7 border-b border-border">
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted mb-4">
          The global platform for consumer brand design
        </p>
        <h1 className="font-display text-[40px] md:text-[56px] lg:text-[68px] leading-[0.92] text-wld-ink max-w-[820px] mb-0">
          Discover brands,<br className="hidden md:block" /> share your{' '}
          <em className="not-italic text-wld-blue">honest reviews.</em>
        </h1>
      </header>

      {/* Chips row */}
      <section className="py-4 border-b border-border space-y-2.5">
        {/* Trending chips */}
        <div className="relative overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max pr-8">
            {TRENDING_CHIPS.map((chip) => (
              <Link
                key={chip.label}
                href={chip.href}
                className={`px-3.5 h-7 rounded-full text-[11px] font-medium inline-flex items-center whitespace-nowrap transition-all ${
                  chip.active
                    ? 'bg-wld-ink text-wld-paper'
                    : 'border border-border text-muted hover:text-wld-ink hover:border-[rgb(var(--wld-ink-rgb)/0.25)] bg-transparent'
                }`}
              >
                {chip.label}
              </Link>
            ))}
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-wld-paper to-transparent" />
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="relative overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 min-w-max pr-8">
              {categories.slice(0, 8).map((cat) => {
                const categoryLabel = getCategoryLabel(cat.name, cat.slug)
                return (
                  <Link
                    key={cat._id}
                    href={`/category/${cat.slug}`}
                    aria-label={`View ${categoryLabel} projects`}
                    className="h-7 px-3.5 rounded-full border border-border text-[11px] text-muted hover:text-wld-ink hover:border-[rgb(var(--wld-ink-rgb)/0.25)] inline-flex items-center whitespace-nowrap transition-all"
                  >
                    {categoryLabel}
                  </Link>
                )
              })}
            </div>
            <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-wld-paper to-transparent" />
          </div>
        )}
      </section>

      {/* Feed */}
      <div className="py-6">
        <HomepageFeed
          latestPosts={latestPosts}
          trendingPosts={trendingPosts}
          mostSavedPosts={mostSavedPosts}
          categories={categories}
          allTags={allTags}
        />
      </div>
    </div>
  )
}
