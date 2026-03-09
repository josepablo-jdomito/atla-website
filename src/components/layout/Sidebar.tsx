'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './Logo'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    label: 'Search',
    href: '/search',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    label: 'Brands',
    href: '/brands',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
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
]

const BOTTOM_ITEMS: NavItem[] = [
  {
    label: 'Advertise',
    href: '/advertise',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    label: 'About',
    href: '/about',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
]

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
    >
      <path d="M12.5 15L7.5 10L12.5 5" />
    </svg>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('wld-sidebar')
    if (saved === 'collapsed') setCollapsed(true)
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('wld-sidebar', next ? 'collapsed' : 'expanded')
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={`
        hidden lg:flex flex-col h-screen sticky top-0
        border-r border-border bg-white
        transition-[width] duration-200 ease-out
        ${collapsed ? 'w-[68px] px-2' : 'w-[220px] px-3'}
        py-6
      `}
    >
      {/* Logo + toggle */}
      <div className={`flex items-center mb-8 ${collapsed ? 'justify-center' : 'justify-between px-3'}`}>
        <Link href="/" aria-label="WeLoveDaily home">
          {collapsed ? (
            <Logo mark className="w-6 h-auto text-wld-ink" />
          ) : (
            <Logo className="h-5 w-auto text-wld-ink" />
          )}
        </Link>
        {mounted && (
          <button
            onClick={toggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`
              flex items-center justify-center w-7 h-7 rounded-md
              text-muted hover:text-wld-ink hover:bg-[rgb(var(--wld-ink-rgb)/0.08)]
              transition-colors duration-150
              ${collapsed ? 'mt-3' : ''}
            `}
          >
            <CollapseIcon collapsed={collapsed} />
          </button>
        )}
      </div>

      {/* When collapsed, show toggle below logo */}
      {collapsed && mounted && (
        <div className="flex justify-center mb-4" />
      )}

      {/* Main nav */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={`
              flex items-center gap-3 py-2.5 rounded-lg text-[15px]
              transition-colors duration-150
              ${collapsed ? 'justify-center px-0' : 'px-3'}
              ${isActive(item.href)
                ? 'text-wld-ink font-semibold bg-[rgb(var(--wld-ink-rgb)/0.08)]'
                : 'text-muted hover:text-wld-ink hover:bg-[rgb(var(--wld-ink-rgb)/0.04)]'
              }
            `}
          >
            <span className="w-6 h-6 shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="space-y-1 pt-4 border-t border-border">
        {BOTTOM_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={`
              flex items-center gap-3 py-2.5 rounded-lg text-[14px]
              transition-colors duration-150
              ${collapsed ? 'justify-center px-0' : 'px-3'}
              ${isActive(item.href)
                ? 'text-wld-ink font-semibold'
                : 'text-muted hover:text-wld-ink'
              }
            `}
          >
            <span className="w-6 h-6 shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>
    </aside>
  )
}
