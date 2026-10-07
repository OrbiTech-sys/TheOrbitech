import type { MetadataRoute } from "next";
import { projects } from "@/content/site";
import { isRealProject, projectHref } from "@/lib/projects";
import { absoluteUrl } from "@/lib/seo";

// Pages are prerendered, so dates can't come from the clock. Update this when content changes.
const LAST_CONTENT_CHANGE = "2026-10-07";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/work", "/services", "/studio", "/contact", "/privacy"];

  return [
    ...pages.map((path) => ({
      url: absoluteUrl(path),
      lastModified: LAST_CONTENT_CHANGE,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    // Empty project slots are left out until they have a name and a live address.
    ...projects.filter(isRealProject).map((project) => ({
      url: absoluteUrl(projectHref(project)),
      lastModified: LAST_CONTENT_CHANGE,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
