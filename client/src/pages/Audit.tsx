import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link } from "wouter";
import {
  AUDIT_INVESTING,
  AUDIT_MOMENTS,
  EMPTY_AUDIT,
  MAX_AUDIT_MESSAGE,
  auditSchema,
  type AuditDraft,
  type AuditOption,
  type AuditWeek,
} from "@shared/audit";
import { formatMetaTitle } from "@shared/siteSeo";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead, useNoindex } from "@/components/seo/SeoHead";
import { fetchAuditWeek, submitAudit } from "@/components/audit/auditApi";
import { siteCopy } from "@/content/siteCopy";
import { trackAuditComplete } from "@/lib/ga";

/**
 * The free audit (/audit, JP 2026-11-07): one page that sells the audit, then takes the request.
 * The title, the lead and the week's line stay beside the argument on wide screens; the form closes
 * the page. The week's line is live from /api/audit/status; the prerender shows the neutral one.
 * Delivered like the brand check (server/audit/route.ts).
 */

const copy = siteCopy.audit;

type Field = keyof AuditDraft;
type Status = "idle" | "sending" | "rate-limited" | "failed";

const TEXT_FIELDS = [
  { key: "name", type: "text", autoComplete: "name" },
  { key: "email", type: "email", autoComplete: "email" },
  { key: "site", type: "text", autoComplete: "url" },
] as const;

const CHOICES: { key: "moment" | "investing"; options: readonly AuditOption[] }[] = [
  { key: "moment", options: AUDIT_MOMENTS },
  { key: "investing", options: AUDIT_INVESTING },
];

const ERROR_FOR: Partial<Record<Field, string>> = {
  name: copy.nameError,
  email: copy.emailError,
  site: copy.siteError,
  moment: copy.choiceError,
  investing: copy.choiceError,
};
const FIELD_ORDER: Field[] = ["name", "email", "site", "moment", "investing"];

function newSubmissionId(): string {
  try {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

export default function Audit() {
  const baseId = useId();
  const [draft, setDraft] = useState<AuditDraft>(EMPTY_AUDIT);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [week, setWeek] = useState<AuditWeek | null>(null);
  const [done, setDone] = useState<AuditWeek | null>(null);
  // One id per request: a retry after a failure is the same request, so the server delivers it once.
  const submissionId = useRef(newSubmissionId());
  const honeypot = useRef<HTMLInputElement>(null);
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const sending = status === "sending";
  const fieldId = (key: Field) => `${baseId}-${key}`;
  useNoindex(done !== null);

  useEffect(() => {
    const controller = new AbortController();
    void fetchAuditWeek(controller.signal).then((value) => {
      if (!controller.signal.aborted && value) setWeek(value);
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (done) doneHeading.current?.focus();
  }, [done]);

  const set = (key: Field, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (sending) return;
    const parsed = auditSchema.safeParse(draft);
    if (!parsed.success) {
      const issues = new Set(parsed.error.issues.map((issue) => issue.path[0] as Field));
      const next: Partial<Record<Field, string>> = {};
      for (const key of FIELD_ORDER) if (issues.has(key)) next[key] = ERROR_FOR[key];
      setErrors(next);
      const first = FIELD_ORDER.find((key) => next[key]);
      if (first) {
        const target =
          document.getElementById(fieldId(first)) ?? document.querySelector<HTMLInputElement>(`input[name="${first}"]`);
        target?.focus();
      }
      return;
    }
    setStatus("sending");
    const result = await submitAudit(parsed.data, submissionId.current, honeypot.current?.value ?? "");
    if (result.status === "ok") {
      trackAuditComplete(submissionId.current);
      setStatus("idle");
      setWeek(result.week);
      setDone(result.week);
      return;
    }
    setStatus(result.status);
  };

  const message = status === "rate-limited" ? copy.rateLimited : status === "failed" ? copy.network : "";
  const weekLine = week ? copy.week[week] : copy.week.neutral;
  const finished = done ? copy.done[done] : null;

  return (
    <PageShell>
      <SeoHead title={formatMetaTitle(copy.metaTitle, "Atla")} description={copy.metaDescription} pathname="/audit" />
      <div className="site-page-body audit">
        <header className="page-intro audit-intro">
          <h1 id={`${baseId}-title`} className="page-intro__title audit-intro__title">
            {copy.title}
          </h1>
          <p className="page-intro__lead audit-intro__lead">{copy.lead}</p>
          <p className="audit-week" data-week={week ?? undefined} aria-live="polite">
            <span className="site-label audit-week__label">{copy.week.label}</span>
            <span className="audit-week__line">{weekLine}</span>
          </p>
        </header>

        <div className="audit-body">
          <section className="audit-section" aria-labelledby={`${baseId}-get`}>
            <h2 id={`${baseId}-get`} className="site-section-title">
              {copy.getTitle}
            </h2>
            <ul className="audit-rows">
              {copy.get.map((item) => (
                <li key={item.title} className="audit-row">
                  <h3 className="site-item-title audit-row__title">{item.title}</h3>
                  <p className="audit-row__line">{item.line}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="audit-section" aria-labelledby={`${baseId}-why`}>
            <h2 id={`${baseId}-why`} className="site-section-title">
              {copy.whyTitle}
            </h2>
            <div className="audit-prose">
              {copy.why.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="audit-section" aria-labelledby={`${baseId}-for`}>
            <h2 id={`${baseId}-for`} className="site-section-title">
              {copy.forTitle}
            </h2>
            <div className="audit-prose">
              <p>{copy.for}</p>
              <p>
                <Link href="/brief" className="site-text-button audit-prose__door">
                  {copy.forLink}
                </Link>
              </p>
            </div>
          </section>

          <section className="audit-section" aria-labelledby={`${baseId}-how`}>
            <h2 id={`${baseId}-how`} className="site-section-title">
              {copy.howTitle}
            </h2>
            <ol className="audit-rows audit-steps">
              {copy.how.map((step) => (
                <li key={step.title} className="audit-row">
                  <h3 className="site-item-title audit-row__title">{step.title}</h3>
                  <p className="audit-row__line">{step.line}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="audit-section audit-ask" aria-labelledby={`${baseId}-ask`}>
            {finished ? (
              <div className="audit-done">
                <h2 id={`${baseId}-ask`} ref={doneHeading} tabIndex={-1} className="site-section-title audit-ask__title">
                  {finished.title}
                </h2>
                <p className="audit-done__line">{finished.line}</p>
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
                <form className="audit-form" onSubmit={submit} noValidate>
                  <div className="brief-fields audit-fields">
                    {TEXT_FIELDS.map((field) => {
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

                  {CHOICES.map(({ key, options }) => {
                    const error = errors[key];
                    return (
                      <fieldset
                        key={key}
                        className="bcheck-choice"
                        data-field={key}
                        aria-describedby={error ? `${fieldId(key)}-error` : undefined}
                        aria-invalid={error ? true : undefined}
                        disabled={sending}
                      >
                        <legend className="brief-field__label bcheck-choice__legend">{copy.fields[key]}</legend>
                        <div className="bcheck-choice__options">
                          {options.map((option, i) => {
                            const id = i === 0 ? fieldId(key) : `${fieldId(key)}-${option.value}`;
                            return (
                              <label key={option.value} className="bcheck-option">
                                <input
                                  id={id}
                                  type="radio"
                                  name={key}
                                  value={option.value}
                                  className="bcheck-option__input"
                                  checked={draft[key] === option.value}
                                  onChange={() => set(key, option.value)}
                                  required
                                />
                                <span className="bcheck-option__label">{option.label}</span>
                              </label>
                            );
                          })}
                        </div>
                        {error ? (
                          <p id={`${fieldId(key)}-error`} className="brief-field__error">
                            {error}
                          </p>
                        ) : null}
                      </fieldset>
                    );
                  })}

                  <div className="brief-field" data-field="message">
                    <label htmlFor={fieldId("message")} className="brief-field__label">
                      {copy.fields.message}
                    </label>
                    <textarea
                      id={fieldId("message")}
                      className="brief-input bcheck-message"
                      name="message"
                      rows={3}
                      maxLength={MAX_AUDIT_MESSAGE}
                      value={draft.message}
                      onChange={(event) => set("message", event.target.value)}
                      disabled={sending}
                    />
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

                  <p className="brief-privacy bcheck-privacy">
                    {copy.privacyNotice} <Link href="/privacy">{copy.privacyLink}</Link>
                  </p>
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
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </PageShell>
  );
}
