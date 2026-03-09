import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity/client'
import { categoryPageQuery, allCategoriesQuery, categoryLoadMoreQuery } from '@/lib/sanity/queries'
import { CategoryChips } from '@/components/feed/CategoryChips'
import { PostFeed } from '@/components/feed/PostFeed'
import { NewsletterModule } from '@/components/modules/NewsletterModule'
import { buildMetadata } from '@/lib/utils/metadata'
import type { CategoryPageData, Category } from '@/types'
import type { Metadata } from 'next'

export const revalidate = 60

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await client.fetch<CategoryPageData | null>(categoryPageQuery, {
    slug: params.slug,
    limit: 1,
  })

  if (!data?.category) return buildMetadata({ title: 'Not Found', noIndex: true })

  return buildMetadata({
    title: data.category.name,
    description: data.category.description || `Browse ${data.category.name} on WeLoveDaily.`,
    path: `/category/${data.category.slug}`,
  })
}

export default async function CategoryPage({ params }: PageProps) {
  const [data, allCategories] = await Promise.all([
    client.fetch<CategoryPageData | null>(categoryPageQuery, {
      slug: params.slug,
      limit: 20,
    }),
    client.fetch<Category[]>(allCategoriesQuery),
  ])

  if (!data?.category) notFound()

  return (
    <div className="max-w-container mx-auto px-5 py-10">
      {/* Category header */}
      <header className="mb-8">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-2">
          {data.category.name}
        </h1>
        {data.category.description && (
          <p className="text-[16px] text-muted max-w-[520px]">{data.category.description}</p>
        )}
      </header>

      {/* Category chips */}
      <CategoryChips categories={allCategories} activeSlug={params.slug} />

      {/* Feed */}
      <PostFeed
        initialPosts={data.posts}
        loadMoreQuery={categoryLoadMoreQuery}
        loadMoreParams={{ categorySlug: params.slug }}
      />

      {/* Newsletter */}
      <div className="mt-16">
        <NewsletterModule />
      </div>
    </div>
  )
}
