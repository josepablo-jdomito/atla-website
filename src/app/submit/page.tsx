import { FaqAccordion } from '@/components/modules/FaqAccordion'
import { ProjectSubmissionForm } from '@/components/forms/ProjectSubmissionForm'
import { submitFaqGroups } from '@/data/faq'
import { buildMetadata } from '@/lib/utils/metadata'
import { client } from '@/lib/sanity/client'
import { allCategoriesQuery } from '@/lib/sanity/queries'
import type { Category } from '@/types'

export const metadata = buildMetadata({
  title: 'Submit a Project',
  description:
    'Submit your branding, design, or creative project for editorial review on WeLoveDaily.',
  path: '/submit',
})

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Submitted',
    description: 'Studios submit project details, team credits, and high-resolution images.',
  },
  {
    number: '02',
    title: 'Review',
    description: 'Editors evaluate quality, originality, and fit for category coverage.',
  },
  {
    number: '03',
    title: 'Approved',
    description: 'Accepted submissions are prepared with final metadata and layout.',
  },
  {
    number: '04',
    title: 'Published',
    description: 'Projects are published to homepage, category pages, and search.',
  },
]

export default async function SubmitPage() {
  const categories = await client.fetch<Category[]>(allCategoriesQuery)

  return (
    <div className="max-w-container mx-auto px-5 py-10">
      <header className="max-w-article mx-auto text-center mb-12">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-4">
          Submit a Project
        </h1>
        <p className="text-[16px] leading-relaxed text-muted max-w-[560px] mx-auto">
          Built for studios: submit once, then move through a structured editorial pipeline from
          Submitted to Published.
        </p>
      </header>

      <section className="max-w-article mx-auto mb-12">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-6">
          Workflow
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PROCESS_STEPS.map((step) => (
            <div key={step.number} className="p-4 rounded-card border border-border bg-card">
              <span className="text-[13px] font-medium text-wld-blue">{step.number}</span>
              <h3 className="text-[16px] font-semibold text-wld-ink mt-1">{step.title}</h3>
              <p className="text-[14px] leading-relaxed text-muted mt-1">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-article mx-auto mb-16">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4">
          Submission form
        </h2>
        <div className="p-5 rounded-card border border-border bg-card">
          <ProjectSubmissionForm categories={categories} />
        </div>
      </section>

      <section className="max-w-article mx-auto">
        <h2 className="text-[18px] font-semibold text-wld-ink mb-6">
          Frequently Asked Questions
        </h2>
        <FaqAccordion groups={submitFaqGroups} />
      </section>
    </div>
  )
}
