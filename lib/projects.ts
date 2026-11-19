import { projects, services, type Project, type ProjectCategory, type Service } from "@/content/site";
import type { ProjectCardData } from "@/components/ui/ProjectCard";
import { demoOpenHref, projectHref } from "@/lib/paths";

export { demoOpenHref, displayHost, projectHref, serviceHref } from "@/lib/paths";

/** A project is published once it has a name and a summary. A live address is optional: private projects have none. */
export function isPublished(project: Project): boolean {
  return Boolean(project.name && project.summary);
}

/** Projects shown in the work index and listed in the sitemap. */
export function showcaseProjects(all: Project[] = projects): Project[] {
  return all.filter(isPublished);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** The project after this one, wrapping around to the first. */
export function getNextProject(slug: string): Project | undefined {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1 || projects.length < 2) return undefined;
  return projects[(index + 1) % projects.length];
}

export const getService = (id: string): Service | undefined => services.find((s) => s.id === id);

/** Projects that belong to a service area, for "related work" links. */
export const projectsForService = (serviceId: string): Project[] =>
  projects.filter((p) => isPublished(p) && p.serviceId === serviceId);

/** Related work for a project: same category or same service area, newest listing order, never itself. */
export function relatedProjects(project: Project, limit = 3): Project[] {
  const others = showcaseProjects().filter((p) => p.slug !== project.slug);
  const score = (p: Project) => (p.serviceId === project.serviceId ? 2 : 0) + (p.category === project.category ? 1 : 0);
  return others
    .map((p, index) => ({ p, index, s: score(p) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.index - b.index)
    .slice(0, limit)
    .map((x) => x.p);
}

export const projectsInCategory = (category: ProjectCategory) => showcaseProjects().filter((p) => p.category === category);

/** Where a project's "open the demo" link goes, or null for a private project. */
export function demoAction(project: Project): ProjectCardData["action"] {
  if (project.liveUrl) return { href: project.liveUrl, label: "Open live demo", external: true };
  if (project.demos.length === 1) return { href: demoOpenHref(project.demos[0].id), label: "Open live demo", external: true };
  if (project.demos.length > 1) return { href: `${projectHref(project)}#demos`, label: `Try all ${project.demos.length} demos`, external: false };
  return null;
}

/** The small, serializable shape a project card needs. */
export function toProjectCard(project: Project): ProjectCardData {
  return {
    slug: project.slug,
    name: project.name ?? "Project",
    summary: project.summary,
    category: project.category,
    kind: project.kind,
    cover: project.cover,
    stack: project.stack,
    demoCount: project.demos.length,
    action: demoAction(project),
  };
}
