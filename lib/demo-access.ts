import "server-only";
import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

/**
 * Email confirmation for opening a demo, with no database.
 *
 * Requesting a code puts a signed "challenge" in a cookie: who asked, when it
 * expires and a keyed hash of the code. The code itself is only in the email.
 * Entering the right code swaps the challenge for a signed "access" cookie that
 * lasts 24 hours. Both cookies are signed with OTP_SECRET, so they cannot be
 * forged or edited in the browser.
 */

export const CHALLENGE_COOKIE = "oc_challenge";
export const ACCESS_COOKIE = "oc_access";
export const CODE_TTL_MS = 10 * 60 * 1000;
export const ACCESS_TTL_MS = 24 * 60 * 60 * 1000;
export const MAX_ATTEMPTS = 5;
export const CODE_LENGTH = 6;

export function secretKey(): string | null {
  const value = process.env.OTP_SECRET;
  return value && value.length >= 32 ? value : null;
}

const b64 = (value: string) => Buffer.from(value, "utf8").toString("base64url");
const unb64 = (value: string) => Buffer.from(value, "base64url").toString("utf8");

function mac(secret: string, ...parts: (string | number)[]): string {
  return createHmac("sha256", secret).update(parts.join("\n")).digest("base64url");
}

function same(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function newCode(): string {
  return randomInt(0, 10 ** CODE_LENGTH).toString().padStart(CODE_LENGTH, "0");
}

/** The six digits as typed: spaces and dashes are allowed, anything else is not. */
export function normaliseCode(input: string): string | null {
  const digits = input.replace(/[\s-]/g, "");
  return new RegExp(`^\\d{${CODE_LENGTH}}$`).test(digits) ? digits : null;
}

/* ── Challenge: "this browser asked for a code for this email" ───────────── */

export interface Challenge {
  code: string;
  cookie: string;
  nonce: string;
}

export function createChallenge(email: string, now = Date.now()): Challenge | null {
  const secret = secretKey();
  if (!secret) return null;
  const code = newCode();
  const nonce = randomBytes(12).toString("base64url");
  const expires = now + CODE_TTL_MS;
  const body = b64(JSON.stringify({ e: email, n: nonce, x: expires }));
  return { code, nonce, cookie: `${body}.${mac(secret, "challenge", email, nonce, expires, code)}` };
}

export type ChallengeResult =
  | { ok: true; email: string; nonce: string }
  | { ok: false; reason: "missing" | "malformed" | "expired" | "wrong" };

export function checkChallenge(cookie: string | undefined, code: string, now = Date.now()): ChallengeResult {
  const secret = secretKey();
  if (!cookie || !secret) return { ok: false, reason: "missing" };
  const [body, signature] = cookie.split(".");
  if (!body || !signature) return { ok: false, reason: "malformed" };

  let parsed: { e?: unknown; n?: unknown; x?: unknown };
  try {
    parsed = JSON.parse(unb64(body));
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (typeof parsed.e !== "string" || typeof parsed.n !== "string" || typeof parsed.x !== "number") {
    return { ok: false, reason: "malformed" };
  }
  if (parsed.x < now) return { ok: false, reason: "expired" };
  if (!same(signature, mac(secret, "challenge", parsed.e, parsed.n, parsed.x, code))) return { ok: false, reason: "wrong" };
  return { ok: true, email: parsed.e, nonce: parsed.n };
}

/** The nonce inside a challenge cookie, without checking the code. Used to count wrong guesses. */
export function challengeNonce(cookie: string | undefined): string | null {
  if (!cookie) return null;
  try {
    const parsed = JSON.parse(unb64(cookie.split(".")[0] ?? ""));
    return typeof parsed.n === "string" ? parsed.n : null;
  } catch {
    return null;
  }
}

/* ── Access: "this browser has confirmed this email" ─────────────────────── */

export function createAccess(email: string, now = Date.now()): string | null {
  const secret = secretKey();
  if (!secret) return null;
  const expires = now + ACCESS_TTL_MS;
  return `${b64(JSON.stringify({ e: email, x: expires }))}.${mac(secret, "access", email, expires)}`;
}

/** The confirmed email, or null when the cookie is missing, forged or out of date. */
export function checkAccess(cookie: string | undefined, now = Date.now()): string | null {
  const secret = secretKey();
  if (!cookie || !secret) return null;
  const [body, signature] = cookie.split(".");
  if (!body || !signature) return null;
  try {
    const parsed = JSON.parse(unb64(body));
    if (typeof parsed.e !== "string" || typeof parsed.x !== "number" || parsed.x < now) return null;
    return same(signature, mac(secret, "access", parsed.e, parsed.x)) ? parsed.e : null;
  } catch {
    return null;
  }
}

/* ── Wrong guesses and spent codes (per instance) ────────────────────────── */

const guesses = new Map<string, number>();
const spent = new Set<string>();

export function guessesUsed(nonce: string): number {
  return guesses.get(nonce) ?? 0;
}

export function recordWrongGuess(nonce: string): number {
  const used = (guesses.get(nonce) ?? 0) + 1;
  guesses.set(nonce, used);
  if (guesses.size > 4000) guesses.clear();
  return used;
}

export function isSpent(nonce: string): boolean {
  return spent.has(nonce);
}

export function markSpent(nonce: string): void {
  spent.add(nonce);
  if (spent.size > 4000) spent.clear();
}
