import Link from 'next/link'
import type { Category } from '@/types'

interface CategoryChipsProps {
  categories: Category[]
  activeSlug?: string
  allHref?: string
}

const CATEGORY_NAME_BY_SLUG: Record<string, string> = {
  'brand-breakdown': 'Brand Breakdown',
  'cult-brand-index': 'Cult Brand Index',
  'industry-signal': 'Industry Signal',
  'new-work': 'New Work',
  'the-definition': 'The Definition',
}

function getCategoryLabel(category: Category): string {
  const name = category.name?.trim()
  if (name) return name
  const fromSlug = CATEGORY_NAME_BY_SLUG[category.slug]
  if (fromSlug) return fromSlug
  return category.slug
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ') || 'Uncategorized'
}

export function CategoryChips({ categories, activeSlug, allHref = '/' }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Link
        href={allHref}
        aria-label="All categories"
        className={`px-4 py-2 text-[13px] font-medium rounded-full border transition-all duration-200 ${
          !activeSlug
            ? 'bg-wld-ink text-white border-wld-ink'
            : 'bg-wld-white text-wld-ink border-border hover:border-wld-ink'
        }`}
      >
        All
      </Link>
      {categories.map((cat) => {
        const categoryLabel = getCategoryLabel(cat)
        return (
          <Link
            key={cat._id}
            href={`/category/${cat.slug}`}
            aria-label={`View ${categoryLabel} projects`}
            className={`px-4 py-2 text-[13px] font-medium rounded-full border transition-all duration-200 ${
              activeSlug === cat.slug
                ? 'bg-wld-ink text-white border-wld-ink'
                : 'bg-wld-white text-wld-ink border-border hover:border-wld-ink'
            }`}
          >
            {categoryLabel}
          </Link>
        )
      })}
    </div>
  )
}
