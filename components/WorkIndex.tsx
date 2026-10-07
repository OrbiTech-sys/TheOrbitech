"use client";

import { useState } from "react";
import WorkCard from "@/components/WorkCard";
import { projectTypes, projects as allProjects, type ProjectType } from "@/content/site";
import { showcaseProjects } from "@/lib/projects";

type Filter = "all" | ProjectType;

/** The full work grid with a filter by type. */
export default function WorkIndex() {
  const [filter, setFilter] = useState<Filter>("all");
  const projects = showcaseProjects(allProjects);

  const count = (type: ProjectType) => projects.filter((p) => p.type === type).length;
  const anyTyped = projects.some((p) => p.type);
  const visible = filter === "all" ? projects : projects.filter((p) => p.type === filter);
  // Only offer types that have projects. Until any project has a type, show them all dimmed.
  const offered = anyTyped ? projectTypes.filter((t) => count(t) > 0) : projectTypes;

  return (
    <>
      <div className="filter" role="group" aria-label="Filter work by type">
        <button type="button" className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
          All
          <span className="chip__count">{projects.length}</span>
        </button>
        {offered.map((type) => (
          <button
            key={type}
            type="button"
            className="chip"
            aria-pressed={filter === type}
            disabled={count(type) === 0}
            onClick={() => setFilter(type)}
          >
            {type}
            <span className="chip__count">{count(type)}</span>
          </button>
        ))}
      </div>
      {!anyTyped && <p className="filter__note">Filters switch on once each project has a type.</p>}

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      {visible.length > 0 ? (
        <ul className="work-grid">
          {visible.map((project, index) => (
            <WorkCard
              key={project.slug}
              project={project}
              priority={index < 2}
              sizes="(min-width: 48rem) 46vw, 100vw"
            />
          ))}
        </ul>
      ) : (
        <p className="empty">No {filter} projects yet.</p>
      )}
    </>
  );
}
