import { useEffect, useState } from "react";
import { likelyNeedsConsentPrompt, readStoredConsent, setAnalyticsConsent } from "@/lib/ga";

/**
 * Cookie notice for Google Analytics. It shows only to visitors on a European
 * time zone who have not chosen yet, or when the footer's "Analytics cookies"
 * link asks for it. Consent defaults themselves live in lib/ga.ts.
 */
export const OPEN_CONSENT_EVENT = "atla:open-analytics-consent";

const textStyle: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 13,
  fontWeight: 500,
  lineHeight: "1.45",
  letterSpacing: 0.2,
  color: "#222",
  margin: 0,
};

const buttonStyle: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 13,
  fontWeight: 600,
  padding: "10px 16px",
  minHeight: 40,
  borderRadius: 999,
  cursor: "pointer",
};

export function AnalyticsConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!readStoredConsent() && likelyNeedsConsentPrompt()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (value: "granted" | "denied") => {
    setAnalyticsConsent(value);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Analytics cookies"
      style={{
        position: "fixed",
        left: "max(12px, env(safe-area-inset-left, 0px))",
        right: "max(12px, env(safe-area-inset-right, 0px))",
        bottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        zIndex: 60,
        maxWidth: 520,
        marginLeft: "auto",
        background: "#fafafa",
        border: "1px solid #222",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <p style={textStyle}>
        We use Google Analytics cookies to see which pages lead to projects. Nothing is used for ads.{" "}
        <a href="/privacy" style={{ color: "#222" }}>
          Privacy policy
        </a>
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" onClick={() => choose("granted")} style={{ ...buttonStyle, background: "#222", color: "#fafafa", border: "1px solid #222" }}>
          Accept
        </button>
        <button type="button" onClick={() => choose("denied")} style={{ ...buttonStyle, background: "transparent", color: "#222", border: "1px solid #222" }}>
          Decline
        </button>
      </div>
    </div>
  );
}
