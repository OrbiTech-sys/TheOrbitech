import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PortfolioHome from "@/components/PortfolioHome";
import { home, meta, process as processSteps, projects, services, site } from "@/content/site";
import { glanceRows } from "@/lib/glance";
import { staticPages } from "@/lib/pages";
import { showcaseProjects } from "@/lib/projects";
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
      <PortfolioHome
        siteName={site.name}
        description={site.description}
        slogan={home.slogan}
        closingText={home.closing.text}
        email={site.email}
        glanceRows={glanceRows}
        services={services}
        processSteps={processSteps}
        projects={showcaseProjects(projects)}
      />
    </>
  );
}
