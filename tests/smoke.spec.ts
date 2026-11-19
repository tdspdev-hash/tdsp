import { expect, test } from "@playwright/test";
import { clickNav } from "./helpers";

test("root redirects to the Kiswahili home page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/sw$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "sw");
  await expect(
    page.getByRole("heading", { level: 1, name: "Kuimarisha Wakulima, Masoko na Fursa za Maendeleo" }),
  ).toBeVisible();
});

test("navigation reaches the main public pages", async ({ page }) => {
  await page.goto("/sw");
  const targets = [
    { key: "about" as const, url: /\/sw\/about$/, h1: "Kuhusu TDSP" },
    { key: "services" as const, url: /\/sw\/services$/, h1: "Huduma" },
  ];
  for (const t of targets) {
    await clickNav(page, "sw", t.key);
    await expect(page).toHaveURL(t.url);
    await expect(page.getByRole("heading", { level: 1, name: t.h1 })).toBeVisible();
  }
});

test("unknown language path is not found", async ({ page }) => {
  const response = await page.goto("/fr/about");
  // /fr/about is redirected to /sw/fr/about, which does not exist.
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Ukurasa haujapatikana" })).toBeVisible();
});

test("services page keeps the 'TDSP does not lend' statement", async ({ page }) => {
  await page.goto("/sw/services");
  await expect(page.getByText("TDSP haihusiki na utoaji wa mikopo moja kwa moja.")).toBeVisible();
  await page.goto("/en/services");
  await expect(page.getByText("TDSP does not directly provide loans.")).toBeVisible();
});

test("Habari & Fursa in the main navigation leads to the combined page", async ({ page }) => {
  await page.goto("/sw");
  const desktop = page.viewportSize()!.width >= 900;
  test.skip(!desktop, "header navigation is desktop-only; phones use the bottom bar");
  for (const [label, url] of [["Habari & Fursa", /\/sw\/habari-na-fursa$/]] as const) {
    await page.goto("/sw");
    await page.locator("#site-nav").getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(url);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Habari & Fursa");
  }
});
