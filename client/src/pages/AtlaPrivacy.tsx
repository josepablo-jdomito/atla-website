import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { CONTACT_EMAIL, formatMetaTitle } from "@shared/siteSeo";

// Legal pages: one reading column, labelled sections, 17px body at 68ch (styles in site.css).
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="legal-section">
      <h2 className="site-label">{title}</h2>
      <div className="legal-section__body">{children}</div>
    </section>
  );
}

export default function AtlaPrivacy() {
  return (
    <PageShell logos={false}>
      <SeoHead
        title={formatMetaTitle("Atla Privacy Policy", "Website and Inquiry Data")}
        description="How Atla handles what you send through the brief and the contact form, the analytics on the site, browser storage and the providers that process data."
        pathname="/privacy"
      />
      <div className="site-page-body legal">
        <header className="page-intro">
          <h1 className="page-intro__title">Privacy Policy</h1>
        </header>
        {/* Rewritten 2026-11-05 against the code at 5e8cfcb (brief with no AI, work search in the browser, Meta Pixel
            and Clarity behind consent). JP approved this text, the two-year retention, the 30-day reply and the
            transfer basis on 2026-11-05 ("Si"). Nothing here is legal advice. */}
        <div className="legal-body">
          <p className="longform-text">Last updated: November 5, 2026.</p>
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
              If you fill in the project brief, we receive your answers to its five questions and the contact details you enter: your name and email address, and your company, website and phone number if you add them. The questions are fixed. No AI service chooses or words them, and none reads your answers. The finished brief is saved in Attio and sent to the studio by email through Resend. We use it to reply to you and for nothing else.
            </p>
            <p className="longform-text">
              To limit repeated requests, the brief and the contact form count requests per visitor in Upstash, keyed by a hashed version of your IP address rather than the address itself. A hashed address is pseudonymised, not anonymous. Each count expires after ten minutes. The brief also counts submissions per email address, keyed by a hash of the address, for 24 hours, and keeps a random submission reference for 24 hours to stop duplicates.
            </p>
            <p className="longform-text">
              After you send the brief, the confirmation offers a link to book a call on Calendly. That link carries your name and email address, so Calendly can fill them in when you open it. Nothing goes to Calendly unless you click the link.
            </p>
            <p className="longform-text">
              The search on the work page runs in your browser and uses no AI service. The words you type stay in the page address so you can share the results, and the site removes them from the address it reports to Google Analytics and to Vercel.
            </p>
            <p className="longform-text">
              The site measures traffic with Vercel Web Analytics and Vercel Speed Insights. They record the pages you visit, the referring site, your country, and your browser and device type, without cookies and without identifying you across sites.
            </p>
            <p className="longform-text">
              The site also uses Google Analytics 4 to understand which pages and links lead to inquiries. It records the pages you view, the links and buttons you use, the referring site, your approximate location, and your browser and device type. With your consent, it sets first-party cookies (named _ga) that recognize a returning browser for up to two years. Google Analytics never receives what you type into the search, the brief or the contact form, and never your name or email address. If you browse from the European Economic Area, the United Kingdom, or Switzerland, the cookies stay off until you accept them in the cookie notice. Anywhere else they are on by default, and you can decline them from the "Analytics cookies" link in the footer or with Google's opt-out browser add-on. While the cookies are off, Google Analytics still receives cookie-free measurements of page views and clicks, without an identifier stored in your browser, and the site sends none of its search or brief events.
            </p>
            <p className="longform-text">
              If you accept analytics, the site also loads the Meta Pixel and Microsoft Clarity. The Meta Pixel records the pages you view and when you finish the brief, and Meta may use that to measure and optimize its ads and, if you are signed in to Meta, link the visit to your account. Clarity records how you move through pages (clicks, scrolling and page replays, with form fields masked). Neither receives what you type into the search, the brief or the contact form. They stay off for every visitor until you accept in the cookie notice, and they stop if you decline later from the footer.
            </p>
            <p className="longform-text">
              The /waitlist page is served from a separate Atla application and loads Google Analytics and the Meta Pixel to measure that campaign. Those tools use cookies and may link your visit to your Google or Meta account under their own privacy policies, and the choice you make on this site does not apply there.
            </p>
          </Section>

          <Section title="Cookies and storage">
            <p className="longform-text">
              The site keeps your analytics cookie choice in your browser's local storage. While you fill in the project brief, your answers are kept in the tab's session storage so you can go back a step or try again, and they are cleared when you close the tab. If you use Pause motion, that choice is kept in session storage for the tab too. The hospitality page keeps how you arrived (campaign tags and the referring site) in session storage for the same tab and sends it with that page's form. Light or dark appearance follows your device setting and is not stored. You can clear this storage from your browser at any time.
            </p>
            <p className="longform-text">
              Google Analytics sets the _ga cookies described above, unless you decline them or, in the European Economic Area, the United Kingdom, or Switzerland, until you accept them. Without them it sends the cookie-free measurements described above. If you accept analytics, the Meta Pixel sets _fbp and Clarity sets _clck and _clsk (first-party cookies, up to about one year). If you decline or withdraw from the footer link, the site deletes the _ga, _fbp, _clck and _clsk cookies it can reach on this domain.
            </p>
            <p className="longform-text">
              Video case studies embed the Vimeo player with Do Not Track enabled. Vimeo may still process technical request data and set the cookies it needs to play the video. The site does not change how it works in response to Do Not Track signals; you can decline analytics cookies from the footer link.
            </p>
            <p className="longform-text">
              We will update this page before activating any additional analytics, marketing tags, or optional cookies.
            </p>
          </Section>

          <Section title="How we use information">
            <p className="longform-text">
              We use what you send through the brief and the contact form to respond to inquiries, manage studio communications, and evaluate potential project opportunities. We keep an inquiry that does not become a project for two years after our last exchange, then delete it. If it becomes a project, we keep the record for the length of the engagement and as long as tax and contract law require. Access is limited to the people who run the studio.
            </p>
          </Section>

          <Section title="Third parties">
            <p className="longform-text">
              The site is hosted on Vercel, which also provides the cookieless analytics described above. Google processes Google Analytics data as described above, and, if you accept analytics, Meta and Microsoft (Clarity) process visit data as described above. Portfolio and journal content, including images, is served from Sanity. Typefaces are loaded from Google Fonts, so Google receives your IP address when a page loads. Video case studies are played through Vimeo. Contact form submissions and finished briefs are stored in Attio, the customer relationship system we use to manage inquiries. If a contact form submission cannot be saved there, the server log keeps only a reference number and the domain of your email address, never the message. Briefs are also sent to the studio by email through Resend, and the studio's mailbox is hosted by Google Workspace. If a brief cannot be delivered, the server log keeps only a reference number and the domain of your email address, never the brief itself. Upstash stores the hashed request counts described above. Calendly receives your name and email address only if you open the booking link. On the /waitlist page, Google and Meta process visit data as described above. These providers may process technical request data such as IP address, device metadata, and request logs to deliver their services.
            </p>
            <p className="longform-text">
              The project brief and the search on the work page do not use any AI service. What you type stays with the providers named on this page.
            </p>
          </Section>

          <Section title="International transfers">
            <p className="longform-text">
              Atla & WeLoveDaily, LLC is based in the United States, and most of the providers named above store and process data there. If you contact us or browse the site from outside the United States, including from Mexico, the rest of Latin America, or the European Union, your information is transferred to and handled in the United States under this policy. Where your local law requires a specific safeguard for that transfer, we rely on the contractual data protection terms of each provider and on your consent given by sending us your inquiry.
            </p>
          </Section>

          <Section title="Your rights">
            <p className="longform-text">
              You can ask us at <a href={`mailto:${CONTACT_EMAIL}`} className="longform-link">{CONTACT_EMAIL}</a> to show you, correct, delete or restrict the personal data we hold about you, to give you a copy of it, or to stop using it for a purpose. You can withdraw consent at any time, including for analytics cookies, from the "Analytics cookies" link in the footer. In Mexico these are your ARCO rights (access, rectification, cancellation and opposition). We reply within 30 days, and we may ask you to confirm who you are before we act, to protect your data from someone else. If you are in the European Economic Area you can also complain to your data protection authority; in Spain that is the Agencia Española de Protección de Datos (aepd.es).
            </p>
          </Section>

          <Section title="Updates">
            <p className="longform-text">
              We may update this policy as the site changes. The latest version published on this page will control.
            </p>
            <p className="longform-text">
              We will revise this page before introducing new analytics tools, client portals, or other third-party services that change what data is processed.
            </p>
          </Section>
        </div>
      </div>
    </PageShell>
  );
}
