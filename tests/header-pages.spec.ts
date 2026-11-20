import { expect, test } from "@playwright/test";

/* The shared header on all five finished pages, both languages, at the widths
   where it is tightest. Runs once (1280 project) and resizes the window. */
const PAGES = ["", "/about", "/uanachama|/membership", "/farmers-value-chain", "/miradi-na-andiko|/projects-and-proposals"];
const WIDTHS = [900, 1024, 1100, 1200, 1280, 1359, 1366, 1440];
const hit = (a: { x: number; y: number; width: number; height: number }, b: typeof a) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

test("header: seven items fit without overlap on pages 1-5 in both languages", async ({ page }, info) => {
  test.skip(info.project.name !== "w1280", "sweep runs once");
  for (const lang of ["sw", "en"]) {
    for (const entry of PAGES) {
      const [sw, en] = entry.split("|");
      const path = `/${lang}${lang === "sw" ? sw : en ?? sw}`;
      for (const w of WIDTHS) {
        await page.setViewportSize({ width: w, height: 800 });
        await page.goto(path);
        const tag = `${path} @${w}`;
        const nav = page.locator("#site-nav");
        const links = nav.locator("a");
        await expect(links, tag).toHaveCount(7);
        const nb = (await nav.boundingBox())!;
        const brand = (await page.getByRole("banner").locator("a").first().boundingBox())!;
        const join = (await page.getByRole("banner").locator("a[href$='/join']").boundingBox())!;
        expect(nb.x, `${tag} nav left`).toBeGreaterThanOrEqual(0);
        expect(nb.x + nb.width, `${tag} nav right edge`).toBeLessThanOrEqual(w - 8);
        expect(join.x + join.width, `${tag} join right edge`).toBeLessThanOrEqual(w - 8);
        expect(hit(brand, nb), `${tag} brand/nav`).toBe(false);
        expect(hit(nb, join), `${tag} nav/join`).toBe(false);
        for (let i = 0; i < 7; i++) expect((await links.nth(i).boundingBox())!.height, `${tag} link ${i} wraps`).toBeLessThan(60);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), `${tag} overflow`).toBeLessThanOrEqual(0);
      }
    }
  }
});

test("the new item is highlighted on its own page and leads there", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 900, "header navigation is desktop-only");
  await page.goto("/sw");
  await page.locator("#site-nav").getByRole("link", { name: "Miradi & Andiko", exact: true }).click();
  await expect(page).toHaveURL(/\/sw\/miradi-na-andiko$/);
  await expect(page.locator("#site-nav [aria-current='page']")).toHaveText("Miradi & Andiko");
  await page.goto("/en");
  await page.locator("#site-nav").getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/projects-and-proposals$/);
});
