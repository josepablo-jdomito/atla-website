'use client'

import { useState } from 'react'
import type { FaqGroup } from '@/types'

interface FaqAccordionProps {
  groups: FaqGroup[]
}

export function FaqAccordion({ groups }: FaqAccordionProps) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.title} className="space-y-3">
          <h3 className="text-[13px] font-medium uppercase tracking-wider text-muted">
            {group.title}
          </h3>
          <div className="border border-border rounded-card overflow-hidden divide-y divide-border">
            {group.items.map((item) => (
              <AccordionItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-wld-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-150 hover:bg-wld-paper/50"
        aria-expanded={isOpen}
      >
        <span className="text-[15px] font-medium text-wld-ink pr-4">{question}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`shrink-0 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-5 pb-4 text-[14px] leading-relaxed text-muted">{answer}</p>
      </div>
    </div>
  )
}
