import type { NextConfig } from "next";
import { site } from "./content/site";

const isDev = process.env.NODE_ENV === "development";

/** Origin of the booking page, so it can be embedded and nothing else can. */
function embedOrigin(): string | null {
  if (!site.booking.url || !site.booking.embed) return null;
  try {
    return new URL(site.booking.url).origin;
  } catch {
    return null;
  }
}
const bookingOrigin = embedOrigin();

// No third-party origins except the booking page when it is embedded. Fonts are
// self-hosted by next/font and the contact form posts to a same-origin Server Action.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  `frame-src ${bookingOrigin ?? "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  /* config options here */
  // Automated browser tests build into their own folder so a running dev server is left alone.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  experimental: {
    agentFeedback: true,
    // The contact form sends a few kilobytes of text. Anything larger is refused.
    serverActions: { bodySizeLimit: "100kb" },
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
