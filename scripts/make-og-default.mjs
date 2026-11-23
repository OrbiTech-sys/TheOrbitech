/**
 * Builds the default social-preview image (public/og/default.png, 1200×630): the logo, the home page
 * headline, the three capability words and the orbital sphere from the hero. Used by every page
 * that has no picture of its own, and by the Organization structured data.
 *
 *   node scripts/make-og-default.mjs
 *
 * The words come from content/site.ts and the fonts from app/fonts, so it matches the site.
 * Re-run it when the headline or the logo changes.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { home, site } from "../content/site.ts";

const [the, main, ...rest] = site.name.split(" ");
const mark = (await fs.promises.readFile("public/brand/orbitech-mark.svg", "utf8")).replace(/<svg /, '<svg class="mark" ');
const font = (file) => pathToFileURL(path.resolve("app/fonts", file)).href;

const HIGHLIGHT = "Intelligent Systems";
const [before, after] = home.headline.includes(HIGHLIGHT) ? home.headline.split(HIGHLIGHT) : [home.headline, ""];
const headline = after ? `${before}<span class="grad">${HIGHLIGHT}</span>${after}` : home.headline;

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: "M"; src: url("${font("montserrat-latin.woff2")}") format("woff2"); font-weight: 100 900; }
@font-face { font-family: "Mono"; src: url("${font("jetbrains-mono-latin.woff2")}") format("woff2"); font-weight: 100 800; }
* { box-sizing: border-box; }
html, body { margin: 0; }
.og { position: relative; width: 1200px; height: 630px; overflow: hidden; background: #080b12; color: #f5f6fa; font-family: "M", sans-serif;
  background-image: radial-gradient(780px 560px at 82% 40%, rgba(128,101,255,.34), transparent 70%), radial-gradient(520px 380px at 96% 100%, rgba(67,139,255,.22), transparent 70%); }
.og::before { content: ""; position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
  background-size: 48px 48px; -webkit-mask-image: radial-gradient(ellipse 80% 70% at 70% 40%, #000 20%, transparent 78%); mask-image: radial-gradient(ellipse 80% 70% at 70% 40%, #000 20%, transparent 78%); }
.brand { position: absolute; left: 64px; top: 56px; display: flex; align-items: center; gap: 18px; line-height: 1; }
.mark { width: 64px; height: 64px; }
.text { display: grid; gap: 5px; }
.the { font-size: 17px; font-weight: 400; opacity: .85; }
.line { display: flex; align-items: baseline; gap: .27em; font-size: 31px; }
.main { font-weight: 800; letter-spacing: -.04em; }
.rest { font-weight: 300; letter-spacing: -.015em; }
h1 { position: absolute; left: 64px; top: 190px; width: 640px; margin: 0; font-size: 68px; font-weight: 800; line-height: 1.04; letter-spacing: -.035em; }
.grad { background: linear-gradient(120deg, #b2a6ff, #8065ff 50%, #438bff); -webkit-background-clip: text; background-clip: text; color: transparent; }
.tags { position: absolute; left: 64px; bottom: 56px; font-family: "Mono", monospace; font-size: 20px; letter-spacing: .16em; color: #a99bff; }
.orb { position: absolute; right: -60px; top: 65px; width: 500px; height: 500px; }
</style>
<div class="og">
  <div class="brand">${mark}<div class="text"><span class="the">${the}</span><span class="line"><span class="main">${main}</span><span class="rest">${rest.join(" ")}</span></span></div></div>
  <h1>${headline}</h1>
  <div class="tags">${home.eyebrow}</div>
  <svg class="orb" viewBox="0 0 560 560" fill="none">
    <defs>
      <radialGradient id="core" cx="34%" cy="28%" r="80%"><stop offset="0" stop-color="#E4DEFF"/><stop offset=".38" stop-color="#8065FF"/><stop offset="1" stop-color="#1E1650"/></radialGradient>
      <linearGradient id="ring" x1="40" y1="280" x2="520" y2="280" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#438BFF" stop-opacity="0"/><stop offset=".5" stop-color="#8065FF" stop-opacity=".95"/><stop offset="1" stop-color="#438BFF" stop-opacity=".1"/></linearGradient>
    </defs>
    <circle cx="280" cy="280" r="262" stroke="#343d50" stroke-width="1"/>
    <circle cx="280" cy="280" r="196" stroke="#343d50" stroke-width="1" stroke-dasharray="2 7"/>
    <g transform="rotate(-24 280 280)"><ellipse cx="280" cy="280" rx="240" ry="92" stroke="url(#ring)" stroke-width="2"/><circle cx="520" cy="280" r="9" fill="#F5F6FA"/><circle cx="520" cy="280" r="19" fill="#8065FF" fill-opacity=".3"/></g>
    <g transform="rotate(38 280 280)"><ellipse cx="280" cy="280" rx="205" ry="70" stroke="url(#ring)" stroke-width="1.5" stroke-opacity=".8"/><circle cx="75" cy="280" r="6" fill="#438BFF"/><circle cx="75" cy="280" r="14" fill="#438BFF" fill-opacity=".25"/></g>
    <circle cx="280" cy="280" r="86" fill="url(#core)"/>
    <ellipse cx="280" cy="280" rx="86" ry="28" stroke="#fff" stroke-opacity=".1"/>
    <ellipse cx="280" cy="280" rx="28" ry="86" stroke="#fff" stroke-opacity=".1"/>
    <circle cx="280" cy="280" r="86" stroke="#fff" stroke-opacity=".16"/>
  </svg>
</div>`;

const file = path.join(os.tmpdir(), "orbitech-og.html");
await fs.promises.writeFile(file, html);
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(file).href);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: "public/og/default.png", type: "png" });
await browser.close();
console.log("public/og/default.png");
