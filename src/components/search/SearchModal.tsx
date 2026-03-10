'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity/client'
import { searchQuery, allTagsQuery } from '@/lib/sanity/queries'
import { allCategoriesQuery } from '@/lib/sanity/queries'
import type { SearchData, Category } from '@/types'

const RECENT_KEY = 'wld-recent-searches'
const MAX_RECENT = 6

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
}
function saveRecent(term: string) {
  const list = [term, ...getRecent().filter(s => s !== term)].slice(0, MAX_RECENT)
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)) } catch {}
}

interface NavItem { href: string; label: string }

function buildNavItems(results: SearchData | null): NavItem[] {
  if (!results) return []
  const items: NavItem[] = []
  results.projects.slice(0, 5).forEach(p => items.push({ href: `/projects/${p.slug}`, label: p.title }))
  results.studios.slice(0, 4).forEach(s => items.push({ href: `/studio/${s.slug}`, label: s.name }))
  results.categories.slice(0, 4).forEach(c => items.push({ href: `/category/${c.slug}`, label: c.name }))
  return items
}

function hasResults(r: SearchData) {
  return r.projects.length > 0 || r.studios.length > 0 || r.categories.length > 0
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
    </svg>
  )
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const [mounted, setMounted] = useState(false)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchData | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [recent, setRecent] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [popularTags, setPopularTags] = useState<string[]>([])
  const [metaLoaded, setMetaLoaded] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (isOpen) {
      setRecent(getRecent())
      setTimeout(() => inputRef.current?.focus(), 60)
      if (!metaLoaded) {
        Promise.all([
          client.fetch<Category[]>(allCategoriesQuery).catch(() => []),
          client.fetch<string[]>(allTagsQuery).catch(() => []),
        ]).then(([cats, tags]) => {
          setCategories(cats)
          setPopularTags((tags || []).filter(Boolean).slice(0, 16))
          setMetaLoaded(true)
        })
      }
    } else {
      setQuery('')
      setResults(null)
      setActiveIndex(-1)
    }
  }, [isOpen, metaLoaded])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      setLoading(false)
      setActiveIndex(-1)
      return
    }
    setLoading(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await client.fetch<SearchData>(searchQuery, {
          searchTerm: `*${query.trim()}*`,
          rawTerm: query.trim(),
        })
        setResults(data)
      } catch {}
      setLoading(false)
      setActiveIndex(-1)
    }, 280)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  const navItems = buildNavItems(results)

  const navigate = useCallback((href: string, term?: string) => {
    if (term) { saveRecent(term); setRecent(getRecent()) }
    onClose()
    router.push(href)
  }, [onClose, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`, q)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, navItems.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, -1))
    }
    if (e.key === 'Enter' && activeIndex >= 0 && navItems[activeIndex]) {
      e.preventDefault()
      navigate(navItems[activeIndex].href, query.trim())
    }
  }

  if (!mounted || !isOpen) return null

  const modal = (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-wld-ink/40 backdrop-blur-sm pt-[8vh] px-4 pb-8"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-[600px] bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in"
        style={{ maxHeight: '80vh' }}
      >
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3.5 border-b border-border shrink-0">
          <span className="text-muted shrink-0"><SearchIcon /></span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search brands, studios, designers, categories…"
            className="flex-1 text-[15px] text-wld-ink placeholder:text-muted bg-transparent focus:outline-none min-w-0"
            autoComplete="off"
            spellCheck={false}
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} className="shrink-0 text-muted hover:text-wld-ink transition-colors p-1">
              <CloseIcon />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex shrink-0 items-center text-[11px] text-muted border border-border rounded-md px-1.5 py-0.5 font-mono">Esc</kbd>
          )}
        </form>

        <div className="overflow-y-auto flex-1">
          {!query.trim() ? (
            <DefaultState
              recent={recent}
              categories={categories}
              popularTags={popularTags}
              onSearch={q => setQuery(q)}
              onNavigate={navigate}
            />
          ) : loading ? (
            <LoadingState />
          ) : results && hasResults(results) ? (
            <ResultsState
              results={results}
              query={query.trim()}
              activeIndex={activeIndex}
              navItems={navItems}
              onNavigate={href => navigate(href, query.trim())}
            />
          ) : !loading ? (
            <EmptyState query={query.trim()} onNavigate={navigate} />
          ) : null}
        </div>

        {query.trim() && (
          <div className="px-4 py-3 border-t border-border shrink-0 bg-wld-paper/50">
            <button
              onClick={() => navigate(`/search?q=${encodeURIComponent(query.trim())}`, query.trim())}
              className="text-[13px] text-wld-blue hover:underline inline-flex items-center gap-1.5 font-medium"
            >
              See all results for &ldquo;{query.trim()}&rdquo;
              <ArrowIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

function DefaultState({
  recent,
  categories,
  popularTags,
  onSearch,
  onNavigate,
}: {
  recent: string[]
  categories: Category[]
  popularTags: string[]
  onSearch: (q: string) => void
  onNavigate: (href: string, term?: string) => void
}) {
  return (
    <div className="p-4 space-y-5">
      {recent.length > 0 && (
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-2.5">Recent</p>
          <div className="space-y-0.5">
            {recent.map(term => (
              <button
                key={term}
                onClick={() => onSearch(term)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-[14px] text-wld-ink hover:bg-wld-paper transition-colors"
              >
                <span className="text-muted"><ClockIcon /></span>
                {term}
              </button>
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-2.5">Browse categories</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => onNavigate(`/category/${cat.slug}`)}
                className="h-8 px-3 rounded-full border border-border text-[12px] text-wld-ink hover:border-wld-ink hover:bg-wld-paper transition-colors"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {popularTags.length > 0 && (
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-2.5">Popular tags</p>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <button
                key={tag}
                onClick={() => onSearch(tag)}
                className="h-8 px-3 rounded-full bg-wld-paper border border-border text-[12px] text-wld-ink hover:border-wld-ink transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="p-4 space-y-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-lg bg-card animate-pulse shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-card rounded animate-pulse w-3/4" />
            <div className="h-2.5 bg-card rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ResultsState({
  results,
  query,
  activeIndex,
  navItems,
  onNavigate,
}: {
  results: SearchData
  query: string
  activeIndex: number
  navItems: NavItem[]
  onNavigate: (href: string) => void
}) {
  let itemIndex = 0

  return (
    <div className="py-2">
      {results.projects.length > 0 && (
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted px-4 py-2">
            Projects ({results.projects.length})
          </p>
          {results.projects.slice(0, 5).map(post => {
            const idx = itemIndex++
            const isActive = idx === activeIndex
            const imgUrl = post.coverImage?.asset
              ? urlFor(post.coverImage).width(80).height(80).format('webp').quality(80).url()
              : null
            return (
              <button
                key={post._id}
                onClick={() => onNavigate(`/projects/${post.slug}`)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isActive ? 'bg-wld-paper' : 'hover:bg-wld-paper/60'}`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-card">
                  {imgUrl && (
                    <Image src={imgUrl} alt={post.title} width={40} height={40} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-wld-ink truncate">{post.title}</p>
                  <p className="text-[12px] text-muted">{post.category?.name}</p>
                </div>
                {isActive && <span className="text-muted shrink-0"><ArrowIcon /></span>}
              </button>
            )
          })}
        </section>
      )}

      {results.studios.length > 0 && (
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted px-4 py-2">
            Studios ({results.studios.length})
          </p>
          {results.studios.slice(0, 4).map(studio => {
            const idx = itemIndex++
            const isActive = idx === activeIndex
            return (
              <button
                key={studio._id}
                onClick={() => onNavigate(`/studio/${studio.slug}`)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isActive ? 'bg-wld-paper' : 'hover:bg-wld-paper/60'}`}
              >
                <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center shrink-0">
                  <span className="text-[16px] font-semibold text-muted">{studio.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-wld-ink truncate">{studio.name}</p>
                  {studio.tagline && <p className="text-[12px] text-muted truncate">{studio.tagline}</p>}
                </div>
                {isActive && <span className="text-muted shrink-0"><ArrowIcon /></span>}
              </button>
            )
          })}
        </section>
      )}

      {results.categories.length > 0 && (
        <section className="px-4 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-2.5">
            Categories
          </p>
          <div className="flex flex-wrap gap-2">
            {results.categories.map(cat => {
              const idx = itemIndex++
              const isActive = idx === activeIndex
              return (
                <button
                  key={cat._id}
                  onClick={() => onNavigate(`/category/${cat.slug}`)}
                  className={`h-8 px-3 rounded-full border text-[12px] transition-colors ${isActive ? 'bg-wld-ink text-white border-wld-ink' : 'border-border text-wld-ink hover:border-wld-ink'}`}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

function EmptyState({ query, onNavigate }: { query: string; onNavigate: (href: string, term?: string) => void }) {
  return (
    <div className="px-4 py-10 text-center">
      <p className="text-[15px] text-wld-ink font-medium mb-1">No results for &ldquo;{query}&rdquo;</p>
      <p className="text-[13px] text-muted mb-4">Try a studio name, brand, designer, or category.</p>
      <button
        onClick={() => onNavigate(`/search?q=${encodeURIComponent(query)}`, query)}
        className="h-9 px-4 rounded-full border border-border text-[13px] text-wld-ink hover:border-wld-ink transition-colors inline-flex items-center gap-2"
      >
        Search all of WeLoveDaily <ArrowIcon />
      </button>
    </div>
  )
}
