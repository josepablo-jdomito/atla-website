import type { PostCard } from '@/types'

const ARTICLE_CATEGORY_MATCHERS = [
  'brand-breakdown',
  'cult-brand-index',
  'the-definition',
  'industry-signal',
  'breakdown',
  'essay',
  'article',
]

export function isArticlePost(post: Pick<PostCard, 'category'>): boolean {
  const slug = post.category?.slug?.toLowerCase() || ''
  const name = post.category?.name?.toLowerCase() || ''

  return ARTICLE_CATEGORY_MATCHERS.some(
    (matcher) => slug.includes(matcher) || name.includes(matcher)
  )
}

export function splitPostsByContentType(posts: PostCard[]) {
  const articles: PostCard[] = []
  const projects: PostCard[] = []

  for (const post of posts) {
    if (isArticlePost(post)) {
      articles.push(post)
    } else {
      projects.push(post)
    }
  }

  return { articles, projects }
}
