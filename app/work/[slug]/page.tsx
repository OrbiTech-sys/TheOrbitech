import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import ClosingCta from "@/components/ClosingCta";
import DemoCard from "@/components/DemoCard";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import { Pending } from "@/components/Pending";
import ProjectFrame from "@/components/ProjectFrame";
import { projects } from "@/content/site";
import { demoOpenHref } from "@/lib/demos";
import { displayHost, getNextProject, getProject, isRealProject, projectHref } from "@/lib/projects";
import { creativeWorkLd, demoCollectionLd, faqLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Pages for every known slug are built ahead of time. They may block on a client navigation.
export const instant = false;

const step = (i: number) => ({ "--i": i }) as CSSProperties;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found", robots: { index: false } };

  const image = project.cover
    ? { url: project.cover.src, width: project.cover.width, height: project.cover.height, alt: project.cover.alt }
    : undefined;

  return pageMetadata({
    title: project.name ?? "Case study",
    description: project.summary ?? `A project by OrbiTech${project.client ? ` for ${project.client}` : ""}.`,
    path: projectHref(project),
    image,
    // Slots that are still empty stay out of search results.
    noindex: !isRealProject(project),
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getNextProject(slug);
  const heroImage = project.cover ?? project.desktop;
  const hasDemos = project.demos.length > 0;
  // Demo pages show their screenshots in the demo cards, so the hero picture and the screens row would only repeat them.
  const showScreens = !hasDemos;

  return (
    <article>
      <JsonLd data={creativeWorkLd(project, projectHref(project))} />
      <JsonLd data={demoCollectionLd(project, projectHref(project))} />
      <JsonLd data={faqLd(project.faqs)} />

      <header className="wrap case-hero">
        <h1 className="case-hero__title reveal" style={step(0)}>
          {project.name ?? <Pending>Project name</Pending>}
        </h1>
        <p className="case-hero__lede reveal" style={step(1)}>
          {project.summary ?? <Pending>One-line summary of the project</Pending>}
        </p>

        <dl className="facts reveal" style={step(2)}>
          <div>
            <dt>Client</dt>
            <dd>{project.client ?? <Pending>Client</Pending>}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{project.year ?? <Pending>Year</Pending>}</dd>
          </div>
          <div>
            <dt>Our role</dt>
            <dd>{project.role ?? <Pending>Role</Pending>}</dd>
          </div>
          {(project.stack.length > 0 || !hasDemos) && (
            <div>
              <dt>Built with</dt>
              <dd>
                {project.stack.length > 0 ? (
                  <ul className="tags">
                    {project.stack.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                ) : (
                  <Pending>Stack</Pending>
                )}
              </dd>
            </div>
          )}
          <div>
            <dt>{hasDemos ? (project.demos.length > 1 ? "Live demos" : "Live demo") : "Live site"}</dt>
            <dd>
              {hasDemos ? (
                project.demos.length > 1 ? (
                  <a href="#demos" className="ulink">
                    {project.demos.length} samples below
                  </a>
                ) : (
                  <a href={demoOpenHref(project.demos[0].id)} className="ulink" target="_blank" rel="noopener noreferrer">
                    Open the demo
                    <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab after an email check)</span>
                  </a>
                )
              ) : project.liveUrl ? (
                <a href={project.liveUrl} className="ulink" target="_blank" rel="noopener noreferrer">
                  {displayHost(project.liveUrl)}
                  <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <Pending>Live URL</Pending>
              )}
            </dd>
          </div>
        </dl>
      </header>

      {!hasDemos && (
        <div className="wrap case-image">
          <ProjectFrame
            image={heroImage}
            label="Hero screenshot"
            sizes="(min-width: 80rem) 76rem, 100vw"
            priority
            className="frame--hero"
          />
        </div>
      )}

      {hasDemos && (
        <section className="section section--tight" id="demos" aria-labelledby="demos-title">
          <div className="wrap">
            <h2 id="demos-title" className="h2 section-head">
              {project.demos.length > 1 ? `Try all ${project.demos.length} live demos` : "Try the live demo"}
            </h2>
            <p className="demos__lede">
              Each demo opens after a quick email check: we send a 6-digit code, you type it in, and the demo opens.
            </p>
            <ul className="demos" data-count={project.demos.length}>
              {project.demos.map((demo, index) => (
                <DemoCard key={demo.id} demo={demo} priority={index === 0} phone={project.demos.length === 1} />
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="brief-title">
        <div className="wrap split">
          <div className="split__head">
            <h2 id="brief-title" className="h2">
              The brief
            </h2>
          </div>
          <div className="prose">
            {project.brief.length > 0 ? (
              project.brief.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>
                <Pending>What the client needed, and why. Two or three short paragraphs.</Pending>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="approach-title">
        <div className="wrap split">
          <div className="split__head">
            <h2 id="approach-title" className="h2">
              Our approach
            </h2>
          </div>
          <div className="prose">
            {project.approach.length > 0 ? (
              project.approach.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>
                <Pending>What we did and why we chose it. Two or three short paragraphs.</Pending>
              </p>
            )}
          </div>
        </div>
      </section>

      {showScreens && (
      <section className="section" aria-labelledby="screens-title">
        <div className="wrap">
          <h2 id="screens-title" className="h2 section-head">
            On desktop and on a phone
          </h2>
          <div className="screens">
            <ProjectFrame
              image={project.desktop}
              label="Desktop screenshot"
              sizes="(min-width: 60rem) 60vw, 100vw"
              caption
              url={project.liveUrl}
              className="screens__desktop"
            />
            <ProjectFrame
              image={project.mobile}
              label="Mobile screenshot"
              device="mobile"
              sizes="(min-width: 60rem) 24vw, 70vw"
              className="screens__mobile"
            />
          </div>
        </div>
      </section>
      )}

      {project.results.length > 0 && (
        <section className="section section--tight" aria-labelledby="results-title">
          <div className="wrap split">
            <div className="split__head">
              <h2 id="results-title" className="h2">
                Results
              </h2>
            </div>
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
          </div>
        </section>
      )}

      {project.faqs.length > 0 && (
        <FaqSection
          title="Common questions"
          items={project.faqs.map((faq) => ({ question: faq.q, answer: faq.a }))}
        />
      )}

      {next && next.slug !== project.slug && (
        <nav className="wrap next-project" aria-label="Next project">
          <Link href={projectHref(next)} className="next-project__link">
            <span className="next-project__label">Next project</span>
            <span className="next-project__name">{next.shortName ?? next.name ?? <Pending>Project name</Pending>}</span>
          </Link>
        </nav>
      )}

      <ClosingCta />
    </article>
  );
}

