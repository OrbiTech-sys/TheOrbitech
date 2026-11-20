import type { Metadata } from "next";
import Link from "next/link";
import AtAGlance from "@/components/AtAGlance";
import ClosingCta from "@/components/ClosingCta";
import JsonLd from "@/components/JsonLd";
import LastUpdated from "@/components/LastUpdated";
import PageIntro from "@/components/PageIntro";
import ProcessSection from "@/components/ProcessSection";
import QuestionsSection from "@/components/QuestionsSection";
import SecuritySection from "@/components/SecuritySection";
import { meta, services } from "@/content/site";
import { glanceRows } from "@/lib/glance";
import { staticPages } from "@/lib/pages";
import { projectHref, projectsForService } from "@/lib/projects";
import { breadcrumbNode, serviceNodes, webPageNode, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const page = staticPages.services;
const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Services", path: page.path },
];

export const metadata: Metadata = pageMetadata({ ...meta.services, path: page.path });

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            path: page.path,
            name: meta.services.title,
            description: meta.services.description,
            dateModified: page.updated,
            breadcrumbs: crumbs,
          }),
          breadcrumbNode(page.path, crumbs),
          ...serviceNodes(),
        ]}
      />

      <PageIntro
        crumbs={crumbs}
        title="AI automation, web development and data services"
        lede="Six service areas. For each one: what is included and the work that shows it."
      >
        <LastUpdated date={page.updated} />
      </PageIntro>

      <AtAGlance id="services-glance-title" title="Services at a glance" rows={glanceRows} />

      <section className="wrap" aria-label="Service areas">
        {services.map((service) => {
          const related = projectsForService(service.id);
          return (
            <article key={service.id} id={service.id} className="service">
              <div className="service__head">
                <span className="service__number">{service.number}</span>
                <h2>{service.heading}</h2>
                <p>{service.summary}</p>
              </div>

              <div className="service__body">
                <h3>What’s included</h3>
                <ul className="checks">
                  {service.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                {related.length > 0 && (
                  <>
                    <h3>Related work</h3>
                    <ul className="service__work">
                      {related.map((project) => (
                        <li key={project.slug}>
                          <Link href={projectHref(project)}>{project.name}</Link>
                          <span>{project.kind}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <ProcessSection />
      <QuestionsSection />
      <SecuritySection />
      <ClosingCta />
    </>
  );
}
