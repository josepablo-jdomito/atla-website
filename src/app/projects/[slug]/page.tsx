import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity/client'
import { articleBySlugQuery, relatedPostsQuery } from '@/lib/sanity/queries'
import { PortableTextBody } from '@/components/modules/PortableTextBody'
import { PostCard } from '@/components/cards/PostCard'
import { NewsletterModule } from '@/components/modules/NewsletterModule'
import { SaveButton } from '@/components/actions/SaveButton'
import { ArticleTracker } from '@/app/[slug]/ArticleTracker'
import { buildMetadata } from '@/lib/utils/metadata'
import { articleJsonLd, breadcrumbJsonLd, jsonLdScript } from '@/lib/utils/jsonld'
import type { Post, PostCard as PostCardType } from '@/types'
import type { Metadata } from 'next'

export const revalidate = 60

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await client.fetch<Post | null>(articleBySlugQuery, { slug: params.slug })
  if (!post) return buildMetadata({ title: 'Not Found', noIndex: true })

  const ogImage = post.seo?.ogImage
    ? urlFor(post.seo.ogImage).width(1200).height(630).url()
    : urlFor(post.coverImage).width(1200).height(630).url()

  return buildMetadata({
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    path: `/projects/${post.slug}`,
    ogImage,
  })
}

export default async function ProjectPage({ params }: PageProps) {
  const post = await client.fetch<Post | null>(articleBySlugQuery, { slug: params.slug })
  if (!post) notFound()

  const manualRelated = post.relatedProjects || []
  const autoRelated = await client.fetch<PostCardType[]>(relatedPostsQuery, {
    categoryId: post.category._id,
    currentPostId: post._id,
    topic: post.topic || '',
    series: post.series || '',
    tags: post.tags || [],
    excludeIds: manualRelated.map((item) => item._id),
  })
  const related = [...manualRelated, ...autoRelated].slice(0, 6)

  const sponsorText = post.isSponsored
    ? post.sponsorshipType === 'partnerContent'
      ? 'Partner Content'
      : post.sponsorName
        ? `Supported by ${post.sponsorName}`
        : post.sponsorLabel || 'Supported'
    : null

  const heroUrl = urlFor(post.coverImage).width(1400).height(900).format('webp').quality(90).url()

  return (
    <article className="max-w-container mx-auto px-5 py-10">
      <ArticleTracker slug={post.slug} category={post.category.name} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            articleJsonLd({
              title: post.title,
              description: post.excerpt,
              slug: post.slug,
              coverImageUrl: heroUrl,
              publishedAt: post.publishedAt,
              updatedAt: post._updatedAt,
              categoryName: post.category.name,
              categorySlug: post.category.slug,
              isSponsored: post.isSponsored,
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
              { name: post.category.name, path: `/category/${post.category.slug}` },
              { name: post.title, path: `/projects/${post.slug}` },
            ])
          ),
        }}
      />

      <header className="max-w-article mx-auto mb-8 space-y-4">
        {sponsorText && (
          <span className="inline-block text-[12px] font-medium text-muted uppercase tracking-wider">
            {sponsorText}
          </span>
        )}
        <Link
          href={`/category/${post.category.slug}`}
          className="text-[12px] font-medium uppercase tracking-wider text-wld-blue hover:underline"
        >
          {post.category.name}
        </Link>
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink">
          {post.title}
        </h1>
        <div>
          <SaveButton projectId={post._id} preventLinkNavigation={false} />
        </div>
        <p className="text-[16px] leading-relaxed text-muted">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-3 text-[12px] uppercase tracking-wider text-muted">
          {post.brand?.name || post.brandName ? <span>{post.brand?.name || post.brandName}</span> : null}
          {post.studio ? <span>{post.studio}</span> : null}
          {post.designerCredits && post.designerCredits.length > 0 ? (
            <span>{post.designerCredits.join(', ')}</span>
          ) : null}
        </div>
      </header>

      <div className="mb-10">
        <Image
          src={heroUrl}
          alt={post.coverImage.alt || post.title}
          width={1400}
          height={900}
          className="w-full h-auto rounded-card"
          priority
          sizes="100vw"
        />
      </div>

      <PortableTextBody value={post.body} />

      {post.credits && post.credits.length > 0 && (
        <div className="max-w-article mx-auto mt-12 pt-8 border-t border-border">
          <h3 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4">Credits</h3>
          <div className="space-y-2">
            {post.credits.map((credit, i) => (
              <div key={i} className="flex justify-between text-[14px]">
                <span className="text-muted">{credit.role}</span>
                {credit.url ? (
                  <a
                    href={credit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-wld-ink hover:text-wld-blue transition-colors"
                  >
                    {credit.name}
                  </a>
                ) : (
                  <span className="text-wld-ink">{credit.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-[18px] font-semibold text-wld-ink mb-6">Continue reading</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((relatedPost) => (
              <PostCard key={relatedPost._id} post={relatedPost} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-16">
        <NewsletterModule />
      </div>

      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link
          href="/submit"
          className="px-5 py-2.5 text-[14px] font-medium border border-border rounded-full hover:border-wld-ink transition-colors"
        >
          Submit a project
        </Link>
        <Link
          href="/advertise"
          className="px-5 py-2.5 text-[14px] font-medium border border-border rounded-full hover:border-wld-ink transition-colors"
        >
          Advertise with welove
        </Link>
      </div>
    </article>
  )
}
