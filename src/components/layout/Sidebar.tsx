'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './Logo'
import { ArrowRight } from '@/components/ui/ArrowRight'
import { AuthNav } from './AuthNav'

interface NavItem {
  label: string
  href: string
}

const PRIMARY_NAV: NavItem[] = [
  { label: 'Homepage', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Articles', href: '/articles' },
  { label: 'Categories', href: '/categories' },
]

const SECONDARY_NAV: NavItem[] = [
  { label: 'Submit', href: '/submit' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Sidebar() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside
      className={`
        hidden lg:flex fixed top-0 left-0 bottom-0 z-40 flex-col
        border-r border-border bg-wld-paper
        w-[220px] px-5 py-7
        overflow-hidden
      `}
    >
      {/* Logo */}
      <div className="mb-9 px-1">
        <Link href="/" aria-label="WeLoveDaily home">
          <Logo className="h-[18px] w-auto text-wld-ink" />
        </Link>
      </div>

      {/* Primary nav */}
      <nav aria-label="Main navigation" className="flex-1 space-y-0">
        <p className="text-[9px] font-medium uppercase tracking-widest text-muted mb-3 px-1">
          Explore
        </p>
        {PRIMARY_NAV.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex items-center py-2 px-1 text-[14px] leading-none
                transition-colors duration-150
                ${active
                  ? 'text-wld-ink font-medium'
                  : 'text-muted hover:text-wld-ink'
                }
              `}
            >
              {active && (
                <span className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-[2px] h-[14px] rounded-full bg-wld-ink" />
              )}
              {item.label}
            </Link>
          )
        })}

        <div className="my-5 border-t border-border" />

        <p className="text-[9px] font-medium uppercase tracking-widest text-muted mb-3 px-1">
          More
        </p>
        {SECONDARY_NAV.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex items-center py-2 px-1 text-[13px] leading-none
                transition-colors duration-150
                ${active
                  ? 'text-wld-ink font-medium'
                  : 'text-muted hover:text-wld-ink'
                }
              `}
            >
              {active && (
                <span className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-[2px] h-[12px] rounded-full bg-wld-ink" />
              )}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="space-y-2.5 pt-5 border-t border-border">
        <Link
          href="/newsletter"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[12px] font-medium tracking-wide rounded-full bg-wld-ink text-wld-paper hover:opacity-80 transition-opacity"
        >
          Subscribe
          <ArrowRight />
        </Link>
        <AuthNav />
      </div>
    </aside>
  )
}
