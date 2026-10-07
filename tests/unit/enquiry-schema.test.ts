import { describe, expect, it } from "vitest";
import { MAX, parseEnquiry, toEnquiryObject } from "@/lib/enquiry-schema";

const valid = {
  name: "Sam Tan",
  email: "Sam@Example.com",
  company: "Tan & Co",
  projectType: "Website",
  budget: "$10,000–$25,000",
  timeline: "Flexible",
  message: "We need a new marketing site with a CMS.",
  estimate: "",
  website: "",
};

describe("enquiry schema", () => {
  it("accepts a complete enquiry and normalises it", () => {
    const result = parseEnquiry(valid);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.email).toBe("sam@example.com");
  });

  it("accepts only the required fields", () => {
    const result = parseEnquiry({ name: "Sam", email: "sam@example.com", message: "A short project brief." });
    expect(result.ok).toBe(true);
  });

  it("explains each missing required field in plain words", () => {
    const result = parseEnquiry({});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toMatch(/enter your name/i);
      expect(result.errors.email).toMatch(/name@company\.com/);
      expect(result.errors.message).toMatch(/at least 10 characters/);
    }
  });

  it.each(["not-an-email", "a@b", "a b@c.com", "@example.com", "a@@example.com", "<x>@example.com"])(
    "rejects the email %s",
    (email) => {
      const result = parseEnquiry({ ...valid, email });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors.email).toBeDefined();
    },
  );

  it("treats whitespace-only values as empty", () => {
    const result = parseEnquiry({ ...valid, name: "   ", message: "          " });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeDefined();
      expect(result.errors.message).toBeDefined();
    }
  });

  it("rejects options that are not in the lists", () => {
    const result = parseEnquiry({ ...valid, projectType: "Hack the planet", budget: "a lot" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.projectType).toBeDefined();
      expect(result.errors.budget).toBeDefined();
    }
  });

  it("enforces maximum lengths", () => {
    expect(parseEnquiry({ ...valid, name: "x".repeat(MAX.name + 1) }).ok).toBe(false);
    expect(parseEnquiry({ ...valid, message: "x".repeat(MAX.message + 1) }).ok).toBe(false);
    expect(parseEnquiry({ ...valid, message: "x".repeat(MAX.message) }).ok).toBe(true);
  });

  it("strips control characters but keeps line breaks", () => {
    const result = parseEnquiry({ ...valid, message: "Line one\u0000\u0007\nLine two is here" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.message).toBe("Line one\nLine two is here");
  });

  it("ignores fields it does not know about", () => {
    const form = new FormData();
    form.set("name", "Sam");
    form.set("admin", "true");
    const picked = toEnquiryObject(form);
    expect(picked).not.toHaveProperty("admin");
    expect(picked.name).toBe("Sam");
    expect(picked.email).toBe("");
  });

  it("ignores file uploads in text fields", () => {
    const form = new FormData();
    form.set("name", new File(["x"], "x.txt"));
    expect(toEnquiryObject(form).name).toBe("");
  });
});
