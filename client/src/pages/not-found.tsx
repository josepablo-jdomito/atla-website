import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { useIsMobile } from "@/hooks/use-mobile";

export default function NotFound() {
  const isMobile = useIsMobile();

  return (
    <div style={{ minHeight: "100svh", width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <section
        style={{
          position: "relative",
          minHeight: isMobile ? "100svh" : 900,
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#222",
        }}
      >
        <img
          src="/figmaAssets/about-hero.jpg"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.88,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(34,34,34,0.08) 0%, rgba(34,34,34,0.18) 45%, rgba(34,34,34,0.82) 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <AtlaNav inverted />
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: isMobile ? "calc(100svh - 40px)" : 850,
            display: "flex",
            alignItems: "flex-end",
            padding: isMobile ? "0 10px 20px" : "0 20px 32px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12, color: "#fafafa" }}>
            <p
              style={{
                fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                fontSize: 10,
                fontWeight: 600,
                lineHeight: "1.2",
                letterSpacing: 0.4,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Page not found
            </p>
            <a
              href="/"
              style={{
                fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
                fontSize: isMobile ? 40 : 64,
                fontWeight: 400,
                lineHeight: "1.1",
                color: "#fafafa",
                textDecoration: "none",
              }}
            >
              Go to home ↘
            </a>
          </div>
        </div>
      </section>

      <AtlaFooter />
    </div>
  );
}
