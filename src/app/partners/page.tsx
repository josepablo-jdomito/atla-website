import { client } from '@/lib/sanity/client'
import { partnersPageQuery } from '@/lib/sanity/queries'
import { PartnersClient, type Partner } from './PartnersClient'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Partners — WeLoveDaily',
  description: 'Our curation of world-class agencies, software, suppliers, and service providers in the consumer brand design industry.',
}

export default async function PartnersPage() {
  const partners = await client.fetch<Partner[]>(partnersPageQuery)

  return (
    <main className="max-w-container mx-auto px-5 py-12 space-y-10">

      {/* Page header */}
      <header className="max-w-xl space-y-3">
        <p className="text-[10px] uppercase tracking-widest font-medium text-muted">Directory</p>
        <h1 className="font-display text-[38px] sm:text-[46px] leading-[1.1] text-wld-ink">
          World-class partners
        </h1>
        <p className="text-[15px] text-muted leading-relaxed">
          Our curation of agencies, software, suppliers, and service providers trusted by the best consumer brand designers.
        </p>
      </header>

      {partners.length === 0 ? (
        <div className="py-24 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[rgb(var(--wld-ink-rgb)/0.06)] mb-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted" aria-hidden>
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
              <line x1="12" y1="12" x2="12" y2="16" />
              <line x1="10" y1="14" x2="14" y2="14" />
            </svg>
          </div>
          <p className="font-display text-[22px] text-wld-ink">Coming soon</p>
          <p className="text-[14px] text-muted max-w-xs mx-auto">
            We&apos;re putting together our selection of world-class partners. Check back soon.
          </p>
        </div>
      ) : (
        <PartnersClient partners={partners} />
      )}

    </main>
  )
}
