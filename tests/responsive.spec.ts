import { expect, test } from "@playwright/test";
import { isDesktop, PAGES, width } from "./helpers";

const LANGS = ["sw", "en"] as const;

for (const lang of LANGS) {
  for (const path of PAGES) {
    test(`no horizontal overflow: /${lang}${path}`, async ({ page }) => {
      await page.goto(`/${lang}${path}`);
      const overflow = await page.evaluate(() => {
        const el = document.documentElement;
        return el.scrollWidth - el.clientWidth;
      });
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}

test("phones have a bottom bar and no hamburger; desktop has the header navigation", async ({ page }) => {
  await page.goto("/sw");
  const bottom = page.getByRole("navigation", { name: "Menyu ya chini" });
  const top = page.locator("#site-nav");
  if (isDesktop(page)) {
    await expect(top).toBeVisible();
    await expect(bottom).toBeHidden();
  } else {
    await expect(bottom).toBeVisible();
    await expect(top).toBeHidden();
    await expect(page.locator("button[aria-controls='site-nav']")).toHaveCount(0);
  }
});

test("header controls and the bottom bar meet the 44px touch target", async ({ page }) => {
  await page.goto("/sw");
  const controls = page.locator("header a, header button, nav[aria-label='Menyu ya chini'] a");
  const count = await controls.count();
  let checked = 0;
  for (let i = 0; i < count; i++) {
    const el = controls.nth(i);
    if (!(await el.isVisible())) continue;
    const box = (await el.boundingBox())!;
    expect(box.height, `control ${i}`).toBeGreaterThanOrEqual(43.5);
    checked++;
  }
  expect(checked).toBeGreaterThan(3);
});

test("language switcher is fully visible and not clipped", async ({ page }) => {
  await page.goto("/sw");
  const w = width(page);
  for (const name of ["Kiswahili", "English"]) {
    const link = page.getByRole("link", { name, exact: true });
    const box = await link.boundingBox();
    expect(box, name).not.toBeNull();
    expect(box!.x, `${name} left edge`).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width, `${name} right edge`).toBeLessThanOrEqual(w);
    const clipped = await link.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    expect(clipped, `${name} clipped`).toBe(false);
  }
});

test("desktop navigation labels stay on one line", async ({ page }) => {
  await page.goto("/sw");
  const nav = page.locator("#site-nav");
  test.skip(!(await nav.isVisible()), "navigation is the bottom bar on this width");
  const links = nav.locator("a");
  for (let i = 0; i < (await links.count()); i++) {
    const box = (await links.nth(i).boundingBox())!;
    expect(box.height, `nav link ${i}`).toBeLessThan(60);
  }
});

test("the header stays at the top while scrolling", async ({ page }) => {
  await page.goto("/sw");
  await page.evaluate(() => window.scrollTo(0, 600));
  const box = (await page.getByRole("banner").boundingBox())!;
  expect(Math.round(box.y)).toBe(0);
});

test("the logo is never squashed or clipped", async ({ page }) => {
  await page.goto("/sw");
  const logo = page.getByRole("banner").locator("img").first();
  const box = (await logo.boundingBox())!;
  expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(1);
  expect(box.width).toBeGreaterThanOrEqual(40);
});

test("no header control is cut off at the right edge", async ({ page }) => {
  // Body-level overflow is hidden, so the page-overflow test cannot see this.
  await page.goto("/sw");
  const w = width(page);
  // Header and contact strip keep an 8px margin; the bottom bar is full width by design.
  const inset = page.locator("header a, header button, ul[aria-label='Taarifa za mawasiliano'] a");
  const full = page.locator("nav[aria-label='Menyu ya chini'] a");
  for (const [controls, margin] of [[inset, 8], [full, 0]] as const) {
    const n = await controls.count();
    for (let i = 0; i < n; i++) {
      const el = controls.nth(i);
      if (!(await el.isVisible())) continue;
      const box = (await el.boundingBox())!;
      expect(box.x, `control ${i} left`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `control ${i} right edge`).toBeLessThanOrEqual(w - margin);
    }
  }
});

test("the join button is fully visible on desktop", async ({ page }) => {
  await page.goto("/sw");
  test.skip(!isDesktop(page), "desktop only");
  const btn = page.getByRole("banner").getByRole("link", { name: "Jiunge na TDSP" });
  const box = (await btn.boundingBox())!;
  expect(box.x + box.width).toBeLessThanOrEqual(width(page) - 16);
  const clipped = await btn.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
  expect(clipped).toBe(false);
});

test("mobile footer links form a tidy two-column grid with no orphan", async ({ page }) => {
  test.skip(width(page) >= 560, "two-column footer is a phone layout");
  await page.goto("/sw");
  const links = page.getByRole("navigation", { name: "Viungo vya chini" }).getByRole("link");
  await expect(links).toHaveCount(8);
  const boxes = [];
  for (let i = 0; i < 8; i++) boxes.push((await links.nth(i).boundingBox())!);
  const lefts = new Set(boxes.map((b) => Math.round(b.x)));
  const tops = new Set(boxes.map((b) => Math.round(b.y)));
  expect(lefts.size, "two columns").toBe(2);
  expect(tops.size, "four rows (an even count, so no link alone on a row)").toBe(4);
  for (const b of boxes) expect(b.height).toBeGreaterThanOrEqual(43.5);
});

test("footer links are not underlined by default", async ({ page }) => {
  await page.goto("/sw");
  const link = page.getByRole("navigation", { name: "Viungo vya chini" }).getByRole("link").first();
  const deco = await link.evaluate((el) => getComputedStyle(el).textDecorationLine);
  expect(deco).toBe("none");
});
