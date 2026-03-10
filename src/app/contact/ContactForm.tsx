'use client'

import { useState, FormEvent } from 'react'

const SUBJECTS = [
  { value: 'editorial',    label: 'Editorial correction' },
  { value: 'sponsorship',  label: 'Sponsorship enquiry' },
  { value: 'partnership',  label: 'Partnership / other' },
  { value: 'general',      label: 'General message' },
]

type State = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [subject, setSubject] = useState('general')
  const [message, setMessage] = useState('')
  const [state,   setState]   = useState<State>('idle')
  const [errMsg,  setErrMsg]  = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setState('loading')
    setErrMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
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
      <div className="rounded-card-lg border border-border bg-wld-white px-8 py-10 text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 border border-green-200 mb-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-display text-[20px] text-wld-ink">Message received</p>
        <p className="text-[14px] text-muted">
          We read everything. We&apos;ll respond if it warrants one.
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
          <label htmlFor="cf-name" className="block text-[12px] font-medium text-wld-ink mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="cf-name"
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
          <label htmlFor="cf-email" className="block text-[12px] font-medium text-wld-ink mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-border bg-wld-white px-4 py-3 text-[14px] text-wld-ink placeholder-muted focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-subject" className="block text-[12px] font-medium text-wld-ink mb-2">
          Subject
        </label>
        <select
          id="cf-subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="w-full rounded-xl border border-border bg-wld-white px-4 py-3 text-[14px] text-wld-ink focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors appearance-none"
        >
          {SUBJECTS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-[12px] font-medium text-wld-ink mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="cf-message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          rows={6}
          placeholder="Write your message here…"
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
        {state === 'loading' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
