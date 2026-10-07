import { expect, test } from "@playwright/test";

const pages: [path: string, title: RegExp][] = [
  ["/", /^OrbiTech — Websites and software/],
  ["/work", /^Work — OrbiTech$/],
  ["/work/project-3", /^Case study — OrbiTech$/],
  ["/services", /^Services — OrbiTech$/],
  ["/studio", /^Studio — OrbiTech$/],
  ["/contact", /^Contact — OrbiTech$/],
  ["/privacy", /^Privacy — OrbiTech$/],
];

test.describe("every page", () => {
  for (const [path, title] of pages) {
    test(`${path}: one h1, a title, a description and a canonical link`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(title);
      await expect(page.locator("h1")).toHaveCount(1);
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect((description ?? "").length).toBeGreaterThan(40);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${path === "/" ? "" : path}$`));
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og\/default\.png/);
    });
  }

  test("titles are unique", async ({ page }) => {
    const titles: string[] = [];
    for (const [path] of pages) {
      await page.goto(path);
      titles.push(await page.title());
    }
    expect(new Set(titles).size).toBe(titles.length);
  });

  test("images all have alt text and none are broken", async ({ page }) => {
    for (const [path] of pages) {
      await page.goto(path);
      await page.waitForLoadState("load");
      const problems = await page.evaluate(() =>
        [...document.images]
          .filter((img) => !img.hasAttribute("alt") || (img.complete && img.naturalWidth === 0))
          .map((img) => img.getAttribute("src")),
      );
      expect(problems, `${path}`).toEqual([]);
    }
  });
});

test.describe("search engines", () => {
  test("empty project slots are noindex, real pages are not", async ({ page }) => {
    await page.goto("/work/project-3");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await page.goto("/work");
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  });

  test("the thank-you page is noindex", async ({ page }) => {
    await page.goto("/contact/thanks");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("sitemap.xml lists pages but not empty project slots", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();
    expect(xml).toContain("/work</loc>");
    expect(xml).toContain("/services</loc>");
    expect(xml).not.toContain("project-3");
    expect(xml).not.toContain("/contact/thanks");
  });

  test("robots.txt points at the sitemap", async ({ request }) => {
    const text = await (await request.get("/robots.txt")).text();
    expect(text).toMatch(/Sitemap: .*\/sitemap\.xml/);
    expect(text).toContain("Disallow: /contact/thanks");
  });

  test("home page carries Organization structured data", async ({ page }) => {
    await page.goto("/");
    const json = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(JSON.parse(json ?? "{}")).toMatchObject({ "@type": "Organization", name: "OrbiTech" });
  });
});

test.describe("security headers", () => {
  test("are sent on pages", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});

test.describe("the 404 page", () => {
  test("is designed, says what happened and offers a way on", async ({ page }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/isn.t here/);
    await expect(page.getByRole("link", { name: "Home", exact: true }).last()).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("is also what an unknown case study shows", async ({ page }) => {
    const response = await page.goto("/work/this-project-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/isn.t here/);
  });

  test("links back to a working page", async ({ page }) => {
    await page.goto("/no-such-page");
    await page.getByRole("main").getByRole("link", { name: "Work" }).click();
    await expect(page).toHaveURL(/\/work$/);
  });
});
