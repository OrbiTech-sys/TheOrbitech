import { industryPages } from "@/content/industries";
import { isPublishedInsight, insights } from "@/content/insights";
import { servicePageById } from "@/content/offerings";
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
    `- [Industries](${absoluteUrl("/industries")}): ${meta.industries.description}`,
    `- [Work](${absoluteUrl("/work")}): ${meta.work.description}`,
    `- [Studio](${absoluteUrl("/studio")}): ${meta.studio.description}`,
    `- [Insights](${absoluteUrl("/insights")}): ${meta.insights.description}`,
    `- [Contact](${absoluteUrl("/contact")}): ${meta.contact.description}`,
    "",
    "## Service areas",
    "",
    ...services.map((s) => {
      const page = servicePageById(s.id);
      return `- [${s.heading}](${absoluteUrl(page ? `/services/${page.slug}` : `/services#${s.id}`)}): ${s.summary}`;
    }),
    "",
    "## Industries",
    "",
    ...industryPages.map((i) => `- [${i.name}](${absoluteUrl(`/industries/${i.slug}`)}): ${i.seoDescription}`),
    "",
    "## Case studies",
    "",
    ...projects.filter(isPublished).map((p) => `- [${p.name}](${absoluteUrl(projectHref(p))}): ${p.kind}. ${p.seoDescription}`),
    "",
    ...(insights.some(isPublishedInsight)
      ? [
          "## Insights",
          "",
          ...insights.filter(isPublishedInsight).map((a) => `- [${a.title}](${absoluteUrl(`/insights/${a.slug}`)}): ${a.seoDescription}`),
          "",
        ]
      : []),
    "## Profiles",
    "",
    ...site.social.map((p) => `- ${p.label}: ${p.url}`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
