import type { Metadata } from "next";
import ClosingCta from "@/components/ClosingCta";
import PageIntro from "@/components/PageIntro";
import WorkIndex from "@/components/WorkIndex";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description: "Websites, web apps and AI tools we have built, each with the brief, our approach and a link to the live site.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageIntro
        title="Selected work"
        lede="Each project links to the live site and to a short case study: the brief, what we did and what we used."
      />
      <section className="section section--tight" aria-label="Projects">
        <div className="wrap">
          <WorkIndex />
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
