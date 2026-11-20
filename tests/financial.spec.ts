import { expect, test } from "@playwright/test";
import { isDesktop, width } from "./helpers";

const lefts = (page: import("@playwright/test").Page, sel: string) =>
  page.locator(sel).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));

test.describe("Financial Linkage", () => {
  test("same address in both languages, translated title", async ({ page }) => {
    for (const [l, h1] of [["sw", "Uunganishaji wa Fedha"], ["en", "Financial Linkage"]] as const) {
      expect((await page.goto(`/${l}/financial-linkage`))?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
    }
    await page.goto("/sw/financial-linkage");
    await page.getByRole("link", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/financial-linkage$/);
  });

  test("the home card leads here", async ({ page }) => {
    await page.goto("/sw");
    await page.locator("section[aria-labelledby='services-title']").getByRole("link", { name: /Financial Linkage/ }).click();
    await expect(page).toHaveURL(/\/sw\/financial-linkage$/);
  });

  test("hero, four services and three topics", async ({ page }) => {
    await page.goto("/sw/financial-linkage");
    await expect(page.getByRole("navigation", { name: "Njia ya ukurasa" }).locator("[aria-current='page']")).toHaveText("Uunganishaji wa Fedha");
    await expect(page.locator("section[aria-labelledby='fl-services'] h3")).toHaveText(["Upatikanaji wa Mikopo", "Bima ya Kilimo", "Uwekezaji wa Kilimo", "Huduma za Kifedha"]);
    const cards = page.locator("section[aria-labelledby='fl-list'] li");
    await expect(cards).toHaveCount(3);
    await expect(cards.locator("h3")).toHaveText(["Mikopo ya Kilimo", "Uwekezaji katika Kilimo", "Bima ya Mazao na Mifugo"]);
    for (const img of await cards.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
      expect(await img.getAttribute("alt")).toBeTruthy();
    }
  });

  test("TDSP does not lend: the statement is shown and no loan offers, rates or fake statuses appear", async ({ page }) => {
    await page.goto("/sw/financial-linkage");
    await expect(page.getByRole("note")).toContainText("TDSP haihusiki na utoaji wa mikopo moja kwa moja");
    await expect(page.getByRole("note")).toContainText("Uamuzi wa kutoa au kutokutoa fedha unabaki kwa taasisi husika ya fedha");
    await page.goto("/en/financial-linkage");
    await expect(page.getByRole("note")).toContainText("TDSP does not directly provide loans");
    for (const p of ["/sw/financial-linkage", "/en/financial-linkage"]) {
      await page.goto(p);
      const t = await page.locator("main").innerText();
      expect(t, p).not.toMatch(/masharti nafuu|nafuu|favourable|low[- ]interest|\d+\s?%|riba|interest rate|Inaendelea|Ongoing|kampuni|company|TSh/i);
    }
  });

  test("no invented links: no 'view all' and no card arrows", async ({ page }) => {
    await page.goto("/sw/financial-linkage");
    await expect(page.getByText("Tazama Fursa Zote")).toHaveCount(0);
    await expect(page.locator("section[aria-labelledby='fl-list'] a")).toHaveCount(0);
  });

  test("both CTAs and the banner go to the existing contact page", async ({ page }) => {
    await page.goto("/sw/financial-linkage");
    await expect(page.getByRole("link", { name: "Wasiliana na Timu Yetu" })).toHaveAttribute("href", "/sw/mawasiliano");
    await expect(page.getByRole("link", { name: "Pata Ushauri wa Kifedha" })).toHaveAttribute("href", "/sw/mawasiliano");
    await page.goto("/en/financial-linkage");
    await page.getByRole("link", { name: "Contact Our Team" }).click();
    await expect(page).toHaveURL(/\/en\/contact$/);
  });

  test("English is fully translated", async ({ page }) => {
    await page.goto("/en/financial-linkage");
    const t = await page.locator("main").innerText();
    for (const sw of ["Huduma za Kifedha", "Mikopo ya", "Unganisha Biashara", "Jenga Uwezo", "Wasiliana"]) expect(t).not.toContain(sw);
    await expect(page.getByText("Funding and Finance Opportunities")).toBeVisible();
  });

  test("navigation: Huduma is highlighted on desktop", async ({ page }) => {
    test.skip(!isDesktop(page), "desktop header only");
    await page.goto("/sw/financial-linkage");
    await expect(page.locator("#site-nav [aria-current='page']")).toHaveText("Huduma");
  });

  test("layout by width", async ({ page }) => {
    await page.goto("/sw/financial-linkage");
    const w = width(page);
    expect(new Set(await lefts(page, "section[aria-labelledby='fl-services'] li")).size).toBe(w >= 1200 ? 4 : 2);
    expect(new Set(await lefts(page, "section[aria-labelledby='fl-list'] li")).size).toBe(w >= 1200 || (w >= 700 && w < 900) ? 3 : w >= 560 ? 2 : 1);
    const list = (await page.locator("section[aria-labelledby='fl-list']").boundingBox())!;
    const aside = (await page.locator("aside[aria-labelledby='fl-partner']").boundingBox())!;
    if (isDesktop(page)) expect(list.x + list.width).toBeLessThanOrEqual(aside.x + 1);
    else expect(list.y + list.height).toBeLessThanOrEqual(aside.y + 1);
  });

  test("hero text stays clear of the people (sweep, both languages)", async ({ page }, info) => {
    test.skip(info.project.name !== "w1280" && width(page) >= 560, "sweep runs once");
    const widths = width(page) >= 560 ? [900, 1024, 1100, 1200, 1280, 1366, 1439, 1440, 1600, 1920] : [width(page)];
    for (const lang of ["sw", "en"]) for (const w of widths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto(`/${lang}/financial-linkage`);
      const photoLeft = (await page.locator("main section").first().locator("[role=img]").boundingBox())!.x;
      const rights = await page.locator("main section").first().evaluate((sec) => ["h1", "p"].map((q) => { const el = sec.querySelector(q)!; const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right; }));
      const limit = w >= 1440 ? photoLeft - 24 : w >= 560 ? photoLeft + 0.1 * (w - photoLeft) : w * 0.5;
      for (const r of rights) expect(r, `${lang} ${w}px`).toBeLessThanOrEqual(limit + 4);
    }
  });

  test("phones: the long title word clears the photo (360-430px)", async ({ page }) => {
    test.skip(width(page) >= 560, "phones only");
    for (const p of ["/sw/financial-linkage", "/en/financial-linkage"]) {
      await page.goto(p);
      const hero = page.locator("main section").first();
      const photoLeft = (await hero.locator("[role=img]").boundingBox())!.x;
      const right = await hero.locator("h1").evaluate((el) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right; });
      expect(right, p).toBeLessThanOrEqual(photoLeft + 0.04 * width(page));
    }
  });

  test("no overflow; last content clears the bottom bar", async ({ page }) => {
    for (const p of ["/sw/financial-linkage", "/en/financial-linkage"]) {
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
