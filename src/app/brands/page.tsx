import Image from 'next/image'
import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity/client'
import { allBrandsQuery } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/utils/metadata'
import { collectionItemListJsonLd, jsonLdScript } from '@/lib/utils/jsonld'
import type { BrandCard } from '@/types'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = buildMetadata({
  title: 'Brands',
  description: 'Discover the brands we love. Curated profiles of the most thoughtful brands in design, hospitality, lifestyle, and beyond.',
  path: '/brands',
})

const INDUSTRY_LABELS: Record<string, string> = {
  branding: 'Branding & Identity',
  hospitality: 'Hospitality',
  cpg: 'CPG & Packaging',
  wellness: 'Wellness & Health',
  saas: 'SaaS & Technology',
  fashion: 'Fashion & Lifestyle',
  beauty: 'Beauty',
  food: 'Food & Beverage',
  tech: 'Tech',
  architecture: 'Architecture & Interiors',
  media: 'Media & Publishing',
}

export default async function BrandsPage() {
  const brands = await client.fetch<BrandCard[]>(allBrandsQuery)

  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            collectionItemListJsonLd({
              name: 'Brands',
              description:
                'Discover the brands we love. Curated profiles of thoughtful brands.',
              path: '/brands',
              itemPaths: brands.slice(0, 24).map((brand) => `/studio/${brand.slug}`),
            })
          ),
        }}
      />

      {/* Header */}
      <header className="mb-8">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-2">
          Brands
        </h1>
        <p className="text-[15px] text-muted max-w-[480px]">
          The brands we keep coming back to. Curated for craft, consistency, and character.
        </p>
      </header>

      {/* Grid */}
      {brands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/studio/${brand.slug}`}
              className="group flex items-center gap-4 p-4 rounded-2xl border border-border bg-white hover:border-wld-ink/20 transition-colors"
            >
              {/* Logo */}
              <div className="w-[52px] h-[52px] rounded-xl overflow-hidden border border-border bg-wld-paper shrink-0 flex items-center justify-center">
                {brand.logo ? (
                  <Image
                    src={urlFor(brand.logo).width(104).height(104).format('webp').url()}
                    alt={brand.logo.alt || brand.name}
                    width={52}
                    height={52}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-[18px] font-display text-muted">
                    {brand.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-[15px] font-semibold text-wld-ink truncate group-hover:text-wld-blue transition-colors">
                  {brand.name}
                </h2>
                {brand.tagline && (
                  <p className="text-[13px] text-muted truncate mt-0.5">{brand.tagline}</p>
                )}
                {brand.industry && (
                  <span className="text-[11px] text-muted mt-1 inline-block">
                    {INDUSTRY_LABELS[brand.industry] || brand.industry}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-[14px] text-muted">No brands published yet.</p>
        </div>
      )}
    </div>
  )
}
