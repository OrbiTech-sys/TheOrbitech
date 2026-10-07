"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { site } from "@/content/site";
import { parseEnquiry, toEnquiryObject, type EnquiryErrors } from "@/lib/enquiry-schema";

export interface EnquiryState {
  status: "idle" | "invalid" | "unconfigured" | "rate_limited" | "forbidden" | "error";
  message: string;
  fieldErrors?: EnquiryErrors;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const DEFAULT_MAIL_ENDPOINT = "https://api.resend.com/emails";

// Per-instance limiter. It stops casual abuse; use a shared store such as
// Redis if the site ever runs on several instances.
const recent = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    recent.set(key, hits);
    return true;
  }
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 2000) {
    for (const [k, times] of recent) {
      if (times.every((t) => now - t >= WINDOW_MS)) recent.delete(k);
    }
  }
  return false;
}

/** Same-origin check on top of the one Next.js already performs for Server Actions. */
function isSameOrigin(requestHeaders: Headers): boolean {
  const origin = requestHeaders.get("origin");
  const allowedHosts = new Set<string>();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  if (host) allowedHosts.add(host);
  try {
    allowedHosts.add(new URL(site.url).host);
  } catch {
    /* site.url is not a valid URL: fall back to the request host only */
  }

  if (origin) {
    try {
      return allowedHosts.has(new URL(origin).host);
    } catch {
      return false;
    }
  }
  // No Origin header: accept only if the browser says the request is same-origin.
  const fetchSite = requestHeaders.get("sec-fetch-site");
  return !fetchSite || fetchSite === "same-origin";
}

export async function sendEnquiry(_previous: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const requestHeaders = await headers();

  if (!isSameOrigin(requestHeaders)) {
    return { status: "forbidden", message: "This request didn’t come from the site’s own contact form, so it was refused." };
  }

  // Honeypot: people never see this field. Pretend it worked so bots learn nothing.
  if (toEnquiryObject(formData).website.trim()) {
    redirect("/contact/thanks");
  }

  const parsed = parseEnquiry(formData);
  if (!parsed.ok) {
    return { status: "invalid", message: "Some details need attention.", fieldErrors: parsed.errors };
  }
  const enquiry = parsed.data;

  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
    return {
      status: "rate_limited",
      message: "That’s several messages in a short time. Please wait ten minutes and try again.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return {
      status: "unconfigured",
      message: "Online enquiries aren’t switched on yet, so this message wasn’t sent.",
    };
  }

  const details: [string, string][] = [
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Company", enquiry.company],
    ["Project type", enquiry.projectType],
    ["Budget", enquiry.budget],
    ["Timeline", enquiry.timeline],
    ["Estimator range", enquiry.estimate],
  ];
  const body = [
    ...details.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`),
    "",
    enquiry.message,
  ].join("\n");

  let failed: EnquiryState | null = null;
  try {
    const response = await fetch(process.env.RESEND_API_URL || DEFAULT_MAIL_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: enquiry.email,
        subject: `Project enquiry from ${enquiry.name}${enquiry.company ? ` (${enquiry.company})` : ""}`,
        text: body,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error("Enquiry email failed with status", response.status);
      failed = {
        status: "error",
        message: "The mail service returned an error, so your message wasn’t sent. Please try again in a moment.",
      };
    }
  } catch {
    console.error("Enquiry email request did not complete");
    failed = {
      status: "error",
      message: "We couldn’t reach the mail service, so your message wasn’t sent. Check your connection and try again.",
    };
  }
  if (failed) return failed;

  // Outside try/catch: redirect() works by throwing.
  redirect("/contact/thanks");
}
