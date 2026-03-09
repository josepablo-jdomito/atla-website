import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { homepageQuery } from '@/lib/sanity/queries'
import { DiscoveryStrip } from '@/components/feed/DiscoveryStrip'
import { CategoryChips } from '@/components/feed/CategoryChips'
import { Logo } from '@/components/layout/Logo'
import { PostCard } from '@/components/cards/PostCard'
import { buildMetadata } from '@/lib/utils/metadata'
import { splitPostsByContentType } from '@/lib/utils/contentType'
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
  const categories = data?.categories ?? []
  const latestPosts = data?.latestProjects ?? []
  const featured = data?.featuredProjects ?? []

  const { articles: latestArticles, projects: latestProjects } = splitPostsByContentType(latestPosts)
  const { articles: featuredArticles, projects: featuredProjects } = splitPostsByContentType(featured)

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
          Featured articles and featured projects, curated for brand builders.
        </p>
      </header>

      <DiscoveryStrip categories={categories} />
      {categories.length > 0 && <CategoryChips categories={categories} />}

      <ContentSection title="Featured Articles" href="/articles" cta="View all articles ->" posts={featuredArticles} />
      <ContentSection title="Featured Projects" href="/projects" cta="View all projects ->" posts={featuredProjects} />

      <ContentSection title="Latest Articles" href="/articles" cta="See more ->" posts={latestArticles} />
      <ContentSection title="Latest Projects" href="/projects" cta="See more ->" posts={latestProjects} />
    </div>
  )
}

function ContentSection({
  title,
  posts,
  href,
  cta,
}: {
  title: string
  posts: PostCardType[]
  href: string
  cta: string
}) {
  if (posts.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted">{title}</h2>
        <Link href={href} className="text-[13px] font-medium text-wld-blue hover:underline">
          {cta}
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {posts.slice(0, 8).map((post, index) => (
          <PostCard key={`${title}-${post._id}`} post={post} priority={index < 2} />
        ))}
      </div>
    </section>
  )
}
