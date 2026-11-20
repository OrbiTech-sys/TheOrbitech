import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClosingCta from "@/components/ClosingCta";
import DemoCard from "@/components/DemoCard";
import JsonLd from "@/components/JsonLd";
import LastUpdated from "@/components/LastUpdated";
import ProjectFrame from "@/components/ProjectFrame";
import FaqList from "@/components/ui/FaqList";
import ProjectCard from "@/components/ui/ProjectCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { servicePageById } from "@/content/offerings";
import { projects, site } from "@/content/site";
import {
  demoAction,
  getNextProject,
  getProject,
  getService,
  isPublished,
  projectHref,
  relatedProjects,
  toProjectCard,
} from "@/lib/projects";
import { breadcrumbNode, faqNode, projectNodes, webPageNode, type Crumb } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

// Pages for every known slug are built ahead of time. They may block on a client navigation.
export const instant = false;

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
  const servicePage = servicePageById(project.serviceId);
  const action = demoAction(project);
  const isPrivate = project.kind === "Private project";
  const hasDemos = project.demos.length > 0;
  const heroImage = project.cover ?? project.desktop;
  // A single demo shows its own pictures inside its demo card, so a hero image would only repeat them.
  const showHero = project.demos.length !== 1;
  // The phone screenshot is shown only when it is a different picture from the desktop one.
  const screenshotMain = project.desktop ?? project.cover;
  const screenshotPhone = project.mobile && project.mobile.src !== screenshotMain?.src ? project.mobile : null;
  const showScreenshots = !hasDemos && Boolean(screenshotMain);
  const related = relatedProjects(project, 2);

  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
    { name: project.name ?? "Case study", path },
  ];

  // Facts are listed only when they have a value. Nothing is shown as a blank or a stand-in.
  const facts: { label: string; value: React.ReactNode }[] = [
    { label: "Status", value: project.kind },
    { label: "Category", value: project.category },
    ...(project.type ? [{ label: "Type", value: project.type }] : []),
    ...(project.client ? [{ label: "Client", value: project.client }] : []),
    ...(project.year ? [{ label: "Year", value: project.year }] : []),
    ...(project.role ? [{ label: "Our role", value: project.role }] : []),
    ...(service && servicePage
      ? [{ label: "Service area", value: <Link href={`/services/${servicePage.slug}`} className="text-link">{servicePage.navLabel}</Link> }]
      : []),
  ];

  const faq = faqNode(path, project.faqs);

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
          ...(faq ? [faq] : []),
        ]}
      />

      <header className={heroImage ? "page-hero page-hero--media case-hero" : "page-hero case-hero"}>
        <div className="wrap">
          <div className="page-hero__copy">
          <Breadcrumbs crumbs={crumbs} />
          <div className="badge-row">
            <span className="badge badge--accent">{project.category}</span>
            <span className="badge">{project.kind}</span>
          </div>
          <h1 className="page-hero__title">{project.name}</h1>
          <p className="page-hero__lede">{project.summary}</p>
          {project.demoNote && <p className="page-hero__note">{project.demoNote}</p>}
          <div className="page-hero__actions">
            {action &&
              (action.external ? (
                <a href={action.href} className="btn btn--primary btn--lg" target="_blank" rel="noopener noreferrer">
                  {action.label} <ArrowUpRight size={18} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab{project.liveUrl ? "" : " after an email check"})</span>
                </a>
              ) : (
                <a href={action.href} className="btn btn--primary btn--lg">
                  {action.label} <ArrowRight size={18} aria-hidden="true" />
                </a>
              ))}
            <Link href="/contact" className={action ? "btn btn--secondary btn--lg" : "btn btn--primary btn--lg"}>
              Start a similar project
            </Link>
          </div>
          </div>
          {heroImage && (
            <div className="page-hero__media">
              <Image src={heroImage.src} alt={heroImage.alt} width={heroImage.width} height={heroImage.height} sizes="(min-width: 1000px) 40vw, 100vw" priority />
            </div>
          )}
        </div>
      </header>


      {hasDemos && (
        <section className="section section--tight" id="demos" aria-labelledby="demos-title">
          <div className="wrap">
            <SectionHeading
              eyebrow="Live demos"
              title={project.demos.length > 1 ? `Try all ${project.demos.length} live demos` : "Try the live demo"}
              lede="Each demo opens after a quick email check: we send a 6-digit code, you type it in, and the demo opens."
              id="demos-title"
            />
            <ul className="demos" data-count={project.demos.length}>
              {project.demos.map((demo, index) => (
                <DemoCard key={demo.id} demo={demo} priority={index === 0 && !showHero} phone={project.demos.length === 1} />
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section section--tight" aria-labelledby="overview-title">
        <div className="wrap split">
          <SectionHeading eyebrow="Overview" title="Project overview" id="overview-title" />
          <div className="case-overview">
            <p className="case-overview__text">
              {isPrivate
                ? "This is a private project, so there is no public link. Screenshots or a controlled demo are available on request where authorized."
                : "This is a live demo of the project. Open it to try it yourself. Demos and prototypes are labelled as such and are not client work."}
            </p>
            <dl className="facts">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {project.brief.length > 0 && (
        <section className="section section--alt" aria-labelledby="problem-title">
          <div className="wrap split">
            <SectionHeading eyebrow="The problem" title="Business problem" id="problem-title" />
            <div className="prose">
              {project.brief.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {project.approach.length > 0 && (
        <section className="section" aria-labelledby="solution-title">
          <div className="wrap split">
            <SectionHeading eyebrow="The solution" title="What we built" id="solution-title" />
            <div className="prose">
              {project.approach.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {showScreenshots && screenshotMain && (
        <section className="section section--alt" aria-labelledby="screens-title">
          <div className="wrap">
            <SectionHeading eyebrow="Screenshots" title="Product screenshots" id="screens-title" />
            <div className={screenshotPhone ? "screens" : "screens screens--single"}>
              <ProjectFrame image={screenshotMain} sizes="(min-width: 60rem) 60vw, 100vw" className="screens__desktop" />
              {screenshotPhone && (
                <ProjectFrame image={screenshotPhone} device="mobile" sizes="(min-width: 60rem) 24vw, 70vw" className="screens__mobile" />
              )}
            </div>
          </div>
        </section>
      )}

      {project.architecture.length > 0 && (
        <section className="section" aria-labelledby="architecture-title">
          <div className="wrap">
            <SectionHeading eyebrow="Architecture" title="How it is built" id="architecture-title" />
            <div className="grid grid--2">
              {project.architecture.map((part) => (
                <article key={part.title} className="card">
                  <h3 className="card__title">{part.title}</h3>
                  <p className="card__text">{part.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {project.stack.length > 0 && (
        <section className="section section--tight" aria-labelledby="stack-title">
          <div className="wrap">
            <SectionHeading eyebrow="Technology" title="Technology stack" id="stack-title" />
            <ul className="tags">
              {project.stack.map((tool) => (
                <li key={tool} className="tag">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {project.features.length > 0 && (
        <section className="section section--alt" aria-labelledby="features-title">
          <div className="wrap">
            <SectionHeading
              eyebrow="Key features"
              title={isPrivate ? "What the concept covers" : "What this demo shows"}
              id="features-title"
            />
            <ul className="checks checks--cols">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {project.results.length > 0 && (
        <section className="section" aria-labelledby="results-title">
          <div className="wrap">
            <SectionHeading eyebrow="Results" title="Verified results" id="results-title" />
            <dl className="results">
              {project.results.map((result) => (
                <div key={result.label} className="card">
                  <dt className="card__text">{result.label}</dt>
                  <dd>
                    <span className="results__value">{result.value}</span>
                    <span className="results__source">{result.source}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {project.faqs.length > 0 && (
        <section className="section" aria-labelledby="faq-title">
          <div className="wrap wrap--narrow">
            <SectionHeading eyebrow="FAQ" title="Common questions" id="faq-title" />
            <FaqList items={project.faqs} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section section--alt" aria-labelledby="related-title">
          <div className="wrap">
            <SectionHeading eyebrow="Related projects" title="More work like this" id="related-title" />
            <div className="grid grid--2 projects-grid">
              {related.map((item) => (
                <ProjectCard key={item.slug} project={toProjectCard(item)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section--tight" aria-labelledby="more-title">
        <div className="wrap">
          <h2 id="more-title" className="sr-only">
            Keep exploring
          </h2>
          <ul className="case-links">
            <li>
              <Link href="/work" className="link-arrow">
                All projects and live demos <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </li>
            {service && servicePage && (
              <li>
                <Link href={`/services/${servicePage.slug}`} className="link-arrow">
                  {service.heading} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </li>
            )}
            {next && next.slug !== project.slug && (
              <li>
                <Link href={projectHref(next)} className="link-arrow">
                  Next project: {next.shortName ?? next.name} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </li>
            )}
          </ul>
          <LastUpdated date={project.updated} />
        </div>
      </section>

      <ClosingCta />
    </article>
  );
}
