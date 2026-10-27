import { projects, services, site, type Project } from "@/content/site";
import { getService, isPublished, projectHref } from "@/lib/projects";
import { absoluteUrl, siteUrl } from "@/lib/site-config";

export type Node = Record<string, unknown>;

export const ids = {
  organization: `${siteUrl}/#organization`,
  website: `${siteUrl}/#website`,
  webpage: (path: string) => `${absoluteUrl(path)}#webpage`,
  breadcrumb: (path: string) => `${absoluteUrl(path)}#breadcrumb`,
};

const organizationRef = { "@id": ids.organization };

/**
 * The Organization and WebSite nodes that go on every page. Only details that
 * were supplied are included: nothing is guessed, and nothing is a placeholder.
 */
export function siteNodes(): Node[] {
  const organization: Node = {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ids.organization,
    name: site.name,
    alternateName: site.alternateNames,
    url: siteUrl,
    logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png"), width: 512, height: 512 },
    image: absoluteUrl("/og/default.png"),
    description: site.description,
    slogan: site.tagline,
    knowsAbout: [
      "AI automation",
      "AI chatbots",
      "Business process automation",
      "Custom web development",
      "Data analytics",
      "E-commerce development",
    ],
  };
  if (site.foundingDate) organization.foundingDate = site.foundingDate;
  if (site.email) {
    organization.email = site.email;
    organization.contactPoint = {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.email,
      availableLanguage: "English",
    };
  }
  if (site.areaServed) organization.areaServed = site.areaServed;
  if (site.location) {
    // "City, Country" as supplied. No street address was given, so none is published.
    const [locality, country] = site.location.split(",").map((part) => part.trim());
    organization.address = {
      "@type": "PostalAddress",
      ...(locality ? { addressLocality: locality } : {}),
      ...(country ? { addressCountry: country } : {}),
    };
  }
  if (site.social.length > 0) organization.sameAs = site.social.map((profile) => profile.url);

  const website: Node = {
    "@type": "WebSite",
    "@id": ids.website,
    url: siteUrl,
    name: site.name,
    publisher: organizationRef,
    inLanguage: "en",
  };

  return [organization, website];
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbNode(path: string, crumbs: Crumb[]): Node {
  return {
    "@type": "BreadcrumbList",
    "@id": ids.breadcrumb(path),
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

interface WebPageInput {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  path: string;
  name: string;
  description: string;
  dateModified: string;
  breadcrumbs?: Crumb[];
  /** Entity this page is mainly about, as a reference to another node */
  mainEntity?: { "@id": string };
}

export function webPageNode({ type = "WebPage", path, name, description, dateModified, breadcrumbs, mainEntity }: WebPageInput): Node {
  return {
    "@type": type,
    "@id": ids.webpage(path),
    url: absoluteUrl(path),
    name,
    description,
    isPartOf: { "@id": ids.website },
    about: organizationRef,
    inLanguage: "en",
    dateModified,
    ...(breadcrumbs ? { breadcrumb: { "@id": ids.breadcrumb(path) } } : {}),
    ...(mainEntity ? { mainEntity } : {}),
  };
}

/** One Service per service area. No offers and no prices. */
export function serviceNodes(): Node[] {
  return services.map((service) => ({
    "@type": "Service",
    "@id": `${absoluteUrl("/services")}#${service.id}`,
    name: service.heading,
    serviceType: service.serviceType,
    description: service.summary,
    url: `${absoluteUrl("/services")}#${service.id}`,
    provider: organizationRef,
    areaServed: site.areaServed,
  }));
}

/** The projects as an ordered list, for the work index. */
export function projectListNode(): Node {
  return {
    "@type": "ItemList",
    "@id": `${absoluteUrl("/work")}#projects`,
    itemListElement: projects.filter(isPublished).map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(projectHref(project)),
      name: project.name,
    })),
  };
}

/**
 * A case study as a CreativeWork made by the studio. A live demo is described
 * in `workExample` as a web application, so the demo address sits in a `url`
 * and never in `sameAs`. Concepts and prototypes say so in the description.
 */
export function projectNodes(project: Project): Node[] {
  const path = projectHref(project);
  const caseUrl = absoluteUrl(path);
  const service = getService(project.serviceId);
  const description = `${project.kind}. ${project.summary ?? ""}`.trim();

  const work: Node = {
    "@type": "CreativeWork",
    "@id": `${caseUrl}#project`,
    name: project.name,
    url: caseUrl,
    description,
    creator: organizationRef,
    mainEntityOfPage: { "@id": ids.webpage(path) },
    inLanguage: "en",
    dateModified: project.updated,
  };
  if (project.cover) work.image = absoluteUrl(project.cover.src);
  if (project.year) work.dateCreated = project.year;
  if (project.client) work.sourceOrganization = { "@type": "Organization", name: project.client };
  if (project.stack.length > 0) work.keywords = project.stack.join(", ");
  if (service) work.about = service.serviceType;
  if (project.liveUrl) {
    work.workExample = {
      "@type": "WebApplication",
      "@id": `${caseUrl}#demo`,
      name: `${project.name} (live demo)`,
      url: project.liveUrl,
      description: `Live demo of ${project.name}. ${project.summary ?? ""}`.trim(),
      creator: organizationRef,
    };
  }
  return [work];
}

