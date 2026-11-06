import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: [
      // The browser takes Ask's zod-free half only (shared/askCommon.ts); the zod schemas in shared/ask.ts
      // are the server's. Without this the home shipped zod (12 KB gzip) for three constants (fix pass A).
      { find: /^@shared\/ask$/, replacement: path.resolve(import.meta.dirname, "shared", "askCommon.ts") },
      { find: "@", replacement: path.resolve(import.meta.dirname, "client", "src") },
      { find: "@shared", replacement: path.resolve(import.meta.dirname, "shared") },
      { find: "@assets", replacement: path.resolve(import.meta.dirname, "attached_assets") },
    ],
  },
  root: path.resolve(import.meta.dirname, "client"),
  // Pre-bundled up front: discovered mid-session, it triggers a re-optimization whose mixed chunks
  // load two React copies ("Invalid hook call" in AnimatePresence).
  optimizeDeps: {
    include: ["framer-motion"],
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // dist/public/.vite/manifest.json: script/build.ts reads it to add <link rel="modulepreload"> for each
    // prerendered route's page chunk and its imports, so they download beside the entry, not after it.
    manifest: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
