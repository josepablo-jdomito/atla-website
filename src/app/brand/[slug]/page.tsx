import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity/client'
import { brandBySlugQuery, brandPostsQuery } from '@/lib/sanity/queries'
import { PostFeed } from '@/components/feed/PostFeed'
import { NewsletterModule } from '@/components/modules/NewsletterModule'
import { buildMetadata } from '@/lib/utils/metadata'
import type { Brand, PostCard } from '@/types'
import type { Metadata } from 'next'

export const revalidate = 60

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const brand = await client.fetch<Brand | null>(brandBySlugQuery, { slug: params.slug })
  if (!brand) return buildMetadata({ title: 'Not Found', noIndex: true })

  return buildMetadata({
    title: brand.seo?.metaTitle || brand.name,
    description: brand.seo?.metaDescription || brand.tagline || `${brand.name} on WeLoveDaily.`,
    path: `/brand/${brand.slug}`,
    ogImage: brand.seo?.ogImage
      ? urlFor(brand.seo.ogImage).width(1200).height(630).url()
      : brand.coverImage
        ? urlFor(brand.coverImage).width(1200).height(630).url()
        : undefined,
  })
}

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

const SOCIAL_ICONS: Record<string, { label: string; icon: string }> = {
  instagram: { label: 'Instagram', icon: 'IG' },
  linkedin: { label: 'LinkedIn', icon: 'Li' },
  twitter: { label: 'X', icon: 'X' },
  pinterest: { label: 'Pinterest', icon: 'Pi' },
  behance: { label: 'Behance', icon: 'Be' },
  dribbble: { label: 'Dribbble', icon: 'Dr' },
}

export default async function BrandPage({ params }: PageProps) {
  const [brand, posts] = await Promise.all([
    client.fetch<Brand | null>(brandBySlugQuery, { slug: params.slug }),
    client.fetch<PostCard[]>(brandPostsQuery, { brandSlug: params.slug }),
  ])

  if (!brand) notFound()

  const socials = brand.socials
    ? Object.entries(brand.socials).filter(([_, url]) => url)
    : []

  return (
    <div>
      {/* Hero cover image */}
      {brand.coverImage && (
        <div className="relative w-full h-[280px] md:h-[400px] bg-card overflow-hidden">
          <Image
            src={urlFor(brand.coverImage).width(1400).height(500).format('webp').quality(90).url()}
            alt={brand.coverImage.alt || brand.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="max-w-container mx-auto px-5">
        {/* Brand header */}
        <header className="py-8 md:py-10">
          <div className="flex items-start gap-5">
            {/* Logo */}
            {brand.logo && (
              <div className="w-[64px] h-[64px] md:w-[80px] md:h-[80px] rounded-xl overflow-hidden border border-border bg-white shrink-0">
                <Image
                  src={urlFor(brand.logo).width(160).height(160).format('webp').url()}
                  alt={brand.logo.alt || brand.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="font-display text-[28px] md:text-[36px] leading-[1.1] text-wld-ink">
                {brand.name}
              </h1>
              {brand.tagline && (
                <p className="mt-1 text-[15px] text-muted">{brand.tagline}</p>
              )}
              {/* Action buttons */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-white bg-wld-ink rounded-full hover:opacity-90 transition-opacity"
                  >
                    Visit brand
                    <span className="text-[11px]">&nearr;</span>
                  </a>
                )}
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-wld-ink border border-border rounded-full hover:border-wld-ink transition-colors"
                >
                  Submit a review
                </Link>
              </div>
            </div>
          </div>

          {brand.description && (
            <p className="mt-6 text-[15px] leading-[1.7] text-wld-ink max-w-article">
              {brand.description}
            </p>
          )}
        </header>

        {/* Metadata table */}
        <section className="border-t border-b border-border py-6 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-6 text-[13px]">
            {brand.spottedBy && (
              <MetaRow label="Spotted by" value={brand.spottedBy} />
            )}
            {brand.categories && brand.categories.length > 0 && (
              <MetaRow
                label="Categories"
                value={
                  <span className="flex flex-wrap gap-1">
                    {brand.categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="text-wld-blue hover:underline"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </span>
                }
              />
            )}
            {brand.industry && (
              <MetaRow label="Industry" value={INDUSTRY_LABELS[brand.industry] || brand.industry} />
            )}
            {brand.headquarters && (
              <MetaRow label="Headquarters" value={brand.headquarters} />
            )}
            {brand.founded && (
              <MetaRow label="Founded" value={brand.founded} />
            )}
            {brand.founders && brand.founders.length > 0 && (
              <MetaRow label="Founders" value={brand.founders.join(', ')} />
            )}
            {socials.length > 0 && (
              <MetaRow
                label="Socials"
                value={
                  <span className="flex gap-2">
                    {socials.map(([key, url]) => {
                      const social = SOCIAL_ICONS[key]
                      if (!social) return null
                      return (
                        <a
                          key={key}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={social.label}
                          className="
                            w-7 h-7 flex items-center justify-center
                            rounded-full border border-border
                            text-[10px] font-semibold text-muted
                            hover:border-wld-ink hover:text-wld-ink
                            transition-colors
                          "
                        >
                          {social.icon}
                        </a>
                      )
                    })}
                  </span>
                }
              />
            )}
          </div>
        </section>

        {/* Posts by this brand */}
        {posts.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4">
              Featured work ({posts.length})
            </h2>
            <PostFeed initialPosts={posts} showControls={false} />
          </section>
        ) : (
          <div className="py-12 text-center">
            <p className="text-[14px] text-muted">No published features yet for this brand.</p>
          </div>
        )}

        {/* Newsletter */}
        <div className="mb-12">
          <NewsletterModule />
        </div>
      </div>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="text-muted block mb-0.5">{label}</span>
      <span className="text-wld-ink font-medium">{value}</span>
    </div>
  )
}
