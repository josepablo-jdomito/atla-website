import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { JournalPortableTextBlock } from "@shared/journal";

const PARAGRAPH: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 16,
  fontWeight: 500,
  letterSpacing: 0.16,
  lineHeight: "1.6",
  color: "#222",
  margin: 0,
};

const LABEL: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.48,
  lineHeight: "1.2",
  color: "#8e8e8e",
  textTransform: "uppercase",
  margin: 0,
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p style={PARAGRAPH}>{children}</p>,
    h2: ({ children }) => (
      <h2
        style={{
          fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
          fontSize: 36,
          fontWeight: 400,
          lineHeight: "1.1",
          color: "#222",
          margin: 0,
          paddingTop: 20,
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        style={{
          fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
          fontSize: 28,
          fontWeight: 400,
          lineHeight: "1.15",
          color: "#222",
          margin: 0,
          paddingTop: 12,
        }}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        style={{
          fontFamily: "'Libre Franklin', Helvetica, sans-serif",
          fontSize: 18,
          fontWeight: 600,
          lineHeight: "1.3",
          color: "#222",
          margin: 0,
          paddingTop: 8,
          textTransform: "uppercase",
        }}
      >
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{
          ...PARAGRAPH,
          borderLeft: "1px solid #222",
          paddingLeft: 20,
          margin: 0,
          fontStyle: "italic",
          color: "#4f4f4f",
        }}
      >
        {children}
      </blockquote>
    ),
  },
  types: {
    image: ({ value }) => {
      const imageValue = value as JournalPortableTextBlock;
      const url = typeof imageValue.asset?.url === "string" ? imageValue.asset.url : "";
      const alt = typeof imageValue.alt === "string" ? imageValue.alt : "";
      const caption = typeof imageValue.caption === "string" ? imageValue.caption : "";
      const aspectRatio = imageValue.asset?.metadata?.dimensions?.aspectRatio;

      if (!url) return null;

      return (
        <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          <img
            src={url}
            alt={alt}
            loading="lazy"
            style={{
              width: "100%",
              display: "block",
              objectFit: "cover",
              aspectRatio: aspectRatio ? String(aspectRatio) : undefined,
            }}
          />
          {caption ? <figcaption style={LABEL}>{caption}</figcaption> : null}
        </figure>
      );
    },
  },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = normalizeHref(typeof value?.href === "string" ? value.href : "");
      const openBlank = value?.blank === true;

      return (
        <a
          href={href || "#"}
          target={openBlank ? "_blank" : undefined}
          rel={openBlank ? "noopener noreferrer" : undefined}
          style={{
            color: "#222",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          {children}
        </a>
      );
    },
  },
};

function normalizeHref(href: string) {
  if (!href) return href;
  if (href === "/contact") return "/about#contact";
  if (href.startsWith("/blog/")) return href.replace(/^\/blog\//, "/journal/");
  return href;
}

export function JournalPortableText({ value }: { value: JournalPortableTextBlock[] }) {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 640,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <PortableText value={value} components={components} />
    </div>
  );
}
