/**
 * Builds the app icons from the brand mark used in the site header
 * (components/Navbar.tsx, .brand-mark in app/portfolio.css): a cyan ring, a violet
 * and a gold orbit, and the letter O, on the site's navy background.
 *
 *   node scripts/make-icons.mjs
 *
 * Writes app/icon.png (512), app/apple-icon.png (180) and app/favicon.ico (32 + 48).
 */
import fs from "node:fs";
import sharp from "sharp";

const mark = (stroke) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" fill="#090d1b"/>
  <g transform="translate(3 3)">
    <circle cx="21" cy="21" r="20" fill="none" stroke="#63e6df" stroke-opacity="0.75" stroke-width="${stroke}"/>
    <ellipse cx="21" cy="21" rx="13" ry="5.5" fill="none" stroke="#a99bff" stroke-width="${stroke}" transform="rotate(-35 21 21)"/>
    <ellipse cx="21" cy="21" rx="15.5" ry="6.5" fill="none" stroke="#f2d49a" stroke-width="${stroke}" transform="rotate(55 21 21)"/>
    <text x="21" y="25.6" font-size="13" font-weight="900" text-anchor="middle" fill="#63e6df" font-family="Segoe UI, Arial, Helvetica, sans-serif">O</text>
  </g>
</svg>`;

const png = (size, stroke) => sharp(Buffer.from(mark(stroke)), { density: 72 * (size / 48) }).resize(size, size).png().toBuffer();

await fs.promises.writeFile("app/icon.png", await png(512, 1));
await fs.promises.writeFile("app/apple-icon.png", await png(180, 1.2));

// favicon.ico: an ICO container holding PNG images, which every current browser reads.
const images = [await png(32, 1.8), await png(48, 1.5)];
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = 6 + 16 * images.length;
const entries = images.map((data, i) => {
  const size = [32, 48][i];
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0);
  entry.writeUInt8(size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(data.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += data.length;
  return entry;
});
await fs.promises.writeFile("app/favicon.ico", Buffer.concat([header, ...entries, ...images]));
console.log("icons written");
