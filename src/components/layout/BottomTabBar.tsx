import Link from 'next/link'

interface TabItem {
  label: string
  href: string
}

const TABS: TabItem[] = [
  { label: 'Homepage', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Articles', href: '/articles' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Categories', href: '/categories' },
  { label: 'Newsletter', href: '/newsletter' },
]

export function BottomTabBar() {
  return (
    <nav aria-label="Mobile navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border px-4 pb-[env(safe-area-inset-bottom)] pt-2">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="h-10 rounded-full border text-[12px] font-medium inline-flex items-center justify-center transition-colors bg-white text-wld-ink border-border hover:border-wld-ink"
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <Link
        href="/newsletter"
        className="w-full h-10 rounded-full bg-wld-ink text-white text-[13px] font-medium inline-flex items-center justify-center"
      >
        Get The Edit weekly -&gt;
      </Link>
    </nav>
  )
}
