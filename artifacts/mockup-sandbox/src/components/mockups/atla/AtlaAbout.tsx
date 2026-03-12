const LIBRE_FRANKLIN = "'Libre Franklin', Helvetica, sans-serif";
const ABC_SYNT = "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif";

const NAV_FONT = {
  fontFamily: LIBRE_FRANKLIN,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "110%",
} as const;

const LIST_FONT = {
  fontFamily: LIBRE_FRANKLIN,
  fontSize: 14,
  fontWeight: 400,
  lineHeight: "21px",
  textTransform: "uppercase" as const,
  letterSpacing: 0.28,
};

const SECTION_TITLE = {
  fontFamily: ABC_SYNT,
  fontSize: 140,
  fontWeight: 400,
  lineHeight: "110%",
  fontStyle: "italic" as const,
  color: "#222",
  margin: 0,
};

const team = [
  {
    name: "Luis Pablo Rodriguez",
    role: "Creative Direction",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&fit=crop",
  },
  {
    name: "Pablo Cruz",
    role: "Art Direction",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&fit=crop",
  },
  {
    name: "Lia Medina",
    role: "Visual Design",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&fit=crop",
  },
  {
    name: "Mariana Avila",
    role: "Brand Strategy",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80&fit=crop",
  },
  {
    name: "Tali Sarant",
    role: "Motion Design",
    photo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80&fit=crop",
  },
  {
    name: "Adriana Becerra",
    role: "Account Lead",
    photo: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=400&q=80&fit=crop",
  },
  {
    name: "Abel Bueno Guaranayo",
    role: "Creative Development",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&fit=crop",
  },
];

const services = [
  { name: "Brand Identity", desc: "Wordmarks, logotypes, visual language systems" },
  { name: "Art Direction", desc: "Campaign, photography, editorial direction" },
  { name: "Motion Design", desc: "Film, animation, kinetic identity" },
  { name: "Web Design", desc: "Interaction design, frontend, CMS" },
  { name: "Packaging", desc: "Structural design, print production" },
  { name: "3D Visualization", desc: "Renders, product visualizations, environments" },
];

const clients = [
  { name: "Aurel Studios", sphere: "Fashion" },
  { name: "Lior Atelier", sphere: "Film & Production" },
  { name: "Onera Creative", sphere: "Industrial" },
  { name: "Klyra House", sphere: "Visual Direction" },
  { name: "Veer Studio", sphere: "Architecture" },
  { name: "Lumae Systems", sphere: "Design Engineering" },
  { name: "Aerith Agency", sphere: "Creative Consulting" },
  { name: "Orza Objects", sphere: "3D Visualization" },
];

const honors = [
  { org: "Awwwards", category: "Website of the Day", count: "x2" },
  { org: "Creative Web Awards", category: "Best Visual Identity", count: "x5" },
  { org: "Excellence in Motion", category: "Direction", count: "x1" },
  { org: "CSS Design Awards", category: "Innovation & UX", count: "x3" },
  { org: "FWA Awards", category: "Cutting Edge Design", count: "x1" },
  { org: "Motion Design Awards", category: "Best Experimental Film", count: "x2" },
];

const press = [
  { project: "Solari House", outlet: "Designboom" },
  { project: "Flux Division", outlet: "Motionographer" },
  { project: "Alté Agency", outlet: "Its Nice That" },
  { project: "Onera Visual", outlet: "The Dieline" },
  { project: "Lumae Interiors", outlet: "ArchDaily" },
  { project: "Klyra Launch", outlet: "Brand New" },
];

import { useState, useEffect } from "react";

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

function useContactTimes() {
  const compute = () => {
    const now = new Date();
    const r: Record<string, string> = {};
    OFFICE_TZS.forEach(({ city, tz }) => {
      r[city] = new Intl.DateTimeFormat("en-US", {
        hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true, timeZone: tz,
      }).format(now);
    });
    return r;
  };
  const [times, setTimes] = useState<Record<string, string>>(compute);
  useEffect(() => {
    const id = setInterval(() => setTimes(compute()), 1000);
    return () => clearInterval(id);
  }, []);
  return times;
}

function Nav() {
  return (
    <nav className="flex w-full items-end justify-between px-5" style={{ height: 50 }}>
      <div className="flex items-center gap-3.5 flex-1">
        {["Work", "About", "Services"].map((link) => (
          <a key={link} href="#" className="text-[#222] no-underline" style={NAV_FONT}>
            {link}
          </a>
        ))}
      </div>
      <div className="flex flex-1 justify-center">
        <img
          alt="Atla Logo"
          src="/__mockup/figmaAssets/p-framer-text.svg"
          style={{ height: 28, objectFit: "contain" }}
        />
      </div>
      <div className="flex items-end justify-end gap-3.5 flex-1">
        {["Journal", "Contact"].map((link) => (
          <a key={link} href="#" className="text-[#222] no-underline" style={NAV_FONT}>
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
    <div className="relative w-full" style={{ height: 750, backgroundColor: "#fafafa" }}>
      <div
        className="absolute flex flex-col items-start"
        style={{ right: 20, top: 120, width: 548 }}
      >
        <p
          style={{
            fontFamily: ABC_SYNT,
            fontSize: 64,
            fontWeight: 400,
            lineHeight: "110%",
            color: "#222",
            fontStyle: "italic",
            margin: 0,
          }}
        >
          {`We design brands that go beyond just looking good—it's central to the brand itself.`}
        </p>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex-1">
        <p style={SECTION_TITLE}>About</p>
      </div>
      <div className="flex flex-col gap-8" style={{ width: 615 }}>
        <p
          style={{
            ...NAV_FONT,
            lineHeight: "110%",
            color: "#222",
          }}
        >
          At Atla, we believe design is more than aesthetics — it&apos;s the bridge between a
          brand&apos;s core values and its audience. Founded in 2019, we&apos;ve worked with
          companies across industries to build visual identities that communicate with clarity
          and purpose. Every project starts with a deep understanding of the brand and ends
          with a design system built to scale.
        </p>
        <p
          style={{
            ...NAV_FONT,
            lineHeight: "110%",
            color: "#222",
          }}
        >
          We operate across the US and LATAM, partnering with founders, creative directors,
          and brand teams who understand that design is a strategic asset. Our studio is small
          by design — focused, deliberate, and deeply committed to craft.
        </p>
      </div>
    </div>
  );
}

function TeamSection() {
  const rows = [
    team.slice(0, 2),
    team.slice(2, 4),
    team.slice(4, 7),
  ];

  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex-1">
        <p style={SECTION_TITLE}>Team</p>
      </div>
      <div className="flex flex-col gap-10" style={{ width: 615 }}>
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-5">
            {row.map((member) => (
              <div key={member.name} className="flex flex-col gap-3 flex-1">
                <div
                  style={{
                    aspectRatio: "290/370",
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  <img
                    src={member.photo}
                    alt={member.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: LIBRE_FRANKLIN,
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: "110%",
                      letterSpacing: 0.28,
                      color: "#222",
                      margin: 0,
                    }}
                  >
                    {member.name}
                  </p>
                  <p
                    style={{
                      fontFamily: LIBRE_FRANKLIN,
                      fontSize: 12,
                      fontWeight: 400,
                      lineHeight: "120%",
                      letterSpacing: 0.48,
                      color: "#8e8e8e",
                      textTransform: "uppercase",
                      margin: 0,
                      marginTop: 4,
                    }}
                  >
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesSection() {
  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex-1">
        <p style={SECTION_TITLE}>Services</p>
      </div>
      <div className="flex flex-col" style={{ width: 615, gap: 0 }}>
        {services.map((s) => (
          <div
            key={s.name}
            style={{
              borderTop: "1px solid #e0e0e0",
              paddingTop: 12,
              paddingBottom: 12,
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ ...LIST_FONT, color: "#222", margin: 0 }}>{s.name}</p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ ...LIST_FONT, color: "#8e8e8e", margin: 0 }}>{s.desc}</p>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #e0e0e0" }} />
      </div>
    </div>
  );
}

function ClientsSection() {
  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex-1">
        <p style={SECTION_TITLE}>Clients</p>
      </div>
      <div className="flex flex-col" style={{ width: 615, gap: 4 }}>
        {clients.map((c) => (
          <div key={c.name} className="flex items-start w-full">
            <div className="flex-1">
              <p style={{ ...LIST_FONT, color: "#222", margin: 0 }}>{c.name}</p>
            </div>
            <div className="flex-1">
              <p style={{ ...LIST_FONT, color: "#8e8e8e", margin: 0 }}>{c.sphere}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HonorsSection() {
  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex-1">
        <p style={{ ...SECTION_TITLE, whiteSpace: "nowrap" }}>Honors</p>
      </div>
      <div className="flex flex-col" style={{ width: 615, gap: 4 }}>
        {honors.map((h) => (
          <div key={h.org + h.category} className="flex items-start w-full">
            <div style={{ width: 285 }}>
              <p style={{ ...LIST_FONT, color: "#222", margin: 0 }}>{h.org}</p>
            </div>
            <div style={{ width: 190 }}>
              <p style={{ ...LIST_FONT, color: "#222", margin: 0 }}>{h.category}</p>
            </div>
            <div style={{ width: 95, textAlign: "right" }}>
              <p style={{ ...LIST_FONT, color: "#222", margin: 0 }}>{h.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PressSection() {
  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex-1">
        <p style={{ ...SECTION_TITLE, whiteSpace: "nowrap" }}>Press</p>
      </div>
      <div className="flex flex-col" style={{ width: 615, gap: 6 }}>
        {press.map((p) => (
          <div key={p.project} className="flex gap-5 items-start w-full">
            <div className="flex-1">
              <p style={{ ...LIST_FONT, color: "#222", margin: 0 }}>{p.project}</p>
            </div>
            <div className="flex-1">
              <p style={{ ...LIST_FONT, color: "#222", opacity: 0.6, margin: 0 }}>{p.outlet}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactSection() {
  const times = useContactTimes();
  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex-1">
        <p style={{ ...SECTION_TITLE, whiteSpace: "nowrap" }}>Contact</p>
      </div>
      {/* Figma: Addresses — city name 32px Libre Franklin Regular + live full clock */}
      <div
        style={{
          width: 615,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {OFFICE_TZS.map(({ city }) => (
          <div
            key={city}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: 10,
            }}
          >
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: LIBRE_FRANKLIN,
                  fontSize: 32,
                  fontWeight: 400,
                  lineHeight: "110%",
                  color: "#222",
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
                {city}
              </p>
            </div>
            <div
              style={{
                fontFamily: LIBRE_FRANKLIN,
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: 0.28,
                lineHeight: "110%",
                color: "#222",
                whiteSpace: "nowrap",
              }}
            >
              {times[city] ?? "--:--:-- --"}
            </div>
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
      className="w-full flex flex-col items-start justify-end"
      style={{ backgroundColor: "#ffc629", minHeight: 750, width: 1200 }}
    >
      <div className="flex flex-col gap-12 items-start p-5 w-full">
        <div className="flex items-start justify-between w-full">
          <div className="flex-1 flex flex-col" style={{ gap: 240 }}>
            <div
              className="flex items-start w-full"
              style={{
                ...NAV_FONT,
                color: "#222",
                gap: 72,
              }}
            >
              <div className="flex flex-col gap-6">
                <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>Atla</p>
                <div className="flex flex-col gap-3">
                  {footerNav.map((item) => (
                    <p key={item} style={{ fontSize: 14, lineHeight: "110%", fontWeight: 500, margin: 0 }}>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>Socials</p>
                <div className="flex flex-col gap-3">
                  {footerSocials.map((item) => (
                    <p key={item} style={{ fontSize: 14, lineHeight: "110%", fontWeight: 500, margin: 0 }}>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-6" style={{ width: 140 }}>
                <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>Offices</p>
                <div className="flex flex-col gap-3 w-full">
                  {OFFICE_TZS.map(({ city }) => (
                    <div key={city} className="flex items-start justify-between w-full">
                      <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>
                        {city}
                      </p>
                      <p style={{ fontSize: 14, lineHeight: "110%", fontWeight: 500, margin: 0 }}>
                        {times[city] ?? "--:--"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ width: 320 }}>
              <p style={{ ...NAV_FONT, color: "#222", lineHeight: "110%", margin: 0 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
                libero et velit interdum, ac aliquet odio mattis. Class aptent taciti
                sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
            </div>
          </div>
          <div className="flex items-start justify-end self-stretch">
            <img
              alt="Atla Symbol"
              src="/__mockup/figmaAssets/atla-symbol.png"
              style={{ height: "100%", width: "auto", objectFit: "contain" }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 items-end justify-end w-full">
          <div className="w-full relative" style={{ height: 0 }}>
            <img alt="" src="/__mockup/figmaAssets/line-divider.png" className="block w-full" style={{ position: "absolute", top: -1, left: 0, width: "100%", height: "auto" }} />
          </div>
          <div
            className="flex items-center justify-between w-full"
            style={{
              fontFamily: LIBRE_FRANKLIN,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.48,
              lineHeight: "120%",
              color: "#222",
              textTransform: "uppercase",
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

export function AtlaAbout() {
  return (
    <div
      style={{ fontFamily: LIBRE_FRANKLIN }}
      className="flex flex-col items-start w-full bg-[#fafafa]"
    >
      <div className="flex flex-col items-center" style={{ width: 1200 }}>
        <div className="flex flex-col items-end overflow-hidden w-full">
          <Nav />
          <HeroSection />
          <div
            className="flex flex-col items-start justify-center w-full"
            style={{ paddingTop: 120, paddingBottom: 240, paddingLeft: 20, paddingRight: 20, gap: 240 }}
          >
            <AboutSection />
            <TeamSection />
            <ServicesSection />
            <ClientsSection />
            <HonorsSection />
            <PressSection />
            <ContactSection />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
