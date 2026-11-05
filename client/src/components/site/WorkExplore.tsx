import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { siteCopy } from "@/content/siteCopy";

const { home } = siteCopy;

/** How long a pointer close keeps the panel mounted while it fades (site.css, data-state="closing"). */
const CLOSE_MS = 120;
/** closing = still mounted, running its exit; a refocus retargets the transition back to open. */
type PanelState = "closed" | "open" | "closing";

/**
 * The floating Explore pill (reference: littleplains.com), from PR #31, the
 * component JP kept on 2026-11-05. Two things live in it: a text field, so
 * typing "coffee shop" narrows the wall as you type, and the filter panel,
 * which opens above the pill when the field has focus. Portaled to <body>
 * so position: fixed is never trapped by a transformed ancestor.
 */
export function WorkExplore({
  query,
  onQuery,
  onClear,
  activeCount,
  visible,
  children,
}: {
  query: string;
  onQuery: (value: string) => void;
  /** Clears the typed search and every filter. */
  onClear: () => void;
  activeCount: number;
  /** The pill only shows while the wall is on screen. */
  visible: boolean;
  children: ReactNode;
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

  useEffect(() => setMounted(true), []);
  // Hidden means hidden for keyboards too (React 18 has no `inert` prop).
  useEffect(() => {
    if (!visible) setState("closed");
    rootRef.current?.toggleAttribute("inert", !visible);
  }, [visible, mounted]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeNow();
        inputRef.current?.blur();
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
    <div ref={rootRef} className="site-explore" data-visible={visible} data-open={open}>
      {state !== "closed" ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={home.exploreDialog}
          aria-hidden={state === "closing" || undefined}
          className="site-explore__panel"
          data-state={state}
          onTransitionEnd={(event) => {
            if (event.propertyName === "opacity" && state === "closing") setState("closed");
          }}
        >
          <div className="site-explore__head">
            <p>{home.exploreDialog}</p>
            <div className="site-explore__head-actions">
              {query || activeCount > 0 ? (
                <button type="button" onClick={onClear} data-action="clear">
                  {home.results.clear}
                </button>
              ) : null}
              <button type="button" onClick={closeSoft}>
                {home.close}
              </button>
            </div>
          </div>
          {children}
        </div>
      ) : null}
      <form
        role="search"
        className="site-explore__pill"
        onSubmit={(event) => {
          event.preventDefault();
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
          type="search"
          className="site-explore__input"
          value={query}
          placeholder={home.explore}
          aria-label={home.askLabel}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          autoComplete="off"
          enterKeyHint="search"
          onChange={(event) => onQuery(event.target.value)}
          onFocus={openPanel}
          onClick={openPanel}
        />
        {activeCount > 0 ? <span className="site-explore__count">{activeCount}</span> : null}
      </form>
    </div>,
    document.body,
  );
}
