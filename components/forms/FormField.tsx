import type { ReactNode } from "react";
import ui from "../ui.module.css";

export type ControlProps = {
  id: string;
  className: string;
  "aria-invalid": "true" | undefined;
  "aria-describedby": string | undefined;
};

type Props = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  /** Text shown after the label for optional fields, e.g. "(optional)". */
  optionalLabel?: string;
  children: (control: ControlProps) => ReactNode;
};

/** Label + control + hint + error with correct accessibility wiring. */
export function FormField({ id, label, error, hint, optionalLabel, children }: Props) {
  const describedBy =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
        {optionalLabel && <span className={ui.optional}> ({optionalLabel})</span>}
      </label>
      {children({
        id,
        className: `${ui.input} ${error ? ui.inputInvalid : ""}`,
        "aria-invalid": error ? "true" : undefined,
        "aria-describedby": describedBy,
      })}
      {hint && (
        <p id={`${id}-hint`} className={ui.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className={ui.error}>
          {error}
        </p>
      )}
    </div>
  );
}
