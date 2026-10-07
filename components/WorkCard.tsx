import Link from "next/link";
import type { Project } from "@/content/site";
import { Pending } from "@/components/Pending";
import ProjectFrame from "@/components/ProjectFrame";
import { projectHref } from "@/lib/projects";

interface WorkCardProps {
  project: Project;
  /** Above-the-fold cards load their image first */
  priority?: boolean;
  sizes?: string;
}

/**
 * One project in the work grid: the whole screenshot on a mat, then name, type
 * and summary. An arrow on the right shows the card is a link.
 */
export default function WorkCard({ project, priority = false, sizes = "(min-width: 48rem) 46vw, 100vw" }: WorkCardProps) {
  return (
    <li className="work-card">
      <Link href={projectHref(project)} className="work-card__link">
        <div className="work-card__media">
          <ProjectFrame image={project.cover} label="Project screenshot" sizes={sizes} priority={priority} />
        </div>
        <div className="work-card__meta">
          <div className="work-card__head">
            <h3 className="work-card__name">{project.name ?? <Pending>Project name</Pending>}</h3>
            <span className="work-card__go" aria-hidden="true">
              →
            </span>
          </div>
          <p className="work-card__sub">
            {project.type ?? <Pending>Type</Pending>}
            <span aria-hidden="true"> · </span>
            {project.year ?? <Pending>Year</Pending>}
          </p>
          {project.summary && <p className="work-card__summary">{project.summary}</p>}
          <span className="sr-only">View case study</span>
        </div>
      </Link>
    </li>
  );
}
