'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'

export interface Partner {
  _id: string
  name: string
  slug: string
  partnerType: string
  tagline?: string
  description?: string
  website?: string
  location?: string
  tags?: string[]
  featured?: boolean
  logo?: {
    asset?: {
      _id: string
      url: string
      metadata?: { dimensions?: { width: number; height: number } }
    }
  }
}

const TYPE_LABELS: Record<string, string> = {
  agency: 'Agency',
  software: 'Software',
  supplier: 'Supplier',
  printer: 'Printer',
  photographer: 'Photographer',
  consultant: 'Consultant',
  studio: 'Studio',
  other: 'Other',
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function PartnerLogo({ partner, size = 56 }: { partner: Partner; size?: number }) {
  const url = partner.logo?.asset?.url
  if (url) {
    return (
      <div
        className="rounded-xl border border-border bg-white overflow-hidden shrink-0 flex items-center justify-center p-2"
        style={{ width: size, height: size }}
      >
        <Image
          src={url}
          alt={partner.name}
          width={size - 16}
          height={size - 16}
          className="object-contain"
        />
      </div>
    )
  }
  const initials = partner.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div
      className="rounded-xl border border-border bg-[rgb(var(--wld-ink-rgb)/0.05)] shrink-0 flex items-center justify-center font-medium text-wld-ink"
      style={{ width: size, height: size, fontSize: size * 0.3 }}
    >
      {initials}
    </div>
  )
}

function FeaturedCard({ partner }: { partner: Partner }) {
  return (
    <div className="group rounded-card-lg border border-border bg-wld-white hover:border-[rgb(var(--wld-ink-rgb)/0.25)] transition-all duration-300 p-6 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <PartnerLogo partner={partner} size={64} />
        {partner.website && (
          <a
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[11px] font-medium text-muted hover:text-wld-ink hover:border-wld-ink transition-colors"
          >
            Visit <ExternalLinkIcon />
          </a>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-display text-[19px] text-wld-ink leading-tight">{partner.name}</h3>
          <span className="text-[10px] uppercase tracking-widest font-medium text-muted bg-[rgb(var(--wld-ink-rgb)/0.06)] px-2 py-0.5 rounded-full">
            {TYPE_LABELS[partner.partnerType] ?? partner.partnerType}
          </span>
        </div>

        {partner.tagline && (
          <p className="text-[14px] text-wld-ink/80 leading-snug">{partner.tagline}</p>
        )}
        {partner.description && (
          <p className="text-[13px] text-muted leading-relaxed line-clamp-3">{partner.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        {partner.location && (
          <span className="text-[12px] text-muted">{partner.location}</span>
        )}
        {partner.tags && partner.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {partner.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[rgb(var(--wld-ink-rgb)/0.06)] text-muted">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PartnerRow({ partner }: { partner: Partner }) {
  return (
    <div className="group flex items-center gap-4 py-4 border-b border-border last:border-b-0 hover:bg-[rgb(var(--wld-ink-rgb)/0.02)] -mx-4 px-4 rounded-lg transition-colors">
      <PartnerLogo partner={partner} size={48} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-[14px] text-wld-ink leading-tight">{partner.name}</span>
          <span className="text-[10px] uppercase tracking-widest font-medium text-muted bg-[rgb(var(--wld-ink-rgb)/0.06)] px-1.5 py-0.5 rounded-full">
            {TYPE_LABELS[partner.partnerType] ?? partner.partnerType}
          </span>
          {partner.location && (
            <span className="text-[11px] text-muted">{partner.location}</span>
          )}
        </div>
        {partner.tagline && (
          <p className="text-[13px] text-muted mt-0.5 truncate">{partner.tagline}</p>
        )}
      </div>

      {partner.tags && partner.tags.length > 0 && (
        <div className="hidden md:flex flex-wrap gap-1.5 shrink-0">
          {partner.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[rgb(var(--wld-ink-rgb)/0.06)] text-muted">
              {tag}
            </span>
          ))}
        </div>
      )}

      {partner.website && (
        <a
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1 text-[11px] font-medium text-muted hover:text-wld-ink transition-colors"
          aria-label={`Visit ${partner.name}`}
        >
          Visit <ExternalLinkIcon />
        </a>
      )}
    </div>
  )
}

export function PartnersClient({ partners }: { partners: Partner[] }) {
  const [activeType, setActiveType] = useState<string>('all')

  const types = useMemo(() => {
    const seen = new Set<string>()
    partners.forEach(p => seen.add(p.partnerType))
    return Array.from(seen).sort()
  }, [partners])

  const featured = useMemo(
    () => partners.filter(p => p.featured && (activeType === 'all' || p.partnerType === activeType)),
    [partners, activeType]
  )

  const rest = useMemo(
    () => partners.filter(p => !p.featured && (activeType === 'all' || p.partnerType === activeType)),
    [partners, activeType]
  )

  const total = featured.length + rest.length

  return (
    <div className="space-y-8">

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveType('all')}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
            activeType === 'all'
              ? 'bg-wld-ink text-wld-paper'
              : 'border border-border text-muted hover:text-wld-ink hover:border-wld-ink'
          }`}
        >
          All
          <span className="ml-1.5 opacity-60">{partners.length}</span>
        </button>
        {types.map(type => {
          const count = partners.filter(p => p.partnerType === type).length
          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                activeType === type
                  ? 'bg-wld-ink text-wld-paper'
                  : 'border border-border text-muted hover:text-wld-ink hover:border-wld-ink'
              }`}
            >
              {TYPE_LABELS[type] ?? type}
              <span className="ml-1.5 opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      {total === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[15px] text-muted">No partners in this category yet.</p>
        </div>
      ) : (
        <>
          {/* Featured */}
          {featured.length > 0 && (
            <section className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest font-medium text-muted">Featured</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featured.map(p => <FeaturedCard key={p._id} partner={p} />)}
              </div>
            </section>
          )}

          {/* Directory list */}
          {rest.length > 0 && (
            <section className="space-y-1">
              {featured.length > 0 && (
                <p className="text-[10px] uppercase tracking-widest font-medium text-muted mb-4">Directory</p>
              )}
              <div className="rounded-card border border-border bg-wld-white px-4">
                {rest.map(p => <PartnerRow key={p._id} partner={p} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
