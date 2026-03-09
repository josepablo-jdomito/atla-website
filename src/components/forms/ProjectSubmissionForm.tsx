'use client'

import Script from 'next/script'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'

interface CategoryOption {
  _id: string
  name: string
}

interface ProjectSubmissionFormProps {
  categories: CategoryOption[]
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback'?: () => void
        }
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

export function ProjectSubmissionForm({ categories }: ProjectSubmissionFormProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileReady, setTurnstileReady] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null)
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null)
  const turnstileWidgetIdRef = useRef<string | null>(null)
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''
  const hasTurnstile = Boolean(turnstileSiteKey)

  const canSubmit = useMemo(
    () =>
      selectedCategoryIds.length > 0 &&
      imageFiles.length > 0 &&
      !isPending &&
      (!hasTurnstile || Boolean(turnstileToken)),
    [selectedCategoryIds.length, imageFiles.length, isPending, hasTurnstile, turnstileToken]
  )

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const formData = new FormData(formElement)

    selectedCategoryIds.forEach((id) => formData.append('categoryIds', id))
    imageFiles.forEach((file) => formData.append('images', file))

    startTransition(async () => {
      setMessage(null)
      setMessageType(null)

      const response = await fetch('/api/submissions', {
        method: 'POST',
        body: formData,
      })

      const payload = await response.json()

      if (!response.ok) {
        setMessage(payload.error || 'Could not submit your project. Please try again.')
        setMessageType('error')
        return
      }

      formElement.reset()
      setSelectedCategoryIds([])
      setImageFiles([])
      setTurnstileToken('')
      if (hasTurnstile && turnstileWidgetIdRef.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetIdRef.current)
      }
      setMessage('Submitted successfully. Your project is now in editorial review.')
      setMessageType('success')
    })
  }

  useEffect(() => {
    if (!hasTurnstile || !turnstileReady || !turnstileContainerRef.current || !window.turnstile) return
    if (turnstileWidgetIdRef.current) return

    turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: turnstileSiteKey,
      callback: (token: string) => setTurnstileToken(token),
      'expired-callback': () => setTurnstileToken(''),
    })

    return () => {
      if (turnstileWidgetIdRef.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetIdRef.current)
        turnstileWidgetIdRef.current = null
      }
    }
  }, [hasTurnstile, turnstileReady, turnstileSiteKey])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {hasTurnstile && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setTurnstileReady(true)}
        />
      )}

      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <input type="hidden" name="turnstileToken" value={turnstileToken} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <label className="space-y-2 block">
          <span className="text-[13px] font-medium uppercase tracking-wider text-muted">
            Project title
          </span>
          <input
            name="title"
            required
            maxLength={120}
            className="w-full px-4 py-3 text-[15px] border border-border rounded-card bg-white focus:outline-none focus:border-wld-ink"
          />
        </label>

        <label className="space-y-2 block">
          <span className="text-[13px] font-medium uppercase tracking-wider text-muted">Studio</span>
          <input
            name="studio"
            required
            maxLength={120}
            className="w-full px-4 py-3 text-[15px] border border-border rounded-card bg-white focus:outline-none focus:border-wld-ink"
          />
        </label>
      </div>

      <label className="space-y-2 block">
        <span className="text-[13px] font-medium uppercase tracking-wider text-muted">Brand name</span>
        <input
          name="brandName"
          maxLength={120}
          className="w-full px-4 py-3 text-[15px] border border-border rounded-card bg-white focus:outline-none focus:border-wld-ink"
        />
      </label>

      {hasTurnstile && (
        <div className="space-y-2">
          <span className="text-[13px] font-medium uppercase tracking-wider text-muted block">
            Human verification
          </span>
          <div ref={turnstileContainerRef} />
        </div>
      )}

      <label className="space-y-2 block">
        <span className="text-[13px] font-medium uppercase tracking-wider text-muted">Description</span>
        <textarea
          name="description"
          required
          rows={5}
          maxLength={2000}
          className="w-full px-4 py-3 text-[15px] border border-border rounded-card bg-white focus:outline-none focus:border-wld-ink"
        />
      </label>

      <label className="space-y-2 block">
        <span className="text-[13px] font-medium uppercase tracking-wider text-muted">
          Designer credits
        </span>
        <input
          name="designerCredits"
          placeholder="Jane Doe, John Smith"
          className="w-full px-4 py-3 text-[15px] border border-border rounded-card bg-white focus:outline-none focus:border-wld-ink"
        />
      </label>

      <label className="space-y-2 block">
        <span className="text-[13px] font-medium uppercase tracking-wider text-muted">Tags</span>
        <input
          name="tags"
          placeholder="packaging, food, identity"
          className="w-full px-4 py-3 text-[15px] border border-border rounded-card bg-white focus:outline-none focus:border-wld-ink"
        />
      </label>

      <div className="space-y-3">
        <span className="text-[13px] font-medium uppercase tracking-wider text-muted block">
          Categories
        </span>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = selectedCategoryIds.includes(category._id)
            return (
              <button
                key={category._id}
                type="button"
                onClick={() => toggleCategory(category._id)}
                className={`px-3 py-2 text-[13px] rounded-full border transition-colors ${
                  active
                    ? 'border-wld-ink bg-wld-ink text-white'
                    : 'border-border bg-white text-wld-ink hover:border-wld-ink'
                }`}
              >
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      <label className="space-y-2 block">
        <span className="text-[13px] font-medium uppercase tracking-wider text-muted">
          Images (hero + gallery)
        </span>
        <input
          name="images"
          type="file"
          accept="image/*"
          multiple
          required
          onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
          className="block w-full text-[14px] text-muted file:mr-4 file:py-2 file:px-3 file:rounded-full file:border file:border-border file:bg-white file:text-wld-ink hover:file:border-wld-ink"
        />
      </label>

      {message && (
        <p
          className={`text-[14px] ${
            messageType === 'success' ? 'text-green-700' : messageType === 'error' ? 'text-red-700' : 'text-muted'
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="px-6 py-3 text-[14px] font-medium rounded-full bg-wld-ink text-white hover:bg-wld-blue transition-colors disabled:opacity-50"
      >
        {isPending ? 'Submitting...' : 'Submit project'}
      </button>
    </form>
  )
}
