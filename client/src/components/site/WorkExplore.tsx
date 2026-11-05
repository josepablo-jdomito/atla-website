import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { siteCopy } from "@/content/siteCopy";

const { home } = siteCopy;

// Floating "Explore" pill for the archive (reference: littleplains.com/search), from PR #31.
// The filters open in a panel above the pill, so the work starts right under its label.
// Portaled to <body> so position: fixed is never trapped by a transformed ancestor.
// v2: colors come from the --site-* tokens, so dark mode needs no invert filter.

export function WorkExplore({
  activeCount,
  resultCount,
  visible,
  children,
}: {
  activeCount: number;
  resultCount: number;
  /** The pill only shows while the archive is on screen. */
  visible: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);
  // Hidden means hidden for keyboards too (React 18 has no `inert` prop).
  useEffect(() => {
    if (!visible) setOpen(false);
    rootRef.current?.toggleAttribute("inert", !visible);
  }, [visible, mounted]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
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
    <div ref={rootRef} className="site-explore" data-visible={visible}>
      {open ? (
        <div id={panelId} role="dialog" aria-label={home.exploreDialog} className="site-explore__panel">
          <div className="site-explore__head">
            <p>{home.project(resultCount)}</p>
            <button type="button" onClick={() => setOpen(false)}>
              {home.close}
            </button>
          </div>
          {children}
        </div>
      ) : null}
      <button
        ref={triggerRef}
        type="button"
        className="site-explore__pill"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none">
          <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>{home.explore}</span>
        {activeCount > 0 ? <span className="site-explore__count">{activeCount}</span> : null}
      </button>
    </div>,
    document.body,
  );
}
