import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { SeoHead } from "@/components/seo/SeoHead";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatMetaTitle } from "@shared/siteSeo";

const headingStyle: React.CSSProperties = {
  fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
  fontWeight: 400,
  lineHeight: "1.05",
  color: "#222",
  margin: 0,
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 16,
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
  color: "#6f6f6f",
  margin: 0,
};

export default function AtlaContact() {
  const isMobile = useIsMobile();

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={formatMetaTitle("Contact Atla", "Start a Branding or Digital Project")}
        description="Contact Atla to discuss branding, identity, digital design, or creative direction for your next launch, reposition, or growth stage."
        pathname="/contact"
        image="/figmaAssets/about-hero.jpg"
      />
      <div className="atla-dark-surface">
        <AtlaNav />
        <main
          style={{
            padding: isMobile ? "80px 10px 100px" : "120px 20px 160px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 640,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <p style={labelStyle}>Contact</p>
            <h1 style={{ ...headingStyle, fontSize: isMobile ? 44 : 72 }}>
              Start the conversation before the project gets noisy.
            </h1>
            <p style={{ ...bodyStyle, maxWidth: 420 }}>
              We work with teams that need clarity, not decoration. If you are launching, repositioning,
              or rebuilding a brand system, we can help shape the strategy and the execution together.
            </p>
            <p style={{ ...bodyStyle, maxWidth: 520 }}>
              The strongest starting point is a straightforward note: what the business is, what feels misaligned
              right now, and what has to happen next. That gives us enough context to tell you whether the right next
              move is a brand audit, a full identity engagement, a digital reset, or a narrower decision first.
            </p>
          </div>
        </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
