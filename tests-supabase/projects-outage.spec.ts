import { expect, test } from "@playwright/test";

/* Supabase is CONFIGURED but unreachable. A failed read must show an error state and
   must NEVER show the sample projects (which would look like real TDSP projects). */

const SAMPLE_TITLES = ["Mradi wa Kilimo cha Umwagiliaji", "Mradi wa Ufugaji wa Kuku", "Mradi wa Mafunzo kwa Wakulima", "Irrigation Farming Project", "Poultry Farming Project", "Farmer Training Project"];

test.describe("Miradi & Andiko when Supabase fails", () => {
  test("list shows an error state, no projects and no sample note", async ({ page }) => {
    await page.goto("/sw/miradi-na-andiko");
    await expect(page.getByRole("alert").filter({ hasText: "Imeshindikana kupakia miradi" })).toBeVisible();
    await expect(page.locator("section[aria-labelledby='pm-list'] li")).toHaveCount(0);
    await expect(page.locator("[data-source]")).toHaveCount(0);
    await expect(page.getByRole("note")).toHaveCount(0);
    const t = await page.locator("main").innerText();
    for (const s of SAMPLE_TITLES) expect(t).not.toContain(s);
    await page.goto("/en/projects-and-proposals");
    await expect(page.getByRole("alert").filter({ hasText: "Projects could not be loaded" })).toBeVisible();
  });

  test("a detail page shows the error state with a way back, never sample content", async ({ page }) => {
    await page.goto("/sw/miradi-na-andiko/irrigation");
    await expect(page.getByRole("alert").filter({ hasText: "Imeshindikana kupakia miradi" })).toBeVisible();
    const t = await page.locator("main").innerText();
    for (const s of SAMPLE_TITLES) expect(t).not.toContain(s);
    await expect(page.getByRole("link", { name: "Rudi kwenye Miradi" })).toHaveAttribute("href", "/sw/miradi-na-andiko");
    await page.goto("/en/projects-and-proposals/poultry");
    await expect(page.getByRole("alert").filter({ hasText: "Projects could not be loaded" })).toBeVisible();
  });

  test("the error page is never cached as a normal page", async ({ request }) => {
    const res = await request.get("/sw/miradi-na-andiko");
    expect(res.headers()["cache-control"] ?? "").not.toMatch(/s-maxage=\d{3,}/);
  });
});
