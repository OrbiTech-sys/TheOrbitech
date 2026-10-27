import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import ClosingCta from "@/components/ClosingCta";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProjectFrame from "@/components/ProjectFrame";
import { projects, site } from "@/content/site";
import { formatDate } from "@/lib/pages";
import { displayHost, getNextProject, getProject, getService, isPublished, projectHref, serviceHref } from "@/lib/projects";
import { breadcrumbNode, projectNodes, webPageNode, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

const step = (i: number) => ({ "--i": i }) as CSSProperties;

export function generateStaticParams() {
  return projects.filter(isPublished).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !isPublished(project)) return { title: "Project not found", robots: { index: false } };

  // A 1200×630 JPEG made from the cover screenshot by scripts/make-og.mjs.
  const image = project.cover
    ? { url: `/og/work/${project.slug}.jpg`, width: 1200, height: 630, alt: project.cover.alt }
    : undefined;

  return pageMetadata({
    title: `${project.seoTitle} | ${site.name}`,
    description: project.seoDescription,
    path: projectHref(project),
    image,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !isPublished(project)) notFound();

  const path = projectHref(project);
  const next = getNextProject(slug);
  const service = getService(project.serviceId);
  const heroImage = project.cover ?? project.desktop;
  // The phone screenshot is shown only when it is a different picture from the hero.
  const phoneImage = project.mobile && project.mobile.src !== heroImage?.src ? project.mobile : null;
  const isPrivate = !project.liveUrl;

  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
    { name: project.name ?? "Case study", path },
  ];

  // Facts are listed only when they have a value. Nothing is shown as a blank or a stand-in.
  const facts: { label: string; value: React.ReactNode }[] = [
    { label: "Status", value: project.kind },
    ...(project.type ? [{ label: "Type", value: project.type }] : []),
    ...(project.client ? [{ label: "Client", value: project.client }] : []),
    ...(project.year ? [{ label: "Year", value: project.year }] : []),
    ...(project.role ? [{ label: "Our role", value: project.role }] : []),
    ...(project.stack.length > 0
      ? [
          {
            label: "Built with",
            value: (
              <ul className="tags">
                {project.stack.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
    ...(project.liveUrl
      ? [
          {
            label: "Live demo",
            value: (
              <a href={project.liveUrl} target="_blank" rel="noopener" title={displayHost(project.liveUrl)}>
                Open {project.name}
                <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                <span className="sr-only"> live demo (opens in a new tab)</span>
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <article>
      <JsonLd
        nodes={[
          webPageNode({
            path,
            name: project.seoTitle,
            description: project.seoDescription,
            dateModified: project.updated,
            breadcrumbs: crumbs,
            mainEntity: { "@id": `${absoluteUrl(path)}#project` },
          }),
          breadcrumbNode(path, crumbs),
          ...projectNodes(project),
        ]}
      />

      <header className="wrap case-hero">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="case-hero__title" style={step(0)}>
          {project.name}
        </h1>
        <p className="case-hero__lede">{project.summary}</p>
        {project.demoNote && <p className="demo-note">{project.demoNote}</p>}

        <dl className="facts">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="wrap case-image">
        <ProjectFrame image={heroImage} sizes="(min-width: 80rem) 76rem, 100vw" priority className="frame--hero" />
      </div>

      <section className="wrap case-section" aria-labelledby="shows-title">
        <h2 id="shows-title">{isPrivate ? "What the concept covers" : "What this demo shows"}</h2>
        <ul className="checks">
          {project.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <p className="case-status">
          {isPrivate
            ? "This is a private project, so there is no public link. Screenshots or a controlled demo are available on request where authorized."
            : "This is a live demo of the project. Open it to try it yourself."}
        </p>
      </section>

      {project.brief.length > 0 && (
        <section className="wrap case-section prose" aria-labelledby="brief-title">
          <h2 id="brief-title">The brief</h2>
          {project.brief.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      )}

      {project.approach.length > 0 && (
        <section className="wrap case-section prose" aria-labelledby="approach-title">
          <h2 id="approach-title">Our approach</h2>
          {project.approach.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      )}

      {phoneImage && (
        <section className="wrap case-section" aria-labelledby="phone-title">
          <h2 id="phone-title">On a phone</h2>
          <ProjectFrame image={phoneImage} device="mobile" sizes="(min-width: 60rem) 24vw, 70vw" className="screens__mobile" />
        </section>
      )}

      {project.results.length > 0 && (
        <section className="wrap case-section" aria-labelledby="results-title">
          <h2 id="results-title">Results</h2>
          <dl className="results">
            {project.results.map((result) => (
              <div key={result.label}>
                <dt>{result.label}</dt>
                <dd>
                  <span className="results__value">{result.value}</span>
                  <span className="results__source">{result.source}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="wrap case-section" aria-labelledby="more-title">
        <h2 id="more-title">Keep exploring</h2>
        <ul className="case-links">
          <li>
            <Link href="/work">All projects and live demos</Link>
          </li>
          {service && (
            <li>
              <Link href={serviceHref(service)}>{service.heading}: what is included</Link>
            </li>
          )}
          <li>
            <Link href="/contact">Talk to us about a similar project</Link>
          </li>
          {next && next.slug !== project.slug && (
            <li>
              <Link href={projectHref(next)}>Next project: {next.name}</Link>
            </li>
          )}
        </ul>
        <p className="page-meta">
          Last updated <time dateTime={project.updated}>{formatDate(project.updated)}</time>
        </p>
      </section>

      <ClosingCta />
    </article>
  );
}
