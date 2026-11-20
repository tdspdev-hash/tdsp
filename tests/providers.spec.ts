import { expect, test } from "@playwright/test";
import { isDesktop, width } from "./helpers";

const lefts = (page: import("@playwright/test").Page, sel: string) =>
  page.locator(sel).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));

test.describe("Watoa Huduma", () => {
  test("routes: /sw/watoa-huduma and /en/service-providers; other addresses redirect", async ({ page }) => {
    for (const [p, h1] of [["/sw/watoa-huduma", "Watoa Huduma"], ["/en/service-providers", "Service Providers"]] as const) {
      expect((await page.goto(p))?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
    }
    for (const [from, to] of [["/sw/service-providers", /\/sw\/watoa-huduma$/], ["/en/watoa-huduma", /\/en\/service-providers$/], ["/sw/providers", /\/sw\/watoa-huduma$/], ["/en/providers", /\/en\/service-providers$/]] as const) {
      await page.goto(from);
      await expect(page).toHaveURL(to);
    }
    await page.goto("/sw/watoa-huduma");
    await page.getByRole("link", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/service-providers$/);
  });

  test("the home card leads here (both languages)", async ({ page }) => {
    await page.goto("/sw");
    await page.locator("section[aria-labelledby='services-title']").getByRole("link", { name: /Watoa Huduma/ }).click();
    await expect(page).toHaveURL(/\/sw\/watoa-huduma$/);
    await page.goto("/en");
    await page.locator("section[aria-labelledby='services-title']").getByRole("link", { name: /Service Providers/ }).click();
    await expect(page).toHaveURL(/\/en\/service-providers$/);
  });

  test("hero, breadcrumb and buttons with honest destinations", async ({ page }) => {
    await page.goto("/sw/watoa-huduma");
    await expect(page.getByText("Kuunganisha wakulima na vikundi vya kilimo na watoa huduma mbalimbali wanaosaidia shughuli za kilimo katika mnyororo wa thamani.")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Njia ya ukurasa" }).locator("[aria-current='page']")).toHaveText("Watoa Huduma");
    await expect(page.getByRole("link", { name: "Aina za Huduma" }).first()).toHaveAttribute("href", "#sp-categories");
    await expect(page.getByRole("link", { name: "Pata Taarifa", exact: true })).toHaveAttribute("href", "/sw/mawasiliano");
    await page.goto("/en/service-providers");
    await expect(page.getByRole("link", { name: "Get Information", exact: true })).toHaveAttribute("href", "/en/contact");
  });

  test("four benefits, six service types, notice and four steps (in order)", async ({ page }) => {
    await page.goto("/sw/watoa-huduma");
    await expect(page.locator("main ul").first().locator("h3")).toHaveText(["Huduma Muhimu", "Utaalamu", "Ushirikiano", "Mnyororo wa Thamani"]);
    const cards = page.locator("section[aria-labelledby='sp-categories-title'] li");
    await expect(cards.locator("h3")).toHaveText(["Pembejeo na Vifaa", "Zana na Mitambo", "Ushauri wa Kilimo", "Usafirishaji", "Uhifadhi", "Uchakataji wa Mazao"]);
    for (const img of await cards.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
      expect(await img.getAttribute("alt")).toBeTruthy();
    }
    await expect(page.getByRole("note")).toContainText("zitatangazwa baada ya uthibitisho na TDSP");
    await expect(page.locator("section[aria-labelledby='sp-steps'] h3")).toHaveText(["1. Tambua Hitaji", "2. Tafuta Aina ya Huduma", "3. Wasiliana kupitia TDSP", "4. Fuatilia Makubaliano"]);
    await page.goto("/en/service-providers");
    await expect(page.getByRole("note")).toContainText("announced after verification by TDSP");
  });

  test("no invented provider facts: no names, contacts, prices, ratings, counts or verified badges", async ({ page }) => {
    for (const p of ["/sw/watoa-huduma", "/en/service-providers"]) {
      await page.goto(p);
      const t = await page.locator("main").evaluate((m) => { const c = m.cloneNode(true) as HTMLElement; c.querySelectorAll("[role=note]").forEach((n) => n.remove()); return c.innerText; });
      expect(t, p).not.toMatch(/rating|stars|nyota|bei\b|price|TSh|\+255|@|namba ya|hakika|uhakika|guarantee|kampuni|compan|\d{2,}/i);
    }
    await page.goto("/sw/watoa-huduma");
    await expect(page.getByText("Tazama Watoa Huduma Wote")).toHaveCount(0);
    await expect(page.locator("section[aria-labelledby='sp-categories-title'] a")).toHaveCount(0);
  });

  test("banner button goes to the existing contact page", async ({ page }) => {
    await page.goto("/sw/watoa-huduma");
    await expect(page.getByRole("link", { name: "Pata Taarifa za Watoa Huduma" })).toHaveAttribute("href", "/sw/mawasiliano");
    await page.goto("/en/service-providers");
    await page.getByRole("link", { name: "Get Service Provider Information" }).click();
    await expect(page).toHaveURL(/\/en\/contact$/);
  });

  test("English is fully translated", async ({ page }) => {
    await page.goto("/en/service-providers");
    const t = await page.locator("main").innerText();
    for (const sw of ["Huduma", "Pembejeo", "Jinsi", "Tambua", "Kumbuka", "Pata Taarifa", "Aina za"]) expect(t).not.toContain(sw);
    await expect(page.getByText("How the Partnership Works")).toBeVisible();
  });

  test("navigation: Huduma highlighted on desktop", async ({ page }) => {
    test.skip(!isDesktop(page), "desktop header only");
    await page.goto("/sw/watoa-huduma");
    await expect(page.locator("#site-nav [aria-current='page']")).toHaveText("Huduma");
  });

  test("layout by width: benefits, cards (equal height per row), steps", async ({ page }) => {
    await page.goto("/sw/watoa-huduma");
    const w = width(page);
    const ben = page.locator("section").first().locator("xpath=following::ul[1]/li");
    expect(new Set(await ben.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)))).size).toBe(w >= 700 ? 4 : 2);
    expect(new Set(await lefts(page, "section[aria-labelledby='sp-categories-title'] li")).size).toBe(w >= 1200 ? 6 : w >= 900 ? 3 : 2);
    const boxes = await page.locator("section[aria-labelledby='sp-categories-title'] li").evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return { top: Math.round(r.top), h: Math.round(r.height) }; }));
    const rows = new Map<number, number[]>();
    for (const b of boxes) rows.set(b.top, [...(rows.get(b.top) ?? []), b.h]);
    for (const [top, hs] of rows) expect(Math.max(...hs) - Math.min(...hs), `row at ${top}`).toBeLessThanOrEqual(2);
    expect(new Set(await lefts(page, "section[aria-labelledby='sp-steps'] li")).size).toBe(w >= 1200 ? 4 : w >= 900 ? 2 : 1);
  });

  test("hero text clears the faces (sweep, both languages)", async ({ page }, info) => {
    test.skip(info.project.name !== "w1280" && width(page) >= 560, "sweep runs once");
    const widths = width(page) >= 560 ? [900, 1024, 1100, 1200, 1280, 1366, 1439, 1440, 1600, 1920] : [width(page)];
    for (const lang of ["sw", "en"]) for (const w of widths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto(`/${lang}/${lang === "sw" ? "watoa-huduma" : "service-providers"}`);
      const hero = page.locator("main section").first();
      const photoLeft = (await hero.locator("[role=img]").boundingBox())!.x;
      const rights = await hero.evaluate((sec) => ["h1", "p"].map((q) => { const el = sec.querySelector(q)!; const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right; }));
      const limit = w >= 560 ? photoLeft + 0.25 * (w - photoLeft) : w * 0.62;
      for (const r of rights) expect(r, `${lang} ${w}px`).toBeLessThanOrEqual(limit + 4);
    }
  });

  test("hero buttons are not clipped; stacked on phones", async ({ page }) => {
    await page.goto("/en/service-providers");
    const a = (await page.getByRole("link", { name: "Service Types" }).first().boundingBox())!;
    const b = (await page.getByRole("link", { name: "Get Information", exact: true }).boundingBox())!;
    for (const x of [a, b]) expect(x.x + x.width).toBeLessThanOrEqual(width(page));
    if (width(page) < 560) expect(b.y).toBeGreaterThan(a.y + a.height - 1);
  });

  test("no overflow; last content clears the bottom bar", async ({ page }) => {
    for (const p of ["/sw/watoa-huduma", "/en/service-providers"]) {
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
