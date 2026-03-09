import { client } from '@/lib/sanity/client'
import { allProjectsQuery, allCategoriesQuery, loadMorePostsQuery } from '@/lib/sanity/queries'
import { PostFeed } from '@/components/feed/PostFeed'
import { CategoryChips } from '@/components/feed/CategoryChips'
import { buildMetadata } from '@/lib/utils/metadata'
import { collectionItemListJsonLd, jsonLdScript } from '@/lib/utils/jsonld'
import type { PostCard, Category } from '@/types'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = buildMetadata({
  title: 'Projects - Brand Identity & Packaging Design',
  description:
    'Browse hundreds of curated brand identities, packaging systems, and rebrands. WeLoveDaily publishes the best brand design work from studios worldwide.',
  path: '/projects',
})

const FILTER_LABELS = [
  'All',
  'Brand Identity',
  'Packaging',
  'Rebrand',
  'Retail & Environmental',
  'Brand Strategy',
  'Concept Work',
]

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    client.fetch<PostCard[]>(allProjectsQuery),
    client.fetch<Category[]>(allCategoriesQuery),
  ])

  return (
    <div className="max-w-container mx-auto px-5 py-10 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            collectionItemListJsonLd({
              name: 'Projects',
              description:
                'Browse hundreds of curated brand identities, packaging systems, and rebrands.',
              path: '/projects',
              itemPaths: projects.slice(0, 24).map((project) => `/projects/${project.slug}`),
            })
          ),
        }}
      />

      <header>
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-2">Projects</h1>
        <p className="text-[15px] text-muted max-w-[760px]">
          Brand identities, packaging systems, and creative direction - curated from studios and
          designers worldwide.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2 py-1">
        {FILTER_LABELS.map((label, i) => (
          <span
            key={label}
            className={`px-4 py-2 text-[13px] font-medium rounded-full border ${
              i === 0
                ? 'bg-wld-ink text-white border-wld-ink'
                : 'bg-white text-wld-ink border-border'
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {categories.length > 0 && <CategoryChips categories={categories} allHref="/projects" />}

      <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted">
        <span className="font-medium text-wld-ink">Sort by:</span>
        <span>Recent</span>
        <span>Most Viewed</span>
        <span>Curated</span>
      </div>

      {projects.length > 0 ? (
        <PostFeed initialPosts={projects} loadMoreQuery={loadMorePostsQuery} ctaFrequency={12} />
      ) : (
        <div className="py-16 text-center">
          <p className="text-[15px] text-wld-ink">Nothing here yet.</p>
          <a href="/submit" className="text-[14px] text-wld-blue hover:underline">
            Be the first to submit work in this category. -&gt;
          </a>
        </div>
      )}
    </div>
  )
}
