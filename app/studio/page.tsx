import type { Metadata } from "next";
import ClosingCta from "@/components/ClosingCta";
import JsonLd from "@/components/JsonLd";
import PageIntro from "@/components/PageIntro";
import TeamSection from "@/components/TeamSection";
import TechStackSection from "@/components/TechStackSection";
import { meta, site, studio } from "@/content/site";
import { staticPages } from "@/lib/pages";
import { breadcrumbNode, webPageNode, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const page = staticPages.studio;
const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Studio", path: page.path },
];

export const metadata: Metadata = pageMetadata({ ...meta.studio, path: page.path, noindex: !page.indexable });

export default function StudioPage() {
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            type: "AboutPage",
            path: page.path,
            name: meta.studio.title,
            description: meta.studio.description,
            dateModified: page.updated,
            breadcrumbs: crumbs,
          }),
          breadcrumbNode(page.path, crumbs),
        ]}
      />

      <PageIntro crumbs={crumbs} title={`About ${site.name}`} lede={site.description} />

      <section className="wrap" aria-labelledby="about-title">
        <div className="prose">
          <h2 id="about-title">Who we are</h2>
          {studio.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="wrap" aria-labelledby="agreements-title">
        <div className="prose">
          <h2 id="agreements-title">How we work together</h2>
          <ul className="practices">
            {studio.workingAgreements.map((agreement) => (
              <li key={agreement}>{agreement}</li>
            ))}
          </ul>
        </div>
      </section>

      <TeamSection />
      <TechStackSection />
      <ClosingCta />
    </>
  );
}
