import { BRIEF_QUESTIONS, optionLabel, type BriefContact, type BriefState } from "../../shared/brief.ts";
import { addPersonNote, findOrCreatePerson, singleLine } from "../contact.ts";

/**
 * Where a finished brief goes. Each step is independent and throws on failure
 * (including missing configuration, named in the message), so the route can
 * log it next to the brief and carry on with the others.
 *
 * - Attio: find or create the Person by email, then a note "Brief · atla.design".
 * - Resend: a plain-text email to BRIEF_TO_EMAIL (plain fetch, no SDK).
 * - Calendly: a prefilled scheduling URL, or "" when CALENDLY_URL is not set or invalid.
 */

export type SubmittedBrief = BriefState & { contact: BriefContact };

const RESEND_URL = "https://api.resend.com/emails";
const RESEND_TIMEOUT_MS = 8_000;
const DEFAULT_BRIEF_TO_EMAIL = "josepablo@atla.design";
const NOTE_TITLE = "Brief · atla.design";

const QUESTIONS = new Map(BRIEF_QUESTIONS.map((q) => [q.id, q]));

const normalizeText = (value: string) => value.replace(/\r\n?/g, "\n").trim();

/**
 * English, deterministic, no AI. Labels are the bank's own prompts; an answer
 * reads as the option the visitor saw followed by its stored value, so the
 * note matches the waitlist's values in Attio. Free text is kept as written.
 */
export function formatBriefSummary(state: BriefState): string {
  const lines: string[] = ["New brief from atla.design", ""];

  const contact = state.contact;
  if (contact) {
    lines.push("Contact");
    lines.push(`Name: ${singleLine(contact.name)}`);
    lines.push(`Email: ${singleLine(contact.email)}`);
    if (contact.company?.trim()) lines.push(`Company: ${singleLine(contact.company)}`);
    if (contact.website?.trim()) lines.push(`Website: ${singleLine(contact.website)}`);
    if (contact.phone?.trim()) lines.push(`Phone: ${singleLine(contact.phone)}`);
    lines.push("");
  }

  // One line: a seed with line breaks could add lines that look like fields to the note JP reads (red team).
  const seed = state.seed ? singleLine(state.seed) : "";
  if (seed) lines.push("Came from", seed, "");

  const bankIds = BRIEF_QUESTIONS.map((q) => q.id);
  const otherIds = Object.keys(state.answers)
    .filter((id) => !bankIds.includes(id))
    .sort();
  for (const id of [...bankIds, ...otherIds]) {
    const question = QUESTIONS.get(id);
    const raw = state.answers[id];
    const values = Array.isArray(raw) ? raw : typeof raw === "string" ? [raw] : [];
    const text = values
      .map((v) => (question?.options ? `${singleLine(optionLabel(question, v))} [${singleLine(v)}]` : normalizeText(v)))
      .filter(Boolean)
      .join(", ");
    if (!text) continue;
    lines.push(question?.prompt ?? id, text, "");
  }

  return lines.join("\n").trimEnd();
}

export async function deliverBriefToAttio(brief: SubmittedBrief): Promise<void> {
  await deliverNoteToAttio(brief.contact, NOTE_TITLE, formatBriefSummary(brief), "the brief");
}

/**
 * Find or create the Person by email and add a note to it. Shared by the brief and the brand check
 * (`source` names the form in the note's last line). Throws on failure, naming only statuses and ids.
 */
export async function deliverNoteToAttio(
  sender: { name: string; email: string },
  title: string,
  summary: string,
  source: string,
): Promise<void> {
  const apiKey = process.env.ATTIO_API_KEY || "";
  if (!apiKey) throw new Error("ATTIO_API_KEY is not set");

  const contact = { name: singleLine(sender.name), email: singleLine(sender.email).toLowerCase() };
  const person = await findOrCreatePerson(apiKey, contact);
  if (!person.ok) throw new Error(`Attio person lookup failed (${person.status})`);

  const content = [
    summary,
    "",
    `Received: ${new Date().toISOString()}`,
    person.data.created
      ? `Sender: new record created from ${source}. Email address not verified.`
      : "Sender: matched an existing record by email. Email address not verified; treat as unconfirmed.",
  ].join("\n");

  const note = await addPersonNote(apiKey, person.data.recordId, title, content);
  // 4xx bodies from Attio echo submitted values, so only the status is kept.
  if (!note.ok) throw new Error(`Attio note failed (${note.status}) for record ${person.data.recordId}`);
}

export async function sendBriefEmail(brief: SubmittedBrief): Promise<void> {
  const who = singleLine(brief.contact.company || "") || singleLine(brief.contact.name);
  await sendStudioEmail({ subject: `New brief: ${who}`, text: formatBriefSummary(brief), replyTo: brief.contact.email });
}

/** A plain-text email to the studio (BRIEF_TO_EMAIL) through Resend, replying to the sender. Shared by the brief and the brand check. */
export async function sendStudioEmail(message: { subject: string; text: string; replyTo: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY || "";
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  const from = process.env.BRIEF_FROM_EMAIL || "";
  if (!from) throw new Error("BRIEF_FROM_EMAIL is not set");
  const to = process.env.BRIEF_TO_EMAIL || DEFAULT_BRIEF_TO_EMAIL;

  const response = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject: singleLine(message.subject),
      text: message.text,
      reply_to: singleLine(message.replyTo),
    }),
    signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Resend answered ${response.status}`);
}

/** CALENDLY_URL prefilled with the visitor's name and email (kept alongside any query it already has); "" and one error log when it is missing or invalid. */
export function briefCalendlyUrl(contact: Pick<BriefContact, "name" | "email">): string {
  const base = process.env.CALENDLY_URL || "";
  if (!base) {
    console.error("[brief] CALENDLY_URL is not set; the confirmation will not offer a call");
    return "";
  }
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    console.error("[brief] CALENDLY_URL is not a valid URL; the confirmation will not offer a call");
    return "";
  }
  url.searchParams.set("name", singleLine(contact.name));
  url.searchParams.set("email", singleLine(contact.email));
  return url.toString();
}
