import "server-only";
import { site } from "@/content/site";

/** Same-origin check on top of the one Next.js already performs for Server Actions. */
export function isSameOrigin(requestHeaders: Headers): boolean {
  const origin = requestHeaders.get("origin");
  const allowedHosts = new Set<string>();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  if (host) allowedHosts.add(host);
  try {
    allowedHosts.add(new URL(site.url).host);
  } catch {
    /* site.url is not a valid URL: fall back to the request host only */
  }

  if (origin) {
    try {
      return allowedHosts.has(new URL(origin).host);
    } catch {
      return false;
    }
  }
  const fetchSite = requestHeaders.get("sec-fetch-site");
  return !fetchSite || fetchSite === "same-origin";
}

export function clientIp(requestHeaders: Headers): string {
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown"
  );
}

const buckets = new Map<string, number[]>();

/**
 * Counts a hit and says whether the key is over its limit. Per-instance memory:
 * it stops casual abuse. Use a shared store such as Redis if the site ever runs
 * on several instances and needs a hard limit.
 */
export function overLimit(bucket: string, key: string, windowMs: number, max: number): boolean {
  const now = Date.now();
  const id = `${bucket}:${key}`;
  const hits = (buckets.get(id) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(id, hits);
    return true;
  }
  hits.push(now);
  buckets.set(id, hits);
  if (buckets.size > 4000) {
    for (const [k, times] of buckets) {
      if (times.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return false;
}
