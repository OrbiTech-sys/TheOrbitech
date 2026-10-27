/**
 * Captures the current landing page of every live demo and saves it as the
 * project's preview image (the card on the home page, the work grid and the
 * case-study hero).
 *
 *   node scripts/capture-previews.mjs            # writes over each live project's cover file
 *   node scripts/capture-previews.mjs some/dir   # writes to another folder, to review first
 *
 * Pages are shot at 1440×900 (a common laptop size) and saved at 1200×750, the
 * size recorded in content/site.ts. Run scripts/make-og.mjs afterwards so the
 * social preview images match.
 *
 * Optimised images are cached by URL (browsers keep them for hours), so when a
 * demo changes, save the new shot under a new file name and update `cover.src`
 * in content/site.ts. Otherwise some visitors keep seeing the old picture.
 */
import { mkdir } from "node:fs/promises";
import { basename, join } from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { projects } from "../content/site.ts";

const outDir = process.argv[2] ?? "public/work";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
  colorScheme: "light",
});

for (const project of projects) {
  if (!project.liveUrl || !project.cover) continue;
  const page = await context.newPage();
  // Demos on free hosting can take a while to wake up.
  await page.goto(project.liveUrl, { waitUntil: "networkidle", timeout: 90_000 });
  // Let entrance animations finish so nothing is caught half faded in.
  await page.waitForTimeout(8_000);
  await page.evaluate(() => window.scrollTo(0, 0));
  const shot = await page.screenshot({ type: "png" });
  const out = join(outDir, basename(project.cover.src));
  await sharp(shot).resize(1200, 750).webp({ quality: 82 }).toFile(out);
  console.log(`${project.slug}: ${page.url()} -> ${out}`);
  await page.close();
}

await browser.close();
