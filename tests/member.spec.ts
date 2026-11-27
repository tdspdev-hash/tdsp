import { expect, test } from "@playwright/test";

/* Offline (Supabase not configured): nobody is signed in, so every member route must send
   the visitor to login. Signed-in behaviour is in tests-member/. */
const SLUGS = ["dashboard", "profile", "membership", "service-requests", "markets", "training", "documents", "notifications", "settings"];

test("member routes send signed-out visitors to login in both languages", async ({ page }, info) => {
  test.skip(info.project.name !== "w390" && info.project.name !== "w1440", "one phone and one desktop are enough");
  for (const lang of ["sw", "en"]) {
    for (const path of ["", ...SLUGS.map((s) => `/${s}`)]) {
      await page.goto(`/${lang}/member${path}`);
      await expect(page, `${lang}${path}`).toHaveURL(new RegExp(`/${lang}/login$`));
    }
  }
});

test("signed-out header keeps Login and Join on pages whose address starts like /member", async ({ page }, info) => {
  test.skip(info.project.name !== "w1440", "header buttons are desktop only");
  for (const path of ["/en/membership", "/sw/uanachama"]) {
    await page.goto(path);
    const banner = page.getByRole("banner");
    await expect(banner.locator("a[href$='/join']"), path).toBeVisible();
    await expect(banner.locator("a[href$='/account'], a[href$='/akaunti']"), path).toBeVisible();
  }
});
