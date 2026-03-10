import Image from 'next/image'

interface PageHeroProps {
  src?: string | null
  alt?: string
  /** Tailwind height class — defaults to a comfortable editorial height */
  className?: string
}

export function PageHero({ src, alt = '', className = '' }: PageHeroProps) {
  return (
    <div
      className={`
        relative w-full overflow-hidden rounded-card-lg
        ${src ? '' : 'border border-dashed border-[rgb(var(--wld-ink-rgb)/0.15)] bg-[rgb(var(--wld-ink-rgb)/0.03)]'}
        ${className || 'h-[260px] sm:h-[320px] md:h-[380px]'}
      `}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) calc(100vw - 220px), 960px"
          priority
        />
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-3 select-none pointer-events-none">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[rgb(var(--wld-ink-rgb)/0.2)]"
            aria-hidden
          >
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span className="text-[11px] uppercase tracking-widest text-[rgb(var(--wld-ink-rgb)/0.25)]">
            Header photo
          </span>
        </div>
      )}
    </div>
  )
}
