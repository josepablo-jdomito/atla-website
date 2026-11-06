import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "wouter";
import { trackEvent } from "@/hooks/use-analytics";
import { ga4Event } from "@/lib/ga";
import { CONTACT_EMAIL } from "@shared/siteSeo";

// Extracted from AtlaContact.tsx (Task 10). Fields, payload, endpoint, analytics and messages are
// unchanged except one ruling: the budget question is gone (no budget questions or prices on v2).
// /api/contact treats budget as optional (default ""), so the payload stays valid without it.

const SUCCESS_TEXT = "Received. We read every note directly and reply with the next recommended step.";

type FormStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "sent" }
  | { state: "offline" }
  | { state: "invalid"; message: string }
  | { state: "error"; message: string };

/** A bracket label, `( NAME )`: the parentheses are drawn, not read. */
export function BracketLabel({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return (
    <span className={muted ? "fp-label fp-label--muted" : "fp-label"}>
      <span aria-hidden="true">( </span>
      {children}
      <span aria-hidden="true"> )</span>
    </span>
  );
}

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <label className={wide ? "fp-field fp-field--wide" : "fp-field"}>
      <BracketLabel>{label}</BracketLabel>
      {children}
    </label>
  );
}

/**
 * The dark card from the Figma (Contact 4553:3187): #222, a real project image at 60%, one 48px line,
 * one sentence, and the one yellow button. The astronomical image in the Figma is a placeholder.
 */
export function ContactCard({
  title,
  lead,
  cta,
  image,
  headingLevel = 3,
}: {
  title: string;
  lead: string;
  cta: string;
  image?: string;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="fp-card" data-block="contact-card">
      {image ? <img className="fp-card__image" src={image} alt="" loading="lazy" decoding="async" /> : null}
      <div className="fp-card__inner">
        <Heading className="fp-card__title">{title}</Heading>
        <p className="fp-card__lead">{lead}</p>
        <Link href="/brief" className="fp-button">
          {cta}
        </Link>
      </div>
    </div>
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
      <div ref={statusRef} role="status" aria-live="polite" tabIndex={-1} className="fp-form__status">
        {isSent ? (
          <div className="fp-form__sent">
            <p>{SUCCESS_TEXT}</p>
            <p className="fp-form__note">
              If it is urgent, write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
        ) : null}
      </div>

      {isSent ? null : (
        <form method="post" action="/api/contact" onSubmit={handleSubmit} className="fp-form">
          <div className="fp-form__fields">
            <Field label="Name">
              <input name="name" type="text" required maxLength={120} autoComplete="name" className="fp-input" />
            </Field>
            <Field label="Email">
              <input name="email" type="email" required maxLength={200} autoComplete="email" inputMode="email" className="fp-input" />
            </Field>
            <Field label="Company or website, optional">
              <input name="company" type="text" maxLength={160} autoComplete="organization" className="fp-input" />
            </Field>
            <Field label="Timeline, optional">
              <select name="timeline" defaultValue="" className="fp-input">
                <option value="">Select a timeline</option>
                <option value="this-month">This month</option>
                <option value="1-3-months">One to three months</option>
                <option value="3-6-months">Three to six months</option>
                <option value="exploring">Exploring</option>
              </select>
            </Field>
            <Field label="The project" wide>
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={4000}
                rows={5}
                placeholder="What is the business, what feels misaligned, and what has to happen next?"
                className="fp-input"
              />
            </Field>
          </div>
          {/* Honeypot. Named and labelled so browser autofill and password managers have nothing to match. */}
          <div aria-hidden="true" className="fp-hp">
            <label>
              Leave this field empty
              <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {notice ? (
            <p role="alert" className="fp-form__notice" data-tone={notice.tone}>
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

          <p className="fp-form__note">
            What you send here goes to our CRM so we can answer your inquiry, and we keep it until you ask us to delete
            it. See the <a href="/privacy">privacy policy</a>.
          </p>
          <div>
            <button type="submit" disabled={isSubmitting} className="fp-button">
              {isSubmitting ? "Sending" : "Send message"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
