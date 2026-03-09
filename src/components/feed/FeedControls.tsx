'use client'

export type ViewMode = 'grid' | 'list'

interface FeedControlsProps {
  view: ViewMode
  onViewChange: (view: ViewMode) => void
  resultCount?: number
}

export function FeedControls({
  view,
  onViewChange,
  resultCount,
}: FeedControlsProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-4">
        {resultCount !== undefined && (
          <span className="text-[13px] text-muted">
            {resultCount} project{resultCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 px-4 py-2 rounded-md bg-card border border-border">
        <span className="text-[18px] md:text-[22px] font-medium text-wld-ink">View</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewChange('grid')}
            className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center transition-colors ${
              view === 'grid'
                ? 'bg-wld-ink text-white'
                : 'bg-[rgb(var(--wld-ink-rgb)/0.08)] text-[rgb(var(--wld-ink-rgb)/0.22)] hover:text-wld-ink'
            }`}
            aria-label="Grid view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="6" height="6" rx="1" />
              <rect x="9" y="1" width="6" height="6" rx="1" />
              <rect x="1" y="9" width="6" height="6" rx="1" />
              <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center transition-colors ${
              view === 'list'
                ? 'bg-wld-ink text-white'
                : 'bg-[rgb(var(--wld-ink-rgb)/0.08)] text-[rgb(var(--wld-ink-rgb)/0.22)] hover:text-wld-ink'
            }`}
            aria-label="List view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="2" y="2" width="12" height="12" rx="1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
