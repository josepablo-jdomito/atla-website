import { client } from '@/lib/sanity/client'
import { projectsPageQuery } from '@/lib/sanity/queries'
import { FilteredFeed } from '@/components/feed/FilteredFeed'
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

interface ProjectsPageData {
  posts: PostCard[]
  categories: Category[]
  allTags: string[]
}

export default async function ProjectsPage() {
  const data = await client.fetch<ProjectsPageData>(projectsPageQuery)
  const posts = data?.posts ?? []
  const categories = data?.categories ?? []
  const allTags = (data?.allTags ?? []).filter(Boolean).sort()

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
              itemPaths: posts.slice(0, 24).map((project) => `/projects/${project.slug}`),
            }),
          ),
        }}
      />

      <header>
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-2">
          Projects
        </h1>
        <p className="text-[15px] text-muted max-w-[760px]">
          Brand identities, packaging systems, and creative direction — curated from studios and
          designers worldwide.
        </p>
      </header>

      {posts.length > 0 ? (
        <FilteredFeed
          allPosts={posts}
          categories={categories}
          allTags={allTags}
          hideTypeFilter
          defaultType="projects"
        />
      ) : (
        <div className="py-16 text-center">
          <p className="text-[15px] text-wld-ink">Nothing here yet.</p>
          <a href="/submit" className="text-[14px] text-wld-blue hover:underline">
            Be the first to submit work. -&gt;
          </a>
        </div>
      )}
    </div>
  )
}
