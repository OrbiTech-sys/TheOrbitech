import { projects, services, type Project, type Service } from "@/content/site";

export { displayHost, projectHref, serviceHref } from "@/lib/paths";

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
