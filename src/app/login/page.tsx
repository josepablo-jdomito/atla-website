'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/layout/Logo'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const registered = searchParams.get('registered')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
      return
    }

    router.push(callbackUrl)
    router.refresh()
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
          <h1 className="font-display text-[28px] leading-tight text-wld-ink">Welcome back</h1>
          <p className="mt-2 text-[13px] text-muted">Sign in to your account to continue</p>
        </div>

        {/* Success message */}
        {registered && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[13px] text-green-800">
            Account created — you can now sign in.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </div>
          )}

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
              autoComplete="current-password"
              className="w-full rounded-xl border border-border bg-wld-white px-4 py-3 text-[14px] text-wld-ink placeholder-muted focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-wld-ink text-wld-paper text-[13px] font-medium py-3 px-4 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-[13px] text-muted">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-wld-ink font-medium hover:text-wld-blue transition-colors underline underline-offset-2">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
