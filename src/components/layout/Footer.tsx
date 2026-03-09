import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-wld-paper">
      <div className="max-w-container mx-auto px-5 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-wider text-muted mb-4">Explore</h4>
            <div className="space-y-2.5">
              <Link href="/" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">Latest</Link>
              <Link href="/categories" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">Categories</Link>
              <Link href="/search" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">Search</Link>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-wider text-muted mb-4">Work With Us</h4>
            <div className="space-y-2.5">
              <Link href="/submit" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">Submit a project</Link>
              <Link href="/advertise" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">Advertise</Link>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-wider text-muted mb-4">welove</h4>
            <div className="space-y-2.5">
              <Link href="/about" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">About</Link>
              <Link href="/newsletter" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">Newsletter</Link>
              <Link href="/contact" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-wider text-muted mb-4">Legal</h4>
            <div className="space-y-2.5">
              <Link href="/privacy" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">Privacy</Link>
              <Link href="/terms" className="block text-[14px] text-wld-ink hover:text-wld-blue transition-colors">Terms</Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-primary text-[18px] font-bold tracking-tight text-wld-ink">
            welove
          </Link>
          <p className="text-[13px] text-muted">
            &copy; {year} WeLoveDaily. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
