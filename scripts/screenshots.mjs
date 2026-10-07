/**
 * Screenshots every page at desktop and phone width and checks each one for
 * horizontal overflow, broken images, and console errors.
 *
 *   npm run screenshots -- http://localhost:3000 [outputFolder] [--live]
 *
 * By default the 3D hero is replaced by its still poster so runs are fast and
 * repeatable. Pass --live to let the real 3D scene run.
 * Exits with a non-zero code if any check fails.
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const args = process.argv.slice(2);
const base = (args.find((a) => a.startsWith("http")) ?? "http://localhost:3000").replace(/\/$/, "");
const outDir = args.find((a) => !a.startsWith("http") && !a.startsWith("--")) ?? "test-results/screenshots";
const live = args.includes("--live");

const pages = [
  ["home", "/"],
  ["work", "/work"],
  ["case-study", "/work/orbit-operations"],
  ["services", "/services"],
  ["studio", "/studio"],
  ["contact", "/contact"],
  ["thanks", "/contact/thanks"],
  ["privacy", "/privacy"],
  ["404", "/this-page-does-not-exist"],
];
const viewports = [
  ["1440", { width: 1440, height: 900 }, false],
  ["390", { width: 390, height: 844 }, true],
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({
  channel: "chrome",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});

let failures = 0;
for (const [label, viewport, mobile] of viewports) {
  const context = await browser.newContext({
    viewport,
    isMobile: mobile,
    hasTouch: mobile,
    deviceScaleFactor: 1,
    reducedMotion: live ? "no-preference" : "reduce",
  });
  for (const [name, path] of pages) {
    const page = await context.newPage();
    const problems = [];
    page.on("pageerror", (error) => problems.push(`script error: ${error.message}`));
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      // The 404 page's own "404" status is reported as a console error by the browser. That is expected.
      if (name === "404" && /status of 404/.test(msg.text())) return;
      problems.push(`console error: ${msg.text().slice(0, 400)}`);
    });

    const response = await page.goto(`${base}${path}`, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    if (live && name === "home") await page.waitForSelector('.stage[data-state="live"]', { timeout: 90_000 }).catch(() => problems.push("3D scene never went live"));
    await page.waitForTimeout(live ? 3000 : 700);

    const report = await page.evaluate(() => {
      const root = document.documentElement;
      const overflowing = [...document.querySelectorAll("body *")]
        .filter((el) => {
          if (el.closest(".honeypot")) return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > root.clientWidth + 1 || r.left < -1);
        })
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join(".")}`);
      const broken = [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.getAttribute("src"));
      // Clickable text must stay on one line.
      const wrapped = [...document.querySelectorAll(".btn, .chip, .ulink, .nav__toggle")]
        .filter((el) => el.offsetParent !== null && el.getBoundingClientRect().height > 64)
        .map((el) => (el.textContent ?? "").trim());
      return { scrollW: root.scrollWidth, clientW: root.clientWidth, height: root.scrollHeight, overflowing, broken, wrapped };
    });

    if (report.scrollW > report.clientW) problems.push(`horizontal overflow: ${report.scrollW} > ${report.clientW} (${report.overflowing.join(", ")})`);
    if (report.broken.length) problems.push(`broken images: ${report.broken.join(", ")}`);
    if (report.wrapped.length) problems.push(`clickable text wraps: ${report.wrapped.join(" | ")}`);
    const expected = name === "404" ? 404 : 200;
    if (response?.status() !== expected) problems.push(`status ${response?.status()} (expected ${expected})`);

    await page.screenshot({ path: join(outDir, `${name}-${label}.png`), fullPage: true });
    const verdict = problems.length ? "FAIL" : "ok  ";
    console.log(`${verdict} ${label.padStart(4)}  ${path.padEnd(28)} ${String(report.height).padStart(6)}px${problems.length ? "\n       " + problems.join("\n       ") : ""}`);
    failures += problems.length;
    await page.close();
  }
  await context.close();
}
await browser.close();
console.log(failures ? `\n${failures} problem(s)` : "\nall pages passed");
process.exit(failures ? 1 : 0);
