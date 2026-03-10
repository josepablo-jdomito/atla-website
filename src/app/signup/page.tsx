'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/layout/Logo'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.39.07 2.35.77 3.17.8 1.21-.24 2.37-.96 3.67-.84 1.57.13 2.75.75 3.52 1.92-3.23 1.95-2.7 6.23.79 7.45-.55 1.56-1.28 3.1-3.15 3.53zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

export default function SignupPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

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

  async function handleGoogle() {
    setGoogleLoading(true)
    setError('')
    await signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-[calc(100vh-44px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[360px]">

        <div className="flex justify-center mb-10">
          <Link href="/" aria-label="WeLoveDaily home">
            <Logo className="h-5 w-auto text-wld-ink" />
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-display text-[28px] leading-tight text-wld-ink">Create account</h1>
          <p className="mt-2 text-[13px] text-muted">Join WeLoveDaily — it&apos;s free</p>
        </div>

        {/* OAuth buttons */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="flex items-center justify-center gap-2.5 h-11 rounded-xl border border-border bg-wld-white text-[13px] font-medium text-wld-ink hover:border-[rgb(var(--wld-ink-rgb)/0.3)] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-border border-t-wld-ink rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Google
          </button>

          <button
            type="button"
            disabled
            title="Apple sign-in coming soon"
            className="flex items-center justify-center gap-2.5 h-11 rounded-xl border border-border bg-wld-white text-[13px] font-medium text-wld-ink opacity-40 cursor-not-allowed"
          >
            <AppleIcon />
            Apple
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-muted uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

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
            {loading ? 'Creating account…' : 'Create account with email'}
          </button>
        </form>

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
