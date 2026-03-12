import { useState, useEffect } from "react";

const LIBRE = "'Libre Franklin', Helvetica, sans-serif";
const ABC_SYNT = "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif";

const NAV_FONT = {
  fontFamily: LIBRE,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  color: "#222",
} as const;

const LABEL_FONT = {
  fontFamily: LIBRE,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.48,
  lineHeight: "120%",
  textTransform: "uppercase" as const,
  color: "#222",
};

const BODY_FONT = {
  fontFamily: LIBRE,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "110%",
  color: "#222",
};

const footerNav = ["Work", "About", "Services", "Careers", "Journal", "Contact"];
const footerSocials = ["Instagram", "Behance", "Linkedin", "Facebook"];
const OFFICE_TZS = [
  { city: "Austin, US", tz: "America/Chicago" },
  { city: "CDMX, MX", tz: "America/Mexico_City" },
  { city: "Caracas, VZ", tz: "America/Caracas" },
  { city: "Lima, PE", tz: "America/Lima" },
  { city: "Tijuana, MX", tz: "America/Tijuana" },
];
function useOfficeTimes() {
  const compute = () => {
    const now = new Date();
    const r: Record<string, string> = {};
    OFFICE_TZS.forEach(({ city, tz }) => {
      r[city] = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(now);
    });
    return r;
  };
  const [times, setTimes] = useState<Record<string, string>>(compute);
  useEffect(() => {
    const id = setInterval(() => setTimes(compute()), 10000);
    return () => clearInterval(id);
  }, []);
  return times;
}

const relatedProjects = [
  { name: "Obsidian", date: "Jan 2025" },
  { name: "Terran Collective", date: "Dec 2024" },
  { name: "Halo Visual", date: "Nov 2024" },
  { name: "Flux Division", date: "Apr 2024" },
  { name: "Neutra Lab", date: "Mar 2024" },
  { name: "Karo", date: "Feb 2024" },
  { name: "Solari House", date: "Jan 2024" },
];

const credits = [
  { role: "Creative Direction", name: "Ana Villanueva" },
  { role: "Brand Strategy", name: "Marco Reyes" },
  { role: "Visual Design", name: "Sofia Matei" },
  { role: "Motion", name: "Luis Cabrera" },
  { role: "Photography", name: "Lior Ben Artzi" },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
  "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80",
  "https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=1200&q=80",
];

function Nav() {
  return (
    <nav
      className="flex w-full items-end justify-between px-5"
      style={{ height: 50, position: "absolute", top: 0, left: 0, zIndex: 10 }}
    >
      <div className="flex items-center gap-3.5 flex-1">
        {["Work", "About", "Services"].map((link) => (
          <a key={link} href="#" className="no-underline" style={NAV_FONT}>
            {link}
          </a>
        ))}
      </div>
      <div className="flex flex-1 justify-center">
        <img
          alt="Atla Logo"
          src="/__mockup/figmaAssets/p-framer-text.svg"
          className="h-7 object-contain"
        />
      </div>
      <div className="flex items-end justify-end gap-3.5 flex-1">
        {["Journal", "Contact"].map((link) => (
          <a key={link} href="#" className="no-underline" style={NAV_FONT}>
            {link}
          </a>
        ))}
        {/* Light/dark toggle icons */}
        <div style={{ display: "flex", alignItems: "center", height: 20, flexShrink: 0 }}>
          <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
            <img alt="Light mode" src="/__mockup/figmaAssets/toggle-sun.png"
              style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
            <img alt="Dark mode" src="/__mockup/figmaAssets/toggle-moon.png"
              style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        height: 750,
        width: 1200,
        overflow: "hidden",
      }}
    >
      {/* Left: cover image fills full width, right panel overlays */}
      <img
        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80"
        alt="Solari House cover"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />

      {/* Right info panel: white bg covers right 55% */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: 660,
          backgroundColor: "#fafafa",
        }}
      />

      {/* Content inside the right panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: 634,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingBottom: 23,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 140,
            alignItems: "flex-start",
            width: 580,
          }}
        >
          {/* Project Title */}
          <div>
            <p
              style={{
                fontFamily: ABC_SYNT,
                fontSize: 82,
                fontWeight: 400,
                lineHeight: "110%",
                color: "#222",
                fontStyle: "normal",
                margin: 0,
              }}
            >
              Solari House
            </p>
          </div>

          {/* Meta info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 95, width: "100%" }}>
            {/* Client + Service row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              {/* Client */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 286.5 }}>
                <p style={{ ...LABEL_FONT, color: "#8e8e8e", margin: 0 }}>( Clients )</p>
                <p style={{ ...BODY_FONT, margin: 0 }}>Solari House</p>
              </div>
              {/* Service */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 286.5 }}>
                <p style={{ ...LABEL_FONT, color: "#8e8e8e", margin: 0 }}>( Service )</p>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Brand Identity", "Print"].map((tag) => (
                    <p key={tag} style={{ ...BODY_FONT, margin: 0 }}>{tag}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Description + Location/Date */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", width: "100%" }}>
              {/* Intro */}
              <div style={{ width: 229 }}>
                <p style={{ ...BODY_FONT, lineHeight: "110%", margin: 0 }}>
                  A refined visual identity for a contemporary furniture and interiors brand rooted in Italian craftsmanship.
                </p>
              </div>
              {/* Location + Date */}
              <div style={{ display: "flex", gap: 10, width: 286.5 }}>
                <div style={{ width: 120 }}>
                  <p style={{ ...BODY_FONT, margin: 0 }}>Italy</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ ...BODY_FONT, margin: 0 }}>Feb 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        paddingLeft: 60,
        width: "100%",
      }}
    >
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=1200&q=80"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />

      {/* White content panel */}
      <div
        style={{
          position: "relative",
          backgroundColor: "#fafafa",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: 1080,
          paddingTop: 40,
          paddingBottom: 200,
          paddingLeft: 20,
          paddingRight: 20,
          marginLeft: 20,
        }}
      >
        {/* Left: text sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 36, width: 553 }}>
          {[
            {
              label: "The Brand",
              body: "Solari House came to Atla seeking a brand that embodied the quiet luxury of Italian-made furniture. The brief was clear: restrained, rigorous, and warm — never cold. We developed a wordmark drawn from classic proportions, paired with a neutral palette of warm stone and deep forest green.",
            },
            {
              label: "The Challenge",
              body: "The main challenge was to translate the richness of Italian craftsmanship into a visual language that could live across physical and digital touchpoints without losing its sense of tactile quality. Packaging, hang tags, and tissue paper had to feel as refined as the furniture itself. A second challenge was ensuring the identity worked in both Italian and international markets.",
            },
            {
              label: "The Result",
              body: "We delivered a comprehensive brand system spanning wordmark, sub-brand rules, packaging, and a detailed brand guidelines document. The color system combines warm stone, off-white, and deep forest green — a palette that photographs beautifully and reads as premium across every material. The result is an identity that feels timeless without feeling frozen.",
            },
          ].map(({ label, body }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ paddingBottom: 20 }}>
                <p style={{ ...LABEL_FONT, margin: 0 }}>( {label} )</p>
              </div>
              <p style={{ ...BODY_FONT, lineHeight: "110%", margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>

        {/* Right: credits */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 358 }}>
          <div style={{ paddingBottom: 20 }}>
            <p style={{ ...LABEL_FONT, margin: 0 }}>( Credits )</p>
          </div>
          {credits.map((c) => (
            <div key={c.role} style={{ display: "flex", gap: 48, width: "100%" }}>
              <p style={{ ...BODY_FONT, color: "#8e8e8e", width: 127.5, margin: 0 }}>{c.role}</p>
              <p style={{ ...BODY_FONT, flex: 1, margin: 0 }}>{c.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GallerySection() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
      {galleryImages.map((src, i) => (
        <div key={i} style={{ width: "100%", overflow: "hidden" }}>
          <img
            src={src}
            alt=""
            style={{ width: "100%", display: "block", objectFit: "cover" }}
          />
        </div>
      ))}
    </div>
  );
}

function RelatedSection() {
  return (
    <div
      style={{
        width: "100%",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 20,
          borderBottom: "1px solid #e8e8e8",
          marginBottom: 0,
        }}
      >
        <p style={{ ...LABEL_FONT, margin: 0 }}>( More Work )</p>
      </div>
      {/* Project rows */}
      <div
        style={{
          fontFamily: LIBRE,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: 0.28,
          lineHeight: "110%",
          color: "#222",
        }}
      >
        {relatedProjects.map((p) => (
          <div
            key={p.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              overflow: "hidden",
              paddingTop: 12,
              paddingBottom: 12,
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <p style={{ margin: 0 }}>{p.name}</p>
            <p style={{ margin: 0, color: "#8e8e8e" }}>{p.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  const times = useOfficeTimes();
  return (
    <div
      style={{
        backgroundColor: "#ffc629",
        width: "100%",
        height: 750,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 48,
          alignItems: "flex-start",
          padding: 20,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              gap: 240,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 72,
                alignItems: "flex-start",
                fontFamily: LIBRE,
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: 0.28,
                color: "#222",
                width: "100%",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>Atla</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {footerNav.map((item) => (
                    <p key={item} style={{ fontSize: 14, lineHeight: "110%", margin: 0 }}>{item}</p>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>Socials</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {footerSocials.map((item) => (
                    <p key={item} style={{ fontSize: 14, lineHeight: "110%", margin: 0 }}>{item}</p>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 140 }}>
                <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>Offices</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
                  {OFFICE_TZS.map(({ city }) => (
                    <div key={city} style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>{city}</p>
                      <p style={{ fontSize: 14, lineHeight: "110%", margin: 0 }}>{times[city] ?? "--:--"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ width: 320 }}>
              <p style={{ ...NAV_FONT, lineHeight: "110%", margin: 0 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
                libero et velit interdum, ac aliquet odio mattis. Class aptent taciti
                sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", alignSelf: "stretch" }}>
            <img
              alt="Atla Symbol"
              src="/__mockup/figmaAssets/atla-symbol.png"
              style={{ height: "100%", width: "auto", objectFit: "contain" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end", width: "100%" }}>
          <div style={{ width: "100%", position: "relative", height: 0 }}>
            <img
              alt=""
              src="/__mockup/figmaAssets/line-divider.png"
              style={{ position: "absolute", top: -1, left: 0, width: "100%", height: "auto", display: "block" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              ...LABEL_FONT,
            }}
          >
            <p style={{ margin: 0 }}>Back to top ↑</p>
            <p style={{ margin: 0 }}>2026 Atla® All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AtlaProject() {
  return (
    <div
      style={{ fontFamily: LIBRE, backgroundColor: "#fafafa" }}
      className="flex flex-col items-start w-full"
    >
      <div className="relative flex flex-col items-start" style={{ width: 1200 }}>
        <Nav />
        <HeroSection />
        <AboutSection />
        <GallerySection />
        <RelatedSection />
      </div>
      <Footer />
    </div>
  );
}
