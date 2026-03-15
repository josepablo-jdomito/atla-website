import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { buildImageSrcSet, getOptimizedImageUrl } from "@shared/imageDelivery";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Project } from "@shared/schema";

const FALLBACK_IMAGES = [
  "/figmaAssets/media.png",
  "/figmaAssets/media-1.png",
  "/figmaAssets/media-2.png",
  "/figmaAssets/media-3.png",
  "/figmaAssets/media-4.png",
];

const ADVANCE_MS = 3600;

type SlotFrame = {
  left: string;
  top: string;
  width: number;
  height: number;
  rotate: number;
  opacity: number;
  zIndex: number;
  scale: number;
};

const DESKTOP_SLOTS: SlotFrame[] = [
  { left: "8%", top: "54%", width: 212, height: 318, rotate: -7, opacity: 0.78, zIndex: 1, scale: 0.94 },
  { left: "25%", top: "45%", width: 236, height: 354, rotate: -2.5, opacity: 0.92, zIndex: 2, scale: 0.98 },
  { left: "50%", top: "52%", width: 340, height: 510, rotate: 0, opacity: 1, zIndex: 4, scale: 1 },
  { left: "75%", top: "45%", width: 236, height: 354, rotate: 2.5, opacity: 0.92, zIndex: 2, scale: 0.98 },
  { left: "92%", top: "54%", width: 212, height: 318, rotate: 7, opacity: 0.78, zIndex: 1, scale: 0.94 },
];

const MOBILE_SLOTS: SlotFrame[] = [
  { left: "4%", top: "56%", width: 78, height: 118, rotate: -7, opacity: 0.56, zIndex: 1, scale: 0.9 },
  { left: "22%", top: "44%", width: 112, height: 168, rotate: -3, opacity: 0.82, zIndex: 2, scale: 0.97 },
  { left: "50%", top: "52%", width: 274, height: 410, rotate: 0, opacity: 1, zIndex: 4, scale: 1 },
  { left: "78%", top: "44%", width: 112, height: 168, rotate: 3, opacity: 0.82, zIndex: 2, scale: 0.97 },
  { left: "96%", top: "56%", width: 78, height: 118, rotate: 7, opacity: 0.56, zIndex: 1, scale: 0.9 },
];

function useSlideshow(count: number) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (count < 2) return;
    const id = window.setInterval(() => {
      setOffset((prev) => (prev + 1) % count);
    }, ADVANCE_MS);

    return () => window.clearInterval(id);
  }, [count]);

  return offset;
}

function getVisibleProjects(projects: Project[] | undefined, offset: number, slots: number) {
  if (!projects?.length) return [];
  return Array.from({ length: slots }, (_, slot) => projects[(offset + slot) % projects.length]);
}

export const ElementDefault = (): JSX.Element => {
  const isMobile = useIsMobile();
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const slotFrames = isMobile ? MOBILE_SLOTS : DESKTOP_SLOTS;
  const offset = useSlideshow(projects?.length ?? 0);
  const visibleProjects = useMemo(
    () => getVisibleProjects(projects, offset, slotFrames.length),
    [offset, projects, slotFrames.length],
  );
  const centerProject = visibleProjects[2] ?? null;
  const stageHeight = isMobile ? "calc(100svh - 132px)" : "calc(100svh - 158px)";

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <div
        className="atla-dark-surface"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: "100svh",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          backgroundColor: "#fafafa",
          overflow: "hidden",
        }}
      >
        <AtlaNav />

        <main
          style={{
            width: "100%",
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <section
            data-testid="gallery-section"
            className="atla-enter"
            style={{
              width: "100%",
              position: "relative",
              flex: "1 1 auto",
              flexShrink: 0,
              padding: isMobile ? "8px 0 0" : "18px 0 0",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <div
              className="atla-home-stage"
              style={{
                width: "100%",
                height: stageHeight,
                minHeight: isMobile ? 520 : 620,
              }}
            >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                zIndex: 5,
                padding: isMobile ? "0 20px" : "0 32px",
              }}
            >
              <span
                key={centerProject?.slug ?? "fallback-title"}
                className="atla-home-title"
                style={{
                  fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
                  fontSize: isMobile ? 42 : 68,
                  fontWeight: 400,
                  lineHeight: "1.02",
                  letterSpacing: 0,
                  color: "#fafafa",
                  mixBlendMode: "difference",
                  textAlign: "center",
                  maxWidth: isMobile ? 280 : 420,
                  textWrap: "balance",
                  marginTop: isMobile ? 32 : 10,
                }}
              >
                {centerProject?.title || "Project Name"}
              </span>
            </div>

            {isLoading
              ? slotFrames.map((slot, index) => (
                  <div
                    key={`skeleton-${index}`}
                    data-testid={`skeleton-gallery-${index}`}
                    style={{
                      position: "absolute",
                      left: slot.left,
                      top: slot.top,
                      width: slot.width,
                      height: slot.height,
                      borderRadius: 0,
                      backgroundColor: "#e5e5e5",
                      opacity: slot.opacity,
                      transform: `translate(-50%, -50%) rotate(${slot.rotate}deg) scale(${slot.scale})`,
                      animation: "pulse 2s ease-in-out infinite",
                    }}
                  />
                ))
              : slotFrames.map((slot, index) => {
                  const project = visibleProjects[index];
                  const src = project?.coverImage || FALLBACK_IMAGES[index];
                  const optimizedSrc =
                    getOptimizedImageUrl(src, {
                      width: slot.width * 2,
                      quality: index === 2 ? 84 : 78,
                    }) || src;
                  const srcSet = buildImageSrcSet(
                    src,
                    [slot.width, slot.width * 1.5, slot.width * 2],
                    { quality: index === 2 ? 84 : 78 },
                  );
                  const alt = project?.title || "Atla project";
                  const slug = project?.slug;
                  const isCenter = index === 2;
                  const shellStyle = {
                    position: "absolute" as const,
                    left: slot.left,
                    top: slot.top,
                    width: slot.width,
                    height: slot.height,
                    opacity: slot.opacity,
                    zIndex: slot.zIndex,
                    transform: `translate(-50%, -50%) rotate(${slot.rotate}deg) scale(${slot.scale})`,
                  };

                  const card = (
                    <div
                      className="atla-home-card"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                      data-testid={`card-gallery-${index}`}
                    >
                      <img
                        src={optimizedSrc}
                        srcSet={srcSet}
                        sizes={`${Math.round(slot.width)}px`}
                        alt={alt}
                        width={slot.width}
                        height={slot.height}
                        className="atla-home-card-image"
                        loading={isCenter ? "eager" : "lazy"}
                        fetchPriority={isCenter ? "high" : undefined}
                        decoding="async"
                        data-testid={`img-gallery-${index}`}
                      />
                    </div>
                  );

                  if (!slug) {
                    return (
                      <div
                        key={`fallback-${index}`}
                        className={`atla-home-card-shell ${isCenter ? "atla-home-card-shell-center" : ""}`}
                        style={shellStyle}
                      >
                        {card}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={slug}
                      href={`/projects/${slug}`}
                      className={`atla-home-card-link atla-home-card-shell ${isCenter ? "atla-home-card-shell-center" : ""}`}
                      style={shellStyle}
                      data-testid={`link-gallery-${index}`}
                    >
                      {card}
                    </a>
                  );
                })}
          </div>
          </section>

          <div
            data-testid="home-footer-strip"
            style={{
              display: "flex",
              height: isMobile ? 40 : 50,
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 10,
              padding: isMobile ? "0 10px" : "0 20px",
              width: "100%",
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          >
            <div style={{ flex: "1 0 0", display: "flex", alignItems: "center" }}>
              <p
                style={{
                  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                  fontSize: isMobile ? 12 : 12,
                  fontWeight: 600,
                  letterSpacing: isMobile ? 0.4 : 0.48,
                  lineHeight: "1.2",
                  color: "#222",
                  textTransform: "uppercase",
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {"Across the US &\nLatin America"}
              </p>
            </div>
            <div style={{ flex: "1 0 0", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <p
                style={{
                  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                  fontSize: isMobile ? 12 : 12,
                  fontWeight: 600,
                  letterSpacing: isMobile ? 0.4 : 0.48,
                  lineHeight: "1.2",
                  color: "#222",
                  textTransform: "uppercase",
                  textAlign: "right",
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {"Design with\nintention"}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
