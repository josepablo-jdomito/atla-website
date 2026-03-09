import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-01-01'

/** CDN client for published content (server components) */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

/** Non-CDN client for mutations, preview, webhooks */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

/** Image URL builder */
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/** Get client based on preview mode */
export function getClient(preview = false) {
  return preview ? previewClient : client
}
