import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes.ts";
import { apiErrorHandler, apiLogLine, isPrivateApiPath } from "./apiLog.ts";
import { CSP_HEADER, SECURITY_HEADERS } from "../shared/securityHeaders.ts";

const app = express();
const httpServer = createServer(app);

// The same headers vercel.json sets at the Vercel edge (red team P2-3). The dev server skips the CSP only.
app.disable("x-powered-by");
app.use((_req, res, next) => {
  const dev = process.env.NODE_ENV === "development";
  for (const { key, value } of SECURITY_HEADERS) {
    if (dev && key === CSP_HEADER) continue;
    res.setHeader(key, value);
  }
  next();
});

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  // Visitor free text (search bar, brief) is never captured, so it cannot reach the log.
  if (!isPrivateApiPath(path)) {
    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };
  }

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      console.log(apiLogLine(req.method, path, res.statusCode, duration, capturedJsonResponse));
    }
  });

  next();
});

const ready: Promise<void> = (async () => {
  await registerRoutes(httpServer, app);

  app.use(apiErrorHandler);
})();

export { app, httpServer, ready };
