import { client } from '@/lib/sanity/client'
import { homepageQuery } from '@/lib/sanity/queries'
import { FeaturedStrip } from '@/components/feed/FeaturedStrip'
import { CategoryChips } from '@/components/feed/CategoryChips'
import { PostFeed } from '@/components/feed/PostFeed'
import { NewsletterModule } from '@/components/modules/NewsletterModule'
import type { HomepageData } from '@/types'

export const revalidate = 60

export default async function HomePage() {
  const data = await client.fetch<HomepageData>(homepageQuery)
  const config = data?.config ?? null
  const categories = data?.categories ?? []
  const latestPosts = data?.latestPosts ?? []

  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8 space-y-8">
      {/* Mobile logo (visible only below lg since sidebar has it) */}
      <div className="lg:hidden flex items-center justify-between">
        <span className="font-display text-[24px] text-wld-ink">welove</span>
      </div>

      {/* Tagline */}
      <div>
        <h1 className="font-display text-[28px] md:text-[36px] leading-[1.15] text-wld-ink max-w-[520px]">
          Discover brands, share your honest reviews.
        </h1>
      </div>

      {/* Category chips */}
      {categories.length > 0 && <CategoryChips categories={categories} />}

      {/* Featured strip */}
      {config?.featuredPost && (
        <FeaturedStrip
          featuredPost={config.featuredPost}
          editorsPicks={config.editorsPicks ?? []}
        />
      )}

      {/* Main feed */}
      {latestPosts.length > 0 ? (
        <PostFeed
          initialPosts={latestPosts}
          ctaFrequency={config?.inFeedCardFrequency || 12}
        />
      ) : (
        <div className="py-16 text-center">
          <p className="text-[15px] text-muted">No posts yet. Check back soon.</p>
        </div>
      )}

      {/* Newsletter CTA */}
      <NewsletterModule copy={config?.newsletterBlockCopy} />
    </div>
  )
}
