import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getPool } from '@/lib/db/postgres'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const pool = getPool()
  const result = await pool.query(
    'SELECT id, name, email, image, bio FROM users WHERE id = $1',
    [session.user.id],
  )

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : undefined
  const bio = typeof body.bio === 'string' ? body.bio.trim().slice(0, 500) : undefined

  if (name === undefined && bio === undefined) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const updates: string[] = []
  const values: (string | undefined)[] = []
  let idx = 1

  if (name !== undefined) {
    updates.push(`name = $${idx++}`)
    values.push(name || null)
  }
  if (bio !== undefined) {
    updates.push(`bio = $${idx++}`)
    values.push(bio || null)
  }
  values.push(session.user.id)

  const pool = getPool()
  const result = await pool.query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx} RETURNING id, name, email, image, bio`,
    values,
  )

  return NextResponse.json(result.rows[0])
}
