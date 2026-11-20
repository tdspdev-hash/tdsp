import { defineConfig } from "@playwright/test";

/**
 * Supabase-backed page tests (separate from the offline suite in ./tests).
 *
 *  - "live"   build: uses the real project from .env.local (read-only, public key,
 *             published rows only). It checks the pages genuinely read the database.
 *  - "outage" build: Supabase is CONFIGURED but unreachable (127.0.0.1:9 refuses
 *             connections). It checks a failed read shows an error state and never
 *             the sample projects.
 *
 * Each build uses its own folder (NEXT_DIST_DIR) so they can run side by side.
 * Run with:  npx playwright test -c playwright.supabase.config.ts
 */
export default defineConfig({
  testDir: "./tests-supabase",
  fullyParallel: true,
  reporter: [["list"]],
  projects: [
    { name: "live-desktop", testMatch: /(projects|auth)-live/, use: { baseURL: "http://localhost:3401", browserName: "chromium", viewport: { width: 1280, height: 800 } } },
    { name: "live-phone", testMatch: /(projects|auth)-live/, use: { baseURL: "http://localhost:3401", browserName: "chromium", viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
    { name: "outage-desktop", testMatch: /projects-outage/, use: { baseURL: "http://localhost:3402", browserName: "chromium", viewport: { width: 1280, height: 800 } } },
    { name: "outage-phone", testMatch: /projects-outage/, use: { baseURL: "http://localhost:3402", browserName: "chromium", viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
  ],
  webServer: [
    {
      command: "NEXT_DIST_DIR=.next-live npm run build && NEXT_DIST_DIR=.next-live npx next start -p 3401",
      url: "http://localhost:3401/sw",
      timeout: 300_000,
      reuseExistingServer: false,
    },
    {
      command: "NEXT_DIST_DIR=.next-outage npm run build && NEXT_DIST_DIR=.next-outage npx next start -p 3402",
      url: "http://localhost:3402/sw",
      timeout: 300_000,
      reuseExistingServer: false,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:9",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_not_a_real_key_for_outage_test",
      },
    },
  ],
});
