import { expect, test } from "@playwright/test";
import { industryPages } from "../../content/industries";
import { servicePages } from "../../content/offerings";

const primary = (page: import("@playwright/test").Page) => page.getByRole("navigation", { name: "Primary" });

test.describe("keyboard and header (desktop)", () => {
  test("the skip link is the first stop and moves focus to the content", async ({ page }) => {
    await page.goto("/work");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("the primary navigation has every link the site promises, and the CTA", async ({ page }) => {
    await page.goto("/");
    const nav = primary(page);
    for (const name of ["Home", "Work", "Studio", "Insights", "Contact"]) await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
    for (const name of ["Services", "Industries"]) await expect(nav.getByRole("button", { name })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("link", { name: "Let’s Talk" })).toHaveAttribute("href", "/contact");
  });

  test("links show a visible focus ring", async ({ page }) => {
    await page.goto("/");
    const link = primary(page).getByRole("link", { name: "Work", exact: true });
    await link.focus();
    await expect(link).toBeFocused();
    const outline = await link.evaluate((el) => {
      const style = getComputedStyle(el);
      return { width: style.outlineWidth, style: style.outlineStyle };
    });
    expect(outline.style).not.toBe("none");
    expect(parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
  });

  test("the current page is marked in the navigation", async ({ page }) => {
    await page.goto("/work/orbitos");
    await expect(primary(page).getByRole("link", { name: "Work", exact: true })).toHaveAttribute("aria-current", "page");
    await page.goto("/services/automation");
    await expect(primary(page).getByRole("button", { name: "Services" })).toHaveAttribute("aria-current", "page");
  });

  test("the Services menu opens on hover with every service, and closes when the pointer leaves", async ({ page }) => {
    await page.goto("/");
    const button = primary(page).getByRole("button", { name: "Services" });
    await button.hover();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    const menu = page.locator("#menu-Services");
    for (const service of servicePages) await expect(menu.getByRole("link", { name: service.navLabel })).toBeVisible();
    await expect(menu.getByRole("link", { name: "All services" })).toBeVisible();
    await page.mouse.move(700, 700);
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("the Industries menu works by keyboard, closes with Escape, and its links go to real pages", async ({ page }) => {
    await page.goto("/");
    const button = primary(page).getByRole("button", { name: "Industries" });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    for (const industry of industryPages) await expect(page.locator("#menu-Industries").getByRole("link", { name: industry.name })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.click();
    await page.locator("#menu-Industries").getByRole("link", { name: "Healthcare" }).click();
    await expect(page).toHaveURL(/\/industries\/healthcare$/);
  });

  test("a click keeps a menu open after hover has opened it", async ({ page }) => {
    await page.goto("/");
    const button = primary(page).getByRole("button", { name: "Services" });
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
  });

  test("the header stays at the top while scrolling", async ({ page }) => {
    await page.goto("/services");
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(300);
    const box = await page.locator("header.site-header").boundingBox();
    expect(box?.y).toBeLessThanOrEqual(1);
  });

  test("the footer links to every service, industry and legal page", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    for (const service of servicePages) await expect(footer.locator(`a[href="/services/${service.slug}"]`)).toHaveCount(1);
    for (const industry of industryPages) await expect(footer.locator(`a[href="/industries/${industry.slug}"]`)).toHaveCount(1);
    await expect(footer.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");
    await expect(footer.getByRole("link", { name: "Terms and Conditions" })).toHaveAttribute("href", "/terms");
  });
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("opens as a full drawer, locks the page behind it, and closes with Escape", async ({ page }) => {
    await page.goto("/");
    const drawer = page.locator("#mobile-nav");
    await expect(primary(page)).toBeHidden();
    await expect(drawer).toBeHidden();

    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await expect(drawer).toBeVisible();
    for (const name of ["Home", "Work", "Studio", "Insights", "Contact"]) await expect(drawer.getByRole("link", { name, exact: true })).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Let’s Talk" })).toBeVisible();
    // the drawer covers the page below the header, not a thin strip of it
    const box = await drawer.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThan(600);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });

  test("Services and Industries expand to their pages inside the drawer", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-nav summary", { hasText: "Services" }).click();
    for (const service of servicePages) await expect(page.locator("#mobile-nav").getByRole("link", { name: service.navLabel })).toBeVisible();
    await page.locator("#mobile-nav").getByRole("link", { name: "AI Engineering" }).click();
    await expect(page).toHaveURL(/\/services\/ai-engineering$/);
    await expect(page.locator("#mobile-nav")).toBeHidden();
  });

  test("choosing a link goes there and closes the menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-nav").getByRole("link", { name: "Work", exact: true }).click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.locator("#mobile-nav")).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });

  for (const width of [320, 360, 390, 414]) {
    test(`no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      const routes = ["/", "/work", "/services", "/services/ai-engineering", "/industries", "/industries/real-estate", "/studio", "/insights", "/contact", "/terms"];
      for (const path of routes) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});
