import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity/client'
import { categoryPageQuery, allCategoriesQuery, categoryLoadMoreQuery } from '@/lib/sanity/queries'
import { CategoryChips } from '@/components/feed/CategoryChips'
import { PostFeed } from '@/components/feed/PostFeed'
import { NewsletterModule } from '@/components/modules/NewsletterModule'
import { buildMetadata } from '@/lib/utils/metadata'
import { collectionPageJsonLd, breadcrumbJsonLd, jsonLdScript } from '@/lib/utils/jsonld'
import type { CategoryPageData, Category } from '@/types'
import type { Metadata } from 'next'

export const revalidate = 300
export const dynamicParams = true

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
    title: `${data.category.name} - Projects, Case Studies, and Examples`,
    description:
      data.category.description ||
      `Browse curated ${data.category.name} projects, case studies, and examples on WeLoveDaily.`,
    path: `/category/${data.category.slug}`,
  })
}

export async function generateStaticParams() {
  try {
    const categories = await client.fetch<Category[]>(allCategoriesQuery)
    return categories.map((category) => ({ slug: category.slug }))
  } catch {
    return []
  }
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            collectionPageJsonLd({
              name: data.category.name,
              description: data.category.description,
              slug: data.category.slug,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Categories', path: '/categories' },
              { name: data.category.name, path: `/category/${data.category.slug}` },
            ])
          ),
        }}
      />

      <header className="mb-8 space-y-3">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink">
          {data.category.name} - Projects, Case Studies, and Examples
        </h1>
        <p className="text-[15px] text-muted max-w-[820px]">
          {data.category.description ||
            `Curated ${data.category.name} work from studios and designers worldwide, selected for strategic clarity and craft.`}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-[13px]">
          <span className="font-medium text-wld-ink">{data.posts.length} projects</span>
          <Link href="/submit" className="text-wld-blue hover:underline">
            Submit work to this category -&gt;
          </Link>
        </div>
      </header>

      <CategoryChips categories={allCategories} activeSlug={params.slug} allHref="/projects" />

      <div className="mt-6">
        {data.posts.length > 0 ? (
          <PostFeed
            initialPosts={data.posts}
            loadMoreQuery={categoryLoadMoreQuery}
            loadMoreParams={{ categorySlug: params.slug }}
          />
        ) : (
          <div className="py-16 text-center">
            <p className="text-[15px] text-wld-ink">Nothing here yet.</p>
            <Link href="/submit" className="text-[14px] text-wld-blue hover:underline">
              This category is new. Be the first to submit work. -&gt;
            </Link>
          </div>
        )}
      </div>

      <div className="mt-16">
        <NewsletterModule />
      </div>
    </div>
  )
}
