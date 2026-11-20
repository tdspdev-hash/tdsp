import { expect, test } from "@playwright/test";

/* Sweeps the desktop header across widths, resizing the window itself, so the
   breakpoints are checked where the layout actually changes (not just at the
   seven project widths). Runs once (in the 1280 project). */
const WIDTHS = [900, 960, 1024, 1099, 1100, 1199, 1200, 1280, 1359, 1360, 1439, 1440, 1600];

const intersects = (a: DOMRect | { x: number; y: number; width: number; height: number }, b: typeof a) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

test("desktop header adapts at every width without squeezing", async ({ page }, info) => {
  test.skip(info.project.name !== "w1280", "sweep runs once");
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.goto("/sw");
    const tag = `@${w}px`;

    const banner = page.getByRole("banner");
    const brand = banner.locator("a").first();
    const nav = page.locator("#site-nav");
    const join = banner.getByRole("link", { name: "Jiunge na TDSP" });

    const [bb, nb, jb] = [await brand.boundingBox(), await nav.boundingBox(), await join.boundingBox()];
    expect(bb && nb && jb, `${tag} header parts exist`).toBeTruthy();

    // 1. nothing is cut off at the right edge
    for (const [name, box] of [["brand", bb!], ["nav", nb!], ["join", jb!]] as const) {
      expect(box.x, `${tag} ${name} left`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `${tag} ${name} right edge`).toBeLessThanOrEqual(w - 8);
    }

    // 2. no overlapping pieces
    expect(intersects(bb!, nb!), `${tag} brand overlaps nav`).toBe(false);
    expect(intersects(nb!, jb!), `${tag} nav overlaps join`).toBe(false);
    expect(intersects(bb!, jb!), `${tag} brand overlaps join`).toBe(false);

    // 3. every nav label is on one line
    const links = nav.locator("a");
    for (let i = 0; i < (await links.count()); i++) {
      expect((await links.nth(i).boundingBox())!.height, `${tag} nav link ${i}`).toBeLessThan(60);
    }

    // 4. layout tier: two rows below 1200, one row from 1200
    if (w < 1280) expect(nb!.y, `${tag} nav sits below the brand row`).toBeGreaterThanOrEqual(bb!.y + bb!.height - 1);
    else expect(Math.abs(nb!.y + nb!.height / 2 - (bb!.y + bb!.height / 2)), `${tag} one row`).toBeLessThan(40);

    // 5. branding: compact name 900-1359, full organisation name from 1360, tagline from 1440
    const compact = banner.getByText("TDSP Farmers Value Chain", { exact: true });
    const full = banner.getByText("Today's Development and Skills Promotion Organization", { exact: true });
    const tagline = banner.getByText("Kilimo ni biashara, mkulima ni mwekezaji.", { exact: true });
    if (w >= 1360) { await expect(full, `${tag} full name`).toBeVisible(); await expect(compact).toBeHidden(); }
    else { await expect(compact, `${tag} compact name`).toBeVisible(); await expect(full).toBeHidden(); }
    if (w >= 1440) await expect(tagline, `${tag} tagline`).toBeVisible();
    else await expect(tagline, `${tag} tagline hidden`).toBeHidden();

    // 6. the page itself does not scroll sideways
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${tag} page overflow`).toBeLessThanOrEqual(0);
  }
});
