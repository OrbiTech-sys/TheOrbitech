import type { Metadata } from "next";
import ClosingCta from "@/components/ClosingCta";
import PageIntro from "@/components/PageIntro";
import WorkIndex from "@/components/WorkIndex";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Work: Restaurant, Salon, AI and SaaS Demos",
  description:
    "Live demos of custom restaurant websites, a hair salon website, an AI voice receptionist and SaaS products by OrbiTech. Open any demo and read how it was built.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageIntro
        title="Live demos and projects"
        lede="Restaurant and salon websites, an AI voice receptionist and SaaS products. Open a demo to try it, or read the case study for the brief and how we built it."
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
