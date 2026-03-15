import { useEffect, type CSSProperties } from "react";

const PAGE_STYLE: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#fafafa",
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  color: "#222",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
};

const CARD_STYLE: CSSProperties = {
  width: "100%",
  maxWidth: 560,
  backgroundColor: "#fff",
  border: "1px solid #e8e8e8",
  borderRadius: 20,
  padding: 32,
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

const LABEL_STYLE: CSSProperties = {
  margin: 0,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.48,
  lineHeight: "1.2",
  textTransform: "uppercase",
  color: "#8e8e8e",
};

const TITLE_STYLE: CSSProperties = {
  margin: 0,
  fontSize: 32,
  fontWeight: 600,
  lineHeight: "1.05",
  letterSpacing: -0.64,
  color: "#222",
};

const BODY_STYLE: CSSProperties = {
  margin: 0,
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "1.45",
  letterSpacing: 0.14,
  color: "#4d4d4d",
};

const NOTE_STYLE: CSSProperties = {
  ...BODY_STYLE,
  color: "#222",
};

export default function ProjectsAdmin() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <main style={PAGE_STYLE}>
      <section style={CARD_STYLE}>
        <p style={LABEL_STYLE}>Atla / Projects CMS</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h1 style={TITLE_STYLE}>Legacy CMS retired</h1>
          <p style={BODY_STYLE}>
            Portfolio entries are now managed in Sanity Studio. The legacy
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 13 }}> /admin/projects </span>
            interface has been retired to avoid conflicts with the approved production workflow.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            paddingTop: 20,
            borderTop: "1px solid #e8e8e8",
          }}
        >
          <p style={NOTE_STYLE}>Use Sanity for portfolio titles, slugs, cover images, gallery images, body copy, tags, featured status, and publishing state.</p>
          <p style={BODY_STYLE}>The required portfolio field contract is documented in the repo so editors and developers can audit content without relying on the retired admin flow.</p>
        </div>
      </section>
    </main>
  );
}
