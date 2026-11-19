import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/ui/ServiceCard";
import { coreCategories } from "@/content/offerings";

export default function ServicesOverview() {
  return (
    <section className="section" aria-labelledby="services-title">
      <div className="wrap">
        <SectionHeading
          eyebrow="What we build"
          title="Four ways we turn complexity into working software"
          lede="From AI agents to analytics dashboards, each service is scoped around your goals and the tools you already use."
          id="services-title"
        />
        <div className="grid grid--2 services-grid">
          {coreCategories.map((category) => (
            <ServiceCard key={category.slug} category={category} />
          ))}
        </div>
        <p className="section-more">
          <Link href="/services" className="link-arrow">
            See all six service areas <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
