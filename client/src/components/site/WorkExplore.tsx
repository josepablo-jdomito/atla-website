import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { siteCopy } from "@/content/siteCopy";
import { looksLikeQuestion } from "@/lib/askClient";
import { ASK_MAX_CHARS } from "@shared/ask";
import { EXPLORE_FIELD_ID } from "@/components/site/SiteHeader";

const { home, ask: askCopy } = siteCopy;

/** How long a pointer close keeps the panel mounted while it fades (site.css, data-state="closing"). */
const CLOSE_MS = 120;
/** closing = still mounted, running its exit; a refocus retargets the transition back to open. */
type PanelState = "closed" | "open" | "closing";
type Mode = "search" | "ask";
/** Below this width Ask opens as a bottom sheet and the page behind it is inert. */
const SHEET_QUERY = "(max-width: 767px)";

/** Ask, when the page offers it: the server said it can answer, and how to send and draw a turn. */
export type ExploreAsk = {
  available: boolean;
  pending: boolean;
  /** Called when the panel first opens: the moment to find out whether Ask can answer. */
  onOpen?: () => void;
  onAsk: (text: string) => void;
  /** The Ask panel. `send` asks and puts the caret back in the field (the suggestions use it). */
  panel: (send: (text: string) => void) => ReactNode;
};

/**
 * The floating Explore pill (reference: littleplains.com), from PR #31, the
 * component JP kept on 2026-11-05. Two things live in it: a text field, so
 * typing "coffee shop" narrows the wall as you type, and the filter panel,
 * which opens above the pill when the field has focus. Portaled to <body>
 * so position: fixed is never trapped by a transformed ancestor.
 *
 * With `ask`, the panel has two modes (JP, 2026-11-06, after Little Plains' global chat): Search, the
 * wall narrowing as you type, and Ask, a concierge that answers with pieces of the wall. A quiet
 * "Search · Ask" switch sits in the panel head; a typed question ("…?", or "what…", "who…") moves to
 * Ask on its own unless the visitor picked a mode by hand. On the phone Ask is a bottom sheet and the
 * page behind it is inert.
 */
export function WorkExplore({
  query,
  onQuery,
  onClear,
  activeCount,
  visible,
  children,
  tools,
  ask,
}: {
  query: string;
  onQuery: (value: string) => void;
  /** Clears the typed search and every filter. */
  onClear: () => void;
  activeCount: number;
  /** The pill only shows while the wall is on screen. */
  visible: boolean;
  children: ReactNode;
  /** Quiet page tools that live in the panel head, like the pause control for looping video. */
  tools?: ReactNode;
  ask?: ExploreAsk;
}) {
  const [state, setState] = useState<PanelState>("closed");
  const open = state === "open";
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef(0);
  const openPanel = () => setState("open");
  /** Keyboard (Escape, Enter) closes at once: keyboard actions never animate. */
  const closeNow = () => setState("closed");
  /** Pointer closes (Close, click outside) run the 120 ms exit, then unmount; reduced motion ends it at once. */
  const closeSoft = () => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setState("closed");
      return;
    }
    setState((current) => (current === "open" ? "closing" : current));
  };
  useEffect(() => {
    window.clearTimeout(closeTimer.current);
    if (state !== "closing") return;
    // transitionend is the usual end; the timer covers a browser that skips the transition.
    closeTimer.current = window.setTimeout(() => setState("closed"), CLOSE_MS + 80);
    return () => window.clearTimeout(closeTimer.current);
  }, [state]);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Escape hands focus back to the field; that focus must not reopen the panel (keyboard walk F7). */
  const quietFocus = useRef(false);
  const [mode, setMode] = useState<Mode>("search");
  const [askDraft, setAskDraft] = useState("");
  /** True once the visitor picks a mode by hand: no more switching on their behalf until the panel closes. */
  const forced = useRef(false);
  const askOn = Boolean(ask?.available);
  const asking = mode === "ask";

  const focusField = () => inputRef.current?.focus({ preventScroll: true });
  const chooseMode = (next: Mode) => {
    forced.current = true;
    if (next === mode) return focusField();
    if (next === "ask") {
      setAskDraft(query.slice(0, ASK_MAX_CHARS));
      if (query) onQuery("");
    } else {
      if (askDraft) onQuery(askDraft);
      setAskDraft("");
    }
    setMode(next);
    focusField();
  };
  const sendAsk = (text: string) => {
    if (!ask || !text.trim() || ask.pending) return;
    ask.onAsk(text);
    setAskDraft("");
    openPanel();
    focusField();
  };

  const onOpen = ask?.onOpen;
  useEffect(() => {
    if (open) onOpen?.();
  }, [open, onOpen]);

  // A closed panel forgets the hand-picked mode; without Ask it always reopens on Search.
  useEffect(() => {
    if (state !== "closed") return;
    forced.current = false;
    if (!askOn) setMode("search");
  }, [state, askOn]);

  // Phone: Ask is a sheet over the page, and the page behind it is inert while it is open.
  useEffect(() => {
    const root = rootRef.current;
    if (!open || !asking || !root || !window.matchMedia?.(SHEET_QUERY).matches) return;
    const made: Element[] = [];
    for (const child of Array.from(document.body.children)) {
      if (child === root || child.hasAttribute("inert") || child.tagName === "SCRIPT") continue;
      child.setAttribute("inert", "");
      made.push(child);
    }
    return () => made.forEach((child) => child.removeAttribute("inert"));
  }, [open, asking]);

  useEffect(() => setMounted(true), []);
  // Hidden means hidden for keyboards too (React 18 has no `inert` prop).
  useEffect(() => {
    if (!visible) setState("closed");
    rootRef.current?.toggleAttribute("inert", !visible);
  }, [visible, mounted]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      // Escape closes the panel only: the query stays, and focus stays on (or returns to) the field.
      if (event.key === "Escape") {
        event.preventDefault();
        closeNow();
        if (document.activeElement !== inputRef.current) quietFocus.current = true;
        inputRef.current?.focus({ preventScroll: true });
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeSoft();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={rootRef}
      className="site-explore"
      data-visible={visible}
      data-open={open}
      data-mode={mode}
      onBlur={(event) => {
        // Tabbing out of the pill and its panel closes the panel; the window losing focus does not.
        const next = event.relatedTarget as Node | null;
        if (next && !rootRef.current?.contains(next)) closeSoft();
      }}
    >
      <form
        role="search"
        className="site-explore__pill"
        onSubmit={(event) => {
          event.preventDefault();
          if (asking) return sendAsk(askDraft);
          inputRef.current?.blur();
          closeNow();
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none">
          <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          id={EXPLORE_FIELD_ID}
          type="search"
          className="site-explore__input"
          value={asking ? askDraft : query}
          placeholder={asking ? askCopy.placeholder : home.explore}
          aria-label={asking ? askCopy.inputLabel : home.askLabel}
          maxLength={asking ? ASK_MAX_CHARS : undefined}
          // ARIA 1.2 combobox: the field owns the filter panel it opens. aria-expanded is valid on a
          // combobox (it is not on a bare type="search" input, the Lighthouse failure).
          role="combobox"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-autocomplete="none"
          autoComplete="off"
          enterKeyHint={asking ? "send" : "search"}
          onChange={(event) => {
            const value = event.target.value;
            if (asking) return setAskDraft(value);
            if (askOn && !forced.current && looksLikeQuestion(value)) {
              setMode("ask");
              setAskDraft(value.slice(0, ASK_MAX_CHARS));
              if (query) onQuery("");
              openPanel();
              return;
            }
            onQuery(value);
          }}
          onKeyDown={(event) => {
            // A search field clears itself on Escape; here Escape never loses the visitor's words.
            if (event.key === "Escape") event.preventDefault();
          }}
          onFocus={(event) => {
            if (quietFocus.current) {
              quietFocus.current = false;
              return;
            }
            openPanel();
            // On a touch screen the first tap opens the filters and leaves the keyboard down, so the
            // keyboard never covers them (red team 18). A second tap on the field brings the keyboard.
            // Ask wants the keyboard: there the field is the whole point.
            if (!open && !asking && window.matchMedia?.("(pointer: coarse)")?.matches === true) event.currentTarget.blur();
          }}
          onClick={openPanel}
        />
      </form>
      {state !== "closed" ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={asking ? askCopy.dialog : home.exploreDialog}
          aria-hidden={state === "closing" || undefined}
          className="site-explore__panel"
          data-state={state}
          onTransitionEnd={(event) => {
            if (event.propertyName === "opacity" && state === "closing") setState("closed");
          }}
        >
          <div className="site-explore__head">
            {askOn || asking ? (
              <div className="site-explore__modes" role="group" aria-label={askCopy.modeLabel}>
                <button type="button" aria-pressed={!asking} onClick={() => chooseMode("search")}>
                  {askCopy.search}
                </button>
                <span aria-hidden="true">·</span>
                <button type="button" aria-pressed={asking} onClick={() => chooseMode("ask")} disabled={!askOn && !asking}>
                  {askCopy.ask}
                </button>
              </div>
            ) : (
              <p>{home.exploreDialog}</p>
            )}
            <div className="site-explore__head-actions">
              {asking ? null : tools}
              {!asking && (query || activeCount > 0) ? (
                <button type="button" onClick={onClear} data-action="clear">
                  {home.results.clear}
                </button>
              ) : null}
              <button type="button" onClick={closeSoft}>
                {home.close}
              </button>
            </div>
          </div>
          {asking && ask ? ask.panel(sendAsk) : children}
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
