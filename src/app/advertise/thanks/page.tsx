'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { trackAdvertiseSuccess } from '@/lib/utils/analytics'

export default function AdvertiseThanksPage() {
  useEffect(() => {
    trackAdvertiseSuccess()
  }, [])

  return (
    <div className="max-w-container mx-auto px-5 py-20">
      <div className="max-w-[480px] mx-auto text-center">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-4">
          We got your inquiry
        </h1>
        <p className="text-[16px] leading-relaxed text-muted mb-8">
          Thanks for your interest in partnering with welove. We&rsquo;ll review your
          details and get back to you within 48 hours with a media kit and next steps.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 text-[14px] font-medium bg-wld-ink text-white rounded-full hover:bg-wld-blue transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
