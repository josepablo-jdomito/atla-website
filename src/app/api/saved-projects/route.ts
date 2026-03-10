import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { previewClient } from '@/lib/sanity/client'
import {
  addSavedProject,
  getSavedProjectsByUser,
  removeSavedProject,
} from '@/lib/db/savedProjects'
import { auth } from '@/auth'

const COOKIE_NAME = 'wld_user_id'

async function resolveUserId(req: NextRequest): Promise<{ userId: string; isNew: boolean; isAuthenticated: boolean }> {
  const session = await auth()
  if (session?.user?.id) {
    return { userId: `auth:${session.user.id}`, isNew: false, isAuthenticated: true }
  }
  const existing = req.cookies.get(COOKIE_NAME)?.value
  if (existing) return { userId: existing, isNew: false, isAuthenticated: false }
  return { userId: randomUUID(), isNew: true, isAuthenticated: false }
}

function withUserCookie(response: NextResponse, userId: string, isNew: boolean, isAuthenticated: boolean) {
  if (!isNew || isAuthenticated) return response
  response.cookies.set(COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
  return response
}

async function adjustSaveCount(projectId: string, delta: 1 | -1) {
  if (!process.env.SANITY_API_TOKEN) return
  try {
    await previewClient
      .patch(projectId)
      .setIfMissing({ saveCount: 0 })
      .inc({ saveCount: delta })
      .commit()
  } catch {
    // Non-blocking: save state is still persisted in saved_projects.
  }
}

export async function GET(req: NextRequest) {
  const { userId, isNew, isAuthenticated } = await resolveUserId(req)
  const rows = await getSavedProjectsByUser(userId)
  const response = NextResponse.json({
    userId,
    savedProjectIds: rows.map((row) => row.project_id),
  })
  return withUserCookie(response, userId, isNew, isAuthenticated)
}

export async function POST(req: NextRequest) {
  const { userId, isNew, isAuthenticated } = await resolveUserId(req)
  const body = await req.json().catch(() => ({}))
  const projectId = typeof body?.projectId === 'string' ? body.projectId : ''

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
  }

  const inserted = await addSavedProject(userId, projectId)
  if (inserted) await adjustSaveCount(projectId, 1)

  const rows = await getSavedProjectsByUser(userId)
  const response = NextResponse.json({
    success: true,
    userId,
    savedProjectIds: rows.map((row) => row.project_id),
  })
  return withUserCookie(response, userId, isNew, isAuthenticated)
}

export async function DELETE(req: NextRequest) {
  const { userId, isNew, isAuthenticated } = await resolveUserId(req)
  const projectId = req.nextUrl.searchParams.get('projectId') || ''

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
  }

  const removed = await removeSavedProject(userId, projectId)
  if (removed) await adjustSaveCount(projectId, -1)

  const rows = await getSavedProjectsByUser(userId)
  const response = NextResponse.json({
    success: true,
    userId,
    savedProjectIds: rows.map((row) => row.project_id),
  })
  return withUserCookie(response, userId, isNew, isAuthenticated)
}
