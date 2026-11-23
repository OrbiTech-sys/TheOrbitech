import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectCard from "@/components/ui/ProjectCard";
import { getProject, toProjectCard } from "@/lib/projects";

/** The projects shown on the home page, in this order. All are real entries from content/site.ts. */
const FEATURED = ["orbitos", "ai-voice-receptionist", "aidochat", "property-management"];

export default function FeaturedProjects() {
  const projects = FEATURED.map((slug) => getProject(slug)).filter((p) => p !== undefined);
  return (
    <section id="projects" className="section section--alt" aria-labelledby="projects-title">
      <div className="wrap">
        <span className="eyebrow">Selected work</span>
        <div className="tab-panel work-pin">
          <div className="work-pin__head">
            <h2 id="projects-title" className="work-pin__title">
              Live demos and product concepts you can open today
            </h2>
            <p>Real screenshots of working builds. Demos and prototypes are labelled as such, and each one has a case study.</p>
          </div>
          <div className="work-pin__collage" aria-hidden="true">
            {projects
              .filter((project) => project.cover)
              .slice(0, 4)
              .map((project) => (
                <Image
                  key={project.slug}
                  src={project.cover!.src}
                  alt=""
                  width={project.cover!.width}
                  height={project.cover!.height}
                  sizes="(min-width: 960px) 25vw, 50vw"
                />
              ))}
          </div>
        </div>
        <div className="grid grid--2 projects-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={toProjectCard(project)} priority={index < 2} />
          ))}
        </div>
        <p className="section-more">
          <Link href="/work" className="link-arrow">
            View all projects <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
