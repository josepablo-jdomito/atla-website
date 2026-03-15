import type { JournalArticle, JournalBodySection, JournalPortableTextBlock } from "@shared/journal";

const MONTHS: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

export function articleDescription(article: JournalArticle) {
  return article.seoDescription || article.excerpt || portableTextToPlainText(article.body).slice(0, 220) || article.introParagraphs[0] || `Read ${article.title} from Atla Journal.`;
}

export function articlePublishedIso(dateLabel: string) {
  const [month, year] = dateLabel.split(" ");
  const monthNumber = MONTHS[month];
  if (!monthNumber || !year) return undefined;
  return `${year}-${monthNumber}-01`;
}

export function articleBodyText(article: JournalArticle) {
  const portableText = portableTextToPlainText(article.body).trim();
  if (portableText.length > 0) {
    return portableText;
  }

  return [
    ...article.introParagraphs,
    ...article.bodySections.flatMap((section: JournalBodySection) => section.paragraphs),
  ]
    .join(" ")
    .trim();
}

function portableTextToPlainText(body: JournalPortableTextBlock[]) {
  if (!Array.isArray(body)) return "";

  return body
    .map((block) => {
      if (!block || block._type !== "block" || !Array.isArray(block.children)) {
        return "";
      }

      return block.children
        .map((child) => (typeof child.text === "string" ? child.text : ""))
        .join("");
    })
    .filter(Boolean)
    .join("\n\n");
}
