import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // The same Cache-Control vercel.json sets at the edge: hashed build assets for a year, the unhashed
  // fonts, Figma assets and logos for 30 days, everything else (the HTML) revalidated.
  app.use(
    express.static(distPath, {
      setHeaders(res, filePath) {
        const rel = path.relative(distPath, filePath).split(path.sep).join("/");
        if (rel.startsWith("assets/")) res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        else if (/^(fonts|figmaAssets|logos-v2)\//.test(rel)) res.setHeader("Cache-Control", "public, max-age=2592000");
      },
    }),
  );

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
