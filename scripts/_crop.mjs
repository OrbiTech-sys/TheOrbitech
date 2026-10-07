import sharp from "sharp";
const [file, chunk = "1100", prefix = "crop"] = process.argv.slice(2);
const meta = await sharp(file).metadata();
const h = Number(chunk);
let i = 0;
for (let y = 0; y < meta.height; y += h, i++) {
  await sharp(file).extract({ left: 0, top: y, width: meta.width, height: Math.min(h, meta.height - y) }).toFile(`test-results/${prefix}-${i}.png`);
}
console.log(`${i} chunks of ${meta.width}x${h}`);
