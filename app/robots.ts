import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";

/**
 * One open rule for every crawler, so search engines and AI answer crawlers
 * (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot,
 * Claude-SearchBot) can all read the site. Only the thank-you page is excluded.
 * Training crawlers such as GPTBot, Google-Extended and CCBot are not named, so
 * they follow the same open rule until the owner decides otherwise.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/contact/thanks"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
