import { TypeformEmbed } from '@/components/modules/TypeformEmbed'
import { buildMetadata } from '@/lib/utils/metadata'

export const metadata = buildMetadata({
  title: 'Contact',
  description: 'Get in touch with the WeLoveDaily team.',
  path: '/contact',
})

const CONTACT_OPTIONS = [
  {
    label: 'Editorial',
    email: 'editorial@welovedaily.com',
    description: 'Submissions, corrections, republishing requests.',
  },
  {
    label: 'Partnerships',
    email: 'partnerships@welovedaily.com',
    description: 'Sponsorships, advertising, media kits.',
  },
  {
    label: 'General',
    email: 'hello@welovedaily.com',
    description: 'Everything else.',
  },
]

export default function ContactPage() {
  const formId = process.env.NEXT_PUBLIC_TYPEFORM_CONTACT_ID || ''

  return (
    <div className="max-w-container mx-auto px-5 py-10">
      {/* Header */}
      <header className="max-w-article mx-auto text-center mb-12">
        <h1 className="font-display text-[32px] md:text-[42px] leading-[1.1] text-wld-ink mb-4">
          Contact
        </h1>
        <p className="text-[16px] leading-relaxed text-muted max-w-[420px] mx-auto">
          Have a question, idea, or something to share? We read everything.
        </p>
      </header>

      {/* Direct emails */}
      <section className="max-w-article mx-auto mb-12">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4">
          Reach us directly
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CONTACT_OPTIONS.map((opt) => (
            <div key={opt.label} className="p-5 rounded-card border border-border bg-card">
              <h3 className="text-[14px] font-semibold text-wld-ink mb-1">{opt.label}</h3>
              <a
                href={`mailto:${opt.email}`}
                className="text-[14px] text-wld-blue hover:underline"
              >
                {opt.email}
              </a>
              <p className="mt-2 text-[13px] text-muted">{opt.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="max-w-article mx-auto">
        <h2 className="text-[13px] font-medium uppercase tracking-wider text-muted mb-4">
          Or use the form
        </h2>
        {formId ? (
          <TypeformEmbed formId={formId} height={450} />
        ) : (
          <div className="p-8 rounded-card border border-border bg-card text-center">
            <p className="text-[14px] text-muted">
              Contact form loading. You can also{' '}
              <a
                href="mailto:hello@welovedaily.com"
                className="text-wld-blue hover:underline"
              >
                email us directly
              </a>
              .
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
