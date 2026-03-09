import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'Newsletter',
  description:
    'A weekly curation of the most compelling work in branding, design, and creative direction. Free, every Thursday.',
  path: '/newsletter',
})

export default function NewsletterPage() {
  const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL || 'https://welovedaily.substack.com'

  return (
    <div className="max-w-container mx-auto px-5 py-10">
      {/* Header */}
      <header className="max-w-article mx-auto text-center mb-12">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-4">
          The welove newsletter
        </h1>
        <p className="text-[16px] leading-relaxed text-muted max-w-[480px] mx-auto">
          A weekly curation of the most compelling work in branding, design, and creative direction.
          No filler. No spam. Just the work worth your attention.
        </p>
      </header>

      {/* What you get */}
      <section className="max-w-article mx-auto mb-12">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-6">
          What to expect
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: 'Curated picks',
              description: '5–8 hand-selected projects, brands, and spaces from the week.',
            },
            {
              title: 'Editorial takes',
              description: 'What makes a brand work, what doesn\'t, and why it matters.',
            },
            {
              title: 'Industry signals',
              description: 'Trends, launches, and repositionings worth knowing about.',
            },
          ].map((item) => (
            <div key={item.title} className="space-y-2">
              <h3 className="text-[16px] font-semibold text-wld-ink">{item.title}</h3>
              <p className="text-[14px] leading-relaxed text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Substack embed */}
      <section className="max-w-article mx-auto mb-12">
        <div className="bg-wld-ink rounded-card p-8 md:p-12 text-center">
          <h2 className="font-display text-[24px] md:text-[28px] leading-[1.15] text-white mb-3">
            Join the curation
          </h2>
          <p className="text-[14px] text-[rgba(255,255,255,0.65)] mb-6 max-w-[360px] mx-auto">
            Free. Every Thursday. Unsubscribe anytime.
          </p>
          <a
            href={substackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-block px-6 py-3
              text-[14px] font-medium
              bg-white text-wld-ink rounded-full
              hover:bg-wld-blue hover:text-white
              transition-colors
            "
          >
            Subscribe on Substack
          </a>
        </div>
      </section>

      {/* Past issues teaser */}
      <section className="max-w-article mx-auto text-center">
        <p className="text-[14px] text-muted mb-3">Want to see what you&rsquo;re signing up for?</p>
        <a
          href={substackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] font-medium text-wld-blue hover:underline"
        >
          Browse past issues &rarr;
        </a>
      </section>
    </div>
  )
}
