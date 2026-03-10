import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db/postgres'

const SUBJECTS = ['editorial', 'sponsorship', 'partnership', 'general'] as const

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))

  const name    = typeof body.name    === 'string' ? body.name.trim().slice(0, 120)    : ''
  const email   = typeof body.email   === 'string' ? body.email.trim().slice(0, 254)   : ''
  const subject = typeof body.subject === 'string' ? body.subject.trim()               : ''
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 4000) : ''

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (!SUBJECTS.includes(subject as typeof SUBJECTS[number])) {
    return NextResponse.json({ error: 'Invalid subject.' }, { status: 400 })
  }

  const pool = getPool()
  await pool.query(
    `INSERT INTO contact_submissions (name, email, subject, message)
     VALUES ($1, $2, $3, $4)`,
    [name, email, subject, message],
  )

  return NextResponse.json({ ok: true })
}
