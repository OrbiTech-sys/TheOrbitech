"use server";

import { cookies, headers } from "next/headers";
import { after } from "next/server";
import {
  ACCESS_COOKIE,
  ACCESS_TTL_MS,
  CHALLENGE_COOKIE,
  CODE_TTL_MS,
  MAX_ATTEMPTS,
  challengeNonce,
  checkChallenge,
  createAccess,
  createChallenge,
  guessesUsed,
  isSpent,
  markSpent,
  normaliseCode,
  recordWrongGuess,
  secretKey,
} from "@/lib/demo-access";
import { findDemo } from "@/lib/demos";
import { clientIp, isSameOrigin, overLimit } from "@/lib/guards";
import { mailConfigured, sendCodeEmail, sendOwnerNote } from "@/lib/mailer";

export interface CodeRequestState {
  status: "idle" | "sent" | "invalid" | "rate_limited" | "unconfigured" | "error" | "forbidden";
  message: string;
  /** The address the code was sent to, so the next step can show it */
  email?: string;
}

export interface CodeCheckState {
  status: "idle" | "verified" | "invalid" | "wrong" | "expired" | "locked" | "unconfigured" | "forbidden";
  message: string;
}

const WINDOW_MS = 10 * 60 * 1000;
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
const CONTROL_RE = /[\u0000-\u001F\u007F]/g;

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function requestDemoCode(_previous: CodeRequestState, formData: FormData): Promise<CodeRequestState> {
  const requestHeaders = await headers();
  if (!isSameOrigin(requestHeaders)) {
    return { status: "forbidden", message: "This request didn’t come from the site’s own page, so it was refused." };
  }

  const email = String(formData.get("email") ?? "")
    .replace(CONTROL_RE, "")
    .trim()
    .toLowerCase();

  // Honeypot: people never see this field. Say "sent" so bots learn nothing.
  if (String(formData.get("website") ?? "").trim()) {
    return { status: "sent", message: "", email };
  }

  if (!findDemo(String(formData.get("demo") ?? ""))) {
    return { status: "invalid", message: "That demo doesn’t exist. Go back and choose one from the list." };
  }
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return { status: "invalid", message: "Enter an email address like name@company.com." };
  }

  if (!secretKey() || !mailConfigured()) {
    return { status: "unconfigured", message: "Email confirmation isn’t switched on yet, so we couldn’t send a code." };
  }

  if (overLimit("code-ip", clientIp(requestHeaders), WINDOW_MS, 8) || overLimit("code-email", email, WINDOW_MS, 3)) {
    return { status: "rate_limited", message: "That’s several codes in a short time. Please wait ten minutes and try again." };
  }
  if (overLimit("code-cooldown", email, 30_000, 1)) {
    return { status: "rate_limited", message: "A code was just sent. Please wait 30 seconds before asking for another." };
  }

  const challenge = createChallenge(email);
  if (!challenge) {
    return { status: "unconfigured", message: "Email confirmation isn’t switched on yet, so we couldn’t send a code." };
  }

  const sent = await sendCodeEmail(email, challenge.code);
  if (!sent.ok) {
    return { status: "error", message: "We couldn’t send the email. Check the address and try again in a moment." };
  }

  const jar = await cookies();
  jar.set(CHALLENGE_COOKIE, challenge.cookie, { ...cookieBase, maxAge: CODE_TTL_MS / 1000 });
  return { status: "sent", message: "", email };
}

export async function verifyDemoCode(_previous: CodeCheckState, formData: FormData): Promise<CodeCheckState> {
  const requestHeaders = await headers();
  if (!isSameOrigin(requestHeaders)) {
    return { status: "forbidden", message: "This request didn’t come from the site’s own page, so it was refused." };
  }

  const entry = findDemo(String(formData.get("demo") ?? ""));
  const code = normaliseCode(String(formData.get("code") ?? ""));
  if (!entry || !code) {
    return { status: "invalid", message: "Enter the 6-digit code from the email." };
  }
  if (overLimit("verify-ip", clientIp(requestHeaders), WINDOW_MS, 30)) {
    return { status: "locked", message: "Too many attempts from this connection. Please wait ten minutes and try again." };
  }
  if (!secretKey()) {
    return { status: "unconfigured", message: "Email confirmation isn’t switched on yet." };
  }

  const jar = await cookies();
  const challengeCookie = jar.get(CHALLENGE_COOKIE)?.value;
  const nonce = challengeNonce(challengeCookie);

  if (nonce && (guessesUsed(nonce) >= MAX_ATTEMPTS || isSpent(nonce))) {
    jar.delete(CHALLENGE_COOKIE);
    return { status: "locked", message: "That code can’t be used any more. Ask for a new one." };
  }

  const result = checkChallenge(challengeCookie, code);
  if (!result.ok) {
    if (result.reason === "wrong" && nonce) {
      const used = recordWrongGuess(nonce);
      if (used >= MAX_ATTEMPTS) {
        jar.delete(CHALLENGE_COOKIE);
        return { status: "locked", message: "Too many wrong codes. Ask for a new one." };
      }
      return { status: "wrong", message: `That code isn’t right. ${MAX_ATTEMPTS - used} ${MAX_ATTEMPTS - used === 1 ? "try" : "tries"} left.` };
    }
    jar.delete(CHALLENGE_COOKIE);
    return {
      status: "expired",
      message: result.reason === "expired" ? "That code has expired. Ask for a new one." : "We don’t have a code waiting for this browser. Ask for a new one.",
    };
  }

  markSpent(result.nonce);
  const access = createAccess(result.email);
  if (!access) return { status: "unconfigured", message: "Email confirmation isn’t switched on yet." };

  jar.delete(CHALLENGE_COOKIE);
  jar.set(ACCESS_COOKIE, access, { ...cookieBase, maxAge: ACCESS_TTL_MS / 1000 });
  after(() => sendOwnerNote(result.email, entry.demo.name));
  return { status: "verified", message: "" };
}
