'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { PostCard } from '@/components/cards/PostCard'
import { PostCardRow } from '@/components/cards/PostCardRow'
import type { PostCard as PostCardType } from '@/types'

interface ProfileUser {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
}

interface ProfileClientProps {
  initialUser: ProfileUser
  savedPosts: PostCardType[]
}

type Tab = 'profile' | 'saved'

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
      <rect x="0" y="0" width="4" height="4" rx="0.5" />
      <rect x="6" y="0" width="4" height="4" rx="0.5" />
      <rect x="0" y="6" width="4" height="4" rx="0.5" />
      <rect x="6" y="6" width="4" height="4" rx="0.5" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 10 8" fill="currentColor" aria-hidden>
      <rect x="0" y="0" width="10" height="1.5" rx="0.5" />
      <rect x="0" y="3.25" width="10" height="1.5" rx="0.5" />
      <rect x="0" y="6.5" width="10" height="1.5" rx="0.5" />
    </svg>
  )
}

function Avatar({ src, name, size = 80 }: { src: string | null; name: string | null; size?: number }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  if (src) {
    return (
      <div
        className="rounded-full overflow-hidden bg-wld-paper border border-border shrink-0"
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={name ?? 'Profile photo'}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      </div>
    )
  }

  return (
    <div
      className="rounded-full bg-wld-ink text-wld-paper flex items-center justify-center shrink-0 font-medium"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  )
}

export function ProfileClient({ initialUser, savedPosts }: ProfileClientProps) {
  const { update: updateSession } = useSession()
  const [user, setUser] = useState(initialUser)
  const [tab, setTab] = useState<Tab>('profile')
  const [name, setName] = useState(user.name ?? '')
  const [bio, setBio] = useState(user.bio ?? '')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [savedView, setSavedView] = useState<'grid' | 'list'>('grid')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSaveProfile() {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), bio: bio.trim() }),
      })
      if (!res.ok) throw new Error('Save failed')
      const updated = await res.json()
      setUser(u => ({ ...u, name: updated.name, bio: updated.bio }))
      await updateSession({ name: updated.name })
      setSaveMsg('Saved')
      setEditing(false)
    } catch {
      setSaveMsg('Could not save. Try again.')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(''), 3000)
    }
  }

  function handleCancelEdit() {
    setName(user.name ?? '')
    setBio(user.bio ?? '')
    setEditing(false)
  }

  async function handleAvatarChange(file: File) {
    setUploading(true)
    setUploadError('')
    const form = new FormData()
    form.append('avatar', file)
    try {
      const res = await fetch('/api/profile/avatar', { method: 'POST', body: form })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Upload failed')
      }
      const { imageUrl } = await res.json()
      setUser(u => ({ ...u, image: imageUrl }))
      await updateSession({ image: imageUrl })
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleAvatarChange(file)
    e.target.value = ''
  }

  return (
    <div className="max-w-container mx-auto px-5 py-10">

      {/* Header row */}
      <div className="flex items-start gap-5 mb-8">
        {/* Avatar */}
        <div className="relative group shrink-0">
          <Avatar src={user.image} name={user.name} size={80} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            aria-label="Upload profile photo"
            className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-wait text-white"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <CameraIcon />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
        </div>

        {/* Name + email */}
        <div className="min-w-0 pt-1">
          <h1 className="font-display text-[24px] md:text-[30px] leading-tight text-wld-ink truncate">
            {user.name || user.email}
          </h1>
          <p className="text-[13px] text-muted mt-0.5">{user.email}</p>
          {uploadError && (
            <p className="text-[12px] text-red-600 mt-1">{uploadError}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border mb-8">
        {(['profile', 'saved'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-[13px] font-medium capitalize border-b-2 transition-colors -mb-px ${
              tab === t
                ? 'border-wld-ink text-wld-ink'
                : 'border-transparent text-muted hover:text-wld-ink'
            }`}
          >
            {t === 'saved' ? `Saved (${savedPosts.length})` : 'Profile'}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === 'profile' && (
        <div className="max-w-[520px] space-y-6">
          {/* Photo upload hint */}
          <div className="text-[12px] text-muted">
            Click your avatar above to upload a profile photo (JPEG, PNG, WebP — max 5 MB).
          </div>

          {/* Display name */}
          <div>
            <label htmlFor="profile-name" className="block text-[12px] font-medium text-wld-ink mb-2">
              Display name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setEditing(true) }}
              maxLength={100}
              placeholder="Your name"
              className="w-full rounded-xl border border-border bg-wld-white px-4 py-3 text-[14px] text-wld-ink placeholder-muted focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-[12px] font-medium text-wld-ink mb-2">
              Email address
            </label>
            <div className="w-full rounded-xl border border-border bg-wld-paper px-4 py-3 text-[14px] text-muted select-all">
              {user.email}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="profile-bio" className="block text-[12px] font-medium text-wld-ink mb-2">
              Bio <span className="text-muted font-normal">(optional)</span>
            </label>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={e => { setBio(e.target.value); setEditing(true) }}
              maxLength={500}
              rows={4}
              placeholder="A few words about yourself…"
              className="w-full rounded-xl border border-border bg-wld-white px-4 py-3 text-[14px] text-wld-ink placeholder-muted focus:outline-none focus:border-[rgb(var(--wld-ink-rgb)/0.4)] transition-colors resize-none"
            />
            <p className="text-[11px] text-muted mt-1 text-right">{bio.length}/500</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSaveProfile}
              disabled={saving || !editing}
              className="h-10 px-6 rounded-full bg-wld-ink text-wld-paper text-[13px] font-medium hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {editing && (
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="h-10 px-4 rounded-full border border-border text-[13px] text-muted hover:text-wld-ink hover:border-wld-ink transition-colors"
              >
                Cancel
              </button>
            )}
            {saveMsg && (
              <span className={`text-[13px] ${saveMsg === 'Saved' ? 'text-green-600' : 'text-red-600'}`}>
                {saveMsg}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Saved tab */}
      {tab === 'saved' && (
        <div>
          {savedPosts.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="text-[15px] text-wld-ink">No saved posts yet.</p>
              <p className="text-[13px] text-muted">
                Hit the bookmark icon on any project or article to save it here.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[13px] text-wld-blue hover:underline"
              >
                Browse the feed →
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-[13px] text-muted">
                  {savedPosts.length} saved post{savedPosts.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center h-7 rounded-full border border-border overflow-hidden">
                  <button
                    onClick={() => setSavedView('grid')}
                    aria-label="Grid view"
                    className={`w-8 h-full flex items-center justify-center transition-colors ${
                      savedView === 'grid' ? 'bg-wld-ink text-wld-paper' : 'text-muted hover:text-wld-ink'
                    }`}
                  >
                    <GridIcon />
                  </button>
                  <button
                    onClick={() => setSavedView('list')}
                    aria-label="List view"
                    className={`w-8 h-full flex items-center justify-center border-l border-border transition-colors ${
                      savedView === 'list' ? 'bg-wld-ink text-wld-paper' : 'text-muted hover:text-wld-ink'
                    }`}
                  >
                    <ListIcon />
                  </button>
                </div>
              </div>

              {savedView === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {savedPosts.map((post, i) => (
                    <PostCard key={post._id} post={post} priority={i < 3} />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {savedPosts.map(post => (
                    <PostCardRow key={post._id} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
