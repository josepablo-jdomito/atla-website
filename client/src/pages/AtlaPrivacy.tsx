import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { useIsMobile } from "@/hooks/use-mobile";
import { CONTACT_EMAIL, formatMetaTitle } from "@shared/siteSeo";

const headingStyle: React.CSSProperties = {
  fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
  fontWeight: 400,
  lineHeight: "1.1",
  color: "#222",
  margin: 0,
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "1.5",
  letterSpacing: 0.2,
  color: "#222",
  margin: 0,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 12,
  fontWeight: 600,
  lineHeight: "1.2",
  letterSpacing: 0.48,
  textTransform: "uppercase",
  color: "#8e8e8e",
  margin: 0,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={labelStyle}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </section>
  );
}

export default function AtlaPrivacy() {
  const isMobile = useIsMobile();

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={formatMetaTitle("Atla Privacy Policy", "Website and Inquiry Data")}
        description="Read how Atla handles browser storage, hosting data, and information shared through direct studio inquiries across the website."
        pathname="/privacy"
      />
      <div className="atla-dark-surface">
      <AtlaNav />
      <main style={{ padding: isMobile ? "80px 10px 100px" : "120px 20px 160px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 620px", gap: isMobile ? 32 : 20 }}>
        <div>
          <h1 style={{ ...headingStyle, fontSize: isMobile ? 40 : 64 }}>Privacy Policy</h1>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <p style={bodyStyle}>
            This site is operated by Atla & WeLoveDaily, LLC. This policy explains what information we collect, how we use it, which providers process it, and what your browser stores.
          </p>

          <Section title="Who we are">
            <p style={bodyStyle}>
              Atla is the branding studio of Atla & WeLoveDaily, LLC, a company registered in Texas and based in Austin. We work across brand identity, visual systems, packaging, motion, and digital experiences. For privacy questions, contact <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#222" }}>{CONTACT_EMAIL}</a>.
            </p>
          </Section>

          <Section title="What we collect">
            <p style={bodyStyle}>
              If you contact us by email, we receive whatever information you include in your message. If you use the contact form, we receive the name, email address, company or website, and message you enter, and we keep your IP address in memory for up to ten minutes to limit repeated submissions.
            </p>
            <p style={bodyStyle}>
              The site measures traffic with Vercel Web Analytics and Vercel Speed Insights. They record the pages you visit, the referring site, your country, and your browser and device type, without cookies and without identifying you across sites. The site does not run advertising pixels, except on the waitlist page described below.
            </p>
            <p style={bodyStyle}>
              The /waitlist page is served from a separate Atla application and loads Google Analytics and the Meta Pixel to measure that campaign. Those tools use cookies and may link your visit to your Google or Meta account under their own privacy policies.
            </p>
          </Section>

          <Section title="Cookies and storage">
            <p style={bodyStyle}>
              The site stores a few preferences in your browser's local storage: your light or dark theme, the projects and actions you used recently in the command center, and any brief you draft there before sending it. This data stays on your device, is never sent to us, and you can clear it from your browser at any time.
            </p>
            <p style={bodyStyle}>
              Video case studies embed the Vimeo player with Do Not Track enabled. Vimeo may still process technical request data and set the cookies it needs to play the video. The /waitlist page uses the analytics and advertising cookies described above.
            </p>
            <p style={bodyStyle}>
              We will update this page before activating any additional analytics, marketing tags, or optional cookies.
            </p>
          </Section>

          <Section title="How we use information">
            <p style={bodyStyle}>
              We use submitted contact information to respond to inquiries, manage studio communications, and evaluate potential project opportunities. We keep inquiry data until you ask us to delete it, unless a legal obligation requires us to keep it longer. Access is limited to the people who run the studio.
            </p>
          </Section>

          {/* Legal copy. Changes here are drafted for JP and reviewed before merge. */}
          <Section title="Third parties">
            <p style={bodyStyle}>
              The site is hosted on Vercel, which also provides the analytics described above. Portfolio and journal content, including images, is served from Sanity. Typefaces are loaded from Google Fonts, so Google receives your IP address when a page loads. Video case studies are played through Vimeo. Contact form submissions are stored in Attio, the customer relationship system we use to manage inquiries. If a submission cannot be saved there, the server log keeps the email address and a short excerpt of the message so we can follow up. On the /waitlist page, Google and Meta process visit data as described above. These providers operate in the United States and may process technical request data such as IP address, device metadata, and request logs to deliver their services.
            </p>
          </Section>

          <Section title="Your rights">
            <p style={bodyStyle}>
              Depending on your jurisdiction, you may have rights to request access, correction, deletion, or restriction of personal data. Contact us and we will respond according to the applicable legal framework.
            </p>
          </Section>

          <Section title="Updates">
            <p style={bodyStyle}>
              We may update this policy as the site changes. The latest version published on this page will control.
            </p>
            <p style={bodyStyle}>
              If Atla introduces new analytics tools, client portals, embedded scheduling tools, or other third-party
              services that change what data is processed, this page should be revised before those changes go live.
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
      </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
