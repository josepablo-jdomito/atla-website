import { ContactForm } from "@/components/site/ContactForm";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { CONTACT_PAGE_SCHEMA } from "@/lib/sitePageSchema";
import { CONTACT_EMAIL, formatMetaTitle } from "@shared/siteSeo";

const copy = siteCopy.contact;

export default function Contact() {
  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle(copy.metaTitle, copy.metaSuffix)}
        description={copy.metaDescription}
        pathname="/contact"
        image="/figmaAssets/about-hero.jpg"
        structuredData={CONTACT_PAGE_SCHEMA}
      />
      <div className="site-page-body">
        <header className="page-intro">
          <h1 className="page-intro__title">{copy.title}</h1>
          <p className="page-intro__lead">{copy.lead}</p>
        </header>

        {/* One way in: the form, with the email line above it (critique 2026-11-05, C1 to C5). */}
        <div className="contact-way">
          <p className="contact-way__email">
            <span className="site-label">{copy.emailLabel}</span>{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="site-link contact-details__email">
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="page-section__lead page-section__lead--muted">{copy.formLead}</p>
          <ContactForm />
        </div>
      </div>
    </PageShell>
  );
}
