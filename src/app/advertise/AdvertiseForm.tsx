'use client'

import { useState, FormEvent } from 'react'

const FORMATS = [
  { value: 'sponsored-article',  label: 'Sponsored Article' },
  { value: 'newsletter',         label: 'Newsletter Sponsorship' },
  { value: 'brand-partnership',  label: 'Brand Partnership' },
  { value: 'event',              label: 'Event Sponsorship' },
  { value: 'other',              label: 'Not sure yet' },
]

const BUDGETS = [
  { value: 'under-5k',   label: 'Under $5,000' },
  { value: '5k-15k',     label: '$5,000 – $15,000' },
  { value: '15k-50k',    label: '$15,000 – $50,000' },
  { value: '50k-plus',   label: '$50,000+' },
  { value: 'not-sure',   label: 'Not sure yet' },
]

type State = 'idle' | 'loading' | 'success' | 'error'

export function AdvertiseForm() {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [company, setCompany] = useState('')
  const [website, setWebsite] = useState('')
  const [format,  setFormat]  = useState('sponsored-article')
  const [budget,  setBudget]  = useState('not-sure')
  const [message, setMessage] = useState('')
  const [state,   setState]   = useState<State>('idle')
  const [errMsg,  setErrMsg]  = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setState('loading')
    setErrMsg('')

    try {
      const res = await fetch('/api/advertise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, website, format, budget, message }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setErrMsg(data.error || 'Something went wrong. Please try again.')
        setState('error')
        return
      }

      setState('success')
    } catch {
      setErrMsg('Network error. Please check your connection and try again.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-card border border-border bg-wld-white px-8 py-12 text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 border border-green-200 mb-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-display text-[20px] text-wld-ink">Thanks — we&apos;ll be in touch</p>
        <p className="text-[14px] text-muted">
          We&apos;ll review your enquiry and send a media kit within 48 hours if there&apos;s a fit.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

      {state === 'error' && errMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {errMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="af-name" className="block text-[12px] font-medium text-wld-ink mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="af-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Your name"
            className="w-full rounded-xl border border-border bg-wld-white px-4 py-3 text-[14px] text-wld-ink placeholder-muted focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors"
          />
        </div>

        <div>
          <label htmlFor="af-email" className="block text-[12px] font-medium text-wld-ink mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="af-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@company.com"
            className="w-full rounded-xl border border-border bg-wld-white px-4 py-3 text-[14px] text-wld-ink placeholder-muted focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="af-company" className="block text-[12px] font-medium text-wld-ink mb-2">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            id="af-company"
            type="text"
            value={company}
            onChange={e => setCompany(e.target.value)}
            required
            autoComplete="organization"
            placeholder="Company name"
            className="w-full rounded-xl border border-border bg-wld-white px-4 py-3 text-[14px] text-wld-ink placeholder-muted focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors"
          />
        </div>

        <div>
          <label htmlFor="af-website" className="block text-[12px] font-medium text-wld-ink mb-2">
            Website
          </label>
          <input
            id="af-website"
            type="url"
            value={website}
            onChange={e => setWebsite(e.target.value)}
            autoComplete="url"
            placeholder="https://yourcompany.com"
            className="w-full rounded-xl border border-border bg-wld-white px-4 py-3 text-[14px] text-wld-ink placeholder-muted focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="af-format" className="block text-[12px] font-medium text-wld-ink mb-2">
            Format interest
          </label>
          <select
            id="af-format"
            value={format}
            onChange={e => setFormat(e.target.value)}
            className="w-full rounded-xl border border-border bg-wld-white px-4 py-3 text-[14px] text-wld-ink focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors appearance-none"
          >
            {FORMATS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="af-budget" className="block text-[12px] font-medium text-wld-ink mb-2">
            Budget range
          </label>
          <select
            id="af-budget"
            value={budget}
            onChange={e => setBudget(e.target.value)}
            className="w-full rounded-xl border border-border bg-wld-white px-4 py-3 text-[14px] text-wld-ink focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors appearance-none"
          >
            {BUDGETS.map(b => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="af-message" className="block text-[12px] font-medium text-wld-ink mb-2">
          What are you promoting? <span className="text-red-500">*</span>
        </label>
        <textarea
          id="af-message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          rows={5}
          placeholder="Tell us about your brand, what you're launching, and who you're trying to reach…"
          className="w-full rounded-xl border border-border bg-wld-white px-4 py-3 text-[14px] text-wld-ink placeholder-muted focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors resize-none"
        />
        <p className="text-[11px] text-muted mt-1.5 text-right">
          {message.length} / 4000
        </p>
      </div>

      <button
        type="submit"
        disabled={state === 'loading'}
        className="w-full rounded-full bg-wld-ink text-wld-paper text-[13px] font-medium py-3 px-4 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === 'loading' ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  )
}
