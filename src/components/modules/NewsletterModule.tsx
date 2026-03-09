import Link from 'next/link'

interface NewsletterModuleProps {
  copy?: string
}

export function NewsletterModule({
  copy = 'Curated work, sharp analysis, and one thing worth thinking about.',
}: NewsletterModuleProps) {
  return (
    <section className="py-16 px-6 bg-wld-ink text-center rounded-card">
      <div className="max-w-md mx-auto space-y-5">
        <h2 className="font-display text-[28px] md:text-[32px] leading-tight text-white">
          The Edit
        </h2>
        <p className="text-[15px] leading-relaxed text-white/85">
          {copy || 'Sharp analysis, standout projects, and brand signals worth your attention.'}
        </p>
        <Link
          href="/newsletter"
          className="inline-flex items-center justify-center px-6 py-3 bg-white text-wld-ink text-[14px] font-medium rounded-full transition-all duration-200 hover:opacity-90"
        >
          Subscribe - it&apos;s free
        </Link>
        <p className="text-[12px] text-white/75">Free. Weekly. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}
