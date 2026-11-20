"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn, Lock, Mail, UserPlus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { signInMember, type AuthResult } from "@/lib/auth/client";
import { createLoginSchema, type LoginValues } from "@/lib/validation/auth";
import { Alert } from "../forms/Alert";
import styles from "./LoginContent.module.css";

type Props = { lang: Locale; dict: Pick<Dictionary, "login" | "form"> };

/**
 * Login card form. With Supabase configured it signs in with email + password;
 * without it, submitting valid input reports "not connected" and never signs
 * anyone in. A successful sign-in proves identity only, never membership.
 * "Remember me" has no effect (the session cookie policy is Supabase's default).
 */
export function LoginForm({ lang, dict }: Props) {
  const { login, form } = dict;
  const schema = useMemo(() => createLoginSchema(login.errors), [login.errors]);
  const [result, setResult] = useState<AuthResult | null>(null);
  const [visible, setVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  const onSubmit = async (values: LoginValues) => {
    setResult(null);
    setResult(await signInMember(values.email, values.password));
  };

  const feedback =
    result?.status === "not_configured"
      ? { kind: "error" as const, text: form.notConfigured }
      : result?.status === "invalid_credentials"
        ? { kind: "error" as const, text: login.invalidCredentials }
        : result?.status === "email_not_confirmed"
          ? { kind: "error" as const, text: login.emailNotConfirmed }
          : result?.status === "error"
            ? { kind: "error" as const, text: form.genericError }
            : result?.status === "ok"
              ? { kind: "success" as const, text: login.signedIn }
              : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="email">
          {login.fields.email} <span className={styles.star} aria-hidden="true">*</span>
        </label>
        <span className={`${styles.control} ${errors.email ? styles.invalid : ""}`}>
          <Mail size={22} aria-hidden="true" />
          <input id="email" type="email" inputMode="email" autoComplete="email" placeholder={login.fields.emailPlaceholder} aria-required="true" aria-invalid={errors.email ? "true" : undefined} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
        </span>
        {errors.email && <p id="email-error" role="alert" className={styles.error}>{errors.email.message}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="password">
          {login.fields.password} <span className={styles.star} aria-hidden="true">*</span>
        </label>
        <span className={`${styles.control} ${errors.password ? styles.invalid : ""}`}>
          <Lock size={22} aria-hidden="true" />
          <input id="password" type={visible ? "text" : "password"} autoComplete="current-password" placeholder={login.fields.passwordPlaceholder} aria-required="true" aria-invalid={errors.password ? "true" : undefined} aria-describedby={errors.password ? "password-error" : undefined} {...register("password")} />
          <button type="button" className={styles.eye} aria-pressed={visible} aria-label={visible ? form.hidePassword : form.showPassword} onClick={() => setVisible((v) => !v)}>
            {visible ? <Eye size={22} aria-hidden="true" /> : <EyeOff size={22} aria-hidden="true" />}
          </button>
        </span>
        {errors.password && <p id="password-error" role="alert" className={styles.error}>{errors.password.message}</p>}
      </div>

      <div className={styles.optionsRow}>
        <label className={styles.remember}>
          <input type="checkbox" name="remember" />
          {login.remember}
        </label>
        <Link href={`/${lang}/forgot-password`} className={styles.forgot}>{login.forgot}</Link>
      </div>

      {feedback && <Alert kind={feedback.kind}>{feedback.text}</Alert>}

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        <LogIn size={26} aria-hidden="true" />
        {isSubmitting ? form.sending : login.submit}
      </button>

      <p className={styles.divider}>{login.noAccount}</p>

      <Link href={`/${lang}/join`} className={styles.join}>
        <UserPlus size={26} aria-hidden="true" />
        {login.join}
      </Link>
    </form>
  );
}
