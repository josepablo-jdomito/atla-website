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
  title: 'Projects',
  description:
    'Browse all published projects and editorial features from WeLoveDaily.',
  path: '/projects',
})

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
                'Browse all published projects and editorial features from WeLoveDaily.',
              path: '/projects',
              itemPaths: projects.slice(0, 24).map((project) => `/projects/${project.slug}`),
            })
          ),
        }}
      />

      <header>
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-2">
          Projects
        </h1>
        <p className="text-[15px] text-muted max-w-[620px]">
          Every published breakdown, definition, signal, and new-work feature in one place.
        </p>
      </header>

      {categories.length > 0 && <CategoryChips categories={categories} />}

      {projects.length > 0 ? (
        <PostFeed
          initialPosts={projects}
          loadMoreQuery={loadMorePostsQuery}
          ctaFrequency={12}
        />
      ) : (
        <div className="py-16 text-center">
          <p className="text-[15px] text-muted">No projects published yet.</p>
        </div>
      )}
    </div>
  )
}
