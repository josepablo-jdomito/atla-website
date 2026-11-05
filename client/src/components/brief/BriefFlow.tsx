import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from "react";
import { BRIEF_QUESTION_IDS, briefContactSchema, nextFixedQuestion, type BriefContact, type BriefQuestion } from "@shared/brief";
import { siteCopy } from "@/content/siteCopy";
import { fetchNextStep, submitBrief } from "./briefApi";
import { clearBrief, loadBrief, saveBrief, type BriefStep, type SavedBrief } from "./briefStorage";

const copy = siteCopy.brief;

const MAX_SEED_CHARS = 300;
const MAX_TEXT_CHARS = 1000;
const EMPTY_CONTACT: BriefContact = { name: "", email: "", company: "", website: "", phone: "" };
const CONTACT_FIELDS = [
  { key: "name", type: "text", autoComplete: "name", required: true },
  { key: "email", type: "email", autoComplete: "email", required: true },
  { key: "company", type: "text", autoComplete: "organization", required: false },
  { key: "website", type: "url", autoComplete: "url", required: false },
  { key: "phone", type: "tel", autoComplete: "tel", required: false },
] as const;

type Direction = "forward" | "back";
type SubmitStatus = "idle" | "sending" | "rate-limited" | "failed";
type Answer = string | string[];

function newSubmissionId(): string {
  try {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    // randomUUID needs a secure context; plain-http previews still get a random id.
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

function cleanSeed(seed: string | null | undefined): string | undefined {
  const value = seed?.trim().slice(0, MAX_SEED_CHARS);
  return value ? value : undefined;
}

function freshBrief(seed: string | undefined): SavedBrief {
  return { seed, answers: {}, submissionId: newSubmissionId(), path: [], index: 0 };
}

function stepKey(brief: SavedBrief): string {
  if (brief.calendlyUrl !== undefined) return "done";
  return `${brief.index}:${brief.path[brief.index]?.id ?? "loading"}`;
}

function isBookable(url: string | undefined): url is string {
  return !!url && /^https:\/\//.test(url);
}

/** Screens in the whole brief. The seed answers "What are you building?", so that one is skipped. */
function totalSteps(brief: SavedBrief): number {
  return BRIEF_QUESTION_IDS.length - (brief.seed ? 1 : 0);
}

export function BriefFlow({ seed }: { seed?: string | null }) {
  const [brief, setBrief] = useState<SavedBrief | null>(null);
  const [pending, setPending] = useState(false);
  const [direction, setDirection] = useState<Direction>("forward");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const request = useRef(0);
  const userMoved = useRef(false);

  const commit = useCallback((next: SavedBrief) => {
    saveBrief(next);
    setBrief(next);
  }, []);

  /** Appends the next screen after the last one. A failing API never stalls the flow (fetchNextStep falls back). */
  const appendNextStep = useCallback(
    async (base: SavedBrief) => {
      const token = ++request.current;
      setPending(true);
      const next = await fetchNextStep(base);
      if (token !== request.current) return;
      // "done" only comes back once contact is valid, and the visitor still has to send it from the contact screen.
      const step: BriefStep = "kind" in next ? next : { id: "contact" };
      setPending(false);
      setDirection("forward");
      commit({ ...base, path: [...base.path, step], index: base.path.length });
    },
    [commit],
  );

  const start = useCallback(
    (seedText: string | undefined) => {
      const fresh = freshBrief(seedText);
      if (seedText) {
        commit(fresh);
        void appendNextStep(fresh);
        return;
      }
      // Without a seed the first question is always "What are you building?": no wait for it.
      const first = nextFixedQuestion(fresh);
      commit({ ...fresh, path: ["kind" in first ? first : { id: "contact" }] });
    },
    [appendNextStep, commit],
  );

  useEffect(() => {
    const seedText = cleanSeed(seed);
    const saved = loadBrief();
    if (saved && (!seedText || seedText === saved.seed)) setBrief(saved);
    else start(seedText);
    return () => {
      request.current++;
    };
    // Runs once per mount: a new seed in the URL is a new visit to the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!brief) return <BriefFrame progress={0} pending={false} />;

  const total = totalSteps(brief);
  const done = brief.calendlyUrl !== undefined;
  const step = brief.path[brief.index];
  const progress = done ? 1 : Math.min(1, (brief.index + (pending ? 1 : 0)) / total);

  const answer = (id: string, value: Answer) => {
    userMoved.current = true;
    const answered: SavedBrief = { ...brief, answers: { ...brief.answers, [id]: value } };
    if (brief.index < brief.path.length - 1) {
      setDirection("forward");
      commit({ ...answered, index: brief.index + 1 });
      return;
    }
    commit(answered);
    void appendNextStep(answered);
  };

  const back = () => {
    if (pending || submitStatus === "sending" || brief.index === 0) return;
    userMoved.current = true;
    setDirection("back");
    setSubmitStatus("idle");
    commit({ ...brief, index: brief.index - 1 });
  };

  const updateContact = (contact: BriefContact) => commit({ ...brief, contact });

  const send = async (contact: BriefContact, honeypot: string) => {
    if (submitStatus === "sending") return;
    setSubmitStatus("sending");
    const result = await submitBrief({ ...brief, contact }, brief.submissionId, honeypot);
    if (result.status === "ok") {
      userMoved.current = true;
      setSubmitStatus("idle");
      setDirection("forward");
      commit({ ...brief, contact, calendlyUrl: result.calendlyUrl });
      return;
    }
    // Answers stay in sessionStorage either way; the visitor can retry or come back later.
    setSubmitStatus(result.status);
  };

  const restart = () => {
    userMoved.current = true;
    clearBrief();
    setSubmitStatus("idle");
    setDirection("forward");
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState(window.history.state, "", window.location.pathname);
    }
    start(undefined);
  };

  return (
    <BriefFrame
      progress={progress}
      pending={pending}
      meta={
        done ? null : (
          <>
            {brief.index > 0 ? (
              <button type="button" className="brief-back" onClick={back} disabled={pending || submitStatus === "sending"}>
                <span aria-hidden="true">←</span> {copy.back}
              </button>
            ) : (
              <span className="brief-meta__label">{copy.label}</span>
            )}
            <span className="brief-meta__count">
              {String(brief.index + 1).padStart(2, "0")} {copy.stepSeparator} {String(total).padStart(2, "0")}
            </span>
          </>
        )
      }
    >
      <BriefScreen key={stepKey(brief)} direction={direction} focusOnMount={userMoved}>
        {(headingRef, fieldRef) =>
          done ? (
            <DoneScreen headingRef={headingRef} calendlyUrl={brief.calendlyUrl} onRestart={restart} />
          ) : !step ? null : step.id === "contact" ? (
            <ContactScreen
              headingRef={headingRef}
              fieldRef={fieldRef}
              initial={brief.contact ?? EMPTY_CONTACT}
              status={submitStatus}
              onChange={updateContact}
              onSend={send}
            />
          ) : (
            <QuestionScreen
              headingRef={headingRef}
              fieldRef={fieldRef}
              question={step as BriefQuestion}
              value={brief.answers[step.id]}
              disabled={pending}
              onAnswer={(value) => answer(step.id, value)}
            />
          )
        }
      </BriefScreen>
    </BriefFrame>
  );
}

function BriefFrame({
  progress,
  pending,
  meta,
  children,
}: {
  progress: number;
  pending: boolean;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="brief" aria-busy={pending || undefined}>
      <div
        className="brief-progress"
        role="progressbar"
        aria-label={copy.progressLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div className="brief-progress__fill" data-pending={pending || undefined} style={{ transform: `scaleX(${progress})` }} />
      </div>
      <div className="brief__inner">
        <div className="brief-meta">{meta}</div>
        {children}
      </div>
    </section>
  );
}

type ScreenRefs = (heading: RefObject<HTMLHeadingElement>, field: RefObject<HTMLElement>) => ReactNode;

/** One screen. Enters with a short fade and lift; moves focus so keyboard and screen-reader users land on the new question. */
function BriefScreen({
  direction,
  focusOnMount,
  children,
}: {
  direction: Direction;
  focusOnMount: MutableRefObject<boolean>;
  children: ScreenRefs;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fieldRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (focusOnMount.current) {
      if (window.scrollY > 0) window.scrollTo({ top: 0 });
      (field ?? headingRef.current)?.focus({ preventScroll: true });
      return;
    }
    // First paint: put the caret in a text field only where that will not throw up a phone keyboard.
    if (field && window.matchMedia?.("(pointer: fine)").matches) field.focus({ preventScroll: true });
  }, [focusOnMount]);

  return (
    <div className="brief-step" data-direction={direction}>
      {children(headingRef, fieldRef)}
    </div>
  );
}

function QuestionScreen({
  question,
  value,
  disabled,
  onAnswer,
  headingRef,
  fieldRef,
}: {
  question: BriefQuestion;
  value: Answer | undefined;
  disabled: boolean;
  onAnswer: (value: Answer) => void;
  headingRef: RefObject<HTMLHeadingElement>;
  fieldRef: RefObject<HTMLElement>;
}) {
  const headingId = useId();
  const hintId = useId();
  const initialText = typeof value === "string" ? value : "";
  const [text, setText] = useState(initialText);
  const [chosen, setChosen] = useState<string[]>(Array.isArray(value) ? value : []);

  const heading = (
    <h1 id={headingId} ref={headingRef} tabIndex={-1} className="brief-prompt">
      {question.prompt}
    </h1>
  );

  if (question.kind === "text") {
    const trimmed = text.trim();
    const submit = () => {
      if (trimmed && !disabled) onAnswer(trimmed);
    };
    const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
        event.preventDefault();
        submit();
      }
    };
    return (
      <form
        className="brief-form"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {heading}
        <textarea
          ref={fieldRef as RefObject<HTMLTextAreaElement>}
          className="brief-text"
          aria-labelledby={headingId}
          aria-describedby={hintId}
          placeholder={copy.textPlaceholder}
          rows={2}
          maxLength={MAX_TEXT_CHARS}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
        />
        <div className="brief-actions">
          <button type="submit" className="brief-primary" disabled={!trimmed || disabled}>
            {copy.continue}
          </button>
          <span id={hintId} className="brief-hint brief-hint--enter">
            {copy.enterHint}
          </span>
        </div>
      </form>
    );
  }

  const options = question.options ?? [];
  const multi = question.kind === "multi";
  const toggle = (option: string) =>
    setChosen((current) => (current.includes(option) ? current.filter((o) => o !== option) : [...current, option]));

  return (
    <div className="brief-form">
      {heading}
      {multi ? (
        <p id={hintId} className="brief-hint">
          {copy.multiHint}
        </p>
      ) : null}
      <div className="brief-options" role="group" aria-labelledby={headingId} aria-describedby={multi ? hintId : undefined}>
        {options.map((option) => {
          const selected = multi ? chosen.includes(option) : value === option;
          return (
            <button
              key={option}
              type="button"
              className="brief-option"
              data-kind={question.kind}
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => (multi ? toggle(option) : onAnswer(option))}
            >
              <span className="brief-option__mark" aria-hidden="true" />
              <span className="brief-option__label">{option}</span>
            </button>
          );
        })}
      </div>
      {multi ? (
        <div className="brief-actions">
          <button
            type="button"
            className="brief-primary"
            disabled={chosen.length === 0 || disabled}
            onClick={() => onAnswer(options.filter((o) => chosen.includes(o)))}
          >
            {copy.continue}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ContactScreen({
  initial,
  status,
  onChange,
  onSend,
  headingRef,
  fieldRef,
}: {
  initial: BriefContact;
  status: SubmitStatus;
  onChange: (contact: BriefContact) => void;
  onSend: (contact: BriefContact, honeypot: string) => void;
  headingRef: RefObject<HTMLHeadingElement>;
  fieldRef: RefObject<HTMLElement>;
}) {
  const baseId = useId();
  const [contact, setContact] = useState<BriefContact>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof BriefContact, string>>>({});
  const honeypot = useRef<HTMLInputElement>(null);
  const sending = status === "sending";

  const set = (key: keyof BriefContact, value: string) => {
    const next = { ...contact, [key]: value };
    setContact(next);
    onChange(next);
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const parsed = briefContactSchema.safeParse(contact);
    if (!parsed.success) {
      const issues = new Set(parsed.error.issues.map((issue) => issue.path[0]));
      const nextErrors = {
        name: issues.has("name") ? copy.contact.nameError : undefined,
        email: issues.has("email") ? copy.contact.emailError : undefined,
      };
      setErrors(nextErrors);
      const first = nextErrors.name ? "name" : "email";
      document.getElementById(`${baseId}-${first}`)?.focus();
      return;
    }
    onSend(parsed.data, honeypot.current?.value ?? "");
  };

  const message =
    status === "rate-limited" ? copy.errors.rateLimited : status === "failed" ? copy.errors.network : "";

  return (
    <form className="brief-form" onSubmit={submit} noValidate>
      <h1 ref={headingRef} tabIndex={-1} className="brief-prompt">
        {copy.contact.prompt}
      </h1>
      <div className="brief-fields">
        {CONTACT_FIELDS.map((field, i) => {
          const id = `${baseId}-${field.key}`;
          const error = errors[field.key];
          return (
            <div key={field.key} className="brief-field" data-field={field.key}>
              <label htmlFor={id} className="brief-field__label">
                {copy.contact.fields[field.key]}
                {field.required ? null : <span className="brief-field__optional">{copy.contact.optional}</span>}
              </label>
              <input
                id={id}
                ref={i === 0 ? (fieldRef as RefObject<HTMLInputElement>) : undefined}
                className="brief-input"
                type={field.type}
                name={field.key}
                autoComplete={field.autoComplete}
                inputMode={field.type === "url" ? "url" : undefined}
                required={field.required}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                value={contact[field.key]}
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
      <div className="brief-hp" aria-hidden="true">
        <label htmlFor={`${baseId}-gotcha`}>Leave this empty</label>
        <input ref={honeypot} id={`${baseId}-gotcha`} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <div className="brief-actions">
        <button type="submit" className="brief-primary" disabled={sending}>
          {sending ? copy.contact.sending : status === "failed" ? copy.errors.retry : copy.contact.submit}
        </button>
        <p className="brief-status" role="status">
          {message}
        </p>
      </div>
    </form>
  );
}

function DoneScreen({
  calendlyUrl,
  onRestart,
  headingRef,
}: {
  calendlyUrl: string | undefined;
  onRestart: () => void;
  headingRef: RefObject<HTMLHeadingElement>;
}) {
  const bookable = isBookable(calendlyUrl);
  return (
    <div className="brief-form">
      <h1 ref={headingRef} tabIndex={-1} className="brief-prompt">
        {copy.doneTitle}
      </h1>
      <p className="brief-lead">{copy.done}</p>
      {bookable ? <p className="brief-lead brief-lead--muted">{copy.callLead}</p> : null}
      <div className="brief-actions">
        {bookable ? (
          <a className="brief-primary" href={calendlyUrl} target="_blank" rel="noopener noreferrer">
            {copy.bookCall}
          </a>
        ) : null}
        <button type="button" className="brief-quiet" onClick={onRestart}>
          {copy.restart}
        </button>
      </div>
    </div>
  );
}
