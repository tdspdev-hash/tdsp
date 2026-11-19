import { defineConfig } from "@playwright/test";

const PORT = 3100;

/**
 * Seven viewports from small Android phones to wide desktops.
 * All projects run in Chromium to keep the toolchain small; real iOS Safari
 * (WebKit) is not covered yet and should be checked manually on a device.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    // Widths requested for the homepage: 360, 390, 412, 768, 1024, 1280, 1440.
    { name: "w360", use: { browserName: "chromium", viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true } },
    { name: "w390", use: { browserName: "chromium", viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
    { name: "w412", use: { browserName: "chromium", viewport: { width: 412, height: 915 }, hasTouch: true, isMobile: true } },
    { name: "w768", use: { browserName: "chromium", viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: "w1024", use: { browserName: "chromium", viewport: { width: 1024, height: 768 } } },
    { name: "w1280", use: { browserName: "chromium", viewport: { width: 1280, height: 800 } } },
    { name: "w1440", use: { browserName: "chromium", viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    // Tests run against a production build, as deployed.
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}/sw`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    // UI tests must NEVER reach the live Supabase project (they would create
    // real accounts). Empty values override anything in .env.local, so the app
    // runs in its "not connected" mode. Live-project tests are separate and
    // need explicit approval.
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
    },
  },
});
