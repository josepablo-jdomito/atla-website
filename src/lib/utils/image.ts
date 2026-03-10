import type { SanityImage } from '@/types'

interface BuildImageOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpg' | 'png'
}

export function buildSanityImageUrl(image: SanityImage, options: BuildImageOptions = {}): string {
  const source = image.asset?.url || ''
  if (!source) return ''

  try {
    const url = new URL(source)
    const { width, height, quality = 82, format = 'webp' } = options
    if (width) url.searchParams.set('w', String(width))
    if (height) url.searchParams.set('h', String(height))
    if (width || height) url.searchParams.set('fit', 'crop')
    url.searchParams.set('q', String(quality))
    url.searchParams.set('fm', format)
    url.searchParams.set('auto', 'format')
    return url.toString()
  } catch {
    return source
  }
}
