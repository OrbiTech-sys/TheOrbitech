import Link from "next/link";
import { ArrowRight } from "lucide-react";
import IndustryCard from "@/components/ui/IndustryCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { industryPages } from "@/content/industries";

export default function IndustriesGrid() {
  return (
    <section className="section" aria-labelledby="industries-title">
      <div className="wrap">
        <SectionHeading
          eyebrow="Industries"
          title="Practical solutions for the way your industry works"
          lede="Every sector has its own bottlenecks. See how AI and software can address them, and where we have demos."
          id="industries-title"
        />
        <div className="grid grid--3">
          {industryPages.map((industry) => (
            <IndustryCard key={industry.slug} industry={industry} />
          ))}
          <article className="card card--link card--cta reveal">
            <h3 className="card__title">
              <Link href="/contact" className="card__stretch">
                Your industry not listed?
              </Link>
            </h3>
            <p className="card__text">Tell us about your business and the problem you want solved. We will say honestly whether we can help.</p>
            <span className="card__foot link-arrow">
              Get in touch <ArrowRight size={16} aria-hidden="true" />
            </span>
          </article>
        </div>
      </div>
    </section>
  );
}
