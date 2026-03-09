import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-container mx-auto px-5 py-20">
      <div className="max-w-[480px] mx-auto text-center">
        <span className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4 block">
          404
        </span>
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-4">
          Page not found
        </h1>
        <p className="text-[16px] leading-relaxed text-muted mb-8">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 text-[14px] font-medium bg-wld-ink text-white rounded-full hover:bg-wld-blue transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/search"
            className="px-5 py-2.5 text-[14px] font-medium border border-border rounded-full hover:border-wld-ink transition-colors"
          >
            Search
          </Link>
        </div>
      </div>
    </div>
  )
}
