import { app, httpServer, ready } from "./app.ts";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

(async () => {
  await ready;

  if (process.env.NODE_ENV === "production") {
    const { serveStatic } = await import("./static.ts");
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite.ts");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
    log(`serving on port ${port}`);
  });
})();
