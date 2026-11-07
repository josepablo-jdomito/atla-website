import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Client components use the automatic JSX runtime (no `import React`), as in vite.config.
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client/src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  test: {
    include: [
      "server/**/*.test.ts",
      "shared/**/*.test.ts",
      "client/src/**/*.test.ts",
    ],
    environment: "node",
    passWithNoTests: true,
  },
});
