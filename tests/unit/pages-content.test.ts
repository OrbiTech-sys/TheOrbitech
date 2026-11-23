import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { industryPages } from "@/content/industries";
import { insightCategories, insights, isPublishedInsight } from "@/content/insights";
import { coreCategories, servicePages } from "@/content/offerings";
import { meta, nav, process as processSteps, projectCategories, projects, services, site, skills, studio } from "@/content/site";
import { allPages } from "@/lib/pages";
import { demoAction, relatedProjects, showcaseProjects, toProjectCard } from "@/lib/projects";
import { serviceNodes } from "@/lib/schema";

const SUFFIX = ` | ${site.name}`;
const unique = (values: string[]) => new Set(values).size === values.length;
const sitemapPaths = () => sitemap().map((entry) => new URL(entry.url).pathname);

const searchable = [
  ...servicePages.map((p) => ({ id: `service/${p.slug}`, title: p.seoTitle, description: p.seoDescription })),
  ...industryPages.map((p) => ({ id: `industry/${p.slug}`, title: p.seoTitle, description: p.seoDescription })),
  ...insights.map((p) => ({ id: `insight/${p.slug}`, title: p.seoTitle, description: p.seoDescription })),
];

describe("new pages: search titles and descriptions", () => {
  it("keeps every title between 46 and 60 characters with the brand, and every description between 150 and 160", () => {
    for (const page of searchable) {
      const title = `${page.title}${SUFFIX}`;
      expect(title.length, page.id).toBeGreaterThanOrEqual(46);
      expect(title.length, page.id).toBeLessThanOrEqual(60);
      expect(page.description.length, page.id).toBeGreaterThanOrEqual(150);
      expect(page.description.length, page.id).toBeLessThanOrEqual(160);
    }
  });

  it("never repeats a title or a description across the whole site", () => {
    const titles = [
      ...Object.values(meta).map((m) => m.title),
      ...projects.map((p) => `${p.seoTitle}${SUFFIX}`),
      ...searchable.map((p) => `${p.title}${SUFFIX}`),
    ];
    const descriptions = [...Object.values(meta).map((m) => m.description), ...projects.map((p) => p.seoDescription), ...searchable.map((p) => p.description)];
    expect(unique(titles)).toBe(true);
    expect(unique(descriptions)).toBe(true);
  });
});

describe("service pages", () => {
  it("has one page per service area, each pointing at a real service", () => {
    expect(servicePages).toHaveLength(6);
    expect(unique(servicePages.map((p) => p.slug))).toBe(true);
    expect(servicePages.map((p) => p.serviceId).sort()).toEqual(services.map((s) => s.id).sort());
    servicePages.forEach((p) => expect(p.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/));
  });

  it("covers the six pages the site promises", () => {
    expect(servicePages.map((p) => p.slug).sort()).toEqual(
      ["ai-commerce", "ai-engineering", "automation", "data-intelligence", "software-development", "technology-consulting"].sort(),
    );
  });

  it("gives every page problems, an approach, technologies, questions and an overview", () => {
    for (const p of servicePages) {
      expect(p.overview.length, p.slug).toBeGreaterThan(0);
      expect(p.problems.length, p.slug).toBeGreaterThanOrEqual(3);
      expect(p.approach.length, p.slug).toBe(5);
      expect(p.technologies.length, p.slug).toBeGreaterThan(0);
      expect(p.faqs.length, p.slug).toBeGreaterThanOrEqual(3);
      p.faqs.forEach((f) => expect(f.q.endsWith("?"), f.q).toBe(true));
    }
  });

  it("names only tools the studio lists (plus n8n)", () => {
    const known = new Set([...skills.flatMap((g) => g.tools), "n8n"]);
    for (const p of servicePages) for (const tool of p.technologies) expect(known.has(tool), `${p.slug}: ${tool}`).toBe(true);
  });

  it("states no price, timeline, client or result", () => {
    const text = JSON.stringify(servicePages);
    expect(text).not.toMatch(/\$\s?\d|\bUSD\b|€|£/);
    expect(text).not.toMatch(/\b\d+\s?(days?|weeks?|months?)\b/i);
    expect(text).not.toMatch(/\b\d+\s?%|\b10x\b|trusted by|our clients/i);
  });

  it("describes the four home-page categories with real service pages", () => {
    expect(coreCategories).toHaveLength(4);
    for (const category of coreCategories) expect(servicePages.map((p) => p.slug)).toContain(category.slug);
  });

  it("points each structured-data service at its own page", () => {
    const urls = serviceNodes().map((n) => n.url as string);
    for (const p of servicePages) expect(urls.some((u) => u.endsWith(`/services/${p.slug}`)), p.slug).toBe(true);
  });
});

describe("industry pages", () => {
  it("has the five industries, each with challenges, solutions, workflows and questions", () => {
    expect(industryPages.map((i) => i.slug).sort()).toEqual(["ecommerce", "healthcare", "professional-services", "real-estate", "restaurants"]);
    for (const i of industryPages) {
      expect(i.challenges.length, i.slug).toBeGreaterThanOrEqual(3);
      expect(i.solutions.length, i.slug).toBeGreaterThanOrEqual(3);
      expect(i.workflows.length, i.slug).toBeGreaterThanOrEqual(1);
      expect(i.faqs.length, i.slug).toBeGreaterThanOrEqual(2);
    }
  });

  it("links solutions only to real service pages and related work only to real projects", () => {
    for (const i of industryPages) {
      for (const s of i.solutions) expect(servicePages.map((p) => p.slug), `${i.slug}: ${s.service}`).toContain(s.service);
      for (const slug of i.related) expect(projects.map((p) => p.slug), `${i.slug}: ${slug}`).toContain(slug);
    }
  });

  it("never claims clients, customers, results or compliance", () => {
    const text = JSON.stringify(industryPages);
    expect(text).not.toMatch(/\bour (clients|customers)\b|trusted by|we have (helped|worked with)|case stud(y|ies) (for|with)/i);
    expect(text).not.toMatch(/\b(HIPAA|GDPR|SOC ?2|ISO ?27001)[- ]compliant|certified\b/i);
    expect(text).not.toMatch(/\b\d+\s?%/);
  });

  it("says plainly that there are no healthcare case studies", () => {
    const healthcare = industryPages.find((i) => i.slug === "healthcare")!;
    expect(healthcare.relatedNote).toMatch(/no healthcare case studies/i);
  });
});

describe("insights", () => {
  it("has the six planned topics, all drafts with an outline, no body, no date and no author", () => {
    expect(insights).toHaveLength(6);
    expect(unique(insights.map((a) => a.slug))).toBe(true);
    for (const a of insights) {
      expect(insightCategories).toContain(a.category);
      expect(a.status).toBe("draft");
      expect(a.outline.length, a.slug).toBeGreaterThanOrEqual(4);
      expect(a.sections, a.slug).toHaveLength(0);
      expect(a.published, a.slug).toBeNull();
      expect(a.author, a.slug).toBeNull();
    }
  });

  it("treats an article as published only with a body and a date, and keeps drafts out of the sitemap", () => {
    expect(insights.some(isPublishedInsight)).toBe(false);
    expect(sitemapPaths().some((p) => p.startsWith("/insights/"))).toBe(false);
    expect(sitemapPaths()).toContain("/insights");
    const withBody = { ...insights[0], status: "published" as const, published: "2026-11-19", sections: [{ heading: "H", paragraphs: ["P"] }] };
    expect(isPublishedInsight(withBody)).toBe(true);
    expect(isPublishedInsight({ ...withBody, published: null })).toBe(false);
  });
});

describe("routes and navigation", () => {
  it("lists every new page in the sitemap source and the sitemap", () => {
    const paths = sitemapPaths();
    for (const path of ["/industries", "/insights"]) expect(paths).toContain(path);
    for (const p of servicePages) expect(paths).toContain(`/services/${p.slug}`);
    for (const i of industryPages) expect(paths).toContain(`/industries/${i.slug}`);
    expect(allPages().find((p) => p.path === "/terms")?.indexable).toBe(false);
    expect(paths).not.toContain("/terms");
  });

  it("has the navigation the site promises, with no duplicate links", () => {
    expect(nav.map((n) => n.label)).toEqual(["Home", "Services", "Industries", "Work", "Studio", "Insights", "Contact"]);
    expect(unique(nav.map((n) => n.href))).toBe(true);
  });
});

describe("work and case studies", () => {
  it("puts every project in one of the four filter groups", () => {
    for (const p of projects) expect(projectCategories, p.slug).toContain(p.category);
    expect(projectCategories).toEqual(["AI & Automation", "SaaS Platforms", "Web Applications", "E-commerce"]);
  });

  it("gives every published project a problem and a solution to show", () => {
    for (const p of showcaseProjects()) {
      expect(p.brief.length, p.slug).toBeGreaterThan(0);
      expect(p.approach.length, p.slug).toBeGreaterThan(0);
    }
  });

  it("builds a small card for each project and never puts a demo's real address in it", () => {
    for (const p of showcaseProjects()) {
      const card = toProjectCard(p);
      expect(card.slug).toBe(p.slug);
      if (p.demos.length > 0) {
        expect(JSON.stringify(card)).not.toMatch(/vercel\.app|theorbitechsolution/);
        expect(card.action).not.toBeNull();
      }
    }
    const group = demoAction(projects.find((p) => p.slug === "restaurant-website-demos")!);
    expect(group).toMatchObject({ external: false, href: "/work/restaurant-website-demos#demos" });
    const priv = projects.find((p) => p.kind === "Private project")!;
    expect(demoAction(priv)).toBeNull();
  });

  it("finds related work that is never the project itself", () => {
    for (const p of showcaseProjects()) {
      const related = relatedProjects(p, 3);
      expect(related.every((r) => r.slug !== p.slug)).toBe(true);
    }
  });
});

describe("studio and process copy", () => {
  it("lists the five steps and the five things clients can rely on", () => {
    expect(processSteps.map((s) => s.title)).toEqual(["Discover", "Define", "Prototype", "Build & Integrate", "Launch & Improve"]);
    expect(studio.differentiators.map((d) => d.title)).toEqual([
      "Repository ownership",
      "Direct developer communication",
      "Working software demonstrations",
      "Milestone-based development",
      "Transparent collaboration",
    ]);
  });
});
