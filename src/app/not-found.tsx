import Link from 'next/link'

export default async function NotFound() {
  return (
    <div className="max-w-container mx-auto px-5 py-20">
      <div className="max-w-[620px] mx-auto text-center">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-4">Nothing here.</h1>
        <p className="text-[16px] leading-relaxed text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Start from the homepage or
          search for what you need below.
        </p>

        <form action="/search" className="mb-8">
          <input
            type="search"
            name="q"
            placeholder="Search studios, brands, or topics"
            className="w-full h-12 rounded-full border border-border bg-white px-5 text-[15px] placeholder:text-muted focus:outline-none focus:border-wld-ink"
          />
        </form>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/projects"
            className="px-5 py-2.5 text-[14px] font-medium bg-wld-ink text-white rounded-full hover:bg-wld-blue transition-colors"
          >
            Back to projects -&gt;
          </Link>
          <Link
            href="/categories"
            className="px-5 py-2.5 text-[14px] font-medium border border-border rounded-full hover:border-wld-ink transition-colors"
          >
            Browse categories -&gt;
          </Link>
        </div>
      </div>
    </div>
  )
}
