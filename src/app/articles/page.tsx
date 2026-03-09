import { client } from '@/lib/sanity/client'
import { allArticlesQuery, loadMoreArticlesQuery } from '@/lib/sanity/queries'
import { PostFeed } from '@/components/feed/PostFeed'
import { buildMetadata } from '@/lib/utils/metadata'
import { collectionItemListJsonLd, jsonLdScript } from '@/lib/utils/jsonld'
import type { PostCard } from '@/types'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'Articles',
  description: 'Editorial articles and brand analysis from WeLoveDaily.',
  path: '/articles',
})

export default async function ArticlesPage() {
  const articles = await client.fetch<PostCard[]>(allArticlesQuery)

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
              itemPaths: articles.slice(0, 24).map((post) => `/projects/${post.slug}`),
            })
          ),
        }}
      />

      <header>
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-2">Articles</h1>
        <p className="text-[15px] text-muted max-w-[760px]">
          Brand analysis, editorial essays, and industry signals.
        </p>
      </header>

      {articles.length > 0 ? (
        <PostFeed
          initialPosts={articles}
          loadMoreQuery={loadMoreArticlesQuery}
          ctaFrequency={12}
        />
      ) : (
        <div className="py-16 text-center">
          <p className="text-[15px] text-wld-ink">No articles published yet.</p>
        </div>
      )}
    </div>
  )
}
