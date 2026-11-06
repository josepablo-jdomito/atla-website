import { z } from "zod";
import { ASK_MAX_CHARS, ASK_MAX_TURNS } from "./askCommon.ts";

/**
 * Ask on the server: everything in askCommon.ts (re-exported, so server imports stay as they were) plus
 * the zod schemas the route validates with. The browser never imports this file (vite.config.ts aliases
 * @shared/ask to askCommon.ts), so zod stays out of the home's bundle.
 */
export * from "./askCommon.ts";

export const askRequestSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["visitor", "atla"]), text: z.string().trim().min(1).max(ASK_MAX_CHARS) }))
    .min(1)
    .max(ASK_MAX_TURNS)
    .refine((turns) => turns[turns.length - 1]?.role === "visitor", { message: "The last turn is the question" }),
  idempotencyKey: z.string().regex(/^[A-Za-z0-9-]{8,64}$/),
});
export type AskRequest = z.infer<typeof askRequestSchema>;

export const askModelOutputSchema = z.object({
  text: z.string().trim().min(1).max(1200),
  slugs: z.array(z.string()).max(20),
  links: z.array(z.string()).max(10),
});
