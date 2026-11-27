import { expect, test, type Page } from "@playwright/test";

const ORDER_SW = ["Dashibodi", "Wasifu Wangu", "Uanachama Wangu", "Maombi ya Huduma", "Masoko", "Mafunzo", "Nyaraka", "Arifa", "Mipangilio"];
const SLUGS = ["dashboard", "profile", "membership", "service-requests", "markets", "training", "documents", "notifications", "settings"];

async function signIn(page: Page, email: string) {
  await page.goto("/sw/login");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill("synthetic-pass-1");
  await page.locator("form").getByRole("button", { name: /Ingia/ }).click();
}
const noOverflow = async (page: Page) =>
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);

test("approved member lands on the dashboard with their own information", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await signIn(page, "member@example.com");
  await expect(page).toHaveURL(/\/sw\/member\/dashboard$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Dashibodi");
  const card = page.locator("section[aria-labelledby=db-membership]");
  for (const text of ["Mwanachama Wa Majaribio", "TDSP/0001/2026", "Mwanachama Hai", "Hai (umeidhinishwa)"]) await expect(card).toContainText(text);
  await expect(page.getByText("Bado haipatikani")).toHaveCount(3); // no invented counts
  await expect(page.locator("section[aria-labelledby=db-activity] li")).toHaveCount(2);
  await expect(page.locator("main")).not.toContainText(/20,000|50,000|100,000/);
  await noOverflow(page);
  expect(errors).toEqual([]);
  if (info.project.name === "desktop") await page.screenshot({ path: "test-results/member-dashboard-1440.png", fullPage: true });
});

test("member menu: order, active item, every link works, no overflow", async ({ page }) => {
  await signIn(page, "member@example.com");
  await expect(page).toHaveURL(/dashboard$/);
  const menu = page.getByRole("navigation", { name: "Menyu ya mwanachama" });
  await expect(menu.getByRole("link")).toHaveText(ORDER_SW);
  // Icons must not be squeezed away in the scrolling phone menu.
  expect(await menu.locator("svg").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().width)))).toEqual(Array(9).fill(20));
  for (const [i, slug] of SLUGS.entries()) {
    await menu.getByRole("link", { name: ORDER_SW[i] }).click();
    await expect(page).toHaveURL(new RegExp(`/sw/member/${slug}$`));
    await expect(menu.locator("[aria-current=page]")).toHaveText(ORDER_SW[i]);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(ORDER_SW[i]);
    await noOverflow(page);
  }
  await page.goto("/en/member/dashboard");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Dashboard");
  expect(await page.locator("main").innerText()).not.toMatch(/Dashibodi|Uanachama|Mipangilio/);
  // Unknown member address: "not found" content. The status is 200 because loading.tsx streams the response.
  await page.goto("/sw/member/admin");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ukurasa haujapatikana");
  expect((await page.goto("/sw/admin"))?.status()).toBe(404);
});

test("signed in without a membership: no member access", async ({ page }) => {
  await signIn(page, "applicant@example.com");
  await expect(page).toHaveURL(/\/sw\/akaunti$/);
  await expect(page.getByText("Bado si mwanachama")).toBeVisible();
  for (const slug of SLUGS) {
    await page.goto(`/sw/member/${slug}`);
    await expect(page, slug).toHaveURL(/\/sw\/akaunti$/);
  }
  await expect(page.locator("main")).not.toContainText("TDSP/0001");
});

test("membership lookup fails: error state, no member data, not called a non-member", async ({ page }) => {
  await signIn(page, "broken@example.com");
  await expect(page).toHaveURL(/\/sw\/akaunti$/);
  await expect(page.getByRole("alert").filter({ hasText: "Hatukuweza kuthibitisha uanachama" })).toBeVisible();
  await expect(page.getByText("Bado si mwanachama")).toHaveCount(0);
  await page.goto("/sw/member/dashboard");
  await expect(page.getByRole("alert").filter({ hasText: "Hatukuweza kuthibitisha uanachama" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Menyu ya mwanachama" })).toHaveCount(0);
  await expect(page.locator("section[aria-labelledby=db-membership]")).toHaveCount(0);
});

test("missing values show an empty state, not invented ones", async ({ page }) => {
  await signIn(page, "sparse@example.com");
  await expect(page).toHaveURL(/dashboard$/);
  await expect(page.locator("section[aria-labelledby=db-membership]").getByText("Haijarekodiwa")).toHaveCount(2);
});

test("every query is filtered to the signed-in user", async ({ page, request }) => {
  await signIn(page, "member@example.com");
  await expect(page).toHaveURL(/dashboard$/);
  await page.goto("/sw/member/membership?user_id=00000000-0000-4000-8000-000000000002");
  await expect(page.locator("main")).toContainText("Mwanachama Wa Majaribio");
  const log: { table: string; query: string; as: string }[] = await (await request.get("http://127.0.0.1:54999/log")).json();
  const mine = log.filter((l) => l.as === "member@example.com");
  expect(mine.length).toBeGreaterThan(0);
  const own = "00000000-0000-4000-8000-000000000001";
  for (const l of mine) {
    const filter = l.table === "profiles" ? `id=eq.${own}` : `user_id=eq.${own}`;
    expect(l.query, l.table).toContain(filter);
  }
});

test("sign-out from the account menu closes member access", async ({ page }) => {
  await signIn(page, "member@example.com");
  await expect(page).toHaveURL(/dashboard$/);
  await page.locator("summary[aria-label='Menyu ya akaunti']").click();
  await page.getByRole("button", { name: "Ondoka" }).click();
  await expect(page).toHaveURL(/\/sw\/login$/);
  await page.goto("/sw/member/dashboard");
  await expect(page).toHaveURL(/\/sw\/login$/);
});
