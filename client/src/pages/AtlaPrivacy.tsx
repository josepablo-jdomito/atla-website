import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatMetaTitle } from "@shared/siteSeo";

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
            This site is operated by Atla. This policy explains what information we collect, how we use it, and what browser storage the site uses.
          </p>

          <Section title="Who we are">
            <p style={bodyStyle}>
              Atla is a design studio working across brand identity, visual systems, packaging, motion, and digital experiences. For privacy questions, contact <a href="mailto:hello@atla.studio" style={{ color: "#222" }}>hello@atla.studio</a>.
            </p>
          </Section>

          <Section title="What we collect">
            <p style={bodyStyle}>
              The public site does not currently run advertising pixels or non-essential analytics scripts. If you contact us by email, we receive whatever information you include in your message.
            </p>
          </Section>

          <Section title="Cookies and storage">
            <p style={bodyStyle}>
              The site uses functional browser storage to remember your theme preference between light and dark mode. This is stored locally in your browser and is used only to keep the interface consistent across visits.
            </p>
            <p style={bodyStyle}>
              If we add analytics, marketing tags, embedded third-party tracking, or optional cookies later, this policy and the consent experience should be updated before those tools are activated.
            </p>
          </Section>

          <Section title="How we use information">
            <p style={bodyStyle}>
              We use submitted contact information to respond to inquiries, manage studio communications, and evaluate potential project opportunities.
            </p>
          </Section>

          <Section title="Third parties">
            <p style={bodyStyle}>
              The site is hosted on Vercel and the journal content source is Sanity. Those providers may process technical request data required to operate the service, such as IP address, device metadata, and request logs.
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
        </div>
      </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
