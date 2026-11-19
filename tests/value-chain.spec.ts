import { expect, test } from "@playwright/test";
import { isDesktop, width } from "./helpers";

const lefts = (page: import("@playwright/test").Page, sel: string) =>
  page.locator(sel).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));

test.describe("Farmers Value Chain", () => {
  test("both language routes load with the same address", async ({ page }) => {
    for (const lang of ["sw", "en"]) {
      const res = await page.goto(`/${lang}/farmers-value-chain`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Farmers Value Chain");
    }
  });

  test("language switcher stays on the page", async ({ page }) => {
    await page.goto("/sw/farmers-value-chain");
    await page.getByRole("link", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/farmers-value-chain$/);
    await expect(page.getByText("Connecting farmers to markets, adding value to agricultural produce and increasing farmers' incomes.")).toBeVisible();
  });

  test("hero: breadcrumb and description (both languages)", async ({ page }) => {
    await page.goto("/sw/farmers-value-chain");
    const crumb = page.getByRole("navigation", { name: "Njia ya ukurasa" });
    await expect(crumb.getByRole("link", { name: "Karibu TDSP" })).toHaveAttribute("href", "/sw");
    await expect(crumb.locator("[aria-current='page']")).toHaveText("Farmers Value Chain");
    await expect(page.getByText("Kuunganisha mkulima na masoko, kuongeza thamani ya mazao na kuongeza kipato cha wakulima.")).toBeVisible();
    await page.goto("/en/farmers-value-chain");
    await expect(page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Welcome to TDSP" })).toBeVisible();
  });

  test("the four stages and the emblem are real images and text", async ({ page }) => {
    await page.goto("/sw/farmers-value-chain");
    const fig = page.getByRole("figure", { name: "Hatua nne za mnyororo wa thamani" });
    await expect(fig.locator("img")).toHaveCount(4);
    for (const t of ["Uzalishaji", "Uchakataji na Ongezeko la Thamani", "Masoko na Wanunuzi", "Usafirishaji na Usambazaji", "TDSP Value Chain"])
      await expect(fig.getByText(t, { exact: true })).toBeVisible();
    for (const img of await fig.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
      expect(await img.getAttribute("alt")).toBeTruthy();
    }
  });

  test("diagram labels stay inside their photos and are readable", async ({ page }) => {
    await page.goto("/sw/farmers-value-chain");
    const cards = page.getByRole("figure").locator("> div").filter({ has: page.locator("img") });
    for (let i = 0; i < 4; i++) {
      const card = (await cards.nth(i).boundingBox())!;
      const label = (await cards.nth(i).locator("span").first().boundingBox())!;
      expect(label.x).toBeGreaterThanOrEqual(card.x - 1);
      expect(label.x + label.width).toBeLessThanOrEqual(card.x + card.width + 1);
      expect(label.y + label.height).toBeLessThanOrEqual(card.y + card.height + 1);
    }
    const fs = await page.getByRole("figure").locator("img").first().locator("xpath=following-sibling::span").evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
    expect(fs).toBeGreaterThanOrEqual(9.5);
  });

  test("about block and the Learn more link lead to a real page", async ({ page }) => {
    await page.goto("/sw/farmers-value-chain");
    await expect(page.getByText("Kuhusu Value Chain", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "TDSP Farmers Value Chain" })).toBeVisible();
    const more = page.getByRole("link", { name: "Jifunze Zaidi" });
    await expect(more).toHaveAttribute("href", "/sw/services");
    await more.click();
    await expect(page).toHaveURL(/\/sw\/services$/);
  });

  test("four benefits in order, both languages", async ({ page }) => {
    await page.goto("/sw/farmers-value-chain");
    await expect(page.getByRole("heading", { level: 2, name: "Manufaa Muhimu ya Value Chain" })).toBeVisible();
    await expect(page.locator("section[aria-labelledby='vc-benefits'] h3")).toHaveText(["Thamani Zaidi", "Masoko ya Uhakika", "Kupunguza Upotevu", "Ushirikiano Endelevu"]);
    await page.goto("/en/farmers-value-chain");
    await expect(page.locator("section[aria-labelledby='vc-benefits'] h3")).toHaveText(["Increased Value", "Reliable Markets", "Reduced Losses", "Sustainable Partnerships"]);
    expect(await page.locator("main").innerText()).not.toContain("Thamani Zaidi");
  });

  test("benefit grid: 4 in a row on desktop, 2 columns below", async ({ page }) => {
    await page.goto("/sw/farmers-value-chain");
    const cols = new Set(await lefts(page, "section[aria-labelledby='vc-benefits'] li")).size;
    expect(cols).toBe(isDesktop(page) ? 4 : 2);
  });

  test("closing banner uses the shared component, correctly spelled, with a working link", async ({ page }) => {
    await page.goto("/sw/farmers-value-chain");
    await expect(page.getByText("Tuimarishe Mnyororo wa Thamani wa Mazao ya Kilimo")).toBeVisible();
    expect(await page.locator("main").innerText()).not.toContain("Tuimar ishe");
    await expect(page.getByRole("main").getByRole("link", { name: "Jiunge na TDSP Sasa" })).toHaveAttribute("href", "/sw/join");
    await page.goto("/en/farmers-value-chain");
    await expect(page.getByText("Strengthen the Agricultural Value Chain")).toBeVisible();
    await expect(page.getByRole("main").getByRole("link", { name: "Join TDSP Now" })).toHaveAttribute("href", "/en/join");
  });

  test("desktop: diagram left, text right; phones: stacked", async ({ page }) => {
    await page.goto("/sw/farmers-value-chain");
    const d = (await page.getByRole("figure").boundingBox())!;
    const t = (await page.locator("#vc-about").boundingBox())!;
    if (isDesktop(page)) expect(d.x + d.width).toBeLessThanOrEqual(t.x);
    else expect(d.y + d.height).toBeLessThanOrEqual(t.y);
  });

  test("hero text clears the farmer on phones and the title wraps in two lines", async ({ page }) => {
    test.skip(isDesktop(page) || width(page) >= 560, "phone layout");
    await page.goto("/sw/farmers-value-chain");
    const r = await page.getByRole("heading", { level: 1 }).evaluate((el) => {
      const rg = document.createRange(); rg.selectNodeContents(el);
      return { right: rg.getBoundingClientRect().right, lines: Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)) };
    });
    expect(r.lines).toBe(2);
    expect(r.right).toBeLessThanOrEqual(width(page) * 0.7);
  });

  test("no unapproved claims: no statistics or lending", async ({ page }) => {
    for (const p of ["/sw/farmers-value-chain", "/en/farmers-value-chain"]) {
      await page.goto(p);
      const t = await page.locator("main").innerText();
      expect(t).not.toMatch(/\d{2,}\s?(%|\+)|TSh|mikopo|loan|kampuni|company/i);
    }
  });

  test("the last content clears the bottom bar", async ({ page }) => {
    test.skip(isDesktop(page), "no bottom bar on desktop");
    await page.goto("/sw/farmers-value-chain", { waitUntil: "load" });
    await expect.poll(async () => {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const barTop = (await page.getByRole("navigation", { name: "Menyu ya chini" }).boundingBox())!.y;
      const last = (await page.getByRole("contentinfo").locator("p").last().boundingBox())!;
      return last.y + last.height <= barTop + 1;
    }).toBe(true);
  });
});

test("hero text stays left of the farmer from 900px to 1439px (sweep)", async ({ page }, info) => {
  test.skip(info.project.name !== "w1280", "sweep runs once");
  for (const lang of ["sw", "en"]) {
    for (const w of [900, 1024, 1100, 1200, 1280, 1366, 1439]) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto(`/${lang}/farmers-value-chain`);
      const photoLeft = (await page.locator("main section").first().locator("[role=img]").boundingBox())!.x;
      const right = await page.locator("section[aria-labelledby='page-hero-title'] h1, section h1").first().evaluate((el) => {
        const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right;
      });
      const textRight = await page.locator("main section").first().locator("p").last().evaluate((el) => {
        const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right;
      });
      // the photo fades in over its first 20%: text must end before the photo's visible part
      expect(right, `${lang} ${w}px title right vs photo`).toBeLessThanOrEqual(photoLeft + 4);
      expect(textRight, `${lang} ${w}px description right vs photo`).toBeLessThanOrEqual(photoLeft + 0.1 * (w - photoLeft));
    }
  }
});
