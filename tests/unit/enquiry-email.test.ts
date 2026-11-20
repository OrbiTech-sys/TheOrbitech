import { describe, expect, it } from "vitest";
import { enquiryEmail, mailtoHref } from "@/lib/enquiry-email";
import type { EnquiryInput } from "@/lib/enquiry-schema";

const enquiry: EnquiryInput = {
  name: "Sam Tan",
  email: "sam@example.com",
  company: "Tan & Co",
  projectType: "Website",
  budget: "",
  timeline: "",
  message: "We need a new marketing site with a CMS.",
  estimate: "",
  website: "",
};

describe("enquiryEmail", () => {
  it("writes a subject naming the project type and sender", () => {
    expect(enquiryEmail(enquiry, "The OrbiTech Solutions").subject).toBe("Project Enquiry: Website | Sam Tan, Tan & Co");
    expect(enquiryEmail({ ...enquiry, projectType: "", company: "" }, "The OrbiTech Solutions").subject).toBe(
      "Project Enquiry: New Project | Sam Tan",
    );
  });

  it("writes a body ready to send, leaving out blank optional answers", () => {
    const { body } = enquiryEmail(enquiry, "The OrbiTech Solutions");
    expect(body.startsWith("Dear OrbiTech Solutions team,")).toBe(true);
    expect(body).toContain("Project type: Website");
    expect(body).toContain("We need a new marketing site with a CMS.");
    expect(body).toContain("Email: sam@example.com");
    expect(body).not.toContain("Budget:");
    expect(body.endsWith("Kind regards,\nSam Tan\nTan & Co")).toBe(true);
  });
});

describe("mailtoHref", () => {
  it("addresses the studio and keeps the subject and body intact", () => {
    const email = enquiryEmail(enquiry, "The OrbiTech Solutions");
    const url = new URL(mailtoHref("nova@theorbitechsolution.com", email));
    expect(url.protocol).toBe("mailto:");
    expect(url.pathname).toBe("nova@theorbitechsolution.com");
    expect(url.searchParams.get("subject")).toBe(email.subject);
    expect(url.searchParams.get("body")).toBe(email.body.replace(/\n/g, "\r\n"));
  });
});
