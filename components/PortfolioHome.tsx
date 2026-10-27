"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AtAGlance, { type GlanceRow } from "@/components/AtAGlance";
import type { Project, Service } from "@/content/site";
import { displayHost, projectHref, serviceHref } from "@/lib/paths";

const PRIVATE_NOTE = "Private showcase · available on request where authorized";

const isPrivate = (project: Project) => !project.liveUrl;
const tagFor = (project: Project) => project.kind.toUpperCase();
const domainFor = (project: Project) => (project.liveUrl ? displayHost(project.liveUrl) : "Private project, link withheld");

export interface PortfolioHomeProps {
  siteName: string;
  /** The two-sentence company definition, shown as the first paragraph */
  description: string;
  slogan: string;
  closingText: string;
  email: string | null;
  glanceRows: GlanceRow[];
  services: Service[];
  processSteps: { title: string; text: string }[];
  /** Published projects, in the order they are listed in content/site.ts */
  projects: Project[];
}

/** The data comes from the server page as props, so the content file stays out of the browser bundle. */
export default function PortfolioHome({
  siteName,
  description,
  slogan,
  closingText,
  email,
  glanceRows,
  services,
  processSteps,
  projects: portfolioProjects,
}: PortfolioHomeProps) {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const modulePanelId = useId();

  // IntersectionObserver & scroll reveal handler
  useEffect(() => {
    if (typeof window === "undefined") return;

    const revealElements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    const checkVisibility = () => {
      const triggerBottom = window.innerHeight * 0.95;
      revealElements.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < triggerBottom) {
          el.classList.add("visible");
        }
      });
    };

    // Run check immediately
    checkVisibility();

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: "100px" }
      );

      revealElements.forEach((el) => observer.observe(el));

      window.addEventListener("scroll", checkVisibility, { passive: true });

      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", checkVisibility);
      };
    } else {
      revealElements.forEach((el) => el.classList.add("visible"));
    }
  }, []);

  // Escape key handler for modal
  useEffect(() => {
    if (!previewProject) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewProject(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewProject]);

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <>
      {/* ─────────────────── HERO SECTION ─────────────────── */}
      <div className="wrap hero">
        <div>
          <div className="eyebrow">{slogan}</div>
          <h1>
            AI automation and web development <span className="gradient">for growing businesses</span>
          </h1>
          <p>{description}</p>
          <div className="actions">
            <a className="btn btn-primary" href="#projects">
              Explore live projects <span aria-hidden="true">↗</span>
            </a>
            <a className="btn" href="#capabilities">
              Explore capabilities <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="orbital-card" aria-label="Animated orbital brand illustration">
          <span className="orbit" aria-hidden="true" />
          <span className="orbit two" aria-hidden="true" />
          <div className="core">OT</div>
          <span className="float-label fl1">AI Systems</span>
          <span className="float-label fl2">Data Intelligence</span>
          <span className="float-label fl3">Automation</span>
          <span className="float-label fl4">Digital Products</span>
        </div>
      </div>

      {/* ─────────────────── AT A GLANCE ─────────────────── */}
      <AtAGlance id="glance-title" title={`${siteName} at a glance`} rows={glanceRows} />

      {/* ─────────────────── CAPABILITIES SECTION ─────────────────── */}
      <section id="capabilities" className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">What we do</div>
            <h2>
              Capabilities built around
              <br />
              <span className="gradient">real business needs.</span>
            </h2>
          </div>
          <p>
            Choose a module to reveal its sub-services. Each engagement can be
            scoped around your business goals, existing tools, and customer
            journey.
          </p>
        </div>

        <div className="module-list">
          {services.map((module) => {
            const isOpen = Boolean(openModules[module.id]);
            const panelId = `${modulePanelId}-${module.id}`;
            return (
              <article key={module.id} className={`module ${isOpen ? "open" : ""}`}>
                <button
                  className="module-head"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleModule(module.id)}
                >
                  <span className="module-number">{module.number}</span>
                  <span className="module-title-wrap">
                    <strong>{module.title}</strong>
                    <small>{module.summary}</small>
                  </span>
                  <span className="module-toggle" aria-hidden="true">
                    ＋
                  </span>
                </button>
                <div id={panelId} className="module-details" role="region" aria-label={module.title}>
                  <div className="module-details-inner">
                    <ul>
                      {module.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <Link className="module-link" href={serviceHref(module)}>
                      {module.heading}: details on the services page <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ─────────────────── PROJECTS SECTION ─────────────────── */}
      <section id="projects" className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Selected work</div>
            <h2>
              Live demos, POCs &
              <br />
              <span className="gradient">product concepts.</span>
            </h2>
          </div>
          <p>
            Explore selected portfolio builds. Some projects are demonstrations or
            prototypes; private work is listed without a public link to respect
            confidentiality.
          </p>
        </div>

        <div className="project-grid">
          {portfolioProjects.map((project, index) => {
            const title = project.name ?? "Project";
            const privateProject = isPrivate(project);
            return (
              <article key={project.slug} className="project-card">
                <div className="project-top">
                  <span className="project-index">{String(index + 1).padStart(3, "0")}</span>
                  <span className={`tag ${privateProject ? "tag-private" : ""}`}>{tagFor(project)}</span>
                </div>

                {/* Landing Page Preview Container */}
                <div className="project-preview-wrap">
                  <div className="browser-chrome">
                    <div className="browser-dots" aria-hidden="true">
                      <span className="dot red" />
                      <span className="dot yellow" />
                      <span className="dot green" />
                    </div>
                    <div className="browser-url">
                      <span
                        className="security-lock"
                        title={privateProject ? "Confidential showcase" : "Secure HTTPS Connection"}
                      >
                        {privateProject ? "🛡️" : "🔒"}
                      </span>
                      <span>{domainFor(project)}</span>
                    </div>
                  </div>

                  <div className="project-thumb-box" onClick={() => setPreviewProject(project)}>
                    {project.cover && (
                      <Image
                        src={project.cover.src}
                        alt={project.cover.alt}
                        width={600}
                        height={375}
                        className="project-thumb-img"
                        loading="lazy"
                      />
                    )}
                    {privateProject && (
                      <div className="private-badge-overlay">
                        <span>Confidential Showcase</span>
                      </div>
                    )}
                    <div className="preview-overlay">
                      <button
                        type="button"
                        className="preview-zoom-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewProject(project);
                        }}
                        aria-label={`Preview ${title}`}
                      >
                        <span>🔍 View Preview</span>
                      </button>
                    </div>
                  </div>
                </div>

                <h3>{title}</h3>
                <p>{project.summary}</p>
                {project.demoNote && <p className="demo-note">{project.demoNote}</p>}

                <div className="project-actions">
                  <Link className="project-link" href={projectHref(project)}>
                    Read the case study <span aria-hidden="true">→</span>
                    <span className="sr-only"> for {title}</span>
                  </Link>
                  {project.liveUrl ? (
                    <a className="project-link project-link--demo" href={project.liveUrl} target="_blank" rel="noopener">
                      Open the live demo <span aria-hidden="true">↗</span>
                      <span className="sr-only">
                        {" "}
                        of {title} (opens in a new tab)
                      </span>
                    </a>
                  ) : (
                    <span className="private-note">{PRIVATE_NOTE}</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ─────────────────── HOW WE HELP SECTION ─────────────────── */}
      <section className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">How we help</div>
            <h2>
              From friction to a
              <br />
              <span className="gradient">focused solution.</span>
            </h2>
          </div>
          <p>We work from the problem outward—not from a tool looking for a use case.</p>
        </div>
        <div className="pill-grid">
          <div className="pill">
            <b>Discover</b>
            Understand bottlenecks, goals, and users.
          </div>
          <div className="pill">
            <b>Design</b>
            Map the workflow and define scope.
          </div>
          <div className="pill">
            <b>Build</b>
            Create a prototype, MVP, or agreed system.
          </div>
          <div className="pill">
            <b>Improve</b>
            Validate, refine, and plan next steps.
          </div>
        </div>
      </section>

      {/* ─────────────────── DELIVERY APPROACH SECTION ─────────────────── */}
      <section id="approach" className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Delivery approach</div>
            <h2>Clear steps. Shared outcomes.</h2>
          </div>
        </div>
        <ol className="process">
          {processSteps.map((step, index) => (
            <li key={step.title} className="step">
              <span>STEP {String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ─────────────────── CONTACT / CTA SECTION ─────────────────── */}
      <section id="contact" className="wrap">
        <div className="cta">
          <div>
            <div className="eyebrow">Have a workflow to improve?</div>
            <h2>
              Let’s turn the right problem
              <br />
              into a practical solution.
            </h2>
            <p>{closingText}</p>
          </div>
          <Link className="btn btn-primary" href="/contact">
            Start a conversation <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      {/* ─────────────────── INTERACTIVE PREVIEW MODAL / LIGHTBOX ─────────────────── */}
      {previewProject && (
        <div
          className="preview-modal-backdrop"
          onClick={() => setPreviewProject(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-preview-title"
        >
          <div
            className="preview-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <span
                  className={`modal-status ${
                    isPrivate(previewProject) ? "private" : "live"
                  }`}
                >
                  {tagFor(previewProject)}
                </span>
                <h3 id="modal-preview-title" className="modal-title">
                  {previewProject.name}
                </h3>
              </div>

              <div className="modal-controls">
                {previewProject.liveUrl ? (
                  <a
                    href={previewProject.liveUrl}
                    target="_blank"
                    rel="noopener"
                    className="modal-btn-action"
                  >
                    Visit Live Site ↗
                  </a>
                ) : (
                  <a
                    href={`mailto:${email ?? ""}?subject=Private%20Demo%20Request`}
                    className="modal-btn-action"
                  >
                    Request Demo ↗
                  </a>
                )}
                <button
                  type="button"
                  className="modal-btn-close"
                  onClick={() => setPreviewProject(null)}
                  aria-label="Close preview modal"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="modal-browser-bar">
              <div className="browser-dots" aria-hidden="true">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <div className="modal-url-pill">
                <span>{isPrivate(previewProject) ? "🛡️" : "🔒"}</span>
                <span>{domainFor(previewProject)}</span>
              </div>
            </div>

            <div className="modal-preview-body">
              {previewProject.cover && (
                <Image
                  src={previewProject.cover.src}
                  alt={`${previewProject.name} high-resolution preview`}
                  width={1200}
                  height={750}
                  className="modal-preview-img"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
