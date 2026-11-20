import type { Metadata } from "next";
import { site } from "@/content/site";
import { absoluteUrl, siteConfig, socialUrl } from "@/lib/site-config";

export { absoluteUrl, siteUrl } from "@/lib/site-config";

export interface SocialImage {
  /** Path under /public or an absolute URL */
  url: string;
  width: number;
  height: number;
  alt: string;
}

export const DEFAULT_OG_IMAGE: SocialImage = {
  url: "/og/default.png",
  width: 1200,
  height: 630,
  alt: `${site.name}: ${site.tagline}`,
};

interface PageMetaInput {
  /** The complete <title>, brand included. Written per page, 50–60 characters. */
  title: string;
  /** 150–160 characters, unique per page */
  description: string;
  path: string;
  image?: SocialImage;
  /** Keeps the page out of search results. Links on it are still followed. */
  noindex?: boolean;
}

const asAbsolute = (url: string) => (/^https?:\/\//.test(url) ? url : absoluteUrl(url));

/** Title, description, canonical, Open Graph and Twitter tags for one page. */
export function pageMetadata({ title, description, path, image = DEFAULT_OG_IMAGE, noindex }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const picture = { ...image, url: asAbsolute(image.url) };
  const xProfile = socialUrl("x");

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: siteConfig.locale,
      type: "website",
      images: [picture],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: picture.url, alt: picture.alt }],
      ...(xProfile ? { site: `@${new URL(xProfile).pathname.replace(/\//g, "")}` } : {}),
    },
  };
}
