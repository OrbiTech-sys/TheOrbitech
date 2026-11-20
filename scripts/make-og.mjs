/**
 * Builds a 1200×630 JPEG social preview for each case study from its existing
 * cover screenshot, so every network (some do not read WebP) shows a real image.
 *
 *   node scripts/make-og.mjs
 *
 * Writes public/og/work/<slug>.jpg. Run again after changing a cover image.
 */
import fs from "node:fs";
import sharp from "sharp";
import { projects } from "../content/site.ts";

await fs.promises.mkdir("public/og/work", { recursive: true });
for (const project of projects) {
  if (!project.cover) continue;
  const out = `public/og/work/${project.slug}.jpg`;
  await sharp(`public${project.cover.src}`)
    .resize(1200, 630, { fit: "cover", position: "top" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  console.log(out, (await fs.promises.stat(out)).size);
}
