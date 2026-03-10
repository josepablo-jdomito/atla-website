import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'Terms & Conditions - WeLoveDaily',
  description:
    'Terms governing use of welovedaily.com, including submissions, intellectual property, sponsored content, and liability limitations.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <div className="max-w-container mx-auto px-5 py-10">
      <article className="max-w-article mx-auto space-y-7 text-[15px] leading-[1.7] text-wld-ink">
        <header className="space-y-2">
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink">Terms & Conditions</h1>
          <p className="text-[13px] text-muted">Effective date: 1 January 2026</p>
          <p>
            These Terms & Conditions govern your use of welovedaily.com and related services
            operated by Atla* Group (&quot;WeLoveDaily&quot;, &quot;we&quot;, &quot;us&quot;). By
            accessing the platform,
            you agree to these terms.
          </p>
        </header>

        <section className="space-y-2"><h2 className="text-[18px] font-semibold text-wld-ink">1. The platform</h2><p>WeLoveDaily is an editorial platform for consumer brand design. We may change, suspend, or discontinue any part of the platform at any time.</p></section>
        <section className="space-y-2"><h2 className="text-[18px] font-semibold text-wld-ink">2. Eligibility</h2><p>You must be at least 13 years old to use this platform.</p></section>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">3. Content and intellectual property</h2>
          <p>
            WeLoveDaily retains rights to its editorial content and curation. Featured work remains
            the intellectual property of its creators. You may share links, but you may not
            republish full articles or featured project images without permission.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">4. Submissions</h2>
          <p>By submitting work, you confirm rights and grant WeLoveDaily a non-exclusive, royalty-free license to publish and distribute submitted material.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You own or control rights to submitted assets.</li>
            <li>Work does not infringe third-party rights.</li>
            <li>Submission does not guarantee publication.</li>
          </ul>
          <p>We may remove content that infringes rights, contains non-correctable factual issues, or violates these terms.</p>
        </section>

        <section className="space-y-2"><h2 className="text-[18px] font-semibold text-wld-ink">5. Newsletter</h2><p>By subscribing to The Edit, you consent to weekly emails. You can unsubscribe at any time.</p></section>
        <section className="space-y-2"><h2 className="text-[18px] font-semibold text-wld-ink">6. Sponsored content</h2><p>Sponsored content is clearly labeled &quot;Supported by [Brand Name]&quot; and does not imply blanket endorsement.</p></section>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">7. Prohibited conduct</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Violating laws or regulations</li>
            <li>Scraping/crawling content without permission</li>
            <li>Circumventing security controls</li>
            <li>Submitting false or fraudulent information</li>
            <li>Spam or unsolicited communications</li>
            <li>Impersonation of WeLoveDaily or third parties</li>
          </ul>
        </section>

        <section className="space-y-2"><h2 className="text-[18px] font-semibold text-wld-ink">8. Third-party links and services</h2><p>We are not responsible for external sites linked from the platform. Third-party services include Substack, Sanity, Vercel, Google Analytics, and Meta Pixel.</p></section>
        <section className="space-y-2"><h2 className="text-[18px] font-semibold text-wld-ink">9. Disclaimers</h2><p>The platform is provided &quot;as is&quot; without warranties. Editorial content is not legal, business, or professional advice.</p></section>
        <section className="space-y-2"><h2 className="text-[18px] font-semibold text-wld-ink">10. Limitation of liability</h2><p>To the maximum extent permitted by law, WeLoveDaily and Atla* Group are not liable for indirect, incidental, special, or consequential damages arising from use of the platform.</p></section>
        <section className="space-y-2"><h2 className="text-[18px] font-semibold text-wld-ink">11. Governing law</h2><p>These terms are governed by the laws of Mexico. Disputes are resolved in courts of Mexico City, subject to mandatory local protections.</p></section>
        <section className="space-y-2"><h2 className="text-[18px] font-semibold text-wld-ink">12. Changes to these terms</h2><p>We may update these terms over time. Continued use after updates constitutes acceptance.</p></section>

        <section className="space-y-1 pt-2 border-t border-border">
          <h2 className="text-[18px] font-semibold text-wld-ink">13. Contact</h2>
          <p>WeLoveDaily / Atla* Group</p>
          <p>Mexico City, Mexico</p>
          <p>
            <a href="mailto:studio@welovedaily.com" className="text-wld-blue hover:underline">studio@welovedaily.com</a>
          </p>
        </section>
      </article>
    </div>
  )
}
