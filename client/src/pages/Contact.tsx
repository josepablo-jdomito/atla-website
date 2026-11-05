import { Link } from "wouter";
import { ContactForm } from "@/components/site/ContactForm";
import { PageShell } from "@/components/site/PageShell";
import { SITE_CITIES } from "@/components/site/SiteFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { CONTACT_EMAIL, formatMetaTitle, SOCIAL_PROFILES } from "@shared/siteSeo";

const copy = siteCopy.contact;

export default function Contact() {
  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle(copy.metaTitle, copy.metaSuffix)}
        description={copy.metaDescription}
        pathname="/contact"
        image="/figmaAssets/about-hero.jpg"
      />
      <div className="site-page-body">
        <header className="page-intro">
          <h1 className="page-intro__title">{copy.title}</h1>
          <p className="page-intro__lead">{copy.lead}</p>
          <Link href="/brief" className="brief-primary">
            {copy.cta}
          </Link>
        </header>

        <dl className="contact-details">
          <div className="contact-details__group">
            <dt className="home-section-label">{copy.emailLabel}</dt>
            <dd>
              <a href={`mailto:${CONTACT_EMAIL}`} className="site-link contact-details__email">
                {CONTACT_EMAIL}
              </a>
            </dd>
          </div>
          <div className="contact-details__group">
            <dt className="home-section-label">{copy.socialLabel}</dt>
            {SOCIAL_PROFILES.map((social) => (
              <dd key={social.href}>
                <a href={social.href} target="_blank" rel="noreferrer" className="site-link">
                  {social.label === "Linkedin" ? "LinkedIn" : social.label}
                </a>
              </dd>
            ))}
          </div>
          <div className="contact-details__group">
            <dt className="home-section-label">{copy.citiesLabel}</dt>
            {SITE_CITIES.map((city) => (
              <dd key={city.label}>{city.label}</dd>
            ))}
          </div>
        </dl>

        <section className="page-section" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className="page-section__title">
            {copy.formTitle}
          </h2>
          <div className="page-section__body">
            <p className="page-section__lead page-section__lead--muted">{copy.formLead}</p>
            <ContactForm />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
