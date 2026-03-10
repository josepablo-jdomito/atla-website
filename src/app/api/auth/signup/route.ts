import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getPool } from '@/lib/db/postgres'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { email, password, name } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const hashed = await bcrypt.hash(password, 12)

    const pool = getPool()
    try {
      const result = await pool.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
        [normalizedEmail, hashed, name || null]
      )
      return NextResponse.json({ success: true, user: result.rows[0] }, { status: 201 })
    } catch (err: any) {
      if (err.code === '23505') {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
      }
      throw err
    }
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Something went wrong, please try again' }, { status: 500 })
  }
}
