import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity/client'
import {
  loadMorePostsQuery,
  loadMoreProjectOnlyQuery,
  loadMoreArticlesQuery,
  categoryLoadMoreQuery,
} from '@/lib/sanity/queries'
import type { PostCard } from '@/types'

type FeedMode = 'all' | 'projectOnly' | 'articleOnly' | 'category'

const QUERY_BY_MODE: Record<Exclude<FeedMode, 'category'>, string> = {
  all: loadMorePostsQuery,
  projectOnly: loadMoreProjectOnlyQuery,
  articleOnly: loadMoreArticlesQuery,
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = (searchParams.get('mode') || 'all') as FeedMode
  const lastPublishedAt = searchParams.get('lastPublishedAt')
  const lastId = searchParams.get('lastId')
  const categorySlug = searchParams.get('categorySlug')

  if (!lastPublishedAt || !lastId) {
    return NextResponse.json({ error: 'Missing pagination cursor.' }, { status: 400 })
  }

  if (mode === 'category' && !categorySlug) {
    return NextResponse.json({ error: 'Missing categorySlug for category mode.' }, { status: 400 })
  }

  const query = mode === 'category' ? categoryLoadMoreQuery : QUERY_BY_MODE[mode] || loadMorePostsQuery
  const params =
    mode === 'category'
      ? { lastPublishedAt, lastId, categorySlug: categorySlug as string }
      : { lastPublishedAt, lastId }

  const posts = await client.fetch<PostCard[]>(query, params)
  return NextResponse.json(posts)
}
