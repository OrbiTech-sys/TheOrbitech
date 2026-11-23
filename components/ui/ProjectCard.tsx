import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Img } from "@/content/site";
import { projectHref } from "@/lib/paths";

/** Only what a card shows, so client components receive a small payload and never the whole content file. */
export interface ProjectCardData {
  slug: string;
  name: string;
  summary: string | null;
  category: string;
  kind: string;
  cover: Img | null;
  stack: string[];
  demoCount: number;
  /** Where the demo link goes: the live site, a gated demo, or the case study's demo list. Null for private projects. */
  action: { href: string; label: string; external: boolean } | null;
}

/**
 * A large visual card for the portfolio: the real screenshot, labels, a short description and two links,
 * the case study and the demo. The screenshot is decorative here (the title names the project).
 */
export default function ProjectCard({
  project,
  priority = false,
  sizes = "(min-width: 1024px) 580px, (min-width: 640px) 50vw, 100vw",
}: {
  project: ProjectCardData;
  priority?: boolean;
  sizes?: string;
}) {
  const { action } = project;
  return (
    <article className="project-card card--link reveal">
      {project.cover && (
        <div className="project-card__media">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            sizes={sizes}
            priority={priority}
          />
        </div>
      )}
      <div className="project-card__body">
        <div className="badge-row">
          <span className="badge badge--accent">{project.category}</span>
          <span className="badge">{project.kind}</span>
          {project.demoCount > 1 && <span className="badge">{project.demoCount} demos</span>}
        </div>
        <h3 className="project-card__title">
          <Link href={projectHref(project)} className="card__stretch">
            {project.name}
          </Link>
        </h3>
        <p className="card__text">{project.summary}</p>
        {project.stack.length > 0 && (
          <ul className="tags">
            {project.stack.slice(0, 4).map((tool) => (
              <li key={tool} className="tag">
                {tool}
              </li>
            ))}
          </ul>
        )}
        <div className="project-card__links">
          <span className="link-arrow">
            View case study <ArrowRight size={16} aria-hidden="true" />
          </span>
          {action &&
            (action.external ? (
              <a href={action.href} className="project-card__demo" target="_blank" rel="noopener noreferrer">
                {action.label} <ArrowUpRight size={15} aria-hidden="true" />
                <span className="sr-only"> of {project.name} (opens in a new tab)</span>
              </a>
            ) : (
              <Link href={action.href} className="project-card__demo">
                {action.label} <ArrowRight size={15} aria-hidden="true" />
                <span className="sr-only"> for {project.name}</span>
              </Link>
            ))}
        </div>
      </div>
    </article>
  );
}
