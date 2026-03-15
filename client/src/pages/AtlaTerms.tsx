import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { useIsMobile } from "@/hooks/use-mobile";

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
          </Section>

          <Section title="Intellectual property">
            <p style={bodyStyle}>
              Unless otherwise stated, the site design, brand assets, text, visual work, case studies, and editorial materials are owned by Atla or used with permission. No license is granted except the limited right to view the site for personal or internal business reference.
            </p>
          </Section>

          <Section title="Accuracy and availability">
            <p style={bodyStyle}>
              We aim to keep site content current, but we do not guarantee completeness, accuracy, or uninterrupted availability. We may update, remove, or revise site content at any time without notice.
            </p>
          </Section>

          <Section title="Third-party services">
            <p style={bodyStyle}>
              The site may rely on third-party infrastructure and content services. We are not responsible for third-party outages, policy changes, or content outside our control.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p style={bodyStyle}>
              To the extent permitted by law, Atla disclaims liability for damages arising from use of or inability to use the site, including indirect, incidental, or consequential losses.
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
