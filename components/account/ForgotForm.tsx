"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, Send } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { requestPasswordReset, type AuthResult } from "@/lib/auth/client";
import { createForgotSchema, type ForgotValues } from "@/lib/validation/auth";
import { Alert } from "../forms/Alert";
import lg from "./LoginContent.module.css";
import styles from "./ForgotContent.module.css";

type Props = { lang: Locale; dict: Pick<Dictionary, "forgot" | "form"> };

/**
 * Password-recovery request. Without a connected Supabase project it reports
 * "not connected" and never says an email was sent. When connected, the reply is
 * the same neutral message whether or not the address has an account.
 * NOTE: no /reset-password page exists yet, so the emailed link cannot be completed.
 */
export function ForgotForm({ lang, dict }: Props) {
  const { forgot, form } = dict;
  const schema = useMemo(() => createForgotSchema(forgot.errors), [forgot.errors]);
  const [result, setResult] = useState<AuthResult | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const feedback =
    result?.status === "not_configured"
      ? { kind: "error" as const, text: form.notConfigured }
      : result?.status === "error"
        ? { kind: "error" as const, text: form.genericError }
        : result?.status === "ok"
          ? { kind: "success" as const, text: forgot.sent }
          : null;

  return (
    <form
      noValidate
      className={lg.form}
      onSubmit={handleSubmit(async (v) => {
        setResult(null);
        setResult(await requestPasswordReset(v.email));
      })}
    >
      <div className={lg.field}>
        <label htmlFor="email">
          {forgot.emailLabel} <span className={lg.star} aria-hidden="true">*</span>
        </label>
        <span className={`${lg.control} ${errors.email ? lg.invalid : ""}`}>
          <Mail size={22} aria-hidden="true" />
          <input id="email" type="email" inputMode="email" autoComplete="email" placeholder={forgot.emailPlaceholder} aria-required="true" aria-invalid={errors.email ? "true" : undefined} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
        </span>
        {errors.email && <p id="email-error" role="alert" className={lg.error}>{errors.email.message}</p>}
      </div>

      {feedback && <Alert kind={feedback.kind}>{feedback.text}</Alert>}

      <button type="submit" className={lg.submit} disabled={isSubmitting}>
        <Send size={24} aria-hidden="true" />
        {isSubmitting ? form.sending : forgot.submit}
      </button>

      <p className={styles.back}>
        <Link href={`/${lang}/login`}>
          <ArrowLeft size={22} aria-hidden="true" />
          {forgot.back}
        </Link>
      </p>
    </form>
  );
}
