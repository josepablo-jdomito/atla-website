import Link from 'next/link'
import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'About',
  description:
    'WeLoveDaily is a curation-driven media brand for designers, brand builders, and creative leaders.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <div className="max-w-container mx-auto px-5 py-10">
      <article className="max-w-article mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-4">
            About welove
          </h1>
        </header>

        {/* Body */}
        <div className="space-y-6 text-[16px] leading-[1.7] text-wld-ink">
          <p>
            WeLoveDaily is a curation-driven media brand for people who care deeply about how
            brands are built. We surface the most compelling work in branding, design, hospitality,
            and creative direction and present it with the context it deserves.
          </p>

          <p>
            We started as a simple curation feed. A place to collect the work we admired, the
            spaces that inspired us, the brands that felt intentional. It grew because the audience
            shared our conviction: in a world of content noise, curation is a form of trust.
          </p>

          <p>
            Today, WeLoveDaily is evolving into something more deliberate. Not a news outlet. Not an
            aggregator. A publication with taste, editorial voice, and a point of view on what makes
            creative work matter.
          </p>

          <h2 className="font-display text-[24px] text-wld-ink pt-4">What we cover</h2>

          <p>
            Brand identity, packaging, web design, art direction, hospitality design, visual
            systems, and the people behind them. We focus on work that demonstrates clear
            thinking, not just beautiful execution.
          </p>

          <h2 className="font-display text-[24px] text-wld-ink pt-4">Part of Atla*</h2>

          <p>
            WeLoveDaily is part of the{' '}
            <a
              href="https://atla.design"
              target="_blank"
              rel="noopener noreferrer"
              className="text-wld-blue hover:underline"
            >
              Atla* Group
            </a>{' '}
            ecosystem, a creative holding company led by JP Dominguez that includes a premium
            branding agency and this publication. The brands complement each other: the agency
            builds brands, and welove celebrates them.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4">
          <Link
            href="/submit"
            className="px-5 py-2.5 text-[14px] font-medium border border-border rounded-full hover:border-wld-ink transition-colors"
          >
            Submit a project
          </Link>
          <Link
            href="/advertise"
            className="px-5 py-2.5 text-[14px] font-medium border border-border rounded-full hover:border-wld-ink transition-colors"
          >
            Partner with us
          </Link>
          <Link
            href="/newsletter"
            className="px-5 py-2.5 text-[14px] font-medium border border-border rounded-full hover:border-wld-ink transition-colors"
          >
            Subscribe to the newsletter
          </Link>
        </div>
      </article>
    </div>
  )
}
