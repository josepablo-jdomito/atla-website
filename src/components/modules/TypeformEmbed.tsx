'use client'

import { useEffect, useRef, useState } from 'react'

interface TypeformEmbedProps {
  formId: string
  height?: number
}

export function TypeformEmbed({ formId, height = 500 }: TypeformEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || isLoaded) return
    const script = document.createElement('script')
    script.src = 'https://embed.typeform.com/next/embed.js'
    script.async = true
    script.onload = () => setIsLoaded(true)
    document.body.appendChild(script)
  }, [isVisible, isLoaded])

  return (
    <div ref={containerRef} className="w-full" style={{ minHeight: height }}>
      {isVisible ? (
        <div
          data-tf-live={formId}
          data-tf-hide-headers="true"
          data-tf-hide-footer="true"
          style={{ width: '100%', height }}
        />
      ) : (
        <div
          className="w-full rounded-card bg-wld-white border border-border animate-pulse"
          style={{ height }}
        />
      )}
    </div>
  )
}
