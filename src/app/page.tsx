import { client } from '@/lib/sanity/client'
import { urlFor } from '@/lib/sanity/client'
import { homepageQuery } from '@/lib/sanity/queries'
import { FeaturedStrip } from '@/components/feed/FeaturedStrip'
import { DiscoveryStrip } from '@/components/feed/DiscoveryStrip'
import { CategoryChips } from '@/components/feed/CategoryChips'
import { PostFeed } from '@/components/feed/PostFeed'
import { NewsletterModule } from '@/components/modules/NewsletterModule'
import { Logo } from '@/components/layout/Logo'
import { PostCard } from '@/components/cards/PostCard'
import { PromoBannerRail, ShowcaseRail, UtilityRail } from '@/components/home/EditorialLayouts'
import type { HomepageData, PostCard as PostCardType } from '@/types'

export const revalidate = 60

export default async function HomePage() {
  const data = await client.fetch<HomepageData>(homepageQuery)
  const config = data?.config ?? null
  const categories = data?.categories ?? []
  const featuredProjects = data?.featuredProjects ?? []
  const latestProjects = data?.latestProjects ?? []
  const trendingProjects = data?.trendingProjects ?? []
  const mostSavedProjects = data?.mostSavedProjects ?? []
  const showcaseCards = featuredProjects.slice(0, 4).map((project) => ({
    id: project._id,
    eyebrow: project.category.name,
    title: project.title,
    imageUrl: urlFor(project.coverImage).width(900).height(1200).quality(85).url(),
    href: `/projects/${project.slug}`,
  }))
  const utilityCards = mostSavedProjects.slice(0, 4).map((project) => ({
    id: project._id,
    eyebrow: project.category.name,
    title: project.title,
    imageUrl: urlFor(project.coverImage).width(900).height(900).quality(80).url(),
    href: `/projects/${project.slug}`,
  }))
  const promoCards = latestProjects.slice(0, 6).map((project) => ({
    id: project._id,
    label: project.brand?.name || project.brandName || project.category.name,
    title: project.title,
    cta: 'Explore',
    imageUrl: urlFor(project.coverImage).width(1400).height(600).quality(82).url(),
    href: `/projects/${project.slug}`,
  }))

  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8 space-y-8">
      {/* Mobile logo (visible only below lg since sidebar has it) */}
      <div className="lg:hidden flex items-center justify-between">
        <Logo className="h-5 w-auto text-wld-ink" />
      </div>

      {/* Tagline */}
      <div>
        <h1 className="font-display text-[28px] md:text-[36px] leading-[1.15] text-wld-ink max-w-[520px]">
          Discover brands, share your honest reviews.
        </h1>
      </div>

      <DiscoveryStrip categories={categories} />

      {/* Category chips */}
      {categories.length > 0 && <CategoryChips categories={categories} />}

      {/* Featured strip */}
      {(config?.featuredPost || featuredProjects.length > 0 || (config?.editorsPicks?.length ?? 0) > 0) && (
        <FeaturedStrip
          featuredPost={config?.featuredPost || featuredProjects[0] || null}
          editorsPicks={config?.editorsPicks ?? []}
        />
      )}

      {showcaseCards.length > 0 && (
        <ShowcaseRail title="Get to know what we publish." cards={showcaseCards} />
      )}

      {utilityCards.length > 0 && (
        <UtilityRail
          title="Why readers stay with WeLoveDaily."
          shopHref="/projects"
          cards={utilityCards}
        />
      )}

      {promoCards.length > 0 && <PromoBannerRail cards={promoCards} />}

      <ProjectSection title="Featured Projects" projects={featuredProjects} />
      <ProjectSection title="Trending Projects" projects={trendingProjects} />
      <ProjectSection title="Most Saved" projects={mostSavedProjects} />

      {/* Main feed */}
      {latestProjects.length > 0 ? (
        <PostFeed
          initialPosts={latestProjects}
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

function ProjectSection({ title, projects }: { title: string; projects: PostCardType[] }) {
  if (projects.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {projects.slice(0, 8).map((project, index) => (
          <PostCard key={`${title}-${project._id}`} post={project} priority={index < 2} />
        ))}
      </div>
    </section>
  )
}
