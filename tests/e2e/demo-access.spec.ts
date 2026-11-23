import { expect, test } from "@playwright/test";

// Runs against the server where email is NOT configured: the email check must say so
// honestly and never let anyone through. (The full code-by-email flow is covered by the
// unit tests in tests/unit/demo-access.test.ts and was walked through by hand with a real browser.)

// Only the gated demos are hidden. OrbitOS and the property demo link straight to their public sites.
const HOSTS = /curlyco2026|foodchains\.vercel|madmighty|salon2026|voice\.theorbitechsolution/;

test.describe("demo access", () => {
  test("one food card opens a page with all three restaurant demos", async ({ page }) => {
    await page.goto("/work");
    const cards = page.locator(".project-card", { hasText: "Restaurant Website Design" });
    await expect(cards).toHaveCount(1);
    await expect(cards.locator(".badge", { hasText: "3 demos" })).toBeVisible();

    await cards.getByRole("link", { name: "Restaurant Website Design: 3 Custom Food Ordering Demos", exact: true }).click();
    await expect(page).toHaveURL(/\/work\/restaurant-website-demos$/);
    await expect(page.locator(".demo-card")).toHaveCount(3);
    for (const name of ["Curly Co.", "Food Chain", "MAD: Mighty & Delicious"]) {
      await expect(page.getByRole("heading", { level: 3, name })).toBeVisible();
    }
  });

  test("no demo address appears in the pages, only the gated link", async ({ page }) => {
    for (const path of ["/work", "/work/restaurant-website-demos", "/work/salon-website-demo", "/work/ai-voice-receptionist", "/demo/curly-co"]) {
      await page.goto(path);
      expect(await page.content(), path).not.toMatch(HOSTS);
    }
    await page.goto("/work/salon-website-demo");
    await expect(page.getByRole("link", { name: /Open live demo/ }).first()).toHaveAttribute("href", "/demo/maison-muse/open");
  });

  test("opening a demo without confirming an email lands on the email check", async ({ page }) => {
    await page.goto("/demo/maison-muse/open");
    await expect(page).toHaveURL(/\/demo\/maison-muse$/);
    await expect(page.getByRole("heading", { name: "Confirm your email to open the demo" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("a forged cookie does not open a demo", async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: "oc_access", value: "eyJlIjoieEB5LmNvbSIsIngiOjk5OTk5OTk5OTk5OTl9.forged", url: baseURL! }]);
    await page.goto("/demo/ai-voice/open");
    await expect(page).toHaveURL(/\/demo\/ai-voice$/);
  });

  test("a bad email is explained, and a good one is refused honestly when email is off", async ({ page, context }) => {
    await page.goto("/demo/food-chain");
    await page.getByLabel("Email address").fill("not-an-email");
    await page.getByRole("button", { name: /Send my code/ }).click();
    await expect(page.locator("#gate-email-msg")).toContainText("name@company.com");

    await page.getByLabel("Email address").fill("visitor@example.com");
    await page.getByRole("button", { name: /Send my code/ }).click();
    await expect(page.locator("#gate-email-msg")).toContainText("isn’t switched on yet");
    await expect(page.getByLabel("Verification code")).toHaveCount(0);
    expect((await context.cookies()).map((c) => c.name)).toEqual([]);
  });

  test("unknown demos get a 404 from the open link and the not-found page from the gate", async ({ page, request }) => {
    expect((await request.get("/demo/nope/open", { maxRedirects: 0 })).status()).toBe(404);
    // The gate page streams, so Next.js keeps status 200 here and shows the not-found page.
    await page.goto("/demo/nope");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/isn.t here/);
  });

  test("demo pages are kept out of search results", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Disallow: \/demo\//);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).not.toContain("/demo/");
    expect(sitemap).toContain("/work/restaurant-website-demos");
  });
});
