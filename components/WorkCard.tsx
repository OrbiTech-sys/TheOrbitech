import Image from "next/image";
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
  const stacked = project.demos.length > 1;
  const demoCount = project.demos.length;

  return (
    <li className="work-card">
      <Link href={projectHref(project)} className="work-card__link">
        <div className="work-card__media">
          {stacked ? (
            <div className="stack">
              {project.demos.slice(0, 3).map((demo, index) => (
                <div key={demo.id} className={`stack__item stack__item--${index}`}>
                  <Image
                    src={demo.cover.src}
                    alt={index === 0 ? demo.cover.alt : ""}
                    width={demo.cover.width}
                    height={demo.cover.height}
                    sizes={sizes}
                    priority={priority && index === 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <ProjectFrame image={project.cover} label="Project screenshot" sizes={sizes} priority={priority} />
          )}
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
            {demoCount > 0 && (
              <>
                <span aria-hidden="true"> · </span>
                {demoCount} live {demoCount === 1 ? "demo" : "demos"}
              </>
            )}
          </p>
          {project.summary && <p className="work-card__summary">{project.summary}</p>}
          <span className="sr-only">View case study</span>
        </div>
      </Link>
    </li>
  );
}
