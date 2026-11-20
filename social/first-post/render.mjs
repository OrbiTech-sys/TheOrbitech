/**
 * Renders slides.html to 1080×1350 PNGs (Instagram and Facebook 4:5 feed size).
 *
 *   node social/first-post/render.mjs
 *
 * Each slide is drawn at 2× and scaled down, so small type stays crisp.
 */
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 1500 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(join(here, "slides.html")).href, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);

const count = await page.locator(".slide").count();
for (let i = 1; i <= count; i++) {
  const shot = await page.locator(`#slide-${i}`).screenshot({ type: "png" });
  const out = join(here, `slide-${i}.png`);
  await sharp(shot).resize(1080, 1350).png({ compressionLevel: 9 }).toFile(out);
  console.log(out);
}
await browser.close();
