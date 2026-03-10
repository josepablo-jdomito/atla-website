'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface TabItem {
  label: string
  href: string
  icon: React.ReactNode
}

const TABS: TabItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    ),
  },
  {
    label: 'Articles',
    href: '/articles',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    href: '/categories',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
      </svg>
    ),
  },
  {
    label: 'Newsletter',
    href: '/newsletter',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 7L2 7" />
      </svg>
    ),
  },
]

export function BottomTabBar() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5">
        {TABS.map((tab) => {
          const active = isActive(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                active ? 'text-wld-blue' : 'text-muted hover:text-wld-ink'
              }`}
            >
              <span className={`transition-colors ${active ? 'text-wld-blue' : ''}`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
