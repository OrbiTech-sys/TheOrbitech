import { process as processSteps, projects, site } from "@/content/site";
import type { GlanceRow } from "@/components/AtAGlance";
import { isPublished } from "@/lib/projects";

const published = projects.filter(isPublished);
const where = [site.location ? `Based in ${site.location}.` : null, `Works remotely, ${site.areaServed.toLowerCase()}.`]
  .filter(Boolean)
  .join(" ");

/** Shared by the home page and /services so the two never disagree. */
export const glanceRows: GlanceRow[] = [
  {
    term: "Services",
    detail:
      "AI automation, chatbots and assistants; data analytics and dashboards; custom web, SaaS and MVP development; CRM and workflow automation; AI e-commerce search.",
  },
  {
    term: "Who we work with",
    detail: "Businesses that want less repetitive work and faster answers for customers.",
  },
  {
    term: "How we start",
    detail: `Tell us what slows your team down. We agree scope, then show a prototype of the workflow early. The steps are ${processSteps
      .map((step) => step.title)
      .join(", ")}.`,
  },
  { term: "Where we work", detail: where },
  {
    term: "Selected work",
    detail: `${published.filter((p) => p.liveUrl).length} live demos and ${published.filter((p) => !p.liveUrl).length} private projects.`,
  },
];
