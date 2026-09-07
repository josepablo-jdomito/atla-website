import type { Express, Request } from "express";
import { z } from "zod";

/**
 * Contact form endpoint.
 *
 * Inquiries are written to Attio (the CRM of record): the sender is upserted
 * as a Person by email and the message is attached as a note. When
 * ATTIO_API_KEY is not configured the endpoint answers 503 so the client can
 * fall back to the public email address instead of failing silently.
 */

const ATTIO_BASE = "https://api.attio.com/v2";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  company: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(10, "Tell us a little more").max(4000),
  page: z.string().trim().max(200).optional().default(""),
  // Honeypot: real users never see or fill this field. Validated after parsing
  // so a filled value gets a fake success instead of a revealing 400.
  website: z.string().max(500).optional().default(""),
});

export type ContactPayload = z.infer<typeof contactSchema>;

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
  return (first || req.socket.remoteAddress || "unknown").trim();
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

type AttioResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

async function attio<T>(apiKey: string, path: string, method: "PUT" | "POST", body: unknown): Promise<AttioResult<T>> {
  try {
    const response = await fetch(`${ATTIO_BASE}${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return { ok: false, status: response.status, error: detail.slice(0, 300) };
    }
    return { ok: true, data: (await response.json()) as T };
  } catch (error) {
    return { ok: false, status: 0, error: error instanceof Error ? error.message : String(error) };
  }
}

function splitName(fullName: string) {
  const parts = fullName.split(/\s+/).filter(Boolean);
  return { first_name: parts[0] ?? "", last_name: parts.slice(1).join(" "), full_name: fullName };
}

export async function deliverContactToAttio(apiKey: string, payload: ContactPayload): Promise<AttioResult<{ recordId: string }>> {
  type PersonRecord = { data: { id: { record_id: string } } };

  const person = await attio<PersonRecord>(
    apiKey,
    "/objects/people/records?matching_attribute=email_addresses",
    "PUT",
    {
      data: {
        values: {
          email_addresses: [{ email_address: payload.email }],
          name: [splitName(payload.name)],
        },
      },
    },
  );
  if (!person.ok) return person;

  const recordId = person.data.data.id.record_id;
  const lines = [
    `From: ${payload.name} <${payload.email}>`,
    payload.company ? `Company / site: ${payload.company}` : null,
    payload.page ? `Page: ${payload.page}` : null,
    `Received: ${new Date().toISOString()}`,
    "",
    payload.message,
  ].filter((line): line is string => line !== null);

  const note = await attio<unknown>(apiKey, "/notes", "POST", {
    data: {
      parent_object: "people",
      parent_record_id: recordId,
      title: "Website inquiry (atla.design/contact)",
      format: "plaintext",
      content: lines.join("\n"),
    },
  });
  if (!note.ok) return note;

  return { ok: true, data: { recordId } };
}

export function registerContactRoute(app: Express) {
  app.post("/api/contact", async (req, res) => {
    const apiKey = process.env.ATTIO_API_KEY || "";
    if (!apiKey) {
      return res.status(503).json({ error: "The contact form is not configured yet." });
    }

    const parsed = contactSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return res.status(400).json({ error: first?.message || "Invalid submission" });
    }

    // Honeypot filled in: pretend success so bots learn nothing.
    if (parsed.data.website) {
      return res.json({ ok: true });
    }

    if (isRateLimited(clientIp(req))) {
      return res.status(429).json({ error: "Too many messages from this connection. Try again in a few minutes." });
    }

    const delivered = await deliverContactToAttio(apiKey, parsed.data);
    if (!delivered.ok) {
      console.error(`Contact delivery failed (Attio ${delivered.status}): ${delivered.error}`);
      return res.status(502).json({ error: "We could not save your message. Email us instead." });
    }

    return res.json({ ok: true });
  });
}
