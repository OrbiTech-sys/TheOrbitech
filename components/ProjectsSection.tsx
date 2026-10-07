import Link from "next/link";
import WorkCard from "@/components/WorkCard";
import { projects } from "@/content/site";
import { showcaseProjects } from "@/lib/projects";

/** Home page: the latest projects, two to a row. */
export default function ProjectsSection() {
  const featured = showcaseProjects(projects).slice(0, 4);

  return (
    <section className="section section--work" aria-labelledby="featured-title">
      <div className="wrap section-head section-head--row">
        <h2 id="featured-title" className="h2">
          Selected work
        </h2>
        <Link href="/work" className="ulink">
          All work
        </Link>
      </div>

      <div className="wrap">
        <ul className="work-grid">
          {featured.map((project, index) => (
            <WorkCard key={project.slug} project={project} priority={index < 2} />
          ))}
        </ul>
      </div>
    </section>
  );
}
