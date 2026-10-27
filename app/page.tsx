import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PortfolioHome from "@/components/PortfolioHome";
import { meta } from "@/content/site";
import { staticPages } from "@/lib/pages";
import { webPageNode } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const page = staticPages.home;

export const metadata: Metadata = pageMetadata({ ...meta.home, path: page.path });

export default function Home() {
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            path: page.path,
            name: meta.home.title,
            description: meta.home.description,
            dateModified: page.updated,
          }),
        ]}
      />
      <PortfolioHome />
    </>
  );
}
