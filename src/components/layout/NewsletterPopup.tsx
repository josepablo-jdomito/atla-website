'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const DISMISS_KEY = 'wld_newsletter_popup_dismissed_until'
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000
const OPEN_DELAY_MS = 3500

function canShowPopup(pathname: string) {
  return !pathname.startsWith('/newsletter')
}

export function NewsletterPopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!canShowPopup(pathname)) return

    const dismissedUntilRaw = localStorage.getItem(DISMISS_KEY)
    const dismissedUntil = dismissedUntilRaw ? Number(dismissedUntilRaw) : 0
    if (Number.isFinite(dismissedUntil) && dismissedUntil > Date.now()) return

    const timer = window.setTimeout(() => {
      setOpen(true)
    }, OPEN_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [pathname])

  const close = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_MS))
    setOpen(false)
  }

  if (!open || !canShowPopup(pathname)) return null

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 w-[min(92vw,420px)]">
      <div className="rounded-card border border-border bg-white shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-5">
        <button
          type="button"
          onClick={close}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full border border-border text-[12px] text-muted hover:text-wld-ink hover:border-wld-ink transition-colors"
          aria-label="Close newsletter popup"
        >
          ×
        </button>
        <h3 className="font-display text-[24px] leading-tight text-wld-ink pr-8">
          The Edit
        </h3>
        <p className="mt-2 text-[14px] text-muted">
          Curated work and sharp thinking, delivered weekly.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Link
            href="/newsletter"
            className="inline-flex items-center justify-center px-4 py-2 text-[14px] font-medium rounded-full bg-wld-ink text-white hover:bg-wld-blue transition-colors"
          >
            Subscribe
          </Link>
          <button
            type="button"
            onClick={close}
            className="inline-flex items-center justify-center px-4 py-2 text-[13px] text-muted border border-border rounded-full hover:text-wld-ink hover:border-wld-ink transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
