import { defineConfig } from "@playwright/test";

/**
 * Browser tests run against a production build with email switched off (SMTP
 * variables emptied, even if .env.local has them), so the form and the demo email
 * check must say so honestly and never send anything.
 *
 *   npm run test:e2e        builds into .next-test, then runs everything
 */
export const UNCONFIGURED_PORT = 3211;

const distDir = process.env.NEXT_DIST_DIR || ".next";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  outputDir: "test-results/e2e",
  use: {
    channel: "chrome",
    baseURL: `http://127.0.0.1:${UNCONFIGURED_PORT}`,
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
    launchOptions: {
      args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
    },
  },
  webServer: [
    {
      command: `npx next start -p ${UNCONFIGURED_PORT}`,
      url: `http://127.0.0.1:${UNCONFIGURED_PORT}`,
      reuseExistingServer: false,
      timeout: 90_000,
      env: { NEXT_DIST_DIR: distDir, SMTP_HOST: "", SMTP_USER: "", SMTP_PASS: "" },
    },
  ],
});
