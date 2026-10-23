import type { JournalPortableTextBlock, JournalPortableTextMarkDef, JournalPortableTextSpan } from "../../../shared/journal";

/**
 * Some journal entries were imported from Markdown, so their Portable Text spans carry
 * literal `[text](/path)` links instead of link annotations. These helpers turn those
 * into real link marks (for rendering) or plain text (for meta descriptions and JSON-LD).
 */

const MARKDOWN_LINK = /\[([^[\]\n]+)\]\(\s*([^()\s]+)\s*\)/g;
const SAFE_HREF = /^(\/|#|https?:\/\/|mailto:)/i;
const SITE_HOSTS = new Set(["atla.design", "www.atla.design"]);

export function isSafeHref(href: string) {
  return SAFE_HREF.test(href.trim());
}

/** True for absolute http(s) links to another site. */
export function isExternalHref(href: string) {
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    return !SITE_HOSTS.has(new URL(href).hostname.toLowerCase());
  } catch {
    return true;
  }
}

/** Replaces `[text](url)` with `text`. */
export function stripMarkdownLinks(text: string) {
  return text.replace(MARKDOWN_LINK, (match, label: string, href: string) => (isSafeHref(href) ? label : match));
}

/**
 * Returns a copy of the blocks in which every inline `[text](url)` inside a text span
 * becomes a span carrying a `link` mark. Existing marks and link annotations are kept.
 */
export function expandMarkdownLinks(blocks: JournalPortableTextBlock[]): JournalPortableTextBlock[] {
  return blocks.map((block, blockIndex) => {
    if (!block || block._type !== "block" || !Array.isArray(block.children)) return block;
    if (!block.children.some((child) => typeof child?.text === "string" && child.text.includes("]("))) return block;

    const markDefs: JournalPortableTextMarkDef[] = Array.isArray(block.markDefs) ? [...block.markDefs] : [];
    const children: JournalPortableTextSpan[] = [];
    const blockKey = block._key || `b${blockIndex}`;
    let linkCount = 0;

    block.children.forEach((child, childIndex) => {
      const text = typeof child?.text === "string" ? child.text : "";
      if (!text.includes("](")) {
        children.push(child);
        return;
      }

      const childKey = child._key || `c${childIndex}`;
      const baseMarks = Array.isArray(child.marks) ? child.marks : [];
      let cursor = 0;
      let part = 0;
      const pushSpan = (spanText: string, marks: string[]) => {
        if (!spanText) return;
        children.push({ ...child, _key: `${childKey}-md${part}`, text: spanText, marks });
        part += 1;
      };

      const pattern = new RegExp(MARKDOWN_LINK.source, "g");
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(text)) !== null) {
        const [whole, label, rawHref] = match;
        const start = match.index;
        const href = rawHref.trim();
        if (!isSafeHref(href)) continue;

        pushSpan(text.slice(cursor, start), baseMarks);
        const markKey = `${blockKey}-mdlink${linkCount}`;
        linkCount += 1;
        markDefs.push({ _key: markKey, _type: "link", href });
        pushSpan(label, [...baseMarks, markKey]);
        cursor = start + whole.length;
      }

      if (part === 0) {
        children.push(child);
        return;
      }
      pushSpan(text.slice(cursor), baseMarks);
    });

    return linkCount > 0 ? { ...block, children, markDefs } : block;
  });
}
