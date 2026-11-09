import "server-only";

/**
 * Where each demo really lives. This file is imported only by server code (the
 * access route), so these addresses never appear in the page HTML or the
 * browser bundle. Keys match `demos[].id` in content/site.ts.
 */
const TARGETS: Record<string, string> = {
  "curly-co": "https://curlyco2026.vercel.app/",
  "food-chain": "https://foodchains.vercel.app/",
  "mad-mighty": "https://madmighty.vercel.app/",
  "maison-muse": "https://salon2026.vercel.app/",
  "ai-voice": "https://voice.theorbitechsolution.com/",
};

export function demoTarget(id: string): string | null {
  return Object.hasOwn(TARGETS, id) ? TARGETS[id] : null;
}
