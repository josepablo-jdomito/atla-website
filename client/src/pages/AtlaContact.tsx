import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { ATLA_PILL } from "@/components/atla/atlaStyles";
import { SeoHead } from "@/components/seo/SeoHead";
import { useIsMobile } from "@/hooks/use-mobile";
import { CONTACT_EMAIL, formatMetaTitle, START_URL } from "@shared/siteSeo";

const headingStyle: React.CSSProperties = {
  fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
  fontWeight: 400,
  lineHeight: "1.05",
  color: "#222",
  margin: 0,
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 16,
  fontWeight: 500,
  lineHeight: "1.5",
  letterSpacing: 0.2,
  color: "#222",
  margin: 0,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 12,
  fontWeight: 600,
  lineHeight: "1.2",
  letterSpacing: 0.48,
  textTransform: "uppercase",
  color: "#6f6f6f",
  margin: 0,
};

const fieldStyle: React.CSSProperties = {
  ...bodyStyle,
  width: "100%",
  minHeight: 48,
  padding: "12px 14px",
  border: "1px solid #d8d8d8",
  borderRadius: 4,
  background: "#fff",
  boxSizing: "border-box",
  outlineOffset: 2,
};

const buttonStyle: React.CSSProperties = {
  ...ATLA_PILL,
  border: "1px solid #222",
  cursor: "pointer",
};

const SUCCESS_TEXT = "Received. We read every note directly and reply with the next recommended step.";
const OFFLINE_TEXT = `The form is offline right now. Send your note to ${CONTACT_EMAIL} and we will pick it up there.`;
const GENERIC_ERROR = "Something went wrong. Email us instead.";

/** Messages for the no-JavaScript path, where the server redirects back with ?error=<code>. */
const REDIRECT_ERRORS: Record<string, string> = {
  unavailable: OFFLINE_TEXT,
  invalid: "Check the fields and try again.",
  busy: "Too many messages from this connection. Try again in a few minutes.",
  failed: "We could not save your message. Email us instead.",
};

type FormStatus = "idle" | "submitting" | "sent" | { error: string };

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const statusRef = useRef<HTMLDivElement | null>(null);

  // The prerendered form can submit natively before hydration; the server then redirects back here.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("sent") === "1") setStatus("sent");
    const code = params.get("error");
    if (code) setStatus({ error: REDIRECT_ERRORS[code] || GENERIC_ERROR });
  }, []);

  useEffect(() => {
    if (status === "sent") statusRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""),
      message: String(data.get("message") || ""),
      _gotcha: String(data.get("_gotcha") || ""),
      page: window.location.pathname,
    };

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.status === 503) {
        setStatus({ error: OFFLINE_TEXT });
        return;
      }
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setStatus({ error: body?.error || GENERIC_ERROR });
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus({ error: "We could not reach the server. Email us instead." });
    }
  }

  const isSubmitting = status === "submitting";
  const isSent = status === "sent";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Always mounted so assistive tech announces the change; receives focus once the message is saved. */}
      <div ref={statusRef} role="status" aria-live="polite" tabIndex={-1} style={{ outline: "none" }}>
        {isSent ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ ...bodyStyle, fontWeight: 600 }}>{SUCCESS_TEXT}</p>
            <p style={{ ...bodyStyle, color: "#6f6f6f" }}>
              If it is urgent, write to <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#222" }}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
        ) : null}
      </div>

      {isSent ? null : (
        <form method="post" action="/api/contact" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Field label="Name">
            <input name="name" type="text" required maxLength={120} autoComplete="name" style={fieldStyle} />
          </Field>
          <Field label="Email">
            <input name="email" type="email" required maxLength={200} autoComplete="email" inputMode="email" style={fieldStyle} />
          </Field>
          <Field label="Company or website (optional)">
            <input name="company" type="text" maxLength={160} autoComplete="organization" style={fieldStyle} />
          </Field>
          <Field label="What is the business, what feels misaligned, and what has to happen next?">
            <textarea name="message" required minLength={10} maxLength={4000} rows={6} style={{ ...fieldStyle, resize: "vertical" }} />
          </Field>
          {/* Honeypot. Named and labelled so browser autofill and password managers have nothing to match. */}
          <div aria-hidden="true" style={{ position: "absolute", left: -10000, width: 1, height: 1, overflow: "hidden" }}>
            <label>
              Leave this field empty
              <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {typeof status === "object" ? (
            <p role="alert" style={{ ...bodyStyle, color: "#9a2d1f" }}>
              {status.error}{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#222" }}>{CONTACT_EMAIL}</a>
            </p>
          ) : null}

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="atla-tap-target"
              style={{ ...buttonStyle, background: "#222", color: "#fafafa", opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? "Sending…" : "Send message"}
            </button>
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ ...bodyStyle, color: "#6f6f6f", textDecoration: "underline" }}>
              or email {CONTACT_EMAIL}
            </a>
          </div>
        </form>
      )}
    </div>
  );
}

export default function AtlaContact() {
  const isMobile = useIsMobile();

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={formatMetaTitle("Contact Atla", "Start a Branding or Digital Project")}
        description="Contact Atla to discuss branding, identity, digital design, or creative direction for your next launch, reposition, or growth stage."
        pathname="/contact"
        image="/figmaAssets/about-hero.jpg"
      />
      <div className="atla-dark-surface">
        <AtlaNav />
        <main
          style={{
            padding: isMobile ? "80px 10px 100px" : "120px 20px 160px",
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 40 : 56,
            maxWidth: 640,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <p style={labelStyle}>Contact</p>
            <h1 style={{ ...headingStyle, fontSize: isMobile ? 44 : 72 }}>
              Start the conversation before the project gets noisy.
            </h1>
            <p style={{ ...bodyStyle, maxWidth: 420 }}>
              We work with teams that need clarity, not decoration. If you are launching, repositioning,
              or rebuilding a brand system, we can help shape the strategy and the execution together.
            </p>
          </div>

          <section aria-labelledby="contact-start" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p id="contact-start" style={labelStyle}>Not sure what you need yet?</p>
            <p style={{ ...bodyStyle, maxWidth: 520 }}>
              Start with the guided path. It tells you whether the right next move is a Branding Analysis, a full
              identity engagement, or a narrower decision first.
            </p>
            <div>
              <a href={START_URL} className="atla-tap-target" style={{ ...buttonStyle, background: "#222", color: "#fafafa" }}>
                Pick where to start
              </a>
            </div>
          </section>

          <section id="contact-form" aria-labelledby="contact-form-heading" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h2 id="contact-form-heading" style={{ ...headingStyle, fontSize: isMobile ? 28 : 36 }}>Or write to us directly.</h2>
              <p style={{ ...bodyStyle, maxWidth: 520, color: "#6f6f6f" }}>
                The strongest starting point is a straightforward note: what the business is, what feels misaligned
                right now, and what has to happen next.
              </p>
            </div>
            <ContactForm />
          </section>

          <section className="sr-only" aria-label="Contact details and process">
            <h2>How to start a project with Atla</h2>
            <p>
              Atla works with founders and leadership teams who need one integrated approach across brand strategy,
              identity design, packaging, and digital execution. Most conversations start with a short project brief
              that includes your current stage, the key business objective, and any deadlines that shape scope.
            </p>
            <p>
              If your team is deciding between repositioning, a new identity system, a website redesign, or launch
              support, include that context in your first message. We review inquiries directly and respond with the
              next recommended step, including the right conversation format, likely workstream, and the inputs
              required to move quickly.
            </p>
            <p>
              Contact can be initiated through the form on this page, by email at {CONTACT_EMAIL}, or through the
              guided start at {START_URL}. The goal is to reduce friction and get from inquiry to clear direction as
              fast as possible.
            </p>
            <p>
              Typical kickoff information includes budget range, internal approval flow, launch milestones, current
              brand constraints, and whether support is needed across packaging, website, messaging, or campaign
              rollout. Sharing this in the first note improves speed and recommendation quality.
            </p>
            <p>
              When timing is tight, we can prioritize the smallest sequence of decisions that unlocks momentum
              first, then expand scope with less risk.
            </p>
          </section>
        </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
