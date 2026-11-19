import { expect, test } from "@playwright/test";
import { isDesktop, width } from "./helpers";

const lefts = (page: import("@playwright/test").Page, sel: string) =>
  page.locator(sel).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));

test.describe("Elimu & Ujuzi", () => {
  test("routes: /sw/elimu-na-ujuzi and /en/education-and-skills; other addresses redirect", async ({ page }) => {
    for (const [p, h1] of [["/sw/elimu-na-ujuzi", "Elimu & Ujuzi"], ["/en/education-and-skills", "Education & Skills"]] as const) {
      expect((await page.goto(p))?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
    }
    for (const [from, to] of [["/sw/education-and-skills", /\/sw\/elimu-na-ujuzi$/], ["/en/elimu-na-ujuzi", /\/en\/education-and-skills$/], ["/sw/training", /\/sw\/elimu-na-ujuzi$/], ["/en/training", /\/en\/education-and-skills$/]] as const) {
      await page.goto(from);
      await expect(page).toHaveURL(to);
    }
    await page.goto("/sw/elimu-na-ujuzi");
    await page.getByRole("link", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/education-and-skills$/);
  });

  test("the home card leads here (both languages)", async ({ page }) => {
    await page.goto("/sw");
    await page.locator("section[aria-labelledby='services-title']").getByRole("link", { name: /Elimu/ }).click();
    await expect(page).toHaveURL(/\/sw\/elimu-na-ujuzi$/);
    await page.goto("/en");
    await page.locator("section[aria-labelledby='services-title']").getByRole("link", { name: /Education/ }).click();
    await expect(page).toHaveURL(/\/en\/education-and-skills$/);
  });

  test("hero, breadcrumb and buttons with honest destinations", async ({ page }) => {
    await page.goto("/sw/elimu-na-ujuzi");
    await expect(page.getByText("Kujenga ujuzi, maarifa na uwezo wa wakulima, vikundi na wanachama ili kuongeza tija, ubora na thamani ya mazao katika mnyororo wa thamani.")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Njia ya ukurasa" }).locator("[aria-current='page']")).toHaveText("Elimu & Ujuzi");
    await expect(page.getByRole("link", { name: "Tazama Mafunzo" })).toHaveAttribute("href", "#el-fields");
    await expect(page.getByRole("link", { name: "Omba Mafunzo" })).toHaveAttribute("href", "/sw/mawasiliano");
    await page.getByRole("link", { name: "Tazama Mafunzo" }).click();
    await expect(page).toHaveURL(/#el-fields$/);
    await page.goto("/en/education-and-skills");
    await expect(page.getByRole("link", { name: "Request Training" })).toHaveAttribute("href", "/en/contact");
  });

  test("four benefits and six topics, in order, with images and icons", async ({ page }) => {
    await page.goto("/sw/elimu-na-ujuzi");
    await expect(page.locator("main ul").first().locator("h3")).toHaveText(["Maarifa ya Vitendo", "Uimarishaji wa Vikundi", "Tija na Ubora", "Thamani na Mapato"]);
    const cards = page.locator("section[aria-labelledby='el-fields-title'] li");
    await expect(cards.locator("h3")).toHaveText(["Uzalishaji Bora", "Usimamizi wa Mazao", "Uvunaji na Uhifadhi", "Uongezaji Thamani", "Masoko na Biashara", "Uongozi na Usimamizi"]);
    for (const img of await cards.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
      expect(await img.getAttribute("alt")).toBeTruthy();
    }
    await expect(cards.locator("svg")).toHaveCount(6);
  });

  test("no invented training facts: no dates, venues, fees, certificates, numbers; topics are labelled as suggestions", async ({ page }) => {
    for (const p of ["/sw/elimu-na-ujuzi", "/en/education-and-skills"]) {
      await page.goto(p);
      const t = await page.locator("main").evaluate((m) => { const c = m.cloneNode(true) as HTMLElement; c.querySelectorAll("[role=note]").forEach((n) => n.remove()); return c.innerText; });
      expect(t, p).not.toMatch(/cheti|vyeti|certificate|diploma|ada ya|fee\b|TSh|yajayo|upcoming|kampuni|compan|\d{2,}\s?(%|\+|wakulima|farmers)/i);
    }
    await page.goto("/sw/elimu-na-ujuzi");
    await expect(page.getByRole("note")).toContainText("si ratiba ya mafunzo");
    await page.goto("/en/education-and-skills");
    await expect(page.getByRole("note")).toContainText("not a training schedule");
  });

  test("no invented links; banner button goes to the existing contact page", async ({ page }) => {
    await page.goto("/sw/elimu-na-ujuzi");
    await expect(page.locator("section[aria-labelledby='el-fields-title'] a")).toHaveCount(0);
    await expect(page.getByText("Jiunge na Mafunzo yetu")).toBeVisible();
    await expect(page.getByRole("link", { name: "Pata Taarifa za Mafunzo" })).toHaveAttribute("href", "/sw/mawasiliano");
    await page.goto("/en/education-and-skills");
    await page.getByRole("link", { name: "Get Training Information" }).click();
    await expect(page).toHaveURL(/\/en\/contact$/);
  });

  test("English is fully translated", async ({ page }) => {
    await page.goto("/en/education-and-skills");
    const t = await page.locator("main").innerText();
    for (const sw of ["Mafunzo", "Uzalishaji", "Mada za", "Jiunge", "Maarifa", "Tazama", "Omba"]) expect(t).not.toContain(sw);
    await expect(page.getByText("Training and Skills Topics")).toBeVisible();
  });

  test("navigation: Huduma highlighted on desktop", async ({ page }) => {
    test.skip(!isDesktop(page), "desktop header only");
    await page.goto("/sw/elimu-na-ujuzi");
    await expect(page.locator("#site-nav [aria-current='page']")).toHaveText("Huduma");
  });

  test("layout by width: benefits and topic cards", async ({ page }) => {
    await page.goto("/sw/elimu-na-ujuzi");
    const w = width(page);
    const ben = page.locator("section").first().locator("xpath=following::ul[1]/li");
    expect(new Set(await ben.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)))).size).toBe(w >= 700 ? 4 : 2);
    expect(new Set(await lefts(page, "section[aria-labelledby='el-fields-title'] li")).size).toBe(w >= 1200 ? 6 : w >= 900 ? 3 : 2);
    // cards in the same row must be the same height
    const boxes = await page.locator("section[aria-labelledby='el-fields-title'] li").evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return { top: Math.round(r.top), h: Math.round(r.height) }; }));
    const rows = new Map<number, number[]>();
    for (const b of boxes) rows.set(b.top, [...(rows.get(b.top) ?? []), b.h]);
    for (const [top, hs] of rows) expect(Math.max(...hs) - Math.min(...hs), `row at ${top}`).toBeLessThanOrEqual(2);
  });

  test("hero text clears the faces (sweep, both languages)", async ({ page }, info) => {
    test.skip(info.project.name !== "w1280" && width(page) >= 560, "sweep runs once");
    const widths = width(page) >= 560 ? [900, 1024, 1100, 1200, 1280, 1366, 1439, 1440, 1600, 1920] : [width(page)];
    for (const lang of ["sw", "en"]) for (const w of widths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto(`/${lang}/${lang === "sw" ? "elimu-na-ujuzi" : "education-and-skills"}`);
      const hero = page.locator("main section").first();
      const photoLeft = (await hero.locator("[role=img]").boundingBox())!.x;
      const rights = await hero.evaluate((sec) => ["h1", "p"].map((q) => { const el = sec.querySelector(q)!; const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right; }));
      const limit = w >= 560 ? photoLeft + 0.25 * (w - photoLeft) : w * 0.62;
      for (const r of rights) expect(r, `${lang} ${w}px`).toBeLessThanOrEqual(limit + 4);
    }
  });

  test("hero buttons are not clipped; stacked on phones", async ({ page }) => {
    await page.goto("/en/education-and-skills");
    const a = (await page.getByRole("link", { name: "View Training" }).boundingBox())!;
    const b = (await page.getByRole("link", { name: "Request Training" }).boundingBox())!;
    for (const x of [a, b]) expect(x.x + x.width).toBeLessThanOrEqual(width(page));
    if (width(page) < 560) expect(b.y).toBeGreaterThan(a.y + a.height - 1);
  });

  test("no overflow; last content clears the bottom bar", async ({ page }) => {
    for (const p of ["/sw/elimu-na-ujuzi", "/en/education-and-skills"]) {
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
