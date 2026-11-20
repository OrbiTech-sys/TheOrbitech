import type { MetadataRoute } from "next";
import { allPages } from "@/lib/pages";
import { absoluteUrl } from "@/lib/site-config";

/**
 * Built from the same page list that sets each page's robots tag, so a page that
 * is noindex is never submitted. Dates come from the content, not the clock.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return allPages()
    .filter((page) => page.indexable)
    .map((page) => ({ url: absoluteUrl(page.path), lastModified: page.updated }));
}
