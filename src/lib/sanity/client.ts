import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-01-01'

type SanityClient = ReturnType<typeof createClient>

function assertSanityConfig() {
  if (!projectId) {
    throw new Error(
      'Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Set it in your environment before using Sanity clients.'
    )
  }
}

function getProjectId(): string {
  assertSanityConfig()
  return projectId
}

let publishedClientInstance: SanityClient | null = null
let previewClientInstance: SanityClient | null = null

function getPublishedClient(): SanityClient {
  if (publishedClientInstance) return publishedClientInstance
  const resolvedProjectId = getProjectId()
  publishedClientInstance = createClient({
    projectId: resolvedProjectId,
    dataset,
    apiVersion,
    useCdn: true,
  })
  return publishedClientInstance
}

function getPreviewClientInstance(): SanityClient {
  if (previewClientInstance) return previewClientInstance
  const resolvedProjectId = getProjectId()
  previewClientInstance = createClient({
    projectId: resolvedProjectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  })
  return previewClientInstance
}

function createLazyClient(getter: () => SanityClient): SanityClient {
  return new Proxy({} as SanityClient, {
    get(_target, prop) {
      const realClient = getter()
      const value = Reflect.get(realClient, prop)
      return typeof value === 'function' ? value.bind(realClient) : value
    },
  })
}

/** CDN client for published content (server components) */
export const client = createLazyClient(getPublishedClient)

/** Non-CDN client for mutations, preview, webhooks */
export const previewClient = createLazyClient(getPreviewClientInstance)

export function urlFor(source: SanityImageSource) {
  const resolvedProjectId = getProjectId()
  const builder = imageUrlBuilder({
    projectId: resolvedProjectId,
    dataset,
  })
  return builder.image(source).auto('format')
}

/** Get client based on preview mode */
export function getClient(preview = false) {
  return preview ? previewClient : client
}
