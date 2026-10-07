/**
 * One schema, used twice: the browser checks it before sending, and the
 * Server Action checks it again. Never trust the browser's result alone.
 */
import { z } from "zod";
import { contactOptions } from "@/content/site";

export const ENQUIRY_FIELDS = [
  "name",
  "email",
  "company",
  "projectType",
  "budget",
  "timeline",
  "message",
  "estimate",
  "website",
] as const;

export type EnquiryField = (typeof ENQUIRY_FIELDS)[number];
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export const MAX = { name: 120, email: 254, company: 160, choice: 160, message: 4000, estimate: 160 } as const;

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

/** Control characters other than tab and newline */
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const cleaned = (max: number) => z.string().transform((v) => v.replace(CONTROL_RE, "").trim()).pipe(z.string().max(max));

const choice = (options: readonly string[]) =>
  cleaned(MAX.choice).refine((v) => v === "" || options.includes(v), "Choose one of the listed options.");

export const enquirySchema = z.object({
  name: cleaned(MAX.name).pipe(
    z.string().min(1, "Enter your name so we know who to reply to."),
  ),
  email: cleaned(MAX.email)
    .transform((v) => v.toLowerCase())
    .pipe(z.string().refine((v) => EMAIL_RE.test(v), "Enter an email address like name@company.com.")),
  company: cleaned(MAX.company),
  projectType: choice(contactOptions.projectTypes),
  budget: choice(contactOptions.budgets),
  timeline: choice(contactOptions.timelines),
  message: cleaned(MAX.message).pipe(
    z.string().min(10, "Add a sentence or two about the project, at least 10 characters."),
  ),
  estimate: cleaned(MAX.estimate),
  /** Honeypot. People never see this field, so it must stay empty. */
  website: cleaned(200),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type ParseResult =
  | { ok: true; data: EnquiryInput }
  | { ok: false; errors: EnquiryErrors };

/** Read the known fields out of a FormData or plain object. Missing fields become "". */
export function toEnquiryObject(source: FormData | Record<string, unknown>): Record<EnquiryField, string> {
  const get = (key: string) => (source instanceof FormData ? source.get(key) : source[key]);
  const out = {} as Record<EnquiryField, string>;
  for (const field of ENQUIRY_FIELDS) {
    const value = get(field);
    out[field] = typeof value === "string" ? value : "";
  }
  return out;
}

export function parseEnquiry(source: FormData | Record<string, unknown>): ParseResult {
  const result = enquirySchema.safeParse(toEnquiryObject(source));
  if (result.success) return { ok: true, data: result.data };

  const errors: EnquiryErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as EnquiryField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return { ok: false, errors };
}
