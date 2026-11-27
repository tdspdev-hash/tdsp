import { defineConfig } from "@playwright/test";

/**
 * Signed-in member portal tests against a LOCAL stand-in (tests-member/fake-supabase.mjs),
 * never the live project. It checks the app's behaviour, not Row Level Security.
 * Run with:  npx playwright test -c playwright.member.config.ts
 * The build writes to .next-member; tsconfig.json is restored because Next edits it.
 */
export default defineConfig({
  testDir: "./tests-member",
  reporter: [["list"]],
  use: { baseURL: "http://localhost:3403" },
  projects: [
    { name: "phone", use: { browserName: "chromium", viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true } },
    { name: "tablet", use: { browserName: "chromium", viewport: { width: 768, height: 1024 } } },
    { name: "desktop", use: { browserName: "chromium", viewport: { width: 1440, height: 900 } } },
  ],
  webServer: [
    { command: "node tests-member/fake-supabase.mjs", port: 54999, reuseExistingServer: false },
    {
      command:
        "cp tsconfig.json .tsconfig.keep && npx next build; code=$?; mv .tsconfig.keep tsconfig.json; test $code -eq 0 && npx next start -p 3403",
      url: "http://localhost:3403/sw",
      timeout: 300_000,
      reuseExistingServer: false,
      env: {
        NEXT_DIST_DIR: ".next-member",
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54999",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_fake_for_local_tests",
      },
    },
  ],
});
