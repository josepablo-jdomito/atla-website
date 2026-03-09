import Link from 'next/link'
import type { Category } from '@/types'

interface CategoryChipsProps {
  categories: Category[]
  activeSlug?: string
  allHref?: string
}

export function CategoryChips({ categories, activeSlug, allHref = '/' }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Link
        href={allHref}
        className={`px-4 py-2 text-[13px] font-medium rounded-full border transition-all duration-200 ${
          !activeSlug
            ? 'bg-wld-ink text-white border-wld-ink'
            : 'bg-wld-white text-wld-ink border-border hover:border-wld-ink'
        }`}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat._id}
          href={`/category/${cat.slug}`}
          className={`px-4 py-2 text-[13px] font-medium rounded-full border transition-all duration-200 ${
            activeSlug === cat.slug
              ? 'bg-wld-ink text-white border-wld-ink'
              : 'bg-wld-white text-wld-ink border-border hover:border-wld-ink'
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}
