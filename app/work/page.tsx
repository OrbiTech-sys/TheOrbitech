import type { Metadata } from "next";
import ClosingCta from "@/components/ClosingCta";
import JsonLd from "@/components/JsonLd";
import LastUpdated from "@/components/LastUpdated";
import PageIntro from "@/components/PageIntro";
import WorkIndex from "@/components/WorkIndex";
import { meta, projectTypes } from "@/content/site";
import { showcaseProjects } from "@/lib/projects";
import { staticPages } from "@/lib/pages";
import { breadcrumbNode, projectListNode, webPageNode, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-config";

const page = staticPages.work;
const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Work", path: page.path },
];

export const metadata: Metadata = pageMetadata({ ...meta.work, path: page.path });


export default function WorkPage() {
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            type: "CollectionPage",
            path: page.path,
            name: meta.work.title,
            description: meta.work.description,
            dateModified: page.updated,
            breadcrumbs: crumbs,
            mainEntity: { "@id": `${absoluteUrl(page.path)}#projects` },
          }),
          breadcrumbNode(page.path, crumbs),
          projectListNode(),
        ]}
      />

      <PageIntro
        crumbs={crumbs}
        title="AI and web projects with live demos"
        lede="Each project has a case study that says what it does, what it shows and which service area it belongs to."
      >
        <LastUpdated date={page.updated} />
      </PageIntro>

      <section className="wrap" aria-labelledby="demos-title">
        <div className="prose">
          <h2 id="demos-title">What our demos show</h2>
          <p>
            The OrbiTech Solutions shows its work as four live demos and two private projects. The live demos are Orbit Operations Copilot, a CRM with an AI
            copilot; Property Management System, a property operations workspace; AidoChat, an AI document chat that cites its sources;
            and AI E-commerce Experience, a storefront with natural-language product search. The private projects are a WhatsApp business
            chatbot and a bulk email agent. They are listed without public links to respect confidentiality. Demos and prototypes are
            labelled as such, and each case study says what the project does and which service area it belongs to.
          </p>
        </div>
      </section>

      <section className="wrap" aria-label="Projects">
        <WorkIndex projects={showcaseProjects()} projectTypes={projectTypes} />
      </section>
      <ClosingCta />
    </>
  );
}
