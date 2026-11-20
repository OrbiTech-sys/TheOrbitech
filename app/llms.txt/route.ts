import { meta, projects, services, site } from "@/content/site";
import { isPublished, projectHref } from "@/lib/projects";
import { absoluteUrl } from "@/lib/site-config";

/**
 * /llms.txt: a short plain-text guide to the site for AI assistants. Built from
 * the same content as the pages, so the name, description, links and email can
 * never drift from what the site says. Google Search does not use this file.
 */
export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `Website: ${absoluteUrl("/")}`,
    ...(site.email ? [`Email: ${site.email}`] : []),
    ...(site.location ? [`Based in: ${site.location}. Works remotely, ${site.areaServed.toLowerCase()}.`] : []),
    "",
    "## Main pages",
    "",
    `- [Home](${absoluteUrl("/")}): ${meta.home.description}`,
    `- [Services](${absoluteUrl("/services")}): ${meta.services.description}`,
    `- [Work](${absoluteUrl("/work")}): ${meta.work.description}`,
    `- [Studio](${absoluteUrl("/studio")}): ${meta.studio.description}`,
    `- [Contact](${absoluteUrl("/contact")}): ${meta.contact.description}`,
    "",
    "## Service areas",
    "",
    ...services.map((s) => `- [${s.heading}](${absoluteUrl(`/services#${s.id}`)}): ${s.summary}`),
    "",
    "## Case studies",
    "",
    ...projects.filter(isPublished).map((p) => `- [${p.name}](${absoluteUrl(projectHref(p))}): ${p.kind}. ${p.seoDescription}`),
    "",
    "## Profiles",
    "",
    ...site.social.map((p) => `- ${p.label}: ${p.url}`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
