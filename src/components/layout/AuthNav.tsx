'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AuthNav() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (status === 'loading') {
    return <div className="h-8 w-20 rounded-full bg-[rgb(var(--wld-ink-rgb)/0.07)] animate-pulse" />
  }

  if (session?.user) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted px-3 truncate">
          {session.user.name || session.user.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-medium rounded-full border border-border text-muted hover:text-wld-ink hover:border-wld-ink transition-colors"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <Link
      href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-medium rounded-full border border-border text-muted hover:text-wld-ink hover:border-wld-ink transition-colors"
    >
      Sign in
    </Link>
  )
}
