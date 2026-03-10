import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getPool } from '@/lib/db/postgres'
import { previewClient } from '@/lib/sanity/client'
import { savedPostsByUserQuery } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/utils/metadata'
import { ProfileClient } from './ProfileClient'
import type { PostCard } from '@/types'

export const metadata = buildMetadata({
  title: 'My Profile',
  description: 'Edit your profile and view saved posts.',
  path: '/profile',
})

interface SavedPostRow {
  saved_at: string
  post: PostCard
}

interface UserRow {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/profile')
  }

  const pool = getPool()
  const userResult = await pool.query<UserRow>(
    'SELECT id, name, email, image, bio FROM users WHERE id = $1',
    [session.user.id],
  )
  const user = userResult.rows[0]
  if (!user) redirect('/login')

  const userId = `auth:${session.user.id}`
  const savedRows = await previewClient
    .fetch<SavedPostRow[]>(savedPostsByUserQuery, { userId })
    .catch(() => [])

  const savedPosts = savedRows.map((r) => r.post).filter(Boolean)

  return (
    <ProfileClient
      initialUser={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        bio: user.bio,
      }}
      savedPosts={savedPosts}
    />
  )
}
