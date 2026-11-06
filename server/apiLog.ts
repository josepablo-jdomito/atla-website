import type { NextFunction, Request, Response } from "express";

/**
 * The /api request log line. Paths that carry visitor free text or contact
 * details (the search bar, the brief, the brand check, the contact form) are logged without
 * bodies: method, path, status and duration only. Matching ignores case,
 * because Express routing does too (/api/BRIEF reaches the brief handler).
 */

const PRIVATE_PATHS = [/^\/api\/brief(\/|$)/i, /^\/api\/brand-check(\/|$)/i, /^\/api\/contact(\/|$)/i];

export const isPrivateApiPath = (path: string) => PRIVATE_PATHS.some((pattern) => pattern.test(path));

export function apiLogLine(method: string, path: string, status: number, durationMs: number, responseBody?: unknown): string {
  const line = `${method} ${path} ${status} in ${durationMs}ms`;
  if (responseBody === undefined || isPrivateApiPath(path)) return line;
  return `${line} :: ${JSON.stringify(responseBody)}`;
}

/**
 * The error handler's log line: method, path, status and the error's short name
 * (body-parser's `type`, e.g. "entity.parse.failed", or the class name). Never the
 * error object, its message or `err.body`, which hold the raw request text.
 */
export function errorLogLine(method: string, path: string, status: number, err: unknown): string {
  const e = (err && typeof err === "object" ? err : {}) as { type?: unknown; name?: unknown };
  const raw = typeof e.type === "string" ? e.type : typeof e.name === "string" ? e.name : "Error";
  const name = raw.replace(/[^A-Za-z0-9._-]/g, "").slice(0, 60) || "Error";
  return `[api] ${method} ${path} ${status} ${name}`;
}

/** The last Express error handler. Logs errorLogLine only, and answers a generic message. */
export function apiErrorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  const e = (err && typeof err === "object" ? err : {}) as { status?: unknown; statusCode?: unknown };
  const raw = Number(e.status ?? e.statusCode);
  const status = Number.isInteger(raw) && raw >= 400 && raw < 600 ? raw : 500;
  console.error(errorLogLine(req.method, req.path, status, err));
  if (res.headersSent) return next(err);
  return res.status(status).json({ message: status < 500 ? "Bad request" : "Internal Server Error" });
}
