import { describe, expect, it, vi } from "vitest";
import {
  CODE_TTL_MS,
  checkAccess,
  checkChallenge,
  createAccess,
  createChallenge,
  normaliseCode,
} from "@/lib/demo-access";
import { allDemos, findDemo } from "@/lib/demos";
import { demoTarget } from "@/lib/demo-targets";
import { codeEmail } from "@/lib/mailer";
import { projects } from "@/content/site";

describe("email codes", () => {
  it("accepts the right code and rejects every other one", () => {
    const challenge = createChallenge("visitor@example.com")!;
    expect(challenge.code).toMatch(/^\d{6}$/);
    const ok = checkChallenge(challenge.cookie, challenge.code);
    expect(ok).toMatchObject({ ok: true, email: "visitor@example.com" });
    const other = challenge.code === "000000" ? "000001" : "000000";
    expect(checkChallenge(challenge.cookie, other)).toEqual({ ok: false, reason: "wrong" });
  });

  it("expires after ten minutes", () => {
    const now = Date.now();
    const challenge = createChallenge("visitor@example.com", now)!;
    expect(checkChallenge(challenge.cookie, challenge.code, now + CODE_TTL_MS - 1000).ok).toBe(true);
    expect(checkChallenge(challenge.cookie, challenge.code, now + CODE_TTL_MS + 1000)).toEqual({ ok: false, reason: "expired" });
  });

  it("does not put the code in the cookie, and rejects an edited cookie", () => {
    const challenge = createChallenge("visitor@example.com")!;
    expect(Buffer.from(challenge.cookie.split(".")[0], "base64url").toString()).not.toContain(challenge.code);

    const [body, signature] = challenge.cookie.split(".");
    const edited = JSON.parse(Buffer.from(body, "base64url").toString());
    edited.e = "someone-else@example.com";
    const forged = `${Buffer.from(JSON.stringify(edited)).toString("base64url")}.${signature}`;
    expect(checkChallenge(forged, challenge.code).ok).toBe(false);
    expect(checkChallenge("garbage", challenge.code).ok).toBe(false);
    expect(checkChallenge(undefined, challenge.code)).toEqual({ ok: false, reason: "missing" });
  });

  it("normalises typed codes", () => {
    expect(normaliseCode("123 456")).toBe("123456");
    expect(normaliseCode("123-456")).toBe("123456");
    expect(normaliseCode("12345")).toBeNull();
    expect(normaliseCode("12345a")).toBeNull();
    expect(normaliseCode("1234567")).toBeNull();
  });
});

describe("demo access cookie", () => {
  it("lasts a day, then stops working", () => {
    const now = Date.now();
    const cookie = createAccess("visitor@example.com", now)!;
    expect(checkAccess(cookie, now + 60_000)).toBe("visitor@example.com");
    expect(checkAccess(cookie, now + 25 * 60 * 60 * 1000)).toBeNull();
  });

  it("cannot be forged or swapped for a challenge cookie", () => {
    const cookie = createAccess("visitor@example.com")!;
    const [body] = cookie.split(".");
    expect(checkAccess(`${body}.forged`)).toBeNull();
    expect(checkAccess(undefined)).toBeNull();
    const challenge = createChallenge("visitor@example.com")!;
    expect(checkAccess(challenge.cookie)).toBeNull();
  });
});

describe("demos", () => {
  it("has an address for every demo, and the addresses never appear in public content", () => {
    const entries = allDemos();
    expect(entries.length).toBeGreaterThanOrEqual(5);
    const publicJson = JSON.stringify(projects);
    for (const { demo } of entries) {
      const target = demoTarget(demo.id);
      expect(target, demo.id).toMatch(/^https:\/\//);
      expect(publicJson).not.toContain(new URL(target!).host);
      expect(findDemo(demo.id)?.demo).toBe(demo);
    }
    expect(demoTarget("not-a-demo")).toBeNull();
    expect(demoTarget("__proto__")).toBeNull();
  });

  it("gives every demo a unique id", () => {
    const ids = allDemos().map(({ demo }) => demo.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("code email", () => {
  it("is short, plain and has no links or images", () => {
    const message = codeEmail("482913");
    expect(message.subject).toContain("482913");
    expect(message.subject.length).toBeLessThan(60);
    for (const part of [message.text, message.html]) {
      expect(part).toContain("482913");
      expect(part).not.toMatch(/https?:\/\//i);
      expect(part).not.toMatch(/<img|<a\s|<script|<link/i);
    }
    expect(message.subject + message.text).not.toMatch(/[!]|free|winner|urgent|click/i);
  });
});

describe("code email as sent", () => {
  it("goes out as plain text plus a simple HTML alternative, marked as automatic", async () => {
    const { default: nodemailer } = await import("nodemailer");
    const message = codeEmail("482913");
    const transport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: "unix" });
    const info = await transport.sendMail({
      from: { name: "OrbiTech", address: "sender@example.com" },
      to: "visitor@example.com",
      subject: message.subject,
      text: message.text,
      html: message.html,
      headers: { "Auto-Submitted": "auto-generated" },
    });
    const raw = (info as unknown as { message: Buffer }).message.toString();
    expect(raw).toMatch(/Content-Type: multipart\/alternative/);
    expect(raw.indexOf("text/plain")).toBeLessThan(raw.indexOf("text/html"));
    expect(raw).toMatch(/^From: OrbiTech <sender@example.com>/m);
    expect(raw).toMatch(/^Auto-Submitted: auto-generated/m);
    expect(raw).not.toMatch(/List-Unsubscribe/i);
  });
});

describe("contact form mail", () => {
  it("goes to the contact inbox from the SMTP mailbox, with the visitor as Reply-To", async () => {
    const sendMail = vi.fn().mockResolvedValue({});
    vi.resetModules();
    vi.doMock("nodemailer", () => ({ default: { createTransport: () => ({ sendMail }) } }));
    vi.stubEnv("SMTP_HOST", "smtp.example.test");
    vi.stubEnv("SMTP_USER", "sender@example.test");
    vi.stubEnv("SMTP_PASS", "secret");
    vi.stubEnv("SMTP_FROM", "The OrbiTech Solutions <sender@example.test>");
    vi.stubEnv("CONTACT_TO_EMAIL", "");

    const { sendEnquiryEmail, contactRecipient } = await import("@/lib/mailer");
    expect(contactRecipient()).toBe("subhan.orbitech@gmail.com");
    const result = await sendEnquiryEmail({ subject: "Project enquiry from Sam", text: "Name: Sam", replyTo: "sam@example.com" });

    expect(result).toEqual({ ok: true });
    expect(sendMail).toHaveBeenCalledWith({
      from: { name: "The OrbiTech Solutions", address: "sender@example.test" },
      to: "subhan.orbitech@gmail.com",
      replyTo: "sam@example.com",
      subject: "Project enquiry from Sam",
      text: "Name: Sam",
    });
    vi.unstubAllEnvs();
    vi.doUnmock("nodemailer");
  });

  it("sends nothing when SMTP is not set up", async () => {
    vi.resetModules();
    vi.stubEnv("SMTP_HOST", "");
    vi.stubEnv("SMTP_USER", "");
    vi.stubEnv("SMTP_PASS", "");
    const { sendEnquiryEmail } = await import("@/lib/mailer");
    expect(await sendEnquiryEmail({ subject: "x", text: "y", replyTo: "a@b.co" })).toEqual({ ok: false });
    vi.unstubAllEnvs();
  });
});
