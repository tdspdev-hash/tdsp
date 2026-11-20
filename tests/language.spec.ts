import { expect, test } from "@playwright/test";
import { clickNav } from "./helpers";

test("Kiswahili is the default language", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/sw$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "sw");
  await expect(page.getByRole("link", { name: "Kiswahili" })).toHaveAttribute("aria-current", "true");
});

test("switching to English translates the page", async ({ page }) => {
  await page.goto("/sw/about");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/about$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1, name: "About TDSP" })).toBeVisible();
  await expect(page.getByRole("link", { name: "English" })).toHaveAttribute("aria-current", "true");
});

test("language choice persists across navigation and new visits", async ({ page }) => {
  await page.goto("/sw");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en$/);

  // Navigate inside the app: language stays English.
  await clickNav(page, "en", "services");
  await expect(page).toHaveURL(/\/en\/services$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  // A later visit to the bare site address returns to English.
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);

  // Switching back to Kiswahili is remembered too.
  await page.getByRole("link", { name: "Kiswahili" }).click();
  await expect(page).toHaveURL(/\/sw$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/sw$/);
});

test("language switch keeps the current page", async ({ page }) => {
  await page.goto("/en/contact");
  await page.getByRole("link", { name: "Kiswahili" }).click();
  await expect(page).toHaveURL(/\/sw\/mawasiliano$/);
  await expect(page.getByRole("heading", { level: 1, name: "Mawasiliano" })).toBeVisible();
});
