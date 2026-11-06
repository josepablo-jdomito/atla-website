import { useMemo } from "react";
import { BracketLabel, ContactCard, ContactForm } from "@/components/site/ContactForm";
import { PageShell } from "@/components/site/PageShell";
import { useSiteProjects } from "@/components/site/siteProjects";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { CONTACT_PAGE_SCHEMA } from "@/lib/sitePageSchema";
import { getOptimizedImageUrl } from "@shared/imageDelivery";
import { CONTACT_EMAIL, formatMetaTitle } from "@shared/siteSeo";
import "@/styles/pages.css";

const copy = siteCopy.contact;
const CARD_PROJECT = "rustico";

/**
 * Contact in JP's Figma language (2026-11-05): one row, the script title on the left; on the right
 * the dark card that starts a brief, then the email line and the form in the Figma type.
 */
export default function Contact() {
  const { projects } = useSiteProjects();
  const cardImage = useMemo(() => {
    const cover = projects.find((project) => project.slug === CARD_PROJECT)?.coverImage;
    return cover ? getOptimizedImageUrl(cover, { width: 1280, quality: 80 }) || cover : undefined;
  }, [projects]);

  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle(copy.metaTitle, copy.metaSuffix)}
        description={copy.metaDescription}
        pathname="/contact"
        image="/figmaAssets/about-hero.jpg"
        structuredData={CONTACT_PAGE_SCHEMA}
      />
      <div className="fp contact">
        <section className="fp-row fp-row--top" aria-labelledby="contact-title">
          <h1 id="contact-title" className="fp-script">
            {siteCopy.about.rows.contact}
          </h1>
          <div className="fp-row__content fp-contact">
            <ContactCard title={copy.cardTitle} lead={copy.lead} cta={copy.cta} image={cardImage} headingLevel={2} />
            <section className="fp-form-block" aria-labelledby="contact-form-title">
              <div className="fp-row__content">
                <h2 id="contact-form-title">
                  <BracketLabel>{copy.formLabel}</BracketLabel>
                </h2>
                <p className="fp-body">{copy.formLead}</p>
                <p className="fp-email">
                  <BracketLabel muted>{copy.emailLabel}</BracketLabel>
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </p>
                <ContactForm />
              </div>
            </section>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
