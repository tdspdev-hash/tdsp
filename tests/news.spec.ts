import { expect, test } from "@playwright/test";
import { newsItems, opportunityItems } from "../lib/news";
import { isDesktop, width } from "./helpers";

const SW = "/sw/habari-na-fursa";
const EN = "/en/news-and-opportunities";

test.describe("Habari & Fursa (one combined page)", () => {
  test("routes: both languages; old addresses redirect; switcher stays", async ({ page }) => {
    for (const [p, h] of [[SW, "Habari & Fursa"], [EN, "News & Opportunities"]] as const) {
      expect((await page.goto(p))?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h);
    }
    for (const [from, to] of [["/sw/news", /\/sw\/habari-na-fursa$/], ["/en/news", /\/en\/news-and-opportunities$/], ["/sw/opportunities", /\/sw\/habari-na-fursa#fursa$/], ["/en/habari-na-fursa", /\/en\/news-and-opportunities$/], ["/sw/news-and-opportunities", /\/sw\/habari-na-fursa$/]] as const) {
      await page.goto(from);
      await expect(page).toHaveURL(to);
    }
    await page.goto(SW);
    await page.getByRole("link", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/news-and-opportunities$/);
  });

  test("the data lists are empty until TDSP approves real records", () => {
    expect(newsItems).toEqual([]);
    expect(opportunityItems).toEqual([]);
  });

  test("hero buttons, four benefits and both sections exist", async ({ page }) => {
    await page.goto(SW);
    await expect(page.getByRole("link", { name: "Pata Taarifa Mpya" })).toHaveAttribute("href", "#habari");
    await expect(page.getByRole("link", { name: "Tazama Fursa" })).toHaveAttribute("href", "#fursa");
    await expect(page.locator("main ul").first().locator("h3")).toHaveText(["Habari Zinazoaminika", "Fursa za Maendeleo", "Taarifa kwa Wakulima", "Kaa Ulihabarika"]);
    await expect(page.getByRole("heading", { level: 2, name: "Habari Mpya" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Fursa Mpya" })).toBeVisible();
  });

  test("tabs scroll to their sections and mark the current one", async ({ page }) => {
    await page.goto(SW);
    const tabs = page.getByRole("navigation", { name: "Sehemu za ukurasa" });
    await expect(tabs.locator("[aria-current='true']")).toHaveText("Habari");
    await tabs.getByRole("link", { name: "Fursa" }).click();
    await expect(page).toHaveURL(/#fursa$/);
    await expect(tabs.locator("[aria-current='true']")).toHaveText("Fursa");
    await expect(page.locator("#fursa")).toBeInViewport();
    await tabs.getByRole("link", { name: "Habari" }).click();
    await expect(page.locator("#habari")).toBeInViewport();
  });

  test("empty states are honest; nothing from the mockup is invented", async ({ page }) => {
    for (const [p, news, opp] of [[SW, "Hakuna habari zilizochapishwa bado.", "Hakuna fursa zilizochapishwa bado."], [EN, "No news has been published yet.", "No opportunities have been published yet."]] as const) {
      await page.goto(p);
      await expect(page.locator("#habari").getByRole("status")).toContainText(news);
      await expect(page.locator("#fursa").getByRole("status")).toContainText(opp);
      const t = await page.locator("main").innerText();
      expect(t, p).not.toMatch(/Nov 2026|Oct 2026|TBA|Mwisho:|Deadline:|Soma Zaidi|Read More|Angalia Maelezo|Yaendelea Kuwajengea|Maendeleo ya Miradi ya Thamani|Jukwaa la Kilimo/);
      await expect(page.locator("main a[href^='http']")).toHaveCount(0);
    }
    await page.goto(SW);
    await expect(page.locator("#fursa")).toContainText("TDSP haidhamini ufadhili, ajira au nafasi");
  });

  test("newsletter validates but never claims a subscription", async ({ page }) => {
    await page.goto(SW);
    const form = page.locator("form").last();
    await form.getByRole("button", { name: "Jiunge Sasa" }).click();
    await expect(page.getByText("Tafadhali andika barua pepe.")).toBeVisible();
    await form.getByRole("textbox").fill("nope");
    await form.getByRole("button", { name: "Jiunge Sasa" }).click();
    await expect(page.getByText("Barua pepe si sahihi.")).toBeVisible();
    await form.getByRole("textbox").fill("test@example.com");
    await form.getByRole("button", { name: "Jiunge Sasa" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Hujajiunga bado" })).toContainText("haijahifadhiwa");
    await expect(page.getByText(/umejiunga|successfully subscribed|asante/i)).toHaveCount(0);
  });

  test("English is fully translated; no company wording", async ({ page }) => {
    await page.goto(EN);
    const t = await page.locator("main").innerText();
    for (const sw of ["Habari", "Fursa", "Jiunge", "Tazama", "Mwisho"]) expect(t).not.toContain(sw);
    expect(t).not.toMatch(/kampuni|compan/i);
  });

  test("navigation: desktop header and bottom bar highlight this page", async ({ page }) => {
    await page.goto(SW);
    if (isDesktop(page)) await expect(page.locator("#site-nav [aria-current='page']")).toHaveText("Habari & Fursa");
    else await expect(page.getByRole("navigation", { name: "Menyu ya chini" }).locator("[aria-current='page']")).toHaveText("Habari");
  });

  test("layout: sections stack on phones, side by side from 900px; no overflow", async ({ page }) => {
    for (const p of [SW, EN]) {
      await page.goto(p, { waitUntil: "load" });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    }
    await page.goto(SW);
    const a = (await page.locator("#habari").boundingBox())!;
    const b = (await page.locator("#fursa").boundingBox())!;
    if (width(page) >= 900) expect(a.x + a.width).toBeLessThanOrEqual(b.x + 1);
    else expect(a.y + a.height).toBeLessThanOrEqual(b.y + 1);
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
