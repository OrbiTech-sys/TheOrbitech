import { expect, test } from "@playwright/test";

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

  test("links show a visible focus ring", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Services" });
    await link.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
    const outline = await link.evaluate((el) => {
      const style = getComputedStyle(el);
      return { width: style.outlineWidth, style: style.outlineStyle };
    });
    expect(outline.style).not.toBe("none");
    expect(parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
  });

  test("the current page is marked in the navigation", async ({ page }) => {
    await page.goto("/work/project-3");
    await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("the header compacts on scroll without moving the page", async ({ page }) => {
    await page.goto("/services");
    const header = page.locator("header.nav");
    await expect(header).toHaveAttribute("data-scrolled", "false");
    const before = await header.boundingBox();
    await page.mouse.wheel(0, 600);
    await expect(header).toHaveAttribute("data-scrolled", "true");
    const after = await header.boundingBox();
    expect(after?.height).toBe(before?.height);
    await page.mouse.wheel(0, -2000);
    await expect(header).toHaveAttribute("data-scrolled", "false");
  });

  test("the sticky heading stays below the header while scrolling", async ({ page }) => {
    await page.goto("/services");
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(300);
    const heading = page.locator(".service .split__head").first();
    const header = await page.locator("header.nav").boundingBox();
    const box = await heading.boundingBox();
    if (box && box.y < 900) expect(box.y).toBeGreaterThanOrEqual((header?.height ?? 0) - 1);
  });
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("opens, traps the page behind it, and closes with Escape", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menu" });
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();
    await expect(page.locator("#mobile-menu")).toBeHidden();

    await toggle.click();
    await expect(page.getByRole("button", { name: "Close" })).toHaveAttribute("aria-expanded", "true");
    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeVisible();
    for (const name of ["Work", "Services", "Studio", "Contact"]) {
      await expect(menu.getByRole("link", { name })).toBeVisible();
    }
    await expect(menu.getByRole("link", { name: "Work" })).toBeFocused();
    await expect(page.locator("#main")).toHaveAttribute("inert", "");

    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toBeHidden();
    await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
    await expect(page.locator("#main")).not.toHaveAttribute("inert", "");
  });

  test("choosing a link goes there and closes the menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Services" }).click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(page.locator("#mobile-menu")).toBeHidden();
    await expect(page.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
  });

  for (const width of [360, 390, 414]) {
    test(`no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      for (const path of ["/", "/work", "/services", "/studio", "/contact"]) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});
