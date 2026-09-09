import type { Express, Request } from "express";
import { z } from "zod";
import { CONTACT_EMAIL } from "../shared/siteSeo.ts";

/**
 * Contact form endpoint.
 *
 * Inquiries are written to Attio (the CRM of record): the sender is looked up
 * by email and created only when missing (existing records are never
 * modified), then the message is attached as a plaintext note. The sender's
 * address is not verified, so every note says whether the record was created
 * or matched.
 *
 * Two request shapes:
 * - JSON from the hydrated form. Answers JSON.
 * - application/x-www-form-urlencoded from the prerendered form submitted
 *   before hydration (or without JavaScript). Answers a 303 to
 *   GET /api/contact/result?o=<outcome>, a small self-contained HTML page,
 *   because the static /contact page cannot show an outcome and a page served
 *   on the POST itself would re-submit on reload. Cross-site posts are refused
 *   by checking Origin/Referer against the request host.
 *
 * When ATTIO_API_KEY is not configured the endpoint answers 503 so the client
 * can fall back to the public email address instead of failing silently.
 *
 * The rate limiter is in-memory and therefore per process. On Vercel each
 * function instance keeps its own counters, so treat it as a cheap brake on
 * accidental loops, not as abuse protection; a platform rate rule in front of
 * /api/contact is the real control. Off Vercel it keys on the socket address,
 * which behind a reverse proxy is the proxy itself.
 */

const ATTIO_BASE = "https://api.attio.com/v2";
const ATTIO_TIMEOUT_MS = 8_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_SWEEP_AT = 5_000;
const HONEYPOT_FIELD = "_gotcha";
const LOG_EXCERPT_CHARS = 160;
const RESULT_PATH = "/api/contact/result";

/** Collapse line breaks and control characters so a value stays on one line. */
const singleLine = (value: string) => value.replace(/[\u0000-\u001f\u007f\u0085\u2028\u2029]+/g, " ").trim();
/** Keep line breaks in free text but drop other control characters. */
const multiLine = (value: string) =>
  value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f\u0085\u2028\u2029]+/g, " ")
    .trim();

const contactSchema = z.object({
  name: z.string().transform(singleLine).pipe(z.string().min(1, "Name is required").max(120)),
  email: z
    .string()
    .transform((value) => singleLine(value).toLowerCase())
    .pipe(z.string().email("Enter a valid email").max(200)),
  company: z.string().transform(singleLine).pipe(z.string().max(160)).optional().default(""),
  message: z.string().transform(multiLine).pipe(z.string().min(10, "Tell us a little more").max(4000)),
});

export type ContactPayload = z.infer<typeof contactSchema>;

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function headerValue(req: Request, name: string): string {
  const raw = req.headers[name];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return (value || "").trim();
}

/**
 * On Vercel the platform overwrites x-vercel-forwarded-for and x-real-ip with the
 * connecting client, so they are safe to key on. Anywhere else those headers are
 * whatever the client sent, so only the socket address is trusted.
 */
function clientIp(req: Request): string {
  if (process.env.VERCEL === "1") {
    const platformIp = headerValue(req, "x-vercel-forwarded-for") || headerValue(req, "x-real-ip");
    if (platformIp) return platformIp;
  }
  return req.socket.remoteAddress || "unknown";
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

/** atla.design and www.atla.design are the same site. */
const siteKey = (host: string) => host.toLowerCase().replace(/^www\./, "");

/**
 * Native form posts carry Origin, or at least Referer, naming the page that held
 * the form. Returns the foreign host when it names another site; null when it is
 * ours or unknown ("null" from privacy tooling or sandboxed frames, or absent).
 */
function foreignPostSource(req: Request): string | null {
  const origin = headerValue(req, "origin");
  const source = origin && origin !== "null" ? origin : headerValue(req, "referer");
  if (!source) return null;
  try {
    const sourceHost = new URL(source).host;
    return siteKey(sourceHost) === siteKey(headerValue(req, "host")) ? null : sourceHost;
  } catch {
    return singleLine(source).slice(0, 80) || "unparseable";
  }
}

type AttioResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

/** POST to Attio. `parse` turns the JSON body into T, or returns undefined when the shape is not what we expect. */
async function attio<T>(apiKey: string, path: string, body: unknown, parse?: (json: unknown) => T | undefined): Promise<AttioResult<T>> {
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
      return { ok: false, status: response.status, error: singleLine(detail).slice(0, 300) };
    }
    if (!parse) return { ok: true, data: true as T };
    const data = parse((await response.json().catch(() => null)) as unknown);
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
    `Received: ${new Date().toISOString()}`,
    person.data.created
      ? "Sender: new record created from this form. Email address not verified."
      : "Sender: matched an existing record by email. Email address not verified; treat as unconfirmed.",
    "",
    payload.message,
  ].filter((line): line is string => line !== null);

  // Any 2xx means the note landed; the body is not needed.
  const note = await attio(apiKey, "/notes", {
    data: {
      parent_object: "people",
      parent_record_id: person.data.recordId,
      title: "Website inquiry (atla.design/contact)",
      format: "plaintext",
      content: lines.join("\n"),
    },
  });
  if (!note.ok) {
    return { ...note, error: `note failed for record ${person.data.recordId} (person ${person.data.created ? "created" : "matched"}): ${note.error}` };
  }

  return { ok: true, data: { recordId: person.data.recordId } };
}

/** What the log keeps when delivery fails: enough to follow up, not the whole message. */
function failureExcerpt(payload: ContactPayload): string {
  const excerpt = singleLine(payload.message).slice(0, LOG_EXCERPT_CHARS);
  return `${payload.email} · "${excerpt}${payload.message.length > LOG_EXCERPT_CHARS ? "…" : ""}"`;
}

const OUTCOMES = ["sent", "unavailable", "invalid", "busy", "failed", "forbidden"] as const;
type Outcome = (typeof OUTCOMES)[number];
const isOutcome = (value: unknown): value is Outcome => typeof value === "string" && (OUTCOMES as readonly string[]).includes(value);

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
<style>body{margin:0;background:#fafafa;color:#222;font:500 16px/1.5 system-ui,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;padding:80px 20px}main{max-width:560px}h1{font-size:40px;font-weight:400;line-height:1.05;margin:0 0 20px}p{margin:0 0 16px}a{color:#222}</style>
</head><body><main><h1>${heading}</h1><p>${body}</p><p><a href="/contact">Back to the contact page</a> · <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p></main></body></html>`;
}

export function registerContactRoute(app: Express) {
  // Result page for the native (no-JavaScript) form: a GET, so reload never re-submits.
  app.get(RESULT_PATH, (req, res) => {
    const outcome = isOutcome(req.query.o) ? req.query.o : "invalid";
    res.status(OUTCOME_STATUS[outcome]).type("html").send(outcomePage(outcome));
  });

  app.post("/api/contact", async (req, res) => {
    const isNativeForm = Boolean(req.is("application/x-www-form-urlencoded"));
    const answer = (outcome: Outcome, error?: string) => {
      if (isNativeForm) return res.redirect(303, `${RESULT_PATH}?o=${outcome}`);
      if (outcome === "sent") return res.json({ ok: true });
      return res.status(OUTCOME_STATUS[outcome]).json({ error: error || `${OUTCOME_COPY[outcome].heading} ${OUTCOME_COPY[outcome].body}` });
    };

    if (isNativeForm) {
      const foreignHost = foreignPostSource(req);
      if (foreignHost) {
        console.warn(`Contact form: refused cross-site post from ${foreignHost}`);
        return answer("forbidden");
      }
    }

    const apiKey = process.env.ATTIO_API_KEY || "";
    if (!apiKey) {
      return answer("unavailable");
    }

    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) && !Buffer.isBuffer(req.body) ? (req.body as Record<string, unknown>) : null;
    if (!body) {
      const shape = Buffer.isBuffer(req.body) ? "Buffer" : Array.isArray(req.body) ? "array" : typeof req.body;
      console.error(`Contact form: request body not parsed (got ${shape}, content-type ${singleLine(headerValue(req, "content-type")) || "none"})`);
      return answer("invalid", "The request body could not be read.");
    }

    const ip = clientIp(req);

    // Honeypot filled in: pretend success so bots learn nothing. Counted like a delivery.
    const honeypot = body[HONEYPOT_FIELD];
    if (typeof honeypot === "string" && honeypot.trim()) {
      isRateLimited(ip);
      console.warn(`Contact form: honeypot hit from ${ip}`);
      return answer("sent");
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return answer("invalid", parsed.error.issues[0]?.message || "Invalid submission");
    }

    // Only deliveries and honeypot hits count: a typo does not burn a real visitor's quota.
    if (isRateLimited(ip)) {
      return answer("busy");
    }

    const delivered = await deliverContactToAttio(apiKey, parsed.data);
    if (!delivered.ok) {
      // 4xx bodies from Attio echo submitted values, so only the status is kept for those.
      const detail = delivered.status === 0 || delivered.status >= 500 ? `: ${singleLine(delivered.error)}` : "";
      console.error(`Contact delivery failed (Attio ${delivered.status}${detail}) for ${failureExcerpt(parsed.data)}`);
      return answer("failed");
    }

    return answer("sent");
  });
}
