"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Save } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { updatePassword, type AuthResult } from "@/lib/auth/client";
import { createResetSchema, type ResetValues } from "@/lib/validation/auth";
import { Alert } from "../forms/Alert";
import lg from "./LoginContent.module.css";

type Props = { lang: Locale; dict: Pick<Dictionary, "reset" | "form"> };

/** New-password form. Only rendered for a visitor with a verified session (a recovery link or an ordinary sign-in). */
export function ResetForm({ lang, dict }: Props) {
  const { reset, form } = dict;
  const schema = useMemo(() => createResetSchema(reset.errors), [reset.errors]);
  const [result, setResult] = useState<AuthResult | null>(null);
  const [visible, setVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({ resolver: zodResolver(schema), defaultValues: { password: "", confirmPassword: "" } });

  if (result?.status === "ok") {
    return (
      <div className={lg.form}>
        <Alert kind="success">{reset.success}</Alert>
        <Link href={`/${lang}/login`} className={lg.submit}>{reset.loginLink}</Link>
      </div>
    );
  }

  const feedback =
    result?.status === "not_configured"
      ? form.notConfigured
      : result?.status === "error"
        ? form.genericError
        : null;

  const field = (id: "password" | "confirmPassword", label: string, placeholder: string) => (
    <div className={lg.field}>
      <label htmlFor={id}>
        {label} <span className={lg.star} aria-hidden="true">*</span>
      </label>
      <span className={`${lg.control} ${errors[id] ? lg.invalid : ""}`}>
        <Lock size={22} aria-hidden="true" />
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          placeholder={placeholder}
          aria-required="true"
          aria-invalid={errors[id] ? "true" : undefined}
          aria-describedby={errors[id] ? `${id}-error` : undefined}
          {...register(id)}
        />
        {id === "password" && (
          <button type="button" className={lg.eye} aria-pressed={visible} aria-label={visible ? form.hidePassword : form.showPassword} onClick={() => setVisible((v) => !v)}>
            {visible ? <Eye size={22} aria-hidden="true" /> : <EyeOff size={22} aria-hidden="true" />}
          </button>
        )}
      </span>
      {errors[id] && <p id={`${id}-error`} role="alert" className={lg.error}>{errors[id]?.message}</p>}
    </div>
  );

  return (
    <form
      noValidate
      className={lg.form}
      onSubmit={handleSubmit(async (v) => {
        setResult(null);
        setResult(await updatePassword(v.password));
      })}
    >
      {field("password", reset.passwordLabel, reset.passwordPlaceholder)}
      {field("confirmPassword", reset.confirmLabel, reset.confirmPlaceholder)}
      {feedback && <Alert kind="error">{feedback}</Alert>}
      <button type="submit" className={lg.submit} disabled={isSubmitting}>
        <Save size={24} aria-hidden="true" />
        {isSubmitting ? form.sending : reset.submit}
      </button>
    </form>
  );
}
