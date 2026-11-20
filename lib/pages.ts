import { privacy, projects, site } from "@/content/site";
import { isPublished, projectHref } from "@/lib/projects";

/**
 * Every page that is listed in the sitemap, with the date its content last
 * changed. Metadata, structured data and sitemap.xml all read from here, so a
 * page cannot be indexable in one place and hidden in another.
 */
export interface PageEntry {
  path: string;
  /** ISO date of the last meaningful content change */
  updated: string;
  /** false keeps the page out of search results and out of the sitemap */
  indexable: boolean;
}

export const staticPages: Record<"home" | "services" | "work" | "studio" | "contact" | "privacy", PageEntry> = {
  home: { path: "/", updated: site.contentUpdated, indexable: true },
  services: { path: "/services", updated: site.contentUpdated, indexable: true },
  work: { path: "/work", updated: site.contentUpdated, indexable: true },
  studio: { path: "/studio", updated: site.contentUpdated, indexable: true },
  contact: { path: "/contact", updated: site.contentUpdated, indexable: true },
  // The privacy text is not complete until a retention period is supplied.
  privacy: { path: "/privacy", updated: site.contentUpdated, indexable: Boolean(privacy.retention) },
};

export function allPages(): PageEntry[] {
  return [
    ...Object.values(staticPages),
    ...projects.filter(isPublished).map((project) => ({
      path: projectHref(project),
      updated: project.updated,
      indexable: true,
    })),
  ];
}

/** "2026-10-27" → "27 October 2026" (fixed locale and zone, so output never varies by server). */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
