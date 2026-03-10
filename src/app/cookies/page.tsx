import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'Cookie Policy - WeLoveDaily',
  description:
    'Details on essential, analytics, and advertising cookies used by WeLoveDaily and how users can manage consent and preferences.',
  path: '/cookies',
})

export default function CookiesPage() {
  return (
    <div className="max-w-container mx-auto px-5 py-10">
      <article className="max-w-article mx-auto space-y-7 text-[15px] leading-[1.7] text-wld-ink">
        <header className="space-y-2">
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink">Cookie Policy</h1>
          <p className="text-[13px] text-muted">Effective date: 1 January 2026</p>
          <p>
            WeLoveDaily uses cookies and similar technologies to operate the platform, measure
            performance, and (where you consent) support relevant advertising.
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">1. What cookies are</h2>
          <p>
            Cookies are small text files stored on your device. Some are essential for site
            functionality. Others help with analytics or advertising.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">2. Cookies we use</h2>
          <p className="font-medium">Essential cookies (required)</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><code>__session</code> - Session authentication (session end).</li>
            <li><code>cookie_consent</code> - Stores consent preferences (12 months).</li>
          </ul>

          <p className="font-medium pt-2">Analytics cookies (consent required)</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><code>_ga</code>, <code>_ga_*</code> - Google Analytics (up to 2 years).</li>
            <li><code>_gid</code> - Google Analytics user distinction (24 hours).</li>
            <li><code>_gat</code> - Google Analytics rate limiting (1 minute).</li>
          </ul>

          <p className="font-medium pt-2">Advertising/targeting cookies (consent required)</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><code>_fbp</code> - Meta Pixel browser identifier (3 months).</li>
            <li><code>_fbc</code> - Meta click ID storage (3 months).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">3. Third-party cookies</h2>
          <p>
            Google and Meta may set cookies from their own domains. If you use Substack
            subscription flows, Substack may also set cookies under its own policy.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><a href="https://policies.google.com/privacy" className="text-wld-blue hover:underline">Google Privacy Policy</a></li>
            <li><a href="https://privacycenter.meta.com" className="text-wld-blue hover:underline">Meta Privacy Policy</a></li>
            <li><a href="https://substack.com/privacy" className="text-wld-blue hover:underline">Substack Privacy Policy</a></li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-[18px] font-semibold text-wld-ink">4. How to control cookies</h2>
          <p>
            You can manage consent using site cookie settings and your browser settings.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Chrome: Settings &gt; Privacy and security &gt; Cookies and other site data</li>
            <li>Safari: Preferences &gt; Privacy &gt; Manage Website Data</li>
            <li>Firefox: Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
            <li>Edge: Settings &gt; Cookies and site permissions &gt; Cookies and data stored</li>
          </ul>
          <p>
            Google Analytics opt-out add-on:{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" className="text-wld-blue hover:underline">
              tools.google.com/dlpage/gaoptout
            </a>
          </p>
          <p>
            Meta ad preferences:{' '}
            <a href="https://facebook.com/settings/ads" className="text-wld-blue hover:underline">
              facebook.com/settings/ads
            </a>
          </p>
          <p>
            Industry opt-out portals:{' '}
            <a href="https://youradchoices.com" className="text-wld-blue hover:underline">youradchoices.com</a>{' '}
            and{' '}
            <a href="https://youronlinechoices.eu" className="text-wld-blue hover:underline">youronlinechoices.eu</a>
          </p>
        </section>

        <section className="space-y-2"><h2 className="text-[18px] font-semibold text-wld-ink">5. Do Not Track</h2><p>WeLoveDaily does not currently respond to browser Do Not Track signals due lack of a consistent standard. We rely on explicit cookie consent controls.</p></section>
        <section className="space-y-2"><h2 className="text-[18px] font-semibold text-wld-ink">6. Changes to this policy</h2><p>We may update this policy when cookie usage or practices change.</p></section>

        <section className="space-y-1 pt-2 border-t border-border">
          <h2 className="text-[18px] font-semibold text-wld-ink">7. Contact</h2>
          <p>WeLoveDaily / Atla* Group</p>
          <p>Mexico City, Mexico</p>
          <p><a href="mailto:studio@welovedaily.com" className="text-wld-blue hover:underline">studio@welovedaily.com</a></p>
        </section>
      </article>
    </div>
  )
}
