/**
 * Exports the full logo (the mark plus the name) as transparent PNGs, set in the site's own font.
 *
 *   node scripts/make-logo.mjs
 *
 * Writes public/brand/orbitech-logo.png (dark text, for light backgrounds) and
 * public/brand/orbitech-logo-white.png (white text, for dark backgrounds).
 * The lockup is the one in components/ui/BrandLockup.tsx: "The" small and light,
 * "OrbiTech" heavy, "Solutions" light. The name comes from content/site.ts, so it matches the site.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { site } from "../content/site.ts";

const [the, main, ...rest] = site.name.split(" ");
const mark = (await fs.promises.readFile("public/brand/orbitech-mark.svg", "utf8")).replace(/<svg /, '<svg class="mark" ');
const font = pathToFileURL(path.resolve("app/fonts/montserrat-latin.woff2")).href;

const page = (ink) => `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: "Montserrat Brand"; src: url("${font}") format("woff2"); font-weight: 100 900; }
html, body { margin: 0; background: transparent; }
.logo { display: inline-flex; align-items: center; gap: 70px; padding: 60px; color: ${ink}; font-family: "Montserrat Brand", sans-serif; line-height: 1; }
.mark { width: 330px; height: 330px; flex: none; }
.text { display: grid; gap: 14px; }
.the { font-size: 92px; font-weight: 400; }
.line { display: flex; align-items: baseline; gap: 0.26em; font-size: 178px; white-space: nowrap; }
.main { font-weight: 800; letter-spacing: -0.04em; }
.rest { font-weight: 300; letter-spacing: -0.015em; }
</style><div class="logo" id="logo">${mark}<div class="text"><span class="the">${the}</span><span class="line"><span class="main">${main}</span><span class="rest">${rest.join(" ")}</span></span></div></div>`;

const browser = await chromium.launch({ channel: "chrome" });
for (const [file, ink] of [
  ["orbitech-logo.png", "#0a0f2a"],
  ["orbitech-logo-white.png", "#ffffff"],
]) {
  const html = path.join(os.tmpdir(), `orbitech-${file}.html`);
  await fs.promises.writeFile(html, page(ink));
  const tab = await browser.newPage({ viewport: { width: 2600, height: 900 } });
  await tab.goto(pathToFileURL(html).href);
  await tab.evaluate(() => document.fonts.ready);
  await tab.locator("#logo").screenshot({ path: `public/brand/${file}`, omitBackground: true });
  await tab.close();
  console.log(file);
}
await browser.close();
