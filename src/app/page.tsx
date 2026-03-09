import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { urlFor } from '@/lib/sanity/client'
import { homepageQuery } from '@/lib/sanity/queries'
import { FeaturedStrip } from '@/components/feed/FeaturedStrip'
import { DiscoveryStrip } from '@/components/feed/DiscoveryStrip'
import { CategoryChips } from '@/components/feed/CategoryChips'
import { PostFeed } from '@/components/feed/PostFeed'
import { Logo } from '@/components/layout/Logo'
import { PostCard } from '@/components/cards/PostCard'
import { PromoBannerRail, ShowcaseRail, UtilityRail } from '@/components/home/EditorialLayouts'
import { buildMetadata } from '@/lib/utils/metadata'
import type { HomepageData, PostCard as PostCardType } from '@/types'

export const revalidate = 60
export const metadata = buildMetadata({
  title: 'WeLoveDaily - Consumer Brand Design Platform',
  description:
    'The global platform for consumer brand design. Curated identities, packaging, rebrands, and brand strategy - for founders, CMOs, and creative directors.',
  path: '/',
})

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
    cta: 'Read the full feature ->',
    imageUrl: urlFor(project.coverImage).width(1400).height(600).quality(82).url(),
    href: `/projects/${project.slug}`,
  }))

  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8 space-y-8">
      <div className="lg:hidden flex items-center justify-between">
        <Logo className="h-5 w-auto text-wld-ink" />
      </div>

      <header className="space-y-4 max-w-[900px]">
        <h1 className="font-display text-[30px] md:text-[42px] leading-[1.1] text-wld-ink">
          The global platform for consumer brand design.
        </h1>
        <p className="text-[16px] text-muted max-w-[760px]">
          Curated work, sharp analysis, and industry intelligence - for founders, CMOs, and
          creative directors building brands that matter.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center justify-center px-5 h-11 rounded-full bg-wld-ink text-white text-[14px] font-medium hover:bg-wld-blue transition-colors"
        >
          Explore projects -&gt;
        </Link>
      </header>

      <DiscoveryStrip categories={categories} />

      {categories.length > 0 && <CategoryChips categories={categories} />}

      <section className="space-y-4">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted">Editor&apos;s Pick</h2>
        {(config?.featuredPost || featuredProjects.length > 0 || (config?.editorsPicks?.length ?? 0) > 0) && (
          <FeaturedStrip
            featuredPost={config?.featuredPost || featuredProjects[0] || null}
            editorsPicks={config?.editorsPicks ?? []}
          />
        )}
      </section>

      {showcaseCards.length > 0 && (
        <ShowcaseRail title="This Week" cards={showcaseCards} />
      )}

      <ProjectSection title="New Work" projects={latestProjects} />

      {promoCards.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted">Brand Breakdown</h2>
            <Link href="/projects" className="text-[13px] font-medium text-wld-blue hover:underline">
              All breakdowns -&gt;
            </Link>
          </div>
          <PromoBannerRail cards={promoCards} />
        </section>
      )}

      <TheEditInline />

      {utilityCards.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted">The Definition</h2>
            <Link href="/projects" className="text-[13px] font-medium text-wld-blue hover:underline">
              All essays -&gt;
            </Link>
          </div>
          <UtilityRail title="The Definition" shopHref="/projects" cards={utilityCards} />
        </section>
      )}

      <ProjectSection title="Trending Projects" projects={trendingProjects} />
      <ProjectSection title="Most Saved" projects={mostSavedProjects} />

      {latestProjects.length > 0 ? (
        <PostFeed initialPosts={latestProjects} ctaFrequency={config?.inFeedCardFrequency || 12} />
      ) : (
        <div className="py-16 text-center">
          <p className="text-[15px] text-muted">Loading projects...</p>
        </div>
      )}

      <p className="text-[14px] text-center text-muted">You&apos;ve reached the end. More work published daily.</p>
    </div>
  )
}

function TheEditInline() {
  return (
    <section className="rounded-card border border-border bg-white p-6 md:p-8">
      <h2 className="font-display text-[28px] text-wld-ink">The Edit.</h2>
      <p className="mt-2 text-[15px] text-muted">Curated work and sharp thinking, delivered weekly.</p>
      <p className="mt-1 text-[15px] text-muted">Join 25,000 brand-literate readers.</p>
      <div className="mt-5 flex flex-col sm:flex-row gap-2 max-w-[500px]">
        <input
          type="email"
          placeholder="Your email address"
          className="h-11 flex-1 px-4 text-[14px] border border-border rounded-full bg-white focus:outline-none focus:border-wld-ink"
          aria-label="Your email address"
        />
        <Link
          href="/newsletter"
          className="h-11 px-6 inline-flex items-center justify-center text-[14px] font-medium rounded-full bg-wld-ink text-white hover:bg-wld-blue transition-colors"
        >
          Subscribe
        </Link>
      </div>
      <p className="mt-3 text-[12px] text-muted">Published weekly. No noise. Unsubscribe anytime.</p>
    </section>
  )
}

function ProjectSection({ title, projects }: { title: string; projects: PostCardType[] }) {
  if (projects.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {projects.slice(0, 8).map((project, index) => (
          <PostCard key={`${title}-${project._id}`} post={project} priority={index < 2} />
        ))}
      </div>
    </section>
  )
}
