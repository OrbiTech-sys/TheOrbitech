import { expect, test } from "@playwright/test";
import { industryPages } from "../../content/industries";
import { insights } from "../../content/insights";
import { servicePages } from "../../content/offerings";
import { projects } from "../../content/site";

const BRAND = "The OrbiTech Solutions";

const published = projects.filter((p) => p.name && p.summary).map((p) => `/work/${p.slug}`);
const paths = [
  "/",
  "/services",
  ...servicePages.map((s) => `/services/${s.slug}`),
  "/industries",
  ...industryPages.map((i) => `/industries/${i.slug}`),
  "/work",
  ...published,
  "/studio",
  "/insights",
  "/contact",
  "/privacy",
];

test.describe("every page", () => {
  for (const path of paths) {
    test(`${path}: one h1, a branded title, a description and a canonical link`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      const title = await page.title();
      expect(title).toContain(BRAND);
      const description = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
      expect(description.length).toBeGreaterThanOrEqual(100);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        new RegExp(`^https://theorbitechsolution\\.com${path === "/" ? "$" : `${path}$`}`),
      );
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    });
  }

  test("titles and descriptions are unique across the site", async ({ page }) => {
    const titles: string[] = [];
    const descriptions: string[] = [];
    for (const path of paths) {
      await page.goto(path);
      titles.push(await page.title());
      descriptions.push((await page.locator('meta[name="description"]').getAttribute("content")) ?? "");
    }
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  test("images all have alt text and none are broken", async ({ page }) => {
    for (const path of ["/", "/services", "/industries", "/work", "/work/restaurant-website-demos", "/work/orbitos", "/studio"]) {
      await page.goto(path);
      await page.waitForLoadState("load");
      // Scroll through the page so lazy images load.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
      });
      await page.waitForTimeout(400);
      const problems = await page.evaluate(() =>
        [...document.images]
          .filter((img) => !img.hasAttribute("alt") || (img.complete && img.naturalWidth === 0))
          .map((img) => img.getAttribute("src")),
      );
      expect(problems, path).toEqual([]);
    }
  });

  test("no page shows a bracketed stand-in", async ({ page }) => {
    for (const path of paths) {
      await page.goto(path);
      const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
      expect(text, path).not.toMatch(/\[[A-Z][^\]]{3,60}\]/);
    }
  });
});

test.describe("search engines", () => {
  test("pages that should not be indexed say so", async ({ page }) => {
    for (const path of ["/terms", "/contact/thanks", "/demo/curly-co", `/insights/${insights[0].slug}`]) {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]').first(), path).toHaveAttribute("content", /noindex/);
    }
    for (const path of ["/", "/work", "/services/ai-engineering", "/industries/real-estate"]) {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"][content*="noindex"]'), path).toHaveCount(0);
    }
  });

  test("sitemap.xml lists the new pages, and leaves out drafts, demos and legal pages", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();
    for (const path of ["/work", "/services", "/industries", "/insights", ...servicePages.map((s) => `/services/${s.slug}`), ...industryPages.map((i) => `/industries/${i.slug}`)]) {
      expect(xml, path).toContain(`${path}</loc>`);
    }
    expect(xml).not.toContain("/contact/thanks");
    expect(xml).not.toContain("/demo/");
    expect(xml).not.toContain("/terms");
    for (const article of insights) expect(xml, article.slug).not.toContain(article.slug);
  });

  test("robots.txt points at the sitemap and keeps demo pages out", async ({ request }) => {
    const text = await (await request.get("/robots.txt")).text();
    expect(text).toMatch(/Sitemap: .*\/sitemap\.xml/);
    expect(text).toContain("Disallow: /contact/thanks");
    expect(text).toContain("Disallow: /demo/");
  });

  test("llms.txt guides AI assistants to services, industries and work", async ({ request }) => {
    const text = await (await request.get("/llms.txt")).text();
    expect(text).toContain("## Industries");
    expect(text).toContain("/services/ai-engineering");
    expect(text).toContain("/industries/healthcare");
    expect(text).toContain("/work/orbitos");
  });

  test("the home page carries Organization structured data", async ({ page }) => {
    await page.goto("/");
    const json = await page.locator('script[type="application/ld+json"]').first().textContent();
    const graph = JSON.parse(json ?? "{}")["@graph"] as { "@type": unknown; name?: string }[];
    expect(graph.some((node) => JSON.stringify(node["@type"]).includes("Organization") && node.name === BRAND)).toBe(true);
  });

  test("service and industry pages carry FAQ structured data that matches the visible questions", async ({ page }) => {
    for (const path of ["/services/ai-engineering", "/industries/healthcare"]) {
      await page.goto(path);
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      const graph = blocks.flatMap((b) => JSON.parse(b)["@graph"] as { "@type": string; mainEntity?: { name: string }[] }[]);
      const faq = graph.find((n) => n["@type"] === "FAQPage");
      expect(faq, path).toBeTruthy();
      for (const q of faq!.mainEntity!) await expect(page.getByText(q.name, { exact: true }).first(), q.name).toBeVisible();
    }
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
    await expect(page.getByRole("main").getByRole("link", { name: "Home", exact: true })).toBeVisible();
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  });

  test("is also what an unknown case study, service, industry or article shows", async ({ page }) => {
    // These pages stream, so Next.js keeps status 200 here and renders the not-found page with a noindex tag.
    for (const path of ["/work/nope", "/services/nope", "/industries/nope", "/insights/nope", "/demo/nope"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 }), path).toHaveText(/isn.t here/);
    }
  });

  test("links back to a working page", async ({ page }) => {
    await page.goto("/no-such-page");
    await page.getByRole("main").getByRole("link", { name: "Work" }).click();
    await expect(page).toHaveURL(/\/work$/);
  });
});
