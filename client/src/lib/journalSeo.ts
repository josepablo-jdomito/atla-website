import type { JournalArticle, JournalBodySection } from "@shared/journal";

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
  return article.seoDescription || article.excerpt || article.introParagraphs[0] || `Read ${article.title} from Atla Journal.`;
}

export function articlePublishedIso(dateLabel: string) {
  const [month, year] = dateLabel.split(" ");
  const monthNumber = MONTHS[month];
  if (!monthNumber || !year) return undefined;
  return `${year}-${monthNumber}-01`;
}

export function articleBodyText(article: JournalArticle) {
  return [
    ...article.introParagraphs,
    ...article.bodySections.flatMap((section: JournalBodySection) => section.paragraphs),
  ]
    .join(" ")
    .trim();
}
