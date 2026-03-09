import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'Terms of Use',
  description: 'WeLoveDaily terms of use.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <div className="max-w-container mx-auto px-5 py-10">
      <article className="max-w-article mx-auto">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-8">
          Terms of Use
        </h1>

        <div className="space-y-6 text-[15px] leading-[1.7] text-wld-ink">
          <p className="text-[13px] text-muted">Last updated: March 2026</p>

          <h2 className="text-[18px] font-semibold text-wld-ink pt-2">Agreement</h2>
          <p>
            By accessing welovedaily.com, you agree to these terms. If you don&rsquo;t agree, please
            don&rsquo;t use the site.
          </p>

          <h2 className="text-[18px] font-semibold text-wld-ink pt-2">Content ownership</h2>
          <p>
            All editorial content, design, and curation on WeLoveDaily is owned by Atla* Group
            unless otherwise credited. Featured project imagery and assets remain the property of
            their respective creators and are published with permission.
          </p>

          <h2 className="text-[18px] font-semibold text-wld-ink pt-2">Submissions</h2>
          <p>
            By submitting work to WeLoveDaily, you confirm that you have the right to share the
            materials and grant us a non-exclusive license to publish, display, and promote the
            submitted assets across our platforms. You retain full ownership of your work.
          </p>

          <h2 className="text-[18px] font-semibold text-wld-ink pt-2">Acceptable use</h2>
          <p>
            You may not scrape, copy, or redistribute our content without written permission. You
            may share links to our articles freely. For republishing or syndication, contact{' '}
            <a href="mailto:editorial@welovedaily.com" className="text-wld-blue hover:underline">
              editorial@welovedaily.com
            </a>
            .
          </p>

          <h2 className="text-[18px] font-semibold text-wld-ink pt-2">Limitation of liability</h2>
          <p>
            WeLoveDaily is provided &ldquo;as is.&rdquo; We make no warranties about completeness,
            accuracy, or reliability. We are not liable for any loss arising from your use of the
            site.
          </p>

          <h2 className="text-[18px] font-semibold text-wld-ink pt-2">Changes</h2>
          <p>
            We may update these terms at any time. Continued use of the site after changes
            constitutes acceptance of the new terms.
          </p>

          <h2 className="text-[18px] font-semibold text-wld-ink pt-2">Contact</h2>
          <p>
            Questions?{' '}
            <a href="mailto:hello@welovedaily.com" className="text-wld-blue hover:underline">
              hello@welovedaily.com
            </a>
          </p>
        </div>
      </article>
    </div>
  )
}
