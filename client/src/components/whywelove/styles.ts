import type { CSSProperties } from "react";

export const SANS = "'Libre Franklin', Helvetica, sans-serif";
export const DISPLAY = "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif";
export const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

export const INK = "#141414";
export const MUTED = "#6f6f6f";
export const LINE = "rgba(20,20,20,0.12)";
export const SURFACE = "#ffffff";

export const eyebrow: CSSProperties = {
  fontFamily: SANS,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.48,
  lineHeight: 1.2,
  textTransform: "uppercase",
  color: MUTED,
  margin: 0,
};

export const sectionTitle: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 400,
  letterSpacing: -0.4,
  lineHeight: 1.1,
  color: INK,
  margin: 0,
};

export const body: CSSProperties = {
  fontFamily: SANS,
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.6,
  color: "#333",
  margin: 0,
};

export const card: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${LINE}`,
  borderRadius: 14,
  padding: 20,
  boxSizing: "border-box",
};
