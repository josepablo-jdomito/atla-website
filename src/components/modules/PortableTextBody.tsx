import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'

interface PortableTextBodyProps {
  value: any[]
}

function sanitizeHref(href: unknown): string | null {
  if (typeof href !== 'string') return null
  const trimmed = href.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:') {
      return parsed.toString()
    }
  } catch {
    return null
  }

  return null
}

const components = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset) return null
      const imageUrl = urlFor(value).width(1200).format('webp').quality(90).url()

      return (
        <figure className="my-8">
          <div className="relative w-full">
            <Image
              src={imageUrl}
              alt={value.alt || ''}
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg"
              sizes="(max-width: 720px) 100vw, 720px"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-[13px] text-muted text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="font-display text-[24px] leading-tight text-wld-ink mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-primary text-[20px] font-semibold text-wld-ink mt-8 mb-3">{children}</h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-2 border-wld-blue pl-5 my-6 italic text-muted">{children}</blockquote>
    ),
    normal: ({ children }: any) => (
      <p className="text-[16px] leading-[1.75] text-wld-ink mb-5">{children}</p>
    ),
  },
  marks: {
    link: ({ children, value }: any) => {
      const href = sanitizeHref(value?.href)
      if (!href) return <>{children}</>
      const isExternal = href.startsWith('http://') || href.startsWith('https://')

      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-wld-blue underline underline-offset-2 hover:no-underline"
        >
          {children}
        </a>
      )
    },
  },
}

export function PortableTextBody({ value }: PortableTextBodyProps) {
  return (
    <div className="max-w-article mx-auto">
      <PortableText value={value} components={components} />
    </div>
  )
}
