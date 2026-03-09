'use client'

import { useEffect, useState } from 'react'
import {
  initSavedProjects,
  isProjectSaved,
  subscribeSavedProjects,
  toggleSavedProject,
} from '@/lib/utils/savedProjectsClient'

interface SaveButtonProps {
  projectId: string
  className?: string
  preventLinkNavigation?: boolean
}

export function SaveButton({
  projectId,
  className = '',
  preventLinkNavigation = true,
}: SaveButtonProps) {
  const [saved, setSaved] = useState(false)
  const [isBusy, setIsBusy] = useState(false)

  useEffect(() => {
    let mounted = true
    initSavedProjects().then(() => {
      if (mounted) setSaved(isProjectSaved(projectId))
    })

    const unsub = subscribeSavedProjects(() => {
      setSaved(isProjectSaved(projectId))
    })

    return () => {
      mounted = false
      unsub()
    }
  }, [projectId])

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (preventLinkNavigation) {
      event.preventDefault()
      event.stopPropagation()
    }
    if (isBusy) return
    setIsBusy(true)
    await toggleSavedProject(projectId)
    setIsBusy(false)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isBusy}
      className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide rounded-full border transition-colors ${
        saved
          ? 'bg-wld-ink text-white border-wld-ink'
          : 'bg-white text-wld-ink border-border hover:border-wld-ink'
      } ${className}`}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved projects' : 'Save project'}
    >
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
