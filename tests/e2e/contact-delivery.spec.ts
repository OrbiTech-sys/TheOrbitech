import { expect, test, type Page } from "@playwright/test";
import { CONFIGURED_PORT, MOCK_MAIL_PORT } from "../../playwright.config";
import { startMockMail, type MockMail } from "./mock-mail";

// This file runs against the server where email delivery IS configured,
// pointed at a stand-in mail server. The tests share one rate-limit budget
// (five submissions per ten minutes), so keep the count below in mind:
// success (1) + outage (2) + retry (3) + rate limit (4, 5, then refused).

test.use({ baseURL: `http://127.0.0.1:${CONFIGURED_PORT}` });
test.describe.configure({ mode: "serial" });

let mail: MockMail;
test.beforeAll(async () => {
  mail = await startMockMail(MOCK_MAIL_PORT);
});
test.afterAll(async () => {
  await mail.close();
});
test.beforeEach(() => {
  mail.status = 200;
});

async function fill(page: Page) {
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Sam Tan");
  await page.getByLabel("Email", { exact: true }).fill("sam@example.com");
  await page.getByLabel("Company").fill("Tan & Co");
  await page.getByLabel("Project type").selectOption("Website");
  await page.getByLabel("About the project").fill("We need a new marketing site with a CMS.");
}
const send = (page: Page) => page.getByRole("button", { name: "Send message" }).click();

test("a valid enquiry is emailed and the visitor lands on the thank-you page", async ({ page }) => {
  await fill(page);
  await send(page);

  await expect(page).toHaveURL(/\/contact\/thanks$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Message sent");

  expect(mail.requests).toHaveLength(1);
  const { authorization, body } = mail.requests[0];
  expect(authorization).toBe("Bearer test-key");
  expect(body).toMatchObject({
    to: ["inbox@orbitech.test"],
    from: "OrbiTech <enquiries@orbitech.test>",
    reply_to: "sam@example.com",
  });
  expect(String(body.subject)).toContain("Sam Tan");
  expect(String(body.text)).toContain("Project type: Website");
  expect(String(body.text)).toContain("We need a new marketing site with a CMS.");
});

test("a mail outage is reported honestly, nothing is lost, and a retry works", async ({ page }) => {
  const before = mail.requests.length;
  mail.status = 500;
  await fill(page);
  await send(page);

  await expect(page.getByRole("alert")).toContainText(/mail service returned an error/);
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByLabel("Your name")).toHaveValue("Sam Tan");
  await expect(page.getByLabel("About the project")).toHaveValue(/marketing site/);

  mail.status = 200;
  await send(page);
  await expect(page).toHaveURL(/\/contact\/thanks$/);
  expect(mail.requests.length - before).toBe(2);
});

test("repeated submissions are slowed down", async ({ page }) => {
  for (let i = 0; i < 2; i += 1) {
    await fill(page);
    await send(page);
    await expect(page).toHaveURL(/\/contact\/thanks$/);
  }
  await fill(page);
  await send(page);
  await expect(page.getByRole("alert")).toContainText(/several messages in a short time/);
  await expect(page).toHaveURL(/\/contact$/);
});
