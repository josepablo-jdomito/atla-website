import { useState, type FormEvent } from "react";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { SeoHead } from "@/components/seo/SeoHead";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatMetaTitle } from "@shared/siteSeo";

const CONTACT_EMAIL = "josepablo@atla.design";
const START_URL = "https://start.atla.design";

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
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: 0.3,
  lineHeight: 1,
  textDecoration: "none",
  borderRadius: 999,
  minHeight: 48,
  padding: "0 22px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  border: "1px solid #222",
  cursor: "pointer",
};

type FormStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "sent" }
  | { state: "unavailable" }
  | { state: "error"; message: string };

function ContactForm() {
  const [status, setStatus] = useState<FormStatus>({ state: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""),
      message: String(data.get("message") || ""),
      website: String(data.get("website") || ""),
      page: typeof window !== "undefined" ? window.location.pathname : "",
    };

    setStatus({ state: "submitting" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.status === 503) {
        setStatus({ state: "unavailable" });
        return;
      }
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setStatus({ state: "error", message: body?.error || "Something went wrong. Email us instead." });
        return;
      }
      form.reset();
      setStatus({ state: "sent" });
    } catch {
      setStatus({ state: "error", message: "We could not reach the server. Email us instead." });
    }
  }

  if (status.state === "sent") {
    return (
      <div role="status" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ ...bodyStyle, fontWeight: 600 }}>Received. We read every note directly and reply with the next recommended step.</p>
        <p style={{ ...bodyStyle, color: "#6f6f6f" }}>
          If it is urgent, write to <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#222" }}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    );
  }

  const isSubmitting = status.state === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate={false} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={labelStyle}>Name</span>
        <input name="name" type="text" required maxLength={120} autoComplete="name" style={fieldStyle} />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={labelStyle}>Email</span>
        <input name="email" type="email" required maxLength={200} autoComplete="email" inputMode="email" style={fieldStyle} />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={labelStyle}>Company or website (optional)</span>
        <input name="company" type="text" maxLength={160} autoComplete="organization" style={fieldStyle} />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={labelStyle}>What is the business, what feels misaligned, and what has to happen next?</span>
        <textarea name="message" required minLength={10} maxLength={4000} rows={6} style={{ ...fieldStyle, resize: "vertical" }} />
      </label>
      {/* Honeypot: hidden from people, filled by bots. */}
      <div aria-hidden="true" style={{ position: "absolute", left: -10000, width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status.state === "error" ? (
        <p role="alert" style={{ ...bodyStyle, color: "#9a2d1f" }}>
          {status.message}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#222" }}>{CONTACT_EMAIL}</a>
        </p>
      ) : null}
      {status.state === "unavailable" ? (
        <p role="alert" style={{ ...bodyStyle, color: "#6f6f6f" }}>
          The form is offline right now. Send your note to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#222" }}>{CONTACT_EMAIL}</a> and we will pick it up there.
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

          <section aria-labelledby="contact-form" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h2 id="contact-form" style={{ ...headingStyle, fontSize: isMobile ? 28 : 36 }}>Or write to us directly.</h2>
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
              Contact can be initiated through the form on this page, by email at {CONTACT_EMAIL}, or through the
              guided start at {START_URL}. We review inquiries directly and respond with the next recommended step,
              including the right conversation format, likely workstream, and the inputs required to move quickly.
            </p>
            <p>
              Typical kickoff information includes budget range, internal approval flow, launch milestones, current
              brand constraints, and whether support is needed across packaging, website, messaging, or campaign
              rollout. Sharing this in the first note improves speed and recommendation quality.
            </p>
          </section>
        </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
