import { AUDITS_PER_WEEK, brandFromSite, type AuditFeedback, type AuditRequest } from "../../shared/audit.ts";
import { multiLine, singleLine } from "../contact.ts";
import { deliverNoteToAttio, sendStudioEmail } from "../brief/deliver.ts";

/**
 * Where a free audit request goes: the same two steps as the brand check (server/brandCheck/deliver.ts).
 * Attio: a note "Free audit: <brand>" on the sender's Person. Resend: a plain-text email to the
 * studio. Both carry the week's slot, so JP sees at once whether the request is in this week's
 * five or queued for the next. Each throws on failure, naming only statuses and missing config.
 */

/**
 * Which week the request landed in and where it sits. `full`: this week's five were taken, so the
 * request took slot `count` of next week. `repeat`: the brand or the address already took a slot this
 * week, so this request took none (count is the week's count as it stands).
 */
export type AuditSlot = { week: string; count: number; full: boolean; repeat: "brand" | "address" | null };

const slotLine = (slot: AuditSlot) => {
  if (slot.repeat === "brand") return `Week ${slot.week}: this brand already asked this week, no new slot taken (week at ${slot.count} of ${AUDITS_PER_WEEK})`;
  if (slot.repeat === "address") return `Week ${slot.week}: this address already took a slot this week, no new slot taken (week at ${slot.count} of ${AUDITS_PER_WEEK}); check it is not the same person`;
  if (slot.full) return `Week ${slot.week}: this week's ${AUDITS_PER_WEEK} are taken, queued as request ${slot.count} of next week`;
  return `Week ${slot.week}: request ${slot.count} of ${AUDITS_PER_WEEK}, in this week's five`;
};

/** English, deterministic, no AI: the fields as the visitor saw them. */
export function formatAuditSummary(request: AuditRequest, slot: AuditSlot): string {
  return [
    "New free audit request from atla.design/audit",
    "",
    `Name: ${singleLine(request.name)}`,
    `Email: ${singleLine(request.email)}`,
    `Website or Instagram: ${singleLine(request.site)}`,
    `Source: ${singleLine(request.source ?? "") || "direct"}`,
    slotLine(slot),
  ].join("\n");
}

/** The post-submit answer, as a second note on the same Person: "Audit feedback: <brand>". */
export async function deliverAuditFeedbackToAttio(feedback: AuditFeedback): Promise<void> {
  const title = `Audit feedback: ${singleLine(brandFromSite(feedback.site, feedback.name)).slice(0, 120)}`;
  const body = ["What almost stopped you from sending it?", "", multiLine(feedback.text), "", `Request: ${feedback.submissionId}`].join("\n");
  await deliverNoteToAttio(feedback, title, body, "the free audit feedback");
}

/** The Attio note title and the email subject name the brand, never more than one line. */
export const auditTitle = (request: AuditRequest) =>
  `Free audit: ${singleLine(brandFromSite(request.site, request.name)).slice(0, 120)}`;

export async function deliverAuditToAttio(request: AuditRequest, slot: AuditSlot): Promise<void> {
  await deliverNoteToAttio(request, auditTitle(request), formatAuditSummary(request, slot), "the free audit");
}

export async function sendAuditEmail(request: AuditRequest, slot: AuditSlot): Promise<void> {
  await sendStudioEmail({ subject: auditTitle(request), text: formatAuditSummary(request, slot), replyTo: request.email });
}
