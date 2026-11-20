import { expect, test } from "@playwright/test";
import { isDesktop, width } from "./helpers";

const BENEFITS_SW = [
  "Fursa za Masoko na Wanunuzi",
  "Mafunzo na Ujuzi",
  "Uunganishaji na Fedha",
  "Mtandao wa Wakulima na Vikundi",
  "Ushirikiano na Wadau",
  "Taarifa, Waraka na Nyaraka",
];
const REQUIREMENTS_SW = [
  "Kukubali malengo na kanuni za TDSP.",
  "Kujaza fomu ya uanachama.",
  "Kutoa taarifa sahihi za mawasiliano.",
  "Kukamilisha ada ya uanachama (kama inahusika).",
  "Kushiriki katika shughuli na programu za TDSP.",
];

const lefts = (page: import("@playwright/test").Page, sel: string) =>
  page.locator(sel).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
const tops = (page: import("@playwright/test").Page, sel: string) =>
  page.locator(sel).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));

test.describe("Uanachama: routes and languages", () => {
  test("Kiswahili lives at /sw/uanachama and English at /en/membership", async ({ page }) => {
    for (const [path, h1] of [["/sw/uanachama", "Uanachama"], ["/en/membership", "Membership"]] as const) {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
    }
  });

  test("the other language's address redirects to the canonical one", async ({ page }) => {
    await page.goto("/sw/membership");
    await expect(page).toHaveURL(/\/sw\/uanachama$/);
    await page.goto("/en/uanachama");
    await expect(page).toHaveURL(/\/en\/membership$/);
  });

  test("the language switcher lands on the equivalent page", async ({ page }) => {
    await page.goto("/sw/uanachama");
    await page.getByRole("link", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/membership$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Membership");
    await page.getByRole("link", { name: "Kiswahili", exact: true }).click();
    await expect(page).toHaveURL(/\/sw\/uanachama$/);
  });

  test("the browser tab names the page", async ({ page }) => {
    await page.goto("/sw/uanachama");
    await expect(page).toHaveTitle(/Uanachama/);
    await page.goto("/en/membership");
    await expect(page).toHaveTitle(/Membership/);
  });
});

test.describe("Uanachama: content", () => {
  test("hero: breadcrumb, title and description", async ({ page }) => {
    await page.goto("/sw/uanachama");
    await expect(page.getByText("Jiunge na TDSP na uwe sehemu ya mtandao wa wakulima, vikundi na wadau wa kilimo.", { exact: true })).toBeVisible();
    const crumb = page.getByRole("navigation", { name: "Njia ya ukurasa" });
    await expect(crumb.getByRole("link", { name: "Karibu TDSP" })).toHaveAttribute("href", "/sw");
    await expect(crumb.locator("[aria-current='page']")).toHaveText("Uanachama");
    await expect(page.getByRole("img", { name: "Wakulima wawili wakitabasamu shambani" })).toBeVisible();
  });

  test("six benefit cards with icons and the exact labels", async ({ page }) => {
    await page.goto("/sw/uanachama");
    const items = page.locator("section[aria-labelledby='benefits-title'] li");
    await expect(items).toHaveCount(6);
    for (let i = 0; i < 6; i++) {
      await expect(items.nth(i)).toHaveText(BENEFITS_SW[i]);
      await expect(items.nth(i).locator("svg")).toHaveCount(1);
    }
  });

  test("three categories and five requirements, in order", async ({ page }) => {
    await page.goto("/sw/uanachama");
    const cats = page.locator("section[aria-labelledby='categories-title'] h3");
    await expect(cats).toHaveText(["Mwanachama Binafsi", "Uanachama wa Vikundi", "Uanachama wa Taasisi"]);
    const reqs = page.locator("section[aria-labelledby='requirements-title'] li");
    await expect(reqs).toHaveCount(5);
    for (let i = 0; i < 5; i++) await expect(reqs.nth(i)).toHaveText(REQUIREMENTS_SW[i]);
  });

  test("categories and requirements are marked as awaiting TDSP approval", async ({ page }) => {
    await page.goto("/sw/uanachama");
    await expect(page.getByRole("note")).toHaveText("Aina na masharti haya yanasubiri idhini rasmi ya TDSP.");
    await page.goto("/en/membership");
    await expect(page.getByRole("note")).toContainText("awaiting TDSP's official approval");
  });

  test("no fee amount, no automatic approval, no promise of loans", async ({ page }) => {
    for (const path of ["/sw/uanachama", "/en/membership"]) {
      await page.goto(path);
      const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
      expect(text, path).not.toMatch(/TSh|TZS|10,?000|\d+\s?\/=/);
      expect(text, path).not.toMatch(/mikopo|loan/i);
      expect(text, path).not.toMatch(/kampuni|company/i);
    }
    await page.goto("/sw/uanachama");
    await expect(page.getByText("Uanachama unaidhinishwa na TDSP baada ya uhakiki.")).toBeVisible();
  });

  test("the mockup's typos are not copied (Unnachama)", async ({ page }) => {
    await page.goto("/sw/uanachama");
    expect(await page.locator("main").innerText()).not.toContain("Unnachama");
  });

  test("English version is fully translated", async ({ page }) => {
    await page.goto("/en/membership");
    await expect(page.getByRole("heading", { level: 2, name: "Membership Benefits" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Join TDSP Today" })).toBeVisible();
    await expect(page.getByText("Individual Member")).toBeVisible();
    await expect(page.getByText("Strong Farmers, Sustainable Farming Systems")).toBeVisible();
    const text = await page.locator("main").innerText();
    for (const sw of ["Manufaa", "Aina za", "Masharti", "Wakulima Wenye"]) expect(text).not.toContain(sw);
  });

  test("heading hierarchy", async ({ page }) => {
    await page.goto("/sw/uanachama");
    await expect(page.locator("main h1")).toHaveCount(1);
    const h2 = (await page.locator("main h2").allInnerTexts()).map((t) => t.trim());
    expect(h2).toEqual(["Manufaa ya Uanachama", "Jiunge na TDSP Leo", "Aina za Uanachama", "Masharti ya Uanachama"]);
  });
});

test.describe("Uanachama: actions", () => {
  test("registration, login and banner buttons lead to real pages", async ({ page }) => {
    await page.goto("/sw/uanachama");
    const reg = page.getByRole("link", { name: "Sajili Uanachama Sasa" });
    const login = page.getByRole("link", { name: "Nimesajiliwa Tayari? Ingia" });
    const banner = page.getByRole("main").getByRole("link", { name: "Jiunge na TDSP Sasa" });
    await expect(reg).toHaveAttribute("href", "/sw/join");
    await expect(login).toHaveAttribute("href", "/sw/login");
    await expect(banner).toHaveAttribute("href", "/sw/join");
    await reg.click();
    await expect(page).toHaveURL(/\/sw\/join$/);
    await page.goBack();
    await login.click();
    await expect(page).toHaveURL(/\/sw\/login$/);
  });

  test("English buttons keep the English language", async ({ page }) => {
    await page.goto("/en/membership");
    await expect(page.getByRole("link", { name: "Register for Membership Now" })).toHaveAttribute("href", "/en/join");
    await expect(page.getByRole("link", { name: "Already registered? Sign in" })).toHaveAttribute("href", "/en/login");
  });

  test("the navigation marks Uanachama as current (desktop)", async ({ page }) => {
    test.skip(!isDesktop(page), "header navigation is desktop-only");
    await page.goto("/sw/uanachama");
    await expect(page.locator("#site-nav [aria-current='page']")).toHaveText("Uanachama");
    await page.goto("/sw");
    await page.locator("#site-nav").getByRole("link", { name: "Uanachama" }).click();
    await expect(page).toHaveURL(/\/sw\/uanachama$/);
    await page.goto("/en");
    await page.locator("#site-nav").getByRole("link", { name: "Membership" }).click();
    await expect(page).toHaveURL(/\/en\/membership$/);
  });

  test("keyboard focus is visible on the registration button", async ({ page }) => {
    await page.goto("/sw/uanachama");
    const btn = page.getByRole("link", { name: "Sajili Uanachama Sasa" });
    await btn.focus();
    expect(await btn.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe("none");
  });
});

test.describe("Uanachama: layout at every width", () => {
  test("benefits are a 3 x 2 grid at every width", async ({ page }) => {
    await page.goto("/sw/uanachama");
    const sel = "section[aria-labelledby='benefits-title'] li";
    expect(new Set(await lefts(page, sel)).size).toBe(3);
    expect(new Set(await tops(page, sel)).size).toBe(2);
  });

  test("categories: three in a row on desktop, stacked on phones and tablets", async ({ page }) => {
    await page.goto("/sw/uanachama");
    const sel = "section[aria-labelledby='categories-title'] li";
    const l = new Set(await lefts(page, sel)).size;
    const t = new Set(await tops(page, sel)).size;
    if (isDesktop(page)) { expect(l).toBe(3); expect(t).toBe(1); }
    else { expect(l).toBe(1); expect(t).toBe(3); }
  });

  test("desktop: benefits left, registration card right; phones: stacked", async ({ page }) => {
    await page.goto("/sw/uanachama");
    const ben = (await page.locator("section[aria-labelledby='benefits-title']").boundingBox())!;
    const join = (await page.locator("section[aria-labelledby='join-title']").boundingBox())!;
    if (isDesktop(page)) expect(ben.x + ben.width).toBeLessThanOrEqual(join.x + 1);
    else expect(ben.y + ben.height).toBeLessThanOrEqual(join.y + 1);
  });

  test("requirements sit beside the categories on desktop, below on phones", async ({ page }) => {
    await page.goto("/sw/uanachama");
    const cats = (await page.locator("section[aria-labelledby='categories-title']").boundingBox())!;
    const req = (await page.locator("section[aria-labelledby='requirements-title']").boundingBox())!;
    if (isDesktop(page)) expect(cats.x + cats.width).toBeLessThanOrEqual(req.x + 1);
    else expect(cats.y + cats.height).toBeLessThanOrEqual(req.y + 1);
  });

  test("hero text clears the farmers' faces on phones", async ({ page }) => {
    test.skip(isDesktop(page) || width(page) >= 560, "phone layout only");
    for (const [path, para] of [
      ["/sw/uanachama", "Jiunge na TDSP na uwe sehemu ya mtandao wa wakulima, vikundi na wadau wa kilimo."],
      ["/en/membership", "Join TDSP and become part of the network of farmers, groups and agricultural stakeholders."],
    ] as const) {
      await page.goto(path);
      const text = (await page.getByText(para, { exact: true }).boundingBox())!;
      expect(text.x + text.width, path).toBeLessThanOrEqual(width(page) * 0.56);
      // The heading is a block element: measure its text, not its box.
      const titleRight = await page.getByRole("heading", { level: 1 }).evaluate((el) => {
        const r = document.createRange();
        r.selectNodeContents(el);
        return r.getBoundingClientRect().right;
      });
      expect(titleRight, `${path} title text`).toBeLessThanOrEqual(width(page) * 0.62);
    }
  });

  test("the breadcrumb stays clear of the photo on phones", async ({ page }) => {
    test.skip(isDesktop(page), "phones and tablets");
    await page.goto("/sw/uanachama");
    const crumb = (await page.getByRole("navigation", { name: "Njia ya ukurasa" }).boundingBox())!;
    const photo = (await page.getByRole("img", { name: "Wakulima wawili wakitabasamu shambani" }).boundingBox())!;
    expect(crumb.y + crumb.height).toBeLessThanOrEqual(photo.y + 1);
  });

  test("every button is fully inside the screen and not clipped", async ({ page }) => {
    await page.goto("/sw/uanachama");
    const w = width(page);
    const links = page.getByRole("main").locator("a");
    for (let i = 0; i < (await links.count()); i++) {
      const el = links.nth(i);
      if (!(await el.isVisible())) continue;
      const b = (await el.boundingBox())!;
      expect(b.x, `link ${i}`).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width, `link ${i}`).toBeLessThanOrEqual(w);
      expect(b.height, `link ${i}`).toBeGreaterThanOrEqual(43.5);
    }
  });

  test("section headings stay on one line from 1200px (both languages)", async ({ page }) => {
    test.skip(width(page) < 1200, "narrower desktops may wrap a heading; they must not overflow (checked elsewhere)");
    for (const path of ["/sw/uanachama", "/en/membership"]) {
      await page.goto(path);
      const heads = page.locator("main h2");
      for (let i = 0; i < (await heads.count()); i++) {
        const lines = await heads.nth(i).evaluate((el) => {
          const lh = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.2;
          return Math.round(el.getBoundingClientRect().height / lh);
        });
        expect(lines, `${path} heading ${i}`).toBeLessThanOrEqual(1);
      }
    }
  });

  test("the banner stays readable: title and button do not overlap", async ({ page }) => {
    await page.goto("/sw/uanachama");
    const title = (await page.getByText("Wakulima Wenye Nguvu, Mifumo ya Kilimo Endelevu").boundingBox())!;
    const cta = (await page.getByRole("main").getByRole("link", { name: "Jiunge na TDSP Sasa" }).boundingBox())!;
    const overlap = title.x < cta.x + cta.width && cta.x < title.x + title.width && title.y < cta.y + cta.height && cta.y < title.y + title.height;
    expect(overlap).toBe(false);
  });

  test("the last content clears the bottom bar", async ({ page }) => {
    test.skip(isDesktop(page), "no bottom bar on desktop");
    await page.goto("/sw/uanachama", { waitUntil: "load" });
    await expect
      .poll(async () => {
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        const barTop = (await page.getByRole("navigation", { name: "Menyu ya chini" }).boundingBox())!.y;
        const last = (await page.getByRole("contentinfo").locator("p").last().boundingBox())!;
        return last.y + last.height <= barTop + 1;
      })
      .toBe(true);
  });
});
