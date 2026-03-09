import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/config/site'

const DEFAULT_DESCRIPTION =
  'The global platform for consumer brand design. Curated identities, packaging, rebrands, and brand strategy - for founders, CMOs, and creative directors.'

interface MetadataParams {
  title?: string
  description?: string
  path?: string
  ogImage?: string
  noIndex?: boolean
}

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  ogImage,
  noIndex = false,
}: MetadataParams = {}): Metadata {
  const pageTitle = title || SITE_NAME
  const url = absoluteUrl(path || '/')
  const image = ogImage || absoluteUrl('/og-default.jpg')

  return {
    title: pageTitle,
    description,
    metadataBase: SITE_URL,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}
