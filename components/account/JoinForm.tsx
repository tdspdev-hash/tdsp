"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Phone, User, UserPlus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { registerMember, type AuthResult } from "@/lib/auth/client";
import { AREA_KEYS, GENDER_KEYS, createRegisterSchema, type RegisterValues } from "@/lib/validation/auth";
import { Alert } from "../forms/Alert";
import ui from "../ui.module.css";
import lg from "./LoginContent.module.css";
import styles from "./JoinContent.module.css";

type Props = { lang: Locale; dict: Pick<Dictionary, "join" | "form"> };
type Step = 1 | 2 | 3;

const STEP1: FieldPath<RegisterValues>[] = ["firstName", "lastName", "email", "phone", "password", "confirmPassword"];
const STEP2: FieldPath<RegisterValues>[] = ["gender", "region", "district", "ward", "village", "occupation", "areas"];

/**
 * Three-step registration form (basic details, additional details, confirm).
 * Registration is NOT connected until the TDSP Supabase project is configured:
 * the final step reports "not connected" and never claims an account exists.
 */
export function JoinForm({ lang, dict }: Props) {
  const { join, form } = dict;
  const schema = useMemo(() => createRegisterSchema(join.errors), [join.errors]);
  const [step, setStep] = useState<Step>(1);
  const [result, setResult] = useState<AuthResult | null>(null);
  const [show, setShow] = useState({ pw: false, pw2: false });

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", gender: "", phone: "", email: "", region: "", district: "", ward: "", village: "", occupation: "", areas: [], password: "", confirmPassword: "", consent: false },
  });
  const values = useWatch({ control });

  const next = async () => {
    const fields = step === 1 ? STEP1 : STEP2;
    if (!(await trigger(fields))) return;
    if (step === 1 && getValues("password") !== getValues("confirmPassword")) {
      setError("confirmPassword", { message: join.errors.passwordMismatch });
      return;
    }
    setStep((s) => (s === 1 ? 2 : 3));
  };

  const onSubmit = async (v: RegisterValues) => {
    setResult(null);
    setResult(await registerMember(v, lang));
  };

  if (result?.status === "ok") {
    return (
      <div className={styles.done}>
        <Alert kind="success">{join.success}</Alert>
        <Link href={`/${lang}/login`} className={lg.submit}>{join.loginLink}</Link>
      </div>
    );
  }

  const feedback =
    result?.status === "not_configured" ? form.notConfigured : result?.status === "already_registered" ? join.alreadyRegistered : result?.status === "rate_limited" ? form.rateLimited : result?.status === "error" ? form.genericError : null;

  const field = (id: keyof RegisterValues, label: string, icon: React.ReactNode, input: React.ReactNode) => (
    <div className={lg.field}>
      <label htmlFor={id}>{label} <span className={lg.star} aria-hidden="true">*</span></label>
      <span className={`${lg.control} ${errors[id] ? lg.invalid : ""}`}>{icon}{input}</span>
      {errors[id] && <p id={`${id}-error`} role="alert" className={lg.error}>{errors[id]?.message as string}</p>}
    </div>
  );
  const attrs = (id: keyof RegisterValues) => ({ id, "aria-required": true as const, "aria-invalid": errors[id] ? ("true" as const) : undefined, "aria-describedby": errors[id] ? `${id}-error` : undefined });
  const eye = (key: "pw" | "pw2") => (
    <button type="button" className={lg.eye} aria-pressed={show[key]} aria-label={show[key] ? form.hidePassword : form.showPassword} onClick={() => setShow((s) => ({ ...s, [key]: !s[key] }))}>
      {show[key] ? <Eye size={22} aria-hidden="true" /> : <EyeOff size={22} aria-hidden="true" />}
    </button>
  );

  const stepKeys = ["basic", "extra", "confirm"] as const;
  const heading = join.stepHeadings[stepKeys[step - 1]];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
      <ol className={styles.steps} aria-label={join.stepsLabel}>
        {stepKeys.map((k, i) => (
          <li key={k} aria-current={step === i + 1 ? "step" : undefined} className={`${styles.stepItem} ${step === i + 1 ? styles.stepActive : ""} ${step > i + 1 ? styles.stepDone : ""}`}>
            <span className={styles.stepNum}>{i + 1}</span>
            <span className={styles.stepLabel}>{join.steps[k]}</span>
          </li>
        ))}
      </ol>

      <div className={styles.stepHead}>
        <h2>{heading.title}</h2>
        <p>{heading.text}</p>
      </div>

      {/* Steps are hidden, not unmounted, so typed values are kept when going back. */}
      <div hidden={step !== 1} className={styles.fields}>
        {field("firstName", join.fields.firstName, <User size={22} aria-hidden="true" />, <input {...attrs("firstName")} autoComplete="given-name" placeholder={join.placeholders.firstName} {...register("firstName")} />)}
        {field("lastName", join.fields.lastName, <User size={22} aria-hidden="true" />, <input {...attrs("lastName")} autoComplete="family-name" placeholder={join.placeholders.lastName} {...register("lastName")} />)}
        {field("email", join.fields.email, <Mail size={22} aria-hidden="true" />, <input {...attrs("email")} type="email" inputMode="email" autoComplete="email" placeholder={join.placeholders.email} {...register("email")} />)}
        {field("phone", join.fields.phone, <Phone size={22} aria-hidden="true" />, (
          <>
            <span className={styles.prefix} title={join.hints.countryCode}>+255</span>
            <input {...attrs("phone")} type="tel" inputMode="tel" autoComplete="tel-national" placeholder={join.placeholders.phone} {...register("phone")} />
          </>
        ))}
        {field("password", join.fields.password, <Lock size={22} aria-hidden="true" />, (
          <>
            <input {...attrs("password")} type={show.pw ? "text" : "password"} autoComplete="new-password" placeholder={join.placeholders.password} {...register("password")} />
            {eye("pw")}
          </>
        ))}
        {field("confirmPassword", join.fields.confirmPassword, <Lock size={22} aria-hidden="true" />, (
          <>
            <input {...attrs("confirmPassword")} type={show.pw2 ? "text" : "password"} autoComplete="new-password" placeholder={join.placeholders.confirmPassword} {...register("confirmPassword")} />
            {eye("pw2")}
          </>
        ))}
      </div>

      <div hidden={step !== 2} className={styles.extra}>
        <div className={ui.field} role="radiogroup" aria-label={join.fields.gender}>
          <span className={ui.label}>{join.fields.gender} <span className={ui.optional}>({form.optional})</span></span>
          <div className={ui.choices}>
            {GENDER_KEYS.map((key) => (
              <label key={key} className={ui.choice}><input type="radio" value={key} {...register("gender")} /><span>{join.gender[key]}</span></label>
            ))}
          </div>
        </div>
        <div className={styles.fields}>
          {field("region", join.fields.region, <span />, <input {...attrs("region")} autoComplete="address-level1" {...register("region")} />)}
          {field("district", join.fields.district, <span />, <input {...attrs("district")} autoComplete="address-level2" {...register("district")} />)}
          {field("ward", join.fields.ward, <span />, <input {...attrs("ward")} {...register("ward")} />)}
          <div className={lg.field}>
            <label htmlFor="village">{join.fields.village} <span className={ui.optional}>({form.optional})</span></label>
            <span className={lg.control}><input id="village" {...register("village")} /></span>
          </div>
        </div>
        <div className={lg.field}>
          <label htmlFor="occupation">{join.fields.occupation} <span className={ui.optional}>({form.optional})</span></label>
          <span className={lg.control}><input id="occupation" {...register("occupation")} /></span>
        </div>
        <fieldset className={ui.fieldset}>
          <legend className={ui.legend}>{join.sections.interests}</legend>
          <p className={ui.hint}>{join.fields.areas} ({form.optional})</p>
          <div className={ui.choices}>
            {AREA_KEYS.map((key) => (
              <label key={key} className={ui.choice}><input type="checkbox" value={key} {...register("areas")} /><span>{join.areas[key]}</span></label>
            ))}
          </div>
        </fieldset>
      </div>

      <div hidden={step !== 3} className={styles.confirm}>
        <dl className={styles.review}>
          <dt>{join.review.name}</dt><dd>{values.firstName} {values.lastName}</dd>
          <dt>{join.review.email}</dt><dd>{values.email}</dd>
          <dt>{join.review.phone}</dt><dd>+255 {values.phone}</dd>
          <dt>{join.review.location}</dt><dd>{[values.ward, values.district, values.region].filter(Boolean).join(", ")}</dd>
        </dl>
        <Alert kind="info">{join.stepNote}</Alert>
        <div className={ui.field}>
          <label className={ui.choice}>
            <input type="checkbox" aria-invalid={errors.consent ? "true" : undefined} aria-describedby={errors.consent ? "consent-error" : undefined} {...register("consent")} />
            <span>{join.fields.consent}</span>
          </label>
          {errors.consent && <p id="consent-error" role="alert" className={ui.error}>{errors.consent.message}</p>}
        </div>
      </div>

      {feedback && <Alert kind="error">{feedback}</Alert>}

      <div className={styles.actions}>
        {step > 1 && (
          <button type="button" className={styles.back} onClick={() => setStep((s) => (s === 3 ? 2 : 1))}>{join.back}</button>
        )}
        {step < 3 ? (
          <button type="button" className={lg.submit} onClick={next}>
            {join.next}
            <ArrowRight size={24} aria-hidden="true" />
          </button>
        ) : (
          <button type="submit" className={lg.submit} disabled={isSubmitting}>
            <UserPlus size={26} aria-hidden="true" />
            {isSubmitting ? form.sending : join.submit}
          </button>
        )}
      </div>

      <p className={styles.haveAccount}>
        {join.haveAccount} <Link href={`/${lang}/login`}>{join.signIn}</Link>
      </p>
    </form>
  );
}
