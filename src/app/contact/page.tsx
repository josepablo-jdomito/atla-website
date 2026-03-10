import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'Contact - WeLoveDaily',
  description:
    'Get in touch with WeLoveDaily. Submissions, editorial corrections, sponsorships, and general enquiries - we read everything.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <div className="max-w-container mx-auto px-5 py-10">
      <article className="max-w-article mx-auto space-y-8">
        <header className="space-y-3">
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink">Contact</h1>
          <p className="text-[16px] leading-relaxed text-muted">
            Use the right address and you&apos;ll get a real response.
          </p>
        </header>

        <section className="space-y-5">
          <div>
            <h2 className="text-[16px] font-semibold text-wld-ink">Work submissions</h2>
            <p className="text-[15px] leading-relaxed text-muted">
              Submit through the submissions form at <a href="/submit" className="text-wld-blue hover:underline">welovedaily.com/submit</a>.
              Email submissions sent directly here are not reviewed.
            </p>
          </div>

          <div>
            <h2 className="text-[16px] font-semibold text-wld-ink">Editorial corrections</h2>
            <a href="mailto:studio@welovedaily.com" className="text-[15px] text-wld-blue hover:underline">
              studio@welovedaily.com
            </a>
            <p className="text-[15px] leading-relaxed text-muted">
              Include the article URL and the specific correction needed.
            </p>
          </div>

          <div>
            <h2 className="text-[16px] font-semibold text-wld-ink">Sponsorships</h2>
            <a href="mailto:studio@welovedaily.com" className="text-[15px] text-wld-blue hover:underline">
              studio@welovedaily.com
            </a>
            <p className="text-[15px] leading-relaxed text-muted">
              Include your company name, what you&apos;re promoting, and the audience you&apos;re trying
              to reach. We&apos;ll reply if there&apos;s a relevant fit.
            </p>
          </div>

          <div>
            <h2 className="text-[16px] font-semibold text-wld-ink">Everything else</h2>
            <a href="mailto:studio@welovedaily.com" className="text-[15px] text-wld-blue hover:underline">
              studio@welovedaily.com
            </a>
          </div>
        </section>

        <footer className="pt-4 border-t border-border">
          <p className="text-[15px] leading-relaxed text-muted">
            We read everything. We respond to what warrants a response.
          </p>
        </footer>
      </article>
    </div>
  )
}
