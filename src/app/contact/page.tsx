import { buildMetadata } from '@/lib/utils/metadata'
import { ContactForm } from './ContactForm'
import { PageHero } from '@/components/layout/PageHero'

export const metadata = buildMetadata({
  title: 'Contact - WeLoveDaily',
  description:
    'Get in touch with WeLoveDaily. Submissions, editorial corrections, sponsorships, and general enquiries — we read everything.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <div className="max-w-container mx-auto px-5 py-12 space-y-10">
      <PageHero alt="Contact WeLoveDaily" />
      <div className="max-w-[740px] mx-auto">

        <header className="space-y-3 mb-12">
          <h1 className="font-display text-[38px] md:text-[46px] leading-[1.1] text-wld-ink">Contact</h1>
          <p className="text-[16px] leading-relaxed text-muted">
            Use the right channel and you&apos;ll get a real response.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-start">

          {/* Left — info */}
          <aside className="space-y-6 lg:sticky lg:top-8">
            <div className="space-y-5">

              <div className="space-y-1">
                <h2 className="text-[13px] font-semibold text-wld-ink uppercase tracking-wider">Work submissions</h2>
                <p className="text-[14px] leading-relaxed text-muted">
                  Use the{' '}
                  <a href="/submit" className="text-wld-blue hover:underline underline-offset-2">submissions page</a>.
                  Email submissions are not reviewed.
                </p>
              </div>

              <div className="w-full h-px bg-border" />

              <div className="space-y-1">
                <h2 className="text-[13px] font-semibold text-wld-ink uppercase tracking-wider">Editorial corrections</h2>
                <p className="text-[14px] leading-relaxed text-muted">
                  Include the article URL and the specific correction needed.
                </p>
              </div>

              <div className="w-full h-px bg-border" />

              <div className="space-y-1">
                <h2 className="text-[13px] font-semibold text-wld-ink uppercase tracking-wider">Sponsorships</h2>
                <p className="text-[14px] leading-relaxed text-muted">
                  Include your company name, what you&apos;re promoting, and the audience you&apos;re targeting.
                </p>
              </div>

              <div className="w-full h-px bg-border" />

              <div className="space-y-1">
                <h2 className="text-[13px] font-semibold text-wld-ink uppercase tracking-wider">Direct email</h2>
                <a
                  href="mailto:studio@welovedaily.com"
                  className="text-[14px] text-wld-blue hover:underline underline-offset-2"
                >
                  studio@welovedaily.com
                </a>
              </div>
            </div>

            <p className="text-[13px] text-muted pt-2 border-t border-border">
              We read everything. We respond to what warrants a response.
            </p>
          </aside>

          {/* Right — form */}
          <div>
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  )
}
