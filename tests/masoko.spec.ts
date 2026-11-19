import { expect, test } from "@playwright/test";
import { isDesktop, width } from "./helpers";

const lefts = (page: import("@playwright/test").Page, sel: string) =>
  page.locator(sel).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));

test.describe("Masoko", () => {
  test("routes: /sw/masoko and /en/markets; the other address redirects", async ({ page }) => {
    for (const [p, h1] of [["/sw/masoko", "Masoko"], ["/en/markets", "Markets"]] as const) {
      expect((await page.goto(p))?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
    }
    await page.goto("/sw/markets");
    await expect(page).toHaveURL(/\/sw\/masoko$/);
    await page.goto("/en/masoko");
    await expect(page).toHaveURL(/\/en\/markets$/);
    await page.goto("/sw/masoko");
    await page.getByRole("link", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/markets$/);
  });

  test("the home Masoko card leads here", async ({ page }) => {
    await page.goto("/sw");
    await page.locator("section[aria-labelledby='services-title']").getByRole("link", { name: /Masoko/ }).click();
    await expect(page).toHaveURL(/\/sw\/masoko$/);
  });

  test("hero text, breadcrumb and two buttons with real destinations", async ({ page }) => {
    await page.goto("/sw/masoko");
    await expect(page.getByText("Kuunganisha wakulima, vikundi na wanunuzi ili kuongeza fursa za soko, thamani na mapato ya mazao.")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Njia ya ukurasa" }).locator("[aria-current='page']")).toHaveText("Masoko");
    await expect(page.getByRole("link", { name: "Tafuta Soko la Mazao" })).toHaveAttribute("href", "/sw/mawasiliano");
    await expect(page.getByRole("link", { name: "Sajili Mahitaji Yako" })).toHaveAttribute("href", "/sw/uanachama");
    await page.goto("/en/markets");
    await expect(page.getByRole("link", { name: "Register Your Needs" })).toHaveAttribute("href", "/en/membership");
  });

  test("four benefits, six produce categories, four steps (in order)", async ({ page }) => {
    await page.goto("/sw/masoko");
    await expect(page.locator("main ul").first().locator("h3")).toHaveText(["Fursa za Masoko", "Ushirikiano wa Biashara", "Thamani ya Mazao", "Fursa za Mapato"]);
    const tiles = page.locator("section[aria-labelledby='mk-produce'] li");
    await expect(tiles).toHaveCount(6);
    await expect(tiles).toHaveText(["Mahindi", "Kahawa", "Parachichi", "Nyanya", "Kuku", "Mbogamboga"]);
    for (const img of await tiles.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
      expect(await img.getAttribute("alt")).toBeTruthy();
    }
    await expect(page.locator("section[aria-labelledby='mk-steps'] h3")).toHaveText(["1. Sajili / Jiunge", "2. Tangaza Mahitaji", "3. Unganika", "4. Fanya Biashara"]);
  });

  test("no guarantees, prices, buyers, statistics or company wording", async ({ page }) => {
    for (const p of ["/sw/masoko", "/en/markets"]) {
      await page.goto(p);
      // The disclaimer itself mentions guarantees and prices in order to deny them; scan everything else.
      const t = await page.locator("main").evaluate((m) => { const c = m.cloneNode(true) as HTMLElement; c.querySelectorAll("[role=note]").forEach((n) => n.remove()); return c.innerText; });
      expect(t, p).not.toMatch(/hakika|uhakika|zawadi|guarantee|reliable|assured|certain|bei\b|price|TSh|kampuni|company|companies|\d{2,}\s?(%|\+)/i);
    }
    await page.goto("/sw/masoko");
    await expect(page.getByRole("note")).toContainText("haihakikishii wanunuzi, mauzo wala bei");
    await page.goto("/en/markets");
    await expect(page.getByRole("note")).toContainText("does not guarantee buyers, sales or prices");
  });

  test("no invented links: no 'view all markets'", async ({ page }) => {
    await page.goto("/sw/masoko");
    await expect(page.getByText("Tazama Masoko Yote")).toHaveCount(0);
    await expect(page.locator("section[aria-labelledby='mk-produce'] a")).toHaveCount(0);
  });

  test("closing banner (dark variant) leads to registration, both languages", async ({ page }) => {
    await page.goto("/sw/masoko");
    await expect(page.getByText("Tafuta Fursa za Soko kwa Mazao Yako")).toBeVisible();
    await expect(page.getByRole("main").getByRole("link", { name: "Jiunge na TDSP Sasa" })).toHaveAttribute("href", "/sw/join");
    await page.goto("/en/markets");
    await expect(page.getByRole("main").getByRole("link", { name: "Join TDSP Now" })).toHaveAttribute("href", "/en/join");
  });

  test("English is fully translated", async ({ page }) => {
    await page.goto("/en/markets");
    const t = await page.locator("main").innerText();
    for (const sw of ["Fursa za", "Mahindi", "Jinsi", "Sajili", "Tafuta", "Mbogamboga"]) expect(t).not.toContain(sw);
    await expect(page.getByText("Market Opportunities for Key Produce")).toBeVisible();
  });

  test("layout by width", async ({ page }) => {
    await page.goto("/sw/masoko");
    const w = width(page);
    const benefits = page.locator("section").first().locator("xpath=following::ul[1]/li");
    expect(new Set(await benefits.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)))).size).toBe(w >= 700 ? 4 : 2);
    expect(new Set(await lefts(page, "section[aria-labelledby='mk-produce'] li")).size).toBe(w >= 1200 ? 6 : w >= 560 ? 3 : 2);
    expect(new Set(await lefts(page, "section[aria-labelledby='mk-steps'] li")).size).toBe(w >= 1200 ? 4 : w >= 900 ? 2 : 1);
  });

  test("hero text clears the woman's face (sweep, both languages)", async ({ page }, info) => {
    test.skip(info.project.name !== "w1280" && width(page) >= 560, "sweep runs once");
    const widths = width(page) >= 560 ? [900, 1024, 1100, 1200, 1280, 1366, 1439, 1440, 1600, 1920] : [width(page)];
    for (const lang of ["sw", "en"]) for (const w of widths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto(`/${lang}/${lang === "sw" ? "masoko" : "markets"}`);
      const hero = page.locator("main section").first();
      const photoLeft = (await hero.locator("[role=img]").boundingBox())!.x;
      const rights = await hero.evaluate((sec) => ["h1", "p"].map((q) => { const el = sec.querySelector(q)!; const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right; }));
      const limit = w >= 560 ? photoLeft + 0.25 * (w - photoLeft) : w * 0.66;
      for (const r of rights) expect(r, `${lang} ${w}px`).toBeLessThanOrEqual(limit + 4);
    }
  });

  test("hero buttons fit: stacked on phones, side by side from 560px, never clipped", async ({ page }) => {
    await page.goto("/sw/masoko");
    const a = (await page.getByRole("link", { name: "Tafuta Soko la Mazao" }).boundingBox())!;
    const b = (await page.getByRole("link", { name: "Sajili Mahitaji Yako" }).boundingBox())!;
    expect(a.x + a.width).toBeLessThanOrEqual(width(page));
    expect(b.x + b.width).toBeLessThanOrEqual(width(page));
    if (width(page) < 560) expect(b.y).toBeGreaterThan(a.y + a.height - 1);
    else expect(Math.abs(a.y - b.y)).toBeLessThan(4);
  });

  test("no overflow; last content clears the bottom bar", async ({ page }) => {
    for (const p of ["/sw/masoko", "/en/markets"]) {
      await page.goto(p, { waitUntil: "load" });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    }
    test.skip(isDesktop(page), "no bottom bar on desktop");
    await expect.poll(async () => {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const barTop = (await page.getByRole("navigation", { name: "Bottom menu" }).boundingBox())!.y;
      const last = (await page.getByRole("contentinfo").locator("p").last().boundingBox())!;
      return last.y + last.height <= barTop + 1;
    }).toBe(true);
  });
});
