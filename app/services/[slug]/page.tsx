import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import ClosingCta from "@/components/ClosingCta";
import JsonLd from "@/components/JsonLd";
import LastUpdated from "@/components/LastUpdated";
import PageIntro from "@/components/PageIntro";
import FaqList from "@/components/ui/FaqList";
import Icon from "@/components/ui/Icon";
import ProjectCard from "@/components/ui/ProjectCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Timeline from "@/components/ui/Timeline";
import { getServicePage, servicePages } from "@/content/offerings";
import { services, site, pageImages } from "@/content/site";
import { projectsForService, toProjectCard } from "@/lib/projects";
import { breadcrumbNode, faqNode, serviceNodeId, serviceNodes, webPageNode, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

// Pages for every known slug are built ahead of time. They may block on a client navigation.
export const instant = false;

export function generateStaticParams() {
  return servicePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return { title: "Service not found", robots: { index: false } };
  return pageMetadata({
    title: `${page.seoTitle} | ${site.name}`,
    description: page.seoDescription,
    path: `/services/${page.slug}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  const service = services.find((s) => s.id === page.serviceId);
  const path = `/services/${page.slug}`;
  const related = projectsForService(page.serviceId);
  const others = servicePages.filter((p) => p.slug !== page.slug);
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: page.navLabel, path },
  ];
  const serviceNode = serviceNodes().find((node) => node["@id"] === serviceNodeId(page.serviceId));

  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            path,
            name: page.seoTitle,
            description: page.seoDescription,
            dateModified: page.updated,
            breadcrumbs: crumbs,
            mainEntity: { "@id": `${absoluteUrl(path)}#service` },
          }),
          breadcrumbNode(path, crumbs),
          ...(serviceNode ? [serviceNode] : []),
          ...(faqNode(path, page.faqs) ? [faqNode(path, page.faqs)!] : []),
        ]}
      />

      <PageIntro image={pageImages.services} crumbs={crumbs} eyebrow={page.eyebrow} title={page.headline} lede={page.lede}>
        <div className="page-hero__actions">
          <Link href="/contact" className="btn btn--primary btn--lg">
            Discuss your project <ArrowRight size={18} aria-hidden="true" />
          </Link>
          {related.length > 0 && (
            <a href="#related" className="btn btn--secondary btn--lg">
              See related work
            </a>
          )}
        </div>
        <LastUpdated date={page.updated} />
      </PageIntro>

      <section className="section section--tight" aria-labelledby="overview-title">
        <div className="wrap split">
          <div>
            <SectionHeading eyebrow="Overview" title="What this service covers" id="overview-title" />
          </div>
          <div className="prose">
            {page.overview.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="problems-title">
        <div className="wrap">
          <SectionHeading eyebrow="Business problems" title="Problems this service solves" id="problems-title" />
          <div className="grid grid--2">
            {page.problems.map((problem) => (
              <article key={problem.title} className="card reveal">
                <span className="icon-box">
                  <Icon name={page.icon} />
                </span>
                <h3 className="card__title">{problem.title}</h3>
                <p className="card__text">{problem.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {service && (
        <section className="section" aria-labelledby="capabilities-title">
          <div className="wrap">
            <SectionHeading eyebrow="Capabilities" title="What is included" id="capabilities-title" />
            <ul className="checks checks--cols">
              {service.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section section--alt" aria-labelledby="approach-title">
        <div className="wrap">
          <SectionHeading
            eyebrow="Technical approach"
            title="How we build it"
            lede="The principles we apply on every project in this area."
            id="approach-title"
          />
          <Timeline steps={page.approach} />
        </div>
      </section>

      {related.length > 0 && (
        <section id="related" className="section" aria-labelledby="related-title">
          <div className="wrap">
            <SectionHeading eyebrow="Related work" title="Work that shows this service" id="related-title" />
            <div className="grid grid--2 projects-grid">
              {related.map((project) => (
                <ProjectCard key={project.slug} project={toProjectCard(project)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section--tight" aria-labelledby="tech-title">
        <div className="wrap">
          <SectionHeading eyebrow="Technologies" title="Tools we use for this" id="tech-title" />
          <ul className="tags">
            {page.technologies.map((tool) => (
              <li key={tool} className="tag">
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="wrap wrap--narrow">
          <SectionHeading eyebrow="FAQ" title="Questions about this service" id="faq-title" />
          <FaqList items={page.faqs} />
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="more-title">
        <div className="wrap">
          <SectionHeading eyebrow="More services" title="Other service areas" id="more-title" />
          <ul className="grid grid--3 more-grid">
            {others.slice(0, 3).map((other) => (
              <li key={other.slug}>
                <Link href={`/services/${other.slug}`} className="card card--link">
                  <span className="icon-box">
                    <Icon name={other.icon} />
                  </span>
                  <span className="card__title">{other.navLabel}</span>
                  <span className="card__text">{other.navText}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
