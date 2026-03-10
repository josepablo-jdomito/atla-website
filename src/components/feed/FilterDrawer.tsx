'use client'

import { useState, useEffect } from 'react'
import type { Category } from '@/types'

export type SortMode = 'latest' | 'trending' | 'most-saved'
export type TypeFilter = 'all' | 'projects' | 'articles'

export interface FilterState {
  sort: SortMode
  type: TypeFilter
  category: string | null
  tags: string[]
}

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterState) => void
  categories: Category[]
  allTags: string[]
  current: FilterState
  resultCount: number
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export function FilterDrawer({
  isOpen,
  onClose,
  onApply,
  categories,
  allTags,
  current,
  resultCount,
}: FilterDrawerProps) {
  const [local, setLocal] = useState<FilterState>(current)
  const [tagSearch, setTagSearch] = useState('')

  useEffect(() => {
    if (isOpen) setLocal(current)
  }, [isOpen, current])

  const filteredTags = tagSearch
    ? allTags.filter(t => t.toLowerCase().includes(tagSearch.toLowerCase()))
    : allTags

  const clearAll = () => setLocal({ sort: 'latest', type: 'all', category: null, tags: [] })

  const toggleTag = (tag: string) =>
    setLocal(l => ({
      ...l,
      tags: l.tags.includes(tag) ? l.tags.filter(t => t !== tag) : [...l.tags, tag],
    }))

  const activeCount =
    (local.category ? 1 : 0) +
    (local.type !== 'all' ? 1 : 0) +
    local.tags.length +
    (local.sort !== 'latest' ? 1 : 0)

  const apply = () => {
    onApply(local)
    onClose()
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-wld-ink/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={apply}
        aria-hidden
      />

      <div
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-[360px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Filters"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="font-semibold text-[15px] text-wld-ink">Filters</h2>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-wld-blue text-white text-[11px] flex items-center justify-center font-medium">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="text-[13px] text-muted hover:text-wld-ink transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={apply}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-wld-paper text-muted hover:text-wld-ink transition-colors"
              aria-label="Close filters"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-5 space-y-7">
            <section>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">
                Sort by
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {([
                  ['latest', 'Latest'],
                  ['trending', 'Trending'],
                  ['most-saved', 'Most Saved'],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setLocal(l => ({ ...l, sort: value }))}
                    className={`h-9 rounded-lg border text-[13px] font-medium transition-colors ${
                      local.sort === value
                        ? 'bg-wld-ink text-white border-wld-ink'
                        : 'border-border text-wld-ink hover:border-wld-ink'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">
                Content type
              </h3>
              <div className="flex gap-2">
                {([
                  ['all', 'All'],
                  ['projects', 'Projects'],
                  ['articles', 'Articles'],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setLocal(l => ({ ...l, type: value }))}
                    className={`h-9 px-4 rounded-full border text-[13px] font-medium transition-colors ${
                      local.type === value
                        ? 'bg-wld-ink text-white border-wld-ink'
                        : 'border-border text-wld-ink hover:border-wld-ink'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            {categories.length > 0 && (
              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">
                  Category
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setLocal(l => ({ ...l, category: null }))}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
                      !local.category
                        ? 'bg-wld-ink text-white'
                        : 'text-wld-ink hover:bg-wld-paper'
                    }`}
                  >
                    <span>All categories</span>
                    {!local.category && <CheckIcon />}
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat._id}
                      onClick={() =>
                        setLocal(l => ({
                          ...l,
                          category: l.category === cat.slug ? null : cat.slug,
                        }))
                      }
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
                        local.category === cat.slug
                          ? 'bg-wld-ink text-white'
                          : 'text-wld-ink hover:bg-wld-paper'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {local.category === cat.slug && <CheckIcon />}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {allTags.length > 0 && (
              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">
                  Tags
                  {local.tags.length > 0 && (
                    <span className="ml-2 text-wld-blue normal-case tracking-normal font-medium">
                      {local.tags.length} selected
                    </span>
                  )}
                </h3>
                {allTags.length > 8 && (
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={e => setTagSearch(e.target.value)}
                    placeholder="Filter tags…"
                    className="w-full mb-3 h-9 px-3 text-[13px] border border-border rounded-lg bg-white focus:outline-none focus:border-wld-ink transition-colors"
                  />
                )}
                <div className="flex flex-wrap gap-2">
                  {filteredTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`h-8 px-3 rounded-full border text-[12px] transition-colors inline-flex items-center gap-1.5 ${
                        local.tags.includes(tag)
                          ? 'bg-wld-blue text-white border-wld-blue'
                          : 'border-border text-wld-ink hover:border-wld-ink'
                      }`}
                    >
                      {local.tags.includes(tag) && <CheckIcon />}
                      {tag}
                    </button>
                  ))}
                  {filteredTags.length === 0 && (
                    <p className="text-[13px] text-muted">No tags match &ldquo;{tagSearch}&rdquo;</p>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-border shrink-0">
          <button
            onClick={apply}
            className="w-full h-11 rounded-full bg-wld-ink text-white text-[14px] font-medium hover:bg-wld-blue transition-colors"
          >
            {resultCount > 0
              ? `Show ${resultCount} result${resultCount !== 1 ? 's' : ''}`
              : 'Apply filters'}
          </button>
        </div>
      </div>
    </>
  )
}
