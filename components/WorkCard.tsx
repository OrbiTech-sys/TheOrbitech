import Link from "next/link";
import type { Project } from "@/content/site";
import ProjectFrame from "@/components/ProjectFrame";
import { projectHref } from "@/lib/projects";

interface WorkCardProps {
  project: Project;
  /** The card that is likely to be the largest image on the page loads first */
  priority?: boolean;
  sizes?: string;
}

/**
 * One project in the work grid: the whole screenshot on a mat, then name, type
 * and summary. An arrow on the right shows the card is a link. Rows without a
 * value, such as year, are left out.
 */
export default function WorkCard({ project, priority = false, sizes = "(min-width: 48rem) 46vw, 100vw" }: WorkCardProps) {
  const sub = [project.type, project.kind, project.year].filter(Boolean);
  return (
    <li className="work-card">
      <Link href={projectHref(project)} className="work-card__link">
        <div className="work-card__media">
          <ProjectFrame image={project.cover} sizes={sizes} priority={priority} />
        </div>
        <div className="work-card__meta">
          <div className="work-card__head">
            <h3 className="work-card__name">{project.name}</h3>
            <span className="work-card__go" aria-hidden="true">
              →
            </span>
          </div>
          {sub.length > 0 && <p className="work-card__sub">{sub.join(" · ")}</p>}
          {project.summary && <p className="work-card__summary">{project.summary}</p>}
          <span className="sr-only">Read the case study for {project.name}</span>
        </div>
      </Link>
    </li>
  );
}
