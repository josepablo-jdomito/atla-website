import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { EMPTY_AUDIT, auditSchema, type AuditDraft, type AuditStatus, type AuditWeek } from "@shared/audit";
import { formatMetaTitle } from "@shared/siteSeo";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead, useNoindex } from "@/components/seo/SeoHead";
import { fetchAuditStatus, submitAudit } from "@/components/audit/auditApi";
import { AuditSlots } from "@/components/audit/AuditSlots";
import { siteCopy } from "@/content/siteCopy";
import { trackAuditComplete } from "@/lib/ga";

/**
 * The free audit (/audit, JP 2026-11-07): the visitor's pains, the wins, three fields, read in two
 * minutes (oddit.co/pages/free-trial; never "the audit our clients pay for", JP). The title, the lead
 * and the week's line stay beside the lists and the form on wide screens. The week's line is live from /api/audit/status; the prerender shows the
 * neutral one. Delivered like the brand check (server/audit/route.ts).
 */

const copy = siteCopy.audit;

type Field = keyof AuditDraft;
type Status = "idle" | "sending" | "rate-limited" | "failed";

const FIELDS = [
  { key: "site", type: "text", autoComplete: "url" },
  { key: "name", type: "text", autoComplete: "name" },
  { key: "email", type: "email", autoComplete: "email" },
] as const;

const ERROR_FOR: Record<Field, string> = { name: copy.nameError, email: copy.emailError, site: copy.siteError };
const FIELD_ORDER: Field[] = ["site", "name", "email"];

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
  const [slots, setSlots] = useState<AuditStatus | null>(null);
  const [slotsAt, setSlotsAt] = useState<number | null>(null);
  const [done, setDone] = useState<AuditWeek | null>(null);
  // One id per request: a retry after a failure is the same request, so the server delivers it once.
  const submissionId = useRef(newSubmissionId());
  const honeypot = useRef<HTMLInputElement>(null);
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const sending = status === "sending";
  const fieldId = (key: Field) => `${baseId}-${key}`;
  useNoindex(done !== null);

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
      if (first) document.getElementById(fieldId(first))?.focus();
      return;
    }
    setStatus("sending");
    const result = await submitAudit(parsed.data, submissionId.current, honeypot.current?.value ?? "");
    if (result.status === "ok") {
      trackAuditComplete(submissionId.current);
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
    setStatus(result.status);
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
