import { expect, test } from "@playwright/test";
import { documents, filterDocuments, formatSize, type DocumentRecord } from "../lib/documents";
import { isDesktop, width } from "./helpers";

const SW = "/sw/kituo-cha-nyaraka";
const EN = "/en/document-centre";

// Filter logic, tested with clearly synthetic records that are NEVER shown on the site.
const fake = (id: string, title: string, category: DocumentRecord["category"]): DocumentRecord => ({
  id, title: { sw: title, en: title }, category, file: `${id}.pdf`, format: "PDF", sizeBytes: 2_500_000, publishedAt: "2026-01-01",
});
test.describe("Document Centre: filter logic (pure function)", () => {
  const list = [fake("a", "Alpha policy", "policy"), fake("b", "Beta report", "reports"), fake("c", "Gamma guide", "training")];
  test("searches title case-insensitively", () => {
    expect(filterDocuments(list, { query: "BETA" }, "sw").map((d) => d.id)).toEqual(["b"]);
  });
  test("filters by category and combines with search", () => {
    expect(filterDocuments(list, { category: "policy" }, "sw").map((d) => d.id)).toEqual(["a"]);
    expect(filterDocuments(list, { category: "policy", query: "beta" }, "sw")).toEqual([]);
  });
  test("empty query returns everything; unknown text returns nothing", () => {
    expect(filterDocuments(list, {}, "en")).toHaveLength(3);
    expect(filterDocuments(list, { query: "zzz" }, "en")).toEqual([]);
  });
  test("formats sizes", () => {
    expect(formatSize(1_572_864)).toBe("1.5 MB");
    expect(formatSize(20_000)).toBe("20 KB");
  });
  test("the real document list is empty until TDSP approves public documents", () => {
    expect(documents).toEqual([]);
  });
});

test.describe("Document Centre page", () => {
  test("routes: /sw/kituo-cha-nyaraka, /en/document-centre; other addresses redirect", async ({ page }) => {
    for (const p of [SW, EN]) {
      expect((await page.goto(p))?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("TDSP Document Centre");
    }
    for (const [from, to] of [["/sw/document-centre", /\/sw\/kituo-cha-nyaraka$/], ["/en/kituo-cha-nyaraka", /\/en\/document-centre$/], ["/sw/documents", /\/sw\/kituo-cha-nyaraka$/], ["/en/documents", /\/en\/document-centre$/]] as const) {
      await page.goto(from);
      await expect(page).toHaveURL(to);
    }
    await page.goto(SW);
    await page.getByRole("link", { name: "English", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/document-centre$/);
  });

  test("hero text, breadcrumb, search and four benefits", async ({ page }) => {
    await page.goto(SW);
    await expect(page.getByText("Nyaraka rasmi za umma, miongozo, ripoti na machapisho ya TDSP Farmers Value Chain.")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Njia ya ukurasa" }).locator("[aria-current='page']")).toHaveText("TDSP Document Centre");
    await expect(page.getByRole("search")).toBeVisible();
    await expect(page.locator("main ul").first().locator("h3")).toHaveText(["Nyaraka Rasmi", "Machapisho", "Rasilimali za Mafunzo", "Pakua kwa Urahisi"]);
  });

  test("the six category links work and mark the current one", async ({ page }) => {
    await page.goto(SW);
    const nav = page.getByRole("navigation", { name: "Makundi ya Nyaraka" });
    await expect(nav.locator("ul a")).toHaveText(["Zote", "Sera na Miongozo", "Mafunzo na Mielekezo", "Ripoti na Tathmini", "Machapisho", "Nyingine"]);
    await expect(nav.locator("[aria-current='true']")).toHaveText("Zote");
    await nav.getByRole("link", { name: "Ripoti na Tathmini" }).click();
    await expect(page).toHaveURL(/\?cat=reports$/);
    await expect(page.getByRole("navigation", { name: "Makundi ya Nyaraka" }).locator("[aria-current='true']")).toHaveText("Ripoti na Tathmini");
    await expect(page.getByRole("heading", { level: 2, name: "Matokeo ya utafutaji" })).toBeVisible();
  });

  test("search works with the button and with Enter, and keeps the language", async ({ page }) => {
    await page.goto(SW);
    await page.getByRole("searchbox").fill("sera");
    await page.getByRole("button", { name: "Tafuta", exact: true }).click();
    await expect(page).toHaveURL(/kituo-cha-nyaraka\?q=sera$/);
    await expect(page.getByRole("searchbox")).toHaveValue("sera");
    await page.getByRole("searchbox").fill("ripoti");
    await page.getByRole("searchbox").press("Enter");
    await expect(page).toHaveURL(/\?q=ripoti$/);
    await page.goto(EN);
    await page.getByRole("searchbox").fill("guide");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/document-centre\?q=guide$/);
  });

  test("with no published documents the page says so honestly and invents nothing", async ({ page }) => {
    for (const [p, none, h] of [[SW, "Hakuna nyaraka zilizochapishwa bado.", "Nyaraka za Hivi Karibuni"], [EN, "No documents have been published yet.", "Recent Documents"]] as const) {
      await page.goto(p);
      await expect(page.getByRole("heading", { level: 2, name: h })).toBeVisible();
      await expect(page.getByRole("status")).toContainText(none);
      const t = await page.locator("main").innerText();
      expect(t, p).not.toMatch(/\d+(\.\d+)?\s?(MB|KB)|\b(Nov|Oct|Dec)\b\s?\d{4}|\b\d{2}\s?(Nov|Oct)\b|Mwongozo wa Ushiriki|Muhtasari wa TDSP/);
      await expect(page.locator("a[download]")).toHaveCount(0);
      await expect(page.getByText("Pakua Sasa")).toHaveCount(0);
      await expect(page.getByRole("note")).toBeVisible();
    }
    await page.goto(`${SW}?q=sera`);
    await expect(page.getByRole("status")).toContainText("Hakuna nyaraka zilizochapishwa bado."); // never "found N documents"
  });

  test("featured area is an honest placeholder, not a fake publication", async ({ page }) => {
    await page.goto(SW);
    await expect(page.getByRole("complementary", { name: "Nyaraka Teule" })).toContainText("itaonekana hapa baada ya TDSP kuchapisha");
  });

  test("access note: only public approved documents", async ({ page }) => {
    await page.goto(SW);
    await expect(page.getByRole("note")).toContainText("nyaraka za umma zilizoidhinishwa na TDSP pekee");
    await page.goto(EN);
    await expect(page.getByRole("note")).toContainText("Only public documents approved by TDSP");
  });

  test("banner contact button goes to the existing contact page", async ({ page }) => {
    await page.goto(SW);
    await expect(page.getByText("Unatafuta Nyaraka Maalum?")).toBeVisible();
    await expect(page.getByRole("link", { name: "Wasiliana Nasi" })).toHaveAttribute("href", "/sw/mawasiliano");
    await page.goto(EN);
    await page.getByRole("link", { name: "Contact Us" }).click();
    await expect(page).toHaveURL(/\/en\/contact$/);
  });

  test("English is fully translated; no company wording", async ({ page }) => {
    await page.goto(EN);
    const t = await page.locator("main").innerText();
    for (const sw of ["Nyaraka", "Makundi", "Tafuta", "Pakua", "Zote", "Wasiliana"]) expect(t).not.toContain(sw);
    expect(t).not.toMatch(/kampuni|compan/i);
  });

  test("navigation: Huduma highlighted on desktop", async ({ page }) => {
    test.skip(!isDesktop(page), "desktop header only");
    await page.goto(SW);
    await expect(page.locator("#site-nav [aria-current='page']")).toHaveText("Huduma");
  });

  test("layout: categories scroll sideways inside their box on phones; side-by-side from 900px; 3 columns from 1200px", async ({ page }) => {
    await page.goto(SW);
    const w = width(page);
    const cats = (await page.getByRole("navigation", { name: "Makundi ya Nyaraka" }).boundingBox())!;
    const recent = (await page.locator("section[aria-labelledby='dc-recent']").boundingBox())!;
    const feat = (await page.getByRole("complementary", { name: "Nyaraka Teule" }).boundingBox())!;
    if (w >= 900) expect(cats.x + cats.width).toBeLessThanOrEqual(recent.x + 1);
    else expect(cats.y + cats.height).toBeLessThanOrEqual(recent.y + 1);
    if (w >= 1200) expect(recent.x + recent.width).toBeLessThanOrEqual(feat.x + 1);
    else expect(recent.y + recent.height).toBeLessThanOrEqual(feat.y + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    expect(cats.x + cats.width).toBeLessThanOrEqual(w);
  });

  test("search bar fits, button not clipped; all controls tappable", async ({ page }) => {
    for (const p of [SW, EN]) {
      await page.goto(p);
      const form = (await page.getByRole("search").boundingBox())!;
      const btn = (await page.getByRole("button", { name: /Tafuta|Search/ }).boundingBox())!;
      expect(form.x + form.width).toBeLessThanOrEqual(width(page));
      expect(btn.x + btn.width).toBeLessThanOrEqual(form.x + form.width + 1);
      expect(btn.height).toBeGreaterThanOrEqual(43.5);
    }
  });

  test("hero text clears the booklet photo (sweep, both languages)", async ({ page }, info) => {
    test.skip(info.project.name !== "w1280" && width(page) >= 560, "sweep runs once");
    const widths = width(page) >= 560 ? [900, 1024, 1100, 1200, 1280, 1366, 1439, 1440, 1600, 1920] : [width(page)];
    for (const [lang, path] of [["sw", SW], ["en", EN]] as const) for (const w of widths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto(path);
      const hero = page.locator("main section").first();
      const photoLeft = (await hero.locator("[role=img]").boundingBox())!.x;
      const rights = await hero.evaluate((sec) => ["h1", "p"].map((q) => { const el = sec.querySelector(q)!; const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right; }));
      const limit = w >= 900 ? w * 0.46 : w >= 560 ? photoLeft + 0.3 * (w - photoLeft) : w * 0.66;
      rights.forEach((r, i) => expect(r, `${lang} ${w}px`).toBeLessThanOrEqual((i === 0 ? limit : limit + (w >= 900 ? w * 0.03 : 0)) + 4));
    }
  });

  test("no overflow; last content clears the bottom bar", async ({ page }) => {
    for (const p of [SW, EN, `${SW}?q=x&cat=policy`]) {
      await page.goto(p, { waitUntil: "load" });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    }
    test.skip(isDesktop(page), "no bottom bar on desktop");
    await expect.poll(async () => {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const barTop = (await page.getByRole("navigation", { name: "Menyu ya chini" }).boundingBox())!.y;
      const last = (await page.getByRole("contentinfo").locator("p").last().boundingBox())!;
      return last.y + last.height <= barTop + 1;
    }).toBe(true);
  });
});
