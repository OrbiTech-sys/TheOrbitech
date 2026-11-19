import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ClosingCta from "@/components/ClosingCta";
import JsonLd from "@/components/JsonLd";
import LastUpdated from "@/components/LastUpdated";
import PageIntro from "@/components/PageIntro";
import Icon from "@/components/ui/Icon";
import { industryPages } from "@/content/industries";
import { getServicePage } from "@/content/offerings";
import { meta } from "@/content/site";
import { staticPages } from "@/lib/pages";
import { getProject, projectHref } from "@/lib/projects";
import { breadcrumbNode, webPageNode, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-config";

const page = staticPages.industries;
const crumbs: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Industries", path: page.path },
];

export const metadata: Metadata = pageMetadata({ ...meta.industries, path: page.path });

export default function IndustriesPage() {
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({
            type: "CollectionPage",
            path: page.path,
            name: meta.industries.title,
            description: meta.industries.description,
            dateModified: page.updated,
            breadcrumbs: crumbs,
            mainEntity: { "@id": `${absoluteUrl(page.path)}#industries` },
          }),
          breadcrumbNode(page.path, crumbs),
          {
            "@type": "ItemList",
            "@id": `${absoluteUrl(page.path)}#industries`,
            itemListElement: industryPages.map((industry, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteUrl(`/industries/${industry.slug}`),
              name: industry.name,
            })),
          },
        ]}
      />

      <PageIntro
        crumbs={crumbs}
        eyebrow="Industries"
        title="AI and software solutions by industry"
        lede="Every sector has its own bottlenecks. Here is how AI and software can address them, with example workflows and the demos we have."
      >
        <p className="page-hero__note">
          Where we have a demo for an industry, we link to it and label it as a demo. We do not list client names or case studies that we cannot show.
        </p>
        <LastUpdated date={page.updated} />
      </PageIntro>

      {industryPages.map((industry) => {
        const related = industry.related.map((slug) => getProject(slug)).filter((p) => p !== undefined);
        return (
          <section key={industry.slug} id={industry.slug} className="section section--tight industry-block" aria-labelledby={`${industry.slug}-title`}>
            <div className="wrap industry-block__grid">
              <div className="industry-block__intro">
                <span className="icon-box">
                  <Icon name={industry.icon} />
                </span>
                <h2 id={`${industry.slug}-title`}>{industry.name}</h2>
                <p className="card__text">{industry.lede}</p>
                <div className="industry-block__actions">
                  <Link href={`/industries/${industry.slug}`} className="btn btn--secondary">
                    Explore {industry.name.split(" & ")[0]} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  <Link href="/contact" className="btn btn--ghost">
                    Discuss a project
                  </Link>
                </div>
              </div>

              <div className="industry-block__body">
                <div className="card">
                  <h3 className="card__title">Common challenges</h3>
                  <ul className="mini-list">
                    {industry.challenges.map((c) => (
                      <li key={c.title}>{c.title}</li>
                    ))}
                  </ul>
                </div>
                <div className="card">
                  <h3 className="card__title">Relevant solutions</h3>
                  <ul className="mini-list">
                    {industry.solutions.map((s) => {
                      const service = getServicePage(s.service);
                      return (
                        <li key={s.title}>
                          {s.title}
                          {service && (
                            <>
                              {" "}
                              <Link href={`/services/${service.slug}`} className="text-link">
                                ({service.navLabel})
                              </Link>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="card">
                  <h3 className="card__title">{industry.workflows[0].title}</h3>
                  <ol className="mini-list mini-list--steps">
                    {industry.workflows[0].steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div className="card">
                  <h3 className="card__title">Related work</h3>
                  {related.length > 0 ? (
                    <ul className="mini-list">
                      {related.map((project) => (
                        <li key={project.slug}>
                          <Link href={projectHref(project)} className="text-link">
                            {project.name}
                          </Link>{" "}
                          ({project.kind.toLowerCase()})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="card__text">No related demos yet.</p>
                  )}
                  <p className="card__text card__note">{industry.relatedNote}</p>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <ClosingCta heading="Tell us about your industry" text="Describe the problem and we will say honestly whether we can help, and what a sensible first step looks like." />
    </>
  );
}
