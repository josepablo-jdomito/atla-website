import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { JournalPortableTextBlock } from "@shared/journal";
import { expandMarkdownLinks, isExternalHref, isSafeHref } from "@/lib/markdownLinks";

// Styles live in client/src/styles/site.css under .longform-prose (v2 tokens, 17px / 1.6 / 68ch).
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2 className="prose-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="prose-h3">{children}</h3>,
    h4: ({ children }) => <h4 className="prose-h4">{children}</h4>,
    blockquote: ({ children }) => <blockquote className="prose-quote">{children}</blockquote>,
  },
  types: {
    image: ({ value }) => {
      const imageValue = value as JournalPortableTextBlock;
      const url = typeof imageValue.asset?.url === "string" ? imageValue.asset.url : "";
      const alt = typeof imageValue.alt === "string" ? imageValue.alt : "";
      const caption = typeof imageValue.caption === "string" ? imageValue.caption : "";
      const aspectRatio = imageValue.asset?.metadata?.dimensions?.aspectRatio;
      const width = imageValue.asset?.metadata?.dimensions?.width;
      const height = imageValue.asset?.metadata?.dimensions?.height;

      if (!url) return null;

      return (
        <figure className="prose-figure">
          <img
            src={url}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            style={{ aspectRatio: aspectRatio ? String(aspectRatio) : undefined }}
          />
          {caption ? <figcaption className="site-label">{caption}</figcaption> : null}
        </figure>
      );
    },
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = normalizeHref(typeof value?.href === "string" ? value.href : "");
      const external = isExternalHref(href);
      const openBlank = value?.blank === true || external;

      return (
        <a
          href={href && isSafeHref(href) ? href : "#"}
          target={openBlank ? "_blank" : undefined}
          rel={openBlank || external ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

function normalizeHref(href: string) {
  if (!href) return href;
  const trimmed = href.trim();
  // Absolute links to this site stay relative so they never leave the current host.
  const sameSite = trimmed.match(/^https?:\/\/(?:www\.)?atla\.design(\/[^\s]*)?$/i);
  const local = sameSite ? sameSite[1] || "/" : trimmed;
  if (local.startsWith("/blog/")) return local.replace(/^\/blog\//, "/journal/");
  if (local === "/contact" || local.startsWith("/contact?")) return "/brief";
  if (local === "/work" || local.startsWith("/work?")) return "/";
  return local;
}

export function JournalPortableText({ value }: { value: JournalPortableTextBlock[] }) {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  const blocks = expandMarkdownLinks(value);
  const chunks: JournalPortableTextBlock[][] = [];
  for (let index = 0; index < blocks.length; index += 12) {
    chunks.push(blocks.slice(index, index + 12));
  }

  return (
    <div className="prose-stack">
      {chunks.map((chunk, index) => (
        <PortableText key={index} value={chunk} components={components} />
      ))}
    </div>
  );
}
