import { expect, test } from "@playwright/test";

/* Live-project auth checks that create NO accounts and send NO emails to real people:
   wrong credentials, the neutral forgot-password reply, the reset page without a session,
   bad email-callback links (including an open-redirect attempt) and the signed-out account page.
   Verified by hand on 20 Nov 2026 and kept here so they can be re-run.
   NOT covered (needs a confirmed test account and a working email sender): successful sign-up
   confirmation, successful sign-in, sign-out, and completing a password reset. */

test.describe("authentication against the live Supabase project", () => {
  test("wrong credentials are rejected with the translated message", async ({ page }) => {
    await page.goto("/en/login");
    await page.locator("#email").fill("nobody.here@example.com");
    await page.locator("#password").fill("wrong-password-1");
    await page.locator("form").getByRole("button", { name: /Sign In/ }).click();
    await expect(page.getByRole("alert").filter({ hasText: "The email or password is not correct." })).toBeVisible();
    await expect(page).toHaveURL(/\/en\/login$/);
  });

  test("forgot password gives the same neutral reply (does not reveal accounts)", async ({ page }) => {
    await page.goto("/en/forgot-password");
    await page.locator("#email").fill("no.such.person@example.com");
    await page.getByRole("button", { name: "Send Password Reset Link" }).click();
    await expect(page.locator("form")).toContainText("If this email is registered, you will receive instructions");
  });

  test("reset-password without a verified session asks for a new link and shows no form", async ({ page }) => {
    for (const [path, text] of [["/sw/reset-password", "Kiungo hiki si sahihi au kimeisha muda"], ["/en/reset-password", "This link is not valid or has expired"]] as const) {
      await page.goto(path);
      await expect(page.getByRole("alert").filter({ hasText: text })).toBeVisible();
      await expect(page.locator("form")).toHaveCount(0);
    }
    await expect(page.getByRole("link", { name: "Request a New Link" })).toHaveAttribute("href", "/en/forgot-password");
  });

  test("bad callback links return to login with a notice; open redirects are ignored", async ({ page }) => {
    await page.goto("/sw/auth/confirm?code=not-a-real-code");
    await expect(page).toHaveURL(/\/sw\/login\?error=confirm$/);
    await expect(page.getByRole("alert").filter({ hasText: "Kiungo cha uthibitisho si sahihi" })).toBeVisible();
    await page.goto("/en/auth/confirm?token_hash=bad&type=recovery&next=//evil.example.com");
    await expect(page).toHaveURL(/\/en\/login\?error=confirm$/);
  });

  test("the account page shows no signed-in notice to a signed-out visitor", async ({ page }) => {
    await page.goto("/sw/akaunti");
    await expect(page.getByRole("status")).toHaveCount(0);
  });
});
