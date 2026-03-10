'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Logo } from './Logo'

function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

function TopBarSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (pathname === '/search') {
      setQuery(searchParams.get('q') || '')
    }
  }, [pathname, searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) {
      router.push('/search')
      inputRef.current?.focus()
      return
    }
    router.push(`/search?q=${encodeURIComponent(q)}`)
    inputRef.current?.blur()
  }

  return (
    <form onSubmit={handleSubmit} role="search">
      <label htmlFor="topbar-search" className="sr-only">
        Search
      </label>
      <div className="flex items-center h-9 bg-white border border-border rounded-full overflow-hidden focus-within:border-wld-ink transition-colors group">
        <button
          type="submit"
          aria-label="Submit search"
          className="pl-3 pr-2 text-muted group-focus-within:text-wld-ink transition-colors shrink-0"
        >
          <SearchIcon />
        </button>
        <input
          ref={inputRef}
          id="topbar-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search studios, brands…"
          className="h-9 w-36 md:w-48 pr-4 text-[13px] bg-transparent text-wld-ink placeholder:text-muted focus:outline-none"
        />
      </div>
    </form>
  )
}

function TopBarLeft() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  if (isHome) return <span className="lg:hidden" />

  return (
    <div className="lg:hidden">
      <Link href="/" aria-label="WeLoveDaily home">
        <Logo className="h-4 w-auto text-wld-ink" />
      </Link>
    </div>
  )
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 bg-wld-paper/90 backdrop-blur-sm border-b border-border">
      <div className="h-12 px-4 lg:px-8 flex items-center justify-between gap-4">
        <Suspense fallback={<span className="lg:hidden" />}>
          <TopBarLeft />
        </Suspense>
        <div className="hidden lg:block" />

        <Suspense
          fallback={
            <div className="flex items-center h-9 w-[188px] bg-white border border-border rounded-full" />
          }
        >
          <TopBarSearch />
        </Suspense>
      </div>
    </header>
  )
}
