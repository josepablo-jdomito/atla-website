import { ContactForm } from "@/components/site/ContactForm";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { CONTACT_PAGE_SCHEMA } from "@/lib/sitePageSchema";
import { SITE_CITIES } from "@/components/site/SiteFooter";
import { CONTACT_EMAIL, SOCIAL_PROFILES, formatMetaTitle } from "@shared/siteSeo";

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
          <p className="contact-way__line">
            <span className="site-label">{copy.socialLabel}</span>{" "}
            {SOCIAL_PROFILES.map((social, index) => (
              <span key={social.href}>
                {index > 0 ? ", " : null}
                <a href={social.href} target="_blank" rel="noreferrer" className="site-link">
                  {social.label === "Linkedin" ? "LinkedIn" : social.label}
                </a>
              </span>
            ))}
          </p>
          <p className="contact-way__line">
            <span className="site-label">{copy.citiesLabel}</span> {SITE_CITIES.map((city) => city.label).join(", ")}
          </p>
          <ContactForm />
        </div>
      </div>
    </PageShell>
  );
}
