import { defineConfig } from "@playwright/test";

/**
 * Browser tests run against a production build served on two ports:
 *   3211: email delivery NOT configured (the form must say so honestly)
 *   3210: email delivery configured, pointed at a stand-in mail server on 4010
 *
 *   npm run test:e2e        builds into .next-test, then runs everything
 */
export const UNCONFIGURED_PORT = 3211;
export const CONFIGURED_PORT = 3210;
export const MOCK_MAIL_PORT = 4010;

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
      env: { NEXT_DIST_DIR: distDir, RESEND_API_KEY: "", CONTACT_TO_EMAIL: "", CONTACT_FROM_EMAIL: "", RESEND_API_URL: "" },
    },
    {
      command: `npx next start -p ${CONFIGURED_PORT}`,
      url: `http://127.0.0.1:${CONFIGURED_PORT}`,
      reuseExistingServer: false,
      timeout: 90_000,
      env: {
        NEXT_DIST_DIR: distDir,
        RESEND_API_KEY: "test-key",
        CONTACT_TO_EMAIL: "inbox@orbitech.test",
        CONTACT_FROM_EMAIL: "OrbiTech <enquiries@orbitech.test>",
        RESEND_API_URL: `http://127.0.0.1:${MOCK_MAIL_PORT}/emails`,
      },
    },
  ],
});
