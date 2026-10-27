import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";

// The thank-you page is a dead end for search: no canonical, no social tags, not indexed.
export const metadata: Metadata = {
  title: "Message sent",
  robots: { index: false, follow: true },
};

export default function ThanksPage() {
  return (
    <>
      <PageIntro title="Message sent" lede="Thank you. We’ll reply by email to the address you gave." />
      <section className="wrap" aria-label="Next steps">
        <div className="prose">
          <p>Until then, you can look through recent work or read how a project runs.</p>
          <p>
            <Link href="/work">See our work</Link>
            {"  ·  "}
            <Link href="/services">How we work</Link>
          </p>
        </div>
      </section>
    </>
  );
}
