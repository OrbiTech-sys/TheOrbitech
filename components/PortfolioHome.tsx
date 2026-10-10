"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ProjectItem {
  id: string;
  index: string;
  title: string;
  tag: string;
  isPrivate: boolean;
  domain: string;
  description: string;
  liveUrl?: string;
  previewImage: string;
  note?: string;
}

const portfolioProjects: ProjectItem[] = [
  {
    id: "orbit-operations",
    index: "001",
    title: "Orbit Operations Copilot",
    tag: "LIVE DEMO",
    isPrivate: false,
    domain: "orbit-operations.vercel.app",
    description:
      "A CRM and operations-copilot concept that brings customer relationships, deal pipelines, tasks, analytics, and AI-assisted follow-through into one workspace.",
    liveUrl: "https://orbit-operations.vercel.app",
    previewImage: "/work/orbit-operations-preview.webp",
  },
  {
    id: "property-management",
    index: "002",
    title: "Property Management System",
    tag: "LIVE DEMO",
    isPrivate: false,
    domain: "propertymanagementsystem-six.vercel.app",
    description:
      "A property-operations workspace concept for property/unit information, leasing activity, maintenance requests, payment records, and portfolio visibility.",
    liveUrl: "https://propertymanagementsystem-six.vercel.app",
    previewImage: "/work/property-management-preview.webp",
  },
  {
    id: "aidochat",
    index: "003",
    title: "AidoChat / DocuMind AI",
    tag: "LIVE DEMO",
    isPrivate: false,
    domain: "aidochat.vercel.app",
    description:
      "An AI document-intelligence experience. The public demo may take a moment to initialize; confirm current features before a client walkthrough.",
    liveUrl: "https://aidochat.vercel.app",
    previewImage: "/work/aidochat-preview.webp",
  },
  {
    id: "ecommerce-experience",
    index: "004",
    title: "AI E-commerce Experience",
    tag: "LIVE DEMO",
    isPrivate: false,
    domain: "ecommerceorbitech.vercel.app",
    description:
      "An AI-oriented commerce demo featuring natural-language product discovery, product collections, product details, and a luxury storefront experience.",
    liveUrl: "https://ecommerceorbitech.vercel.app",
    previewImage: "/work/ecommerce-preview.webp",
  },
  {
    id: "whatsapp-chatbot",
    index: "005",
    title: "WhatsApp Business Chatbot",
    tag: "PRIVATE PROJECT",
    isPrivate: true,
    domain: "internal.orbitech.sys/whatsapp-bot",
    description:
      "Custom WhatsApp chatbot concept for business and e-commerce customer service, FAQs, lead capture, and customer hand-off. Link withheld due to client/company privacy.",
    previewImage: "/work/whatsapp-chatbot-preview.webp",
    note: "Private showcase · available on request where authorized",
  },
  {
    id: "bulk-email-agent",
    index: "006",
    title: "Bulk Email Agent / Sender",
    tag: "PRIVATE PROJECT",
    isPrivate: true,
    domain: "internal.orbitech.sys/email-agent",
    description:
      "Bulk email workflow tool concept for sending and managing outreach campaigns. Link withheld due to client/company privacy; present only with approved screenshots or a controlled demo.",
    previewImage: "/work/bulk-email-agent-preview.webp",
    note: "Private showcase · available on request where authorized",
  },
];

const capabilityModules = [
  {
    number: "01",
    title: "AI Solutions & Intelligent Automation",
    subtitle:
      "Design and integrate AI systems that help teams answer questions, automate repeatable work, and make better use of business knowledge.",
    items: [
      "AI integrations: automation, chatbots, and AI assistants",
      "AI agent development",
      "AI-powered business operations",
      "AI customer-support systems",
      "AI sales and marketing assistants",
      "Knowledge-base and RAG systems",
      "Semantic search and retrieval",
      "Intelligent document processing",
      "Voice AI and multilingual AI solutions",
      "AI strategy and implementation",
    ],
  },
  {
    number: "02",
    title: "Data Science, Analytics & Business Intelligence",
    subtitle:
      "Turn business data into clear reporting, usable insights, and better-informed decisions.",
    items: [
      "Data analysis and visualization",
      "Data engineering and pipeline development",
      "Business intelligence dashboards",
      "AI-powered analytics and reporting",
      "Predictive analytics solutions",
      "Database design and optimization",
      "Data migration and synchronization",
    ],
  },
  {
    number: "03",
    title: "Software & Digital Product Engineering",
    subtitle:
      "Build modern digital products—from websites and internal tools to SaaS platforms and MVPs.",
    items: [
      "Modern website development",
      "Custom web application development",
      "E-commerce development",
      "SaaS product development",
      "MVP development and rapid prototyping",
      "API development and third-party integrations",
      "Internal dashboards and business portals",
      "Cloud-based business solutions",
      "Secure business systems",
      "Role-based access control and audit logging",
      "Website modernization, technical SEO, and performance optimization",
    ],
  },
  {
    number: "04",
    title: "Business Growth & Digital Strategy",
    subtitle:
      "Connect technology decisions to business goals, customer experience, operational efficiency, and sustainable growth.",
    items: [
      "Business growth and scale-up strategy",
      "Smart solutions for businesses",
      "Digital transformation consulting",
      "Technology consulting and architecture",
      "Business process analysis",
      "Operational efficiency consulting",
      "Business workflow optimization",
      "Conversion-rate optimization",
      "Customer-experience optimization",
    ],
  },
  {
    number: "05",
    title: "Business Automation & System Integration",
    subtitle:
      "Reduce repetitive manual work by connecting business tools, customer workflows, and internal processes.",
    items: [
      "CRM automation and integrations",
      "Lead generation and qualification automation",
      "Business process automation",
      "Workflow automation",
      "Appointment scheduling automation",
      "Email and communication automation",
      "Data and application integrations",
    ],
  },
  {
    number: "06",
    title: "AI-Powered Commerce & Customer Experience",
    subtitle:
      "Create smoother digital buying journeys with intelligent discovery, responsive support, and tailored experiences.",
    items: [
      "AI-powered e-commerce experiences",
      "AI product discovery and recommendations",
      "Conversational shopping assistants",
      "Customer-support chatbots",
      "Semantic product search",
      "Customer-experience optimization",
      "E-commerce workflow automation",
    ],
  },
];

export default function PortfolioHome() {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [previewProject, setPreviewProject] = useState<ProjectItem | null>(null);

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

  const toggleModule = (moduleNumber: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleNumber]: !prev[moduleNumber],
    }));
  };

  return (
    <>
      {/* ─────────────────── HERO SECTION ─────────────────── */}
      <div className="wrap hero">
        <div>
          <div className="eyebrow">AI • Software • Data • Growth</div>
          <h1>
            Make work smarter.
            <br />
            <span className="gradient">Make growth real.</span>
          </h1>
          <p>
            The OrbiTech Solutions builds practical AI experiences, modern digital
            products, connected business systems, and data-led workflows that help
            teams work with greater clarity.
          </p>
          <div className="actions">
            <a className="btn btn-primary" href="#projects">
              Explore live projects <span>↗</span>
            </a>
            <a className="btn" href="#capabilities">
              Explore capabilities ↓
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
          {capabilityModules.map((module) => {
            const isOpen = Boolean(openModules[module.number]);
            return (
              <article
                key={module.number}
                className={`module ${isOpen ? "open" : ""}`}
                tabIndex={0}
                aria-expanded={isOpen}
              >
                <button
                  className="module-head"
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleModule(module.number)}
                >
                  <span className="module-number">{module.number}</span>
                  <span className="module-title-wrap">
                    <strong>{module.title}</strong>
                    <small>{module.subtitle}</small>
                  </span>
                  <span className="module-toggle" aria-hidden="true">
                    ＋
                  </span>
                </button>
                <div className="module-details">
                  <ul>
                    {module.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
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
          {portfolioProjects.map((project) => (
            <article key={project.id} className="project-card">
              <div className="project-top">
                <span className="project-index">{project.index}</span>
                <span className={`tag ${project.isPrivate ? "tag-private" : ""}`}>
                  {project.tag}
                </span>
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
                      title={project.isPrivate ? "Confidential showcase" : "Secure HTTPS Connection"}
                    >
                      {project.isPrivate ? "🛡️" : "🔒"}
                    </span>
                    <span>{project.domain}</span>
                  </div>
                </div>

                <div
                  className="project-thumb-box"
                  role="button"
                  tabIndex={0}
                  aria-label={`View preview for ${project.title}`}
                  onClick={() => setPreviewProject(project)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPreviewProject(project);
                    }
                  }}
                >
                  <Image
                    src={project.previewImage}
                    alt={`${project.title} landing page preview`}
                    width={600}
                    height={375}
                    className="project-thumb-img"
                    loading="lazy"
                  />
                  {project.isPrivate && (
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
                      aria-label={`Preview ${project.title}`}
                    >
                      <span>🔍 View Preview</span>
                    </button>
                  </div>
                </div>
              </div>

              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <div className="project-actions">
                {project.liveUrl ? (
                  <a
                    className="project-link"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Explore live demo <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="private-note">
                    {project.note ?? "Private showcase · available on request where authorized"}
                  </span>
                )}
              </div>
            </article>
          ))}
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
        <div className="process">
          <div className="step">
            <span>STEP 01</span>
            <h3>Discover</h3>
            <p>Understand the challenge and current process.</p>
          </div>
          <div className="step">
            <span>STEP 02</span>
            <h3>Define</h3>
            <p>Agree scope, priorities, and success measures.</p>
          </div>
          <div className="step">
            <span>STEP 03</span>
            <h3>Prototype</h3>
            <p>Demonstrate the proposed workflow early.</p>
          </div>
          <div className="step">
            <span>STEP 04</span>
            <h3>Build & integrate</h3>
            <p>Implement the approved solution.</p>
          </div>
          <div className="step">
            <span>STEP 05</span>
            <h3>Validate</h3>
            <p>Test, improve, and plan future iterations.</p>
          </div>
        </div>
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
            <p>
              Tell us what slows your team down, where customers need faster answers,
              or which systems should work better together.
            </p>
          </div>
          <a
            className="btn btn-primary"
            href="mailto:hello@orbitechsolutions.com?subject=Project%20Discovery%20Call"
          >
            Start a conversation ↗
          </a>
        </div>
        <p className="contact-note">
          Replace the example email address with your verified business contact before publishing.
        </p>
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
                    previewProject.isPrivate ? "private" : "live"
                  }`}
                >
                  {previewProject.tag}
                </span>
                <h3 id="modal-preview-title" className="modal-title">
                  {previewProject.title}
                </h3>
              </div>

              <div className="modal-controls">
                {previewProject.liveUrl ? (
                  <a
                    href={previewProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-btn-action"
                  >
                    Visit Live Site ↗
                  </a>
                ) : (
                  <a
                    href="mailto:hello@orbitechsolutions.com?subject=Private%20Demo%20Request"
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
                <span>{previewProject.isPrivate ? "🛡️" : "🔒"}</span>
                <span>{previewProject.domain}</span>
              </div>
            </div>

            <div className="modal-preview-body">
              <Image
                src={previewProject.previewImage}
                alt={`${previewProject.title} high-resolution preview`}
                width={1200}
                height={750}
                className="modal-preview-img"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
