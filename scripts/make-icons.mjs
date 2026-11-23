/**
 * Builds the favicon, the app icons and the standalone mark from the brand mark,
 * public/brand/orbitech-mark.svg (the same artwork as components/ui/LogoMark.tsx).
 *
 *   node scripts/make-icons.mjs
 *
 * Writes:
 *   app/icon.png                 512 px, rounded tile on a transparent background
 *   app/apple-icon.png           180 px, a full square: iOS rounds the corners itself
 *   app/favicon.ico              16, 32 and 48 px
 *   public/brand/orbitech-mark.png   1024 px, for social profiles and documents
 */
import fs from "node:fs";
import sharp from "sharp";

const svg = await fs.promises.readFile("public/brand/orbitech-mark.svg", "utf8");
// The tile's corner radius is the only part that changes for the square variant.
const square = svg.replace('rx="27"', 'rx="0"');

const png = (source, size) => sharp(Buffer.from(source), { density: Math.max(72, 72 * (size / 100)) }).resize(size, size).png().toBuffer();

await fs.promises.writeFile("app/icon.png", await png(svg, 512));
await fs.promises.writeFile("app/apple-icon.png", await png(square, 180));
await fs.promises.writeFile("public/brand/orbitech-mark.png", await png(svg, 1024));

// favicon.ico: an ICO container holding PNG images, which every current browser reads.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((size) => png(svg, size)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = 6 + 16 * images.length;
const entries = images.map((data, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(sizes[i], 0);
  entry.writeUInt8(sizes[i], 1);
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
