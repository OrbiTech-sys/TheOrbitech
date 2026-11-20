import type { Metadata } from "next";
import Link from "next/link";
import { pageImages } from "@/content/site";
import PageIntro from "@/components/PageIntro";

// The thank-you page is a dead end for search: no canonical, no social tags, not indexed.
export const metadata: Metadata = {
  title: "Message sent",
  robots: { index: false, follow: true },
};

export default function ThanksPage() {
  return (
    <>
      <PageIntro image={pageImages.legal} eyebrow="Inquiry received" title="Message sent" lede="Thank you. We’ll reply by email to the address you gave." />
      <section className="section section--tight" aria-label="Next steps">
        <div className="wrap wrap--narrow">
          <div className="prose">
            <p>Until then, you can look through recent work or read how a project runs.</p>
            <p>
              <Link href="/work">See our work</Link>
              {"  ·  "}
              <Link href="/services">How we work</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
