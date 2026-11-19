"use client";

import { useState } from "react";
import ProjectCard, { type ProjectCardData } from "@/components/ui/ProjectCard";

/** The portfolio grid with category filters. The filters are buttons that update the list in place. */
export default function WorkIndex({ projects, categories }: { projects: ProjectCardData[]; categories: readonly string[] }) {
  const [filter, setFilter] = useState<string>("all");

  const count = (category: string) => projects.filter((p) => p.category === category).length;
  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const offered = categories.filter((c) => count(c) > 0);

  return (
    <>
      <div className="filter" role="group" aria-label="Filter projects by category">
        <button type="button" className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
          All Projects
          <span className="chip__count">{projects.length}</span>
        </button>
        {offered.map((category) => (
          <button
            key={category}
            type="button"
            className="chip"
            aria-pressed={filter === category}
            onClick={() => setFilter(category)}
          >
            {category}
            <span className="chip__count">{count(category)}</span>
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      {/* The key restarts the fade each time the filter changes. */}
      <div key={filter} className="grid grid--2 projects-grid filter-grid">
        {visible.map((project, index) => (
          <ProjectCard key={project.slug} project={project} priority={index < 2} />
        ))}
      </div>
    </>
  );
}
