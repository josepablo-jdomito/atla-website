import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'About',
  description: 'WeLoveDaily is the global platform for consumer brand design.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <div className="max-w-container mx-auto px-5 py-10">
      <article className="max-w-article mx-auto space-y-8">
        <header className="space-y-4">
          <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink">About</h1>
          <p className="text-[18px] text-wld-ink">
            WeLoveDaily is the global platform for consumer brand design.
          </p>
          <p className="text-[16px] leading-relaxed text-muted">
            WeLoveDaily publishes for people building brands that matter.
          </p>
        </header>

        <div className="space-y-6 text-[16px] leading-[1.7] text-wld-ink">
          <p>
            Consumer brand design has no dominant platform.
          </p>
          <p>
            Architecture has ArchDaily. Packaging has Dieline. Design culture has Dezeen. But the
            space where brand identity, packaging, retail design, and brand strategy converge - the
            space where brands are built, scaled, and become culturally relevant - has no
            authoritative home.
          </p>
          <p>WeLoveDaily is building it.</p>
          <p>
            We started as a curation account. We are becoming a platform: editorial publication,
            industry database, and creator ecosystem in one place. Our audience is not designers
            seeking inspiration. It is operators who know that how a brand looks, sounds, and
            behaves is directly connected to whether it wins.
          </p>
          <p>
            Every feature, every breakdown, every essay is filtered through one question: does this
            serve someone building a brand that matters?
          </p>
          <p>If yes, we publish it. If not, we don&apos;t.</p>
        </div>

        <footer className="pt-6 border-t border-border text-[14px] text-muted space-y-1">
          <p>WeLoveDaily is an Atla* Group publication.</p>
          <p>Founded by Jose Pablo Dominguez. Mexico City.</p>
        </footer>
      </article>
    </div>
  )
}
