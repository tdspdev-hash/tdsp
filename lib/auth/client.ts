"use client";

/**
 * Browser-side auth helpers (Supabase Auth, email + password).
 *
 * STATUS: the live project exists with migration 0001 applied, but sign-in,
 * sign-up and reset have not yet been exercised end to end against it. Without
 * NEXT_PUBLIC_SUPABASE_* these return "not_configured" and make no network calls.
 *
 * Authentication only proves identity. A successful sign-in must never be
 * treated as approved membership; membership status is checked on the server
 * and enforced by RLS (a later stage, pending the approved migration).
 */
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Locale } from "@/lib/i18n/config";
import type { ProfileValues, RegisterValues } from "@/lib/validation/auth";

export type AuthResult =
  | { status: "ok" }
  | { status: "not_configured" }
  | { status: "already_registered" }
  | { status: "invalid_credentials" }
  | { status: "email_not_confirmed" }
  | { status: "rate_limited" }
  | { status: "error" };

/** Supabase limits how many auth emails it sends (the default sender allows very few per hour). */
function isRateLimited(error: { status?: number; code?: string }) {
  return error.status === 429 || error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit";
}

/** Nine digits typed after the fixed +255 prefix, with or without a leading 0. */
const toTzPhone = (v: string) => `+255${v.replace(/[\s-]/g, "").replace(/^0/, "")}`;

export async function registerMember(values: RegisterValues, lang: Locale): Promise<AuthResult> {
  if (!getSupabaseEnv()) return { status: "not_configured" };
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        // The confirmation email returns to our callback route (must be allowed in Supabase Auth redirect URLs).
        emailRedirectTo: `${window.location.origin}/${lang}/auth/confirm`,
        // Registration details are carried as user metadata for a later
        // database trigger to copy into a profile table (proposal pending).
        // Metadata is user-editable and is never used for authorisation.
        data: {
          full_name: `${values.firstName} ${values.lastName}`,
          gender: values.gender || null,
          phone: toTzPhone(values.phone),
          adult: values.adult,
          region: values.region,
          district: values.district,
          ward: values.ward,
          village: values.village || null,
          occupation: values.occupation || null,
          areas: values.areas,
        },
      },
    });
    if (error) {
      if (isRateLimited(error)) return { status: "rate_limited" };
      if (/already/i.test(error.message)) return { status: "already_registered" };
      return { status: "error" };
    }
    // With email confirmation on, an existing address returns no identities.
    if (data.user && data.user.identities?.length === 0) {
      return { status: "already_registered" };
    }
    return { status: "ok" };
  } catch {
    return { status: "error" };
  }
}

export async function signInMember(email: string, password: string): Promise<AuthResult> {
  if (!getSupabaseEnv()) return { status: "not_configured" };
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Prefer the stable error code; keep the message match as a fallback.
      if (error.code === "email_not_confirmed") return { status: "email_not_confirmed" };
      if (error.code === "invalid_credentials" || /invalid/i.test(error.message)) {
        return { status: "invalid_credentials" };
      }
      return { status: "error" };
    }
    return { status: "ok" };
  } catch {
    return { status: "error" };
  }
}

export async function requestPasswordReset(email: string, lang: Locale): Promise<AuthResult> {
  if (!getSupabaseEnv()) return { status: "not_configured" };
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${lang}/auth/confirm?next=/${lang}/reset-password`,
    });
    if (error) return isRateLimited(error) ? { status: "rate_limited" } : { status: "error" };
    return { status: "ok" };
  } catch {
    return { status: "error" };
  }
}

/** Sets a new password for the signed-in (or recovery) session. */
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  if (!getSupabaseEnv()) return { status: "not_configured" };
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return error ? { status: "error" } : { status: "ok" };
  } catch {
    return { status: "error" };
  }
}

/** Saves the signed-in user's own profile. Succeeds only if a row was really updated. */
export async function updateProfile(userId: string, values: ProfileValues): Promise<AuthResult> {
  if (!getSupabaseEnv()) return { status: "not_configured" };
  try {
    const { data, error } = await createClient()
      .from("profiles")
      .update({
        full_name: values.fullName,
        phone: toTzPhone(values.phone),
        gender: values.gender || null,
        region: values.region,
        district: values.district,
        ward: values.ward,
        village: values.village || null,
        occupation: values.occupation || null,
        participation_areas: values.areas,
      })
      .eq("id", userId)
      .select("id");
    return error || !data?.length ? { status: "error" } : { status: "ok" };
  } catch {
    return { status: "error" };
  }
}

export async function signOutMember(): Promise<AuthResult> {
  if (!getSupabaseEnv()) return { status: "not_configured" };
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    return error ? { status: "error" } : { status: "ok" };
  } catch {
    return { status: "error" };
  }
}
