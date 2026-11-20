/**
 * Small URL helpers with no content imports, so client components can use them
 * without pulling the whole content file into the browser bundle.
 */

export const projectHref = (project: { slug: string }) => `/work/${project.slug}`;

/** Opens a demo once the visitor has confirmed an email address; otherwise it goes to the email check. */
export const demoOpenHref = (id: string) => `/demo/${id}/open`;

/** The page that asks for the email address. */
export const demoGateHref = (id: string) => `/demo/${id}`;

export const serviceHref = (service: { id: string }) => `/services#${service.id}`;

/** Host part of the live address, for captions: "https://www.acme.com/x" → "acme.com" */
export function displayHost(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
