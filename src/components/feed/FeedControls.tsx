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

      <div className="flex items-center gap-3">
        {/* View toggle */}
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => onViewChange('grid')}
            className={`p-1.5 transition-colors ${
              view === 'grid' ? 'bg-wld-ink text-white' : 'text-muted hover:text-wld-ink'
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
            className={`p-1.5 transition-colors ${
              view === 'list' ? 'bg-wld-ink text-white' : 'text-muted hover:text-wld-ink'
            }`}
            aria-label="List view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="2" width="14" height="2.5" rx="0.5" />
              <rect x="1" y="6.75" width="14" height="2.5" rx="0.5" />
              <rect x="1" y="11.5" width="14" height="2.5" rx="0.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
