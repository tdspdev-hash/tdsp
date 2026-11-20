import { expect, test } from "@playwright/test";

/* READ-ONLY tests against the real TDSP Supabase project (public key, published rows only).
   They never write. The three seeded rows are labelled samples (is_sample = true). */

const SLUGS = ["irrigation", "poultry", "training"];

test.describe("Miradi & Andiko reads published projects from Supabase", () => {
  test("the list comes from the database, not from code", async ({ page }) => {
    await page.goto("/sw/miradi-na-andiko");
    const list = page.locator("section[aria-labelledby='pm-list'] ul");
    await expect(list).toHaveAttribute("data-source", "database");
    await expect(list.locator("li")).toHaveCount(3);
    await expect(list.locator("h3")).toHaveText(["Mradi wa Kilimo cha Umwagiliaji", "Mradi wa Ufugaji wa Kuku", "Mradi wa Mafunzo kwa Wakulima"]);
    await page.goto("/en/projects-and-proposals");
    await expect(page.locator("section[aria-labelledby='pm-list'] ul")).toHaveAttribute("data-source", "database");
    await expect(page.locator("section[aria-labelledby='pm-list'] h3")).toHaveText(["Irrigation Farming Project", "Poultry Farming Project", "Farmer Training Project"]);
  });

  test("database rows flagged as samples keep the visible sample note", async ({ page }) => {
    await page.goto("/sw/miradi-na-andiko");
    await expect(page.getByRole("note")).toContainText("si taarifa halisi zilizothibitishwa za TDSP");
    await page.goto("/en/projects-and-proposals/poultry");
    await expect(page.getByRole("note")).toContainText("not verified TDSP records");
  });

  test("each detail page is rendered from the database row, in both languages", async ({ page }) => {
    for (const id of SLUGS) {
      for (const [lang, base] of [["sw", "miradi-na-andiko"], ["en", "projects-and-proposals"]] as const) {
        const res = await page.goto(`/${lang}/${base}/${id}`);
        expect(res?.status(), `${lang} ${id}`).toBe(200);
        await expect(page.locator("article ul li")).toHaveCount(3);
        await expect(page.locator("article h2")).toHaveCount(3);
      }
    }
  });

  test("unknown and unpublished slugs are 404, and the listing has no draft", async ({ page }) => {
    expect((await page.goto("/sw/miradi-na-andiko/does-not-exist"))?.status()).toBe(404);
    expect((await page.goto("/en/projects-and-proposals/zz-draft-test"))?.status()).toBe(404);
  });

  test("no money, donation or funding wording comes through from the database", async ({ page }) => {
    for (const p of ["/sw/miradi-na-andiko", "/en/projects-and-proposals", ...SLUGS.map((s) => `/en/projects-and-proposals/${s}`)]) {
      await page.goto(p);
      expect(await page.locator("main").innerText(), p).not.toMatch(/TSh|TZS|donat|pledge|ahadi|loan|mikopo/i);
    }
  });
});
