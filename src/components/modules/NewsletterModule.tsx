import Link from 'next/link'

interface NewsletterModuleProps {
  copy?: string
}

export function NewsletterModule({
  copy = 'The best work we publish. Once a week. No noise.',
}: NewsletterModuleProps) {
  return (
    <section className="py-16 px-6 bg-wld-ink text-center rounded-card">
      <div className="max-w-md mx-auto space-y-5">
        <h2 className="font-display text-[28px] md:text-[32px] leading-tight text-white">
          Get the weekly edit
        </h2>
        <p className="text-[15px] leading-relaxed text-white/60">{copy}</p>
        <Link
          href="/newsletter"
          className="inline-flex items-center justify-center px-6 py-3 bg-white text-wld-ink text-[14px] font-medium rounded-full transition-all duration-200 hover:opacity-90"
        >
          Subscribe
        </Link>
        <p className="text-[12px] text-white/40">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}
