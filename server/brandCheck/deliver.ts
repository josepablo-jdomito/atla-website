import {
  BRAND_CHECK_INVESTING,
  BRAND_CHECK_MOMENTS,
  BRAND_CHECK_SIZES,
  brandCheckLabel,
  brandFromSite,
  type BrandCheckRequest,
} from "../../shared/brandCheck.ts";
import { multiLine, singleLine } from "../contact.ts";
import { deliverNoteToAttio, sendStudioEmail } from "../brief/deliver.ts";

/**
 * Where a brand check request goes: the same two steps as the brief (server/brief/deliver.ts).
 * Attio: a note "Brand check: <brand>" on the sender's Person. Resend: a plain-text email to the
 * studio. Each throws on failure, naming only statuses and missing config.
 */

/** English, deterministic, no AI: the fields as the visitor saw them, values in brackets for Attio. */
export function formatBrandCheckSummary(request: BrandCheckRequest): string {
  const choice = (options: Parameters<typeof brandCheckLabel>[0], value: string) =>
    `${singleLine(brandCheckLabel(options, value))} [${singleLine(value)}]`;
  const lines = [
    "New brand check request from atla.design",
    "",
    `Name: ${singleLine(request.name)}`,
    `Email: ${singleLine(request.email)}`,
    `Website or Instagram: ${singleLine(request.site)}`,
    `Moment: ${choice(BRAND_CHECK_MOMENTS, request.moment)}`,
    `Company size: ${choice(BRAND_CHECK_SIZES, request.size)}`,
    `Investing in brand this year: ${choice(BRAND_CHECK_INVESTING, request.investing)}`,
  ];
  const message = multiLine(request.message);
  if (message) lines.push("", "Message", message);
  return lines.join("\n");
}

/** The Attio note title and the email subject name the brand, never more than one line. */
export const brandCheckTitle = (request: BrandCheckRequest) =>
  `Brand check: ${singleLine(brandFromSite(request.site, request.name)).slice(0, 120)}`;

export async function deliverBrandCheckToAttio(request: BrandCheckRequest): Promise<void> {
  await deliverNoteToAttio(request, brandCheckTitle(request), formatBrandCheckSummary(request), "the brand check");
}

export async function sendBrandCheckEmail(request: BrandCheckRequest): Promise<void> {
  await sendStudioEmail({ subject: brandCheckTitle(request), text: formatBrandCheckSummary(request), replyTo: request.email });
}
