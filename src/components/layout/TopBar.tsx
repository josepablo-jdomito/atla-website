'use client'

import { Suspense, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Logo } from './Logo'
import { SearchModal } from '@/components/search/SearchModal'

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

function TopBarLeft() {
  const pathname = usePathname()
  if (pathname === '/') return <span className="lg:hidden" />
  return (
    <div className="lg:hidden">
      <Link href="/" aria-label="WeLoveDaily home">
        <Logo className="h-[15px] w-auto text-wld-ink" />
      </Link>
    </div>
  )
}

function SearchTrigger({ onClick }: { onClick: () => void }) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault()
        onClick()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClick])

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open search"
      className="flex items-center gap-2.5 h-8 pl-3 pr-3.5 bg-wld-white border border-border rounded-full text-muted hover:border-[rgb(var(--wld-ink-rgb)/0.25)] hover:text-wld-ink transition-all"
    >
      <SearchIcon />
      <span className="text-[12px] w-24 md:w-36 text-left">Search…</span>
      <kbd className="hidden md:inline-flex items-center text-[10px] text-muted border border-border rounded px-1.5 py-0.5 font-mono">/</kbd>
    </button>
  )
}

export function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 bg-wld-paper/95 backdrop-blur-md border-b border-border">
        <div className="h-11 px-4 lg:px-8 flex items-center justify-between gap-4">
          <Suspense fallback={<span className="lg:hidden" />}>
            <TopBarLeft />
          </Suspense>
          <div className="hidden lg:block" />
          <SearchTrigger onClick={() => setSearchOpen(true)} />
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
