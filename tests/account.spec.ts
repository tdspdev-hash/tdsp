import { expect, test } from "@playwright/test";
import { isDesktop, width } from "./helpers";

const SW = "/sw/akaunti";
const EN = "/en/account";

test.describe("Akaunti (account landing)", () => {
  test("routes: both languages; other-language address redirects; switcher stays", async ({ page }) => {
    for (const [p, h] of [[SW, "Akaunti Yako ya TDSP"], [EN, "Your TDSP Account"]] as const) {
      expect((await page.goto(p))?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h);
    }
    for (const [from, to] of [["/sw/account", /\/sw\/akaunti$/], ["/en/akaunti", /\/en\/account$/]] as const) {
      await page.goto(from);
      await expect(page).toHaveURL(to);
    }
    await page.goto(SW);
    await page.getByRole("link", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/account$/);
  });

  test("hero text, buttons and four benefits (Kiswahili)", async ({ page }) => {
    await page.goto(SW);
    await expect(page.getByText("Ingia kwenye akaunti yako au jiunge na TDSP ili upate huduma, taarifa, fursa na ushirikiano wa karibu katika mnyororo wa thamani wa kilimo.")).toBeVisible();
    await expect(page.locator("main section").first().getByRole("link", { name: "Ingia kwenye Akaunti" })).toHaveAttribute("href", "/sw/login");
    await expect(page.locator("main section").first().getByRole("link", { name: "Jiunge na TDSP" })).toHaveAttribute("href", "/sw/join");
    await expect(page.locator("main ul").first().locator("h3")).toHaveText(["Huduma za TDSP", "Fursa na Miradi", "Taarifa Muhimu", "Ushirikiano"]);
    await expect(page.getByRole("heading", { level: 2, name: "Chagua Uendelee" })).toBeVisible();
  });

  test("the three cards lead to login, join and forgot-password", async ({ page }) => {
    for (const lang of ["sw", "en"] as const) {
      await page.goto(`/${lang}/${lang === "sw" ? "akaunti" : "account"}`);
      const cards = page.locator("section[aria-labelledby='ac-choose'] li");
      await expect(cards).toHaveCount(3);
      const hrefs = await cards.locator("a").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
      expect(hrefs).toEqual([`/${lang}/login`, `/${lang}/join`, `/${lang}/forgot-password`]);
    }
    await page.goto(SW);
    await page.locator("section[aria-labelledby='ac-choose']").getByRole("link", { name: "Rejesha Nenosiri" }).click();
    await expect(page).toHaveURL(/\/sw\/forgot-password$/);
  });

  test("English is fully translated; no company wording; no invented claims", async ({ page }) => {
    await page.goto(EN);
    const t = await page.locator("main").innerText();
    for (const sw of ["Akaunti", "Ingia", "Jiunge", "Huduma", "Chagua", "Nenosiri"]) expect(t).not.toContain(sw);
    expect(t).not.toMatch(/kampuni|compan|successfully|registered/i);
    await expect(page.getByRole("heading", { level: 2, name: "Choose How to Continue" })).toBeVisible();
    await expect(page.getByText("Don't have an account yet? Join TDSP and become part of our network.")).toBeVisible();
  });

  test("bottom bar Akaunti opens this page and is the active item; login/join keep it active", async ({ page }) => {
    test.skip(isDesktop(page), "bottom bar is phone/tablet only");
    await page.goto(SW);
    const nav = page.getByRole("navigation", { name: "Menyu ya chini" });
    await expect(nav.locator("[aria-current='page']")).toHaveText("Akaunti");
    for (const p of ["/sw/login", "/sw/join", "/sw/forgot-password"]) {
      await page.goto(p);
      await expect(nav.locator("[aria-current='page']")).toHaveText("Akaunti");
    }
    await page.goto("/sw");
    await nav.getByRole("link", { name: "Akaunti", exact: true }).click();
    await expect(page).toHaveURL(/\/sw\/akaunti$/);
  });

  test("header 'Ingia' opens the account landing page (which leads to login)", async ({ page }) => {
    test.skip(!isDesktop(page), "desktop header only");
    await page.goto(SW);
    await expect(page.getByRole("banner").getByRole("link", { name: "Ingia", exact: true })).toHaveAttribute("href", "/sw/akaunti");
  });

  test("layout: cards in one row from 900px, stacked below; no overflow; last card clears the bottom bar", async ({ page }) => {
    for (const p of [SW, EN]) {
      await page.goto(p, { waitUntil: "load" });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    }
    await page.goto(SW);
    const cards = page.locator("section[aria-labelledby='ac-choose'] li");
    const a = (await cards.nth(0).boundingBox())!;
    const b = (await cards.nth(1).boundingBox())!;
    if (width(page) >= 900) expect(Math.abs(a.y - b.y)).toBeLessThan(2);
    else expect(a.y + a.height).toBeLessThanOrEqual(b.y + 1);
    for (let i = 0; i < 3; i++) {
      const c = (await cards.nth(i).boundingBox())!;
      expect(c.x + c.width).toBeLessThanOrEqual(width(page));
    }
    test.skip(isDesktop(page), "no bottom bar on desktop");
    await expect.poll(async () => {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const barTop = (await page.getByRole("navigation", { name: "Menyu ya chini" }).boundingBox())!.y;
      const last = (await page.getByRole("contentinfo").locator("p").last().boundingBox())!;
      return last.y + last.height <= barTop + 1;
    }).toBe(true);
  });

  test("hero text stays left of the photo (sweep, both languages)", async ({ page }, info) => {
    test.skip(info.project.name !== "w1280", "sweep runs once");
    for (const w of [900, 1024, 1100, 1200, 1280, 1440, 1600, 1920]) {
      await page.setViewportSize({ width: w, height: 800 });
      for (const p of [SW, EN]) {
        await page.goto(p);
        const hero = page.locator("main section").first();
        const rights = await hero.evaluate((sec) => ["h1", "p"].map((q) => { const el = sec.querySelector(q)!; const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right; }));
        rights.forEach((r, i) => expect(r, `${p} ${w}px`).toBeLessThanOrEqual(w * (i === 0 ? 0.5 : 0.52) + 4));
      }
    }
  });
});

test.describe("navigation audit corrections", () => {
  test("footer reaches the main sections and the Document Centre in both languages (last link is labelled Akaunti / Account)", async ({ page }) => {
    for (const [p, hrefs] of [["/sw", ["/sw/about", "/sw/services", "/sw/uanachama", "/sw/miradi-na-andiko", "/sw/kituo-cha-nyaraka", "/sw/habari-na-fursa", "/sw/mawasiliano", "/sw/akaunti"]], ["/en", ["/en/about", "/en/services", "/en/membership", "/en/projects-and-proposals", "/en/document-centre", "/en/news-and-opportunities", "/en/contact", "/en/account"]]] as const) {
      await page.goto(p);
      const links = page.getByRole("contentinfo").getByRole("link");
      expect(await links.evaluateAll((els) => els.map((e) => e.getAttribute("href")))).toEqual(hrefs);
      await expect(links.last()).toHaveText(p === "/sw" ? "Akaunti" : "Account");
    }
  });

  test("Huduma page links to every service page and the Document Centre", async ({ page }) => {
    await page.goto("/sw/services");
    const hrefs = await page.locator("main ul a").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    for (const h of ["/sw/uanachama", "/sw/miradi-na-andiko", "/sw/financial-linkage", "/sw/masoko", "/sw/elimu-na-ujuzi", "/sw/farmers-value-chain", "/sw/watoa-huduma", "/sw/kituo-cha-nyaraka"]) expect(hrefs).toContain(h);
    for (const h of hrefs) expect((await page.goto(h!))?.status(), h!).toBe(200);
    await page.goto("/en/services");
    const en = await page.locator("main ul a").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    for (const h of ["/en/membership", "/en/markets", "/en/education-and-skills", "/en/service-providers", "/en/document-centre"]) expect(en).toContain(h);
  });
});
