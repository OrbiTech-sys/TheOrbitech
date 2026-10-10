import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {
  contactOptions,
  estimator,
  faqs,
  nav,
  process as processSteps,
  projects,
  services,
  team,
  testimonials,
} from "@/content/site";
import { getNextProject, getProject, isRealProject } from "@/lib/projects";
import { creativeWorkLd, organizationLd, pageMetadata } from "@/lib/seo";

const unique = (values: string[]) => new Set(values).size === values.length;

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
    // Real ones only. If you add some, each must name a person, role and company.
    testimonials.forEach((t) => {
      expect(t.name && t.role && t.company && t.quote).toBeTruthy();
    });
  });
});

describe("projects", () => {
  it("treats empty slots as placeholders, not real projects", () => {
    expect(projects.every((p) => !isRealProject(p) || (p.name && p.liveUrl))).toBe(true);
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

describe("search engine files", () => {
  it("lists the main pages in the sitemap", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);
    for (const path of ["/", "/work", "/services", "/studio", "/contact", "/privacy"]) {
      expect(paths).toContain(path);
    }
  });

  it("leaves empty project slots and the thank-you page out of the sitemap", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);
    projects.filter((p) => !isRealProject(p)).forEach((p) => expect(paths).not.toContain(`/work/${p.slug}`));
    expect(paths).not.toContain("/contact/thanks");
  });

  it("points robots.txt at the sitemap and blocks the thank-you page", () => {
    const config = robots();
    expect(config.sitemap).toMatch(/\/sitemap\.xml$/);
    expect(JSON.stringify(config.rules)).toContain("/contact/thanks");
  });

  it("marks placeholder pages noindex and gives real pages a canonical", () => {
    expect(pageMetadata({ title: "X", description: "Y", path: "/x", noindex: true }).robots).toMatchObject({ index: false });
    expect(pageMetadata({ title: "X", description: "Y", path: "/x" }).alternates?.canonical).toBe("/x");
  });

  it("builds structured data only from details that were provided", () => {
    const org = organizationLd();
    expect(org["@type"]).toBe("Organization");
    expect(org).not.toHaveProperty("email");
    expect(org).not.toHaveProperty("address");
    const emptyProject = { ...projects[0], name: null };
    expect(creativeWorkLd(emptyProject, "/work/empty")).toBeNull();

    const ld = creativeWorkLd({ ...projects[0], name: "Acme site", liveUrl: "https://acme.example" }, "/work/acme");
    expect(ld).toMatchObject({ "@type": "CreativeWork", name: "Acme site", sameAs: "https://acme.example" });
    expect(ld).not.toHaveProperty("dateCreated");
  });
});
