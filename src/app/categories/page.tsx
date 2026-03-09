import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { allCategoriesQuery } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/utils/metadata'
import type { Category } from '@/types'

export const revalidate = 60

export const metadata = buildMetadata({
  title: 'Categories',
  description: 'Browse all categories on WeLoveDaily.',
  path: '/categories',
})

export default async function CategoriesPage() {
  const categories = await client.fetch<Category[]>(allCategoriesQuery)

  return (
    <div className="max-w-container mx-auto px-5 py-10">
      <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-8">
        Categories
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/category/${cat.slug}`}
            className="
              group p-6 rounded-card border border-border
              hover:border-wld-ink transition-colors duration-200
            "
          >
            <h2 className="text-[18px] font-semibold text-wld-ink group-hover:text-wld-blue transition-colors">
              {cat.name}
            </h2>
            {cat.description && (
              <p className="mt-2 text-[14px] text-muted line-clamp-2">{cat.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
