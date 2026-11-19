import Image from "next/image";
import type { ReactNode } from "react";
import ui from "../ui.module.css";

/** Centered card used by the registration, sign-in and password screens. */
export function AuthCard({
  title,
  subtitle,
  wide,
  children,
}: {
  title: string;
  subtitle?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="container page">
      <section className={`${ui.authCard} ${wide ? ui.authCardWide : ""}`}>
        <Image
          src="/tdsp-logo.png"
          alt=""
          width={64}
          height={64}
          className={ui.authLogo}
          priority
        />
        <h1 className={ui.center}>{title}</h1>
        {subtitle && <p className={`${ui.center} ${ui.hint}`}>{subtitle}</p>}
        {children}
      </section>
    </div>
  );
}
