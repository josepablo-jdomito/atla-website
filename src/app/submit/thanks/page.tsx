'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { trackSubmitSuccess } from '@/lib/utils/analytics'

export default function SubmitThanksPage() {
  useEffect(() => {
    trackSubmitSuccess()
  }, [])

  return (
    <div className="max-w-container mx-auto px-5 py-20">
      <div className="max-w-[480px] mx-auto text-center">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-4">
          Submission received
        </h1>
        <p className="text-[16px] leading-relaxed text-muted mb-8">
          Thanks for sharing your work with us. We review submissions weekly and will reach
          out within 7–14 days if your project is selected.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 text-[14px] font-medium bg-wld-ink text-white rounded-full hover:bg-wld-blue transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/newsletter"
            className="px-5 py-2.5 text-[14px] font-medium border border-border rounded-full hover:border-wld-ink transition-colors"
          >
            Subscribe to updates
          </Link>
        </div>
      </div>
    </div>
  )
}
