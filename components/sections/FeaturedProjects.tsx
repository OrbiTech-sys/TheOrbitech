import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectCard from "@/components/ui/ProjectCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { getProject, toProjectCard } from "@/lib/projects";

/** The projects shown on the home page, in this order. All are real entries from content/site.ts. */
const FEATURED = ["orbitos", "ai-voice-receptionist", "aidochat", "property-management"];

export default function FeaturedProjects() {
  const projects = FEATURED.map((slug) => getProject(slug)).filter((p) => p !== undefined);
  return (
    <section id="projects" className="section section--alt" aria-labelledby="projects-title">
      <div className="wrap">
        <SectionHeading
          eyebrow="Selected work"
          title="Live demos and product concepts you can open today"
          lede="Real screenshots of working builds. Demos and prototypes are labelled as such, and each one has a case study."
          id="projects-title"
        />
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
