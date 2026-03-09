import { TypeformEmbed } from '@/components/modules/TypeformEmbed'
import { FaqAccordion } from '@/components/modules/FaqAccordion'
import { submitFaqGroups } from '@/data/faq'
import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'Submit a Project',
  description:
    'Submit your branding, design, or creative project for editorial review on WeLoveDaily.',
  path: '/submit',
})

const CHECKLIST = [
  '8+ high-resolution images (minimum 2000px wide)',
  'Project title and one-line description',
  'Full team credits (design, strategy, photo, dev, copy)',
  'Brief project background (2–4 sentences)',
  'Link to live project (if applicable)',
  'Google Drive or Dropbox folder with all assets',
]

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Submit',
    description: 'Fill out the form with your project details and asset links.',
  },
  {
    number: '02',
    title: 'Review',
    description: 'Our editorial team reviews submissions weekly against our standards.',
  },
  {
    number: '03',
    title: 'Publish',
    description: 'Selected projects are featured across our platforms with full credits.',
  },
]

export default function SubmitPage() {
  const formId = process.env.NEXT_PUBLIC_TYPEFORM_SUBMIT_ID || ''

  return (
    <div className="max-w-container mx-auto px-5 py-10">
      {/* Header */}
      <header className="max-w-article mx-auto text-center mb-12">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-4">
          Submit a Project
        </h1>
        <p className="text-[16px] leading-relaxed text-muted max-w-[480px] mx-auto">
          We feature the most compelling work in branding, design, and creative direction. If
          you&rsquo;ve built something worth studying, we want to see it.
        </p>
      </header>

      {/* How it works */}
      <section className="max-w-article mx-auto mb-12">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-6">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PROCESS_STEPS.map((step) => (
            <div key={step.number} className="space-y-2">
              <span className="text-[13px] font-medium text-wld-blue">{step.number}</span>
              <h3 className="text-[16px] font-semibold text-wld-ink">{step.title}</h3>
              <p className="text-[14px] leading-relaxed text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section className="max-w-article mx-auto mb-12">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4">
          Before you submit
        </h2>
        <div className="p-5 rounded-card border border-border bg-card">
          <ul className="space-y-3">
            {CHECKLIST.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-wld-ink">
                <span className="mt-0.5 w-4 h-4 shrink-0 rounded border border-border" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-article mx-auto mb-16">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4">
          Submission form
        </h2>
        {formId ? (
          <TypeformEmbed formId={formId} height={600} />
        ) : (
          <div className="p-8 rounded-card border border-border bg-card text-center">
            <p className="text-[14px] text-muted">
              Submission form loading. If it doesn&rsquo;t appear,{' '}
              <a
                href="mailto:editorial@welovedaily.com"
                className="text-wld-blue hover:underline"
              >
                email us directly
              </a>
              .
            </p>
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="max-w-article mx-auto">
        <h2 className="text-[18px] font-semibold text-wld-ink mb-6">
          Frequently Asked Questions
        </h2>
        <FaqAccordion groups={submitFaqGroups} />
      </section>
    </div>
  )
}
