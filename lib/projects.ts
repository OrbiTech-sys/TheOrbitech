import { projects, type Project } from "@/content/site";

/** A project counts as real once it has a name and a live address. */
export function isRealProject(project: Project): boolean {
  return Boolean(project.name && project.liveUrl);
}

/** Named projects are shown in the work index; live projects are still the only ones indexed as published work. */
export function showcaseProjects(all: Project[]): Project[] {
  const named = all.filter((project) => Boolean(project.name));
  return named.length > 0 ? named : all;
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

export const projectHref = (project: Project) => `/work/${project.slug}`;

/** Host part of the live address, for captions: "https://www.acme.com/x" → "acme.com" */
export function displayHost(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
