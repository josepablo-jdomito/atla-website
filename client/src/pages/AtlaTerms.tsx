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

export default function AtlaTerms() {
  const isMobile = useIsMobile();

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={formatMetaTitle("Atla Terms of Use", "Website and Content Access")}
        description="Review the terms governing access to the Atla website, intellectual property, third-party services, and permitted use of site content."
        pathname="/terms"
      />
      <div className="atla-dark-surface">
      <AtlaNav />
      <main style={{ padding: isMobile ? "80px 10px 100px" : "120px 20px 160px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 620px", gap: isMobile ? 32 : 20 }}>
        <div>
          <h1 style={{ ...headingStyle, fontSize: isMobile ? 40 : 64 }}>Terms of Use</h1>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <p style={bodyStyle}>
            These terms govern access to and use of the Atla website. By using this site, you agree to these terms.
          </p>

          <Section title="Use of site">
            <p style={bodyStyle}>
              You may browse the site and view its content for lawful informational purposes only. You may not misuse the site, attempt unauthorized access, interfere with service operation, or use the content in a misleading or unlawful way.
            </p>
            <p style={bodyStyle}>
              This includes trying to scrape protected areas of the site, reverse engineer its code, impersonate the
              studio, or republish Atla materials in a way that suggests partnership, authorship, or endorsement where
              none exists.
            </p>
            <p style={bodyStyle}>
              You also may not use automated tools in a way that degrades availability, reproduces substantial portions
              of the website, or turns site content into a misleading substitute for direct studio communication.
            </p>
          </Section>

          <Section title="Intellectual property">
            <p style={bodyStyle}>
              Unless otherwise stated, the site design, brand assets, text, visual work, case studies, and editorial materials are owned by Atla or used with permission. No license is granted except the limited right to view the site for personal or internal business reference.
            </p>
            <p style={bodyStyle}>
              Project work shown on the site may also include trademarks, imagery, or materials that belong to clients
              or collaborators. Those rights remain with their respective owners, and nothing on this site transfers
              ownership or reuse rights to visitors.
            </p>
          </Section>

          <Section title="Accuracy and availability">
            <p style={bodyStyle}>
              We aim to keep site content current, but we do not guarantee completeness, accuracy, or uninterrupted availability. We may update, remove, or revise site content at any time without notice.
            </p>
            <p style={bodyStyle}>
              Portfolio and journal content is presented for general information only and should not be treated as a
              warranty, offer, or binding promise about future availability, pricing, deliverables, or business results.
            </p>
          </Section>

          <Section title="Third-party services">
            <p style={bodyStyle}>
              The site may rely on third-party infrastructure and content services. We are not responsible for third-party outages, policy changes, or content outside our control.
            </p>
            <p style={bodyStyle}>
              External links are provided for convenience. When you leave this site, your use of any third-party service
              is governed by that provider&apos;s own terms, privacy practices, and technical controls.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p style={bodyStyle}>
              To the extent permitted by law, Atla disclaims liability for damages arising from use of or inability to use the site, including indirect, incidental, or consequential losses.
            </p>
          </Section>

          <Section title="Inquiry materials">
            <p style={bodyStyle}>
              If you contact the studio with briefs, decks, references, or other materials, you confirm that you have
              the right to share them for discussion purposes. Sending materials does not create a confidential,
              fiduciary, employment, or agency relationship unless both parties agree otherwise in writing.
            </p>
          </Section>

          <Section title="Changes to these terms">
            <p style={bodyStyle}>
              We may revise these terms as the website, studio operations, or third-party services change. The version
              published on this page will apply from the date it appears here, so we recommend reviewing it periodically
              if you return to the site or begin a conversation with the studio.
            </p>
          </Section>

          <Section title="Contact">
            <p style={bodyStyle}>
              For questions about these terms, contact <a href="mailto:hello@atla.studio" style={{ color: "#222" }}>hello@atla.studio</a>.
            </p>
          </Section>
        </div>
      </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
