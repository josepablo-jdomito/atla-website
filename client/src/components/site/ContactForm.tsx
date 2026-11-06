import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { trackEvent } from "@/hooks/use-analytics";
import { ga4Event } from "@/lib/ga";
import { siteCopy } from "@/content/siteCopy";
import { CONTACT_EMAIL } from "@shared/siteSeo";

// Extracted from AtlaContact.tsx (Task 10). Fields, payload, endpoint, analytics and messages are
// unchanged except one ruling: the budget question is gone (no budget questions or prices on v2).
// /api/contact treats budget as optional (default ""), so the payload stays valid without it.

const SUCCESS_TEXT = siteCopy.contact.sent;

type FormStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "sent" }
  | { state: "offline" }
  | { state: "invalid"; message: string }
  | { state: "error"; message: string };

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="brief-field contact-form__field">
      <span className="brief-field__label">{label}</span>
      {children}
    </label>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>({ state: "idle" });
  const statusRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status.state === "sent") statusRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(Array.from(data.entries(), ([key, value]) => [key, typeof value === "string" ? value : ""]));

    setStatus({ state: "submitting" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.status === 503) {
        setStatus({ state: "offline" });
        return;
      }
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        if (response.status === 400 && body?.error) {
          setStatus({ state: "invalid", message: body.error });
          return;
        }
        setStatus({ state: "error", message: body?.error || "Something went wrong. Email us instead." });
        return;
      }
      form.reset();
      setStatus({ state: "sent" });
      trackEvent("contact_form_submit", { page: "contact" });
      // No form fields go to GA; the privacy policy promises that.
      ga4Event("generate_lead", { form: "contact" });
    } catch {
      setStatus({ state: "error", message: "We could not reach the server. Email us instead." });
    }
  }

  const isSubmitting = status.state === "submitting";
  const isSent = status.state === "sent";
  const notice =
    status.state === "offline"
      ? { text: "The form is offline right now. Send your note to", tail: " and we will pick it up there.", tone: "muted", email: true }
      : status.state === "invalid"
        ? { text: status.message, tail: "", tone: "error", email: false }
        : status.state === "error"
          ? { text: status.message, tail: "", tone: "error", email: true }
          : null;

  return (
    <div className="contact-form">
      {/* Always mounted so assistive tech announces the change; receives focus once the message is saved. */}
      <div ref={statusRef} role="status" aria-live="polite" tabIndex={-1} className="contact-form__status">
        {isSent ? (
          <div className="contact-form__sent">
            <p className="contact-form__sent-title">{SUCCESS_TEXT}</p>
            <p className="contact-form__note">
              {siteCopy.contact.sentUrgent} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
        ) : null}
      </div>

      {isSent ? null : (
        <form method="post" action="/api/contact" onSubmit={handleSubmit} className="contact-form__form">
          <Field label="Name">
            <input name="name" type="text" required maxLength={120} autoComplete="name" className="brief-input" />
          </Field>
          <Field label="Email">
            <input name="email" type="email" required maxLength={200} autoComplete="email" inputMode="email" className="brief-input" />
          </Field>
          <Field label="Company or website (optional)">
            <input name="company" type="text" maxLength={160} autoComplete="organization" className="brief-input" />
          </Field>
          <Field label="Timeline (optional)">
            <select name="timeline" defaultValue="" className="brief-input contact-form__select">
              <option value="">Select a timeline</option>
              {/* The brief's own wording (shared/brief.ts q5), so both forms ask the same way. */}
              <option value="this-month">In the next 30 days</option>
              <option value="1-3-months">1 – 3 months</option>
              <option value="3-6-months">3 – 6 months</option>
              <option value="exploring">No fixed timeline</option>
            </select>
          </Field>
          <Field label="What is the business, what feels misaligned, and what has to happen next?">
            <textarea name="message" required minLength={10} maxLength={4000} rows={6} className="brief-input contact-form__message" />
          </Field>
          {/* Honeypot. Named and labelled so browser autofill and password managers have nothing to match. */}
          <div aria-hidden="true" className="brief-hp">
            <label>
              Leave this field empty
              <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {notice ? (
            <p role="alert" className="contact-form__notice" data-tone={notice.tone}>
              {notice.text}
              {notice.email ? (
                <>
                  {" "}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  {notice.tail}
                </>
              ) : null}
            </p>
          ) : null}

          <p className="contact-form__note">
            {siteCopy.contact.formNotice} <a href="/privacy">{siteCopy.contact.formNoticeLink}</a>
          </p>
          <div className="brief-actions">
            <button type="submit" disabled={isSubmitting} className="brief-primary">
              {isSubmitting ? "Sending…" : "Send message"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
