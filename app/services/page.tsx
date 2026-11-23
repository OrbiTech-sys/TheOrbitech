import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AtAGlance from "@/components/AtAGlance";
import ClosingCta from "@/components/ClosingCta";
import JsonLd from "@/components/JsonLd";
import LastUpdated from "@/components/LastUpdated";
import PageIntro from "@/components/PageIntro";
import ProcessSection from "@/components/ProcessSection";
import QuestionsSection from "@/components/QuestionsSection";
import SecuritySection from "@/components/SecuritySection";
import TechStackSection from "@/components/TechStackSection";
import Icon from "@/components/ui/Icon";
import ProjectCard from "@/components/ui/ProjectCard";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/ui/ServiceCard";
import { coreCategories, servicePageById } from "@/content/offerings";
import { meta, services, skills, pageImages } from "@/content/site";
import { glanceRows } from "@/lib/glance";
import { staticPages } from "@/lib/pages";
import { getProject, toProjectCard } from "@/lib/projects";
import { breadcrumbNode, serviceNodes, webPageNode, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const page = staticPages.services;
const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Services", path: page.path },
];

export const metadata: Metadata = pageMetadata({ ...meta.services, path: page.path });

/** Work that shows the services, one from each of three areas. All are real entries on /work. */
const RELATED = ["ai-voice-receptionist", "orbitos", "ecommerce-experience"];

export default function ServicesPage() {
  const related = RELATED.map((slug) => getProject(slug)).filter((p) => p !== undefined);
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

      <PageIntro image={pageImages.services}
        crumbs={crumbs}
        eyebrow="Services"
        title="AI engineering, software and automation services"
        lede="Six service areas. Each has its own page that says what is included, how we approach it and the work that shows it."
      >
        <LastUpdated date={page.updated} />
      </PageIntro>

      <section className="section section--tight" aria-labelledby="core-title">
        <div className="wrap">
          <SectionHeading eyebrow="Core categories" title="Four categories, one way of working" id="core-title" />
          <div className="grid grid--2 services-grid">
            {coreCategories.map((category) => (
              <ServiceCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="areas-title">
        <div className="wrap">
          <SectionHeading
            eyebrow="In detail"
            title="Every service area, and what is included"
            lede="Pick an area to see the problems it solves, our technical approach, related work and answers to common questions."
            id="areas-title"
          />
          <div className="grid grid--2">
            {services.map((service) => {
              const detail = servicePageById(service.id);
              return (
                <article key={service.id} id={service.id} className="card reveal">
                  <div className="card__row">
                    <span className="icon-box">{detail && <Icon name={detail.icon} />}</span>
                    <span className="badge">{service.number}</span>
                  </div>
                  <h3 className="card__title">{service.heading}</h3>
                  <p className="card__text">{service.summary}</p>
                  <ul className="mini-list">
                    {service.includes.slice(0, 5).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                    {service.includes.length > 5 && <li>And {service.includes.length - 5} more</li>}
                  </ul>
                  {detail && (
                    <Link href={`/services/${detail.slug}`} className="card__foot link-arrow">
                      Explore {detail.navLabel} <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <TechStackSection eyebrow="Technologies and integrations" title="Technologies we build with" groups={skills} />

      <section className="section" aria-labelledby="related-title">
        <div className="wrap">
          <SectionHeading eyebrow="Related work" title="See the services in practice" id="related-title" />
          <div className="grid grid--3 projects-grid projects-grid--three">
            {related.map((project) => (
              <ProjectCard key={project.slug} project={toProjectCard(project)} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" />
            ))}
          </div>
        </div>
      </section>

      <ProcessSection />
      <QuestionsSection />
      <AtAGlance id="services-glance-title" title="Services at a glance" rows={glanceRows} />
      <SecuritySection />
      <ClosingCta />
    </>
  );
}
