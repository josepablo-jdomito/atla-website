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
      <div className="max-w-[640px] mx-auto text-center">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-4">Received.</h1>
        <p className="text-[16px] leading-relaxed text-muted mb-8">
          We review every submission. If your work is selected, you&apos;ll hear from us within 5 to 7
          business days. If it isn&apos;t, we won&apos;t follow up - but you&apos;re welcome to submit again.
        </p>
        <p className="text-[15px] text-muted mb-8">
          Your submission is under review. We&apos;ll be in touch within 5-7 business days if your work
          is selected.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/projects"
            className="px-5 py-2.5 text-[14px] font-medium bg-wld-ink text-white rounded-full hover:bg-wld-blue transition-colors"
          >
            Back to projects -&gt;
          </Link>
          <Link
            href="/categories"
            className="px-5 py-2.5 text-[14px] font-medium border border-border rounded-full hover:border-wld-ink transition-colors"
          >
            Browse categories -&gt;
          </Link>
        </div>
      </div>
    </div>
  )
}
