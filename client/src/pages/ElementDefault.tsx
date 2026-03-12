import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import type { Project } from "@shared/schema";

const SLOT_SIZES = [
  { w: 225, h: 337.5 },
  { w: 225, h: 337.5 },
  { w: 300, h: 450 },
  { w: 225, h: 337.5 },
  { w: 225, h: 337.5 },
];

const FALLBACK_IMAGES = [
  "/figmaAssets/media.png",
  "/figmaAssets/media-1.png",
  "/figmaAssets/media-2.png",
  "/figmaAssets/media-3.png",
  "/figmaAssets/media-4.png",
];

const ADVANCE_MS = 4000;

function useSlideshow(count: number) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => {
      setOffset((prev) => (prev + 1) % count);
    }, ADVANCE_MS);
    return () => clearInterval(id);
  }, [count]);

  const getIndex = useCallback(
    (slot: number) => (count > 0 ? (offset + slot) % count : slot),
    [offset, count],
  );

  return { getIndex };
}

export const ElementDefault = (): JSX.Element => {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const hasProjects = !!projects && projects.length > 0;
  const { getIndex } = useSlideshow(hasProjects ? projects.length : 0);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#fafafa" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 1200,
          height: 750,
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          backgroundColor: "#fafafa",
          overflow: "hidden",
        }}
      >
        <AtlaNav />

        <section
          data-testid="gallery-section"
          style={{
            display: "flex",
            gap: 100,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {isLoading
            ? SLOT_SIZES.map((slot, i) => (
                <div
                  key={i}
                  data-testid={`skeleton-gallery-${i}`}
                  style={{
                    width: slot.w,
                    height: slot.h,
                    flexShrink: 0,
                    backgroundColor: "#e5e5e5",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
              ))
            : SLOT_SIZES.map((slot, i) => {
            const isCenter = i === 2;
            const project = hasProjects ? projects[getIndex(i)] : null;
            const src = project?.coverImage || FALLBACK_IMAGES[i];
            const alt = project?.title || "Atla project";
            const slug = project?.slug;

            const card = (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  flexShrink: 0,
                }}
                data-testid={`card-gallery-${i}`}
              >
                <div style={{ position: "relative", width: slot.w, height: slot.h, flexShrink: 0 }}>
                  <img
                    src={src}
                    alt={alt}
                    width={slot.w}
                    height={slot.h}
                    loading={isCenter ? "eager" : "lazy"}
                    fetchPriority={isCenter ? "high" : undefined}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      pointerEvents: "none",
                    }}
                    data-testid={`img-gallery-${i}`}
                  />
                  {isCenter && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 375,
                        height: 140,
                        mixBlendMode: "difference",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
                          fontSize: 64,
                          fontWeight: 400,
                          lineHeight: "1.1",
                          letterSpacing: 0,
                          color: "#fafafa",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {project?.title || "Project Name"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );

            if (slug) {
              return (
                <a
                  key={i}
                  href={`/projects/${slug}`}
                  style={{ textDecoration: "none", flexShrink: 0 }}
                  data-testid={`link-gallery-${i}`}
                >
                  {card}
                </a>
              );
            }
            return card;
          })}
        </section>

        <div
          data-testid="home-footer-strip"
          style={{
            display: "flex",
            height: 50,
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 10,
            padding: "0 20px",
            width: "100%",
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        >
          <div style={{ flex: "1 0 0", display: "flex", alignItems: "center" }}>
            <p
              style={{
                fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.48,
                lineHeight: "1.2",
                color: "#222",
                textTransform: "uppercase",
                margin: 0,
                whiteSpace: "pre-line",
              }}
            >
              {"Working around \nthe Us & Latam"}
            </p>
          </div>
          <div style={{ flex: "1 0 0", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <p
              style={{
                fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.48,
                lineHeight: "1.2",
                color: "#222",
                textTransform: "uppercase",
                textAlign: "right",
                margin: 0,
                whiteSpace: "pre-line",
              }}
            >
              {"design with\nintention"}
            </p>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 1200 }}>
        <AtlaFooter />
      </div>
    </div>
  );
};
