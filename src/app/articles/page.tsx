import { client } from '@/lib/sanity/client'
import { articlesPageQuery } from '@/lib/sanity/queries'
import { FilteredFeed } from '@/components/feed/FilteredFeed'
import { buildMetadata } from '@/lib/utils/metadata'
import { collectionItemListJsonLd, jsonLdScript } from '@/lib/utils/jsonld'
import type { PostCard, Category } from '@/types'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'Articles',
  description: 'Editorial articles and brand analysis from WeLoveDaily.',
  path: '/articles',
})

interface ArticlesPageData {
  posts: PostCard[]
  categories: Category[]
  allTags: string[]
}

export default async function ArticlesPage() {
  const data = await client.fetch<ArticlesPageData>(articlesPageQuery)
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
              name: 'Articles',
              description: 'Editorial articles and brand analysis from WeLoveDaily.',
              path: '/articles',
              itemPaths: posts.slice(0, 24).map((post) => `/projects/${post.slug}`),
            }),
          ),
        }}
      />

      <header>
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-2">
          Articles
        </h1>
        <p className="text-[15px] text-muted max-w-[760px]">
          Brand analysis, editorial essays, and industry signals.
        </p>
      </header>

      {posts.length > 0 ? (
        <FilteredFeed
          allPosts={posts}
          categories={categories}
          allTags={allTags}
          hideTypeFilter
          defaultType="articles"
        />
      ) : (
        <div className="py-16 text-center">
          <p className="text-[15px] text-wld-ink">No articles published yet.</p>
        </div>
      )}
    </div>
  )
}
