import { expect, test } from "@playwright/test";

/* Default (launch) mode: SITE_PREVIEW is unset, so crawlers are allowed.
   Preview mode (SITE_PREVIEW=1 on the build) returns "Disallow: /" and a
   noindex meta tag; that is checked by building with the flag set. */
test.describe("search engine rules (default mode)", () => {
  test("robots.txt allows crawling when not in preview mode", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("Allow: /");
    expect(body).not.toContain("Disallow: /\n");
  });

  test("pages carry no noindex tag when not in preview mode", async ({ page }) => {
    await page.goto("/sw");
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  });

  test("the hidden coming-soon page stays noindex", async ({ page }) => {
    await page.goto("/sw/coming-soon");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});
