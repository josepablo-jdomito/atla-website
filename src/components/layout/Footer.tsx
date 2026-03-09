import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-wld-paper">
      <div className="max-w-container mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-display text-[24px] leading-tight text-wld-ink">WeLoveDaily</h3>
            <p className="mt-3 text-[14px] text-muted max-w-[280px]">
              The global platform for consumer brand design.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-wider text-muted mb-4">Navigation</h4>
            <div className="space-y-2.5">
              <Link href="/projects" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">Projects</Link>
              <Link href="/articles" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">Articles</Link>
              <Link href="/categories" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">Categories</Link>
              <Link href="/submit" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">Submit</Link>
              <Link href="/newsletter" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">Newsletter</Link>
              <Link href="/about" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">About</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-wider text-muted mb-4">The Edit</h4>
            <p className="text-[14px] text-muted">The Edit arrives every week.</p>
            <p className="mt-1 text-[14px] text-muted">Curated work. Sharp thinking. No noise.</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="h-10 px-4 text-[14px] border border-border rounded-full bg-white focus:outline-none focus:border-wld-ink"
                aria-label="Your email address"
              />
              <Link
                href="/newsletter"
                className="h-10 px-5 inline-flex items-center justify-center text-[14px] font-medium rounded-full bg-wld-ink text-white hover:bg-wld-blue transition-colors"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p className="text-[13px] text-muted">© 2026 WeLoveDaily. An Atla* Group publication.</p>
          <p className="text-[13px] text-muted">
            <Link href="/privacy" className="hover:text-wld-ink transition-colors">Privacy Policy</Link>
            {' '}·{' '}
            <Link href="/terms" className="hover:text-wld-ink transition-colors">Terms of Use</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
