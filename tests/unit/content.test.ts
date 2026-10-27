import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {
  contactOptions,
  estimator,
  faqs,
  meta,
  nav,
  process as processSteps,
  projects,
  services,
  site,
  team,
  testimonials,
} from "@/content/site";
import { allPages } from "@/lib/pages";
import { getNextProject, getProject, isPublished, projectHref } from "@/lib/projects";
import { breadcrumbNode, projectNodes, serviceNodes, siteNodes, webPageNode } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, siteUrl } from "@/lib/site-config";

const unique = (values: string[]) => new Set(values).size === values.length;
const words = (text: string) => text.trim().split(/\s+/).length;
const BRAND_SUFFIX = ` | ${site.name}`;

describe("content", () => {
  it("has unique, URL-safe project slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(unique(slugs)).toBe(true);
    slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/));
  });

  it("has unique ids and slugs elsewhere", () => {
    expect(unique(services.map((s) => s.id))).toBe(true);
    expect(unique(team.map((m) => m.slug))).toBe(true);
    expect(unique(nav.map((n) => n.href))).toBe(true);
    expect(unique(faqs.map((f) => f.question))).toBe(true);
    expect(processSteps.length).toBeGreaterThan(0);
  });

  it("only links to live sites over https", () => {
    projects.filter((p) => p.liveUrl).forEach((p) => expect(p.liveUrl).toMatch(/^https:\/\//));
  });

  it("gives every supplied image alt text, a local path and real dimensions", () => {
    for (const project of projects) {
      for (const image of [project.cover, project.desktop, project.mobile]) {
        if (!image) continue;
        expect(image.src.startsWith("/")).toBe(true);
        expect(image.alt.trim().length).toBeGreaterThan(5);
        expect(image.width).toBeGreaterThan(0);
        expect(image.height).toBeGreaterThan(0);
      }
    }
    team.forEach((m) => m.photo && expect(m.photo.src.startsWith("/")).toBe(true));
  });

  it("maps every estimator project type to a real contact option", () => {
    estimator.projectTypes.forEach((t) => expect(contactOptions.projectTypes).toContain(t.enquiry));
  });

  it("holds only complete testimonials", () => {
    testimonials.forEach((t) => {
      expect(t.name && t.role && t.company && t.quote).toBeTruthy();
    });
  });

  it("points every project at a real service area", () => {
    projects.forEach((p) => expect(services.map((s) => s.id)).toContain(p.serviceId));
  });

  it("keeps the project counts in the written copy true", () => {
    expect(projects.filter((p) => p.liveUrl)).toHaveLength(4);
    expect(projects.filter((p) => !p.liveUrl)).toHaveLength(2);
  });

  it("never shows a bracketed stand-in or an internal note", () => {
    const text = JSON.stringify({ site, meta, services, faqs, projects, processSteps });
    expect(text).not.toMatch(/\[[A-Z][^\]]{2,60}\]/);
    expect(text).not.toMatch(/walkthrough/i);
    expect(text).not.toMatch(/orbitech\.dev/i);
    expect(text).not.toMatch(/hello@orbitechsolutions/i);
    expect(text).not.toMatch(/—/); // no em dashes in copy
  });

  it("uses the confirmed brand, email and social profiles", () => {
    expect(site.name).toBe("The OrbiTech Solutions");
    expect(site.email).toBe("nova@theorbitechsolution.com");
    expect(site.social.map((p) => p.id)).toEqual(["linkedin", "instagram", "facebook"]);
    site.social.forEach((p) => expect(p.url).toMatch(/^https:\/\//));
  });
});

describe("search titles and descriptions", () => {
  const pages = [
    ...Object.values(meta).map((m) => ({ title: m.title, description: m.description })),
    ...projects.map((p) => ({ title: `${p.seoTitle}${BRAND_SUFFIX}`, description: p.seoDescription })),
  ];

  it("keeps titles unique", () => {
    expect(unique(pages.map((p) => p.title))).toBe(true);
  });

  it("keeps descriptions unique", () => {
    expect(unique(pages.map((p) => p.description))).toBe(true);
  });

  it("keeps indexable titles between 46 and 60 characters", () => {
    for (const page of pages.filter((p) => !p.title.startsWith("Privacy"))) {
      expect(page.title.length, page.title).toBeGreaterThanOrEqual(46);
      expect(page.title.length, page.title).toBeLessThanOrEqual(60);
    }
  });

  it("keeps descriptions between 150 and 160 characters", () => {
    for (const page of pages) {
      expect(page.description.length, page.description).toBeGreaterThanOrEqual(150);
      expect(page.description.length, page.description).toBeLessThanOrEqual(160);
    }
  });

  it("uses the exact brand in every title", () => {
    for (const page of pages) expect(page.title).toContain("The OrbiTech Solutions");
  });
});

describe("answers and definitions", () => {
  it("gives each question a direct answer of 40 to 60 words", () => {
    expect(faqs.length).toBeGreaterThanOrEqual(6);
    expect(faqs.length).toBeLessThanOrEqual(8);
    for (const faq of faqs) {
      expect(faq.question.endsWith("?")).toBe(true);
      expect(words(faq.answer), faq.question).toBeGreaterThanOrEqual(40);
      expect(words(faq.answer), faq.question).toBeLessThanOrEqual(60);
    }
  });

  it("states the company in two sentences", () => {
    const sentences = site.description.split(/(?<=\.)\s+/);
    expect(sentences).toHaveLength(2);
    expect(site.description.startsWith(site.name)).toBe(true);
  });
});

describe("projects", () => {
  it("publishes all six case studies", () => {
    expect(projects.filter(isPublished)).toHaveLength(6);
  });

  it("finds projects and the next one, wrapping around", () => {
    const first = projects[0];
    const last = projects[projects.length - 1];
    expect(getProject(first.slug)).toBe(first);
    expect(getProject("does-not-exist")).toBeUndefined();
    expect(getNextProject(first.slug)).toBe(projects[1]);
    expect(getNextProject(last.slug)).toBe(first);
    expect(getNextProject("does-not-exist")).toBeUndefined();
  });
});

describe("site address", () => {
  it("is the confirmed domain, with no trailing slash on any path", () => {
    expect(siteUrl).toBe("https://theorbitechsolution.com");
    expect(absoluteUrl("/")).toBe("https://theorbitechsolution.com");
    expect(absoluteUrl("/services")).toBe("https://theorbitechsolution.com/services");
  });
});

describe("search engine files", () => {
  const paths = () => sitemap().map((entry) => new URL(entry.url).pathname);

  it("lists the main pages and all six case studies in the sitemap", () => {
    expect(paths()).toEqual(expect.arrayContaining(["/", "/work", "/services", "/studio", "/contact"]));
    for (const project of projects) expect(paths()).toContain(projectHref(project));
  });

  it("uses real dates and leaves out change frequency and priority", () => {
    for (const entry of sitemap()) {
      expect(entry.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(entry).not.toHaveProperty("changeFrequency");
      expect(entry).not.toHaveProperty("priority");
    }
  });

  it("leaves out the thank-you page and any page marked noindex", () => {
    expect(paths()).not.toContain("/contact/thanks");
    for (const page of allPages().filter((p) => !p.indexable)) expect(paths()).not.toContain(page.path);
  });

  it("points robots.txt at the sitemap on our own host and blocks only the thank-you page", () => {
    const config = robots();
    expect(config.sitemap).toBe("https://theorbitechsolution.com/sitemap.xml");
    expect(JSON.stringify(config.rules)).toContain("/contact/thanks");
    expect(JSON.stringify(config.rules)).not.toMatch(/GPTBot|CCBot|Google-Extended/);
  });

  it("builds absolute canonical and social tags, and keeps noindex pages followable", () => {
    const meta1 = pageMetadata({ title: "X", description: "Y", path: "/x" });
    expect(meta1.alternates?.canonical).toBe("https://theorbitechsolution.com/x");
    expect(meta1.openGraph).toMatchObject({ type: "website", siteName: site.name, url: "https://theorbitechsolution.com/x" });
    expect(JSON.stringify(meta1.openGraph?.images)).toContain("https://theorbitechsolution.com/og/default.png");
    expect(meta1.twitter).toMatchObject({ card: "summary_large_image" });
    expect(meta1.twitter).not.toHaveProperty("site");
    expect(pageMetadata({ title: "X", description: "Y", path: "/x", noindex: true }).robots).toEqual({
      index: false,
      follow: true,
    });
  });
});

describe("structured data", () => {
  const graph = () => [
    ...siteNodes(),
    ...serviceNodes(),
    webPageNode({ path: "/services", name: "x", description: "y", dateModified: "2026-10-27", breadcrumbs: [] }),
    breadcrumbNode("/services", [{ name: "Home", path: "/" }]),
    ...projects.flatMap((p) => [
      webPageNode({ path: projectHref(p), name: p.seoTitle, description: p.seoDescription, dateModified: p.updated }),
      ...projectNodes(p),
    ]),
  ];
  const nodeIds = () => new Set(graph().map((n) => n["@id"] as string));

  const refs = (value: unknown, out: string[] = []): string[] => {
    if (Array.isArray(value)) value.forEach((v) => refs(v, out));
    else if (value && typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 1 && entries[0][0] === "@id") out.push(entries[0][1] as string);
      else entries.forEach(([, v]) => refs(v, out));
    }
    return out;
  };

  it("describes the organization with only supplied details", () => {
    const [org, website] = siteNodes();
    expect(org["@id"]).toBe("https://theorbitechsolution.com/#organization");
    expect(org.url).toBe("https://theorbitechsolution.com");
    expect(org.name).toBe("The OrbiTech Solutions");
    expect(org.description).toBe(site.description);
    expect(org.sameAs).toEqual(site.social.map((p) => p.url));
    expect(org.email).toBe("nova@theorbitechsolution.com");
    expect(org).not.toHaveProperty("telephone");
    expect(website["@id"]).toBe("https://theorbitechsolution.com/#website");
  });

  it("resolves every @id reference", () => {
    const known = nodeIds();
    for (const node of graph()) for (const ref of refs(node)) expect(known, ref).toContain(ref);
  });

  it("never points at another company's domain", () => {
    expect(JSON.stringify(graph())).not.toMatch(/orbitech\.dev/i);
  });

  it("puts demo links in url, never in sameAs", () => {
    for (const project of projects) {
      const [work] = projectNodes(project);
      expect(work).not.toHaveProperty("sameAs");
      expect(work.url).toBe(absoluteUrl(projectHref(project)));
      if (project.liveUrl) expect(JSON.stringify(work.workExample)).toContain(project.liveUrl);
    }
  });

  it("adds one Service per area, with no offers or prices", () => {
    const nodes = serviceNodes();
    expect(nodes).toHaveLength(services.length);
    nodes.forEach((n) => {
      expect(n.provider).toEqual({ "@id": "https://theorbitechsolution.com/#organization" });
      expect(n).not.toHaveProperty("offers");
    });
  });
});
