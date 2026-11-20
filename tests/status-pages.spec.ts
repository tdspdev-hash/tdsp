import { expect, test } from "@playwright/test";
import { isDesktop, width } from "./helpers";

// Public sections of the TDSP guide that are not built yet.
const COMING_SOON = ["coming-soon"];

test.describe("Coming Soon", () => {
  for (const route of COMING_SOON) {
    test(`/sw/${route} shows the Coming Soon page`, async ({ page }) => {
      const res = await page.goto(`/sw/${route}`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Inakuja Hivi Karibuni");
    });
  }

  test("Kiswahili content, three feature cards and a working home button", async ({ page }) => {
    await page.goto("/sw/coming-soon");
    await expect(page.getByText("Coming Soon", { exact: true })).toBeVisible();
    await expect(page.getByText("Tunaifanyia kazi sehemu hii ili kukuletea huduma bora zaidi. Tafadhali rudi tena hivi karibuni.")).toBeVisible();
    for (const t of ["Huduma Mpya", "Uboreshaji", "Taarifa"]) await expect(page.getByText(t, { exact: true })).toBeVisible();
    await expect(page.locator("section[aria-labelledby='status-title'] ul li svg")).toHaveCount(3);
    await page.getByRole("main").getByRole("link", { name: "Rudi Mwanzo" }).click();
    await expect(page).toHaveURL(/\/sw$/);
  });

  test("English version is fully translated", async ({ page }) => {
    await page.goto("/en/coming-soon");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("We're Launching Soon");
    await expect(page.getByRole("main").getByRole("link", { name: "Back Home" })).toHaveAttribute("href", "/en");
    await expect(page.getByText("Huduma Mpya")).toHaveCount(0);
  });

  test("the page title names the section", async ({ page }) => {
    await page.goto("/sw/mawasiliano");
    await expect(page).toHaveTitle(/Mawasiliano/);
    await page.goto("/en/news-and-opportunities");
    await expect(page).toHaveTitle(/News & Opportunities/);
  });

  test("breadcrumb strip is a phone/tablet element; its home link works", async ({ page }) => {
    await page.goto("/sw/coming-soon");
    const crumb = page.getByRole("navigation", { name: "Njia ya ukurasa" });
    if (isDesktop(page)) await expect(crumb).toBeHidden();
    else {
      await expect(crumb.getByRole("link", { name: "Karibu TDSP" })).toHaveAttribute("href", "/sw");
      await expect(crumb.locator("[aria-current='page']")).toHaveText("Inakuja Hivi Karibuni");
    }
  });

  test("layout: card is two columns on desktop, one column below 900px", async ({ page }) => {
    await page.goto("/sw/coming-soon");
    const art = (await page.getByRole("img", { name: /Kompyuta/ }).boundingBox())!;
    const title = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
    if (isDesktop(page)) expect(art.x + art.width).toBeLessThanOrEqual(title.x);
    else expect(art.y + art.height).toBeLessThanOrEqual(title.y);
    const cols = new Set(await page.locator("section[aria-labelledby='status-title'] ul li").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)))).size;
    expect(cols).toBe(isDesktop(page) ? 3 : 1);
  });

  test("the card sits fully on the screen and the photo starts under the header", async ({ page }) => {
    await page.goto("/sw/coming-soon");
    const card = (await page.locator("section[aria-labelledby='status-title']").boundingBox())!;
    expect(card.x).toBeGreaterThanOrEqual(0);
    expect(card.x + card.width).toBeLessThanOrEqual(width(page));
    if (isDesktop(page)) {
      const header = (await page.getByRole("banner").boundingBox())!;
      const photo = (await page.locator("main > div > div").first().boundingBox())!;
      expect(Math.abs(photo.y - (header.y + header.height))).toBeLessThanOrEqual(2); // no white gap
    }
  });
});

test.describe("404 page", () => {
  for (const path of ["/sw/does-not-exist", "/en/a/b/c", "/sw/about/nope", "/fr/x", "/zzz"]) {
    test(`${path} returns HTTP 404 and the custom page`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Ukurasa haujapatikana|Page not found/);
      await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", /noindex/);
    });
  }

  test("Kiswahili content and the home button", async ({ page }) => {
    await page.goto("/sw/nope");
    await expect(page.getByText("Samahani, ukurasa unaoutafuta haupo, umehamishwa au umeondolewa.")).toBeVisible();
    await page.getByRole("main").getByRole("link", { name: "Rudi Mwanzo" }).click();
    await expect(page).toHaveURL(/\/sw$/);
  });

  test("English 404 is translated and keeps the English language", async ({ page }) => {
    await page.goto("/en/nope");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
    await expect(page.getByRole("main").getByRole("link", { name: "Back Home" })).toHaveAttribute("href", "/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("desktop shows four working links; phones show three tips (one is advice only)", async ({ page }) => {
    await page.goto("/sw/nope");
    if (isDesktop(page)) {
      const links = page.getByText("Unaweza pia kujaribu:").locator("xpath=..").getByRole("link");
      await expect(links).toHaveCount(4);
      const hrefs = await links.evaluateAll((els) => els.map((e) => e.getAttribute("href")));
      expect(hrefs).toEqual(["/sw/services", "/sw/habari-na-fursa#fursa", "/sw/habari-na-fursa", "/sw/mawasiliano"]);
      await links.nth(3).click();
      await expect(page).toHaveURL(/\/sw\/mawasiliano$/);
    } else {
      await expect(page.getByText("Unaweza pia kujaribu:")).toBeHidden();
      await expect(page.getByText("Angalia kiungo ulichobofya")).toBeVisible();
      await expect(page.getByRole("link", { name: "Angalia kiungo ulichobofya" })).toHaveCount(0); // advice, not a fake button
      await page.getByRole("link", { name: "Wasiliana nasi ukihitaji msaada" }).click();
      await expect(page).toHaveURL(/\/sw\/mawasiliano$/);
    }
  });

  test("the language switcher works on the 404 page", async ({ page }) => {
    await page.goto("/sw/nope");
    await page.getByRole("link", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/nope$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  });

  test("keyboard focus is visible on the home button", async ({ page }) => {
    await page.goto("/sw/nope");
    const btn = page.getByRole("main").getByRole("link", { name: "Rudi Mwanzo" });
    await btn.focus();
    expect(await btn.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe("none");
  });
});

test.describe("fixed bottom bar never hides content", () => {
  test.beforeEach(({ page }) => {
    test.skip(isDesktop(page), "no bottom bar on desktop");
  });

  const bar = (page: import("@playwright/test").Page) =>
    page.getByRole("navigation", { name: "Menyu ya chini" });

  test("Coming Soon: every feature card can be scrolled fully above the bar", async ({ page }) => {
    await page.goto("/sw/coming-soon");
    const cards = page.locator("section[aria-labelledby='status-title'] ul li");
    await expect(cards).toHaveCount(3);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const barTop = (await bar(page).boundingBox())!.y;
    for (let i = 0; i < 3; i++) {
      const b = (await cards.nth(i).boundingBox())!;
      expect(b.y + b.height, `card ${i} bottom vs bar top`).toBeLessThanOrEqual(barTop);
    }
    const last = (await page.getByRole("contentinfo").locator("p").last().boundingBox())!;
    expect(last.y + last.height, "footer end vs bar").toBeLessThanOrEqual(barTop + 1);
  });

  test("Coming Soon: each card is reachable (scrolls to a spot clear of the bar)", async ({ page }) => {
    await page.goto("/en/coming-soon");
    const cards = page.locator("section[aria-labelledby='status-title'] ul li");
    const barTop = (await page.getByRole("navigation", { name: "Bottom menu" }).boundingBox())!.y;
    for (let i = 0; i < 3; i++) {
      await cards.nth(i).evaluate((el) => el.scrollIntoView({ block: "center" }));
      const b = (await cards.nth(i).boundingBox())!;
      expect(b.y).toBeGreaterThanOrEqual(0);
      expect(b.y + b.height, `card ${i}`).toBeLessThanOrEqual(barTop);
    }
  });

  test("404: the last tip row and the footer end clear the bar", async ({ page }) => {
    await page.goto("/sw/nope", { waitUntil: "load" });
    const tips = page.locator("section[aria-labelledby='status-title'] ul").last().locator("li");
    // Re-scroll on every attempt: the page height can still change while fonts and images settle.
    await expect
      .poll(async () => {
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        const barTop = (await bar(page).boundingBox())!.y;
        const lastTip = (await tips.last().boundingBox())!;
        const last = (await page.getByRole("contentinfo").locator("p").last().boundingBox())!;
        return lastTip.y + lastTip.height <= barTop && last.y + last.height <= barTop + 1;
      })
      .toBe(true);
  });
});
