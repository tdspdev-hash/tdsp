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
import type { RegisterValues } from "@/lib/validation/auth";

export type AuthResult =
  | { status: "ok" }
  | { status: "not_configured" }
  | { status: "already_registered" }
  | { status: "invalid_credentials" }
  | { status: "email_not_confirmed" }
  | { status: "error" };

export async function registerMember(values: RegisterValues): Promise<AuthResult> {
  if (!getSupabaseEnv()) return { status: "not_configured" };
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        // Registration details are carried as user metadata for a later
        // database trigger to copy into a profile table (proposal pending).
        // Metadata is user-editable and is never used for authorisation.
        data: {
          full_name: `${values.firstName} ${values.lastName}`,
          gender: values.gender || null,
          phone: `+255${values.phone.replace(/[\s-]/g, "").replace(/^0/, "")}`,
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

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (!getSupabaseEnv()) return { status: "not_configured" };
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return error ? { status: "error" } : { status: "ok" };
  } catch {
    return { status: "error" };
  }
}
