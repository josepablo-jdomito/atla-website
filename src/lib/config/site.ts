const DEFAULT_PRODUCTION_SITE_URL = 'https://welovedaily.com'

function normalizeOrigin(url: string): string {
  return url.replace(/\/+$/, '')
}

function toPublicUrl(value?: string): string | null {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return normalizeOrigin(value)
  return normalizeOrigin(`https://${value}`)
}

function resolveSiteOrigin(): string {
  const explicit = toPublicUrl(process.env.NEXT_PUBLIC_SITE_URL)
  if (explicit) return explicit

  const isProduction = process.env.VERCEL_ENV === 'production'
  const production = toPublicUrl(process.env.NEXT_PUBLIC_SITE_URL_PRODUCTION) || DEFAULT_PRODUCTION_SITE_URL
  const staging =
    toPublicUrl(process.env.NEXT_PUBLIC_SITE_URL_STAGING) ||
    toPublicUrl(process.env.VERCEL_URL) ||
    production

  return isProduction ? production : staging
}

export const SITE_NAME = 'WeLoveDaily'
export const SITE_ORIGIN = resolveSiteOrigin()
export const SITE_URL = new URL(SITE_ORIGIN)

export function absoluteUrl(path = '/'): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return new URL(normalizedPath, SITE_URL).toString()
}
