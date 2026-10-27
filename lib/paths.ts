/**
 * Small URL helpers with no content imports, so client components can use them
 * without pulling the whole content file into the browser bundle.
 */

export const projectHref = (project: { slug: string }) => `/work/${project.slug}`;

export const serviceHref = (service: { id: string }) => `/services#${service.id}`;

/** Host part of the live address, for captions: "https://www.acme.com/x" → "acme.com" */
export function displayHost(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
