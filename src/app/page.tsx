import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { homepageQuery } from '@/lib/sanity/queries'
import { Logo } from '@/components/layout/Logo'
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
  'Trending',
  'New launches',
  'Ice cream social',
  "Let's go to the beach",
  'Sunglass season',
  'Be among the first to review',
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

  return (
    <div className="px-4 lg:px-8 py-4 lg:py-6 space-y-4 max-w-full">
      <div className="lg:hidden flex items-center justify-between py-1">
        <Logo className="h-5 w-auto text-wld-ink" />
      </div>

      <header className="border-b border-border pb-5">
        <h1 className="font-display text-[42px] md:text-[56px] lg:text-[64px] leading-[0.95] text-wld-ink max-w-[760px]">
          Discover brands, share your honest reviews.
        </h1>
      </header>

      {/* Trending chips + category links */}
      <section className="border-b border-border pb-3 space-y-3">
        <div className="relative overflow-x-auto no-scrollbar pr-6">
          <div className="flex items-center gap-2 min-w-max">
            {TRENDING_CHIPS.map((chip, index) => (
              <Link
                key={chip}
                href={index === 0 ? '/search?q=trending' : `/search?q=${encodeURIComponent(chip)}`}
                className={`px-4 h-8 rounded-full border text-[12px] inline-flex items-center whitespace-nowrap ${
                  index === 0
                    ? 'bg-wld-ink text-white border-wld-ink'
                    : 'bg-white text-wld-ink border-border hover:border-wld-ink'
                }`}
              >
                {chip}
              </Link>
            ))}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-wld-paper to-transparent"
          />
        </div>

        {categories.length > 0 && (
          <div className="relative overflow-x-auto no-scrollbar pr-6">
            <div className="flex items-center gap-2 min-w-max">
              {categories.slice(0, 8).map((cat) => {
                const categoryLabel = getCategoryLabel(cat.name, cat.slug)
                return (
                  <Link
                    key={cat._id}
                    href={`/category/${cat.slug}`}
                    aria-label={`View ${categoryLabel} projects`}
                    className="h-8 px-3 rounded-full border border-border text-[12px] bg-white text-wld-ink hover:border-wld-ink inline-flex items-center"
                  >
                    {categoryLabel}
                  </Link>
                )
              })}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-wld-paper to-transparent"
            />
          </div>
        )}
        <p className="text-[11px] text-muted">Swipe for more tags</p>
      </section>

      {/* Feed with filter/sort/view controls */}
      <HomepageFeed
        latestPosts={latestPosts}
        trendingPosts={trendingPosts}
        mostSavedPosts={mostSavedPosts}
        categories={categories}
      />
    </div>
  )
}
