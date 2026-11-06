import { useEffect, useId, useRef, useState } from "react";
import { hasThirdPartyTags } from "@/lib/consent-tags";
import { likelyNeedsConsentPrompt, readStoredConsent, setAnalyticsConsent } from "@/lib/ga";
import { siteCopy } from "@/content/siteCopy";

/**
 * Cookie notice for Google Analytics and, when their ids are set, Microsoft
 * Clarity and the Meta Pixel. It shows to visitors on a European time zone
 * who have not chosen yet, to everyone who has not chosen once Meta or
 * Clarity is configured (they load only on Accept), or when the footer's "Analytics cookies"
 * link asks for it. Consent defaults themselves live in lib/ga.ts.
 *
 * On the site's tokens (paper and ink, dark mode), styled in site.css `.consent`. Focus moves into it
 * when it opens and goes back where it was when it closes. Escape closes it without choosing: nothing
 * is stored and nothing changes, which is what the privacy page promises (in Europe the cookies stay
 * off until Accept). While it is open, html[data-consent="open"] hides the Explore pill, which took
 * Decline's taps on the phone.
 */
export const OPEN_CONSENT_EVENT = "atla:open-analytics-consent";

const { consent: copy } = siteCopy;

export function AnalyticsConsent() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const textId = useId();

  useEffect(() => {
    if (!readStoredConsent() && (likelyNeedsConsentPrompt() || hasThirdPartyTags())) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const active = document.activeElement;
    openerRef.current = active instanceof HTMLElement && active !== document.body ? active : null;
    acceptRef.current?.focus({ preventScroll: true });
    document.documentElement.setAttribute("data-consent", "open");
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Only when focus is in the notice or nowhere in particular: Escape in another open layer is that layer's.
      const target = document.activeElement;
      if (target && target !== document.body && !dialogRef.current?.contains(target)) return;
      event.preventDefault();
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.removeAttribute("data-consent");
      const opener = openerRef.current;
      openerRef.current = null;
      // Focus goes back to whatever opened it (the footer link); an automatic notice hands it to <main>.
      if (opener?.isConnected) opener.focus({ preventScroll: true });
      else document.getElementById("main")?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  const choose = (value: "granted" | "denied") => {
    setAnalyticsConsent(value);
    setOpen(false);
  };

  return (
    <div ref={dialogRef} role="dialog" aria-label={copy.label} aria-describedby={textId} className="consent">
      <p id={textId} className="consent__text">
        {hasThirdPartyTags() ? copy.bodyAll : copy.bodyGa}{" "}
        <a href="/privacy" className="consent__link">
          {copy.privacy}
        </a>
      </p>
      <div className="consent__actions">
        <button ref={acceptRef} type="button" className="consent__button" data-variant="accept" onClick={() => choose("granted")}>
          {copy.accept}
        </button>
        <button type="button" className="consent__button" onClick={() => choose("denied")}>
          {copy.decline}
        </button>
      </div>
    </div>
  );
}
