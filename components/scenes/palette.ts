/**
 * Reads the site's colour tokens at runtime so the 3D scenes always match the CSS.
 * Canvas can resolve any CSS colour function (oklch included); the hex values below
 * are used only if a browser can't.
 */
const FALLBACK = {
  "--color-ink": "#0e1624",
  "--color-night": "#0e1625",
  "--color-on-night-2": "#a3acb8",
  "--color-night-rule": "#343e4d",
  "--color-accent": "#2c6be7",
  "--color-accent-bright": "#65a7fa",
  "--color-rose": "#e0456a",
  "--color-rose-bright": "#f08aa0",
  "--color-lagoon": "#0099a0",
  "--color-lagoon-bright": "#5ddae0",
  "--color-leaf": "#36a558",
  "--color-sun": "#fac131",
} as const;

export type PaletteName = keyof typeof FALLBACK;

export function readPalette(): Record<PaletteName, string> {
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  const style = getComputedStyle(document.documentElement);

  const out = {} as Record<PaletteName, string>;
  for (const name of Object.keys(FALLBACK) as PaletteName[]) {
    out[name] = FALLBACK[name];
    if (!ctx) continue;
    const raw = style.getPropertyValue(name).trim();
    if (!raw) continue;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#010203"; // sentinel: stays if the colour can't be parsed
    ctx.fillStyle = raw;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    if (r === 1 && g === 2 && b === 3) continue;
    out[name] = `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  }
  return out;
}
