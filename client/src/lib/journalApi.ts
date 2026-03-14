import type { JournalArticle } from "@shared/journal";

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchJournalArticles() {
  const res = await fetch("/api/journal", { credentials: "include" });
  return parseJson<JournalArticle[]>(res);
}

export async function fetchJournalArticle(slug: string) {
  const res = await fetch(`/api/journal/${slug}`, { credentials: "include" });
  if (res.status === 404) return null;
  return parseJson<JournalArticle>(res);
}
