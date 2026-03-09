import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { allCategoriesQuery } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/utils/metadata'
import { collectionItemListJsonLd, jsonLdScript } from '@/lib/utils/jsonld'
import type { Category } from '@/types'

export const revalidate = 300

export const metadata = buildMetadata({
  title: 'Categories - Explore Brand Design by Discipline',
  description:
    'Browse brand identity, packaging, rebrand, retail design, and brand strategy projects. Every category curated to a standard. Updated daily.',
  path: '/categories',
})

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'brand identity':
    'The full visual and verbal system that defines how a brand exists in the world. Logos, type, color, texture, tone - and how they hold together under pressure.',
  'packaging design':
    'The surface where brand strategy meets the shelf. Packaging that earns attention, communicates value, and builds recognition across a category.',
  rebrand:
    'Brands that changed. The decisions behind the work, the strategic logic, and what it tells you about where a category is moving.',
  'retail & environmental':
    'The physical experience of a brand. Space, signage, material, and the design decisions that turn a location into a destination.',
  'brand strategy':
    'The frameworks, thinking, and intellectual work that precedes the visual. Positioning, naming, architecture, and the arguments that build distinctive brands.',
  'concept work':
    'Student projects, experimental identities, and self-initiated work. Where next-generation voices are building the language of the industry.',
}

export default async function CategoriesPage() {
  const categories = await client.fetch<Category[]>(allCategoriesQuery)

  return (
    <div className="max-w-container mx-auto px-5 py-10 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            collectionItemListJsonLd({
              name: 'Categories',
              description: 'Browse by discipline on WeLoveDaily.',
              path: '/categories',
              itemPaths: categories.slice(0, 24).map((cat) => `/category/${cat.slug}`),
            })
          ),
        }}
      />

      <header>
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-2">Categories</h1>
        <p className="text-[15px] text-muted max-w-[760px]">
          Every project published on WeLoveDaily belongs to a category. Browse by discipline.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const categoryName = cat.name || 'Category'
          const fallbackDescription = CATEGORY_DESCRIPTIONS[categoryName.toLowerCase()]
          const description = cat.description || fallbackDescription
          return (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="group p-6 rounded-card border border-border hover:border-wld-ink transition-colors duration-200 bg-white"
            >
              <h2 className="text-[19px] font-semibold text-wld-ink group-hover:text-wld-blue transition-colors">
                {categoryName}
              </h2>
              {description && (
                <p className="mt-3 text-[14px] text-muted leading-relaxed line-clamp-5">{description}</p>
              )}
              <p className="mt-5 text-[13px] font-medium text-wld-ink">{cat.postCount || 0} projects</p>
              <p className="mt-1 text-[13px] text-wld-blue">Submit work to this category -&gt;</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
