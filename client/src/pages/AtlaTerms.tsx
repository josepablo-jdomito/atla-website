import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { CONTACT_EMAIL, formatMetaTitle } from "@shared/siteSeo";

// Legal pages: one reading column, labelled sections, 17px body at 68ch (styles in site.css).
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="legal-section">
      <h2 className="site-item-title legal-section__title">{title}</h2>
      <div className="legal-section__body">{children}</div>
    </section>
  );
}

export default function AtlaTerms() {
  return (
    <PageShell logos={false}>
      <SeoHead
        title={formatMetaTitle("Atla Terms of Use", "Website and Content Access")}
        description="Review the terms governing access to the Atla website, intellectual property, third-party services, and permitted use of site content."
        pathname="/terms"
      />
      <div className="site-page-body legal">
        <header className="page-intro">
          <h1 className="page-intro__title">Terms of Use</h1>
        </header>
        <div className="legal-body">
          <p className="longform-text">
            These terms govern access to and use of the Atla website. By using this site, you agree to these terms.
          </p>

          <Section title="Use of site">
            <p className="longform-text">
              You may browse the site and view its content for lawful informational purposes only. You may not misuse the site, attempt unauthorized access, interfere with service operation, or use the content in a misleading or unlawful way.
            </p>
            <p className="longform-text">
              This includes trying to scrape protected areas of the site, reverse engineer its code, impersonate the
              studio, or republish Atla materials in a way that suggests partnership, authorship, or endorsement where
              none exists.
            </p>
            <p className="longform-text">
              You also may not use automated tools in a way that degrades availability, reproduces substantial portions
              of the website, or turns site content into a misleading substitute for direct studio communication.
            </p>
          </Section>

          <Section title="Intellectual property">
            <p className="longform-text">
              Unless otherwise stated, the site design, brand assets, text, visual work, case studies, and editorial materials are owned by Atla or used with permission. No license is granted except the limited right to view the site for personal or internal business reference.
            </p>
            <p className="longform-text">
              Project work shown on the site may also include trademarks, imagery, or materials that belong to clients
              or collaborators. Those rights remain with their respective owners, and nothing on this site transfers
              ownership or reuse rights to visitors.
            </p>
          </Section>

          <Section title="Accuracy and availability">
            <p className="longform-text">
              We aim to keep site content current, but we do not guarantee completeness, accuracy, or uninterrupted availability. We may update, remove, or revise site content at any time without notice.
            </p>
            <p className="longform-text">
              Portfolio and journal content is presented for general information only and should not be treated as a
              warranty, offer, or binding promise about future availability, pricing, deliverables, or business results.
            </p>
          </Section>

          <Section title="Third-party services">
            <p className="longform-text">
              The site may rely on third-party infrastructure and content services. We are not responsible for third-party outages, policy changes, or content outside our control.
            </p>
            <p className="longform-text">
              External links are provided for convenience. When you leave this site, your use of any third-party service
              is governed by that provider&apos;s own terms, privacy practices, and technical controls.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p className="longform-text">
              To the extent permitted by law, Atla disclaims liability for damages arising from use of or inability to use the site, including indirect, incidental, or consequential losses.
            </p>
          </Section>

          <Section title="Inquiry materials">
            <p className="longform-text">
              If you contact the studio with briefs, decks, references, or other materials, you confirm that you have
              the right to share them for discussion purposes. Sending materials does not create a confidential,
              fiduciary, employment, or agency relationship unless both parties agree otherwise in writing.
            </p>
          </Section>

          <Section title="Changes to these terms">
            <p className="longform-text">
              We may revise these terms as the website, studio operations, or third-party services change. The version
              published on this page will apply from the date it appears here, so we recommend reviewing it periodically
              if you return to the site or begin a conversation with the studio.
            </p>
          </Section>

          <Section title="Contact">
            <p className="longform-text">
              For questions about these terms, contact <a href={`mailto:${CONTACT_EMAIL}`} className="longform-link">{CONTACT_EMAIL}</a>.
            </p>
          </Section>
        </div>
      </div>
    </PageShell>
  );
}
