import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/components/theme/ThemeProvider";

// Floating "Explore" pill for the work index (reference: littleplains.com/search).
// The filters that used to sit above the grid open here, so the work starts under the header.
// Portaled to <body> because .atla-dark-surface uses a CSS filter, which breaks position: fixed.

export function WorkExplore({
  activeCount,
  resultCount,
  children,
}: {
  activeCount: number;
  resultCount: number;
  children: ReactNode;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

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
    <div ref={rootRef} className="atla-explore" data-theme={isDark ? "dark" : "light"}>
      {open ? (
        <div id={panelId} role="dialog" aria-label="Filter work" className="atla-explore-panel">
          <div className="atla-explore-panel-head">
            <p>{resultCount} {resultCount === 1 ? "project" : "projects"}</p>
            <button type="button" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
          {children}
        </div>
      ) : null}
      <button
        ref={triggerRef}
        type="button"
        className="atla-explore-pill"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none">
          <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Explore</span>
        {activeCount > 0 ? <span className="atla-explore-count">{activeCount}</span> : null}
      </button>
    </div>,
    document.body,
  );
}
