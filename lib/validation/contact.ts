import { z } from "zod";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";

export const SUBJECT_KEYS = ["general", "partnership", "feedback", "support", "other"] as const;
export const MESSAGE_MAX = 500;

/** Contact form schema with messages in the active language. */
export function createContactSchema(e: Dictionary["contactPage"]["form"]["errors"]) {
  return z.object({
    name: z.string().trim().min(1, e.nameRequired),
    email: z.string().trim().min(1, e.emailRequired).pipe(z.email(e.emailInvalid)),
    subject: z.string().refine((v) => (SUBJECT_KEYS as readonly string[]).includes(v), e.subjectRequired),
    message: z.string().trim().min(1, e.messageRequired).max(MESSAGE_MAX, e.messageLong),
  });
}

export type ContactValues = z.infer<ReturnType<typeof createContactSchema>>;
