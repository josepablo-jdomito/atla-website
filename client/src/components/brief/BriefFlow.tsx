import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from "react";
import {
  BRIEF_QUESTIONS,
  BRIEF_QUESTION_IDS,
  briefContactSchema,
  nextFixedQuestion,
  type BriefContact,
  type BriefQuestion,
} from "@shared/brief";
import { Link } from "wouter";
import { siteCopy } from "@/content/siteCopy";
import { useNoindex } from "@/components/seo/SeoHead";
import { trackBriefComplete, trackBriefStart, trackCalendlyClick } from "@/lib/ga";
import { submitBrief } from "./briefApi";
import { clearBrief, loadBrief, saveBrief, takeSeedFromUrl, type BriefStep, type SavedBrief } from "./briefStorage";

const copy = siteCopy.brief;

const MAX_SEED_CHARS = 300;
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

/** Screens in the whole brief: the five questions and the contact form. */
const TOTAL_STEPS = BRIEF_QUESTION_IDS.length;

/** The screen after the current answers: the next question, or the contact form once all five are in. */
function nextStep(brief: SavedBrief): BriefStep {
  const next = nextFixedQuestion(brief);
  return "kind" in next ? next : { id: "contact" };
}

export function BriefFlow() {
  const [brief, setBrief] = useState<SavedBrief | null>(null);
  const [direction, setDirection] = useState<Direction>("forward");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const userMoved = useRef(false);
  // brief_start: once per brief, when its first question is on screen. Nothing typed goes with it.
  const seededVisit = useRef(false);
  const startTracked = useRef(false);

  const commit = (next: SavedBrief) => {
    saveBrief(next);
    setBrief(next);
  };

  const start = (seedText: string | undefined) => {
    const fresh = freshBrief(seedText);
    commit({ ...fresh, path: [nextStep(fresh)] });
  };

  useEffect(() => {
    // The seed (/brief?seed=Like <title>) is taken out of the URL here and travels with the submission; it answers nothing.
    const seedText = cleanSeed(takeSeedFromUrl());
    seededVisit.current = Boolean(seedText);
    // A sent brief is not reopened: coming back to /brief starts a new one.
    const saved = loadBrief();
    if (saved && saved.calendlyUrl === undefined && (!seedText || seedText === saved.seed)) setBrief(saved);
    else {
      if (saved) clearBrief();
      start(seedText);
    }
    // Runs once per mount: a new seed in the URL is a new visit to the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!brief || startTracked.current) return;
    if (brief.calendlyUrl !== undefined || brief.index !== 0 || !brief.path[0]) return;
    startTracked.current = true;
    trackBriefStart(seededVisit.current);
  }, [brief]);

  // Before the saved brief is read (and in the prerendered HTML) the page still has its heading:
  // the first question, which is where a fresh brief starts.
  if (!brief) {
    return (
      <BriefFrame progress={0}>
        <div className="brief-form">
          <h1 className="brief-prompt">{BRIEF_QUESTIONS[0].prompt}</h1>
        </div>
      </BriefFrame>
    );
  }

  const done = brief.calendlyUrl !== undefined;
  const step = brief.path[brief.index];
  const progress = done ? 1 : Math.min(1, brief.index / TOTAL_STEPS);

  const answer = (id: string, value: Answer) => {
    userMoved.current = true;
    const answered: SavedBrief = { ...brief, answers: { ...brief.answers, [id]: value } };
    if (brief.index < brief.path.length - 1) {
      setDirection("forward");
      commit({ ...answered, index: brief.index + 1 });
      return;
    }
    setDirection("forward");
    commit({ ...answered, path: [...answered.path, nextStep(answered)], index: answered.path.length });
  };

  const back = () => {
    if (submitStatus === "sending" || brief.index === 0) return;
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
      trackBriefComplete(brief.submissionId);
      userMoved.current = true;
      setSubmitStatus("idle");
      setDirection("forward");
      commit({ ...brief, contact, calendlyUrl: result.calendlyUrl });
      return;
    }
    // Answers stay in sessionStorage either way; the visitor can retry or come back later.
    setSubmitStatus(result.status);
  };

  return (
    <BriefFrame
      progress={progress}
      meta={
        // Back is the only thing up here: no label, no step count (no numbers on the site).
        done || brief.index === 0 ? null : (
          <button type="button" className="site-text-button brief-back" onClick={back} disabled={submitStatus === "sending"}>
            {copy.back}
          </button>
        )
      }
    >
      <BriefScreen key={stepKey(brief)} direction={direction} focusOnMount={userMoved}>
        {(headingRef, fieldRef) =>
          done ? (
            <DoneScreen headingRef={headingRef} calendlyUrl={brief.calendlyUrl} />
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
              question={step as BriefQuestion}
              value={brief.answers[step.id]}
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
  meta,
  children,
}: {
  progress: number;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="brief">
      <div
        className="brief-progress"
        role="progressbar"
        aria-label={copy.progressLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div className="brief-progress__fill" style={{ transform: `scaleX(${progress})` }} />
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

/** A question: the prompt and its options as rows. Every question is single choice; a choice answers it. */
function QuestionScreen({
  question,
  value,
  onAnswer,
  headingRef,
}: {
  question: BriefQuestion;
  value: Answer | undefined;
  onAnswer: (value: Answer) => void;
  headingRef: RefObject<HTMLHeadingElement>;
}) {
  const headingId = useId();
  return (
    <div className="brief-form">
      <h1 id={headingId} ref={headingRef} tabIndex={-1} className="brief-prompt">
        {question.prompt}
      </h1>
      <div className="brief-options" role="group" aria-labelledby={headingId}>
        {(question.options ?? []).map((option) => (
          <button
            key={option.value}
            type="button"
            className="brief-option"
            aria-pressed={value === option.value}
            onClick={() => onAnswer(option.value)}
          >
            <span className="brief-option__label">{option.label}</span>
          </button>
        ))}
      </div>
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
      <div className="brief-hp" hidden>
        <label htmlFor={`${baseId}-gotcha`}>Leave this empty</label>
        <input ref={honeypot} id={`${baseId}-gotcha`} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <p className="brief-privacy">
        {copy.contact.privacyNotice} <Link href="/privacy">{copy.contact.privacyLink}</Link>
      </p>
      <div className="brief-actions">
        <button type="submit" className="site-action" disabled={sending}>
          {sending ? copy.contact.sending : status === "failed" ? copy.errors.retry : copy.contact.submit}
        </button>
        <p className="brief-status" role="status">
          {message}
        </p>
      </div>
    </form>
  );
}

function DoneScreen({ calendlyUrl, headingRef }: { calendlyUrl: string | undefined; headingRef: RefObject<HTMLHeadingElement> }) {
  useNoindex(true);
  return (
    <div className="brief-form">
      <h1 ref={headingRef} tabIndex={-1} className="brief-prompt">
        {copy.doneTitle}
      </h1>
      <p className="brief-lead">{copy.done}</p>
      {isBookable(calendlyUrl) ? (
        <div className="brief-actions">
          <a className="site-action" href={calendlyUrl} target="_blank" rel="noopener noreferrer" onClick={trackCalendlyClick}>
            {copy.bookCall}
          </a>
        </div>
      ) : null}
    </div>
  );
}
