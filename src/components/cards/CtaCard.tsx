import Link from 'next/link'
import { trackEvent } from '@/lib/utils/analytics'
import type { CtaCardVariant } from '@/types'

interface CtaCardProps {
  variant: CtaCardVariant
}

const CARD_DATA: Record<
  CtaCardVariant,
  { label: string; title: string; body: string; cta: string; href: string; event: string }
> = {
  submit: {
    label: 'For creators',
    title: 'Submit a project',
    body: "If it fits our standards, we'll publish it with full credits.",
    cta: 'Submit a project',
    href: '/submit',
    event: 'cta_submit_click',
  },
  advertise: {
    label: 'For brands',
    title: 'Partner with welove',
    body: 'Brand-safe placements for a design-first audience.',
    cta: 'Request media kit',
    href: '/advertise',
    event: 'cta_advertise_click',
  },
}

export function CtaCard({ variant }: CtaCardProps) {
  const d = CARD_DATA[variant]

  return (
    <Link
      href={d.href}
      onClick={() => trackEvent(d.event, { location: 'in_feed' })}
      className="group flex flex-col justify-center bg-wld-white border border-border rounded-card p-6 aspect-[4/5] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[rgba(29,29,29,0.24)]"
    >
      <div className="space-y-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-wld-blue">
          {d.label}
        </span>
        <h3 className="font-display text-[22px] leading-tight text-wld-ink">
          {d.title}
        </h3>
        <p className="text-[14px] leading-relaxed text-muted">{d.body}</p>
        <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-wld-blue group-hover:gap-2.5 transition-all duration-200">
          {d.cta}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-200 group-hover:translate-x-0.5">
            <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
