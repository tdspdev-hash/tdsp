"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { z } from "zod";
import styles from "./NewsContent.module.css";

/**
 * Newsletter sign-up. TDSP has no mailing-list service or storage, so this
 * validates the address but NEVER claims anyone was subscribed.
 */
export function NewsletterForm({ dict }: { dict: Dictionary["newsPage"]["banner"] }) {
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);

  return (
    <form
      noValidate
      className={styles.news}
      onSubmit={(e) => {
        e.preventDefault();
        const value = String(new FormData(e.currentTarget).get("email") ?? "").trim();
        setValidated(false);
        if (!value) return setError(dict.emailRequired);
        if (!z.email().safeParse(value).success) return setError(dict.emailInvalid);
        setError(null);
        setValidated(true);
      }}
    >
      <div className={styles.newsRow}>
        <Mail size={22} aria-hidden="true" className={styles.newsIcon} />
        <input type="email" name="email" inputMode="email" autoComplete="email" aria-label={dict.emailLabel} placeholder={dict.emailPlaceholder} aria-invalid={error ? "true" : undefined} aria-describedby={error ? "nl-error" : undefined} className={styles.newsInput} />
        <button type="submit" className={styles.newsButton}>{dict.button}</button>
      </div>
      {error && <p id="nl-error" role="alert" className={styles.newsMsg}>{error}</p>}
      {validated && (
        <p role="status" className={styles.newsMsg}>
          <strong>{dict.notSubscribedTitle}.</strong> {dict.notSubscribed}
        </p>
      )}
    </form>
  );
}
