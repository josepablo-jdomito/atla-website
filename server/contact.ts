import type { Express, Request } from "express";
import { z } from "zod";
import { CONTACT_EMAIL } from "../shared/siteSeo.ts";

/**
 * Contact form endpoint.
 *
 * Inquiries are written to Attio (the CRM of record): the sender is looked up
 * by email and created only when missing (existing records are never
 * modified), then the message is attached as a plaintext note. The sender's
 * address is not verified, so a note on a pre-existing record says so.
 *
 * Two request shapes:
 * - JSON from the hydrated form. Answers JSON.
 * - application/x-www-form-urlencoded from the prerendered form submitted
 *   before hydration (or without JavaScript). Answers a small self-contained
 *   HTML page, because the static /contact page cannot show an outcome.
 *   Cross-site posts are refused by checking Origin/Referer against the
 *   request host.
 *
 * When ATTIO_API_KEY is not configured the endpoint answers 503 so the client
 * can fall back to the public email address instead of failing silently.
 *
 * The rate limiter is in-memory and therefore per process. On Vercel each
 * function instance keeps its own counters, so treat it as a cheap brake on
 * accidental loops, not as abuse protection; put a platform rule in front of
 * /api/contact if spam becomes a problem. Off Vercel, the reverse proxy must
 * strip client-supplied x-vercel-forwarded-for / x-real-ip headers.
 */

const ATTIO_BASE = "https://api.attio.com/v2";
const ATTIO_TIMEOUT_MS = 8_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_SWEEP_AT = 5_000;
const HONEYPOT_FIELD = "_gotcha";
const LOG_EXCERPT_CHARS = 160;

/** Collapse line breaks and control characters so a value stays on one line. */
const singleLine = (value: string) => value.replace(/[\u0000-\u001f\u007f\u0085\u2028\u2029]+/g, " ").trim();
/** Keep line breaks in free text but drop other control characters. */
const multiLine = (value: string) =>
  value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f\u0085\u2028\u2029]+/g, " ")
    .trim();
/** The page a submission came from: only a same-site path is kept, anything else is dropped. */
const sitePath = (value: string) => (/^\/[\w\-./]{0,199}$/.test(value) ? value : "");

const contactSchema = z.object({
  name: z.string().transform(singleLine).pipe(z.string().min(1, "Name is required").max(120)),
  email: z
    .string()
    .transform((value) => singleLine(value).toLowerCase())
    .pipe(z.string().email("Enter a valid email").max(200)),
  company: z.string().transform(singleLine).pipe(z.string().max(160)).optional().default(""),
  message: z.string().transform(multiLine).pipe(z.string().min(10, "Tell us a little more").max(4000)),
  page: z.string().transform(singleLine).transform(sitePath).optional().default(""),
});

type ContactPayload = z.infer<typeof contactSchema>;

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function headerValue(req: Request, name: string): string {
  const raw = req.headers[name];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return (value || "").trim();
}

/**
 * Vercel sets x-vercel-forwarded-for and x-real-ip from the connecting client and
 * overwrites client-supplied values. The first x-forwarded-for entry is the usual
 * convention elsewhere; it is only as trustworthy as the proxy in front.
 */
function clientIp(req: Request): string {
  const platformIp = headerValue(req, "x-vercel-forwarded-for") || headerValue(req, "x-real-ip");
  if (platformIp) return platformIp;
  const first = headerValue(req, "x-forwarded-for").split(",")[0]?.trim();
  return first || req.socket.remoteAddress || "unknown";
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

/** Native form posts carry Origin (or at least Referer); a value from another host is a cross-site post. */
function isSameSitePost(req: Request): boolean {
  const source = headerValue(req, "origin") || headerValue(req, "referer");
  if (!source) return true;
  try {
    return new URL(source).host === headerValue(req, "host");
  } catch {
    return false;
  }
}

type AttioResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

async function attio<T>(apiKey: string, path: string, body: unknown, check: (json: unknown) => T | undefined): Promise<AttioResult<T>> {
  try {
    const response = await fetch(`${ATTIO_BASE}${path}`, {
      method: "POST",
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
    const json = (await response.json().catch(() => null)) as unknown;
    const data = check(json);
    if (data === undefined) return { ok: false, status: response.status, error: `Unexpected response shape from ${path}` };
    return { ok: true, data };
  } catch (error) {
    return { ok: false, status: 0, error: error instanceof Error ? error.message : String(error) };
  }
}

function splitName(fullName: string) {
  const parts = fullName.split(/\s+/).filter(Boolean);
  return { first_name: parts[0] ?? "", last_name: parts.slice(1).join(" "), full_name: fullName };
}

const recordId = (record: unknown): string | undefined => {
  const id = (record as { id?: { record_id?: unknown } } | null)?.id?.record_id;
  return typeof id === "string" ? id : undefined;
};

/** Find the person by email; create one only when no record matches. Never edits an existing record. */
async function findOrCreatePerson(apiKey: string, payload: ContactPayload): Promise<AttioResult<{ recordId: string; created: boolean }>> {
  const found = await attio(
    apiKey,
    "/objects/people/records/query",
    { filter: { email_addresses: { email_address: { $eq: payload.email } } }, limit: 1 },
    (json) => {
      const list = (json as { data?: unknown } | null)?.data;
      if (!Array.isArray(list)) return undefined;
      if (list.length === 0) return { existingId: null };
      const id = recordId(list[0]);
      return id ? { existingId: id } : undefined;
    },
  );
  if (!found.ok) return found;
  if (found.data.existingId) return { ok: true, data: { recordId: found.data.existingId, created: false } };

  const created = await attio(
    apiKey,
    "/objects/people/records",
    { data: { values: { email_addresses: [{ email_address: payload.email }], name: [splitName(payload.name)] } } },
    (json) => recordId((json as { data?: unknown } | null)?.data),
  );
  if (!created.ok) return created;
  return { ok: true, data: { recordId: created.data, created: true } };
}

export async function deliverContactToAttio(apiKey: string, payload: ContactPayload): Promise<AttioResult<{ recordId: string }>> {
  const person = await findOrCreatePerson(apiKey, payload);
  if (!person.ok) return person;

  const lines = [
    `From: ${payload.name} <${payload.email}>`,
    payload.company ? `Company / site: ${payload.company}` : null,
    payload.page ? `Reported page: ${payload.page}` : null,
    `Received: ${new Date().toISOString()}`,
    person.data.created
      ? "Sender: new record created from this form. Email address not verified."
      : "Sender: matched an existing record by email. Email address not verified; treat as unconfirmed.",
    "",
    payload.message,
  ].filter((line): line is string => line !== null);

  const note = await attio(
    apiKey,
    "/notes",
    {
      data: {
        parent_object: "people",
        parent_record_id: person.data.recordId,
        title: "Website inquiry (atla.design/contact)",
        format: "plaintext",
        content: lines.join("\n"),
      },
    },
    (json) => (json && typeof json === "object" ? true : undefined),
  );
  if (!note.ok) return note;

  return { ok: true, data: { recordId: person.data.recordId } };
}

/** What the log keeps when delivery fails: enough to follow up, not the whole message. */
function failureExcerpt(payload: ContactPayload): string {
  return `${payload.email} · "${payload.message.slice(0, LOG_EXCERPT_CHARS)}${payload.message.length > LOG_EXCERPT_CHARS ? "…" : ""}"`;
}

type Outcome = "sent" | "unavailable" | "invalid" | "busy" | "failed" | "forbidden";

const OUTCOME_STATUS: Record<Outcome, number> = { sent: 200, unavailable: 503, invalid: 400, busy: 429, failed: 502, forbidden: 403 };

const OUTCOME_COPY: Record<Outcome, { heading: string; body: string }> = {
  sent: { heading: "Received.", body: "We read every note directly and reply with the next recommended step." },
  unavailable: { heading: "The form is offline right now.", body: `Send your note to ${CONTACT_EMAIL} and we will pick it up there.` },
  invalid: { heading: "Something in the form needs a second look.", body: "Go back, check the fields, and send it again." },
  busy: { heading: "Too many messages from this connection.", body: "Try again in a few minutes, or email us." },
  failed: { heading: "We could not save your message.", body: `Email it to ${CONTACT_EMAIL} instead.` },
  forbidden: { heading: "This form only accepts submissions from atla.design.", body: "Open the contact page and send it from there." },
};

/** Self-contained page for the no-JavaScript path. No request data is echoed. */
function outcomePage(outcome: Outcome): string {
  const { heading, body } = OUTCOME_COPY[outcome];
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${heading} | Atla</title>
<style>body{margin:0;background:#fafafa;color:#222;font:500 16px/1.5 'Libre Franklin',Helvetica,Arial,sans-serif;padding:80px 20px}main{max-width:560px}h1{font:400 40px/1.05 Helvetica,Arial,sans-serif;margin:0 0 20px}p{margin:0 0 16px}a{color:#222}</style>
</head><body><main><h1>${heading}</h1><p>${body}</p><p><a href="/contact">Back to the contact page</a> · <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p></main></body></html>`;
}

export function registerContactRoute(app: Express) {
  app.post("/api/contact", async (req, res) => {
    const isNativeForm = Boolean(req.is("application/x-www-form-urlencoded"));
    const answer = (outcome: Outcome, error?: string) => {
      const status = OUTCOME_STATUS[outcome];
      if (isNativeForm) return res.status(status).type("html").send(outcomePage(outcome));
      return outcome === "sent" ? res.json({ ok: true }) : res.status(status).json({ error: error || OUTCOME_COPY[outcome].heading });
    };

    if (isNativeForm && !isSameSitePost(req)) {
      return answer("forbidden");
    }

    const apiKey = process.env.ATTIO_API_KEY || "";
    if (!apiKey) {
      return answer("unavailable", "The contact form is not configured yet.");
    }

    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? (req.body as Record<string, unknown>) : null;
    if (!body) {
      return answer("invalid", "The request body could not be read.");
    }

    // Honeypot filled in: pretend success so bots learn nothing. Not counted against the sender's quota.
    const honeypot = body[HONEYPOT_FIELD];
    if (typeof honeypot === "string" && honeypot.trim()) {
      return answer("sent");
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return answer("invalid", parsed.error.issues[0]?.message || "Invalid submission");
    }

    // Only deliveries count: typos and honeypot hits do not burn a real visitor's quota.
    if (isRateLimited(clientIp(req))) {
      return answer("busy", "Too many messages from this connection. Try again in a few minutes.");
    }

    const delivered = await deliverContactToAttio(apiKey, parsed.data);
    if (!delivered.ok) {
      console.error(`Contact delivery failed (Attio ${delivered.status}: ${delivered.error}) for ${failureExcerpt(parsed.data)}`);
      return answer("failed", "We could not save your message. Email us instead.");
    }

    return answer("sent");
  });
}
