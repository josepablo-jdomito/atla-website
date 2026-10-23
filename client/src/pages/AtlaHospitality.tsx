import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { formatMetaTitle } from "@shared/siteSeo";
import { SeoHead } from "@/components/seo/SeoHead";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { AtlaHeader } from "@/components/atla/AtlaHeader";
import { buildServiceSchema } from "@/components/atla/AtlaLongformLayout";
import { trackEvent } from "@/hooks/use-analytics";
import { useIsMobile } from "@/hooks/use-mobile";

const PATHNAME = "/hospitality";
const DESCRIPTION =
  "Identity systems for restaurants and hotels, designed down to the matchbox and delivered ready for the vendors who make them. Rústico, Christophe's, Temakase.";


const DISPLAY = "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif";
const SANS = "'Libre Franklin', Helvetica, sans-serif";
const INK = "#222";
const MUTED = "#6f6f6f";
const RULE = "#d4d4d4";

// Project photography is pending; each slot renders as a placeholder labelled with what goes there.
type CaseImage = { alt: string; ratio: string; wide?: boolean };

type Badge = { src: string; alt: string; label: string };

type HospitalityCase = {
  number: string;
  name: string;
  tagline: string;
  place: string;
  kind: string;
  summary: string;
  scope: string[];
  hero: CaseImage;
  details: CaseImage[];
  link?: { href: string; label: string };
  badge?: Badge;
};

const MICHELIN_KEY = { src: "/hospitality/michelin-key.webp", alt: "MICHELIN Key" };
const MICHELIN_GREEN_STAR = { src: "/hospitality/michelin-green-star.svg", alt: "MICHELIN Green Star" };

const PROOF_NAMES = ["Casa Las Tortugas", "Acre Resort", "Christophe's", "Temakase"];

const PROPERTY_TYPES = ["Hotel or resort", "Restaurant or bar", "Restaurant group", "Hotel with restaurants", "Other"];
const STAGES_OF_WORK = ["Opening a new property", "Renovating or repositioning", "Adding a concept", "Other"];
const BUDGETS = ["Under $50K", "$50K to $100K", "$100K to $250K", "$250K and up", "Not sure yet"];

const HERO: CaseImage = {
  alt: "Rústico business cards on an agave leaf",
  ratio: "2616 / 1445",
};

const CASES: HospitalityCase[] = [
  {
    number: "01",
    name: "Rústico",
    tagline: "Dinners under the stars, signed by hand.",
    place: "Los Cabos",
    kind: "Open-air restaurant at Acre Resort",
    summary:
      "Five courses outdoors, guided by what is ready now. Start in the garden, finish in the fire. The identity carries that from the leather menu to the bread bag: a heritage wordmark for the restaurant, a hand-led signature for everything the guest holds.",
    scope: ["Identity", "Menus", "Stationery", "Printed matter", "Packaging", "Website"],
    hero: {
      alt: "Rústico signature on a sandstone texture with the dinner invitation",
      ratio: "1741 / 756",
    },
    details: [
      {
        alt: "Rústico menu cover embossed in leather",
        ratio: "1396 / 1781",
      },
      {
        alt: "Rústico bread bag with the signature mark",
        ratio: "1201 / 1870",
      },
    ],
    link: { href: "/projects/rustico", label: "See the full project" },
    badge: {
      ...MICHELIN_GREEN_STAR,
      label: "Acre Resort's restaurant holds a MICHELIN Green Star.",
    },
  },
  {
    number: "02",
    name: "Christophe's Fine Foods",
    tagline: "A chef's market, from the awning in.",
    place: "Chicago",
    kind: "Chef-led prepared foods market",
    summary:
      "A new market built from nothing. Logotype, monogram, awning, uniforms, totes and a reheatable meal tray system, delivered with a supplier sheet so the owner could place every order directly.",
    scope: ["Identity", "Packaging", "Signage", "Uniforms", "Website"],
    hero: {
      alt: "Christophe's Fine Foods awning and monogram sign",
      ratio: "16 / 9",
    },
    details: [
      {
        alt: "Christophe's staff apron",
        ratio: "1000 / 1407",
      },
      {
        alt: "Christophe's tote bag",
        ratio: "1000 / 1407",
      },
      {
        alt: "Christophe's reheatable meal trays with labels",
        ratio: "16 / 9",
        wide: true,
      },
    ],
  },
  {
    number: "03",
    name: "Temakase",
    tagline: "Home of the handroll, carried by Mako.",
    place: "New York",
    kind: "Hand roll bars",
    summary:
      "An identity and a character. Mako, drawn after Ebisu, the deity of fishing and fortune, softens the brand without replacing the logo. He carries the takeout on the window, the catering box and the sidewalk sign.",
    scope: ["Identity", "Character", "Storefront", "Menus", "Catering", "Takeout"],
    hero: {
      alt: "Temakase storefront with window graphics and sidewalk sign",
      ratio: "2400 / 1240",
    },
    details: [
      {
        alt: "Temakase lunch menu",
        ratio: "1000 / 1407",
      },
      {
        alt: "Temakase catering box with Mako",
        ratio: "1000 / 1407",
      },
    ],
  },
];

const TOUCHPOINTS = [
  "Naming and brand architecture",
  "Identity and signature marks",
  "Menus and wine lists",
  "Facades, awnings and signage",
  "Uniforms",
  "Takeout, catering and retail packaging",
  "Stationery and printed matter",
  "Characters and illustration",
  "Websites and booking",
  "Vendor files and supplier specs",
];

const STAGES = [
  {
    name: "Audit",
    body: "We start on your property. Brand, guest journey and every touchpoint, read the way a guest reads them. You get one architecture for every room, restaurant and service.",
    proof: "Used at Casa Las Tortugas, Holbox: a hotel with four restaurants and a spa.",
    badge: {
      ...MICHELIN_KEY,
      label: "Casa Las Tortugas holds one MICHELIN Key.",
    },
  },
  {
    name: "Brand",
    body: "Identity to facade. Every object designed in context and handed over as production files, matched to the supplier who prints, stitches or builds it.",
    proof: "Rústico, Christophe's and Temakase.",
  },
  {
    name: "Stay",
    body: "A weekly seat at your table after launch. New concepts, new rooms, the website, and every new object held to the same standard.",
    proof: "Temakase, after the identity shipped.",
  },
];

const eyebrowStyle: CSSProperties = {
  fontFamily: SANS,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.48,
  lineHeight: "1.2",
  textTransform: "uppercase",
  color: MUTED,
  margin: 0,
};

const bodyStyle: CSSProperties = {
  fontFamily: SANS,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "1.55",
  color: INK,
  margin: 0,
};

const ctaStyle: CSSProperties = {
  fontFamily: SANS,
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: 0.4,
  lineHeight: "1.2",
  textTransform: "uppercase",
  textDecoration: "none",
  color: INK,
  minHeight: 48,
  display: "inline-flex",
  alignItems: "center",
  padding: "12px 4px",
};

function Figure({ image }: { image: CaseImage }) {
  return (
    <div
      role="img"
      aria-label={image.alt}
      style={{
        width: "100%",
        aspectRatio: image.ratio,
        backgroundColor: "#ececea",
        display: "flex",
        alignItems: "flex-end",
        padding: 14,
        boxSizing: "border-box",
      }}
    >
      <span style={{ ...eyebrowStyle, color: "#9a9a96" }}>{image.alt}</span>
    </div>
  );
}

function BadgeLine({ badge }: { badge: Badge }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 4 }}>
      <img
        src={badge.src}
        alt={badge.alt}
        loading="lazy"
        decoding="async"
        width={40}
        height={40}
        style={{ display: "block", width: 40, height: "auto", mixBlendMode: "multiply" }}
      />
      <p style={{ ...bodyStyle, fontSize: 13 }}>{badge.label}</p>
    </div>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: `1px solid ${RULE}`, paddingTop: 20 }}>
      <p style={eyebrowStyle}>{eyebrow}</p>
      <h2
        style={{
          fontFamily: DISPLAY,
          fontSize: isMobile ? 30 : 44,
          fontWeight: 400,
          lineHeight: "1.1",
          color: INK,
          margin: 0,
          maxWidth: 820,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function CaseStudy({ item }: { item: HospitalityCase }) {
  const isMobile = useIsMobile();

  return (
    <article style={{ display: "flex", flexDirection: "column", gap: isMobile ? 14 : 20 }}>
      <Figure image={item.hero} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 0.34fr) minmax(0, 1fr)",
          gap: isMobile ? 10 : 24,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <p style={eyebrowStyle}>
            {item.number} · {item.place}
          </p>
          <h3
            style={{
              fontFamily: DISPLAY,
              fontSize: isMobile ? 28 : 36,
              fontWeight: 400,
              lineHeight: "1.1",
              color: INK,
              margin: 0,
            }}
          >
            {item.name}
          </h3>
          <p style={{ fontFamily: DISPLAY, fontSize: isMobile ? 18 : 20, fontWeight: 400, lineHeight: "1.25", color: INK, margin: 0 }}>
            {item.tagline}
          </p>
          <p style={{ ...bodyStyle, color: MUTED }}>{item.kind}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
          <p style={bodyStyle}>{item.summary}</p>
          <p style={{ ...bodyStyle, color: MUTED }}>{item.scope.join(" · ")}</p>
          {item.badge ? <BadgeLine badge={item.badge} /> : null}
          {item.link ? (
            <a href={item.link.href} className="atla-link" style={ctaStyle}>
              {item.link.label} →
            </a>
          ) : null}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: item.details.length > 1 && !isMobile ? "repeat(2, minmax(0, 1fr))" : "1fr",
          gap: isMobile ? 8 : 12,
          alignItems: "start",
        }}
      >
        {item.details.map((image) => (
          <div key={image.alt} style={{ gridColumn: image.wide ? "1 / -1" : undefined }}>
            <Figure image={image.wide ? image : { ...image, ratio: "4 / 5" }} />
          </div>
        ))}
      </div>
    </article>
  );
}

const fieldStyle: CSSProperties = {
  ...bodyStyle,
  fontSize: 15,
  width: "100%",
  minHeight: 48,
  padding: "12px 14px",
  border: "1px solid #d8d8d8",
  borderRadius: 4,
  background: "#fff",
  boxSizing: "border-box",
  outlineOffset: 2,
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={eyebrowStyle}>{label}</span>
      {children}
    </label>
  );
}

function Choice({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <Field label={label}>
      <select name={name} required defaultValue="" style={{ ...fieldStyle, appearance: "auto" }}>
        <option value="" disabled>
          Choose one
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

type InquiryStatus = { state: "idle" | "submitting" | "sent" | "offline" } | { state: "error"; message: string };

// Posts to /api/contact like the audit questionnaire: the qualifying answers travel inside
// the message, so the Attio note carries them without a server change.
function InquiryForm() {
  const isMobile = useIsMobile();
  const [status, setStatus] = useState<InquiryStatus>({ state: "idle" });
  const statusRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status.state === "sent") statusRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => {
      const entry = data.get(key);
      return typeof entry === "string" ? entry.trim() : "";
    };
    const message = [
      `Property type: ${value("propertyType")}`,
      `Project: ${value("stage")}`,
      `Opening or launch date: ${value("opening") || "not given"}`,
      `Budget: ${value("budget")}`,
      "",
      value("message"),
    ]
      .join("\n")
      .slice(0, 4000);

    setStatus({ state: "submitting" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: value("name"),
          email: value("email"),
          company: value("company"),
          message,
          source: "atla.design/hospitality",
          _gotcha: value("_gotcha"),
        }),
      });
      if (response.status === 503) {
        setStatus({ state: "offline" });
        return;
      }
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setStatus({ state: "error", message: body?.error || "Something went wrong. Email us instead." });
        return;
      }
      form.reset();
      setStatus({ state: "sent" });
      trackEvent("contact_form_submit", { page: "hospitality", property_type: value("propertyType"), budget: value("budget") });
    } catch {
      setStatus({ state: "error", message: "We could not reach the server. Email us instead." });
    }
  }

  const isSent = status.state === "sent";
  const isSubmitting = status.state === "submitting";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div ref={statusRef} role="status" aria-live="polite" tabIndex={-1} style={{ outline: "none" }}>
        {isSent ? (
          <p style={{ ...bodyStyle, fontWeight: 600 }}>Received. José Pablo will reply with the next step.</p>
        ) : null}
      </div>
      {isSent ? null : (
        <form method="post" action="/api/contact" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <input type="hidden" name="source" value="atla.design/hospitality" />
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
            <Field label="Name">
              <input name="name" type="text" required maxLength={120} autoComplete="name" style={fieldStyle} />
            </Field>
            <Field label="Email">
              <input name="email" type="email" required maxLength={200} autoComplete="email" inputMode="email" style={fieldStyle} />
            </Field>
            <Field label="Property or group">
              <input name="company" type="text" required maxLength={160} autoComplete="organization" style={fieldStyle} />
            </Field>
            <Choice name="propertyType" label="Type of property" options={PROPERTY_TYPES} />
            <Choice name="stage" label="Stage of the project" options={STAGES_OF_WORK} />
            <Field label="Opening or launch date">
              <input name="opening" type="text" maxLength={60} placeholder="Month and year" style={fieldStyle} />
            </Field>
          </div>
          <Choice name="budget" label="Budget for brand and identity" options={BUDGETS} />
          <Field label="What should the guest feel when they walk in?">
            <textarea name="message" required minLength={10} maxLength={3000} rows={5} style={{ ...fieldStyle, resize: "vertical" }} />
          </Field>
          <div aria-hidden="true" style={{ position: "absolute", left: -10000, width: 1, height: 1, overflow: "hidden" }}>
            <label>
              Leave this field empty
              <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {status.state === "offline" || status.state === "error" ? (
            <p role="alert" style={{ ...bodyStyle, color: status.state === "error" ? "#9a2d1f" : MUTED }}>
              {status.state === "error" ? status.message : "The form is offline right now. Write to us at"}{" "}
              <a href="mailto:josepablo@atla.design" style={{ color: INK }}>
                josepablo@atla.design
              </a>
            </p>
          ) : null}
          <p style={{ ...bodyStyle, fontSize: 13, color: MUTED }}>
            What you send goes to our CRM so we can answer you. See the{" "}
            <a href="/privacy" style={{ color: INK }}>
              privacy policy
            </a>
            .
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...ctaStyle,
                padding: "12px 24px",
                border: `1px solid ${INK}`,
                borderRadius: 999,
                background: INK,
                color: "#fafafa",
                cursor: "pointer",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Sending…" : "Send"}
            </button>
            <a href="mailto:josepablo@atla.design" style={{ ...bodyStyle, color: MUTED, textDecoration: "underline" }}>
              or email josepablo@atla.design
            </a>
          </div>
        </form>
      )}
    </div>
  );
}

export default function AtlaHospitality() {
  const isMobile = useIsMobile();

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={formatMetaTitle("Hospitality", "Atla")}
        description={DESCRIPTION}
        pathname={PATHNAME}
        structuredData={buildServiceSchema({
          path: PATHNAME,
          name: "Branding for restaurants and hotels",
          description: DESCRIPTION,
        })}
      />
      <AtlaHeader />
      <div className="atla-dark-surface">
        <main
          className="atla-enter"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: isMobile ? "22px 8px 68px" : "34px 12px 112px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1160,
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? 40 : 72,
            }}
          >
            <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 14 : 18 }}>
              <p style={eyebrowStyle}>Hospitality</p>
              <h1
                style={{
                  fontFamily: DISPLAY,
                  fontSize: isMobile ? 40 : 72,
                  fontWeight: 400,
                  lineHeight: "1.04",
                  color: INK,
                  margin: 0,
                  maxWidth: 980,
                }}
              >
                Your guest holds the menu. The brand book stays on the shelf.
              </h1>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 640 }}>
                <p style={bodyStyle}>
                  Atla builds identities for restaurants and hotels that have to work on a facade, a menu, a uniform
                  and a booking page at once. Every object is designed in context and handed over ready for the vendor
                  who makes it.
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: isMobile ? 10 : 16, paddingTop: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {[MICHELIN_KEY, MICHELIN_GREEN_STAR].map((mark) => (
                    <img
                      key={mark.src}
                      src={mark.src}
                      alt={mark.alt}
                      width={32}
                      height={32}
                      decoding="async"
                      style={{ display: "block", width: 32, height: 32, objectFit: "contain", mixBlendMode: "multiply" }}
                    />
                  ))}
                </div>
                <p style={{ ...bodyStyle, fontWeight: 600 }}>Casa Las Tortugas holds a MICHELIN Key. Acre Resort's restaurant holds a MICHELIN Green Star.</p>
                <p style={{ ...bodyStyle, color: MUTED, flexBasis: isMobile ? "100%" : "auto" }}>Selected clients: {PROOF_NAMES.join(" · ")}</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <a href="#inquire" className="atla-link" style={ctaStyle}>
                  Tell us about your property →
                </a>
                <a href="#work" className="atla-link" style={{ ...ctaStyle, color: MUTED }}>
                  See the work ↓
                </a>
              </div>
              <div style={{ marginTop: isMobile ? 8 : 18 }}>
                <Figure image={HERO} />
              </div>
            </section>

            <section id="work" style={{ display: "flex", flexDirection: "column", gap: isMobile ? 32 : 56, scrollMarginTop: 80 }}>
              <SectionHead eyebrow="Selected work" title="Three kitchens. Every object designed." />
              {CASES.map((item) => (
                <CaseStudy key={item.name} item={item} />
              ))}
            </section>

            <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 20 : 28 }}>
              <SectionHead eyebrow="What we design" title="Everything a guest touches." />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) minmax(0, 0.8fr)",
                  gap: isMobile ? 20 : 32,
                  alignItems: "start",
                }}
              >
                <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {TOUCHPOINTS.map((item, index) => (
                    <li
                      key={item}
                      style={{
                        ...bodyStyle,
                        display: "grid",
                        gridTemplateColumns: "40px 1fr",
                        padding: "12px 0",
                        borderBottom: `1px solid ${RULE}`,
                      }}
                    >
                      <span style={{ color: MUTED }}>{String(index + 1).padStart(2, "0")}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
                <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  <Figure image={{ alt: "Mako, the Temakase character, carrying a takeout bag", ratio: "1600 / 1082" }} />
                  <figcaption style={{ ...eyebrowStyle }}>Mako · Temakase</figcaption>
                </figure>
              </div>
            </section>

            <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 20 : 28 }}>
              <SectionHead eyebrow="How we work" title="Audit. Brand. Stay." />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
                  gap: isMobile ? 24 : 28,
                }}
              >
                {STAGES.map((stage, index) => (
                  <div
                    key={stage.name}
                    style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `2px solid ${INK}`, paddingTop: 16 }}
                  >
                    <p style={eyebrowStyle}>{String(index + 1).padStart(2, "0")}</p>
                    <h3 style={{ fontFamily: DISPLAY, fontSize: isMobile ? 28 : 34, fontWeight: 400, lineHeight: "1.1", color: INK, margin: 0 }}>
                      {stage.name}
                    </h3>
                    <p style={bodyStyle}>{stage.body}</p>
                    <p style={{ ...bodyStyle, color: MUTED }}>{stage.proof}</p>
                    {"badge" in stage && stage.badge ? <BadgeLine badge={stage.badge} /> : null}
                  </div>
                ))}
              </div>
            </section>

            <section
              id="inquire"
              style={{
                borderTop: `1px solid ${RULE}`,
                paddingTop: 20,
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 0.8fr) minmax(0, 1fr)",
                gap: isMobile ? 20 : 40,
                alignItems: "start",
                scrollMarginTop: 80,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={eyebrowStyle}>Start here</p>
                <h2
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: isMobile ? 30 : 44,
                    fontWeight: 400,
                    lineHeight: "1.1",
                    color: INK,
                    margin: 0,
                  }}
                >
                  Opening, renovating or adding a concept?
                </h2>
                <p style={bodyStyle}>
                  Tell us about the property and what the guest should feel when they walk in. José Pablo Domínguez,
                  founder and creative director, reads every message and replies himself.
                </p>
              </div>
              <InquiryForm />
            </section>
          </div>
        </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
