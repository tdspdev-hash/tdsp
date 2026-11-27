import "server-only";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/server";
import { getOwnMembership } from "@/lib/data/membership";
import type { Locale } from "@/lib/i18n/config";
import { accountPath } from "@/lib/navigation";

/**
 * Gate for every member route (call it in each page, not only the layout: layouts are not
 * re-run on client navigation). Signed out goes to login; signed in without an active
 * membership goes to the account page. If membership cannot be checked the caller gets
 * kind "error" and must show no member data.
 */
export async function requireMember(lang: Locale) {
  const user = await requireUser(lang);
  const membership = await getOwnMembership(user.id);
  if (membership.kind === "none") redirect(accountPath(lang));
  return { user, membership };
}
