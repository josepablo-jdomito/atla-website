'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface RailCard {
  id: string
  eyebrow: string
  title: string
  imageUrl?: string
  href: string
}

interface BannerCard {
  id: string
  label: string
  title: string
  cta: string
  imageUrl?: string
  href: string
}

function ArrowButton({
  onClick,
  label,
}: {
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 rounded-full border border-border bg-wld-white text-muted hover:text-wld-ink hover:border-wld-ink transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" strokeWidth="2">
        {label.includes('Previous') ? (
          <path d="M15 18l-6-6 6-6" />
        ) : (
          <path d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  )
}

function useRailControls() {
  const railRef = useRef<HTMLDivElement | null>(null)
  const [scrollRatio, setScrollRatio] = useState(0)

  const onScroll = () => {
    const rail = railRef.current
    if (!rail) return
    const max = Math.max(rail.scrollWidth - rail.clientWidth, 1)
    setScrollRatio(rail.scrollLeft / max)
  }

  const scrollByStep = (direction: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    rail.scrollBy({ left: direction * Math.round(rail.clientWidth * 0.82), behavior: 'smooth' })
  }

  return { railRef, scrollRatio, onScroll, scrollByStep }
}

export function ShowcaseRail({
  title,
  cards,
}: {
  title: string
  cards: RailCard[]
}) {
  const { railRef, scrollRatio, onScroll, scrollByStep } = useRailControls()
  const dots = useMemo(() => [0, 0.25, 0.5, 0.75, 1], [])

  return (
    <section className="space-y-5">
      <h2 className="font-display text-[40px] md:text-[56px] leading-[0.98] text-wld-ink">{title}</h2>

      <div
        ref={railRef}
        onScroll={onScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-1 no-scrollbar"
      >
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className="group relative min-w-[280px] md:min-w-[340px] h-[420px] md:h-[520px] rounded-[28px] overflow-hidden snap-start border border-border bg-card"
          >
            {card.imageUrl ? (
              <Image
                src={card.imageUrl}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 280px, 340px"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}
            <div className={`absolute inset-0 ${card.imageUrl ? 'bg-gradient-to-b from-black/70 via-black/20 to-black/40' : 'bg-card'}`} />
            <div className={`absolute inset-0 p-6 flex flex-col ${card.imageUrl ? 'text-white' : 'text-wld-ink'}`}>
              <p className="text-[16px] font-medium">{card.eyebrow}</p>
              <h3 className="mt-1 text-[44px] leading-[0.98] font-semibold max-w-[90%]">{card.title}</h3>
              <span
                role="presentation"
                aria-hidden
                className="mt-auto ml-auto w-10 h-10 rounded-full bg-black/75 text-white border border-white/30 group-hover:scale-105 transition-transform inline-flex items-center justify-center"
              >
                +
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        {dots.map((dot, index) => (
          <span
            key={index}
            className={`h-2 rounded-full transition-all ${Math.abs(scrollRatio - dot) < 0.13 ? 'w-7 bg-wld-ink' : 'w-2 bg-border'}`}
          />
        ))}
        <ArrowButton onClick={() => scrollByStep(-1)} label="Previous cards" />
        <ArrowButton onClick={() => scrollByStep(1)} label="Next cards" />
      </div>
    </section>
  )
}

export function UtilityRail({
  title,
  shopHref,
  cards,
}: {
  title: string
  shopHref: string
  cards: RailCard[]
}) {
  const { railRef, scrollByStep } = useRailControls()

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-[40px] md:text-[56px] leading-[0.98] text-wld-ink max-w-[780px]">{title}</h2>
        <Link href={shopHref} className="text-[28px] text-wld-blue hover:underline shrink-0">
          Explore
        </Link>
      </div>

      <div ref={railRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-1 no-scrollbar">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className="group relative min-w-[290px] md:min-w-[400px] h-[460px] rounded-[28px] overflow-hidden snap-start border border-border bg-card p-6"
          >
            <p className="text-[16px] font-medium text-muted">{card.eyebrow}</p>
            <h3 className="mt-1 text-[48px] leading-[0.98] font-semibold text-wld-ink">{card.title}</h3>
            {card.imageUrl ? (
              <Image
                src={card.imageUrl}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 290px, 400px"
                className="absolute left-0 right-0 bottom-0 w-full h-[52%] object-cover object-bottom"
              />
            ) : null}
            <span
              role="presentation"
              aria-hidden
              className="absolute right-5 bottom-5 w-10 h-10 rounded-full bg-wld-ink text-white group-hover:scale-105 transition-transform"
            >
              +
            </span>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <ArrowButton onClick={() => scrollByStep(-1)} label="Previous utility cards" />
        <ArrowButton onClick={() => scrollByStep(1)} label="Next utility cards" />
      </div>
    </section>
  )
}

export function PromoBannerRail({ cards }: { cards: BannerCard[] }) {
  const { railRef, scrollRatio, onScroll, scrollByStep } = useRailControls()
  const dots = useMemo(() => Array.from({ length: 7 }), [])

  return (
    <section className="space-y-5">
      <div
        ref={railRef}
        onScroll={onScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-1 no-scrollbar"
      >
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className="group relative min-w-[300px] md:min-w-[520px] h-[190px] md:h-[220px] rounded-[22px] overflow-hidden snap-start bg-card border border-border"
          >
            {card.imageUrl ? (
              <Image
                src={card.imageUrl}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 300px, 520px"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-black/35" />
            <div className="absolute inset-0 p-5 md:p-6 flex flex-col text-white">
              <p className="text-[15px] font-medium opacity-95">{card.label}</p>
              <h3 className="mt-auto text-[34px] leading-[0.95] font-semibold max-w-[78%]">{card.title}</h3>
              <span className="absolute right-5 bottom-5 px-4 py-2 rounded-full bg-white text-black text-[14px] font-medium">
                {card.cta}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-3">
          {dots.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.round(scrollRatio * (dots.length - 1)) === index ? 'bg-wld-ink' : 'bg-border'
              }`}
            />
          ))}
        </div>
        <ArrowButton onClick={() => scrollByStep(-1)} label="Previous promo cards" />
        <ArrowButton onClick={() => scrollByStep(1)} label="Next promo cards" />
      </div>
    </section>
  )
}
