'use client'

import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark'

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('wld-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved: ThemeMode =
      saved === 'dark' || saved === 'light' ? saved : prefersDark ? 'dark' : 'light'
    setTheme(resolved)
    applyTheme(resolved)
    setMounted(true)
  }, [])

  const toggle = () => {
    const next: ThemeMode = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('wld-theme', next)
    applyTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-wld-white px-3 py-2 text-[12px] font-medium text-wld-ink shadow-sm hover:border-wld-ink transition-colors ${className}`}
    >
      {mounted && theme === 'dark' ? (
        <>
          <span aria-hidden>☀</span>
          <span>Light</span>
        </>
      ) : (
        <>
          <span aria-hidden>☾</span>
          <span>Dark</span>
        </>
      )}
    </button>
  )
}
