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
import WorkflowCard from "@/components/ui/WorkflowCard";
import { getIndustryPage, industryPages } from "@/content/industries";
import { getServicePage } from "@/content/offerings";
import { site } from "@/content/site";
import { getProject, toProjectCard } from "@/lib/projects";
import { breadcrumbNode, faqNode, webPageNode, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Pages for every known slug are built ahead of time. They may block on a client navigation.
export const instant = false;

export function generateStaticParams() {
  return industryPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getIndustryPage(slug);
  if (!page) return { title: "Industry not found", robots: { index: false } };
  return pageMetadata({
    title: `${page.seoTitle} | ${site.name}`,
    description: page.seoDescription,
    path: `/industries/${page.slug}`,
  });
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const page = getIndustryPage(slug);
  if (!page) notFound();

  const path = `/industries/${page.slug}`;
  const related = page.related.map((s) => getProject(s)).filter((p) => p !== undefined);
  const others = industryPages.filter((p) => p.slug !== page.slug);
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: page.name, path },
  ];
  const faq = faqNode(path, page.faqs);

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
          }),
          breadcrumbNode(path, crumbs),
          ...(faq ? [faq] : []),
        ]}
      />

      <PageIntro crumbs={crumbs} eyebrow={page.eyebrow} title={page.headline} lede={page.lede}>
        <div className="page-hero__actions">
          <Link href="/contact" className="btn btn--primary btn--lg">
            Discuss your project <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/work" className="btn btn--secondary btn--lg">
            Explore our work
          </Link>
        </div>
        <LastUpdated date={page.updated} />
      </PageIntro>

      <section className="section section--tight" aria-labelledby="challenges-title">
        <div className="wrap">
          <SectionHeading eyebrow="Common challenges" title="Where the work gets stuck" id="challenges-title" />
          <div className="grid grid--2">
            {page.challenges.map((challenge) => (
              <article key={challenge.title} className="card reveal">
                <span className="icon-box">
                  <Icon name={page.icon} />
                </span>
                <h3 className="card__title">{challenge.title}</h3>
                <p className="card__text">{challenge.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="solutions-title">
        <div className="wrap">
          <SectionHeading eyebrow="Relevant solutions" title="AI and software that fit" id="solutions-title" />
          <div className="grid grid--2">
            {page.solutions.map((solution) => {
              const service = getServicePage(solution.service);
              return (
                <article key={solution.title} className="card reveal">
                  <h3 className="card__title">{solution.title}</h3>
                  <p className="card__text">{solution.text}</p>
                  {service && (
                    <Link href={`/services/${service.slug}`} className="card__foot link-arrow">
                      {service.navLabel} <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="workflows-title">
        <div className="wrap">
          <SectionHeading
            eyebrow="Example workflows"
            title="What this could look like"
            lede="These are examples of what could be built, not descriptions of delivered work."
            id="workflows-title"
          />
          <div className="grid grid--2">
            {page.workflows.map((workflow) => (
              <WorkflowCard key={workflow.title} title={workflow.title} steps={workflow.steps} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="related-title">
        <div className="wrap">
          <SectionHeading eyebrow="Related work" title="Demos and projects" lede={page.relatedNote} id="related-title" />
          {related.length > 0 && (
            <div className="grid grid--2 projects-grid">
              {related.map((project) => (
                <ProjectCard key={project.slug} project={toProjectCard(project)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="wrap wrap--narrow">
          <SectionHeading eyebrow="FAQ" title="Questions about this industry" id="faq-title" />
          <FaqList items={page.faqs} />
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="more-title">
        <div className="wrap">
          <SectionHeading eyebrow="More industries" title="Other sectors" id="more-title" />
          <ul className="grid grid--4 more-grid">
            {others.slice(0, 4).map((other) => (
              <li key={other.slug}>
                <Link href={`/industries/${other.slug}`} className="card card--link">
                  <span className="icon-box">
                    <Icon name={other.icon} />
                  </span>
                  <span className="card__title">{other.name}</span>
                  <span className="card__text">{other.summary}</span>
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
