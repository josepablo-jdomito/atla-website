import { buildMetadata } from '@/lib/utils/metadata'
import { PageHero } from '@/components/layout/PageHero'

export const metadata = buildMetadata({
  title: 'About WeLoveDaily - Consumer Brand Design Platform',
  description:
    'WeLoveDaily is the global platform for consumer brand design. Brand identities, packaging, rebrands, and strategy - for founders and CMOs building brands that matter.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <div className="max-w-container mx-auto px-5 py-10 space-y-10">
      <PageHero alt="About WeLoveDaily" />
      <article className="max-w-article mx-auto space-y-8">
        <header className="space-y-4">
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink">About</h1>
          <p className="text-[18px] text-wld-ink">Consumer brand design has no dominant platform.</p>
        </header>

        <div className="space-y-6 text-[16px] leading-[1.7] text-wld-ink">
          <p>
            Architecture has ArchDaily. Packaging has Dieline. Design culture has Dezeen. But the
            space where brand identity, packaging, retail design, and brand strategy converge -
            where brands are built, scaled, and become culturally relevant - has no authoritative
            home.
          </p>
          <p>WeLoveDaily is building it.</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-[20px] font-semibold text-wld-ink">What we publish</h2>
          <p>
            Brand identities. Packaging systems. Rebrands. Creative direction. Strategic essays.
            Industry analysis. We cover the full spectrum of consumer brand design - with the rigor
            the work deserves.
          </p>
          <p>
            Every feature, every breakdown, every essay passes one test: does this serve someone
            building a brand that matters? If yes, we publish it. If not, we don&apos;t.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-semibold text-wld-ink">Who reads WeLoveDaily</h2>
          <p>
            Not designers looking for inspiration. Founders, CMOs, brand strategists, and creative
            directors who understand that brand is a business asset - and treat it accordingly.
          </p>
          <p>
            We are not a mood board. We are not a feed. We are the platform where brand-literate
            operators come to stay sharp.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-semibold text-wld-ink">Where we come from</h2>
          <p>
            WeLoveDaily started as a curation account. We built an audience of approximately two
            million across Instagram by applying a simple standard: only publish work that sets the
            bar, never work that meets it.
          </p>
          <p>
            That standard is still the product. The platform around it is what we are building now.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-semibold text-wld-ink">The three layers</h2>
          <ul className="space-y-2 text-[16px] leading-[1.7] text-wld-ink list-disc pl-5">
            <li>Editorial publication - curated work and sharp analysis, published daily.</li>
            <li>
              Industry database - every published project is a searchable, categorized asset. Over
              time, the archive becomes the reference.
            </li>
            <li>
              Creator ecosystem - studio and designer profiles that make coverage meaningful beyond
              traffic. Being on WeLoveDaily becomes part of a studio&apos;s professional identity.
            </li>
          </ul>
        </section>

        <footer className="pt-6 border-t border-border text-[14px] text-muted space-y-1">
          <p>WeLoveDaily is an Atla* Group publication.</p>
          <p>Founded by Jose Pablo Dominguez. Mexico City.</p>
        </footer>
      </article>
    </div>
  )
}
