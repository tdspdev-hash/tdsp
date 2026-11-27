"use client";

import { useSyncExternalStore } from "react";

/** Supabase's session cookie, possibly split into .0, .1 ...; not the "code-verifier" cookie. */
const SESSION_COOKIE = /(?:^|; )sb-[^=;]+-auth-token(?:\.\d+)?=/;

const hasSession = () => SESSION_COOKIE.test(document.cookie);
const subscribe = (onChange: () => void) => {
  window.addEventListener("focus", onChange);
  return () => window.removeEventListener("focus", onChange);
};

/**
 * Whether this browser holds a session cookie. For DISPLAY only (which header buttons to
 * show): it grants nothing and loads no library. Access is checked on the server.
 * Re-read on every render, so it follows sign-in and sign-out navigations.
 */
export function useSignedIn() {
  return useSyncExternalStore(subscribe, hasSession, () => false);
}
