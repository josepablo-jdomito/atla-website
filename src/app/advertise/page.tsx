import Link from 'next/link'
import { TypeformEmbed } from '@/components/modules/TypeformEmbed'
import { buildMetadata } from '@/lib/utils/metadata'
import { AdvertiseForm } from './AdvertiseForm'
import { PageHero } from '@/components/layout/PageHero'

export const metadata = buildMetadata({
  title: 'Advertise',
  description:
    'Partner with WeLoveDaily to reach a curated audience of designers, brand leaders, and creative directors.',
  path: '/advertise',
})

const FORMATS = [
  {
    name: 'Sponsored Articles',
    description:
      'A dedicated article showcasing your brand, product, or campaign with transparent sponsor labeling and editorial-quality production.',
    tag: 'Most popular',
  },
  {
    name: 'Newsletter Sponsorship',
    description:
      'Own premium placement inside the Weekly Brand Breakdown with custom copy, CTA links, and campaign timing aligned to launches.',
    tag: null,
  },
  {
    name: 'Brand Partnerships',
    description:
      'Multi-format collaborations across site features, social distribution, and co-branded storytelling built for long-term brand affinity.',
    tag: null,
  },
  {
    name: 'Event Sponsorship',
    description:
      'Sponsor curated talks, launches, and design events through branded integrations, host mentions, and post-event editorial coverage.',
    tag: null,
  },
]

const AUDIENCE_STATS = [
  { label: 'Creative directors & founders', value: '42%' },
  { label: 'Brand & design leads', value: '31%' },
  { label: 'Agency & studio teams', value: '18%' },
  { label: 'Other (writers, devs, students)', value: '9%' },
]

const REACH_STATS = [
  { label: 'Monthly readers', value: '120K+' },
  { label: 'Weekly newsletter subscribers', value: '38K+' },
  { label: 'Average newsletter open rate', value: '44%' },
  { label: 'Avg. sponsored article time on page', value: '4m 20s' },
]

export default function AdvertisePage() {
  const formId = process.env.NEXT_PUBLIC_TYPEFORM_ADVERTISE_ID || ''

  return (
    <div className="max-w-container mx-auto px-5 py-10 space-y-10">
      <PageHero alt="Advertise with WeLoveDaily" />
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
          Audience
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

      {/* Reach */}
      <section className="max-w-article mx-auto mb-12">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-6">
          Reach
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {REACH_STATS.map((stat) => (
            <div key={stat.label} className="p-4 rounded-card border border-border bg-white text-center">
              <span className="block text-[24px] font-semibold text-wld-ink mb-1">{stat.value}</span>
              <span className="text-[12px] text-muted leading-tight">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Formats */}
      <section className="max-w-article mx-auto mb-12">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-6">
          Sponsorship options
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
          <AdvertiseForm />
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
