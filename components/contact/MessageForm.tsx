"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { MESSAGE_MAX, SUBJECT_KEYS, createContactSchema, type ContactValues } from "@/lib/validation/contact";
import { siteConfig } from "@/lib/site-config";
import { Alert } from "../forms/Alert";
import ui from "../ui.module.css";
import styles from "./ContactContent.module.css";

function Field({ id, label, error, required, children }: { id: string; label: string; error?: string; required: string; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label} <span className={styles.star} aria-hidden="true">*</span>
        <span className="srOnly"> ({required})</span>
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className={ui.error}>
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * The contact form. TDSP has no message-receiving workflow yet (no email
 * service, API or inbox storage), so this form NEVER claims a message was
 * sent. After valid input it says so plainly and offers a pre-filled mailto
 * link, so the visitor can send the message from their own email.
 */
export function MessageForm({ dict, subjectLabelFor }: { dict: Dictionary["contactPage"]["form"]; subjectLabelFor: Record<string, string> }) {
  const schema = useMemo(() => createContactSchema(dict.errors), [dict.errors]);
  const [mailto, setMailto] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });
  const length = (useWatch({ control, name: "message" }) ?? "").length;

  const onSubmit = (v: ContactValues) => {
    const subject = `${subjectLabelFor[v.subject] ?? v.subject}`;
    const body = `${v.message}\n\n${v.name}\n${v.email}`;
    setMailto(`mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
      <div className={styles.row2}>
        <Field required={dict.required} id="mw-name" label={dict.name} error={errors.name?.message}>
          <input id="mw-name" autoComplete="name" placeholder={dict.namePlaceholder} className={`${styles.input} ${errors.name ? ui.inputInvalid : ""}`} aria-invalid={errors.name ? "true" : undefined} aria-describedby={errors.name ? "mw-name-error" : undefined} {...register("name")} />
        </Field>
        <Field required={dict.required} id="mw-email" label={dict.email} error={errors.email?.message}>
          <input id="mw-email" type="email" inputMode="email" autoComplete="email" placeholder={dict.emailPlaceholder} className={`${styles.input} ${errors.email ? ui.inputInvalid : ""}`} aria-invalid={errors.email ? "true" : undefined} aria-describedby={errors.email ? "mw-email-error" : undefined} {...register("email")} />
        </Field>
      </div>
      <Field required={dict.required} id="mw-subject" label={dict.subject} error={errors.subject?.message}>
        <select id="mw-subject" className={`${styles.input} ${styles.select} ${errors.subject ? ui.inputInvalid : ""}`} aria-invalid={errors.subject ? "true" : undefined} aria-describedby={errors.subject ? "mw-subject-error" : undefined} {...register("subject")}>
          <option value="">{dict.subjectPlaceholder}</option>
          {SUBJECT_KEYS.map((k) => (
            <option key={k} value={k}>{dict.subjects[k]}</option>
          ))}
        </select>
      </Field>
      <Field required={dict.required} id="mw-message" label={dict.message} error={errors.message?.message}>
        <textarea id="mw-message" placeholder={dict.messagePlaceholder} className={`${styles.input} ${styles.textarea} ${errors.message ? ui.inputInvalid : ""}`} aria-invalid={errors.message ? "true" : undefined} aria-describedby={errors.message ? "mw-message-error" : undefined} {...register("message")} />
        <p className={`${styles.counter} ${length > MESSAGE_MAX ? styles.counterOver : ""}`} aria-live="polite">
          {length} / {MESSAGE_MAX}
        </p>
      </Field>

      <button type="submit" className={styles.submit}>
        <Send size={22} aria-hidden="true" />
        {dict.submit}
      </button>

      {mailto && (
        <div role="status" className={styles.notSent}>
          <Alert kind="info">
            <strong>{dict.notSentTitle}.</strong> {dict.notSent}
          </Alert>
          <a href={mailto} className={styles.mailLink}>
            <Mail size={20} aria-hidden="true" />
            {dict.openEmail}
          </a>
        </div>
      )}
    </form>
  );
}
