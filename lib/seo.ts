import type { Metadata } from "next";
import { site, type Project } from "@/content/site";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, "");

export const absoluteUrl = (path = "/") => new URL(path, `${siteUrl}/`).toString();

export const DEFAULT_OG_IMAGE = {
  url: "/og/default.png",
  width: 1200,
  height: 630,
  alt: "OrbiTech: websites and software, built layer by layer",
};

interface PageMetaInput {
  /** Short page title. The root layout adds "— OrbiTech". */
  title: string;
  description: string;
  path: string;
  image?: { url: string; width: number; height: number; alt: string };
  noindex?: boolean;
}

export function pageMetadata({ title, description, path, image = DEFAULT_OG_IMAGE, noindex }: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: `${title} — ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      locale: "en_US",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.name}`,
      description,
      images: [image.url],
    },
  };
}

type JsonLd = Record<string, unknown>;

/** Only includes details you have actually provided. */
export function organizationLd(): JsonLd {
  const ld: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName ?? site.name,
    url: siteUrl,
    description: site.description,
  };
  if (site.email) ld.email = site.email;
  if (site.location) ld.address = site.location;
  if (site.profiles.length) ld.sameAs = site.profiles.map((p) => p.url);
  return ld;
}

export function creativeWorkLd(project: Project, path: string): JsonLd | null {
  if (!project.name) return null;
  const ld: JsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    url: absoluteUrl(path),
    creator: { "@type": "Organization", name: site.name, url: siteUrl },
  };
  if (project.summary) ld.description = project.summary;
  if (project.year) ld.dateCreated = project.year;
  if (project.client) ld.sourceOrganization = { "@type": "Organization", name: project.client };
  if (project.liveUrl) ld.sameAs = project.liveUrl;
  if (project.cover) ld.image = absoluteUrl(project.cover.src);
  if (project.stack.length) ld.keywords = project.stack.join(", ");
  return ld;
}
