import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Message sent",
  description: "Thanks for getting in touch.",
  path: "/contact/thanks",
  noindex: true,
});

export default function ThanksPage() {
  return (
    <>
      <PageIntro title="Message sent" lede="Thank you. We’ll reply by email to the address you gave." />
      <section className="section section--tight" aria-label="Next steps">
        <div className="wrap prose">
          <p>Until then, you can look through recent work or read how a project runs.</p>
          <p>
            <Link href="/work" className="ulink">
              See our work
            </Link>
            {"  ·  "}
            <Link href="/services" className="ulink">
              How we work
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
