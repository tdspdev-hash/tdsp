import { expect, test } from "@playwright/test";
import { isDesktop, width } from "./helpers";

const lefts = (page: import("@playwright/test").Page, sel: string) =>
  page.locator(sel).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));

test.describe("Miradi & Andiko", () => {
  test("routes: one canonical address per language, others redirect", async ({ page }) => {
    for (const [p, h1] of [["/sw/miradi-na-andiko", "Miradi & Andiko"], ["/en/projects-and-proposals", "Projects & Proposals"]] as const) {
      expect((await page.goto(p))?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
    }
    await page.goto("/sw/projects-and-proposals");
    await expect(page).toHaveURL(/\/sw\/miradi-na-andiko$/);
    await page.goto("/en/miradi-na-andiko");
    await expect(page).toHaveURL(/\/en\/projects-and-proposals$/);
  });

  test("the language switcher keeps the page", async ({ page }) => {
    await page.goto("/sw/miradi-na-andiko");
    await page.getByRole("link", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/projects-and-proposals$/);
    await page.getByRole("link", { name: "Kiswahili", exact: true }).click();
    await expect(page).toHaveURL(/\/sw\/miradi-na-andiko$/);
  });

  test("the home service card leads here (both languages)", async ({ page }) => {
    await page.goto("/en");
    await page.locator("section[aria-labelledby='services-title']").getByRole("link", { name: /Projects/ }).click();
    await expect(page).toHaveURL(/\/en\/projects-and-proposals$/);
  });

  test("hero, four services and breadcrumb", async ({ page }) => {
    await page.goto("/sw/miradi-na-andiko");
    await expect(page.getByText("Miradi ya maendeleo ya kilimo na andiko (maombi) ya ufadhili kwa ushirikiano na wadau mbalimbali.")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Njia ya ukurasa" }).getByRole("link", { name: "Karibu TDSP" })).toHaveAttribute("href", "/sw");
    await expect(page.locator("section[aria-labelledby='pm-services'] h3")).toHaveText(["Utekelezaji wa Miradi", "Andiko la Ufadhili", "Ushirikiano wa Kimkakati", "Ufuatiliaji na Tathmini"]);
  });

  test("three projects with image, status, period and location", async ({ page }) => {
    await page.goto("/sw/miradi-na-andiko");
    const cards = page.locator("section[aria-labelledby='pm-list'] li");
    await expect(cards).toHaveCount(3);
    await expect(cards.locator("h3")).toHaveText(["Mradi wa Kilimo cha Umwagiliaji", "Mradi wa Ufugaji wa Kuku", "Mradi wa Mafunzo kwa Wakulima"]);
    await expect(cards.locator("span").filter({ hasText: /Inaendelea|Imekamilika/ })).toHaveText(["Inaendelea", "Inaendelea", "Imekamilika"]);
    for (const t of ["2025–2027", "Morogoro", "Dodoma", "Iringa"]) await expect(page.getByText(t, { exact: true }).first()).toBeAttached();
    for (const img of await cards.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
      expect(await img.getAttribute("alt")).toBeTruthy();
    }
  });

  test("offline (Supabase unset) the list uses the labelled sample content, never invented data", async ({ page }) => {
    await page.goto("/sw/miradi-na-andiko");
    await expect(page.locator("section[aria-labelledby='pm-list'] ul")).toHaveAttribute("data-source", "sample");
    await expect(page.getByRole("note")).toBeVisible();
  });

  test("the sample projects are clearly marked as not real records", async ({ page }) => {
    await page.goto("/sw/miradi-na-andiko");
    await expect(page.getByRole("note")).toContainText("si taarifa halisi zilizothibitishwa za TDSP");
    await page.goto("/en/projects-and-proposals");
    await expect(page.getByRole("note")).toContainText("not verified TDSP records");
  });

  test("no 'view all' link; each card has exactly one link, to its own detail page", async ({ page }) => {
    await page.goto("/sw/miradi-na-andiko");
    await expect(page.getByText("Tazama Miradi Yote")).toHaveCount(0);
    const links = page.locator("section[aria-labelledby='pm-list'] li a");
    await expect(links).toHaveCount(3);
    await expect(links).toHaveText(["Mradi wa Kilimo cha Umwagiliaji", "Mradi wa Ufugaji wa Kuku", "Mradi wa Mafunzo kwa Wakulima"]);
    for (const [i, id] of ["irrigation", "poultry", "training"].entries()) {
      await expect(links.nth(i)).toHaveAttribute("href", `/sw/miradi-na-andiko/${id}`);
    }
    await page.goto("/en/projects-and-proposals");
    await expect(page.locator("section[aria-labelledby='pm-list'] li a").first()).toHaveAttribute("href", "/en/projects-and-proposals/irrigation");
  });

  test("both CTAs go to the existing contact page", async ({ page }) => {
    await page.goto("/sw/miradi-na-andiko");
    await expect(page.getByRole("link", { name: "Wasiliana Kuhusu Andiko" })).toHaveAttribute("href", "/sw/mawasiliano");
    await expect(page.getByRole("link", { name: "Tujadili Ushirikiano" })).toHaveAttribute("href", "/sw/mawasiliano");
    await page.goto("/en/projects-and-proposals");
    await expect(page.getByRole("link", { name: "Contact Us About a Proposal" })).toHaveAttribute("href", "/en/contact");
    await page.getByRole("link", { name: "Let's Discuss Partnership" }).click();
    await expect(page).toHaveURL(/\/en\/contact$/);
  });

  test("English is fully translated", async ({ page }) => {
    await page.goto("/en/projects-and-proposals");
    const t = await page.locator("main").innerText();
    for (const sw of ["Utekelezaji", "Miradi Yetu", "Andiko la", "Inaendelea", "Shirikiana Nasi"]) expect(t).not.toContain(sw);
    await expect(page.getByText("Our Projects")).toBeVisible();
  });

  test("navigation marks the page (desktop header) and no unapproved statistics or claims", async ({ page }) => {
    await page.goto("/sw/miradi-na-andiko");
    const t = await page.locator("main").innerText();
    expect(t).not.toMatch(/TSh|mikopo|loan|kampuni|company/i);
  });

  test("layout by width: services, projects, proposal", async ({ page }) => {
    await page.goto("/sw/miradi-na-andiko");
    const w = width(page);
    const svc = new Set(await lefts(page, "section[aria-labelledby='pm-services'] li")).size;
    expect(svc).toBe(w >= 1200 ? 4 : 2);
    const proj = new Set(await lefts(page, "section[aria-labelledby='pm-list'] li")).size;
    expect(proj).toBe(w >= 1200 || (w >= 700 && w < 900) ? 3 : w >= 560 ? 2 : 1);
    const list = (await page.locator("section[aria-labelledby='pm-list']").boundingBox())!;
    const prop = (await page.locator("aside[aria-labelledby='pm-proposal']").boundingBox())!;
    if (isDesktop(page)) expect(list.x + list.width).toBeLessThanOrEqual(prop.x + 1);
    else expect(list.y + list.height).toBeLessThanOrEqual(prop.y + 1);
  });

  test("hero text stays left of the farmer from 900px to 1439px and on phones", async ({ page }, info) => {
    test.skip(info.project.name !== "w1280" && width(page) >= 560, "sweep runs once");
    const widths = width(page) >= 560 ? [900, 1024, 1100, 1200, 1280, 1366, 1439, 1440, 1600, 1920] : [width(page)];
    for (const lang of ["sw", "en"]) for (const w of widths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto(lang === "sw" ? "/sw/miradi-na-andiko" : "/en/projects-and-proposals");
      const photoLeft = (await page.locator("main section").first().locator("[role=img]").boundingBox())!.x;
      const rights = await page.locator("main section").first().evaluate((sec) => ["h1", "p"].map((q) => { const el = sec.querySelector(q)!; const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right; }));
      const limit = w >= 1440 ? photoLeft - 24 : w >= 560 ? photoLeft + 0.1 * (w - photoLeft) : w * 0.5;
      for (const r of rights) expect(r, `${lang} ${w}px`).toBeLessThanOrEqual(limit + 4);
    }
  });

  test("no horizontal overflow and the last content clears the bottom bar", async ({ page }) => {
    for (const p of ["/sw/miradi-na-andiko", "/en/projects-and-proposals"]) {
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

test.describe("Project detail pages (information only)", () => {
  const PROJECTS = [
    { id: "irrigation", sw: "Mradi wa Kilimo cha Umwagiliaji", en: "Irrigation Farming Project", swStatus: "Inaendelea", period: "2025–2027", place: "Morogoro" },
    { id: "poultry", sw: "Mradi wa Ufugaji wa Kuku", en: "Poultry Farming Project", swStatus: "Inaendelea", period: "2025–2026", place: "Dodoma" },
    { id: "training", sw: "Mradi wa Mafunzo kwa Wakulima", en: "Farmer Training Project", swStatus: "Imekamilika", period: "2023–2024", place: "Iringa" },
  ];

  test("each card opens its own page, in both languages", async ({ page }) => {
    for (const p of PROJECTS) {
      await page.goto("/sw/miradi-na-andiko");
      await page.locator("section[aria-labelledby='pm-list']").getByRole("link", { name: p.sw }).click();
      await expect(page).toHaveURL(new RegExp(`/sw/miradi-na-andiko/${p.id}$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.sw);
      await page.goto("/en/projects-and-proposals");
      await page.locator("section[aria-labelledby='pm-list']").getByRole("link", { name: p.en }).click();
      await expect(page).toHaveURL(new RegExp(`/en/projects-and-proposals/${p.id}$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.en);
    }
  });

  test("shows status, period, location, description, objectives and target group", async ({ page }) => {
    for (const p of PROJECTS) {
      await page.goto(`/sw/miradi-na-andiko/${p.id}`);
      const facts = page.locator("dl").last();
      await expect(facts).toContainText(p.swStatus);
      await expect(facts).toContainText(p.period);
      await expect(facts).toContainText(p.place);
      await expect(page.getByRole("heading", { level: 2, name: "Kuhusu Mradi" })).toBeVisible();
      await expect(page.getByRole("heading", { level: 2, name: "Malengo ya Mradi" })).toBeVisible();
      await expect(page.getByRole("heading", { level: 2, name: "Walengwa" })).toBeVisible();
      await expect(page.locator("article ul li")).toHaveCount(3);
      const img = page.locator("article img");
      await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
      expect(await img.getAttribute("alt")).toBeTruthy();
    }
  });

  test("clearly marked as sample information", async ({ page }) => {
    await page.goto("/sw/miradi-na-andiko/irrigation");
    await expect(page.getByRole("note")).toContainText("si taarifa halisi zilizothibitishwa za TDSP");
    await page.goto("/en/projects-and-proposals/irrigation");
    await expect(page.getByRole("note")).toContainText("not verified TDSP records");
  });

  test("information only: no donation, funding, money or loan wording", async ({ page }) => {
    for (const path of PROJECTS.flatMap((p) => [`/sw/miradi-na-andiko/${p.id}`, `/en/projects-and-proposals/${p.id}`])) {
      await page.goto(path);
      const t = await page.locator("main").innerText();
      expect(t, path).not.toMatch(/TSh|TZS|donat|chang(ia|ishi)|contribut|pledge|ahadi|fund(ing)?\b|ufadhili wa|mikopo|loan|kampuni|company|\d+%/i);
    }
  });

  test("breadcrumb is Home > Miradi & Andiko > project; back link and language switch work", async ({ page }) => {
    await page.goto("/sw/miradi-na-andiko/poultry");
    const crumb = page.getByRole("navigation", { name: "Njia ya ukurasa" });
    await expect(crumb.locator("[aria-current='page']")).toHaveText("Mradi wa Ufugaji wa Kuku");
    await expect(crumb.getByRole("link", { name: "Miradi & Andiko" })).toHaveAttribute("href", "/sw/miradi-na-andiko");
    await page.getByRole("link", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/projects-and-proposals\/poultry$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Poultry Farming Project");
    await page.getByRole("link", { name: "Back to Projects" }).click();
    await expect(page).toHaveURL(/\/en\/projects-and-proposals$/);
  });

  test("other-language address and unknown projects", async ({ page }) => {
    await page.goto("/en/miradi-na-andiko/training");
    await expect(page).toHaveURL(/\/en\/projects-and-proposals\/training$/);
    await page.goto("/sw/projects-and-proposals/training");
    await expect(page).toHaveURL(/\/sw\/miradi-na-andiko\/training$/);
    expect((await page.goto("/sw/miradi-na-andiko/does-not-exist"))?.status()).toBe(404);
  });

  test("English page is fully translated", async ({ page }) => {
    await page.goto("/en/projects-and-proposals/irrigation");
    const t = await page.locator("main").innerText();
    for (const sw of ["Kuhusu", "Malengo", "Walengwa", "Inaendelea", "Rudi", "Shirikiana Nasi", "wakulima"]) expect(t).not.toContain(sw);
  });

  test("hero text stays clear of the farmer, no overflow, clears the bottom bar", async ({ page }, info) => {
    const sweep = info.project.name === "w1280" || width(page) < 560;
    const widths = !sweep ? [] : width(page) >= 560 ? [900, 1024, 1100, 1200, 1280, 1439, 1440, 1920] : [width(page)];
    for (const path of ["/sw/miradi-na-andiko/irrigation", "/en/projects-and-proposals/training"]) {
      for (const w of widths) {
        await page.setViewportSize({ width: w, height: 800 });
        await page.goto(path);
        const photoLeft = (await page.locator("main section").first().locator("[role=img]").boundingBox())!.x;
        const rights = await page.locator("main section").first().evaluate((sec) => ["h1", "p"].map((q) => { const el = sec.querySelector(q)!; const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right; }));
        const limit = w >= 1440 ? photoLeft - 24 : w >= 560 ? photoLeft + 0.1 * (w - photoLeft) : w * 0.5;
        for (const r of rights) expect(r, `${path} ${w}px`).toBeLessThanOrEqual(limit + 4);
      }
      await page.goto(path, { waitUntil: "load" });
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
