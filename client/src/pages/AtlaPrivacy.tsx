import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { CONTACT_EMAIL, formatMetaTitle } from "@shared/siteSeo";

// Legal pages: one reading column, labelled sections, 17px body at 68ch (styles in site.css).
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="legal-section">
      <h2 className="home-section-label">{title}</h2>
      <div className="legal-section__body">{children}</div>
    </section>
  );
}

export default function AtlaPrivacy() {
  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle("Atla Privacy Policy", "Website and Inquiry Data")}
        description="Read how Atla handles browser storage, hosting data, and information shared through direct studio inquiries across the website."
        pathname="/privacy"
      />
      <div className="site-page-body legal">
        <header className="page-intro">
          <h1 className="page-intro__title">Privacy Policy</h1>
        </header>
        <div className="legal-body">
          <p className="longform-text">
            This site is operated by Atla & WeLoveDaily, LLC. This policy explains what information we collect, how we use it, which providers process it, and what your browser stores.
          </p>

          <Section title="Who we are">
            <p className="longform-text">
              Atla is the branding studio of Atla & WeLoveDaily, LLC, a company registered in Texas and based in Austin. We work across brand identity, visual systems, packaging, motion, and digital experiences. For privacy questions, contact <a href={`mailto:${CONTACT_EMAIL}`} className="longform-link">{CONTACT_EMAIL}</a>.
            </p>
          </Section>

          <Section title="What we collect">
            <p className="longform-text">
              If you contact us by email, we receive whatever information you include in your message. If you use the contact form, we receive the name, email address, company or website, and message you enter, and we keep your IP address in memory for up to ten minutes to limit repeated submissions.
            </p>
            <p className="longform-text">
              The site measures traffic with Vercel Web Analytics and Vercel Speed Insights. They record the pages you visit, the referring site, your country, and your browser and device type, without cookies and without identifying you across sites.
            </p>
            <p className="longform-text">
              The site also uses Google Analytics 4 to understand which pages and links lead to inquiries. It records the pages you view, the links and buttons you use, the referring site, your approximate location, and your browser and device type, and it sets first-party cookies (named _ga) that recognize a returning browser for up to two years. Google Analytics does not receive the content of the contact form. If you browse from the European Economic Area, the United Kingdom, or Switzerland, Google Analytics stays off until you accept it in the cookie notice. Anywhere else you can turn it off from the "Analytics cookies" link in the footer or with Google's opt-out browser add-on. The site does not run advertising pixels, except on the waitlist page described below.
            </p>
            <p className="longform-text">
              The /waitlist page is served from a separate Atla application and loads Google Analytics and the Meta Pixel to measure that campaign. Those tools use cookies and may link your visit to your Google or Meta account under their own privacy policies.
            </p>
          </Section>

          <Section title="Cookies and storage">
            <p className="longform-text">
              The site stores a few preferences in your browser's local storage: your light or dark theme, your analytics cookie choice, the projects and actions you used recently in the command center, and any brief you draft there before sending it. This data stays on your device, is never sent to us, and you can clear it from your browser at any time.
            </p>
            <p className="longform-text">
              Google Analytics sets the _ga cookies described above, unless you decline them or, in the European Economic Area, the United Kingdom, or Switzerland, until you accept them.
            </p>
            <p className="longform-text">
              Video case studies embed the Vimeo player with Do Not Track enabled. Vimeo may still process technical request data and set the cookies it needs to play the video. The /waitlist page uses the analytics and advertising cookies described above.
            </p>
            <p className="longform-text">
              We will update this page before activating any additional analytics, marketing tags, or optional cookies.
            </p>
          </Section>

          <Section title="How we use information">
            <p className="longform-text">
              We use submitted contact information to respond to inquiries, manage studio communications, and evaluate potential project opportunities. We keep inquiry data until you ask us to delete it, unless a legal obligation requires us to keep it longer. Access is limited to the people who run the studio.
            </p>
          </Section>

          {/* Legal copy. Changes here are drafted for JP and reviewed before merge. */}
          <Section title="Third parties">
            <p className="longform-text">
              The site is hosted on Vercel, which also provides the cookieless analytics described above. Google processes Google Analytics data as described above. Portfolio and journal content, including images, is served from Sanity. Typefaces are loaded from Google Fonts, so Google receives your IP address when a page loads. Video case studies are played through Vimeo. Contact form submissions are stored in Attio, the customer relationship system we use to manage inquiries. If a submission cannot be saved there, the server log keeps the email address and a short excerpt of the message so we can follow up. On the /waitlist page, Google and Meta process visit data as described above. These providers operate in the United States and may process technical request data such as IP address, device metadata, and request logs to deliver their services.
            </p>
          </Section>

          <Section title="International transfers">
            <p className="longform-text">
              Atla & WeLoveDaily, LLC is based in the United States, and the providers named above store and process data there. If you contact us or browse the site from outside the United States, including from Mexico, the rest of Latin America, or the European Union, your information is transferred to and handled in the United States under this policy. Where your local law requires a specific safeguard for that transfer, we rely on the contractual data protection terms of each provider and on your consent given by sending us your inquiry.
            </p>
          </Section>

          <Section title="Your rights">
            <p className="longform-text">
              Depending on your jurisdiction, you may have rights to request access, correction, deletion, or restriction of personal data. Contact us and we will respond according to the applicable legal framework.
            </p>
          </Section>

          <Section title="Updates">
            <p className="longform-text">
              We may update this policy as the site changes. The latest version published on this page will control.
            </p>
            <p className="longform-text">
              We will revise this page before introducing new analytics tools, client portals, embedded scheduling tools, or other third-party services that change what data is processed.
            </p>
          </Section>
          <section className="sr-only" aria-label="Privacy extended information">
            <h2>Additional privacy clarifications</h2>
            <p>
              We keep inquiry communications until the sender asks us to delete them, unless a legal obligation requires keeping them longer. Access is limited to people involved in studio operations.
            </p>
            <p>
              Requests related to data access, correction, or deletion can be sent to {CONTACT_EMAIL}. When required,
              we may request identity verification before processing sensitive requests to protect account and contact
              information from unauthorized access.
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
