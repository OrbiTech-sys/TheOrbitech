import { projects, services, type Project, type Service } from "@/content/site";

export { demoOpenHref, displayHost, projectHref, serviceHref } from "@/lib/paths";

/** A project is published once it has a name and a summary. A live address is optional: private projects have none. */
export function isPublished(project: Project): boolean {
  return Boolean(project.name && project.summary);
}

/** A project has something visitors can open: a public URL or gated demos. */
export function isRealProject(project: Project): boolean {
  return Boolean(project.name && (project.liveUrl || project.demos.length > 0));
}

/** Projects shown in the work index and listed in the sitemap. */
export function showcaseProjects(all: Project[] = projects): Project[] {
  return all.filter(isPublished);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** The next real project after this one, wrapping around to the first. */
export function getNextProject(slug: string): Project | undefined {
  const list = showcaseProjects(projects);
  const index = list.findIndex((p) => p.slug === slug);
  if (index === -1 || list.length < 2) return undefined;
  return list[(index + 1) % list.length];
}

export const getService = (id: string): Service | undefined => services.find((s) => s.id === id);

/** Projects that belong to a service area, for "related work" links. */
export const projectsForService = (serviceId: string): Project[] =>
  projects.filter((p) => isPublished(p) && p.serviceId === serviceId);
