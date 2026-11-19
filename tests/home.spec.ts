import { expect, test } from "@playwright/test";
import { isDesktop, width } from "./helpers";

const SW_TABS = ["Karibu", "Huduma", "Fursa", "Habari", "Akaunti"];
const EN_TABS = ["Home", "Services", "Explore", "News", "Account"];

const bottomNav = (page: import("@playwright/test").Page, lang: "sw" | "en" = "sw") =>
  page.getByRole("navigation", { name: lang === "sw" ? "Menyu ya chini" : "Bottom menu" });

test.describe("mobile bottom navigation (< 900px)", () => {
  test.beforeEach(({ page }) => {
    test.skip(isDesktop(page), "bottom bar is hidden on desktop");
  });

  test("has exactly five items, in order, each with an icon above its label", async ({ page }) => {
    await page.goto("/sw");
    const links = bottomNav(page).getByRole("link");
    await expect(links).toHaveCount(5);
    const widths: number[] = [];
    for (let i = 0; i < 5; i++) {
      const link = links.nth(i);
      await expect(link).toHaveText(SW_TABS[i]);
      const icon = link.locator("svg");
      await expect(icon).toHaveCount(1);
      const iconBox = (await icon.boundingBox())!;
      const labelBox = (await link.locator("span").boundingBox())!;
      expect(iconBox.width, `${SW_TABS[i]} icon size`).toBeGreaterThanOrEqual(22);
      expect(iconBox.y + iconBox.height, `${SW_TABS[i]} icon above label`).toBeLessThanOrEqual(labelBox.y + 1);
      widths.push(Math.round((await link.boundingBox())!.width));
    }
    // five equal-width items
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(2);
  });

  test("English labels follow the language switch", async ({ page }) => {
    await page.goto("/en");
    const links = bottomNav(page, "en").getByRole("link");
    for (let i = 0; i < 5; i++) await expect(links.nth(i)).toHaveText(EN_TABS[i]);
  });

  test("marks the current page as active", async ({ page }) => {
    const cases: [string, string][] = [
      ["/sw", "Karibu"],
      ["/sw/services", "Huduma"],
      ["/sw/habari-na-fursa", "Habari"],
      ["/sw/login", "Akaunti"],
    ];
    for (const [path, active] of cases) {
      await page.goto(path);
      const current = bottomNav(page).locator("[aria-current='page']");
      await expect(current).toHaveCount(1);
      await expect(current).toHaveText(active);
    }
  });

  test("every item leads to a real page", async ({ page }) => {
    const targets: [string, RegExp, string][] = [
      ["Huduma", /\/sw\/services$/, "Huduma"],
      ["Fursa", /\/sw\/habari-na-fursa#fursa$/, "Habari & Fursa"],
      ["Habari", /\/sw\/habari-na-fursa$/, "Habari & Fursa"],
      ["Akaunti", /\/sw\/akaunti$/, "Akaunti Yako ya TDSP"],
      ["Karibu", /\/sw$/, "Kuimarisha Wakulima, Masoko na Fursa za Maendeleo"],
    ];
    await page.goto("/sw");
    for (const [label, url, h1] of targets) {
      await bottomNav(page).getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(url);
      await expect(page.getByRole("heading", { level: 1, name: h1 })).toBeVisible();
    }
  });

  test("stays fixed at the bottom of the screen while scrolling", async ({ page }) => {
    await page.goto("/sw");
    const nav = bottomNav(page);
    const viewportH = page.viewportSize()!.height;
    const before = (await nav.boundingBox())!;
    expect(Math.round(before.y + before.height)).toBe(viewportH);

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const after = (await nav.boundingBox())!;
    expect(Math.round(after.y + after.height)).toBe(viewportH);
    expect(Math.round(after.y)).toBe(Math.round(before.y));
  });

  test("never hides content: the last footer line ends above the bar", async ({ page }) => {
    await page.goto("/sw");
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const navTop = (await bottomNav(page).boundingBox())!.y;
    const lastLine = (await page.getByRole("contentinfo").locator("p").last().boundingBox())!;
    expect(lastLine.y + lastLine.height).toBeLessThanOrEqual(navTop + 1);
  });

  test("the desktop contact strip and header navigation are not shown", async ({ page }) => {
    await page.goto("/sw");
    await expect(page.getByRole("list", { name: "Taarifa za mawasiliano" })).toBeHidden();
    await expect(page.locator("#site-nav")).toBeHidden();
  });
});

test.describe("desktop header (>= 900px)", () => {
  test.beforeEach(({ page }) => {
    test.skip(!isDesktop(page), "desktop only");
  });

  test("shows the contact strip with verified TDSP details", async ({ page }) => {
    await page.goto("/sw");
    const strip = page.getByRole("list", { name: "Taarifa za mawasiliano" });
    await expect(strip).toBeVisible();
    await expect(strip.getByRole("link", { name: "0689 671 666" })).toHaveAttribute("href", "tel:0689671666");
    await expect(strip.getByRole("link", { name: "0784 573 600" })).toHaveAttribute("href", "tel:0784573600");
    await expect(strip.getByRole("link", { name: "tdsphq@gmail.com" })).toHaveAttribute("href", "mailto:tdsphq@gmail.com");
    await expect(strip.getByText("Dar es Salaam, Tanzania")).toBeVisible();
    // The mockup's info@tdsp.or.tz is not a verified TDSP address.
    await expect(page.getByText("info@tdsp.or.tz")).toHaveCount(0);
  });

  test("shows the seven navigation items in order, plus the join button", async ({ page }) => {
    await page.goto("/sw");
    const links = page.locator("#site-nav a");
    const expected = ["Karibu TDSP", "Kuhusu TDSP", "Huduma", "Uanachama", "Miradi & Andiko", "Habari & Fursa", "Mawasiliano"];
    await expect(links).toHaveCount(7);
    for (let i = 0; i < expected.length; i++) await expect(links.nth(i)).toHaveText(expected[i]);
    await expect(links.nth(0)).toHaveAttribute("aria-current", "page");
    await expect(page.locator("header").getByRole("link", { name: "Jiunge na TDSP" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Menyu ya chini" })).toBeHidden();
  });

  test("the language switcher sits in the contact strip", async ({ page }) => {
    await page.goto("/sw");
    const box = (await page.getByRole("link", { name: "English", exact: true }).boundingBox())!;
    expect(box.y).toBeLessThan(50);
    await page.getByRole("link", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("#site-nav a").first()).toHaveText("Welcome to TDSP");
  });
});

test.describe("homepage content (all widths)", () => {
  test("hero shows the headline, description and join call to action", async ({ page }) => {
    await page.goto("/sw");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Kuimarisha Wakulima, Masoko na Fursa za Maendeleo",
    );
    await expect(page.getByRole("main").getByText("Karibu TDSP", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Tunawawezesha wakulima, vikundi na wadau wa kilimo kupitia teknolojia"),
    ).toBeVisible();
    const cta = page.getByRole("main").getByRole("link", { name: "Jiunge na TDSP" }).first();
    await expect(cta).toHaveAttribute("href", "/sw/join");
  });

  test("there is no dead 'watch video' button while no video is configured", async ({ page }) => {
    await page.goto("/sw");
    await expect(page.getByText("Tazama Video")).toHaveCount(0);
  });

  test("statistics strip shows four items and no unapproved figures", async ({ page }) => {
    await page.goto("/sw");
    const strip = page.getByRole("region", { name: "Wanaohudumiwa na TDSP" });
    await expect(strip.locator("li")).toHaveCount(4);
    await expect(strip.locator("svg")).toHaveCount(4);
    const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
    // Mockup figures are not confirmed by TDSP and must not be shown.
    for (const fake of ["10,000", "350+", "25+"]) expect(text).not.toContain(fake);
  });

  test("six service cards with icons, titles and working links", async ({ page }) => {
    await page.goto("/sw");
    const cards = page.locator("section[aria-labelledby='services-title'] ul").getByRole("link");
    await expect(cards).toHaveCount(6);
    const titles = ["Farmers Value Chain", "Miradi & Andiko", "Financial Linkage", "Masoko", "Elimu & Ujuzi", "Watoa Huduma"];
    for (let i = 0; i < 6; i++) {
      await expect(cards.nth(i)).toContainText(titles[i]);
      await expect(cards.nth(i).locator("svg")).toHaveCount(2); // icon + arrow
    }
    // Each card leads to its own page (a "coming soon" page until built), never a 404.
    const hrefs = await cards.evaluateAll((els) => els.map((e) => e.getAttribute("href")!));
    expect(hrefs).toEqual(["farmers-value-chain", "miradi-na-andiko", "financial-linkage", "masoko", "elimu-na-ujuzi", "watoa-huduma"].map((r) => `/sw/${r}`));
    for (const href of hrefs) {
      const res = await page.goto(href);
      expect(res?.status(), href).toBe(200);
      await expect(page.getByRole("heading", { level: 1, name: href.endsWith("farmers-value-chain") ? "Farmers Value Chain" : href.endsWith("miradi-na-andiko") ? "Miradi & Andiko" : href.endsWith("financial-linkage") ? "Uunganishaji wa Fedha" : href.endsWith("masoko") ? "Masoko" : href.endsWith("elimu-na-ujuzi") ? "Elimu & Ujuzi" : href.endsWith("watoa-huduma") ? "Watoa Huduma" : "Inakuja Hivi Karibuni" })).toBeVisible();
    }
  });

  test("a Document Centre link sits under the service cards", async ({ page }) => {
    for (const [p, label, href] of [["/sw", "Nyaraka za umma: TDSP Document Centre", "/sw/kituo-cha-nyaraka"], ["/en", "Public documents: TDSP Document Centre", "/en/document-centre"]] as const) {
      await page.goto(p);
      await expect(page.locator("section[aria-labelledby='services-title']").getByRole("link", { name: label })).toHaveAttribute("href", href);
    }
  });

  test("service card columns adapt to the screen width", async ({ page }) => {
    await page.goto("/sw");
    const cards = page.locator("section[aria-labelledby='services-title'] ul").getByRole("link");
    const lefts = await cards.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
    const columns = new Set(lefts).size;
    const w = width(page);
    const expected = w >= 1200 ? 6 : w >= 560 ? 3 : 2;
    expect(columns).toBe(expected);
  });

  test("membership banner is a phone/tablet element only", async ({ page }) => {
    await page.goto("/sw");
    const banner = page.getByRole("link", { name: /Jiunge na Mtandao wa TDSP/ });
    if (isDesktop(page)) await expect(banner).toBeHidden();
    else {
      await expect(banner).toBeVisible();
      await expect(banner).toHaveAttribute("href", "/sw/join");
    }
  });

  test("English home page is fully translated", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Strengthening Farmers, Markets and Development Opportunities",
    );
    // The section label shows at every width; the longer title from tablet up.
    await expect(page.getByText("Our Main Services")).toBeVisible();
    if (width(page) >= 560) {
      await expect(page.getByRole("heading", { name: "Opportunities and Support for Farmers" })).toBeVisible();
    }
    await expect(page.getByText("Huduma Zetu Kuu")).toHaveCount(0);
  });

  test("hero text does not overlap the buttons", async ({ page }) => {
    await page.goto("/sw");
    const text = (await page.getByText("Tunawawezesha wakulima").boundingBox())!;
    const cta = (await page.getByRole("main").getByRole("link", { name: "Jiunge na TDSP" }).first().boundingBox())!;
    expect(text.y + text.height).toBeLessThanOrEqual(cta.y + 1);
  });
});

test.describe("bottom navigation labels never wrap", () => {
  test.beforeEach(({ page }) => {
    test.skip(isDesktop(page), "bottom bar is hidden on desktop");
  });

  for (const lang of ["sw", "en"] as const) {
    test(`all five labels stay on one line and inside their tab (${lang})`, async ({ page }) => {
      await page.goto(`/${lang}`);
      const labels = bottomNav(page, lang).locator("a span");
      await expect(labels).toHaveCount(5);
      for (let i = 0; i < 5; i++) {
        const label = labels.nth(i);
        const info = await label.evaluate((el) => {
          const cs = getComputedStyle(el);
          const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
          return {
            text: el.textContent,
            height: el.getBoundingClientRect().height,
            lineHeight,
            overflow: el.scrollWidth > el.clientWidth + 1,
            parentOverflow: el.scrollWidth > (el.parentElement as HTMLElement).clientWidth,
          };
        });
        expect(info.height, `${info.text} wraps`).toBeLessThanOrEqual(info.lineHeight * 1.5);
        expect(info.parentOverflow, `${info.text} wider than its tab`).toBe(false);
      }
    });
  }
});

test("the statistics labels stay on one line", async ({ page }) => {
  for (const lang of ["sw", "en"] as const) {
    await page.goto(`/${lang}`);
    const strip = page.locator("section[aria-label]").filter({ has: page.locator("svg") }).first();
    const labels = strip.locator("span:visible");
    const n = await labels.count();
    expect(n).toBeGreaterThanOrEqual(4);
    for (let i = 0; i < n; i++) {
      const h = await labels.nth(i).evaluate((el) => {
        const lh = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.2;
        return el.getBoundingClientRect().height / lh;
      });
      expect(h, `${lang} stat label ${i}`).toBeLessThan(1.5);
    }
  }
});

test("the hero keeps text and photo apart on phones", async ({ page }) => {
  test.skip(isDesktop(page) || width(page) >= 560, "phone layout only");
  for (const lang of ["sw", "en"] as const) {
    await page.goto(`/${lang}`);
    const hero = (await page.locator("section[aria-labelledby='hero-title']").boundingBox())!;
    const cta = (await page.getByRole("main").getByRole("link", { name: /Jiunge na TDSP|Join TDSP/ }).first().boundingBox())!;
    // everything fits inside the hero: no clipped heading or button
    expect(cta.y + cta.height).toBeLessThanOrEqual(hero.y + hero.height);
    const title = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
    expect(title.x).toBeGreaterThanOrEqual(0);
    expect(title.x + title.width).toBeLessThanOrEqual(width(page));
  }
});

test("hero text stays in the left column, clear of the face, on phones", async ({ page }) => {
  test.skip(isDesktop(page) || width(page) >= 560, "phone layout only");
  for (const lang of ["sw", "en"] as const) {
    await page.goto(`/${lang}`);
    const w = width(page);
    const title = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
    const text = (await page.locator("section[aria-labelledby='hero-title'] p").last().boundingBox())!;
    // The face starts at about 60% of the screen width; text must end before it.
    expect(title.x + title.width, `${lang} headline right edge`).toBeLessThanOrEqual(w * 0.62);
    expect(text.x + text.width, `${lang} paragraph right edge`).toBeLessThanOrEqual(w * 0.62);
  }
});
