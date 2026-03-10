'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

function Avatar({ src, name, size = 28 }: { src?: string | null; name?: string | null; size?: number }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  if (src) {
    return (
      <div
        className="rounded-full overflow-hidden border border-border shrink-0"
        style={{ width: size, height: size }}
      >
        <Image src={src} alt={name ?? ''} width={size} height={size} className="object-cover" />
      </div>
    )
  }

  return (
    <div
      className="rounded-full bg-wld-ink text-wld-paper flex items-center justify-center shrink-0 text-[10px] font-medium"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  )
}

export function AuthNav() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (status === 'loading') {
    return <div className="h-8 w-20 rounded-full bg-[rgb(var(--wld-ink-rgb)/0.07)] animate-pulse" />
  }

  if (session?.user) {
    return (
      <div className="space-y-1.5">
        <Link
          href="/profile"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[rgb(var(--wld-ink-rgb)/0.05)] transition-colors group"
        >
          <Avatar src={session.user.image} name={session.user.name} />
          <span className="text-[12px] text-wld-ink truncate group-hover:text-wld-blue transition-colors">
            {session.user.name || session.user.email}
          </span>
        </Link>
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
