import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity/client'
import { homepageQuery } from '@/lib/sanity/queries'
import { Logo } from '@/components/layout/Logo'
import { buildMetadata } from '@/lib/utils/metadata'
import { splitPostsByContentType } from '@/lib/utils/contentType'
import type { HomepageData, PostCard as PostCardType } from '@/types'

export const revalidate = 60
export const metadata = buildMetadata({
  title: 'WeLoveDaily - Consumer Brand Design Platform',
  description:
    'The global platform for consumer brand design. Curated identities, packaging, rebrands, and brand strategy - for founders, CMOs, and creative directors.',
  path: '/',
})

const TRENDING_CHIPS = [
  'Trending',
  'New launches',
  'Ice cream social',
  "Let\'s go to the beach",
  'Sunglass season',
  'Be among the first to review',
]

export default async function HomePage() {
  const data = await client.fetch<HomepageData>(homepageQuery)
  const latestPosts = data?.latestProjects ?? []
  const categories = data?.categories ?? []

  const { articles, projects } = splitPostsByContentType(latestPosts)
  const featuredArticle = articles[0] || null
  const featuredProject = projects[0] || null
  const feedPosts = latestPosts.filter((post) => post._id !== featuredArticle?._id && post._id !== featuredProject?._id)

  return (
    <div className="px-4 lg:px-8 py-4 lg:py-6 space-y-4 max-w-full">
      <div className="lg:hidden flex items-center justify-between py-1">
        <Logo className="h-5 w-auto text-wld-ink" />
      </div>

      <header className="border-b border-border pb-5">
        <h1 className="font-display text-[42px] md:text-[56px] lg:text-[64px] leading-[0.95] text-wld-ink max-w-[760px]">
          Discover brands, share your honest reviews.
        </h1>
      </header>

      <section className="border-b border-border pb-3 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 min-w-max">
              {TRENDING_CHIPS.map((chip, index) => (
                <Link
                  key={chip}
                  href={index === 0 ? '/search?q=trending' : `/search?q=${encodeURIComponent(chip)}`}
                  className={`px-4 h-8 rounded-full border text-[12px] inline-flex items-center whitespace-nowrap ${
                    index === 0
                      ? 'bg-wld-ink text-white border-wld-ink'
                      : 'bg-white text-wld-ink border-border hover:border-wld-ink'
                  }`}
                >
                  {chip}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button className="h-8 px-3 rounded-full border border-border text-[12px] bg-white">Filter</button>
            <button className="h-8 px-3 rounded-full border border-border text-[12px] bg-white">Sort by Relevance</button>
            <button className="h-8 px-3 rounded-full border border-border text-[12px] bg-white">View</button>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 min-w-max">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  className="h-8 px-3 rounded-full border border-border text-[12px] bg-white text-wld-ink hover:border-wld-ink inline-flex items-center"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {(featuredArticle || featuredProject) && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {featuredArticle ? (
            <FeatureTile post={featuredArticle} label="Featured Article" />
          ) : (
            <div />
          )}
          {featuredProject ? <FeatureTile post={featuredProject} label="Featured Project" /> : <div />}
        </section>
      )}

      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-[140px] md:auto-rows-[170px]">
        {feedPosts.slice(0, 24).map((post, index) => (
          <MasonryTile key={post._id} post={post} large={index % 7 === 0 || index % 7 === 4} />
        ))}
      </section>

      <div className="flex justify-center py-6">
        <Link
          href="/projects"
          className="h-10 px-5 rounded-full border border-border text-[14px] text-wld-ink hover:border-wld-ink inline-flex items-center"
        >
          Explore all projects and articles -&gt;
        </Link>
      </div>
    </div>
  )
}

function FeatureTile({ post, label }: { post: PostCardType; label: string }) {
  const imageUrl = urlFor(post.coverImage).width(1400).height(900).format('webp').quality(85).url()

  return (
    <Link href={`/projects/${post.slug}`} className="group block relative rounded-[18px] overflow-hidden border border-border bg-card min-h-[280px]">
      <Image
        src={imageUrl}
        alt={post.coverImage.alt || post.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/55" />
      <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
        <p className="text-[11px] uppercase tracking-wider opacity-90">{label}</p>
        <h2 className="text-[22px] md:text-[28px] leading-tight font-semibold mt-1 max-w-[90%]">{post.title}</h2>
      </div>
    </Link>
  )
}

function MasonryTile({ post, large }: { post: PostCardType; large: boolean }) {
  const imageUrl = urlFor(post.coverImage).width(900).height(700).format('webp').quality(82).url()

  return (
    <Link
      href={`/projects/${post.slug}`}
      className={`group relative rounded-[12px] overflow-hidden border border-border bg-card ${large ? 'row-span-2' : 'row-span-1'}`}
    >
      <Image
        src={imageUrl}
        alt={post.coverImage.alt || post.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/45 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute left-3 right-3 bottom-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[11px] uppercase tracking-wider">{post.category.name}</p>
        <p className="text-[14px] leading-snug font-medium mt-1 line-clamp-2">{post.title}</p>
      </div>
    </Link>
  )
}
