import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Link, useSearch } from "wouter";
import { AUDIT_ANSWER_KEYS, EMPTY_AUDIT, MAX_AUDIT_FEEDBACK, auditSchema, type AuditAnswerKey, type AuditDraft, type AuditStatus, type AuditWeek } from "@shared/audit";
import { formatMetaTitle } from "@shared/siteSeo";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead, useNoindex } from "@/components/seo/SeoHead";
import { fetchAuditStatus, readAuditAttribution, submitAudit, submitAuditFeedback } from "@/components/audit/auditApi";
import { AuditSlots } from "@/components/audit/AuditSlots";
import { useAuditMotion } from "@/components/audit/useMotion";
import { Drawing } from "@/components/audit/Drawing";
import { siteCopy } from "@/content/siteCopy";
import { trackAuditComplete, trackAuditFormStart, trackAuditSubmitError, trackAuditView } from "@/lib/ga";

/**
 * The free audit (/audit, JP 2026-11-07): a landing page. The offer in the title, JP's own line opening
 * the lead and his name signing it (no kicker above the title: the heading carries its weight), the week's five as a live widget (AuditSlots), three drawn
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
// Anything first (the venture-backed one in the line), then the marks that read best small.
const PROOF_MARKS = ["Anything", "Temakase", "Rústico", "Persona", "Sexto Abismo"]
  .map((name) => siteCopy.logos.items.find((item) => item.name === name))
  .filter((item): item is (typeof siteCopy.logos.items)[number] => Boolean(item));

function newSubmissionId(): string {
  try {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

/** Jumps to the form and puts the caret in its first field (the click is handled, so the hash does not change). */
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
  // ?sent= comes back from the plain form route (/api/audit/form) when the form was sent before hydration.
  const search = useSearch();
  const [done, setDone] = useState<AuditWeek | "error" | null>(() => {
    const sent = new URLSearchParams(search).get("sent");
    return sent === "open" || sent === "full" || sent === "error" ? sent : null;
  });
  const [answers, setAnswers] = useState<Record<AuditAnswerKey, string>>({ frustration: "", outcome: "", tried: "", anything: "" });
  const [feedbackState, setFeedbackState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  // One id per request: a retry after a failure is the same request, so the server delivers it once.
  const submissionId = useRef(newSubmissionId());
  const sent = useRef<AuditDraft | null>(null);
  const started = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const root = useRef<HTMLDivElement>(null);
  useAuditMotion(root);
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
        return { week: result.week === "full" || taken >= total ? "full" : "open", taken, cap: total, last: current?.last ?? 0 };
      });
      setSlotsAt(Date.now());
      setDone(result.week);
      return;
    }
    trackAuditSubmitError(result.status === "rate-limited" ? "rate_limited" : "failed");
    setStatus(result.status);
  };

  const anyAnswer = AUDIT_ANSWER_KEYS.some((key) => answers[key].trim());
  const sendAnswers = async (event: FormEvent) => {
    event.preventDefault();
    if (!anyAnswer || !sent.current || feedbackState === "sending") return;
    setFeedbackState("sending");
    const ok = await submitAuditFeedback({ submissionId: submissionId.current, ...sent.current, ...answers });
    setFeedbackState(ok ? "done" : "failed");
  };

  const message = status === "rate-limited" ? copy.rateLimited : status === "failed" ? copy.network : "";
  const finished = done ? copy.done[done] : null;
  const sentWeek: AuditWeek | null = done === "open" || done === "full" ? done : null;

  return (
    <PageShell landing>
      <SeoHead title={formatMetaTitle(copy.metaTitle, "Atla")} description={copy.metaDescription} pathname="/audit" />
      <div ref={root} className="site-page-body audit">
        <section className="audit-hero" aria-labelledby={`${baseId}-title`}>
          <div className="audit-hero__text">
            <h1 id={`${baseId}-title`} className="page-intro__title audit-hero__title">
              {copy.title}
            </h1>
            <p className="audit-hero__lead">{copy.lead}</p>
            <p className="audit-hero__byline">{copy.byline}</p>
            {done && done !== "error" ? null : (
              <p className="audit-hero__action">
                <a href={`#${AUDIT_FORM_ID}`} className="audit-submit audit-hero__button" onClick={goToForm}>
                  {copy.heroCta}
                </a>
              </p>
            )}
          </div>
          <figure className="audit-hero__art">
            <Drawing src={copy.heroArt.src} clip={copy.heroArt.clip} alt={copy.heroArt.alt} width={copy.heroArt.width} height={copy.heroArt.height} eager />
          </figure>
        </section>

        <AuditSlots status={slots} updatedAt={slotsAt} sent={sentWeek} />

        <section className="audit-how" aria-labelledby={`${baseId}-how`}>
          <h2 id={`${baseId}-how`} className="site-section-title audit-how__title" data-reveal>
            {copy.howTitle}
          </h2>
          <ol className="audit-steps">
            {copy.steps.map((step, index) => (
              <li key={step.src} className="audit-step" data-reveal style={{ ["--i" as string]: index }}>
                {/* Step numbers, the one place on the site with digits (JP, 2026-11-07: "agrega números al how it works"). */}
                <span className="site-label audit-step__number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Drawing className="audit-step__art" src={step.src} clip={step.clip} alt={step.alt} width={560} height={560} eager={index < 3} />
                <p className="audit-step__line">{step.line}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="audit-proof" aria-labelledby={`${baseId}-proof`}>
          <div className="audit-proof__head">
            <h2 id={`${baseId}-proof`} className="site-section-title audit-proof__title">
              {copy.proofTitle}
            </h2>
            <p className="audit-proof__line">{copy.proofLine}</p>
          </div>
          <ul className="audit-proof__marks">
            {copy.proofAwards.map((item) => (
              <li key={item.name} className="audit-proof__award">
                <img className="audit-proof__award-mark" src={item.mark} alt={`${item.name} logo`} width={item.markWidth} height={item.markHeight} loading="lazy" decoding="async" />
                <span className="audit-proof__award-text">
                  <img src={item.src} alt={`${item.award} badge`} width={40} height={40} loading="lazy" decoding="async" />
                  <span className="audit-proof__award-what">{item.award}</span>
                </span>
              </li>
            ))}
            {copy.proofMarks.map((item) => (
              <li key={item.name} className="audit-proof__mark">
                <img src={item.src} alt={`${item.name} logo`} width={item.width} height={item.height} loading="lazy" decoding="async" />
              </li>
            ))}
            {PROOF_MARKS.map((item) => (
              <li key={item.name} className="audit-proof__mark">
                <img src={item.src} alt={`${item.name} logo`} width={item.width} height={item.height} loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        </section>

        <section id={AUDIT_FORM_ID} className="audit-ask" aria-labelledby={`${baseId}-ask`}>
            {finished ? (
              <div className="audit-done">
                <h2 id={`${baseId}-ask`} ref={doneHeading} tabIndex={-1} className="site-section-title audit-ask__title">
                  {finished.title}
                </h2>
                <p className="audit-done__line">{finished.line}</p>
                {done === "error" ? null : (
                <p className="audit-done__follow">
                  {copy.doneFollow}{" "}
                  <a href={INSTAGRAM_JP} target="_blank" rel="noopener noreferrer" className="audit-done__link">
                    {copy.doneFollowLink}
                  </a>
                </p>
                )}
                {done === "error" || !sent.current ? null : feedbackState === "done" ? (
                  <p className="audit-done__line" role="status">
                    {copy.feedbackDone}
                  </p>
                ) : (
                  <form className="audit-answers" onSubmit={sendAnswers}>
                    <h3 className="site-item-title audit-answers__title">{copy.answersTitle}</h3>
                    <p className="audit-answers__line">{copy.answersLine}</p>
                    {copy.answers.map((question) => (
                      <div key={question.key} className="brief-field">
                        <label htmlFor={`${baseId}-${question.key}`} className="brief-field__label">
                          {question.label}
                        </label>
                        <textarea
                          id={`${baseId}-${question.key}`}
                          className="brief-input bcheck-message"
                          rows={2}
                          maxLength={MAX_AUDIT_FEEDBACK}
                          value={answers[question.key]}
                          onChange={(event) => setAnswers((current) => ({ ...current, [question.key]: event.target.value }))}
                          disabled={feedbackState === "sending"}
                        />
                      </div>
                    ))}
                    <div className="brief-actions">
                      <button type="submit" className="site-action" disabled={feedbackState === "sending" || !anyAnswer}>
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
                <div className="audit-ask__intro">
                  <h2 id={`${baseId}-ask`} className="audit-ask__title">
                    {copy.formTitle}
                  </h2>
                  <p className="audit-fit">{copy.fit}</p>
                  <ul className="audit-assurances">
                    {copy.assurances.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                {/* Before hydration or without JavaScript the browser posts the fields to /api/audit/form, never into a URL. */}
                <form className="audit-form" method="post" action="/api/audit/form" onSubmit={submit} noValidate>
                  <input type="hidden" name="submissionId" value={submissionId.current} />
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
                    <button type="submit" className="audit-submit" disabled={sending}>
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
                  <p className="brief-privacy bcheck-privacy">
                    {copy.privacyNotice} <Link href="/privacy">{copy.privacyLink}</Link>
                  </p>
                </form>
              </>
            )}
        </section>
      </div>
    </PageShell>
  );
}
