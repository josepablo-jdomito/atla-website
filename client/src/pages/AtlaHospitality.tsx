import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import {
  BookOpen,
  ClipboardList,
  Globe,
  Images,
  Network,
  PackageCheck,
  PenTool,
  Repeat,
  Search,
  Shirt,
  Signpost,
  Stamp,
  Type,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { formatMetaTitle } from "@shared/siteSeo";
import { SeoHead } from "@/components/seo/SeoHead";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { AtlaHeader } from "@/components/atla/AtlaHeader";
import { ATLA_PILL } from "@/components/atla/atlaStyles";
import { buildServiceSchema, type FaqItem } from "@/components/atla/AtlaLongformLayout";
import { trackEvent } from "@/hooks/use-analytics";
import { useIsMobile } from "@/hooks/use-mobile";

const PATHNAME = "/hospitality";
const DESCRIPTION =
  "Brand systems for hotels and the restaurants inside them, from Atla. Recent hotel work: Acre Resort in Los Cabos and Casa Las Tortugas in Holbox.";

const DISPLAY = "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif";
const SANS = "'Libre Franklin', Helvetica, sans-serif";
const INK = "#222";
const MUTED = "#6f6f6f";
const RULE = "#d4d4d4";

// "Atla* Branding Agency" intro event on Calendly.
const BOOK_CALL_URL = "https://calendly.com/josepablo-atla/30min?utm_source=atla.design&utm_medium=hospitality";

// Project photography is pending; each slot renders as a placeholder labelled with what goes there.
type CaseImage = { alt: string; ratio: string };

type Badge = { src: string; alt: string; label: string };

type HospitalityCase = {
  name: string;
  place: string;
  tagline: string;
  scope: string[];
  image: CaseImage;
  badge?: Badge;
  link?: { href: string; label: string };
};

type IconItem = { icon: LucideIcon; title: string; line?: string };

const MICHELIN_KEY = { src: "/hospitality/michelin-key.webp", alt: "MICHELIN Key" };
const MICHELIN_GREEN_STAR = { src: "/hospitality/michelin-green-star.svg", alt: "MICHELIN Green Star" };

const PROPERTY_TYPES = [
  "Independent hotel or resort",
  "Hotel within a brand or group",
  "Restaurant or bar inside a hotel",
  "Standalone restaurant or bar",
  "Other",
];
const STAGES_OF_WORK = ["Opening a new property", "Repositioning an existing property", "Adding an outlet or concept", "Other"];
const BUDGETS = ["$50K to $100K", "$100K to $250K", "$250K and up", "Not sure yet"];

const HERO: CaseImage = { alt: "Acre Resort, treehouse at dusk", ratio: "16 / 9" };

// Project locations. Sanity coordinates (atla.design/api/projects, read 2026-10-23) plus the
// hospitality clients that have no project page yet: Casa Las Tortugas, Christophe's, Temakase.
type Place = { name: string; projects: string; lat: number; lng: number; hospitality: boolean };

const PLACES: Place[] = [
  { name: "Los Cabos, Mexico", projects: "Acre Resort, Rústico", lat: 22.8905, lng: -109.9167, hospitality: true },
  { name: "Holbox, Mexico", projects: "Casa Las Tortugas", lat: 21.5236, lng: -87.378, hospitality: true },
  { name: "La Saladita, Mexico", projects: "Mundã", lat: 17.8762, lng: -101.7431, hospitality: true },
  { name: "Querétaro, Mexico", projects: "Huémac", lat: 20.5888, lng: -100.3899, hospitality: true },
  { name: "San Luis Potosí, Mexico", projects: "TigreTigre", lat: 22.1565, lng: -100.9855, hospitality: true },
  { name: "Monterrey, Mexico", projects: "Casa Colora", lat: 25.6866, lng: -100.3161, hospitality: true },
  { name: "Chicago, United States", projects: "Christophe's", lat: 41.8781, lng: -87.6298, hospitality: true },
  { name: "New York, United States", projects: "Temakase", lat: 40.7128, lng: -74.006, hospitality: true },
  { name: "Bali, Indonesia", projects: "The Bridge", lat: -8.6705, lng: 115.2126, hospitality: true },
  { name: "Austin", projects: "", lat: 30.2672, lng: -97.7431, hospitality: false },
  { name: "Dallas", projects: "", lat: 32.7767, lng: -96.797, hospitality: false },
  { name: "Denver", projects: "", lat: 39.7392, lng: -104.9903, hospitality: false },
  { name: "Los Angeles", projects: "", lat: 34.0522, lng: -118.2437, hospitality: false },
  { name: "San Diego", projects: "", lat: 32.7157, lng: -117.1611, hospitality: false },
  { name: "Bellevue", projects: "", lat: 47.6101, lng: -122.2015, hospitality: false },
  { name: "Charlotte", projects: "", lat: 35.2271, lng: -80.8431, hospitality: false },
  { name: "Upstate New York", projects: "", lat: 42.6526, lng: -73.7562, hospitality: false },
  { name: "Toronto", projects: "", lat: 43.6532, lng: -79.3832, hospitality: false },
  { name: "Amsterdam", projects: "", lat: 52.3676, lng: 4.9041, hospitality: false },
  { name: "Abu Dhabi", projects: "", lat: 24.4539, lng: 54.3773, hospitality: false },
  { name: "Dubai", projects: "", lat: 25.2048, lng: 55.2708, hospitality: false },
];

// Logo files are pending; each slot renders as a placeholder with the client's name.
const CLIENT_LOGOS = [
  "Acre Resort",
  "Casa Las Tortugas",
  "Rústico",
  "Christophe's",
  "Temakase",
  "TigreTigre",
  "Casa Colora",
  "Mundã",
  "Huémac",
  "The Bridge",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Do you work with hotels that belong to a brand or group?",
    answer:
      "Yes. For a property inside a group we start from the group's standards and design what makes this hotel its own. For several properties, we run the same audit on each one so the portfolio shares one method.",
  },
  {
    question: "Can we start with the audit alone?",
    answer:
      "You can. The audit stands on its own: you get the brand architecture and a list of what to fix first. If we keep going, it becomes the brief for the brand work.",
  },
  {
    question: "Do you produce or install signage and uniforms?",
    answer:
      "No. We design every piece and prepare production files and specifications for your vendors. We do not fabricate or install, but we direct the process.",
  },
  {
    question: "Will you show our project in your portfolio?",
    answer:
      "Only with your permission. Casa Las Tortugas is an example: we name the client and the method, and the findings stay private.",
  },
  {
    question: "Where are you based?",
    answer:
      "Austin, Texas. Most of our hospitality work is in Mexico and the United States, and we travel to the property for the audit.",
  },
  {
    question: "What happens on the call?",
    answer:
      "You talk with José Pablo for about 25 minutes about the property and what is not working. He tells you what we would do first, which for most properties is the audit.",
  },
];

const SOLVES: IconItem[] = [
  { icon: Images, title: "Stand out on the booking site", line: "Identity, photography and website, designed as one." },
  { icon: Network, title: "One brand across every outlet", line: "Names and marks for each restaurant, bar and spa." },
  { icon: PackageCheck, title: "Files your vendors can use", line: "Production files and a supplier sheet for every item." },
  { icon: BookOpen, title: "Standards your team can run", line: "Operating rules new hires learn from one document." },
];

const CASES: HospitalityCase[] = [
  {
    name: "Acre Resort",
    place: "Los Cabos",
    tagline: "Treehouses, villas, a restaurant and a bar under one brand.",
    scope: ["Audit", "Brand book", "Website", "Rústico"],
    image: { alt: "Acre entrance wall with the wordmark", ratio: "4 / 3" },
    badge: { ...MICHELIN_GREEN_STAR, label: "Its restaurant holds a MICHELIN Green Star" },
    link: { href: "/projects/rustico", label: "See Rústico" },
  },
  {
    name: "Casa Las Tortugas",
    place: "Holbox",
    tagline: "Four restaurants and a spa on one beach.",
    scope: ["Audit", "Brand architecture", "Operating standards"],
    image: { alt: "Casa Las Tortugas, Holbox", ratio: "4 / 3" },
    badge: { ...MICHELIN_KEY, label: "Holds one MICHELIN Key" },
  },
  {
    name: "Christophe's Fine Foods",
    place: "Chicago",
    tagline: "A neighborhood market with a chef behind the counter.",
    scope: ["Identity", "Packaging", "Signage", "Uniforms"],
    image: { alt: "Christophe's Fine Foods awning and monogram sign", ratio: "4 / 3" },
  },
  {
    name: "Temakase",
    place: "New York",
    tagline: "Home of the handroll, with Mako on the window and the bag.",
    scope: ["Identity", "Character", "Storefront"],
    image: { alt: "Temakase storefront with window graphics", ratio: "4 / 3" },
  },
];

const STEPS: IconItem[] = [
  { icon: Search, title: "Audit", line: "We walk the property as a guest and map every outlet." },
  { icon: PenTool, title: "Brand", line: "Identity and every object, ready for production." },
  { icon: Repeat, title: "Stay", line: "A weekly seat after launch for new outlets and rooms." },
];

const DELIVERABLES: IconItem[] = [
  { icon: Network, title: "Brand architecture" },
  { icon: Type, title: "Naming" },
  { icon: Stamp, title: "Identity" },
  { icon: Globe, title: "Website and booking" },
  { icon: Signpost, title: "Signage and wayfinding" },
  { icon: UtensilsCrossed, title: "Menus and F&B" },
  { icon: Shirt, title: "Uniforms" },
  { icon: ClipboardList, title: "Operating standards" },
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

function BookCall({ position, inverted = false }: { position: string; inverted?: boolean }) {
  return (
    <a
      href={BOOK_CALL_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("book_call_click", { page: "hospitality", cta_type: position })}
      style={{
        ...ATLA_PILL,
        background: inverted ? "#fafafa" : INK,
        color: inverted ? INK : "#fafafa",
        border: `1px solid ${inverted ? "#fafafa" : INK}`,
      }}
    >
      Book a call
    </a>
  );
}

function IconCard({ item, large = false }: { item: IconItem; large?: boolean }) {
  const Icon = item.icon;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Icon size={large ? 26 : 22} strokeWidth={1.5} color={INK} aria-hidden="true" />
      <h3 style={{ fontFamily: DISPLAY, fontSize: large ? 24 : 20, fontWeight: 400, lineHeight: "1.2", color: INK, margin: 0 }}>
        {item.title}
      </h3>
      {item.line ? <p style={{ ...bodyStyle, color: MUTED }}>{item.line}</p> : null}
    </div>
  );
}

function CaseCard({ item }: { item: HospitalityCase }) {
  return (
    <article style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Figure image={item.image} />
      <p style={eyebrowStyle}>{item.place}</p>
      <h3 style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 400, lineHeight: "1.1", color: INK, margin: 0 }}>{item.name}</h3>
      <p style={bodyStyle}>{item.tagline}</p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {item.scope.map((tag) => (
          <li key={tag} style={{ ...eyebrowStyle, fontSize: 11, border: `1px solid ${RULE}`, borderRadius: 999, padding: "6px 10px" }}>
            {tag}
          </li>
        ))}
      </ul>
      {item.badge ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={item.badge.src} alt={item.badge.alt} width={28} height={28} loading="lazy" decoding="async" style={{ width: 28, height: 28, objectFit: "contain", mixBlendMode: "multiply" }} />
          <p style={{ ...bodyStyle, fontSize: 13 }}>{item.badge.label}</p>
        </div>
      ) : null}
      {item.link ? (
        <a href={item.link.href} className="atla-link" style={{ ...ctaStyle, minHeight: 32, padding: "4px 0" }}>
          {item.link.label} →
        </a>
      ) : null}
    </article>
  );
}

// Equirectangular frame of world-dots.svg (generated from Natural Earth 110m land): 360 by 132 degrees, 76N to 56S.
const MAP_TOP = 76;
const MAP_HEIGHT = 132;

function ProjectMap() {
  return (
    <div
      role="img"
      aria-label={`Map of the places where Atla has done projects: ${PLACES.map((place) => place.name).join(", ")}`}
      style={{ position: "relative", width: "100%", aspectRatio: `360 / ${MAP_HEIGHT}` }}
    >
      <img src="/hospitality/world-dots.svg" alt="" decoding="async" style={{ display: "block", width: "100%", height: "100%" }} />
      {/* Gray first so the hospitality markers sit on top. */}
      {[...PLACES].sort((x, y) => Number(x.hospitality) - Number(y.hospitality)).map((place) => {
        const size = place.hospitality ? 11 : 7;
        return (
          <span
            key={place.name}
            title={place.projects ? `${place.name} · ${place.projects}` : place.name}
            style={{
              position: "absolute",
              left: `${((place.lng + 180) / 360) * 100}%`,
              top: `${((MAP_TOP - place.lat) / MAP_HEIGHT) * 100}%`,
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderRadius: 999,
              background: place.hospitality ? INK : "#a3a39e",
              boxShadow: place.hospitality ? "0 0 0 3px #fafafa" : "0 0 0 2px #fafafa",
            }}
          />
        );
      })}
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
          <p style={{ ...bodyStyle, fontWeight: 600 }}>Got it. José Pablo will write back with what we would do next.</p>
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
            <Field label="Property, brand or group">
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
  const sectionGap = isMobile ? 20 : 32;

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
          faqItems: FAQ_ITEMS,
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
          <div style={{ width: "100%", maxWidth: 1160, display: "flex", flexDirection: "column", gap: isMobile ? 56 : 96 }}>
            <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 16 : 22 }}>
              <p style={eyebrowStyle}>Hospitality: Restaurants, Wellness, Coffee Shops, Hotels</p>
              <h1
                style={{
                  fontFamily: DISPLAY,
                  fontSize: isMobile ? 40 : 72,
                  fontWeight: 400,
                  lineHeight: "1.04",
                  color: INK,
                  margin: 0,
                  maxWidth: 940,
                }}
              >
                Hotel brands that win the booking and hold up for the stay.
              </h1>
              <p style={{ ...bodyStyle, fontSize: isMobile ? 15 : 17, maxWidth: 560 }}>
                Identity, outlets and standards for hotels and the restaurants inside them.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 18 }}>
                <BookCall position="hero" />
                <a href="#work" className="atla-link" style={{ ...ctaStyle, color: MUTED }}>
                  See the work ↓
                </a>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 12 : 28, paddingTop: 4 }}>
                {[
                  { ...MICHELIN_KEY, label: "MICHELIN Key · Casa Las Tortugas" },
                  { ...MICHELIN_GREEN_STAR, label: "MICHELIN Green Star · Acre Resort" },
                ].map((mark) => (
                  <div key={mark.src} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={mark.src} alt={mark.alt} width={28} height={28} decoding="async" style={{ width: 28, height: 28, objectFit: "contain", mixBlendMode: "multiply" }} />
                    <span style={{ ...bodyStyle, fontSize: 13, fontWeight: 600 }}>{mark.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: isMobile ? 8 : 18 }}>
                <Figure image={HERO} />
              </div>
            </section>

            <section aria-label="Clients" style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: isMobile ? -32 : -64 }}>
              <p style={eyebrowStyle}>Clients</p>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(5, minmax(0, 1fr))",
                  gap: isMobile ? 8 : 12,
                }}
              >
                {CLIENT_LOGOS.map((name) => (
                  <li
                    key={name}
                    style={{
                      ...eyebrowStyle,
                      height: isMobile ? 64 : 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${RULE}`,
                      color: "#9a9a96",
                      textAlign: "center",
                      padding: 8,
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </section>

            <section style={{ display: "flex", flexDirection: "column", gap: sectionGap }}>
              <SectionHead eyebrow="What we solve" title="Four problems hotels bring us" />
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, minmax(0, 1fr))", gap: isMobile ? 24 : 32 }}>
                {SOLVES.map((item) => (
                  <IconCard key={item.title} item={item} large />
                ))}
              </div>
            </section>

            <section id="work" style={{ display: "flex", flexDirection: "column", gap: sectionGap, scrollMarginTop: 80 }}>
              <SectionHead eyebrow="Selected work" title="Hotels first, then the restaurants inside them" />
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", gap: isMobile ? 40 : 48 }}>
                {CASES.map((item) => (
                  <CaseCard key={item.name} item={item} />
                ))}
              </div>
              <div>
                <BookCall position="work" />
              </div>
            </section>

            <section style={{ display: "flex", flexDirection: "column", gap: sectionGap }}>
              <SectionHead eyebrow="How we work" title="Audit, brand, then stay" />
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))", gap: isMobile ? 24 : 32 }}>
                {STEPS.map((item, index) => (
                  <div key={item.title} style={{ borderTop: `2px solid ${INK}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <p style={eyebrowStyle}>{String(index + 1).padStart(2, "0")}</p>
                    <IconCard item={item} large />
                  </div>
                ))}
              </div>
            </section>

            <section style={{ display: "flex", flexDirection: "column", gap: sectionGap }}>
              <SectionHead eyebrow="What you get" title="Everything a guest touches" />
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, minmax(0, 1fr))", gap: isMobile ? 20 : 28 }}>
                {DELIVERABLES.map((item) => (
                  <IconCard key={item.title} item={item} />
                ))}
              </div>
            </section>

            <section style={{ display: "flex", flexDirection: "column", gap: sectionGap }}>
              <SectionHead eyebrow="Where we have worked" title="Nine places with hospitality work" />
              <ProjectMap />
              <p style={{ ...bodyStyle, color: MUTED }}>
                {PLACES.filter((place) => place.hospitality)
                  .map((place) => `${place.name.split(",")[0]} (${place.projects})`)
                  .join(" · ")}
              </p>
            </section>

            <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 16 }}>
              <SectionHead eyebrow="FAQ" title="Before you book" />
              <div>
                {FAQ_ITEMS.map((item) => (
                  <details key={item.question} style={{ borderBottom: `1px solid ${RULE}`, padding: "16px 0" }}>
                    <summary
                      style={{
                        fontFamily: DISPLAY,
                        fontSize: isMobile ? 20 : 22,
                        lineHeight: "1.25",
                        color: INK,
                        cursor: "pointer",
                        // A flex summary drops the native disclosure marker in every engine.
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 16,
                      }}
                    >
                      <span>{item.question}</span>
                      <span aria-hidden="true" style={{ color: MUTED }}>
                        +
                      </span>
                    </summary>
                    <p style={{ ...bodyStyle, maxWidth: 720, paddingTop: 10 }}>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section
              id="inquire"
              style={{
                background: INK,
                color: "#fafafa",
                padding: isMobile ? "36px 20px" : "64px 56px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                alignItems: "flex-start",
                scrollMarginTop: 80,
              }}
            >
              <h2 style={{ fontFamily: DISPLAY, fontSize: isMobile ? 32 : 52, fontWeight: 400, lineHeight: "1.05", margin: 0, maxWidth: 760 }}>
                Tell us about your property.
              </h2>
              <p style={{ ...bodyStyle, color: "#cfcfca", maxWidth: 560 }}>
                A short call with José Pablo Domínguez, founder and creative director.
              </p>
              <BookCall position="closing" inverted />
            </section>

            <details style={{ marginTop: isMobile ? -40 : -72 }}>
              <summary style={{ ...ctaStyle, color: MUTED, cursor: "pointer", listStyle: "none" }}>Prefer to write? Send the details →</summary>
              <div style={{ paddingTop: 20, maxWidth: 760 }}>
                <InquiryForm />
              </div>
            </details>
          </div>
        </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
