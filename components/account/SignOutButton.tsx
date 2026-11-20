"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { signOutMember } from "@/lib/auth/client";
import styles from "./AccountContent.module.css";

/** Signs the visitor out and refreshes the page so it shows the signed-out state. */
export function SignOutButton({ label }: { label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className={styles.signOut}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await signOutMember();
        router.refresh();
        setBusy(false);
      }}
    >
      <LogOut size={20} aria-hidden="true" />
      {label}
    </button>
  );
}
