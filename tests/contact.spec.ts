import { expect, test } from "@playwright/test";
import { isDesktop, width } from "./helpers";

const SW = "/sw/mawasiliano";
const EN = "/en/contact";

test.describe("Mawasiliano / Contact page", () => {
  test("routes and redirects", async ({ page }) => {
    for (const p of [SW, EN]) expect((await page.goto(p))?.status()).toBe(200);
    for (const [from, to] of [["/sw/contact", /\/sw\/mawasiliano$/], ["/en/mawasiliano", /\/en\/contact$/], ["/sw/communications", /\/sw\/mawasiliano$/], ["/en/communications", /\/en\/contact$/]] as const) {
      await page.goto(from);
      await expect(page).toHaveURL(to);
    }
    await page.goto(SW);
    await page.getByRole("link", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/contact$/);
  });

  test("hero, four benefits, info rows, banner in both languages", async ({ page }) => {
    await page.goto(SW);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mawasiliano");
    await expect(page.locator("main ul").first().locator("h3")).toHaveText(["Uliza Maswali", "Ushirikiano", "Maoni na Mapendekezo", "Usaidizi"]);
    await expect(page.getByRole("heading", { level: 3, name: "Anwani" })).toBeVisible();
    await expect(page.getByText("Unatafuta")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Jadili Ushirikiano" })).toHaveAttribute("href", "#mw-form");
    await page.goto(EN);
    await expect(page.getByRole("heading", { level: 3, name: "Working Hours" })).toBeVisible();
    const t = await page.locator("main").innerText();
    for (const sw of ["Mawasiliano", "Anwani", "Barua pepe", "Tuma", "Wasiliana"]) expect(t).not.toContain(sw);
    expect(t).not.toMatch(/kampuni|compan/i);
  });

  test("uses only documented contact details; mockup placeholders never appear", async ({ page }) => {
    for (const p of [SW, EN]) {
      await page.goto(p);
      const t = await page.locator("main").innerText();
      expect(t).not.toMatch(/info@tdsp\.org|\+255 742 000 000|08:00|17:00|Jumatatu/);
      await expect(page.locator("section[aria-labelledby='mw-info']").getByRole("link", { name: "tdsphq@gmail.com" })).toHaveAttribute("href", "mailto:tdsphq@gmail.com");
      await expect(page.getByText("Mbagala Kilungule, Dar es Salaam, Tanzania")).toBeVisible();
      await expect(page.locator("section[aria-labelledby='mw-info'] a[href^='tel:']").first()).toBeVisible();
    }
  });

  test("map is honest: no exact-office pin claim, search link only", async ({ page }) => {
    await page.goto(SW);
    await expect(page.getByText("Eneo kamili la ofisi litawekwa kwenye ramani baada ya TDSP kulithibitisha.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Tafuta kwenye ramani" })).toHaveAttribute("href", /google\.com\/maps\/search/);
  });

  test("hero 'Tuma Ujumbe' scrolls to the form; 'Piga Simu' is a tel link", async ({ page }) => {
    await page.goto(SW);
    await expect(page.getByRole("link", { name: "Piga Simu" })).toHaveAttribute("href", /^tel:/);
    await page.getByRole("link", { name: "Tuma Ujumbe", exact: true }).first().click();
    await expect(page).toHaveURL(/#mw-form$/);
  });

  test("character counter and 500 limit message", async ({ page }) => {
    await page.goto(SW);
    await expect(page.getByText("0 / 500")).toBeVisible();
    await page.getByLabel("Ujumbe wako").fill("habari");
    await expect(page.getByText("6 / 500")).toBeVisible();
  });

  test("desktop navigation marks Mawasiliano; footer link works", async ({ page }) => {
    await page.goto(SW);
    if (isDesktop(page)) await expect(page.locator("#site-nav [aria-current='page']")).toHaveText("Mawasiliano");
    await page.goto("/sw");
    await page.getByRole("contentinfo").getByRole("link", { name: "Mawasiliano" }).click();
    await expect(page).toHaveURL(/\/sw\/mawasiliano$/);
  });

  test("no horizontal overflow; fields stack on phones; two columns from 900px", async ({ page }) => {
    for (const p of [SW, EN]) {
      await page.goto(p, { waitUntil: "load" });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    }
    await page.goto(SW);
    const info = (await page.locator("section[aria-labelledby='mw-info']").boundingBox())!;
    const form = (await page.locator("#mw-form").boundingBox())!;
    if (width(page) >= 900) expect(info.x + info.width).toBeLessThanOrEqual(form.x + 1);
    else expect(info.y + info.height).toBeLessThanOrEqual(form.y + 1);
    const name = (await page.getByLabel("Jina lako").boundingBox())!;
    const mail = (await page.getByLabel("Barua pepe").boundingBox())!;
    if (width(page) < 560) expect(name.y + name.height).toBeLessThanOrEqual(mail.y + 1);
    else expect(Math.abs(name.y - mail.y)).toBeLessThan(2);
  });

  test("hero text stays left of the bright part of the photo (sweep)", async ({ page }, info) => {
    test.skip(info.project.name !== "w1280", "sweep runs once");
    for (const w of [900, 1024, 1280, 1440, 1600, 1920]) {
      await page.setViewportSize({ width: w, height: 800 });
      for (const p of [SW, EN]) {
        await page.goto(p);
        const hero = page.locator("main section").first();
        const rights = await hero.evaluate((sec) => ["h1", "p"].map((q) => { const el = sec.querySelector(q)!; const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right; }));
        for (const r of rights) expect(r, `${p} ${w}px`).toBeLessThanOrEqual(w * 0.62);
      }
    }
  });
});
