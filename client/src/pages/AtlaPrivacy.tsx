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
            {/* PENDING JP APPROVAL: storage paragraph rewritten 2026-11-05 to match the code (lib/ga.ts, brief/briefStorage.ts, AtlaHospitality.tsx). */}
            <p className="longform-text">
              The site keeps your analytics cookie choice in your browser's local storage. While you fill in the project brief, your answers are kept in the tab's session storage so you can go back a step or try again, and they are cleared when you close the tab. The hospitality page keeps how you arrived (campaign tags and the referring site) in session storage for the same tab and sends it with that page's form. Light or dark appearance follows your device setting and is not stored. You can clear this storage from your browser at any time.
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
            {/* PENDING JP APPROVAL: Anthropic paragraph, drafted 2026-11-05 against Anthropic's Commercial Terms and API retention docs and server/ai/claude.ts. Report: .superpowers/sdd/2026-11-04-atla-site-v2/task-13-report.md */}
            <p className="longform-text">
              Some of what you type on the site is processed by Anthropic, the company behind the Claude AI models, to answer your request. When a search on the work page is a full sentence, its text may be sent to Anthropic to work out what you are looking for. In the project brief, your first message and your answers so far are sent to Anthropic to choose and word the next question, exactly as you wrote them. Your name, email address, company, website and phone number are never sent to Anthropic, and no identifier for you goes with these requests. Under Anthropic's commercial terms, Anthropic may not train its models on this content. Anthropic deletes it within 30 days, unless its safety systems flag a request as breaking its usage policy, in which case it may keep it for up to two years.
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
