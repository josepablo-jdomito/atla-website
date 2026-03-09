import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'WeLoveDaily privacy policy.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <div className="max-w-container mx-auto px-5 py-10">
      <article className="max-w-article mx-auto prose-wld">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-8">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-[15px] leading-[1.7] text-wld-ink">
          <p className="text-[13px] text-muted">Last updated: March 2026</p>

          <h2 className="text-[18px] font-semibold text-wld-ink pt-2">Overview</h2>
          <p>
            WeLoveDaily (&ldquo;welove,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) is operated by
            Atla* Group. This policy explains how we collect, use, and protect your information when
            you visit welovedaily.com or subscribe to our newsletter.
          </p>

          <h2 className="text-[18px] font-semibold text-wld-ink pt-2">What we collect</h2>
          <p>
            We collect minimal data: your email address when you subscribe to our newsletter, form
            responses when you submit a project or inquiry, and anonymous usage analytics via Google
            Analytics 4 (page views, scroll depth, referrer).
          </p>

          <h2 className="text-[18px] font-semibold text-wld-ink pt-2">How we use it</h2>
          <p>
            Email addresses are used exclusively to send our newsletter and respond to inquiries. We
            do not sell, share, or trade your email with third parties. Analytics data helps us
            understand what content resonates and improve the experience.
          </p>

          <h2 className="text-[18px] font-semibold text-wld-ink pt-2">Third-party services</h2>
          <p>
            We use Substack (newsletter), Typeform (forms), Google Analytics 4 (analytics), Sanity
            (content management), and Vercel (hosting). Each has its own privacy policy governing
            data it processes on our behalf.
          </p>

          <h2 className="text-[18px] font-semibold text-wld-ink pt-2">Cookies</h2>
          <p>
            We use essential cookies and Google Analytics cookies. We do not use advertising cookies
            or tracking pixels from ad networks.
          </p>

          <h2 className="text-[18px] font-semibold text-wld-ink pt-2">Your rights</h2>
          <p>
            You can unsubscribe from our newsletter at any time using the link in any email. To
            request deletion of your data, email{' '}
            <a href="mailto:hello@welovedaily.com" className="text-wld-blue hover:underline">
              hello@welovedaily.com
            </a>
            .
          </p>

          <h2 className="text-[18px] font-semibold text-wld-ink pt-2">Contact</h2>
          <p>
            Questions about this policy? Email{' '}
            <a href="mailto:hello@welovedaily.com" className="text-wld-blue hover:underline">
              hello@welovedaily.com
            </a>
            .
          </p>
        </div>
      </article>
    </div>
  )
}
