import { ProjectSubmissionForm } from '@/components/forms/ProjectSubmissionForm'
import { buildMetadata } from '@/lib/utils/metadata'
import { client } from '@/lib/sanity/client'
import { allCategoriesQuery } from '@/lib/sanity/queries'
import type { Category } from '@/types'

export const metadata = buildMetadata({
  title: 'Submit Your Work - WeLoveDaily',
  description:
    'Submit your brand identity, packaging, or rebrand work to WeLoveDaily. We feature studios and designers setting the standard in consumer brand design.',
  path: '/submit',
})

const WORKFLOW = ['Submitted', 'Review', 'Approved', 'Published']

export default async function SubmitPage() {
  const categories = await client.fetch<Category[]>(allCategoriesQuery)

  return (
    <div className="max-w-container mx-auto px-5 py-10 space-y-10">
      <header className="max-w-[860px] space-y-4">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink">
          Submit Your Work
        </h1>
        <p className="text-[16px] leading-relaxed text-muted">
          WeLoveDaily features brand identities, packaging systems, rebrands, and creative direction
          from studios and designers worldwide. We publish work that sets a standard - not
          everything submitted gets in.
        </p>
      </header>

      <section>
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4">Workflow</h2>
        <div className="flex flex-wrap items-center gap-2 text-[14px]">
          {WORKFLOW.map((step, index) => (
            <span key={step} className="inline-flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full border border-border bg-white text-wld-ink">
                {step}
              </span>
              {index < WORKFLOW.length - 1 && <span className="text-muted">↓</span>}
            </span>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h3 className="text-[18px] font-semibold text-wld-ink mb-3">What We Feature</h3>
            <ul className="space-y-2 text-[14px] text-muted">
              <li>Brand identities and visual systems</li>
              <li>Packaging design</li>
              <li>Rebrands with strategic context</li>
              <li>Retail and environmental design</li>
              <li>Concept and student work (clearly labeled)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[18px] font-semibold text-wld-ink mb-3">What We Don&apos;t Feature</h3>
            <ul className="space-y-2 text-[14px] text-muted">
              <li>Illustration, animation, or motion work without a brand system context</li>
              <li>Single-asset submissions (a logo alone is not a brand identity)</li>
              <li>Work in progress or unfinished projects</li>
              <li>Work without proper studio and designer credits</li>
            </ul>
          </div>

          <div className="p-5 rounded-card border border-border bg-card">
            <h3 className="text-[18px] font-semibold text-wld-ink mb-2">Curation Standard</h3>
            <p className="text-[14px] text-muted leading-relaxed">
              We review every submission. Selection is based on craft, strategic clarity, and
              whether the work advances the conversation in its category. Volume is never the
              priority. Standard is.
            </p>
          </div>
        </div>

        <section className="lg:col-span-2 p-5 rounded-card border border-border bg-white">
          <ProjectSubmissionForm categories={categories} />
        </section>
      </section>

      <section className="p-5 rounded-card border border-border bg-card">
        <h2 className="text-[16px] font-semibold text-wld-ink mb-2">Submission Guidelines</h2>
        <p className="text-[14px] text-muted leading-relaxed">
          We do not charge for features. We do not guarantee coverage in exchange for any payment.
          If a submission is selected as a sponsored feature, that will be clearly labeled.
        </p>
      </section>
    </div>
  )
}
