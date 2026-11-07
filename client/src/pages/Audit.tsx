import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Link } from "wouter";
import { EMPTY_AUDIT, MAX_AUDIT_FEEDBACK, auditSchema, type AuditDraft, type AuditStatus, type AuditWeek } from "@shared/audit";
import { formatMetaTitle } from "@shared/siteSeo";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead, useNoindex } from "@/components/seo/SeoHead";
import { fetchAuditStatus, readAuditAttribution, submitAudit, submitAuditFeedback } from "@/components/audit/auditApi";
import { AuditSlots } from "@/components/audit/AuditSlots";
import { siteCopy } from "@/content/siteCopy";
import { trackAuditComplete, trackAuditFormStart, trackAuditSubmitError, trackAuditView } from "@/lib/ga";

/**
 * The free audit (/audit, JP 2026-11-07): a landing page. JP named above the title, the offer in the
 * title, his own line opening the lead, the week's five as a live widget (AuditSlots), three drawn
 * steps, a strip of client marks, then the three-field form with the assurances under the button.
 * The header on this route is the landing one (SiteHeader): the wordmark and one action to the form.
 * After the send: one micro step (Instagram) and the one research question. Delivered like the brand
 * check (server/audit/route.ts). CRO review: docs/superpowers/specs/2026-11-07-audit-landing/cro-review.md.
 */

const copy = siteCopy.audit;
const INSTAGRAM_JP = "https://www.instagram.com/jdomito_/";
/** The form's anchor: the hero action and the landing header both point here. */
export const AUDIT_FORM_ID = "send";

type Field = keyof AuditDraft;
type Status = "idle" | "sending" | "rate-limited" | "failed";

const FIELDS = [
  { key: "site", type: "text", autoComplete: "url" },
  { key: "name", type: "text", autoComplete: "name" },
  { key: "email", type: "email", autoComplete: "email" },
] as const;

const ERROR_FOR: Record<Field, string> = { name: copy.nameError, email: copy.emailError, site: copy.siteError };
const FIELD_ORDER: Field[] = ["site", "name", "email"];
const PROOF_MARKS = siteCopy.logos.items.slice(0, 8);

function newSubmissionId(): string {
  try {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

/** Jumps to the form and puts the caret in its first field; the address bar keeps the hash. */
export function goToForm(event?: MouseEvent) {
  const form = document.getElementById(AUDIT_FORM_ID);
  if (!form) return;
  event?.preventDefault();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  form.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  form.querySelector<HTMLInputElement>("input:not([type=hidden])")?.focus({ preventScroll: true });
}

export default function Audit() {
  const baseId = useId();
  const [draft, setDraft] = useState<AuditDraft>(EMPTY_AUDIT);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [slots, setSlots] = useState<AuditStatus | null>(null);
  const [slotsAt, setSlotsAt] = useState<number | null>(null);
  const [done, setDone] = useState<AuditWeek | null>(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackState, setFeedbackState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  // One id per request: a retry after a failure is the same request, so the server delivers it once.
  const submissionId = useRef(newSubmissionId());
  const sent = useRef<AuditDraft | null>(null);
  const started = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const sending = status === "sending";
  const fieldId = (key: Field) => `${baseId}-${key}`;
  useNoindex(done !== null);

  // The visit's source is read on arrival (the utm_* are on this first URL) and sent with the request.
  useEffect(() => {
    readAuditAttribution();
    trackAuditView();
  }, []);

  // The widget reads the week on mount, every half minute while the tab is visible, and when the
  // visitor comes back to the tab.
  useEffect(() => {
    const controller = new AbortController();
    const read = () => {
      if (document.visibilityState === "hidden") return;
      void fetchAuditStatus(controller.signal).then((value) => {
        if (controller.signal.aborted || !value) return;
        setSlots(value);
        setSlotsAt(Date.now());
      });
    };
    read();
    const timer = setInterval(read, 30_000);
    document.addEventListener("visibilitychange", read);
    return () => {
      controller.abort();
      clearInterval(timer);
      document.removeEventListener("visibilitychange", read);
    };
  }, []);

  useEffect(() => {
    if (done) doneHeading.current?.focus();
  }, [done]);

  const set = (key: Field, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const onFieldFocus = () => {
    if (started.current) return;
    started.current = true;
    trackAuditFormStart();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (sending) return;
    const parsed = auditSchema.safeParse({ ...draft, source: readAuditAttribution() });
    if (!parsed.success) {
      const issues = new Set(parsed.error.issues.map((issue) => issue.path[0] as Field));
      const next: Partial<Record<Field, string>> = {};
      for (const key of FIELD_ORDER) if (issues.has(key)) next[key] = ERROR_FOR[key];
      setErrors(next);
      const first = FIELD_ORDER.find((key) => next[key]);
      if (first) document.getElementById(fieldId(first))?.focus();
      return;
    }
    setStatus("sending");
    const result = await submitAudit(parsed.data, submissionId.current, honeypot.current?.value ?? "");
    if (result.status === "ok") {
      trackAuditComplete(submissionId.current);
      sent.current = { name: parsed.data.name, email: parsed.data.email, site: parsed.data.site };
      setStatus("idle");
      // The visitor's own request takes a ring at once; the next poll confirms it.
      setSlots((current) => {
        const total = current?.cap ?? 5;
        const taken = Math.min(total, (current?.taken ?? 0) + 1);
        return { week: result.week === "full" || taken >= total ? "full" : "open", taken, cap: total };
      });
      setSlotsAt(Date.now());
      setDone(result.week);
      return;
    }
    trackAuditSubmitError(result.status === "rate-limited" ? "rate_limited" : "failed");
    setStatus(result.status);
  };

  const sendFeedback = async (event: FormEvent) => {
    event.preventDefault();
    const text = feedback.trim();
    if (!text || !sent.current || feedbackState === "sending") return;
    setFeedbackState("sending");
    const ok = await submitAuditFeedback({ submissionId: submissionId.current, ...sent.current, text });
    setFeedbackState(ok ? "done" : "failed");
  };

  const message = status === "rate-limited" ? copy.rateLimited : status === "failed" ? copy.network : "";
  const finished = done ? copy.done[done] : null;

  return (
    <PageShell>
      <SeoHead title={formatMetaTitle(copy.metaTitle, "Atla")} description={copy.metaDescription} pathname="/audit" />
      <div className="site-page-body audit">
        <header className="page-intro audit-intro">
          <p className="site-label audit-intro__eyebrow">{copy.eyebrow}</p>
          <h1 id={`${baseId}-title`} className="page-intro__title audit-intro__title">
            {copy.title}
          </h1>
          <p className="page-intro__lead audit-intro__lead">{copy.lead}</p>
          <AuditSlots status={slots} updatedAt={slotsAt} />
          {done ? null : (
            <p className="audit-intro__action">
              <a href={`#${AUDIT_FORM_ID}`} className="site-action" onClick={goToForm}>
                {copy.cta}
              </a>
            </p>
          )}
        </header>

        <div className="audit-body">
          <section className="audit-section" aria-labelledby={`${baseId}-how`}>
            <h2 id={`${baseId}-how`} className="site-section-title">
              {copy.howTitle}
            </h2>
            <ol className="audit-steps">
              {copy.steps.map((step, index) => (
                <li key={step.src} className="audit-step">
                  <img
                    className="audit-step__art"
                    src={step.src}
                    alt={step.alt}
                    width={800}
                    height={800}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <p className="audit-step__line">{step.line}</p>
                </li>
              ))}
            </ol>
          </section>

          {PROOF_MARKS.length ? (
            <section className="audit-proof" aria-label={copy.proofLabel}>
              <p className="site-label audit-proof__label">{copy.proofLabel}</p>
              <ul className="audit-proof__marks">
                {PROOF_MARKS.map((item) => (
                  <li key={item.name} className="audit-proof__mark">
                    <img src={item.src} alt={`${item.name} logo`} width={item.width} height={item.height} loading="lazy" decoding="async" />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section id={AUDIT_FORM_ID} className="audit-section audit-ask" aria-labelledby={`${baseId}-ask`}>
            {finished ? (
              <div className="audit-done">
                <h2 id={`${baseId}-ask`} ref={doneHeading} tabIndex={-1} className="site-section-title audit-ask__title">
                  {finished.title}
                </h2>
                <p className="audit-done__line">{finished.line}</p>
                <p className="audit-done__follow">
                  {copy.doneFollow}{" "}
                  <a href={INSTAGRAM_JP} target="_blank" rel="noopener noreferrer" className="audit-done__link">
                    {copy.doneFollowLink}
                  </a>
                </p>
                {feedbackState === "done" ? (
                  <p className="audit-done__line" role="status">
                    {copy.feedbackDone}
                  </p>
                ) : (
                  <form className="audit-feedback" onSubmit={sendFeedback}>
                    <label htmlFor={`${baseId}-feedback`} className="brief-field__label">
                      {copy.feedbackQuestion}
                    </label>
                    <textarea
                      id={`${baseId}-feedback`}
                      className="brief-input bcheck-message"
                      rows={2}
                      maxLength={MAX_AUDIT_FEEDBACK}
                      value={feedback}
                      onChange={(event) => setFeedback(event.target.value)}
                      disabled={feedbackState === "sending"}
                    />
                    <div className="brief-actions">
                      <button type="submit" className="site-text-button" disabled={feedbackState === "sending" || !feedback.trim()}>
                        {copy.feedbackSend}
                      </button>
                      <p className="brief-status bcheck-status" role="status" data-tone={feedbackState === "failed" ? "error" : undefined}>
                        {feedbackState === "failed" ? copy.feedbackFailed : ""}
                      </p>
                    </div>
                  </form>
                )}
                <p>
                  <Link href="/" className="site-text-button">
                    {copy.doneHome}
                  </Link>
                </p>
              </div>
            ) : (
              <>
                <h2 id={`${baseId}-ask`} className="site-section-title">
                  {copy.formTitle}
                </h2>
                <p className="audit-fit">{copy.fit}</p>
                <form className="audit-form" onSubmit={submit} noValidate>
                  <div className="brief-fields audit-fields">
                    {FIELDS.map((field) => {
                      const id = fieldId(field.key);
                      const error = errors[field.key];
                      return (
                        <div key={field.key} className="brief-field" data-field={field.key}>
                          <label htmlFor={id} className="brief-field__label">
                            {copy.fields[field.key]}
                          </label>
                          <input
                            id={id}
                            className="brief-input"
                            type={field.type}
                            name={field.key}
                            autoComplete={field.autoComplete}
                            autoCapitalize={field.key === "name" ? undefined : "none"}
                            spellCheck={field.key === "name" ? undefined : false}
                            required
                            aria-invalid={error ? true : undefined}
                            aria-describedby={error ? `${id}-error` : undefined}
                            value={draft[field.key]}
                            onFocus={onFieldFocus}
                            onChange={(event) => set(field.key, event.target.value)}
                            disabled={sending}
                          />
                          {error ? (
                            <p id={`${id}-error`} className="brief-field__error">
                              {error}
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  {/* Honeypot: people never see or reach it; bots that fill every field give themselves away. */}
                  <div className="brief-hp" hidden>
                    <label htmlFor={`${baseId}-gotcha`}>Leave this empty</label>
                    <input
                      ref={honeypot}
                      id={`${baseId}-gotcha`}
                      type="text"
                      name="_gotcha"
                      tabIndex={-1}
                      autoComplete="off"
                      defaultValue=""
                    />
                  </div>

                  <div className="brief-actions">
                    <button type="submit" className="site-action" disabled={sending}>
                      {sending ? copy.sending : status === "failed" ? copy.retry : copy.submit}
                    </button>
                    <p
                      className="brief-status bcheck-status"
                      role="status"
                      data-tone={status === "idle" || sending ? undefined : "error"}
                    >
                      {message}
                    </p>
                  </div>
                  <ul className="audit-assurances">
                    {copy.assurances.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <p className="brief-privacy bcheck-privacy">
                    {copy.privacyNotice} <Link href="/privacy">{copy.privacyLink}</Link>
                  </p>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </PageShell>
  );
}
