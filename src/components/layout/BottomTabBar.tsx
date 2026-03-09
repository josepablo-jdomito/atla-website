'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface TabItem {
  label: string
  href: string
}

const TABS: TabItem[] = [
  { label: 'Homepage', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Articles', href: '/articles' },
  { label: 'Submit', href: '/submit' },
  { label: 'Categories', href: '/categories' },
  { label: 'Newsletter', href: '/newsletter' },
]

export function BottomTabBar() {
  const pathname = usePathname()
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border px-4 pb-[env(safe-area-inset-bottom)] pt-2">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {TABS.map((tab) => {
          const active = isActive(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`h-10 rounded-full border text-[12px] font-medium inline-flex items-center justify-center transition-colors ${
                active
                  ? 'bg-wld-ink text-white border-wld-ink'
                  : 'bg-white text-wld-ink border-border'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
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
