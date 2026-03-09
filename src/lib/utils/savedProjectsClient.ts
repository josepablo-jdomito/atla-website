'use client'

let savedIds = new Set<string>()
let hasHydrated = false
let hydratePromise: Promise<void> | null = null
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function readLocal() {
  try {
    const raw = localStorage.getItem('wld_saved_projects')
    const ids = raw ? (JSON.parse(raw) as string[]) : []
    savedIds = new Set(ids)
  } catch {
    savedIds = new Set()
  }
}

function writeLocal() {
  localStorage.setItem('wld_saved_projects', JSON.stringify(Array.from(savedIds)))
}

async function hydrateFromApi() {
  if (hasHydrated) return
  if (hydratePromise) return hydratePromise

  hydratePromise = (async () => {
    readLocal()
    emit()
    try {
      const res = await fetch('/api/saved-projects', { credentials: 'include' })
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data.savedProjectIds)) {
        savedIds = new Set(data.savedProjectIds.filter((id: unknown): id is string => typeof id === 'string'))
        writeLocal()
        emit()
      }
    } finally {
      hasHydrated = true
      hydratePromise = null
    }
  })()

  return hydratePromise
}

export function subscribeSavedProjects(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function isProjectSaved(projectId: string) {
  return savedIds.has(projectId)
}

export async function initSavedProjects() {
  await hydrateFromApi()
}

export async function toggleSavedProject(projectId: string) {
  await hydrateFromApi()
  const isSaved = savedIds.has(projectId)

  if (isSaved) {
    savedIds.delete(projectId)
    writeLocal()
    emit()

    const res = await fetch(`/api/saved-projects?projectId=${encodeURIComponent(projectId)}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) {
      savedIds.add(projectId)
      writeLocal()
      emit()
    }
    return
  }

  savedIds.add(projectId)
  writeLocal()
  emit()

  const res = await fetch('/api/saved-projects', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId }),
  })
  if (!res.ok) {
    savedIds.delete(projectId)
    writeLocal()
    emit()
  }
}
