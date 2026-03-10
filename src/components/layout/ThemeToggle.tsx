'use client'

import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark'

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 0010 9.79z" />
    </svg>
  )
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('wld-theme')
    const resolved: ThemeMode = saved === 'dark' || saved === 'light' ? saved : 'light'
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
      className={`w-9 h-9 rounded-full border border-border bg-wld-white inline-flex items-center justify-center text-wld-ink shadow-sm hover:border-wld-ink transition-colors ${className}`}
    >
      {mounted && theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
