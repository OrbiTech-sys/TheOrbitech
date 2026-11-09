import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { CODE_TTL_MS } from "@/lib/demo-access";

/**
 * SMTP mail for the demo verification flow. Set these in the host's environment
 * (see .env.example): SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.
 *
 * The code email is deliberately plain: a short text part, a minimal HTML part,
 * no images, no links, no tracking. That is what keeps one-time codes out of spam.
 */

const OWNER_DEFAULT = "msubhanbutt10@gmail.com";
const BRAND = "OrbiTech";

export function ownerEmail(): string {
  return process.env.OWNER_EMAIL || OWNER_DEFAULT;
}

export function mailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

let cached: Transporter | null = null;

function transport(): Transporter {
  if (cached) return cached;
  const port = Number(process.env.SMTP_PORT || 587);
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // Port 465 starts encrypted. Port 587 upgrades with STARTTLS, which Nodemailer requires.
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return cached;
}

/** The sender must be an address the SMTP account is allowed to send as. */
function from(): { name: string; address: string } {
  const configured = process.env.SMTP_FROM || process.env.SMTP_USER || OWNER_DEFAULT;
  const match = configured.match(/^\s*(?:"?([^"<]*?)"?\s*)?<([^>]+)>\s*$/);
  return match ? { name: match[1]?.trim() || BRAND, address: match[2].trim() } : { name: BRAND, address: configured.trim() };
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function codeEmail(code: string) {
  const minutes = Math.round(CODE_TTL_MS / 60_000);
  const text = [
    "Hello,",
    "",
    `Your ${BRAND} verification code is ${code}.`,
    "",
    `Enter it on the demo page to open the demo. The code works for ${minutes} minutes.`,
    "",
    "If you did not ask for this, you can ignore this email. Nobody can open the demo without the code.",
    "",
    BRAND,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${BRAND} verification code</title></head>
<body style="margin:0;padding:24px;background:#ffffff;color:#222222;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;">
<p style="margin:0 0 16px;">Hello,</p>
<p style="margin:0 0 8px;">Your ${BRAND} verification code is:</p>
<p style="margin:0 0 16px;font-size:30px;font-weight:bold;letter-spacing:6px;">${escapeHtml(code)}</p>
<p style="margin:0 0 16px;">Enter it on the demo page to open the demo. The code works for ${minutes} minutes.</p>
<p style="margin:0 0 16px;">If you did not ask for this, you can ignore this email. Nobody can open the demo without the code.</p>
<p style="margin:0;">${BRAND}</p>
</body></html>`;

  return { subject: `Your ${BRAND} verification code: ${code}`, text, html };
}

export type SendResult = { ok: true } | { ok: false };

export async function sendCodeEmail(to: string, code: string): Promise<SendResult> {
  if (!mailConfigured()) return { ok: false };

  const sender = from();
  const replyTo = ownerEmail();
  const message = codeEmail(code);
  try {
    await transport().sendMail({
      from: sender,
      to,
      ...(replyTo.toLowerCase() !== sender.address.toLowerCase() ? { replyTo } : {}),
      subject: message.subject,
      text: message.text,
      html: message.html,
      headers: { "Auto-Submitted": "auto-generated", "X-Auto-Response-Suppress": "All" },
    });
    return { ok: true };
  } catch (error) {
    console.error("Verification email failed:", error instanceof Error ? error.message : "unknown error");
    return { ok: false };
  }
}

/** Tells the owner who confirmed an email to open which demo. Best effort: never blocks the visitor. */
export async function sendOwnerNote(visitor: string, demoName: string): Promise<void> {
  if (!mailConfigured()) return;
  const sender = from();
  try {
    await transport().sendMail({
      from: sender,
      to: ownerEmail(),
      replyTo: visitor,
      subject: `Demo opened: ${demoName}`,
      text: [`Someone confirmed their email to open a demo.`, "", `Email: ${visitor}`, `Demo: ${demoName}`, `Time: ${new Date().toUTCString()}`].join("\n"),
      headers: { "Auto-Submitted": "auto-generated" },
    });
  } catch (error) {
    console.error("Owner note failed:", error instanceof Error ? error.message : "unknown error");
  }
}

/* ── Contact form ─────────────────────────────────────────────────────────── */

const CONTACT_DEFAULT = "subhan.orbitech@gmail.com";

/** The inbox that receives contact-form messages. */
export function contactRecipient(): string {
  return process.env.CONTACT_TO_EMAIL || CONTACT_DEFAULT;
}

/**
 * Sends one contact-form message from the SMTP mailbox to the contact inbox.
 * Reply-To is the visitor, so answering the email goes straight to them.
 */
export async function sendEnquiryEmail({ subject, text, replyTo }: { subject: string; text: string; replyTo: string }): Promise<SendResult> {
  if (!mailConfigured()) return { ok: false };
  try {
    await transport().sendMail({
      from: from(),
      to: contactRecipient(),
      replyTo,
      subject,
      text,
    });
    return { ok: true };
  } catch (error) {
    console.error("Enquiry email failed:", error instanceof Error ? error.message : "unknown error");
    return { ok: false };
  }
}
