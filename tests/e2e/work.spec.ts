import { expect, test } from "@playwright/test";

test.describe("work page", () => {
  test("filters the portfolio by category", async ({ page }) => {
    await page.goto("/work");
    const cards = page.locator(".project-card");
    await expect(cards).toHaveCount(9);
    const group = page.getByRole("group", { name: "Filter projects by category" });
    for (const label of ["All Projects", "AI & Automation", "SaaS Platforms", "Web Applications", "E-commerce"]) {
      await expect(group.getByRole("button", { name: new RegExp(label.replace("&", "&")) })).toBeVisible();
    }
    await group.getByRole("button", { name: /SaaS Platforms/ }).click();
    await expect(group.getByRole("button", { name: /SaaS Platforms/ })).toHaveAttribute("aria-pressed", "true");
    await expect(cards).toHaveCount(2);
    await group.getByRole("button", { name: /E-commerce/ }).click();
    await expect(cards).toHaveCount(1);
    await group.getByRole("button", { name: /All Projects/ }).click();
    await expect(cards).toHaveCount(9);
  });

  test("each card links to its case study, and to the demo where there is one", async ({ page }) => {
    await page.goto("/work");
    const live = page.locator(".project-card", { hasText: "OrbitOS" });
    await expect(live.getByRole("link", { name: "OrbitOS", exact: true })).toHaveAttribute("href", "/work/orbitos");
    await expect(live.getByRole("link", { name: /Open live demo/ })).toHaveAttribute("href", /^https:\/\//);
    const gated = page.locator(".project-card", { hasText: "AI Voice Receptionist" });
    await expect(gated.getByRole("link", { name: /Open live demo/ })).toHaveAttribute("href", "/demo/ai-voice/open");
    const priv = page.locator(".project-card", { hasText: "WhatsApp Business Chatbot" });
    await expect(priv.getByRole("link", { name: /Open live demo/ })).toHaveCount(0);
    await expect(priv.getByText("Private project")).toBeVisible();
  });

  test("a case study shows the problem, the solution, features and related work", async ({ page }) => {
    await page.goto("/work/orbitos");
    for (const heading of ["Project overview", "Business problem", "What we built", "Product screenshots", "What this demo shows", "More work like this"]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
    // nothing is invented: no stack, architecture or results were supplied, so those sections are absent
    for (const heading of ["Technology stack", "How it is built", "Verified results"]) {
      await expect(page.getByRole("heading", { name: heading })).toHaveCount(0);
    }
  });

  test("a private project says it has no public link", async ({ page }) => {
    await page.goto("/work/whatsapp-chatbot");
    await expect(page.getByText(/no public link/)).toBeVisible();
    // The page's own header has no demo link. Related-project cards further down may have their own.
    await expect(page.locator("header.case-hero").getByRole("link", { name: /Open live demo/ })).toHaveCount(0);
  });
});
