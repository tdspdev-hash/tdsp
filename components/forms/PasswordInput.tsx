"use client";

import { useState, type ComponentProps } from "react";
import ui from "../ui.module.css";

type Props = ComponentProps<"input"> & {
  showLabel: string;
  hideLabel: string;
};

/** Password field with a large show/hide toggle (helpful on phones). */
export function PasswordInput({ showLabel, hideLabel, className, ...rest }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={ui.passwordRow}>
      <input {...rest} type={visible ? "text" : "password"} className={className} />
      <button
        type="button"
        className={ui.passwordToggle}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? hideLabel : showLabel}
      </button>
    </div>
  );
}
