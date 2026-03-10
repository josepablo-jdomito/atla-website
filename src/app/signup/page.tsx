'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/layout/Logo'

export default function SignupPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.')
      return
    }

    router.push('/login?registered=1')
  }

  return (
    <div className="min-h-[calc(100vh-44px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[360px]">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/" aria-label="WeLoveDaily home">
            <Logo className="h-5 w-auto text-wld-ink" />
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-display text-[28px] leading-tight text-wld-ink">Create account</h1>
          <p className="mt-2 text-[13px] text-muted">Join WeLoveDaily — it&apos;s free</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-[12px] font-medium text-wld-ink mb-2">
              Name <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full rounded-xl border border-border bg-wld-white px-4 py-3 text-[14px] text-wld-ink placeholder-muted focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[12px] font-medium text-wld-ink mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-border bg-wld-white px-4 py-3 text-[14px] text-wld-ink placeholder-muted focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[12px] font-medium text-wld-ink mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full rounded-xl border border-border bg-wld-white px-4 py-3 text-[14px] text-wld-ink placeholder-muted focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-wld-ink text-wld-paper text-[13px] font-medium py-3 px-4 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-[13px] text-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-wld-ink font-medium hover:text-wld-blue transition-colors underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
