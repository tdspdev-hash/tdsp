import type { ReactNode } from "react";
import ui from "../ui.module.css";

const KIND = {
  success: ui.alertSuccess,
  error: ui.alertError,
  info: ui.alertInfo,
} as const;

export function Alert({
  kind,
  children,
}: {
  kind: keyof typeof KIND;
  children: ReactNode;
}) {
  return (
    <p role={kind === "error" ? "alert" : "status"} className={`${ui.alert} ${KIND[kind]}`}>
      {children}
    </p>
  );
}
