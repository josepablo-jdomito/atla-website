'use client'

import { useEffect } from 'react'
import { trackArticleView } from '@/lib/utils/analytics'

interface ArticleTrackerProps {
  slug: string
  category: string
}

export function ArticleTracker({ slug, category }: ArticleTrackerProps) {
  useEffect(() => {
    trackArticleView(slug, category)
  }, [slug, category])

  return null
}
