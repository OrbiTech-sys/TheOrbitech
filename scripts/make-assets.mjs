/**
 * Renders the hero poster and the social-preview image from the live site.
 *
 *   1. Start the site:            npm run dev   (or npm run start after a build)
 *   2. Run this script:           npm run assets -- http://localhost:3000
 *
 * Re-run it whenever the 3D scene, the colours or the headline change.
 * Output: public/hero/layers-poster.webp and public/og/default.png
 */
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const root = process.cwd();

const browser = await chromium.launch({
  channel: "chrome",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});

try {
  /* ── 1. The poster: the scene in its settled state, at 6:5 ── */
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  page.on("pageerror", (error) => console.error("page error:", error.message));
  await page.goto(`${base}/`, { waitUntil: "load" });
  await page.waitForSelector('.stage[data-state="live"]', { timeout: 90_000 });
  await page.waitForSelector('.stage[data-settled="true"]', { timeout: 120_000 });

  // Pin the stage to an exact size so the poster is 1800 × 1500.
  await page.addStyleTag({
    content: `
      .hero__stage { position: fixed !important; inset: 0 auto auto 0 !important; width: 900px !important; margin: 0 !important; z-index: 9999 !important; }
      .stage { border-radius: 0 !important; }
      .reveal { animation: none !important; }
    `,
  });
  await page.waitForTimeout(1500);
  const posterPng = await page.locator(".stage").screenshot({ type: "png" });
  const posterWebp = await sharp(posterPng).resize(1800, 1500).webp({ quality: 82, effort: 5 }).toBuffer();
  await mkdir(join(root, "public/hero"), { recursive: true });
  await writeFile(join(root, "public/hero/layers-poster.webp"), posterWebp);
  console.log(`poster: public/hero/layers-poster.webp (${(posterWebp.length / 1024).toFixed(0)} KB)`);
  await context.close();

  /* ── 2. The social preview, composed with the site's own fonts and tokens ── */
  // Reuse the site's real stylesheets (and so its fonts and colour tokens) on a script-free page.
  const probe = await browser.newPage();
  await probe.goto(`${base}/`, { waitUntil: "load" });
  const head = await probe.evaluate(() => ({
    htmlClass: document.documentElement.className,
    links: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href),
    styles: [...document.querySelectorAll("style")].map((s) => s.textContent ?? ""),
  }));
  await probe.close();

  const markup = `<!doctype html><html class="${head.htmlClass}"><head><meta charset="utf-8">
    ${head.links.map((href) => `<link rel="stylesheet" href="${href}">`).join("")}
    <style>${head.styles.join(" ")}</style></head>
    <body style="margin:0;overflow:hidden">
      <div style="position:relative;width:1200px;height:630px;overflow:hidden;background:var(--color-paper);color:var(--color-ink);font-family:var(--font-body)">
        <img src="${base}/hero/layers-poster.webp" alt="" style="position:absolute;right:0;top:0;height:630px;width:756px;object-fit:cover" />
        <div style="position:absolute;left:64px;top:56px;display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-weight:700;font-size:34px;letter-spacing:var(--tracking-title)">
          <svg viewBox="0 0 20 20" width="30" height="30"><circle cx="10" cy="10" r="6.75" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="14.8" cy="5.2" r="3.1" fill="var(--color-accent)" stroke="var(--color-paper)" stroke-width="1.6"/></svg>
          OrbiTech
        </div>
        <div style="position:absolute;left:64px;top:170px;width:520px;font-family:var(--font-display);font-weight:var(--weight-heading);font-size:78px;line-height:var(--leading-display);letter-spacing:var(--tracking-display)">
          Websites and software, built layer by layer.
        </div>
        <div style="position:absolute;left:64px;bottom:56px;font-size:24px;color:var(--color-ink-2)">Design · build · care</div>
      </div>
    </body></html>`;

  const ogContext = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await ogContext.route(`${base}/__og`, (route) => route.fulfill({ contentType: "text/html", body: markup }));
  const og = await ogContext.newPage();
  await og.goto(`${base}/__og`, { waitUntil: "load" });
  await og.evaluate(() => document.fonts.ready);
  await og.waitForTimeout(800);
  const ogPng = await og.screenshot({ type: "png" });
  await mkdir(join(root, "public/og"), { recursive: true });
  await writeFile(join(root, "public/og/default.png"), await sharp(ogPng).png({ compressionLevel: 9 }).toBuffer());
  console.log("social preview: public/og/default.png");
  await ogContext.close();
} finally {
  await browser.close();
}
