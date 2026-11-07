import { AUDIT_INVESTING, AUDIT_MOMENTS, AUDITS_PER_WEEK, auditLabel, brandFromSite, type AuditRequest } from "../../shared/audit.ts";
import { multiLine, singleLine } from "../contact.ts";
import { deliverNoteToAttio, sendStudioEmail } from "../brief/deliver.ts";

/**
 * Where a free audit request goes: the same two steps as the brand check (server/brandCheck/deliver.ts).
 * Attio: a note "Free audit: <brand>" on the sender's Person. Resend: a plain-text email to the
 * studio. Both carry the week's slot, so JP sees at once whether the request is in this week's
 * five or queued for the next. Each throws on failure, naming only statuses and missing config.
 */

/** Which week the request landed in and where it sits in that week's count. */
export type AuditSlot = { week: string; count: number; full: boolean };

const slotLine = (slot: AuditSlot) =>
  slot.full
    ? `Week ${slot.week}: request ${slot.count} of ${AUDITS_PER_WEEK}, this week is full, queued for next week`
    : `Week ${slot.week}: request ${slot.count} of ${AUDITS_PER_WEEK}, in this week's five`;

/** English, deterministic, no AI: the fields as the visitor saw them, values in brackets for Attio. */
export function formatAuditSummary(request: AuditRequest, slot: AuditSlot): string {
  const choice = (options: Parameters<typeof auditLabel>[0], value: string) =>
    `${singleLine(auditLabel(options, value))} [${singleLine(value)}]`;
  const lines = [
    "New free audit request from atla.design/audit",
    "",
    `Name: ${singleLine(request.name)}`,
    `Email: ${singleLine(request.email)}`,
    `Website or Instagram: ${singleLine(request.site)}`,
    `Moment: ${choice(AUDIT_MOMENTS, request.moment)}`,
    `Investing in brand this year: ${choice(AUDIT_INVESTING, request.investing)}`,
    slotLine(slot),
  ];
  const message = multiLine(request.message);
  if (message) lines.push("", "Message", message);
  return lines.join("\n");
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
