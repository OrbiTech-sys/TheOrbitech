import { expect, test, type Page } from "@playwright/test";

// This file runs against the server where email delivery is NOT configured.

const name = (page: Page) => page.getByLabel("Your name");
const email = (page: Page) => page.getByLabel("Email", { exact: true });
const message = (page: Page) => page.getByLabel("About the project");
const send = (page: Page) => page.getByRole("button", { name: "Send message" });

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
    for (const label of ["Your name", "Email", "Company", "Project type", "Budget", "Timing", "About the project"]) {
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

    const alert = page.getByRole("alert");
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

test.describe("estimator", () => {
  test("pre-fills the form with the chosen range and features", async ({ page }) => {
    await page.goto("/contact");
    await page.getByText("Not sure about budget?").click();
    await page.getByLabel("Website", { exact: true }).check();
    await page.getByRole("button", { name: "Use this estimate in the form" }).click();

    await expect(page.getByText(/Attached estimate:/)).toBeVisible();
    await expect(page.getByLabel("Project type")).toHaveValue("Website");
    await expect(message(page)).toHaveValue(/Features from the estimator/);
    await expect(name(page)).toBeFocused();
  });
});

test.describe("contact page content", () => {
  test("shows what happens next and a booking slot marked as missing", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: "What happens next" })).toBeVisible();
    await expect(page.locator("ol.next__list li")).toHaveCount(3);
    await expect(page.getByText("[Booking link (Cal.com or Calendly)]")).toBeVisible();
  });

  test("missing details are bracketed, never invented", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText("[Email address]").first()).toBeVisible();
    await expect(page.getByText("[City, country]").first()).toBeVisible();
  });

  test("the thank-you page confirms and offers a way on", async ({ page }) => {
    await page.goto("/contact/thanks");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Message sent");
    await expect(page.getByRole("link", { name: "See our work" })).toBeVisible();
  });
});
