import type { Express, Request } from "express";
import { z } from "zod";

/**
 * Contact form endpoint.
 *
 * Inquiries are written to Attio (the CRM of record): the sender is looked up
 * by email and created only when missing (existing records are never
 * modified), then the message is attached as a plaintext note. When
 * ATTIO_API_KEY is not configured the endpoint answers 503 so the client can
 * fall back to the public email address instead of failing silently.
 *
 * Accepts JSON (the hydrated form) and application/x-www-form-urlencoded (the
 * prerendered form submitted before hydration). The urlencoded path answers
 * with a redirect back to /contact so no inquiry data ends up in a URL.
 *
 * The rate limiter is in-memory and therefore per process. On Vercel each
 * function instance keeps its own counters, so treat it as a cheap brake on
 * accidental loops, not as abuse protection; put a platform rule in front of
 * /api/contact if spam becomes a problem.
 */

const ATTIO_BASE = "https://api.attio.com/v2";
const ATTIO_TIMEOUT_MS = 8_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_SWEEP_AT = 5_000;
const HONEYPOT_FIELD = "_gotcha";

/** Collapse line breaks and control characters so a value stays on one line. */
const singleLine = (value: string) => value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
/** Keep line breaks in free text but drop other control characters. */
const multiLine = (value: string) => value.replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, " ").trim();

const contactSchema = z.object({
  name: z.string().transform(singleLine).pipe(z.string().min(1, "Name is required").max(120)),
  email: z.string().transform(singleLine).pipe(z.string().email("Enter a valid email").max(200)),
  company: z.string().transform(singleLine).pipe(z.string().max(160)).optional().default(""),
  message: z.string().transform(multiLine).pipe(z.string().min(10, "Tell us a little more").max(4000)),
  page: z.string().transform(singleLine).pipe(z.string().max(200)).optional().default(""),
});

export type ContactPayload = z.infer<typeof contactSchema>;

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: Request): string {
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) return realIp.trim();
  const forwarded = req.headers["x-forwarded-for"];
  const chain = (Array.isArray(forwarded) ? forwarded.join(",") : forwarded || "").split(",").map((part) => part.trim()).filter(Boolean);
  // The last entry is the one appended by the proxy closest to us; earlier entries are client-supplied.
  return chain[chain.length - 1] || req.socket.remoteAddress || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (rateBuckets.size > RATE_LIMIT_SWEEP_AT) {
    rateBuckets.forEach((bucket, key) => {
      if (bucket.resetAt <= now) rateBuckets.delete(key);
    });
  }
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

type AttioResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

async function attio<T>(apiKey: string, path: string, method: "POST", body: unknown): Promise<AttioResult<T>> {
  try {
    const response = await fetch(`${ATTIO_BASE}${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(ATTIO_TIMEOUT_MS),
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

type PersonRecord = { id: { record_id: string } };

/** Find the person by email; create one only when no record matches. Never edits an existing record. */
async function findOrCreatePerson(apiKey: string, payload: ContactPayload): Promise<AttioResult<{ recordId: string; created: boolean }>> {
  const found = await attio<{ data: PersonRecord[] }>(apiKey, "/objects/people/records/query", "POST", {
    filter: { email_addresses: { email_address: { $eq: payload.email } } },
    limit: 1,
  });
  if (!found.ok) return found;
  const existing = found.data.data[0];
  if (existing) return { ok: true, data: { recordId: existing.id.record_id, created: false } };

  const created = await attio<{ data: PersonRecord }>(apiKey, "/objects/people/records", "POST", {
    data: {
      values: {
        email_addresses: [{ email_address: payload.email }],
        name: [splitName(payload.name)],
      },
    },
  });
  if (!created.ok) return created;
  return { ok: true, data: { recordId: created.data.data.id.record_id, created: true } };
}

export async function deliverContactToAttio(apiKey: string, payload: ContactPayload): Promise<AttioResult<{ recordId: string }>> {
  const person = await findOrCreatePerson(apiKey, payload);
  if (!person.ok) return person;

  const recordId = person.data.recordId;
  const lines = [
    `From: ${payload.name} <${payload.email}>`,
    payload.company ? `Company / site: ${payload.company}` : null,
    payload.page ? `Reported page: ${payload.page}` : null,
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
  if (!note.ok) {
    // The person exists but the message did not land. Keep the text in the server log so it can be recovered.
    console.error(`Contact note failed for record ${recordId}; message follows:\n${lines.join("\n")}`);
    return note;
  }

  return { ok: true, data: { recordId } };
}

type ErrorCode = "unavailable" | "invalid" | "busy" | "failed";

function parseBody(raw: unknown): Record<string, unknown> {
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
}

export function registerContactRoute(app: Express) {
  app.post("/api/contact", async (req, res) => {
    const wantsRedirect = req.is("application/x-www-form-urlencoded") === "application/x-www-form-urlencoded";
    const fail = (status: number, code: ErrorCode, error: string) =>
      wantsRedirect ? res.redirect(303, `/contact?error=${code}#contact-form`) : res.status(status).json({ error });
    const succeed = () => (wantsRedirect ? res.redirect(303, "/contact?sent=1#contact-form") : res.json({ ok: true }));

    if (isRateLimited(clientIp(req))) {
      return fail(429, "busy", "Too many messages from this connection. Try again in a few minutes.");
    }

    const apiKey = process.env.ATTIO_API_KEY || "";
    if (!apiKey) {
      return fail(503, "unavailable", "The contact form is not configured yet.");
    }

    const body = parseBody(req.body);

    // Honeypot filled in: pretend success so bots learn nothing.
    if (typeof body[HONEYPOT_FIELD] === "string" && body[HONEYPOT_FIELD].trim()) {
      return succeed();
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return fail(400, "invalid", first?.message || "Invalid submission");
    }

    const delivered = await deliverContactToAttio(apiKey, parsed.data);
    if (!delivered.ok) {
      console.error(`Contact delivery failed (Attio ${delivered.status}): ${delivered.error}`);
      return fail(502, "failed", "We could not save your message. Email us instead.");
    }

    return succeed();
  });
}
