import { expect, test, type Page } from "@playwright/test";

const stage = (page: Page) => page.locator(".stage");

async function posterIsShown(page: Page) {
  const poster = page.locator(".stage__poster");
  await expect(poster).toBeVisible();
  const loaded = await poster.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
  expect(loaded).toBe(true);
}

test.describe("the poster", () => {
  test("is the first thing loaded: prioritised, sized, and described", async ({ page }) => {
    await page.goto("/");
    const poster = page.locator(".stage__poster");
    await expect(poster).toHaveAttribute("fetchpriority", "high");
    await expect(poster).toHaveAttribute("width", "1800");
    await expect(poster).toHaveAttribute("height", "1500");
    expect(((await poster.getAttribute("alt")) ?? "").length).toBeGreaterThan(40);
    await expect(page.locator(".stage__canvas")).toHaveAttribute("aria-hidden", "true");
  });
});

test.describe("the live 3D scene", () => {
  test("loads after the page, fades in over the poster, and raises no errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));

    await page.goto("/");
    await expect(stage(page)).toHaveAttribute("data-state", "poster"); // poster first
    await expect(stage(page)).toHaveAttribute("data-state", "live", { timeout: 90_000 });
    await expect.poll(() => page.locator(".stage__canvas").evaluate((el) => getComputedStyle(el).opacity), { timeout: 5000 }).toBe("1");
    expect(errors).toEqual([]);
  });

  test("stops drawing once settled and when scrolled out of view", async ({ page }) => {
    await page.goto("/");
    await expect(stage(page)).toHaveAttribute("data-state", "live", { timeout: 90_000 });
    await expect(stage(page)).toHaveAttribute("data-settled", "true", { timeout: 120_000 });
  });
});

test.describe("fallbacks keep the still poster and never load the 3D scene", () => {
  test.describe("prefers-reduced-motion", () => {
    test.use({ reducedMotion: "reduce" });
    test("reduced motion", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("load");
      await page.waitForTimeout(4000);
      await expect(stage(page)).toHaveAttribute("data-state", "poster");
      await posterIsShown(page);
    });
  });

  test("Save-Data", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "connection", { value: { saveData: true } });
    });
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.waitForTimeout(4000);
    await expect(stage(page)).toHaveAttribute("data-state", "poster");
    await posterIsShown(page);
  });

  test("low-power device", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "hardwareConcurrency", { value: 2 });
    });
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.waitForTimeout(4000);
    await expect(stage(page)).toHaveAttribute("data-state", "poster");
  });

  test.describe("no WebGL", () => {
    test.use({ launchOptions: { args: ["--disable-gpu", "--disable-3d-apis", "--disable-webgl", "--disable-software-rasterizer"] } });
    test("WebGL unavailable", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/");
      await expect(stage(page)).toHaveAttribute("data-state", "failed", { timeout: 30_000 });
      await posterIsShown(page);
      expect(errors).toEqual([]);
    });
  });
});
