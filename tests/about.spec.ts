import { expect, test, type Page } from "@playwright/test";
import { officialStatements } from "../lib/about-content";
import { isDesktop, width } from "./helpers";

const SW = {
  title: "Kuhusu TDSP",
  hero: "Shirika linalowezesha wakulima, vikundi na wadau wa kilimo kupitia mafunzo, teknolojia, ushirikiano na fursa za masoko.",
  focus: ["Kilimo Endelevu", "Uwezeshaji", "Fursa za Soko", "Ushirikiano"],
};

// Objectives: TDSP's own wording, Waraka No. 2 section 2 "Malengo mahususi".
const OBJECTIVES_SW = [
  "Kuwaunganisha wanachama na mifuko ya ruzuku na fursa za ufadhili kutoka serikalini na mashirika ya maendeleo.",
  "Kuunganisha vijana na fursa za ajira, mafunzo ya ufundi, ujasiriamali na ubunifu.",
  "Kuwawezesha wanawake na vikundi vyao kupata fursa za mitaji, vifaa, mafunzo na masoko.",
  "Kuwezesha watu wenye ulemavu kupata fursa zinazozingatia mahitaji yao na usawa wa kijamii.",
  "Kuunganisha wakulima na wanunuzi, wasindikaji, wasambazaji wa pembejeo na huduma za kilimo.",
  "Kuanzisha ubao maalumu wa kutangaza programu zinazohitaji michango kutoka kwa wadau.",
  "Kuwezesha mashirika, kampuni na taasisi kushiriki katika programu za maendeleo.",
  "Kuweka mfumo wa kufuatilia maombi, michango, utekelezaji na matokeo ya programu.",
  "Kutoa taarifa na ripoti zinazosaidia kufanya maamuzi ya maendeleo.",
];

const lefts = async (page: Page, sel: string) =>
  page.locator(sel).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
const tops = async (page: Page, sel: string) =>
  page.locator(sel).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));

test.describe("Kuhusu TDSP: content", () => {
  test("hero shows the breadcrumb, title and description (Kiswahili)", async ({ page }) => {
    await page.goto("/sw/about");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(SW.title);
    await expect(page.getByRole("main").getByText(SW.hero, { exact: true })).toBeVisible();

    const crumbs = page.getByRole("navigation", { name: "Njia ya ukurasa" });
    await expect(crumbs.getByRole("link", { name: "Karibu TDSP" })).toHaveAttribute("href", "/sw");
    await expect(crumbs.locator("[aria-current='page']")).toHaveText("Kuhusu TDSP");
  });

  test("the breadcrumb leads back to the home page", async ({ page }) => {
    await page.goto("/sw/about");
    await page.getByRole("navigation", { name: "Njia ya ukurasa" }).getByRole("link", { name: "Karibu TDSP" }).click();
    await expect(page).toHaveURL(/\/sw$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Kuimarisha Wakulima, Masoko na Fursa za Maendeleo",
    );
  });

  test("the navigation marks About as the current page", async ({ page }) => {
    await page.goto("/sw/about");
    if (isDesktop(page)) {
      await expect(page.locator("#site-nav [aria-current='page']")).toHaveText("Kuhusu TDSP");
    } else {
      // As in the mockup's phone view, About sits under "Karibu".
      await expect(
        page.getByRole("navigation", { name: "Menyu ya chini" }).locator("[aria-current='page']"),
      ).toHaveText("Karibu");
    }
  });

  test("'TDSP ni Nani?' has the overview label, text and four focus areas", async ({ page }) => {
    await page.goto("/sw/about");
    await expect(page.getByRole("heading", { level: 2, name: "TDSP ni Nani?" })).toBeVisible();
    await expect(page.getByText("Muhtasari", { exact: true })).toBeVisible();
    await expect(page.getByText("00NGO/0009096")).toBeVisible();
    const focus = page.getByRole("list", { name: "Maeneo yetu ya kuzingatia" }).locator("li");
    await expect(focus).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(focus.nth(i)).toHaveText(SW.focus[i]);
      await expect(focus.nth(i).locator("svg")).toHaveCount(1);
    }
  });

  test("vision and mission are TDSP's Constitution wording, verbatim", async ({ page }) => {
    for (const lang of ["sw", "en"] as const) {
      await page.goto(`/${lang}/about`);
      const vision = page.getByText(officialStatements.vision, { exact: true });
      const mission = page.getByText(officialStatements.mission, { exact: true });
      await expect(vision).toBeVisible();
      await expect(mission).toBeVisible();
      // English wording is marked as such for screen readers.
      await expect(vision).toHaveAttribute("lang", "en");
      await expect(mission).toHaveAttribute("lang", "en");
    }
    // The wording itself is guarded against accidental edits:
    expect(officialStatements.vision).toBe(
      "Excellence community in transforming lives of its people through promotion of quality education, health services equality.",
    );
    expect(officialStatements.mission).toBe(
      "Our mission is to help community in a difficult environment and improve their standard of living so that their physical, emotional and social needs are satisfied and to serve government challenges in a community.",
    );
  });

  test("the source of the wording is stated", async ({ page }) => {
    await page.goto("/sw/about");
    await expect(page.getByText("Maneno rasmi ya Katiba ya TDSP (Kiingereza)")).toHaveCount(2);
    await page.goto("/en/about");
    await expect(page.getByText("Official wording from TDSP's Constitution")).toHaveCount(2);
  });

  test("no invented values are published", async ({ page }) => {
    for (const lang of ["sw", "en"] as const) {
      await page.goto(`/${lang}/about`);
      const text = await page.locator("main").innerText();
      // The mockup's values were not supplied by TDSP; the card stays hidden until approved.
      for (const invented of ["Uadilifu", "Ubunifu", "Uendelevu", "Uwajibikaji", "Integrity", "Accountability"]) {
        expect(text, `${lang} shows "${invented}"`).not.toContain(invented);
      }
      await expect(page.getByRole("heading", { name: /Maadili Yetu|Our Values/ })).toHaveCount(0);
    }
  });

  test("objectives are TDSP's own nine, in order, verbatim (Kiswahili)", async ({ page }) => {
    await page.goto("/sw/about");
    await expect(page.getByRole("heading", { level: 2, name: "Malengo Yetu" })).toBeVisible();
    const items = page.locator("section[aria-labelledby='objectives-title'] li");
    await expect(items).toHaveCount(9);
    for (let i = 0; i < 9; i++) {
      await expect(items.nth(i)).toHaveText(OBJECTIVES_SW[i]);
      await expect(items.nth(i).locator("svg")).toHaveCount(1);
    }
    await expect(page.getByText("Waraka Na. 2 wa TDSP")).toBeVisible();
  });

  test("English version translates the whole page", async ({ page }) => {
    await page.goto("/en/about");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("About TDSP");
    await expect(page.getByRole("heading", { level: 2, name: "Who is TDSP?" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Our Objectives" })).toBeVisible();
    await expect(page.getByText("Sustainable Farming")).toBeVisible();
    await expect(page.getByText("Kuhusu TDSP")).toHaveCount(0);
    await expect(page.getByText("Malengo Yetu")).toHaveCount(0);
  });

  test("switching language keeps the About page", async ({ page }) => {
    await page.goto("/sw/about");
    await page.getByRole("link", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/about$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("About TDSP");
  });

  test("heading hierarchy is correct", async ({ page }) => {
    await page.goto("/sw/about");
    await expect(page.locator("main h1")).toHaveCount(1);
    const h2 = await page.locator("main h2").allInnerTexts();
    expect(h2.map((t) => t.trim())).toEqual(["TDSP ni Nani?", "Dira, dhamira na maadili", "Malengo Yetu"]);
    const h3 = await page.locator("main h3").allInnerTexts();
    expect(h3.map((t) => t.trim())).toEqual(["Dira Yetu", "Dhamira Yetu"]);
  });
});

test.describe("Kuhusu TDSP: layout at every width", () => {
  test("the white card overlaps the hero's lower edge", async ({ page }) => {
    await page.goto("/sw/about");
    const hero = (await page.locator("section[aria-labelledby='about-title']").boundingBox())!;
    const card = (await page.locator("section[aria-labelledby='who-title']").boundingBox())!;
    expect(card.y, "card starts inside the hero").toBeLessThan(hero.y + hero.height);
    expect(card.y, "card starts below the title").toBeGreaterThan(hero.y + 100);
  });

  test("the hero text is fully inside the page and above the card", async ({ page }) => {
    await page.goto("/sw/about");
    const w = width(page);
    for (const loc of [page.getByRole("heading", { level: 1 }), page.getByText(SW.hero, { exact: true })]) {
      const b = (await loc.boundingBox())!;
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width).toBeLessThanOrEqual(w);
    }
    const text = (await page.getByText(SW.hero, { exact: true }).boundingBox())!;
    const card = (await page.locator("section[aria-labelledby='who-title']").boundingBox())!;
    expect(text.y + text.height).toBeLessThanOrEqual(card.y);
  });

  test("introduction: one column on phones and tablets, two columns on desktop", async ({ page }) => {
    await page.goto("/sw/about");
    const photo = (await page.locator("section[aria-labelledby='who-title'] img").boundingBox())!;
    const heading = (await page.locator("#who-title").boundingBox())!;
    if (isDesktop(page)) {
      expect(photo.x + photo.width, "photo left of text").toBeLessThanOrEqual(heading.x);
      expect(heading.y, "same band").toBeLessThan(photo.y + photo.height);
    } else {
      expect(photo.y + photo.height, "photo above text").toBeLessThanOrEqual(heading.y);
      const card = (await page.locator("section[aria-labelledby='who-title'] > div").boundingBox())!;
      expect(photo.width, "photo spans the card").toBeGreaterThan(card.width * 0.85);
    }
  });

  test("focus areas: 2x2 cards on phones and tablets, one row of four on desktop", async ({ page }) => {
    await page.goto("/sw/about");
    const sel = "ul[aria-label='Maeneo yetu ya kuzingatia'] li";
    const l = new Set(await lefts(page, sel));
    const t = new Set(await tops(page, sel));
    if (isDesktop(page)) {
      expect(l.size).toBe(4);
      expect(t.size).toBe(1);
    } else {
      expect(l.size).toBe(2);
      expect(t.size).toBe(2);
    }
  });

  test("vision and mission cards: stacked on phones and tablets, side by side on desktop", async ({ page }) => {
    await page.goto("/sw/about");
    const sel = "section[aria-labelledby='purpose-title'] article";
    await expect(page.locator(sel)).toHaveCount(2);
    const l = new Set(await lefts(page, sel));
    const t = await tops(page, sel);
    if (isDesktop(page)) {
      expect(l.size).toBe(2);
      expect(new Set(t).size).toBe(1);
    } else {
      expect(l.size).toBe(1);
      expect(t[1]).toBeGreaterThan(t[0]);
    }
  });

  test("each purpose card has an icon, a divider and readable text", async ({ page }) => {
    await page.goto("/sw/about");
    const cards = page.locator("section[aria-labelledby='purpose-title'] article");
    for (let i = 0; i < 2; i++) {
      const card = cards.nth(i);
      const icon = (await card.locator("svg").first().boundingBox())!;
      const body = (await card.locator("h3").boundingBox())!;
      expect(icon.x + icon.width, "icon sits left of the text").toBeLessThanOrEqual(body.x);
      expect(icon.width).toBeGreaterThanOrEqual(40);
      const border = await card.locator("h3").locator("xpath=..").evaluate((el) => getComputedStyle(el).borderLeftWidth);
      expect(border, "divider").not.toBe("0px");
    }
  });

  test("objectives: 1 column on phones, 2 on tablets, 3 on desktop", async ({ page }) => {
    await page.goto("/sw/about");
    const cols = new Set(await lefts(page, "section[aria-labelledby='objectives-title'] li")).size;
    const w = width(page);
    expect(cols).toBe(w >= 900 ? 3 : w >= 560 ? 2 : 1);
  });

  test("photographs are not distorted", async ({ page }) => {
    await page.goto("/sw/about");
    for (const sel of ["section[aria-labelledby='who-title'] img", "section[aria-labelledby='about-title'] img"]) {
      const img = page.locator(sel).first();
      await expect(img).toHaveCSS("object-fit", "cover");
      await img.scrollIntoViewIfNeeded(); // lazy-loaded images only load near the viewport
      await expect
        .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), { message: sel })
        .toBe(true);
    }
    await expect(page.getByRole("img", { name: "Mkulima akishikilia mazao ya kijani shambani" })).toBeVisible();
  });

  test("the footer is visible and the last line clears the bottom bar", async ({ page }) => {
    test.skip(isDesktop(page), "no bottom bar on desktop");
    await page.goto("/sw/about");
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const navTop = (await page.getByRole("navigation", { name: "Menyu ya chini" }).boundingBox())!.y;
    const last = (await page.getByRole("contentinfo").locator("p").last().boundingBox())!;
    expect(last.y + last.height).toBeLessThanOrEqual(navTop + 1);
  });

  test("keyboard focus is visible on the breadcrumb link", async ({ page }) => {
    await page.goto("/sw/about");
    const link = page.getByRole("navigation", { name: "Njia ya ukurasa" }).getByRole("link", { name: "Karibu TDSP" });
    await link.focus();
    const outline = await link.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe("none");
  });
});
