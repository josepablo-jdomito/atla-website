import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db/postgres'

const FORMATS = ['sponsored-article', 'newsletter', 'brand-partnership', 'event', 'other'] as const
const BUDGETS = ['under-5k', '5k-15k', '15k-50k', '50k-plus', 'not-sure'] as const

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))

  const name    = typeof body.name    === 'string' ? body.name.trim().slice(0, 120)    : ''
  const email   = typeof body.email   === 'string' ? body.email.trim().slice(0, 254)   : ''
  const company = typeof body.company === 'string' ? body.company.trim().slice(0, 160)  : ''
  const website = typeof body.website === 'string' ? body.website.trim().slice(0, 500)  : ''
  const format  = typeof body.format  === 'string' ? body.format.trim()                : ''
  const budget  = typeof body.budget  === 'string' ? body.budget.trim()                : ''
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 4000) : ''

  if (!name || !email || !company || !message) {
    return NextResponse.json({ error: 'Name, email, company, and message are required.' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (!FORMATS.includes(format as typeof FORMATS[number])) {
    return NextResponse.json({ error: 'Invalid format selection.' }, { status: 400 })
  }

  const pool = getPool()
  await pool.query(
    `INSERT INTO advertise_submissions (name, email, company, website, format, budget, message)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [name, email, company, website || null, format, budget || null, message],
  )

  return NextResponse.json({ ok: true })
}
