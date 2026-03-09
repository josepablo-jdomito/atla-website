import Link from 'next/link'
import { TypeformEmbed } from '@/components/modules/TypeformEmbed'
import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'Advertise',
  description:
    'Partner with WeLoveDaily to reach a curated audience of designers, brand leaders, and creative directors.',
  path: '/advertise',
})

const FORMATS = [
  {
    name: 'Sponsored Feature',
    description:
      'A dedicated editorial piece showcasing your brand, product, or project. Written by our team, matching our editorial voice.',
    tag: 'Most popular',
  },
  {
    name: 'Newsletter Spotlight',
    description:
      'Featured placement in our weekly newsletter with a custom write-up and direct link to your site.',
    tag: null,
  },
  {
    name: 'Feed Placement',
    description:
      'A branded card in our homepage feed, shown alongside editorial content with a clear sponsor label.',
    tag: null,
  },
  {
    name: 'Custom Partnership',
    description:
      'Multi-format campaigns, co-branded content, event partnerships, and long-term collaborations.',
    tag: null,
  },
]

const AUDIENCE_STATS = [
  { label: 'Creative directors & founders', value: '42%' },
  { label: 'Brand & design leads', value: '31%' },
  { label: 'Agency & studio teams', value: '18%' },
  { label: 'Other (writers, devs, students)', value: '9%' },
]

export default function AdvertisePage() {
  const formId = process.env.NEXT_PUBLIC_TYPEFORM_ADVERTISE_ID || ''

  return (
    <div className="max-w-container mx-auto px-5 py-10">
      {/* Header */}
      <header className="max-w-article mx-auto text-center mb-12">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-4">
          Advertise with welove
        </h1>
        <p className="text-[16px] leading-relaxed text-muted max-w-[480px] mx-auto">
          Reach a focused audience of brand builders, creative directors, and design-driven founders.
          No banners. No noise. Just premium, integrated placements.
        </p>
      </header>

      {/* Why partner */}
      <section className="max-w-article mx-auto mb-12">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-6">
          Who reads welove
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {AUDIENCE_STATS.map((stat) => (
            <div key={stat.label} className="p-4 rounded-card border border-border bg-card text-center">
              <span className="block text-[24px] font-semibold text-wld-ink mb-1">{stat.value}</span>
              <span className="text-[12px] text-muted leading-tight">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Formats */}
      <section className="max-w-article mx-auto mb-12">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-6">
          Partnership formats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FORMATS.map((format) => (
            <div
              key={format.name}
              className="p-5 rounded-card border border-border bg-card space-y-2"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-semibold text-wld-ink">{format.name}</h3>
                {format.tag && (
                  <span className="text-[11px] font-medium uppercase tracking-wider text-wld-blue bg-[rgba(22,15,207,0.06)] px-2 py-0.5 rounded-full">
                    {format.tag}
                  </span>
                )}
              </div>
              <p className="text-[14px] leading-relaxed text-muted">{format.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-article mx-auto mb-12">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4">
          How it works
        </h2>
        <div className="space-y-4 text-[14px] text-muted leading-relaxed">
          <div className="flex gap-4">
            <span className="text-wld-blue font-medium shrink-0">01</span>
            <p>Tell us about your brand and goals using the form below.</p>
          </div>
          <div className="flex gap-4">
            <span className="text-wld-blue font-medium shrink-0">02</span>
            <p>We&rsquo;ll send you a media kit and discuss format options within 48 hours.</p>
          </div>
          <div className="flex gap-4">
            <span className="text-wld-blue font-medium shrink-0">03</span>
            <p>We produce the content, you review, we publish and promote across all channels.</p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-article mx-auto mb-16">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4">
          Get in touch
        </h2>
        {formId ? (
          <TypeformEmbed formId={formId} height={500} />
        ) : (
          <div className="p-8 rounded-card border border-border bg-card text-center">
            <p className="text-[14px] text-muted">
              Partnership form loading. You can also{' '}
              <a
                href="mailto:partnerships@welovedaily.com"
                className="text-wld-blue hover:underline"
              >
                email us directly
              </a>
              .
            </p>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <div className="text-center">
        <p className="text-[14px] text-muted mb-4">
          Looking to submit a project for editorial consideration?
        </p>
        <Link
          href="/submit"
          className="inline-block px-5 py-2.5 text-[14px] font-medium border border-border rounded-full hover:border-wld-ink transition-colors"
        >
          Submit a project
        </Link>
      </div>
    </div>
  )
}
