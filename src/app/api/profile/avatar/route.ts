import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getPool } from '@/lib/db/postgres'
import { createClient } from '@sanity/client'

const uploadClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData().catch(() => null)
  if (!formData) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('avatar') as File | null
  if (!file || !file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const asset = await uploadClient.assets.upload('image', buffer, {
    filename: `avatar-${session.user.id}`,
    contentType: file.type,
  })

  const imageUrl = asset.url

  const pool = getPool()
  await pool.query('UPDATE users SET image = $1 WHERE id = $2', [imageUrl, session.user.id])

  return NextResponse.json({ imageUrl })
}
