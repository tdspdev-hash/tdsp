import { z } from "zod";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";

/** Tanzanian number typed after the fixed +255 prefix: nine digits, with or without a leading 0. */
const PHONE_PATTERN = /^0?[0-9]{9}$/;

export const AREA_KEYS = [
  "agriculture",
  "technology",
  "business",
  "education",
  "health",
  "environment",
  "digital",
  "other",
] as const;

export const GENDER_KEYS = ["male", "female", "none"] as const;

/** Registration form. Messages come from the active language. */
export function createRegisterSchema(e: Dictionary["join"]["errors"]) {
  return z
    .object({
      firstName: z.string().trim().min(1, e.firstNameRequired),
      lastName: z.string().trim().min(1, e.lastNameRequired),
      gender: z.enum(["", ...GENDER_KEYS]),
      phone: z
        .string()
        .trim()
        .min(1, e.phoneRequired)
        .refine((v) => PHONE_PATTERN.test(v.replace(/[\s-]/g, "")), e.phoneInvalid),
      email: z.string().trim().min(1, e.emailRequired).pipe(z.email(e.emailInvalid)),
      region: z.string().trim().min(1, e.regionRequired),
      district: z.string().trim().min(1, e.districtRequired),
      ward: z.string().trim().min(1, e.wardRequired),
      village: z.string().trim(),
      occupation: z.string().trim(),
      areas: z.array(z.enum(AREA_KEYS)),
      password: z.string().min(8, e.passwordShort),
      confirmPassword: z.string(),
      consent: z.boolean().refine((v) => v === true, e.consentRequired),
    })
    .refine((v) => v.password === v.confirmPassword, {
      path: ["confirmPassword"],
      message: e.passwordMismatch,
    });
}
export type RegisterValues = z.infer<ReturnType<typeof createRegisterSchema>>;

export function createLoginSchema(e: Dictionary["login"]["errors"]) {
  return z.object({
    email: z.string().trim().min(1, e.emailRequired).pipe(z.email(e.emailInvalid)),
    password: z.string().min(1, e.passwordRequired),
  });
}
export type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>;

export function createForgotSchema(e: Dictionary["forgot"]["errors"]) {
  return z.object({
    email: z.string().trim().min(1, e.emailRequired).pipe(z.email(e.emailInvalid)),
  });
}
export type ForgotValues = z.infer<ReturnType<typeof createForgotSchema>>;

export function createResetSchema(e: Dictionary["reset"]["errors"]) {
  return z
    .object({
      password: z.string().min(8, e.passwordShort),
      confirmPassword: z.string(),
    })
    .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: e.passwordMismatch });
}
export type ResetValues = z.infer<ReturnType<typeof createResetSchema>>;
