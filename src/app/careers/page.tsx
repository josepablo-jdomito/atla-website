import { buildMetadata } from '@/lib/utils/metadata'
import { PageHero } from '@/components/layout/PageHero'

export const metadata = buildMetadata({
  title: 'Careers - WeLoveDaily',
  description:
    'WeLoveDaily is not currently hiring. When a role opens, it will be posted here first. See what we look for and how to stay informed.',
  path: '/careers',
})

export default function CareersPage() {
  return (
    <div className="max-w-container mx-auto px-5 py-10 space-y-10">
      <PageHero alt="Careers at WeLoveDaily" />
      <article className="max-w-article mx-auto space-y-8">
        <header className="space-y-3">
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink">Careers</h1>
          <p className="text-[18px] text-wld-ink">We&apos;re not hiring right now.</p>
          <p className="text-[16px] leading-relaxed text-muted">
            When we are, it will be posted here first. No recruiters, no agencies. Direct.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-[20px] font-semibold text-wld-ink">What we look for</h2>
          <p className="text-[15px] leading-relaxed text-wld-ink">
            If you&apos;re the kind of person who reads the brands section of a business story before
            the financials - this is probably the right room for you.
          </p>
          <p className="text-[15px] leading-relaxed text-wld-ink">
            We work at the intersection of editorial, brand strategy, and platform building. The
            people who do well here tend to have a few things in common:
          </p>
          <ul className="space-y-2 text-[15px] leading-relaxed text-wld-ink list-disc pl-5">
            <li>
              Strong editorial instincts. The ability to recognize what&apos;s worth publishing and
              what isn&apos;t - without needing a rubric.
            </li>
            <li>
              High standards that are actually maintained under pressure. Not just stated.
            </li>
            <li>
              Strategic fluency. Brand work makes more sense to you as a business problem than a
              creative exercise.
            </li>
            <li>
              Comfort with building. We are early. Things are not finished. That should feel like
              an opportunity.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-[20px] font-semibold text-wld-ink">How to stay informed</h2>
          <p className="text-[15px] leading-relaxed text-wld-ink">
            Follow WeLoveDaily on Instagram and subscribe to The Edit. When a role opens, it will
            be in the newsletter before it&apos;s anywhere else.
          </p>
          <a href="mailto:studio@welovedaily.com" className="text-[15px] text-wld-blue hover:underline">
            studio@welovedaily.com
          </a>
        </section>
      </article>
    </div>
  )
}
