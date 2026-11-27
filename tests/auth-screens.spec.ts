import { expect, test, type Page } from "@playwright/test";
import { forbidSupabaseRequests } from "./helpers";

/* These tests cover the SCREENS only (rendering, validation, language, layout).
   They run with Supabase unset and assert nothing is sent to Supabase.
   Real sign-up / sign-in against the live project is NOT tested yet. */

test.describe("login screen (Page 14)", () => {
  test("renders in Kiswahili with the expected controls", async ({ page }) => {
    await page.goto("/sw/login");
    await expect(page.getByRole("heading", { level: 1, name: "Ingia kwenye Akaunti Yako TDSP" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Ingia (Login)" })).toBeVisible();
    await expect(page.getByText("Tayari una akaunti? Ingia upate huduma na taarifa zako.")).toBeVisible();
    await expect(page.getByRole("textbox", { name: /Barua pepe/ })).toBeVisible();
    await expect(page.getByLabel(/Nenosiri/).first()).toBeVisible();
    await expect(page.getByLabel("Nikumbuke kwenye kifaa hiki")).not.toBeChecked();
    await expect(page.getByRole("link", { name: "Umesahau Nenosiri?" })).toHaveAttribute("href", "/sw/forgot-password");
    await expect(page.getByRole("link", { name: "Jiunge na TDSP" }).last()).toHaveAttribute("href", "/sw/join");
    await expect(page.getByText("Bado huna akaunti?")).toBeVisible();
    await expect(page.locator("ul li h2")).toHaveText(["Huduma za Wakulima", "Taarifa na Matangazo", "Mtandao wa Wakulima"]);
  });

  test("shows translated validation errors", async ({ page }) => {
    await page.goto("/sw/login");
    await page.locator("form").getByRole("button", { name: "Ingia kwenye Akaunti" }).click();
    await expect(page.getByText("Tafadhali andika barua pepe.")).toBeVisible();
    await expect(page.getByText("Tafadhali andika nenosiri.")).toBeVisible();

    await page.goto("/en/login");
    await page.locator("form").getByRole("button", { name: "Sign In to Your Account" }).click();
    await expect(page.getByText("Please enter your email address.")).toBeVisible();
    await expect(page.getByText("Please enter your password.")).toBeVisible();
  });

  test("password can be shown and hidden", async ({ page }) => {
    await page.goto("/en/login");
    const input = page.locator("#password");
    await expect(input).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Show password" }).click();
    await expect(input).toHaveAttribute("type", "text");
    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(input).toHaveAttribute("type", "password");
  });

  test("valid submit reports 'not connected' and sends nothing to Supabase", async ({ page }) => {
    const assertNoSupabase = forbidSupabaseRequests(page);
    await page.goto("/en/login");
    await page.locator("#email").fill("test@example.com");
    await page.locator("#password").fill("whatever123");
    await page.locator("form").getByRole("button", { name: "Sign In to Your Account" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "not connected yet" })).toBeVisible();
    await expect(page.getByText(/You are signed in|Umeingia/)).toHaveCount(0);
    assertNoSupabase();
  });

  test("breadcrumb is Karibu TDSP > Akaunti > Ingia and Akaunti leads to the landing page", async ({ page }) => {
    await page.goto("/sw/login");
    const crumb = page.getByRole("navigation", { name: "Njia ya ukurasa" });
    await expect(crumb.locator("[aria-current='page']")).toHaveText("Ingia");
    await crumb.getByRole("link", { name: "Akaunti" }).click();
    await expect(page).toHaveURL(/\/sw\/akaunti$/);
  });

  test("links lead to registration and password reset", async ({ page }) => {
    await page.goto("/sw/login");
    await page.getByRole("link", { name: "Umesahau Nenosiri?" }).click();
    await expect(page).toHaveURL(/\/sw\/forgot-password$/);
    await page.getByRole("link", { name: "Rudi kwenye Ingia" }).click();
    await expect(page).toHaveURL(/\/sw\/login$/);
    await page.getByRole("main").getByRole("link", { name: "Jiunge na TDSP" }).click();
    await expect(page).toHaveURL(/\/sw\/join$/);
  });

  test("language switch keeps the login page", async ({ page }) => {
    await page.goto("/sw/login");
    await page.getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/login$/);
    await expect(page.getByRole("heading", { level: 1, name: "Sign in to your TDSP Account" })).toBeVisible();
  });

  test("layout: card beside the hero from 900px, below it on phones; no overflow; remember row stays on one line when it fits", async ({ page }) => {
    await page.goto("/sw/login");
    const w = page.viewportSize()!.width;
    const hero = (await page.locator("section[aria-labelledby='login-hero-title']").boundingBox())!;
    const card = (await page.locator("section[aria-labelledby='login-title']").boundingBox())!;
    if (w >= 900) expect(card.x + card.width).toBeGreaterThan(hero.x + hero.width);
    else expect(card.y).toBeGreaterThan(hero.y);
    expect(card.x + card.width).toBeLessThanOrEqual(w);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await page.goto("/en/login");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  });

  test("hero text stays clear of the farmers (sweep)", async ({ page }, info) => {
    test.skip(info.project.name !== "w1280", "sweep runs once");
    for (const w of [900, 1024, 1100, 1280, 1440, 1600, 1920]) {
      await page.setViewportSize({ width: w, height: 800 });
      for (const p of ["/sw/login", "/en/login"]) {
        await page.goto(p);
        const hero = (await page.locator("section[aria-labelledby='login-hero-title']").boundingBox())!;
        const right = await page.locator("#login-hero-title").evaluate((el) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right; });
        expect(right, `${p} ${w}px`).toBeLessThanOrEqual(hero.x + hero.width * 0.62 + 4);
      }
    }
  });
});

test.describe("forgot password screen (Page 16)", () => {
  test("renders in Kiswahili: hero, card, three steps, back link", async ({ page }) => {
    await page.goto("/sw/forgot-password");
    await expect(page.getByRole("heading", { level: 1, name: "Umesahau Nenosiri?" })).toBeVisible();
    await expect(page.getByText("Usijali. Weka barua pepe yako ya usajili, tutakutumia kiungo cha kuweka nenosiri jipya.")).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Umesahau Nenosiri?" })).toBeVisible();
    await expect(page.getByRole("list", { name: "Hatua za kurejesha nenosiri" }).locator("h2")).toHaveText(["1. Weka Barua Pepe", "2. Pokea Kiungo", "3. Weka Nenosiri Jipya"]);
    await expect(page.getByRole("link", { name: "Rudi kwenye Ingia" })).toHaveAttribute("href", "/sw/login");
    const crumb = page.getByRole("navigation", { name: "Njia ya ukurasa" });
    await expect(crumb.locator("[aria-current='page']")).toHaveText("Umesahau Nenosiri");
  });

  test("validates the email in both languages", async ({ page }) => {
    await page.goto("/sw/forgot-password");
    await page.locator("form").getByRole("button", { name: "Tuma Kiungo cha Kuweka Nenosiri" }).click();
    await expect(page.getByText("Tafadhali andika barua pepe.")).toBeVisible();
    await page.locator("#email").fill("nope");
    await page.locator("form").getByRole("button", { name: "Tuma Kiungo cha Kuweka Nenosiri" }).click();
    await expect(page.getByText("Barua pepe si sahihi.")).toBeVisible();
    await page.goto("/en/forgot-password");
    await page.locator("form").getByRole("button", { name: "Send Password Reset Link" }).click();
    await expect(page.getByText("Please enter your email address.")).toBeVisible();
  });

  test("a valid email reports 'not connected', sends nothing and never claims an email was sent", async ({ page }) => {
    const assertNoSupabase = forbidSupabaseRequests(page);
    await page.goto("/en/forgot-password");
    await page.locator("#email").fill("test@example.com");
    await page.locator("form").getByRole("button", { name: "Send Password Reset Link" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "not connected yet" })).toBeVisible();
    await expect(page.getByText(/If this email is registered|Kama barua pepe hii/)).toHaveCount(0);
    assertNoSupabase();
  });

  test("English is fully translated; language switch keeps the page", async ({ page }) => {
    await page.goto("/en/forgot-password");
    await expect(page.getByRole("heading", { level: 1, name: "Forgot your Password?" })).toBeVisible();
    const t = await page.locator("main").innerText();
    for (const sw of ["Umesahau", "Barua pepe", "Rudi", "Weka", "Pokea", "Tuma"]) expect(t).not.toContain(sw);
    await expect(page.getByRole("list", { name: "Password recovery steps" }).locator("h2")).toHaveText(["1. Enter Your Email", "2. Receive the Link", "3. Set a New Password"]);
    await page.goto("/sw/forgot-password");
    await page.getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/forgot-password$/);
  });

  test("layout: card beside the hero from 900px, below it on phones; no overflow; Akaunti active on phones", async ({ page }) => {
    for (const p of ["/sw/forgot-password", "/en/forgot-password"]) {
      await page.goto(p, { waitUntil: "load" });
      const w = page.viewportSize()!.width;
      const hero = (await page.locator("section[aria-labelledby='forgot-hero-title']").boundingBox())!;
      const card = (await page.locator("section[aria-labelledby='forgot-title']").boundingBox())!;
      if (w >= 900) expect(card.x + card.width).toBeGreaterThan(hero.x + hero.width);
      else expect(card.y).toBeGreaterThan(hero.y);
      expect(card.x + card.width).toBeLessThanOrEqual(w);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), p).toBeLessThanOrEqual(0);
    }
    if (page.viewportSize()!.width < 900) await expect(page.getByRole("navigation", { name: "Menyu ya chini" }).or(page.getByRole("navigation", { name: "Bottom menu" })).locator("[aria-current='page']")).toBeVisible();
  });

  test("hero text stays clear of the farmers (sweep)", async ({ page }, info) => {
    test.skip(info.project.name !== "w1280", "sweep runs once");
    for (const w of [900, 1024, 1100, 1280, 1440, 1600, 1920]) {
      await page.setViewportSize({ width: w, height: 800 });
      for (const p of ["/sw/forgot-password", "/en/forgot-password"]) {
        await page.goto(p);
        const hero = (await page.locator("section[aria-labelledby='forgot-hero-title']").boundingBox())!;
        const right = await page.locator("#forgot-hero-title").evaluate((el) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right; });
        expect(right, `${p} ${w}px`).toBeLessThanOrEqual(hero.x + hero.width * 0.58 + 4);
      }
    }
  });
});

test.describe("registration screen (Page 15)", () => {
  const T = {
    sw: { first: "Jina la Kwanza", last: "Jina la Mwisho", email: "Barua pepe", phone: "Namba ya Simu", pw: "Nenosiri", pw2: "Thibitisha Nenosiri", next: "Endelea", submit: "Jiunge na TDSP" },
    en: { first: "First Name", last: "Last Name", email: "Email", phone: "Phone Number", pw: "Password", pw2: "Confirm Password", next: "Continue", submit: "Join TDSP" },
  } as const;

  async function step1(page: Page, l: "sw" | "en", over: Partial<Record<"pw2" | "email" | "phone", string>> = {}) {
    const t = T[l];
    const L = (x: string) => new RegExp(`^${x}`);
    await page.getByLabel(L(t.first)).fill("Amina");
    await page.getByLabel(L(t.last)).fill("Juma");
    await page.getByLabel(L(t.email)).fill(over.email ?? "test@example.com");
    await page.getByLabel(L(t.phone)).fill(over.phone ?? "689 671 666");
    await page.getByLabel(L(t.pw), { exact: false }).first().fill("password123");
    await page.getByLabel(L(t.pw2)).fill(over.pw2 ?? "password123");
  }
  const form = (page: Page) => page.locator("form");
  async function step2(page: Page) {
    await page.locator("#region").fill("Dar es Salaam");
    await page.locator("#district").fill("Temeke");
    await page.locator("#ward").fill("Mbagala");
  }

  test("renders the hero, benefits, steps and step 1 in Kiswahili", async ({ page }) => {
    await page.goto("/sw/join");
    await expect(page.getByRole("heading", { level: 1, name: "Jiunge na TDSP" })).toBeVisible();
    await expect(page.getByText("Kuwa sehemu ya mtandao wa wakulima, wadau na washirika wa sekta ya kilimo.")).toBeVisible();
    await expect(page.getByRole("list", { name: "Hatua za usajili" }).locator("li")).toHaveText([/Taarifa za Msingi/, /Taarifa za Ziada/, /Thibitisha/]);
    await expect(page.getByRole("list", { name: "Hatua za usajili" }).locator("[aria-current='step']")).toContainText("Taarifa za Msingi");
    await expect(page.locator("#join-benefits")).toHaveText("Faida za Uanachama");
    await expect(page.locator("section[aria-labelledby='join-benefits'] h3")).toHaveText(["Mtandao Mpana", "Fursa za Miradi", "Huduma za Kitaalamu", "Taarifa za Kitaaluma"]);
    await expect(page.getByText("+255", { exact: true }).first()).toBeVisible();
    // No fee amount and no invented legal documents.
    await expect(page.getByText(/TSh|TZS|10,000|Sheria na Masharti|Sera ya Faragha/)).toHaveCount(0);
  });

  test("step 1 shows translated required-field errors and does not advance", async ({ page }) => {
    await page.goto("/sw/join");
    await form(page).getByRole("button", { name: "Endelea" }).click();
    for (const m of ["Tafadhali andika jina la kwanza.", "Tafadhali andika jina la mwisho.", "Tafadhali andika barua pepe.", "Tafadhali andika namba ya simu.", "Nenosiri liwe na angalau herufi 8."]) await expect(page.getByText(m)).toBeVisible();
    await expect(page.getByRole("list", { name: "Hatua za usajili" }).locator("[aria-current='step']")).toContainText("Taarifa za Msingi");
    await page.goto("/en/join");
    await form(page).getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Please enter your first name.")).toBeVisible();
    await expect(page.getByText("Please enter your phone number.")).toBeVisible();
  });

  test("rejects mismatched passwords, a bad phone and a bad email", async ({ page }) => {
    await page.goto("/en/join");
    await step1(page, "en", { pw2: "different123", phone: "abc", email: "nope" });
    await form(page).getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("The phone number is not valid.")).toBeVisible();
    await expect(page.getByText("The email address is not valid.")).toBeVisible();
    await page.getByLabel(/^Phone Number/).fill("0689671666");
    await page.getByLabel(/^Email/).fill("test@example.com");
    await form(page).getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("The passwords do not match.")).toBeVisible();
  });

  test("password visibility can be toggled", async ({ page }) => {
    await page.goto("/en/join");
    const pw = page.locator("#password");
    await expect(pw).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Show password" }).first().click();
    await expect(pw).toHaveAttribute("type", "text");
  });

  test("three steps: extra details, then confirmation with consent; values are kept going back", async ({ page }) => {
    await page.goto("/en/join");
    await step1(page, "en");
    await form(page).getByRole("button", { name: "Continue" }).click();
    const steps = page.getByRole("list", { name: "Registration steps" });
    await expect(steps.locator("[aria-current='step']")).toContainText("Additional Information");
    await form(page).getByRole("button", { name: "Continue" }).click(); // location is required
    await expect(page.getByText("Please enter your region.")).toBeVisible();
    await page.getByRole("radio", { name: "Female" }).check();
    await page.getByRole("checkbox", { name: "Farming and livestock" }).check();
    await step2(page);
    await form(page).getByRole("button", { name: "Continue" }).click();
    await expect(steps.locator("[aria-current='step']")).toContainText("Confirm");
    await expect(page.locator("dl")).toContainText("Amina Juma");
    await expect(page.locator("dl")).toContainText("+255 689 671 666");
    await form(page).getByRole("button", { name: "Back" }).click();
    await expect(page.locator("#region")).toHaveValue("Dar es Salaam");
    await expect(page.getByRole("checkbox", { name: "Farming and livestock" })).toBeChecked();
  });

  test("final step needs the consent declaration; a valid form reports 'not connected' and sends nothing to Supabase", async ({ page }) => {
    const assertNoSupabase = forbidSupabaseRequests(page);
    await page.goto("/en/join");
    await step1(page, "en");
    await form(page).getByRole("button", { name: "Continue" }).click();
    await step2(page);
    await form(page).getByRole("button", { name: "Continue" }).click();
    await form(page).getByRole("button", { name: "Join TDSP" }).click();
    await expect(page.getByText("You must accept this declaration to continue.")).toBeVisible();
    await page.getByRole("checkbox", { name: /I confirm that the information/ }).check();
    await form(page).getByRole("button", { name: "Join TDSP" }).click(); // age confirmation is required too
    await expect(page.getByText("You must be 18 or over to register.")).toBeVisible();
    await page.getByRole("checkbox", { name: "I confirm that I am 18 years old or over." }).check();
    await form(page).getByRole("button", { name: "Join TDSP" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "not connected yet" })).toBeVisible();
    await expect(page.getByText(/account has been created|Akaunti yako imefunguliwa/i)).toHaveCount(0);
    assertNoSupabase();
  });

  test("breadcrumb, sign-in link and language switch", async ({ page }) => {
    await page.goto("/sw/join");
    const crumb = page.getByRole("navigation", { name: "Njia ya ukurasa" });
    await expect(crumb.locator("[aria-current='page']")).toHaveText("Jiunge na TDSP");
    await crumb.getByRole("link", { name: "Akaunti" }).click();
    await expect(page).toHaveURL(/\/sw\/akaunti$/);
    await page.goto("/sw/join");
    await page.getByRole("link", { name: "Ingia hapa" }).click();
    await expect(page).toHaveURL(/\/sw\/login$/);
    await page.goto("/sw/join");
    await page.getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/join$/);
    await expect(page.getByRole("heading", { level: 1, name: "Join TDSP" })).toBeVisible();
  });

  test("English is fully translated", async ({ page }) => {
    await page.goto("/en/join");
    const t = await page.locator("main").innerText();
    for (const sw of ["Jiunge", "Faida", "Taarifa", "Nenosiri", "Endelea", "Mtandao"]) expect(t).not.toContain(sw);
  });

  test("layout: card beside the hero from 900px, below it on phones; no overflow in both languages", async ({ page }) => {
    for (const p of ["/sw/join", "/en/join"]) {
      await page.goto(p, { waitUntil: "load" });
      const w = page.viewportSize()!.width;
      const hero = (await page.locator("section[aria-labelledby='join-hero-title']").boundingBox())!;
      const card = (await page.locator("section[aria-labelledby='join-title']").boundingBox())!;
      if (w >= 900) expect(card.x + card.width).toBeGreaterThan(hero.x + hero.width);
      else expect(card.y).toBeGreaterThan(hero.y);
      expect(card.x + card.width).toBeLessThanOrEqual(w);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), p).toBeLessThanOrEqual(0);
      // every field stays inside the card
      for (const input of await page.locator("form input:visible").all()) {
        const b = (await input.boundingBox())!;
        expect(b.x + b.width, p).toBeLessThanOrEqual(card.x + card.width + 1);
      }
    }
  });

  test("hero text stays clear of the farmers (sweep)", async ({ page }, info) => {
    test.skip(info.project.name !== "w1280", "sweep runs once");
    for (const w of [900, 1024, 1100, 1280, 1440, 1600, 1920]) {
      await page.setViewportSize({ width: w, height: 800 });
      for (const p of ["/sw/join", "/en/join"]) {
        await page.goto(p);
        const hero = (await page.locator("section[aria-labelledby='join-hero-title']").boundingBox())!;
        const right = await page.locator("#join-hero-title").evaluate((el) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().right; });
        expect(right, `${p} ${w}px`).toBeLessThanOrEqual(hero.x + hero.width * 0.6 + 4);
      }
    }
  });
});

test.describe("reset password page (offline: Supabase not configured)", () => {
  test("says it is not connected, shows no form and is not indexed", async ({ page }) => {
    const assertNoSupabase = forbidSupabaseRequests(page);
    await page.goto("/sw/reset-password");
    await expect(page.getByRole("heading", { level: 1, name: "Weka Nenosiri Jipya" })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: "bado haujaunganishwa" })).toBeVisible();
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await page.goto("/en/reset-password");
    await expect(page.getByRole("heading", { level: 1, name: "Set a New Password" })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: "not connected yet" })).toBeVisible();
    assertNoSupabase();
  });

  test("the email callback fails safely offline and returns to login with a notice", async ({ page }) => {
    await page.goto("/sw/auth/confirm?code=abc");
    await expect(page).toHaveURL(/\/sw\/login\?error=confirm$/);
    await expect(page.getByRole("alert").filter({ hasText: "Kiungo cha uthibitisho si sahihi" })).toBeVisible();
    await page.goto("/en/auth/confirm?token_hash=x&type=recovery&next=//evil.example.com");
    await expect(page).toHaveURL(/\/en\/login\?error=confirm$/);
    await expect(page.getByRole("alert").filter({ hasText: "confirmation link is not valid" })).toBeVisible();
  });

  test("the account page shows no signed-in notice when signed out", async ({ page }) => {
    await page.goto("/sw/akaunti");
    await expect(page.getByRole("status")).toHaveCount(0);
  });
});
