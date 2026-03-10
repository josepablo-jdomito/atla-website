import Link from 'next/link'
import { buildMetadata } from '@/lib/utils/metadata'
import { PageHero } from '@/components/layout/PageHero'

export const metadata = buildMetadata({
  title: 'The Edit - Weekly Brand Design Newsletter',
  description:
    'A weekly letter for brand-literate operators. Curated work, sharp analysis, and one thing worth thinking about. Free. Published every week without fail.',
  path: '/newsletter',
})

export default function NewsletterPage() {
  const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL || 'https://welovedaily.substack.com'

  return (
    <div className="max-w-container mx-auto px-5 py-10 space-y-12">
      <PageHero alt="The Edit — WeLoveDaily Newsletter" />
      <header className="max-w-article space-y-4">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink">The Edit</h1>
        <p className="text-[16px] leading-relaxed text-muted">
          A weekly letter for people building brands that matter. Curated work, sharp analysis,
          and one thing worth thinking about before the week ends.
        </p>
        <Link
          href={substackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-5 py-2.5 text-[14px] font-medium rounded-full bg-wld-ink text-white hover:bg-wld-blue transition-colors"
        >
          Subscribe - it&apos;s free
        </Link>
      </header>

      <section className="max-w-container">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-5">What&apos;s Inside</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-card border border-border bg-white">
            <h3 className="text-[18px] font-semibold text-wld-ink">The Feature</h3>
            <p className="mt-2 text-[14px] text-muted leading-relaxed">
              One brand, one studio, or one piece of work - analyzed with the context that most
              coverage skips.
            </p>
          </div>
          <div className="p-5 rounded-card border border-border bg-white">
            <h3 className="text-[18px] font-semibold text-wld-ink">The Edit</h3>
            <p className="mt-2 text-[14px] text-muted leading-relaxed">
              Five works curated around a single theme. Selection is the editorial opinion.
            </p>
          </div>
          <div className="p-5 rounded-card border border-border bg-white">
            <h3 className="text-[18px] font-semibold text-wld-ink">One to Watch</h3>
            <p className="mt-2 text-[14px] text-muted leading-relaxed">
              A studio or designer building something worth knowing before everyone else does.
            </p>
          </div>
        </div>
      </section>

      <section className="p-6 md:p-8 rounded-card border border-border bg-white">
        <p className="text-[16px] text-wld-ink">
          Read by founders, CMOs, and creative directors in 40+ countries.
        </p>
        <p className="mt-1 text-[15px] text-muted">25,000+ subscribers. Published every week without fail.</p>
      </section>

      <section className="max-w-[560px]">
        <h2 className="text-[16px] font-semibold text-wld-ink mb-3">Join The Edit</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Your email address"
            className="h-11 flex-1 px-4 text-[14px] border border-border rounded-full bg-white focus:outline-none focus:border-wld-ink"
            aria-label="Your email address"
          />
          <Link
            href={substackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-6 inline-flex items-center justify-center text-[14px] font-medium rounded-full bg-wld-ink text-white hover:bg-wld-blue transition-colors"
          >
            Subscribe
          </Link>
        </div>
        <p className="mt-3 text-[12px] text-muted">Free. Weekly. Unsubscribe anytime.</p>
      </section>

      <section>
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted">Browse past issues</h2>
        <a
          href={substackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-[14px] font-medium text-wld-blue hover:underline"
        >
          View the archive -&gt;
        </a>
      </section>
    </div>
  )
}
