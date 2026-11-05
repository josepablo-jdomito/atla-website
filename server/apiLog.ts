/**
 * The /api request log line. Paths that carry visitor free text (the search
 * bar and the brief) are logged without bodies: method, path, status and
 * duration only.
 */

const PRIVATE_PATHS = [/^\/api\/ask\/?$/, /^\/api\/brief(\/|$)/];

export const isPrivateApiPath = (path: string) => PRIVATE_PATHS.some((pattern) => pattern.test(path));

export function apiLogLine(method: string, path: string, status: number, durationMs: number, responseBody?: unknown): string {
  const line = `${method} ${path} ${status} in ${durationMs}ms`;
  if (responseBody === undefined || isPrivateApiPath(path)) return line;
  return `${line} :: ${JSON.stringify(responseBody)}`;
}
