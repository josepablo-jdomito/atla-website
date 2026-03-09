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
    label: 'Categories',
    href: '/categories',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
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

  const isActive = (href: string) => pathname.startsWith(href)

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

      {!collapsed && (
        <div className="pt-4 border-t border-border">
          <Link
            href="/newsletter"
            className="w-full inline-flex items-center justify-center px-4 py-2.5 text-[14px] font-medium rounded-full bg-wld-ink text-white hover:bg-wld-blue transition-colors"
          >
            Subscribe -&gt;
          </Link>
        </div>
      )}
    </aside>
  )
}
