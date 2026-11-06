import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { siteCopy } from "@/content/siteCopy";

const { home } = siteCopy;

/**
 * The floating Explore pill (reference: littleplains.com), from PR #31, the component JP kept on
 * 2026-11-05. Since the Figma look it is a search field only: typing "coffee shop" narrows the wall
 * as you type. The filter index on the page replaced its panel. Portaled to <body> so
 * position: fixed is never trapped by a transformed ancestor.
 */
export function WorkExplore({
  query,
  onQuery,
  visible,
}: {
  query: string;
  onQuery: (value: string) => void;
  /** The pill only shows while the wall is on screen. */
  visible: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);
  // Hidden means hidden for keyboards too (React 18 has no `inert` prop).
  useEffect(() => {
    rootRef.current?.toggleAttribute("inert", !visible);
  }, [visible, mounted]);

  if (!mounted) return null;

  return createPortal(
    <div ref={rootRef} className="site-explore" data-visible={visible}>
      <form
        role="search"
        className="site-explore__pill"
        onSubmit={(event) => {
          event.preventDefault();
          inputRef.current?.blur();
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
          autoComplete="off"
          enterKeyHint="search"
          onChange={(event) => onQuery(event.target.value)}
          onKeyDown={(event) => {
            // A search field clears itself on Escape; here Escape never loses the visitor's words.
            if (event.key === "Escape") event.preventDefault();
          }}
        />
      </form>
    </div>,
    document.body,
  );
}
