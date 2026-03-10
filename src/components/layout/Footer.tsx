import Link from 'next/link'

export function Footer() {
  const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL || 'https://welovedaily.substack.com'

  return (
    <footer className="border-t border-border bg-wld-paper">
      <div className="max-w-container mx-auto px-5 lg:px-8 py-16 lg:py-20">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* Brand */}
          <div className="md:col-span-4">
            <p className="font-display text-[28px] leading-none text-wld-ink mb-4">WeLoveDaily</p>
            <p className="text-[13px] text-muted leading-relaxed max-w-[260px]">
              The global platform for consumer brand design. Curated identities, packaging, and brand strategy.
            </p>
          </div>

          {/* Nav */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted mb-5">Explore</p>
            <div className="space-y-3">
              {[
                ['Projects', '/projects'],
                ['Articles', '/articles'],
                ['Categories', '/categories'],
                ['Submit', '/submit'],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="block text-[13px] text-wld-ink hover:text-wld-blue transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted mb-5">Company</p>
            <div className="space-y-3">
              {[
                ['About', '/about'],
                ['Contact', '/contact'],
                ['Newsletter', '/newsletter'],
                ['FAQs', '/faqs'],
                ['Careers', '/careers'],
                ['Advertise', '/advertise'],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="block text-[13px] text-wld-ink hover:text-wld-blue transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted mb-5">The Edit — Weekly</p>
            <p className="text-[13px] text-muted leading-relaxed mb-5">
              Curated brand work. Sharp thinking. No noise.
              Arrives every week.
            </p>
            <div className="space-y-2">
              <label htmlFor="footer-newsletter-email" className="sr-only">Your email address</label>
              <input
                id="footer-newsletter-email"
                type="email"
                name="email"
                placeholder="your@email.com"
                className="w-full h-10 px-4 text-[13px] border border-border rounded-full bg-wld-white text-wld-ink placeholder-muted focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors"
                aria-label="Your email address"
              />
              <Link
                href={substackUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to The Edit newsletter"
                className="w-full h-10 inline-flex items-center justify-center text-[13px] font-medium rounded-full bg-wld-ink text-wld-paper hover:opacity-80 transition-opacity"
              >
                Subscribe to The Edit
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-border flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-[11px] text-muted">© 2026 WeLoveDaily. An Atla* Group publication.</p>
          <div className="flex items-center gap-4">
            {[['Privacy', '/privacy'], ['Cookies', '/cookies'], ['Terms', '/terms']].map(([label, href]) => (
              <Link key={href} href={href} className="text-[11px] text-muted hover:text-wld-ink transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
