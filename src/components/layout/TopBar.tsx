'use client'

import { Suspense, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
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
      aria-label="Search"
      className="flex items-center gap-2.5 h-8 pl-3 pr-3.5 bg-wld-white border border-border rounded-full text-muted hover:border-[rgb(var(--wld-ink-rgb)/0.25)] hover:text-wld-ink transition-all"
    >
      <SearchIcon />
      <span className="text-[12px] w-24 md:w-36 text-left" aria-hidden="true">Search…</span>
      <kbd className="hidden md:inline-flex items-center text-[10px] text-muted border border-border rounded px-1.5 py-0.5 font-mono" aria-hidden="true">/</kbd>
    </button>
  )
}

function ProfileButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="w-8 h-8 rounded-full bg-[rgb(var(--wld-ink-rgb)/0.07)] animate-pulse shrink-0" />
  }

  if (session?.user) {
    const name = session.user.name || session.user.email || ''
    const initials = name
      .split(' ')
      .map((w: string) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?'

    return (
      <Link
        href="/profile"
        aria-label="My profile"
        className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-border hover:border-wld-ink transition-colors"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={name}
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-wld-ink text-wld-paper flex items-center justify-center text-[11px] font-semibold">
            {initials}
          </div>
        )}
      </Link>
    )
  }

  return (
    <Link
      href="/login"
      className="h-8 px-3.5 rounded-full border border-border text-[12px] text-muted hover:text-wld-ink hover:border-[rgb(var(--wld-ink-rgb)/0.25)] inline-flex items-center transition-all shrink-0"
    >
      Sign in
    </Link>
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
          <div className="flex items-center gap-2.5">
            <SearchTrigger onClick={() => setSearchOpen(true)} />
            <ProfileButton />
          </div>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
