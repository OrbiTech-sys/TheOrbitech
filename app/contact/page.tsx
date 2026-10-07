import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import PageIntro from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Start a project or book a 30-minute call. We reply by email.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageIntro
        title="Start a project"
        lede="Tell us what you want to build, or book a short call. Either way, a person reads it and replies by email."
      />
      <ContactSection />
    </>
  );
}
