import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link } from "wouter";
import {
  BRAND_CHECK_INVESTING,
  BRAND_CHECK_MOMENTS,
  BRAND_CHECK_SIZES,
  EMPTY_BRAND_CHECK,
  MAX_BRAND_CHECK_MESSAGE,
  brandCheckSchema,
  type BrandCheckDraft,
  type BrandCheckOption,
} from "@shared/brandCheck";
import { formatMetaTitle } from "@shared/siteSeo";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { submitBrandCheck } from "@/components/brandCheck/brandCheckApi";
import { siteCopy } from "@/content/siteCopy";
import { trackBrandCheckComplete, trackCalendlyClick } from "@/lib/ga";

/**
 * The free brand check (JP, 2026-11-06), after baked.design/design-check in atla's words and rules:
 * the question as the title, what the visitor gets as a quiet row, then one form on one screen.
 * It reads like the brief's contact step and is delivered the same way (server/brandCheck/route.ts).
 */

const copy = siteCopy.brandCheck;

type Field = keyof BrandCheckDraft;
type Status = "idle" | "sending" | "rate-limited" | "failed";

const TEXT_FIELDS = [
  { key: "name", type: "text", autoComplete: "name", wide: false },
  { key: "email", type: "email", autoComplete: "email", wide: false },
  { key: "site", type: "text", autoComplete: "url", wide: true },
] as const;

const CHOICES: { key: Field; options: readonly BrandCheckOption[] }[] = [
  { key: "moment", options: BRAND_CHECK_MOMENTS },
  { key: "size", options: BRAND_CHECK_SIZES },
  { key: "investing", options: BRAND_CHECK_INVESTING },
];

const ERROR_FOR: Partial<Record<Field, string>> = {
  name: copy.nameError,
  email: copy.emailError,
  site: copy.siteError,
  moment: copy.choiceError,
  size: copy.choiceError,
  investing: copy.choiceError,
};
const FIELD_ORDER: Field[] = ["name", "email", "site", "moment", "size", "investing"];

function newSubmissionId(): string {
  try {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

const isBookable = (url: string | undefined): url is string => !!url && /^https:\/\//.test(url);

export default function BrandCheck() {
  const baseId = useId();
  const [draft, setDraft] = useState<BrandCheckDraft>(EMPTY_BRAND_CHECK);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [done, setDone] = useState<{ calendlyUrl: string } | null>(null);
  // One id per request: a retry after a failure is the same request, so the server delivers it once.
  const submissionId = useRef(newSubmissionId());
  const honeypot = useRef<HTMLInputElement>(null);
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const sending = status === "sending";
  const fieldId = (key: Field) => `${baseId}-${key}`;

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
    const parsed = brandCheckSchema.safeParse(draft);
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
    const result = await submitBrandCheck(parsed.data, submissionId.current, honeypot.current?.value ?? "");
    if (result.status === "ok") {
      trackBrandCheckComplete(submissionId.current);
      setStatus("idle");
      setDone({ calendlyUrl: result.calendlyUrl });
      return;
    }
    setStatus(result.status);
  };

  const message = status === "rate-limited" ? copy.rateLimited : status === "failed" ? copy.network : "";

  return (
    <PageShell>
      <SeoHead title={formatMetaTitle(copy.metaTitle, "Atla")} description={copy.metaDescription} pathname="/brand-check" />
      <div className="site-page-body bcheck">
        <header className="page-intro bcheck-intro">
          <h1 className="page-intro__title bcheck-intro__title">{copy.title}</h1>
          <p className="page-intro__lead bcheck-intro__lead">{copy.lead}</p>
        </header>

        <section className="bcheck-facts" aria-labelledby={`${baseId}-facts`}>
          <h2 id={`${baseId}-facts`} className="bcheck-label">
            {copy.factsLabel}
          </h2>
          <ul className="bcheck-facts__list">
            {copy.facts.map((fact) => (
              <li key={fact} className="bcheck-facts__item">
                {fact}
              </li>
            ))}
          </ul>
          <p className="bcheck-capacity">{copy.capacity}</p>
        </section>

        <section className="bcheck-ask" aria-labelledby={`${baseId}-ask`}>
          {done ? (
            <div className="bcheck-done">
              <h2 id={`${baseId}-ask`} ref={doneHeading} tabIndex={-1} className="bcheck-ask__title">
                {copy.doneTitle}
              </h2>
              <p className="bcheck-done__line">{copy.done}</p>
              {isBookable(done.calendlyUrl) ? (
                <>
                  <p className="bcheck-done__line bcheck-done__line--muted">{copy.callLead}</p>
                  <div className="brief-actions">
                    <a
                      className="brief-primary"
                      href={done.calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={trackCalendlyClick}
                    >
                      {copy.bookCall}
                    </a>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <>
              <h2 id={`${baseId}-ask`} className="bcheck-ask__title">
                {copy.formTitle}
              </h2>
              <form className="bcheck-form" onSubmit={submit} noValidate>
                <div className="brief-fields bcheck-fields">
                  {TEXT_FIELDS.map((field) => {
                    const id = fieldId(field.key);
                    const error = errors[field.key];
                    return (
                      <div key={field.key} className="brief-field" data-field={field.key} data-wide={field.wide || undefined}>
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
                          placeholder={field.key === "site" ? copy.sitePlaceholder : undefined}
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
                  const legendId = `${fieldId(key)}-legend`;
                  return (
                    <fieldset
                      key={key}
                      className="bcheck-choice"
                      data-field={key}
                      aria-describedby={error ? `${fieldId(key)}-error` : undefined}
                      aria-invalid={error ? true : undefined}
                      disabled={sending}
                    >
                      <legend id={legendId} className="brief-field__label bcheck-choice__legend">
                        {copy.fields[key as keyof typeof copy.fields]}
                      </legend>
                      <div className="bcheck-choice__options">
                        {options.map((option, i) => {
                          const id = i === 0 ? fieldId(key) : `${fieldId(key)}-${option.value}`;
                          return (
                            <label key={option.value} htmlFor={id} className="bcheck-option">
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
                    <span className="brief-field__optional">{copy.optional}</span>
                  </label>
                  <textarea
                    id={fieldId("message")}
                    className="brief-input bcheck-message"
                    name="message"
                    rows={3}
                    maxLength={MAX_BRAND_CHECK_MESSAGE}
                    placeholder={copy.messagePlaceholder}
                    value={draft.message}
                    onChange={(event) => set("message", event.target.value)}
                    disabled={sending}
                  />
                </div>

                {/* Honeypot: people never see or reach it; bots that fill every field give themselves away. */}
                <div className="brief-hp" aria-hidden="true">
                  <label htmlFor={`${baseId}-gotcha`}>Leave this empty</label>
                  <input ref={honeypot} id={`${baseId}-gotcha`} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
                </div>

                <p className="brief-privacy bcheck-privacy">
                  {copy.privacyNotice} <Link href="/privacy">{copy.privacyLink}</Link>
                </p>
                <div className="brief-actions">
                  <button type="submit" className="brief-primary" disabled={sending}>
                    {sending ? copy.sending : status === "failed" ? copy.retry : copy.submit}
                  </button>
                  <p className="brief-status bcheck-status" role="status" data-tone={status === "idle" || sending ? undefined : "error"}>
                    {message}
                  </p>
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </PageShell>
  );
}
