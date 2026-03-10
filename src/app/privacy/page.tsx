import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'Privacy Policy - WeLoveDaily',
  description:
    'How WeLoveDaily collects, uses, stores, and protects personal data across subscriptions, submissions, analytics, and contact workflows.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <div className="max-w-container mx-auto px-5 py-10">
      <article className="max-w-article mx-auto space-y-7 text-[15px] leading-[1.7] text-wld-ink">
        <header className="space-y-2">
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink">Privacy Policy</h1>
          <p className="text-[13px] text-muted">Effective date: 1 January 2026</p>
          <p>
            WeLoveDaily (an Atla* Group publication) operates welovedaily.com. This Privacy Policy
            explains what information we collect, why we collect it, and how you can exercise your
            rights. If something is unclear, email us at{' '}
            <a href="mailto:studio@welovedaily.com" className="text-wld-blue hover:underline">
              studio@welovedaily.com
            </a>.
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">1. Who this applies to</h2>
          <p>
            This policy applies to all visitors, subscribers, and users of welovedaily.com,
            including people who submit work, subscribe to The Edit newsletter, or contact us. By
            using the platform, you agree to the practices described here.
          </p>
          <p>
            WeLoveDaily is not directed at children under 13. If we become aware that a child under
            13 has provided personal data, we will delete it promptly.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">2. What we collect</h2>
          <p>We collect information you provide directly and information collected automatically.</p>
          <p className="font-medium">Information you provide:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Email address (newsletter subscriptions or submissions)</li>
            <li>Name and studio/company name (submissions)</li>
            <li>Project files and images (submission forms)</li>
            <li>Contact details (email or contact form)</li>
            <li>
              Payment information for future paid features, processed by third-party providers (we
              do not store card details)
            </li>
          </ul>
          <p className="font-medium">Information collected automatically:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Usage data (pages, referrer, browser, device) via Google Analytics</li>
            <li>Interaction data (clicks, scroll depth, engagement) via Google Analytics and Meta Pixel</li>
            <li>Cookie data (see Cookie Policy)</li>
            <li>IP address collected by our hosting provider (Vercel)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">3. Why we collect it</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To operate The Edit newsletter</li>
            <li>To review and publish submissions</li>
            <li>To improve platform quality and performance</li>
            <li>To serve relevant advertising (where consent applies)</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">4. Legal basis for processing (GDPR)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Consent</li>
            <li>Legitimate interests</li>
            <li>Contract performance</li>
            <li>Legal obligation</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">5. How we share your data</h2>
          <p>We do not sell personal data. We share data only in limited cases:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Service providers (Substack, Vercel, Sanity)</li>
            <li>Analytics providers (Google Analytics, Meta Pixel)</li>
            <li>Legal compliance requirements</li>
            <li>Business transfer scenarios (with advance notice where applicable)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">6. Data retention</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Newsletter subscribers: until unsubscribe (plus suppression list handling)</li>
            <li>Submission data: 24 months from submission, or until associated content removal</li>
            <li>Analytics data: 26 months by default (Google Analytics)</li>
            <li>Contact records: 12 months from last correspondence</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">7. Your rights</h2>
          <p>
            Depending on your jurisdiction, you may have rights of access, correction, deletion,
            portability, objection, restriction, and withdrawal of consent.
          </p>
          <p>
            To exercise rights, contact{' '}
            <a href="mailto:studio@welovedaily.com" className="text-wld-blue hover:underline">
              studio@welovedaily.com
            </a>. We respond within 30 days.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">8. International transfers</h2>
          <p>
            WeLoveDaily is operated from Mexico City. Some providers are based in the United States.
            Where required, we rely on Standard Contractual Clauses and equivalent safeguards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">9. Security</h2>
          <p>
            We use industry-standard measures including HTTPS encryption, access controls, and secure
            hosting. No internet transmission method is 100% secure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">10. Changes to this policy</h2>
          <p>
            We may update this policy as practices change. Significant changes will be communicated
            to newsletter subscribers by email.
          </p>
        </section>

        <section className="space-y-1 pt-2 border-t border-border">
          <h2 className="text-[18px] font-semibold text-wld-ink">11. Contact</h2>
          <p>WeLoveDaily / Atla* Group</p>
          <p>Mexico City, Mexico</p>
          <p>
            <a href="mailto:studio@welovedaily.com" className="text-wld-blue hover:underline">
              studio@welovedaily.com
            </a>
          </p>
        </section>
      </article>
    </div>
  )
}
