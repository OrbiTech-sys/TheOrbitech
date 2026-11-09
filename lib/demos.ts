import { projects, type Demo, type Project } from "@/content/site";

export interface DemoEntry {
  demo: Demo;
  project: Project;
}

/** Every demo on the site with the project it belongs to. Safe for the browser: it holds no addresses. */
export function allDemos(): DemoEntry[] {
  return projects.flatMap((project) => project.demos.map((demo) => ({ demo, project })));
}

export function findDemo(id: string): DemoEntry | undefined {
  return allDemos().find((entry) => entry.demo.id === id);
}

export { demoGateHref, demoOpenHref } from "@/lib/paths";
