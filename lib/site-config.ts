import { site } from "@/content/site";

/**
 * The one place the site address is decided. NEXT_PUBLIC_SITE_URL overrides the
 * value in content/site.ts. It must be a plain https origin; anything else is
 * ignored, so a typo in the environment can never point canonicals elsewhere.
 */
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    try {
      const url = new URL(fromEnv);
      if (url.protocol === "https:") return url.origin;
    } catch {
      // fall through to the default below
    }
  }
  return new URL(site.url).origin;
}

export const siteUrl = resolveSiteUrl();

/** Absolute URL for a path. The home page has no trailing slash, like every other page. */
export const absoluteUrl = (path = "/") => {
  if (path === "/" || path === "") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

/** Everything about the company that appears in metadata, schema and the footer. */
export const siteConfig = {
  ...site,
  url: siteUrl,
};

export type Profile = (typeof site.social)[number];

/** Profile URL for a network, if one was supplied. */
export const socialUrl = (id: Profile["id"]) => site.social.find((p) => p.id === id)?.url;
