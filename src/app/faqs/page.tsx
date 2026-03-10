import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'FAQs - WeLoveDaily',
  description:
    'Answers on submissions, editorial features, sponsorships, and The Edit newsletter. Everything about how WeLoveDaily works.',
  path: '/faqs',
})

export default function FaqsPage() {
  return (
    <div className="max-w-container mx-auto px-5 py-10">
      <article className="max-w-article mx-auto space-y-8">
        <header className="space-y-3">
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink">
            Frequently Asked Questions
          </h1>
          <p className="text-[16px] leading-relaxed text-muted">
            Everything about how WeLoveDaily works - submissions, features, sponsorships, and the
            newsletter.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-[20px] font-semibold text-wld-ink">Submissions</h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-wld-ink">
            <p>
              <strong>Who can submit work?</strong><br />
              Any studio or designer working in brand identity, packaging, rebrand, retail design,
              or brand strategy. We review work from agencies, independent designers, and students.
              Work does not need to be for a commercial client - we publish concept and
              experimental projects, clearly labeled.
            </p>
            <p>
              <strong>Is there a fee to submit?</strong><br />
              No. Submission is free. We do not charge for consideration, and we do not guarantee
              coverage in exchange for payment. Sponsored features are a separate arrangement - see
              the Sponsorships section below.
            </p>
            <p>
              <strong>What are the chances my work gets featured?</strong><br />
              We curate to a high standard. Most submissions are not selected. If your work is not
              chosen, we won&apos;t send a rejection notice - but you&apos;re welcome to submit again.
              The editorial bar is the same for every studio, regardless of size or location.
            </p>
            <p>
              <strong>How long does review take?</strong><br />
              If your work is selected, you&apos;ll hear from us within 5 to 7 business days. If it
              isn&apos;t, we won&apos;t follow up.
            </p>
            <p>
              <strong>What work do you not feature?</strong><br />
              Illustration, animation, or motion work without a brand system context. Single-asset
              submissions (a logo alone is not a brand identity). Work in progress or unfinished
              projects. Work without proper studio and designer credits.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-semibold text-wld-ink">Features and Editorial</h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-wld-ink">
            <p>
              <strong>Is all published content editorial?</strong><br />
              All New Work posts are editorial selections - chosen on merit. Brand Breakdown, Cult
              Brand Index, The Definition, and Industry Signal pieces are written by WeLoveDaily.
              Sponsored content is clearly labeled &quot;Supported by [Brand Name]&quot; before any
              editorial copy.
            </p>
            <p>
              <strong>Can I request changes to a published feature?</strong><br />
              We can correct factual errors - studio names, credits, project dates. We do not
              rewrite editorial analysis based on subject requests. If you spot an error, email{' '}
              <a href="mailto:studio@welovedaily.com" className="text-wld-blue hover:underline">
                studio@welovedaily.com
              </a>.
            </p>
            <p>
              <strong>Can I get a feature removed?</strong><br />
              In rare cases, yes - if the work was submitted without proper rights, contains a
              factual error we cannot correct, or if there is a legal reason for removal. Contact
              us at{' '}
              <a href="mailto:studio@welovedaily.com" className="text-wld-blue hover:underline">
                studio@welovedaily.com
              </a>{' '}
              with the details.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-semibold text-wld-ink">Sponsorships and Advertising</h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-wld-ink">
            <p>
              <strong>Do you accept brand sponsorships?</strong><br />
              Yes. WeLoveDaily offers sponsored editorial features, newsletter sponsorships, and
              category sponsorships. All sponsored content is clearly labeled. We only work with
              brands that are relevant to our audience - tools, platforms, and services used by
              founders, CMOs, and creative directors.
            </p>
            <p>
              <strong>What does sponsored content look like?</strong><br />
              Sponsored content follows WeLoveDaily&apos;s editorial format and voice. It is labeled
              &quot;Supported by [Brand Name]&quot; before any copy. We do not publish content that
              compromises editorial integrity or misrepresents a product. For sponsorship enquiries,
              contact{' '}
              <a href="mailto:studio@welovedaily.com" className="text-wld-blue hover:underline">
                studio@welovedaily.com
              </a>.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-semibold text-wld-ink">The Newsletter</h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-wld-ink">
            <p>
              <strong>What is The Edit?</strong><br />
              The Edit is WeLoveDaily&apos;s weekly newsletter. Curated work, sharp analysis, and one
              thing worth thinking about before the week ends. It arrives every week. It&apos;s free.
            </p>
            <p>
              <strong>How do I unsubscribe?</strong><br />
              Every issue includes an unsubscribe link at the bottom. One click, and you&apos;re off
              the list. No confirmation email, no re-engagement sequence.
            </p>
          </div>
        </section>
      </article>
    </div>
  )
}
