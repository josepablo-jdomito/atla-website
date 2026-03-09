import Link from 'next/link'
import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'Subscribed',
  description: 'You\'re in.',
  path: '/newsletter/thanks',
  noIndex: true,
})

export default function NewsletterThanksPage() {
  return (
    <div className="max-w-container mx-auto px-5 py-20">
      <div className="max-w-[480px] mx-auto text-center">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-4">
          You&rsquo;re in
        </h1>
        <p className="text-[16px] leading-relaxed text-muted mb-8">
          Welcome to the curation. Check your inbox for a confirmation, and expect your first
          issue on Thursday.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 text-[14px] font-medium bg-wld-ink text-white rounded-full hover:bg-wld-blue transition-colors"
        >
          Browse the latest
        </Link>
      </div>
    </div>
  )
}
