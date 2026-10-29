/**
 * Turns a checked enquiry into a ready-to-send email, written in the visitor's
 * voice, so the contact form can open their own email app with it filled in.
 */
import type { EnquiryInput } from "@/lib/enquiry-schema";

export interface EnquiryEmail {
  subject: string;
  body: string;
}

export function enquiryEmail(enquiry: EnquiryInput, studioName: string): EnquiryEmail {
  const sender = enquiry.company ? `${enquiry.name}, ${enquiry.company}` : enquiry.name;
  const subject = `Project Enquiry: ${enquiry.projectType || "New Project"} | ${sender}`;

  // Optional answers left blank are left out, so nothing needs editing before sending.
  const details = [
    ["Project type", enquiry.projectType],
    ["Budget", enquiry.budget],
    ["Timing", enquiry.timeline],
    ["Estimate", enquiry.estimate],
  ].filter(([, value]) => value);

  const contact = [
    ["Name", enquiry.name],
    ["Company", enquiry.company],
    ["Email", enquiry.email],
  ].filter(([, value]) => value);

  const lines = (rows: string[][]) => rows.map(([label, value]) => `${label}: ${value}`);

  const body = [
    `Dear ${studioName.replace(/^The /, "")} team,`,
    "",
    "I hope you are well. I am writing to enquire about working with you on a project, and I would welcome your thoughts on how you could help. The details are below.",
    "",
    ...(details.length ? ["PROJECT DETAILS", ...lines(details), ""] : []),
    "ABOUT THE PROJECT",
    enquiry.message,
    "",
    "CONTACT DETAILS",
    ...lines(contact),
    "",
    "I would be glad to arrange a short call to discuss the scope, timeline and next steps. Please let me know a time that suits you.",
    "",
    "Thank you for your time. I look forward to hearing from you.",
    "",
    "Kind regards,",
    enquiry.name,
    ...(enquiry.company ? [enquiry.company] : []),
  ].join("\n");

  return { subject, body };
}

/** A mailto: link that opens the visitor's default email app. */
export function mailtoHref(to: string, { subject, body }: EnquiryEmail): string {
  // encodeURIComponent, not URLSearchParams: mail apps read "+" literally, not as a space.
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\n/g, "\r\n"))}`;
}
