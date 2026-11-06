import { ContactForm } from "@/components/site/ContactForm";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { CONTACT_PAGE_SCHEMA } from "@/lib/sitePageSchema";
import { CONTACT_EMAIL, SOCIAL_PROFILES, formatMetaTitle } from "@shared/siteSeo";

const copy = siteCopy.contact;

/** One screen: the title with the email and the socials under it, the form beside them from 1024. */
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
      <div className="site-page-body contact">
        <header className="page-intro contact__intro">
          <h1 className="page-intro__title">{copy.title}</h1>
          <p className="contact-way__email">
            <a href={`mailto:${CONTACT_EMAIL}`} className="site-link contact-details__email">
              {CONTACT_EMAIL}
            </a>
          </p>
          <ul className="contact-way__socials">
            {SOCIAL_PROFILES.map((social) => (
              <li key={social.href}>
                <a href={social.href} target="_blank" rel="noreferrer" className="site-link">
                  {social.label === "Linkedin" ? "LinkedIn" : social.label}
                </a>
              </li>
            ))}
          </ul>
        </header>
        <div className="contact-way">
          <ContactForm />
        </div>
      </div>
    </PageShell>
  );
}
