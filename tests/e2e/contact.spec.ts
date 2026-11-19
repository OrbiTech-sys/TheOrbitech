import { expect, test, type Page } from "@playwright/test";

// This file runs against the server where email delivery is NOT configured (SMTP variables emptied).

const name = (page: Page) => page.getByLabel("Full name");
const email = (page: Page) => page.getByLabel("Business email");
const message = (page: Page) => page.getByLabel("Project description");
const send = (page: Page) => page.getByRole("button", { name: "Send Project Inquiry" });

test.describe("contact page", () => {
  test("leads with the headline, the verified details and the three-step process", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Have an Ambitious Idea? Let’s Engineer It.");
    await expect(page.getByText("We’ll help you identify the right technical solution.")).toBeVisible();
    await expect(page.getByRole("link", { name: "nova@theorbitechsolution.com" }).first()).toBeVisible();
    await expect(page.getByText("New York, US", { exact: true })).toBeVisible();
    await expect(page.getByText(/collaborate with businesses worldwide/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: "What happens next" })).toBeVisible();
    await expect(page.locator("ol.steps li")).toHaveCount(3);
  });

  test("the thank-you page confirms and offers a way on", async ({ page }) => {
    await page.goto("/contact/thanks");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Message sent");
    await expect(page.getByRole("link", { name: "See our work" })).toBeVisible();
  });
});

test.describe("contact form validation", () => {
  test("empty submit shows a clear message for each required field and focuses the first", async ({ page }) => {
    const posts: string[] = [];
    page.on("request", (request) => request.method() === "POST" && posts.push(request.url()));
    await page.goto("/contact");
    await send(page).click();

    await expect(page.getByText("Enter your name so we know who to reply to.")).toBeVisible();
    await expect(page.getByText("Enter an email address like name@company.com.")).toBeVisible();
    await expect(page.getByText(/at least 10 characters/)).toBeVisible();
    await expect(name(page)).toHaveAttribute("aria-invalid", "true");
    await expect(name(page)).toBeFocused();
    expect(posts).toEqual([]); // the browser caught it before sending anything
  });

  test("errors are tied to their fields for screen readers", async ({ page }) => {
    await page.goto("/contact");
    await send(page).click();
    await expect(email(page)).toHaveAttribute("aria-describedby", "contact-email-msg");
    await expect(page.locator("#contact-email-msg")).toContainText("name@company.com");
  });

  test("an error clears as soon as the field is edited", async ({ page }) => {
    await page.goto("/contact");
    await send(page).click();
    await name(page).fill("Sam");
    await expect(page.getByText("Enter your name so we know who to reply to.")).toBeHidden();
    await expect(name(page)).not.toHaveAttribute("aria-invalid", "true");
  });

  test("rejects a malformed email", async ({ page }) => {
    await page.goto("/contact");
    await name(page).fill("Sam Tan");
    await email(page).fill("sam@");
    await message(page).fill("A short note about the project.");
    await send(page).click();
    await expect(page.getByText("Enter an email address like name@company.com.")).toBeVisible();
    await expect(email(page)).toBeFocused();
  });

  test("fields are labelled and the spam trap is hidden from everyone", async ({ page }) => {
    await page.goto("/contact");
    for (const label of ["Full name", "Business email", "Company name", "Project type", "Estimated budget", "Project timeline", "Project description"]) {
      await expect(page.getByLabel(label, { exact: false }).first()).toBeVisible();
    }
    const trap = page.locator("#contact-website");
    await expect(trap).toHaveAttribute("tabindex", "-1");
    const box = await trap.boundingBox();
    expect((box?.x ?? 0) < 0 || (box?.width ?? 0) <= 1).toBe(true);
  });
});

test.describe("when email delivery is not configured", () => {
  test("says so plainly, keeps what was typed and does not pretend it was sent", async ({ page }) => {
    await page.goto("/contact");
    await name(page).fill("Sam Tan");
    await email(page).fill("sam@example.com");
    await message(page).fill("We need a new marketing site.");
    await send(page).click();

    const alert = page.locator(".notice--error");
    await expect(alert).toContainText(/switched on yet/);
    await expect(alert).toContainText(/wasn.t sent/);
    await expect(page).toHaveURL(/\/contact$/);
    await expect(name(page)).toHaveValue("Sam Tan");
    await expect(message(page)).toHaveValue("We need a new marketing site.");
  });

  test("a bot that fills the hidden field is waved through to the thank-you page", async ({ page }) => {
    await page.goto("/contact");
    await name(page).fill("Bot");
    await email(page).fill("bot@example.com");
    await message(page).fill("Buy cheap watches online now.");
    await page.locator("#contact-website").evaluate((el: HTMLInputElement) => {
      el.value = "http://spam.example";
    });
    await send(page).click();
    await expect(page).toHaveURL(/\/contact\/thanks$/);
  });
});
