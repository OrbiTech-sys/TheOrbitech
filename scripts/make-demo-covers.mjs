/**
 * Builds the card images for the demo projects from full-size screenshots.
 *
 *   node scripts/make-demo-covers.mjs <folder with the *-desktop.webp / *-mobile.webp screenshots>
 *
 * Writes into public/work:
 *   <name>-landing.webp          1200×750 cover for each demo
 *   <name>-mobile.webp           phone screenshot, copied as it is
 *   restaurant-demos-landing.webp  the three restaurant demos fanned on one card
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const source = process.argv[2];
if (!source) throw new Error("Pass the folder that holds the screenshots.");
const out = "public/work";
const names = ["curly-co", "food-chains", "mad-mighty", "salon", "ai-voice"];

for (const name of names) {
  await sharp(path.join(source, `${name}-desktop.webp`))
    .resize(1200, 750, { fit: "cover", position: "top" })
    .webp({ quality: 84 })
    .toFile(path.join(out, `${name}-landing.webp`));
  fs.copyFileSync(path.join(source, `${name}-mobile.webp`), path.join(out, `${name}-mobile.webp`));
}

// The fan: the first demo in front, the last at the back.
const W = 1200;
const H = 750;
const SHOT = { w: 700, h: 437 };
const RADIUS = 18;
const slots = [
  { name: "mad-mighty", x: 470, y: 40 },
  { name: "food-chains", x: 250, y: 150 },
  { name: "curly-co", x: 30, y: 270 },
];
const mask = Buffer.from(`<svg width="${SHOT.w}" height="${SHOT.h}"><rect width="${SHOT.w}" height="${SHOT.h}" rx="${RADIUS}" fill="#fff"/></svg>`);
const ring = Buffer.from(
  `<svg width="${SHOT.w}" height="${SHOT.h}"><rect x="0.5" y="0.5" width="${SHOT.w - 1}" height="${SHOT.h - 1}" rx="${RADIUS}" fill="none" stroke="rgba(177,198,230,0.35)"/></svg>`,
);

const layers = [];
for (const slot of slots) {
  const shot = await sharp(path.join(source, `${slot.name}-desktop.webp`))
    .resize(SHOT.w, SHOT.h, { fit: "cover", position: "top" })
    .composite([{ input: mask, blend: "dest-in" }, { input: ring }])
    .png()
    .toBuffer();
  const shadow = await sharp({ create: { width: SHOT.w, height: SHOT.h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0.55 } } })
    .composite([{ input: mask, blend: "dest-in" }])
    .blur(22)
    .png()
    .toBuffer();
  layers.push({ input: shadow, left: slot.x - 6, top: slot.y + 14 }, { input: shot, left: slot.x, top: slot.y });
}

const background = Buffer.from(
  `<svg width="${W}" height="${H}"><defs><radialGradient id="g" cx="75%" cy="10%" r="90%"><stop offset="0" stop-color="#1c2a55"/><stop offset="0.55" stop-color="#101a32"/><stop offset="1" stop-color="#090d1b"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`,
);
await sharp(background).composite(layers).webp({ quality: 86 }).toFile(path.join(out, "restaurant-demos-landing.webp"));
console.log("done");
