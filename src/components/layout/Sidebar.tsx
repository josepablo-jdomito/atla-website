import Link from 'next/link'
import { Logo } from './Logo'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Homepage',
    href: '/',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    ),
  },
  {
    label: 'Articles',
    href: '/articles',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    label: 'Submit',
    href: '/submit',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    href: '/categories',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
      </svg>
    ),
  },
  {
    label: 'Newsletter',
    href: '/newsletter',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 7L2 7" />
      </svg>
    ),
  },
]

export function Sidebar() {
  return (
    <aside
      className={`
        hidden lg:flex fixed top-0 left-0 bottom-0 z-40 flex-col
        border-r border-border bg-white
        w-[220px] px-3 py-6
        overflow-hidden
      `}
    >
      <div className="flex items-center mb-8 justify-between px-3">
        <Link href="/" aria-label="WeLoveDaily home">
          <Logo className="h-5 w-auto text-wld-ink" />
        </Link>
      </div>

      <nav aria-label="Main navigation" className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={`
              flex items-center gap-3 py-2.5 rounded-lg text-[15px]
              transition-colors duration-150
              px-3
              text-muted hover:text-wld-ink hover:bg-[rgb(var(--wld-ink-rgb)/0.04)]
            `}
          >
            <span className="w-6 h-6 shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="pt-4 border-t border-border">
        <Link
          href="/newsletter"
          className="w-full inline-flex items-center justify-center px-4 py-2.5 text-[14px] font-medium rounded-full bg-wld-ink text-white hover:bg-wld-blue transition-colors"
        >
          Subscribe -&gt;
        </Link>
      </div>
    </aside>
  )
}
