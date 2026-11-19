import { expect, test } from "@playwright/test";

// Contact form (rebuilt for Page 11). It has NO delivery workflow, so it must never claim a message was sent.
const submit = (page: import("@playwright/test").Page, name: string) => page.locator("form").getByRole("button", { name });

test("contact form shows Kiswahili validation messages", async ({ page }) => {
  await page.goto("/sw/mawasiliano");
  await submit(page, "Tuma Ujumbe").click();
  for (const m of ["Tafadhali andika jina lako.", "Tafadhali andika barua pepe.", "Tafadhali chagua mada.", "Tafadhali andika ujumbe wako."]) await expect(page.getByText(m)).toBeVisible();
});

test("contact form shows English validation messages", async ({ page }) => {
  await page.goto("/en/contact");
  await submit(page, "Send Message").click();
  for (const m of ["Please enter your name.", "Please enter your email address.", "Please choose a subject.", "Please enter your message."]) await expect(page.getByText(m)).toBeVisible();
});

test("contact form rejects an invalid email and a message over 500 characters", async ({ page }) => {
  await page.goto("/en/contact");
  await page.getByLabel("Your name").fill("Test User");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("Subject").selectOption("general");
  await page.getByLabel("Your message").fill("x".repeat(501));
  await expect(page.getByText("501 / 500")).toBeVisible();
  await submit(page, "Send Message").click();
  await expect(page.getByText("The email address is not valid.")).toBeVisible();
  await expect(page.getByText("The message must be 500 characters or fewer.")).toBeVisible();
});

test("a valid contact form is validated but honestly reported as not sent", async ({ page }) => {
  await page.goto("/en/contact");
  await page.getByLabel("Your name").fill("Test User");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Subject").selectOption("partnership");
  await page.getByLabel("Your message").fill("This is a test message.");
  await submit(page, "Send Message").click();
  await expect(page.locator("form").getByText("has not been sent")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open email" })).toHaveAttribute("href", /^mailto:tdsphq@gmail\.com\?subject=Partnership/);
  await expect(page.getByText(/successfully|asante|imetumwa/i)).toHaveCount(0);
});
