import { createHash } from 'node:crypto'
import { previewClient } from '@/lib/sanity/client'

export interface SavedProjectRow {
  user_id: string
  project_id: string
  created_at: string
}

const SAVED_PROJECTS_BY_USER_QUERY = `
  *[_type == "savedProject" && user_id == $userId]
    | order(created_at desc) {
      user_id,
      project_id,
      created_at
    }
`

function buildSavedProjectId(userId: string, projectId: string): string {
  const digest = createHash('sha256').update(`${userId}:${projectId}`).digest('hex')
  return `savedProject.${digest}`
}

export async function getSavedProjectsByUser(userId: string): Promise<SavedProjectRow[]> {
  if (!process.env.SANITY_API_TOKEN) return []
  return previewClient.fetch<SavedProjectRow[]>(SAVED_PROJECTS_BY_USER_QUERY, { userId })
}

export async function addSavedProject(userId: string, projectId: string): Promise<boolean> {
  if (!process.env.SANITY_API_TOKEN) return false
  const createdAt = new Date().toISOString()
  const documentId = buildSavedProjectId(userId, projectId)

  try {
    await previewClient.create({
      _id: documentId,
      _type: 'savedProject',
      user_id: userId,
      project_id: projectId,
      created_at: createdAt,
    })
    return true
  } catch (error: any) {
    if (error?.statusCode === 409) return false
    throw error
  }
}

export async function removeSavedProject(userId: string, projectId: string): Promise<boolean> {
  if (!process.env.SANITY_API_TOKEN) return false
  const documentId = buildSavedProjectId(userId, projectId)

  try {
    await previewClient.delete(documentId)
    return true
  } catch (error: any) {
    if (error?.statusCode === 404) return false
    throw error
  }
}
